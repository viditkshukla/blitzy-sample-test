/**
 * Startup Log Verification Script
 *
 * Runnable form of the acceptance criteria for the server's startup announcement:
 * the HTTP listener prints `Server listening at http://<host>:<port>` on standard
 * output when it starts, unconditionally, including under `NODE_ENV=test`. Every
 * check spawns the real application and reads what the process writes; no check
 * inspects source code.
 *
 * Run from `src/backend` with `node scripts/verify-startup-log.js`
 * (`npm run verify:startup` reaches the same script). One PASS/FAIL line is printed
 * per check, and the exit status is 0 only when all six pass. This is not a Jest
 * suite and is never collected as one.
 *
 * @module verify-startup-log
 */

// Node.js core modules only: the tool must run with nothing installed
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

// The application resolves its .env file and its entry point from src/backend
const BACKEND_DIR = path.resolve(__dirname, '..');

// The notice config.js writes on stdout when no .env file is present
const ENV_NOTICE = 'No .env file found or unable to read it. '
  + 'Using default values and environment variables.';

// The startup line under test, exactly as the listener writes it
const STARTUP_LINE_BOUND = 'Server listening at http://127.0.0.1:3100';
const STARTUP_LINE_DEFAULT = 'Server listening at http://0.0.0.0:3000';
const STARTUP_LINE_DEVELOPMENT = 'Server listening at http://127.0.0.1:31002';
const STARTUP_LINE_CONFLICT = 'Server listening at http://127.0.0.1:31003';

// Under NODE_ENV=test index.js does not run main(), so the listener starts in-process
const IN_PROCESS_ARGS = ['-e', "require('./server').startServer();"];
const ENTRY_POINT_ARGS = ['index.js'];

// Addresses named by the criteria, never substituted: the defaults run needs the
// configuration default, and an occupied address must surface as the check failing
const TEST_PORT = 3100;
const DEVELOPMENT_PORT = 31002;
const CONFLICT_PORT = 31003;

// Every wait is bounded, so a stuck child fails its check instead of blocking the run
const OUTPUT_TIMEOUT_MS = 10000;
const EXIT_TIMEOUT_MS = 10000;
const REQUEST_TIMEOUT_MS = 5000;
const KILL_GRACE_MS = 1500;
const OVERALL_TIMEOUT_MS = 180000;

// Timestamp-tolerant logger prefix, matching `[2026-11-05T06:13:11.596Z]`
const LOG_PREFIX = '\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z\\]';
const LOG_RECORD = new RegExp(`^${LOG_PREFIX} (INFO|WARN|ERROR): `);

// Every spawned child, so an unexpected failure still leaves no process behind
const liveChildren = new Set();

/**
 * Escapes a literal string for use inside a regular expression
 *
 * @param {string} text - Literal text to escape
 * @returns {string} Text safe to embed in a pattern
 */
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a pattern that matches one whole output line
 *
 * @param {string} text - Exact line content
 * @returns {RegExp} Anchored pattern for that line
 */
function exactLine(text) {
  return new RegExp(`^${escapeRegExp(text)}$`);
}

/**
 * Builds a pattern for one timestamped logger record
 *
 * @param {string} level - Logger level (INFO, WARN, ERROR)
 * @param {string} messagePattern - Pattern for the message that follows the level
 * @returns {RegExp} Anchored pattern for the record
 */
function logRecord(level, messagePattern) {
  return new RegExp(`^${LOG_PREFIX} ${level}: ${messagePattern}$`);
}

/**
 * Builds the pattern for a per-request record: `<method> <url> <status> <n>ms`
 *
 * @param {string} level - Logger level the record is written at
 * @param {string} method - HTTP method
 * @param {string} requestPath - Request path as it appears in the record
 * @param {number} statusCode - Response status code
 * @returns {RegExp} Anchored pattern for the record
 */
function requestLogRecord(level, method, requestPath, statusCode) {
  const messagePattern = `${method} ${escapeRegExp(requestPath)} ${statusCode} \\d+ms`;
  return logRecord(level, messagePattern);
}

// The main() startup message, the completion message, and the two records the
// address-in-use path writes to stderr
const STARTING_RECORD = logRecord('INFO', 'Starting Node\\.js Hello World application\\.\\.\\.');
const COMPLETE_RECORD = logRecord('INFO', 'Application startup complete\\.');
const ADDRESS_IN_USE = `listen EADDRINUSE: address already in use 127.0.0.1:${CONFLICT_PORT}`;
const SERVER_ERROR_RECORD = logRecord('ERROR', escapeRegExp(`Server error: ${ADDRESS_IN_USE}`));
const FAILED_START_RECORD = logRecord(
  'ERROR',
  escapeRegExp(`Failed to start application: ${ADDRESS_IN_USE}`)
);

/**
 * Splits captured output into its non-empty lines
 *
 * @param {string} text - Captured stream content
 * @returns {Array<string>} Non-empty lines, in order
 */
function nonEmptyLines(text) {
  return text.split('\n').map((line) => line.replace(/\r$/, '')).filter((line) => line !== '');
}

/**
 * Reports whether a captured stream holds a line matching a pattern
 *
 * @param {string} text - Captured stream content
 * @param {RegExp} pattern - Pattern to look for
 * @returns {boolean} True when at least one non-empty line matches
 */
function hasLine(text, pattern) {
  return nonEmptyLines(text).some((line) => pattern.test(line));
}

/**
 * Terminates every child that is still running
 */
function killLiveChildren() {
  liveChildren.forEach((child) => {
    try {
      child.kill('SIGKILL');
    } catch (err) {
      // The child is already gone, so there is nothing left to terminate
    }
  });
}

/**
 * Spawns the application and returns a handle over its output and lifecycle
 *
 * Each scenario's environment is built from a copy of the parent's, so a value the
 * scenario does not name still applies, while the ones it names as deleted are
 * removed outright and cannot leak in from the invoking shell.
 *
 * @param {Array<string>} args - Arguments for the Node binary; passed without a shell
 * @param {Object} envOverrides - Environment variables to set for the child
 * @param {Array<string>} deletedVars - Environment variables to delete for the child
 * @returns {Object} Handle exposing the captured streams and the lifecycle waits
 */
function spawnServer(args, envOverrides = {}, deletedVars = []) {
  const env = { ...process.env };
  Object.keys(envOverrides).forEach((name) => {
    env[name] = envOverrides[name];
  });
  deletedVars.forEach((name) => {
    delete env[name];
  });

  const child = spawn(process.execPath, args, {
    cwd: BACKEND_DIR,
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  liveChildren.add(child);

  const watchers = [];
  const handle = {
    child,
    stdout: '',
    stderr: '',
    exited: false,
    exitCode: null
  };

  /**
   * Wakes every pending wait so it re-examines the captured output
   */
  function notifyWatchers() {
    watchers.slice().forEach((watcher) => watcher());
  }

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (chunk) => {
    handle.stdout += chunk;
    notifyWatchers();
  });

  child.stderr.on('data', (chunk) => {
    handle.stderr += chunk;
    notifyWatchers();
  });

  child.on('error', () => {
    handle.exited = true;
    liveChildren.delete(child);
    notifyWatchers();
  });

  child.on('exit', (code) => {
    handle.exited = true;
    handle.exitCode = code;
    liveChildren.delete(child);
    notifyWatchers();
  });

  /**
   * Waits until a predicate over the captured output holds
   *
   * @param {Function} predicate - Called with the handle on every output change
   * @param {number} timeoutMs - Bound for the wait
   * @param {string} label - What the wait is for, used in the failure message
   * @returns {Promise<Object>} Resolves with the handle
   */
  handle.waitFor = (predicate, timeoutMs, label) => new Promise((resolve, reject) => {
    let settled = false;

    function settle(err) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const index = watchers.indexOf(watcher);
      if (index !== -1) watchers.splice(index, 1);
      if (err) reject(err);
      else resolve(handle);
    }

    function watcher() {
      if (settled) return;
      if (predicate(handle)) {
        settle(null);
      } else if (handle.exited) {
        settle(new Error(`process exited with code ${handle.exitCode} before ${label}`));
      }
    }

    const timer = setTimeout(() => {
      settle(new Error(`timed out after ${timeoutMs}ms waiting for ${label}`));
    }, timeoutMs);

    watchers.push(watcher);
    watcher();
  });

  /**
   * Waits for the child process to exit
   *
   * @param {number} timeoutMs - Bound for the wait
   * @returns {Promise<Object>} Resolves with the handle
   */
  handle.waitForExit = (timeoutMs) => handle.waitFor(
    () => handle.exited,
    timeoutMs,
    'the process to exit'
  );

  /**
   * Terminates the child: SIGTERM first, then SIGKILL if it outlives the grace period
   *
   * @returns {Promise<Object>} Resolves with the handle once the child has exited
   */
  handle.kill = () => {
    if (handle.exited) return Promise.resolve(handle);

    return new Promise((resolve) => {
      const forceTimer = setTimeout(() => {
        try {
          child.kill('SIGKILL');
        } catch (err) {
          // The child exited between the grace period expiring and this call
        }
      }, KILL_GRACE_MS);

      child.once('exit', () => {
        clearTimeout(forceTimer);
        resolve(handle);
      });

      try {
        child.kill('SIGTERM');
      } catch (err) {
        clearTimeout(forceTimer);
        resolve(handle);
      }
    });
  };

  return handle;
}

/**
 * Issues one HTTP request and resolves with its status, headers and body
 *
 * @param {Object} options - Request description
 * @param {string} options.host - Host to connect to
 * @param {number} options.port - Port to connect to
 * @param {string} options.method - HTTP method
 * @param {string} options.path - Request path
 * @returns {Promise<Object>} Status code, lower-cased headers and body text
 */
function httpRequest(options) {
  const { host, port, method, path: requestPath } = options;

  return new Promise((resolve, reject) => {
    let settled = false;

    function settle(err, result) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve(result);
    }

    const timer = setTimeout(() => {
      request.destroy(
        new Error(`request ${method} ${requestPath} timed out after ${REQUEST_TIMEOUT_MS}ms`)
      );
    }, REQUEST_TIMEOUT_MS);

    const request = http.request({
      host,
      port,
      method,
      path: requestPath,
      headers: { Host: `${host}:${port}` }
    }, (response) => {
      const chunks = [];
      response.setEncoding('utf8');
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        settle(null, {
          statusCode: response.statusCode,
          headers: response.headers,
          body: chunks.join('')
        });
      });
      response.on('error', (err) => settle(err));
    });

    request.on('error', (err) => settle(err));
    request.end();
  });
}

// Outcome of every check, printed once as a summary line
const results = { passed: 0, failed: 0 };

/**
 * Runs one check, prints its single PASS/FAIL line, and terminates the children it owns
 *
 * @param {string} name - Check name as it appears in the PASS/FAIL line
 * @param {Function} check - Check body, called with the run context
 * @returns {Promise<void>} Resolves when the check and its cleanup are done
 */
async function runCheck(name, check) {
  const failures = [];
  const owned = [];
  const reported = [];

  const context = {
    spawn: (args, envOverrides, deletedVars) => {
      const handle = spawnServer(args, envOverrides, deletedVars);
      owned.push(handle);
      reported.push(handle);
      return handle;
    },
    observe: (handle) => {
      reported.push(handle);
      return handle;
    },
    expect: (condition, message) => {
      if (!condition) failures.push(message);
    }
  };

  try {
    await check(context);
  } catch (err) {
    failures.push(err && err.message ? err.message : String(err));
  }

  for (const handle of owned) {
    await handle.kill();
  }

  if (failures.length === 0) {
    results.passed += 1;
    console.log(`PASS ${name}`);
    return;
  }

  results.failed += 1;
  console.log(`FAIL ${name}`);
  failures.forEach((failure) => console.log(`  reason: ${failure}`));
  reported
    .filter((handle, index) => reported.indexOf(handle) === index)
    .forEach((handle) => {
      console.log(`  stdout: ${JSON.stringify(handle.stdout)}`);
      console.log(`  stderr: ${JSON.stringify(handle.stderr)}`);
    });
}

/**
 * C1a: with host and port set, the startup line names the bound address exactly once
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC1a(context) {
  const child = context.spawn(IN_PROCESS_ARGS, {
    NODE_ENV: 'test',
    HOST: '127.0.0.1',
    PORT: String(TEST_PORT)
  }, []);

  await child.waitFor(
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_BOUND)),
    OUTPUT_TIMEOUT_MS,
    `the startup line "${STARTUP_LINE_BOUND}" on stdout`
  );

  const lines = nonEmptyLines(child.stdout);
  context.expect(
    lines.length === 2 && lines[0] === ENV_NOTICE && lines[1] === STARTUP_LINE_BOUND,
    `expected stdout to hold the .env notice and one startup line, got ${JSON.stringify(lines)}`
  );
  context.expect(
    child.stderr === '',
    `expected stderr to be empty, got ${JSON.stringify(child.stderr)}`
  );

  await child.kill();
  context.expect(child.exited, 'expected the listener to terminate when the check ended');
}

/**
 * C1b: with host and port unset, the startup line names the default address
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC1b(context) {
  const child = context.spawn(IN_PROCESS_ARGS, { NODE_ENV: 'test' }, ['HOST', 'PORT']);

  await child.waitFor(
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_DEFAULT)),
    OUTPUT_TIMEOUT_MS,
    `the startup line "${STARTUP_LINE_DEFAULT}" on stdout`
  );

  const lines = nonEmptyLines(child.stdout);
  context.expect(
    lines.length === 2 && lines[0] === ENV_NOTICE && lines[1] === STARTUP_LINE_DEFAULT,
    `expected stdout to hold the .env notice and one startup line, got ${JSON.stringify(lines)}`
  );
  context.expect(
    child.stderr === '',
    `expected stderr to be empty, got ${JSON.stringify(child.stderr)}`
  );

  await child.kill();
  context.expect(child.exited, 'expected the listener to terminate when the check ended');
}

/**
 * C2: the startup line reaches stdout itself while NODE_ENV=test
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC2(context) {
  const child = context.spawn(IN_PROCESS_ARGS, {
    NODE_ENV: 'test',
    HOST: '127.0.0.1',
    PORT: String(TEST_PORT)
  }, []);

  await child.waitFor(
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_BOUND)),
    OUTPUT_TIMEOUT_MS,
    `the startup line "${STARTUP_LINE_BOUND}" on stdout`
  );

  // The assertion is on the line's presence, never on stdout being empty: every
  // logger helper returns before writing under test, so a logger-routed line would
  // leave stdout holding the .env notice alone
  const lines = nonEmptyLines(child.stdout);
  const startupLines = lines.filter((line) => line === STARTUP_LINE_BOUND);
  context.expect(
    startupLines.length === 1,
    `expected the startup line once on stdout, got ${startupLines.length} of `
      + `${JSON.stringify(lines)}`
  );
  context.expect(
    lines.includes(ENV_NOTICE),
    `expected the .env notice beside the startup line, got ${JSON.stringify(lines)}`
  );
  context.expect(
    child.stderr === '',
    `expected stderr to be empty, got ${JSON.stringify(child.stderr)}`
  );

  await child.kill();
  context.expect(child.exited, 'expected the listener to terminate when the check ended');
}

// The development listener C3 starts; C5 verifies its requests against it
let developmentChild = null;

/**
 * C3: a development startup keeps its four existing lines and gains the startup line
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC3(context) {
  developmentChild = context.observe(spawnServer(ENTRY_POINT_ARGS, {
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(DEVELOPMENT_PORT)
  }, []));

  await developmentChild.waitFor(
    (handle) => nonEmptyLines(handle.stdout).length >= 5,
    OUTPUT_TIMEOUT_MS,
    'the five stdout lines a development startup writes'
  );

  const lines = nonEmptyLines(developmentChild.stdout);
  context.expect(
    lines.length === 5,
    `expected exactly five stdout lines, got ${JSON.stringify(lines)}`
  );
  context.expect(
    lines[0] === ENV_NOTICE,
    `expected line 1 to be the .env notice, got ${JSON.stringify(lines[0])}`
  );
  context.expect(
    STARTING_RECORD.test(lines[1]),
    `expected line 2 to be the startup message, got ${JSON.stringify(lines[1])}`
  );
  context.expect(
    logRecord('INFO', `Server started on 127\\.0\\.0\\.1:${DEVELOPMENT_PORT}`).test(lines[2]),
    `expected line 3 to be the preserved logger line, got ${JSON.stringify(lines[2])}`
  );
  context.expect(
    lines[3] === STARTUP_LINE_DEVELOPMENT,
    `expected line 4 to be the startup line "${STARTUP_LINE_DEVELOPMENT}", got `
      + `${JSON.stringify(lines[3])}`
  );
  context.expect(
    COMPLETE_RECORD.test(lines[4]),
    `expected line 5 to be the completion message, got ${JSON.stringify(lines[4])}`
  );
  context.expect(
    developmentChild.stderr === '',
    `expected stderr to be empty during startup, got ${JSON.stringify(developmentChild.stderr)}`
  );
}

/**
 * C4: a run whose address is already in use prints no startup line and exits 1
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC4(context) {
  const holder = context.spawn(ENTRY_POINT_ARGS, {
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(CONFLICT_PORT)
  }, []);

  await holder.waitFor(
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_CONFLICT)),
    OUTPUT_TIMEOUT_MS,
    `the holder to bind 127.0.0.1:${CONFLICT_PORT}`
  );

  // The second process is the one under assertion: it must fail while the address
  // is held, so its environment and address are identical to the holder's
  const failing = context.spawn(ENTRY_POINT_ARGS, {
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(CONFLICT_PORT)
  }, []);

  await failing.waitForExit(EXIT_TIMEOUT_MS);

  const stdoutLines = nonEmptyLines(failing.stdout);
  const errorRecords = nonEmptyLines(failing.stderr).filter((line) => LOG_RECORD.test(line));

  context.expect(
    failing.exitCode === 1,
    `expected the failing run to exit with status 1, got ${failing.exitCode}`
  );
  context.expect(
    !stdoutLines.some((line) => line.startsWith('Server listening at ')),
    `expected no startup line on stdout, got ${JSON.stringify(stdoutLines)}`
  );
  context.expect(
    stdoutLines.length === 2
      && stdoutLines[0] === ENV_NOTICE
      && STARTING_RECORD.test(stdoutLines[1]),
    `expected stdout to hold only the .env notice and the startup message, got `
      + `${JSON.stringify(stdoutLines)}`
  );
  context.expect(
    errorRecords.length === 2
      && SERVER_ERROR_RECORD.test(errorRecords[0])
      && FAILED_START_RECORD.test(errorRecords[1]),
    `expected exactly the two existing error records on stderr, got ${JSON.stringify(errorRecords)}`
  );

  await holder.kill();
  context.expect(holder.exited, 'expected the holder to terminate when the check ended');
}

/**
 * C5: the endpoint contract and the per-request log lines are unchanged
 *
 * Runs against the listener C3 left bound, so C3 has to succeed for this to pass.
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC5(context) {
  const listener = developmentChild;

  if (listener === null || listener.exited) {
    context.expect(
      false,
      `no listener is bound on 127.0.0.1:${DEVELOPMENT_PORT}, so its requests cannot be verified`
    );
    return;
  }

  const request = (method, requestPath) => httpRequest({
    host: '127.0.0.1',
    port: DEVELOPMENT_PORT,
    method,
    path: requestPath
  });

  const hello = await request('GET', '/hello');
  context.expect(
    hello.statusCode === 200,
    `expected GET /hello to answer 200, got ${hello.statusCode}`
  );
  context.expect(
    hello.headers['content-type'] === 'text/plain',
    `expected Content-Type text/plain, got ${JSON.stringify(hello.headers['content-type'])}`
  );
  context.expect(
    hello.body === 'Hello world',
    `expected the body "Hello world", got ${JSON.stringify(hello.body)}`
  );
  context.expect(
    Buffer.byteLength(hello.body) === 11,
    `expected an 11-byte body, got ${Buffer.byteLength(hello.body)} bytes`
  );
  context.expect(
    hello.headers['x-content-type-options'] === 'nosniff',
    `expected X-Content-Type-Options nosniff, got `
      + `${JSON.stringify(hello.headers['x-content-type-options'])}`
  );
  context.expect(
    hello.headers['x-frame-options'] === 'DENY',
    `expected X-Frame-Options DENY, got ${JSON.stringify(hello.headers['x-frame-options'])}`
  );
  context.expect(
    hello.headers['content-security-policy'] === "default-src 'none'",
    `expected Content-Security-Policy default-src 'none', got `
      + `${JSON.stringify(hello.headers['content-security-policy'])}`
  );
  await listener.waitFor(
    (handle) => hasLine(handle.stdout, requestLogRecord('INFO', 'GET', '/hello', 200)),
    OUTPUT_TIMEOUT_MS,
    'the INFO request line for GET /hello on stdout'
  );

  const notFound = await request('GET', '/nope');
  context.expect(
    notFound.statusCode === 404,
    `expected GET /nope to answer 404, got ${notFound.statusCode}`
  );
  context.expect(
    notFound.body === 'Not Found',
    `expected the body "Not Found", got ${JSON.stringify(notFound.body)}`
  );
  await listener.waitFor(
    (handle) => hasLine(handle.stderr, requestLogRecord('WARN', 'GET', '/nope', 404)),
    OUTPUT_TIMEOUT_MS,
    'the WARN request line for GET /nope on stderr'
  );

  const methodNotAllowed = await request('POST', '/hello');
  context.expect(
    methodNotAllowed.statusCode === 405,
    `expected POST /hello to answer 405, got ${methodNotAllowed.statusCode}`
  );
  context.expect(
    methodNotAllowed.headers.allow === 'GET',
    `expected an Allow header of GET, got ${JSON.stringify(methodNotAllowed.headers.allow)}`
  );
  context.expect(
    methodNotAllowed.body === 'Method Not Allowed',
    `expected the body "Method Not Allowed", got ${JSON.stringify(methodNotAllowed.body)}`
  );
  await listener.waitFor(
    (handle) => hasLine(handle.stderr, requestLogRecord('WARN', 'POST', '/hello', 405)),
    OUTPUT_TIMEOUT_MS,
    'the WARN request line for POST /hello on stderr'
  );

  await listener.kill();
  context.expect(listener.exited, 'expected the listener to terminate when the check ended');
}

/**
 * Runs every check in order and reports how many passed
 *
 * @returns {Promise<number>} Exit status: 0 only when all six checks pass
 */
async function main() {
  await runCheck('C1a startup line names the bound address (HOST/PORT set)', checkC1a);
  await runCheck('C1b startup line names the default address (HOST/PORT unset)', checkC1b);
  await runCheck('C2 startup line survives NODE_ENV=test', checkC2);
  await runCheck('C3 existing startup output preserved (development run)', checkC3);
  await runCheck('C4 failure path prints no startup line and exits 1', checkC4);
  await runCheck('C5 endpoint and per-request logging unchanged', checkC5);

  console.log(`${results.passed} checks passed, ${results.failed} failed`);
  return results.failed === 0 ? 0 : 1;
}

// Hard bound: a child that wedges the event loop still cannot hang the run
const watchdog = setTimeout(() => {
  killLiveChildren();
  console.log(`Harness aborted: verification exceeded ${OVERALL_TIMEOUT_MS}ms`);
  process.exit(1);
}, OVERALL_TIMEOUT_MS);
watchdog.unref();

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err) => {
    console.log(`Harness error: ${err && err.message ? err.message : String(err)}`);
    process.exitCode = 1;
  })
  .finally(() => {
    clearTimeout(watchdog);
    killLiveChildren();
  });
