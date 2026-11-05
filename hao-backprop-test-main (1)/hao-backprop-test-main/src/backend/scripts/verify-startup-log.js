/**
 * Startup Log Verification Script
 *
 * Runnable form of the acceptance criteria for the server's startup announcement:
 * the HTTP listener prints `Server listening at http://<host>:<port>` on standard
 * output when it starts, unconditionally, including under `NODE_ENV=test`. Each check
 * observes the real application running, spawning it where its own run needs one, and
 * reads what the process writes to its streams and returns on the wire; no check
 * inspects source code.
 *
 * Run from `src/backend` with `node scripts/verify-startup-log.js`
 * (`npm run verify:startup` reaches the same script). A bare invocation runs all six
 * checks and prints one PASS, FAIL, CONFLICT or PRECONDITION line per check; `-h` and
 * `--help` print the usage block and exit 0, and any other argument is rejected with exit
 * status 2. The exit status is 0 when every check passes, 1 when any check fails, stands
 * down on an environment conflict or is left unobserved, and 2 for a usage error. This is
 * not a Jest suite and is never collected as one.
 *
 * A run whose application cannot start at all, for a cause of the run's own environment
 * rather than of the criteria, is a precondition: a declared dependency that was never
 * installed, as in a fresh clone, leaves each check nothing to observe, so every check
 * prints PRECONDITION, the run counts those apart from the criteria and its exit status
 * stays non-zero. Install what the manifest declares with `cd src/backend && npm install`
 * and rerun; this tool never installs anything itself.
 *
 * The criteria name fixed addresses: `127.0.0.1:3100` for the bound-address runs, the
 * documented default `0.0.0.0:3000` for the defaults run, `127.0.0.1:31002` for the
 * development run and for the requests C5 makes against it, and `127.0.0.1:31003` for
 * the address-in-use run. They are never substituted, because each criterion is
 * observed at the address it names, so the machine running this tool has to leave all
 * four of them unoccupied: a check holds its own address only while it runs, while the
 * development listener on 127.0.0.1:31002 stays bound from C3 until the run releases it
 * after C5. Every address is probed before the first check, and one that another process
 * already holds is reported as an environment conflict rather than as a failure of the
 * criteria.
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

// The message config.js writes instead once a .env file has been loaded
const ENV_LOADED_NOTICE = 'Environment variables loaded from .env file';

// Shape of the announced line: it names the bound address, whatever that address is
const STARTUP_LINE_PATTERN = /^Server listening at http:\/\//;

// Addresses named by the criteria, never substituted: the defaults run has to observe
// the documented default, and the address-in-use run has to collide with its own holder
const TEST_PORT = 3100;
const DEFAULT_PORT = 3000;
const DEVELOPMENT_PORT = 31002;
const CONFLICT_PORT = 31003;

// The startup line under test, exactly as the listener writes it
const STARTUP_LINE_BOUND = `Server listening at http://127.0.0.1:${TEST_PORT}`;
const STARTUP_LINE_DEFAULT = `Server listening at http://0.0.0.0:${DEFAULT_PORT}`;
const STARTUP_LINE_DEVELOPMENT = `Server listening at http://127.0.0.1:${DEVELOPMENT_PORT}`;
const STARTUP_LINE_CONFLICT = `Server listening at http://127.0.0.1:${CONFLICT_PORT}`;

// Under NODE_ENV=test index.js does not run main(), so the listener starts in-process
const IN_PROCESS_ARGS = ['-e', "require('./server').startServer();"];
const ENTRY_POINT_ARGS = ['index.js'];

// Every address the criteria name, probed once before the first check runs
const SCENARIO_ADDRESSES = [
  { host: '127.0.0.1', port: TEST_PORT },
  { host: '0.0.0.0', port: DEFAULT_PORT },
  { host: '127.0.0.1', port: DEVELOPMENT_PORT },
  { host: '127.0.0.1', port: CONFLICT_PORT }
];

// Usage block: what the tool verifies, that it takes no arguments, the addresses it
// needs free, and the exit statuses it can return
const USAGE_LINES = [
  'Usage: node scripts/verify-startup-log.js',
  '',
  'Verifies the server\'s startup announcement: the listener prints',
  '`Server listening at http://<host>:<port>` on standard output when it starts,',
  'unconditionally, including under `NODE_ENV=test`. Six checks are run; each observes',
  'the real application running, spawning it where its own run needs one, and reads what',
  'the process writes to its streams and returns on the wire.',
  '',
  'Each check prints exactly one outcome line: PASS when the criteria held, FAIL when they',
  'were broken, CONFLICT when the address they are observed at belonged to another',
  'process, and PRECONDITION when the run\'s own environment never let them be observed.',
  '',
  'This tool takes no arguments.',
  '',
  'Because no criterion address may be substituted, these four must be free:',
  `  127.0.0.1:${TEST_PORT}    the bound-address run (C1a) and the test-mode run (C2)`,
  `  0.0.0.0:${DEFAULT_PORT}      the defaults run (C1b)`,
  `  127.0.0.1:${DEVELOPMENT_PORT}   the development run (C3) and the C5 requests`,
  `  127.0.0.1:${CONFLICT_PORT}   the address-in-use run (C4)`,
  '',
  'A criterion address another process holds, either before the run or in the window',
  'before the check bound it, is an environment conflict: that check prints CONFLICT and',
  'stands down instead of failing the criteria.',
  '',
  'An application that cannot start at all, for a cause of its own environment rather than',
  'of the criteria (a declared dependency that is not installed, as in a fresh clone),',
  'leaves every criterion unobserved: each check prints PRECONDITION, the run counts it',
  'apart and still exits non-zero. The reason is printed before the first check whenever',
  'the pre-flight probe finds the run cannot resolve what the manifest declares. Install',
  'the dependencies with `cd src/backend && npm install` and rerun; this tool never',
  'installs anything itself.',
  '',
  'Exit status: 0 when every check passes, 1 when any check fails, stands down on an',
  'environment conflict or leaves a criterion unobserved, 2 for a usage error'
];

// Every wait is bounded, so a stuck child fails its check instead of blocking the run
const OUTPUT_TIMEOUT_MS = 10000;
const EXIT_TIMEOUT_MS = 10000;
const CLOSE_TIMEOUT_MS = 10000;
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
// The address-in-use path is matched on the stable tokens the runtime guarantees, its
// error code and the address, never on libuv's own sentence, which it may reword
const ADDRESS_IN_USE_CODE = 'EADDRINUSE';
const ADDRESS_IN_USE_TARGET = `127.0.0.1:${CONFLICT_PORT}`;
const SERVER_ERROR_RECORD = logRecord(
  'ERROR',
  `Server error: .*${ADDRESS_IN_USE_CODE}.*${escapeRegExp(ADDRESS_IN_USE_TARGET)}`
);
const FAILED_START_RECORD = logRecord(
  'ERROR',
  `Failed to start application: .*${ADDRESS_IN_USE_CODE}.*${escapeRegExp(ADDRESS_IN_USE_TARGET)}`
);

// A module-resolution failure is the run's own precondition failing, never a criterion
// breaking: it is what a fresh clone reports for a declared dependency that was never
// installed, before any listener exists
const MODULE_NOT_FOUND_CODE = 'MODULE_NOT_FOUND';
const MISSING_MODULE_PATTERN = /Cannot find module '([^']+)'/;

// The tool never installs anything itself: it names the command that installs what the
// manifest declares and leaves the decision, and the checkout, to the reader
const INSTALL_COMMAND = 'cd src/backend && npm install';

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
 * Reports whether a captured line is the announced startup line
 *
 * @param {string} line - One non-empty captured line
 * @returns {boolean} True when the line has the announcement's shape
 */
function isStartupLine(line) {
  return STARTUP_LINE_PATTERN.test(line);
}

/**
 * Reports whether a captured line is one of the two messages config.js writes about
 * the .env file
 *
 * @param {string} line - One non-empty captured line
 * @returns {boolean} True for the .env notice or for the .env loaded message
 */
function isEnvironmentMessage(line) {
  return line === ENV_NOTICE || line === ENV_LOADED_NOTICE;
}

/**
 * Selects the address-bearing startup lines from captured output
 *
 * @param {string} text - Captured stream content
 * @returns {Array<string>} Startup-shaped lines, in order
 */
function startupLines(text) {
  return nonEmptyLines(text).filter(isStartupLine);
}

/**
 * Builds the sentence both conflict paths report an unavailable address with
 *
 * The pre-flight probe and a check's own failed bind describe the same condition, so
 * they share this wording rather than drifting apart.
 *
 * @param {string} host - Host the criterion address names
 * @param {number} port - Port the criterion address names
 * @param {string} detail - How the conflict was observed, in the observer's words
 * @returns {string} Reason to report for that address
 */
function conflictReason(host, port, detail) {
  return `Environment conflict: ${host}:${port} is not available `
    + `(${detail}); the criteria name this address and it cannot be substituted`;
}

/**
 * Reports whether one address can be bound right now
 *
 * The address is held only for the instant of the probe: the listening server is
 * closed before the promise resolves, so no check races against this probe.
 *
 * @param {string} host - Host to bind
 * @param {number} port - Port to bind
 * @returns {Promise<Error|null>} Null when the address is free, the bind error otherwise
 */
function probeAddress(host, port) {
  return new Promise((resolve) => {
    let settled = false;
    const server = http.createServer();

    function settle(error) {
      if (settled) return;
      settled = true;
      resolve(error);
    }

    server.on('error', (err) => settle(err));
    server.listen(port, host, () => {
      server.close(() => settle(null));
    });
  });
}

/**
 * Probes every address the criteria name and prints the ones already in use
 *
 * An occupied address is an environment conflict, not a failure of the criteria: the
 * address each criterion is observed at cannot be substituted, so the conflict is
 * reported and the check that names it stands down.
 *
 * @returns {Promise<Map<string, string>>} Conflict reason per `host:port` key
 */
async function probeScenarioAddresses() {
  const conflicts = new Map();

  for (const address of SCENARIO_ADDRESSES) {
    const error = await probeAddress(address.host, address.port);
    if (!error) continue;

    const reason = conflictReason(address.host, address.port, error.message);
    conflicts.set(`${address.host}:${address.port}`, reason);
    console.log(reason);
  }

  return conflicts;
}

/**
 * Reads a conflict reason out of a check's own failed bind, when that is what failed it
 *
 * The pre-flight probe releases the socket it binds, so another process can still take a
 * criterion address before the check's child binds it. That window is short but real,
 * and the child's own EADDRINUSE for that address identifies it, so the conflict is
 * classified here instead of being attributed to the criteria.
 *
 * @param {Object} handle - Handle of the child whose startup wait failed
 * @param {string} host - Host the check bound
 * @param {number} port - Port the check bound
 * @returns {string|null} Conflict reason, or null when the child shows no such failure
 */
function bindConflictReason(handle, host, port) {
  if (!handle || !handle.stderr.includes(ADDRESS_IN_USE_CODE)) return null;
  if (!handle.stderr.includes(`${host}:${port}`)) return null;

  return conflictReason(host, port, `the bind failed with ${ADDRESS_IN_USE_CODE}`);
}

/**
 * Reduces a module specifier to the package that owns it
 *
 * @param {string} specifier - Specifier as Node reports it, e.g. `dotenv` or `pkg/lib/x`
 * @returns {string} Top-level package name, carrying its scope when it has one
 */
function packageNameOf(specifier) {
  const segments = specifier.split('/');
  if (specifier.startsWith('@') && segments.length >= 2) {
    return `${segments[0]}/${segments[1]}`;
  }

  return segments[0];
}

/**
 * Names the package a run could not resolve, or null when its output shows no such failure
 *
 * Only a package the manifest declares counts as a precondition. A relative or absolute
 * specifier names a module inside the checkout, and a specifier that reaches inside a
 * package names one too, so a missing module of either kind is a defect of the application
 * itself and still fails its check. The output has to carry Node's own error code as well,
 * so a message that merely quotes the sentence while reporting something else is never
 * taken for a precondition.
 *
 * @param {string} text - Captured stdout and stderr of one run
 * @returns {string|null} Package name, or null when the run shows no such failure
 */
function unresolvedPackage(text) {
  if (!text.includes(MODULE_NOT_FOUND_CODE)) return null;

  const match = MISSING_MODULE_PATTERN.exec(text);
  if (match === null) return null;

  const specifier = match[1];
  if (specifier.startsWith('.') || path.isAbsolute(specifier)) return null;

  // The declared package itself, never a path inside it: `dotenv` is what an install
  // delivers, while `dotenv/lib/x` is a module the application names for itself
  return specifier === packageNameOf(specifier) ? specifier : null;
}

/**
 * Describes the missing package for the reason both precondition paths print
 *
 * @param {string} name - Package name the run failed to resolve
 * @returns {string} Observation sentence naming the package and the failure
 */
function dependencyDetail(name) {
  return `the declared dependency "${name}" is not installed `
    + `(Cannot find module '${name}')`;
}

/**
 * Builds the sentence both precondition paths report an unstartable run with
 *
 * The pre-flight probe and a check's own failed run describe the same condition, so they
 * share this wording rather than drifting apart.
 *
 * @param {string} detail - How the precondition was observed, in the observer's words
 * @returns {string} Reason to report for the run
 */
function preconditionReason(detail) {
  return 'Environment precondition: the application could not start, because '
    + `${detail}; the criteria were therefore never observed and this run says nothing `
    + `about them. Install the backend dependencies with \`${INSTALL_COMMAND}\` and rerun.`;
}

/**
 * Reads a precondition reason out of a run that never started, when that is what ended it
 *
 * The child exits before any listener exists, and the module it could not resolve is named
 * in the output it already wrote, so the run is classified here instead of being
 * attributed to the criteria.
 *
 * @param {Object} handle - Handle of the child whose startup wait failed
 * @returns {string|null} Precondition reason, or null when the child shows no such failure
 */
function startupPreconditionReason(handle) {
  if (!handle) return null;

  const missing = unresolvedPackage(`${handle.stdout}${handle.stderr}`);
  if (missing === null) return null;

  return preconditionReason(dependencyDetail(missing));
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
    stdout: '',
    stderr: '',
    exited: false,
    exitCode: null,
    closed: false,
    spawnError: null
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

  child.on('error', (err) => {
    // A spawn failure, kept so a check can report its cause instead of an early exit
    handle.spawnError = err;
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

  child.on('close', () => {
    // Node delivers a finished child's stdio completely only once it has closed
    handle.closed = true;
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
        const cause = handle.spawnError
          ? `failed to spawn (${handle.spawnError.message})`
          : `exited with code ${handle.exitCode}`;
        settle(new Error(`process ${cause} before ${label}`));
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
   * Waits for the child to close, which is when its stdio is fully delivered
   *
   * Woken by the same watcher machinery the other waits use, but settled only by a
   * close of the child's stdio streams, or by a spawn failure, after which no stream
   * will ever close. It deliberately does not settle on 'exit': a child that has
   * exited while its pipes are still draining has not delivered all of its output
   * yet, so a check reading the captured streams at that moment would assert on a
   * partial read. Only the bounded timeout ends the wait otherwise.
   *
   * @param {number} timeoutMs - Bound for the wait
   * @returns {Promise<Object>} Resolves with the handle
   */
  handle.waitForClose = (timeoutMs) => {
    // Nothing to wait for once the streams have closed, or once the child never
    // spawned: register no waiter and no timer at all on those paths
    if (handle.closed || handle.spawnError !== null) return Promise.resolve(handle);

    return new Promise((resolve, reject) => {
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
        if (handle.closed || handle.spawnError !== null) settle(null);
      }

      const timer = setTimeout(() => {
        settle(new Error(`timed out after ${timeoutMs}ms waiting for `
          + 'the process to close its stdio streams'));
      }, timeoutMs);

      watchers.push(watcher);
      watcher();
    });
  };

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
 * Reports whether src/backend/.env is present, without reading the filesystem
 *
 * One short child evaluates config.js from the same directory the checks spawn in and
 * prints the message config.js writes once a .env file has been loaded.
 *
 * @returns {Promise<boolean>} True when config.js reports a loaded .env file
 */
async function detectEnvFile() {
  const probe = spawnServer(['-e', "require('./config.js');"], { NODE_ENV: 'development' }, []);

  try {
    await probe.waitForExit(EXIT_TIMEOUT_MS);
    await probe.waitForClose(CLOSE_TIMEOUT_MS);
  } catch (err) {
    // The probe is a diagnostic: an unreadable precondition leaves it undetected
    return false;
  } finally {
    await probe.kill();
  }

  return hasLine(probe.stdout, exactLine(ENV_LOADED_NOTICE));
}

/**
 * Names a declared package the run cannot resolve, read from a short probe of config.js
 *
 * One child loads the module that requires the declared dependency, from the same
 * directory the checks spawn in, and its own output says whether resolution succeeded.
 * The probe is a diagnostic: when it cannot be read, nothing is reported and the checks
 * still classify each run for themselves from what they observe.
 *
 * @returns {Promise<string|null>} Package name, or null when the probe resolves everything
 */
async function detectMissingDependency() {
  const probe = spawnServer(['-e', "require('./config.js');"], { NODE_ENV: 'development' }, []);

  try {
    await probe.waitForExit(EXIT_TIMEOUT_MS);
    await probe.waitForClose(CLOSE_TIMEOUT_MS);
  } catch (err) {
    // The probe is a diagnostic: an unreadable precondition leaves it undetected
    return null;
  } finally {
    await probe.kill();
  }

  return unresolvedPackage(`${probe.stdout}${probe.stderr}`);
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
const results = { passed: 0, failed: 0, conflicted: 0, unobserved: 0 };

/**
 * Runs one check, prints its single PASS, FAIL, CONFLICT or PRECONDITION line, and
 * terminates the children it owns
 *
 * A check stands down on an environment conflict, or on a run the environment never let
 * start, instead of failing the criteria, so the outcomes are counted and printed apart:
 * FAIL means the criteria were broken, CONFLICT means the address they are observed at
 * belonged to another process, and PRECONDITION means the run itself could not start, so
 * the criteria were never observed and the check has no verdict to give.
 *
 * @param {string} name - Check name as it appears in the result line
 * @param {Function} check - Check body, called with the run context
 * @param {Object} run - Run-scoped state shared by every check and released by main()
 * @returns {Promise<void>} Resolves when the check and its cleanup are done
 */
async function runCheck(name, check, run) {
  const failures = [];
  const conflicts = [];
  const preconditions = [];
  const owned = [];
  const reported = [];

  const context = {
    spawn: (args, envOverrides, deletedVars) => {
      const handle = spawnServer(args, envOverrides, deletedVars);
      owned.push(handle);
      reported.push(handle);
      return handle;
    },
    share: (handle) => {
      run.shared.push(handle);
      reported.push(handle);
      return handle;
    },
    state: run.state,
    conflict: (host, port, handle) => {
      // The pre-flight probe is the first word on an address; a check's own failed bind
      // covers the window the probe cannot, and only a handle that shows that failure
      // classifies its check
      const probed = run.state.conflicts.get(`${host}:${port}`);
      const reason = probed === undefined ? bindConflictReason(handle, host, port) : probed;
      if (reason === null) return false;
      conflicts.push(reason);
      return true;
    },
    precondition: (handle) => {
      // A run that never bound says nothing about the criteria, so a child whose own
      // output shows a package it could not resolve stands its check down here rather
      // than failing it on criteria nothing observed
      const reason = startupPreconditionReason(handle);
      if (reason === null) return false;
      preconditions.push(reason);
      return true;
    },
    awaitStartup: async (handle, host, port, predicate, label) => {
      try {
        await handle.waitFor(predicate, OUTPUT_TIMEOUT_MS, label);
        return true;
      } catch (err) {
        // A wait that ended because the address was taken, or because the run could not
        // start at all, leaves the check nothing to assert: it stands down as an
        // environment conflict or precondition and never as a criteria FAIL. Both
        // classifications read the child's captured stderr, which the operating system
        // delivers over a pipe after the child has exited, so a finished child gets the
        // same bounded moment to drain its streams that the failure dump gives it.
        if (handle.exited) {
          try {
            await handle.waitForClose(CLOSE_TIMEOUT_MS);
          } catch (closeErr) {
            // Best effort: a partial read still carries whatever the child already wrote
          }
        }
        // The address is asked about first: an occupied address is an observation about
        // the environment, whatever else the child happened to report
        if (context.conflict(host, port, handle)) return false;
        if (context.precondition(handle)) return false;
        throw err;
      }
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

  if (failures.length === 0 && conflicts.length === 0 && preconditions.length === 0) {
    results.passed += 1;
    console.log(`PASS ${name}`);
    return;
  }

  // The line names the outcome the check is judged by: a criteria failure outranks a
  // conflict, a conflict outranks a precondition, and either way every reason the check
  // recorded is printed under it
  if (failures.length > 0) {
    results.failed += 1;
    console.log(`FAIL ${name}`);
  } else if (conflicts.length > 0) {
    results.conflicted += 1;
    console.log(`CONFLICT ${name}`);
  } else {
    results.unobserved += 1;
    console.log(`PRECONDITION ${name}`);
  }

  failures.forEach((failure) => console.log(`  reason: ${failure}`));
  conflicts.forEach((conflict) => console.log(`  reason: ${conflict}`));
  preconditions.forEach((precondition) => console.log(`  reason: ${precondition}`));

  const dumpHandles = reported.filter((handle, index) => reported.indexOf(handle) === index);

  // A human reads this dump, so give every finished child a bounded moment to deliver
  // its stdio completely: a still-running child is left alone and a timeout here only
  // leaves the dump short, never failing an unrelated check
  await Promise.all(dumpHandles.map(async (handle) => {
    if (!handle.exited || handle.closed) return;
    try {
      await handle.waitForClose(CLOSE_TIMEOUT_MS);
    } catch (err) {
      // Best effort: the verdict above already stands on its own reason
    }
  }));

  dumpHandles.forEach((handle) => {
    console.log(`  stdout: ${JSON.stringify(handle.stdout)}`);
    console.log(`  stderr: ${JSON.stringify(handle.stderr)}`);
    if (handle.spawnError) {
      console.log(`  spawn error: ${handle.spawnError.message}`);
    }
  });
}

/**
 * C1a: with host and port set, the startup line names the bound address exactly once
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC1a(context) {
  if (context.conflict('127.0.0.1', TEST_PORT)) return;

  const child = context.spawn(IN_PROCESS_ARGS, {
    NODE_ENV: 'test',
    HOST: '127.0.0.1',
    PORT: String(TEST_PORT)
  }, []);

  const started = await context.awaitStartup(
    child,
    '127.0.0.1',
    TEST_PORT,
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_BOUND)),
    `the startup line "${STARTUP_LINE_BOUND}" on stdout`
  );
  if (!started) return;

  const lines = nonEmptyLines(child.stdout);
  const startup = startupLines(child.stdout);
  context.expect(
    startup.length === 1 && startup[0] === STARTUP_LINE_BOUND,
    `expected exactly one startup line "${STARTUP_LINE_BOUND}" on stdout, got `
      + `${JSON.stringify(startup)} of ${JSON.stringify(lines)}`
  );
  context.expect(
    lines.every((line) => line === STARTUP_LINE_BOUND || isEnvironmentMessage(line)),
    `expected every stdout line to be that startup line or an environment message, got `
      + `${JSON.stringify(lines)}`
  );
  context.expect(
    lines.filter(isEnvironmentMessage).length <= 1,
    `expected at most one environment message on stdout, got ${JSON.stringify(lines)}`
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
  if (context.conflict('0.0.0.0', DEFAULT_PORT)) return;

  const child = context.spawn(IN_PROCESS_ARGS, { NODE_ENV: 'test' }, ['HOST', 'PORT']);

  // A .env file that sets HOST or PORT moves the default the server falls back to, so
  // name that precondition in the label of the wait it would break
  const envFileNote = context.state.envFilePresent
    ? ' (src/backend/.env is present and may set HOST or PORT)'
    : '';

  const started = await context.awaitStartup(
    child,
    '0.0.0.0',
    DEFAULT_PORT,
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_DEFAULT)),
    `the startup line "${STARTUP_LINE_DEFAULT}" on stdout${envFileNote}`
  );
  if (!started) return;

  const lines = nonEmptyLines(child.stdout);
  const startup = startupLines(child.stdout);
  context.expect(
    startup.length === 1 && startup[0] === STARTUP_LINE_DEFAULT,
    `expected exactly one startup line "${STARTUP_LINE_DEFAULT}" on stdout, got `
      + `${JSON.stringify(startup)} of ${JSON.stringify(lines)}`
  );
  context.expect(
    lines.every((line) => line === STARTUP_LINE_DEFAULT || isEnvironmentMessage(line)),
    `expected every stdout line to be that startup line or an environment message, got `
      + `${JSON.stringify(lines)}`
  );
  context.expect(
    lines.filter(isEnvironmentMessage).length <= 1,
    `expected at most one environment message on stdout, got ${JSON.stringify(lines)}`
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
  if (context.conflict('127.0.0.1', TEST_PORT)) return;

  const child = context.spawn(IN_PROCESS_ARGS, {
    NODE_ENV: 'test',
    HOST: '127.0.0.1',
    PORT: String(TEST_PORT)
  }, []);

  const started = await context.awaitStartup(
    child,
    '127.0.0.1',
    TEST_PORT,
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_BOUND)),
    `the startup line "${STARTUP_LINE_BOUND}" on stdout`
  );
  if (!started) return;

  // The assertion is on the line's presence, never on stdout being empty: every
  // logger helper returns before writing under test, so a logger-routed line would
  // leave stdout holding the .env notice alone
  const lines = nonEmptyLines(child.stdout);
  const startup = startupLines(child.stdout);
  context.expect(
    startup.length === 1,
    `expected exactly one startup-shaped line on stdout, got ${JSON.stringify(startup)} of `
      + `${JSON.stringify(lines)}`
  );
  context.expect(
    lines.every((line) => isStartupLine(line) || isEnvironmentMessage(line)),
    `expected every stdout line to be the startup line or an environment message, got `
      + `${JSON.stringify(lines)}`
  );
  context.expect(
    lines.filter(isEnvironmentMessage).length <= 1,
    `expected at most one environment message on stdout, got ${JSON.stringify(lines)}`
  );
  context.expect(
    child.stderr === '',
    `expected stderr to be empty, got ${JSON.stringify(child.stderr)}`
  );

  await child.kill();
  context.expect(child.exited, 'expected the listener to terminate when the check ended');
}

/**
 * C3: a development startup keeps its four existing lines and gains the startup line
 *
 * The listener it starts belongs to the run, not to a check: C5 sends its requests to
 * it while it keeps listening, and main() terminates it once every check has finished.
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC3(context) {
  if (context.conflict('127.0.0.1', DEVELOPMENT_PORT)) return;

  const listener = context.share(spawnServer(ENTRY_POINT_ARGS, {
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(DEVELOPMENT_PORT)
  }, []));

  context.state.developmentListener = listener;

  const started = await context.awaitStartup(
    listener,
    '127.0.0.1',
    DEVELOPMENT_PORT,
    (handle) => nonEmptyLines(handle.stdout).length >= 5,
    'the five stdout lines a development startup writes'
  );
  if (!started) return;

  const lines = nonEmptyLines(listener.stdout);
  const startup = startupLines(listener.stdout);
  context.expect(
    lines.length === 5,
    `expected exactly five stdout lines, got ${JSON.stringify(lines)}`
  );
  context.expect(
    isEnvironmentMessage(lines[0]),
    `expected line 1 to be the .env notice or the .env loaded message, got `
      + `${JSON.stringify(lines[0])}`
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
    startup.length === 1,
    `expected exactly one startup line on stdout, got ${JSON.stringify(startup)} of `
      + `${JSON.stringify(lines)}`
  );
  context.expect(
    listener.stderr === '',
    `expected stderr to be empty during startup, got ${JSON.stringify(listener.stderr)}`
  );
}

/**
 * C4: a run whose address is already in use prints no startup line and exits 1
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC4(context) {
  if (context.conflict('127.0.0.1', CONFLICT_PORT)) return;

  const holder = context.spawn(ENTRY_POINT_ARGS, {
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(CONFLICT_PORT)
  }, []);

  const started = await context.awaitStartup(
    holder,
    '127.0.0.1',
    CONFLICT_PORT,
    (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_CONFLICT)),
    `the holder to bind 127.0.0.1:${CONFLICT_PORT}`
  );
  if (!started) return;

  // The second process is the one under assertion: it must fail while the address
  // is held, so its environment and address are identical to the holder's and its own
  // EADDRINUSE is the expected outcome this check asserts, never a classified conflict
  const failing = context.spawn(ENTRY_POINT_ARGS, {
    NODE_ENV: 'development',
    HOST: '127.0.0.1',
    PORT: String(CONFLICT_PORT)
  }, []);

  await failing.waitForExit(EXIT_TIMEOUT_MS);
  // Node delivers a finished child's stdio completely only at 'close', so the reads
  // below wait for it rather than trusting what has arrived by 'exit'
  await failing.waitForClose(CLOSE_TIMEOUT_MS);

  const stdoutLines = nonEmptyLines(failing.stdout);
  const errorRecords = nonEmptyLines(failing.stderr).filter((line) => LOG_RECORD.test(line));

  context.expect(
    failing.exitCode === 1,
    failing.spawnError
      ? `expected the failing run to exit with status 1, got spawn error: `
        + `${failing.spawnError.message}`
      : `expected the failing run to exit with status 1, got ${failing.exitCode}`
  );
  context.expect(
    !stdoutLines.some(isStartupLine),
    `expected no startup line on stdout, got ${JSON.stringify(stdoutLines)}`
  );
  context.expect(
    stdoutLines.length === 2
      && isEnvironmentMessage(stdoutLines[0])
      && STARTING_RECORD.test(stdoutLines[1]),
    `expected stdout to hold only an environment message and the startup message, got `
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
 * Sends its requests to the listener C3 started on the same address while that
 * listener keeps running. When C3 left none behind, or left one that has already
 * exited, this check starts an equivalent listener itself, so its verdict rests on
 * what it observes and never on another check's outcome.
 *
 * @param {Object} context - Run context
 * @returns {Promise<void>} Resolves when the check has run
 */
async function checkC5(context) {
  if (context.conflict('127.0.0.1', DEVELOPMENT_PORT)) return;

  let listener = context.state.developmentListener;

  if (!listener || listener.exited) {
    listener = context.share(spawnServer(ENTRY_POINT_ARGS, {
      NODE_ENV: 'development',
      HOST: '127.0.0.1',
      PORT: String(DEVELOPMENT_PORT)
    }, []));

    context.state.developmentListener = listener;

    const started = await context.awaitStartup(
      listener,
      '127.0.0.1',
      DEVELOPMENT_PORT,
      (handle) => hasLine(handle.stdout, exactLine(STARTUP_LINE_DEVELOPMENT)),
      `the listener this check started on 127.0.0.1:${DEVELOPMENT_PORT} to announce it`
    );
    if (!started) return;
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

  // The announcement is one line per listener start, never one per request or per
  // connection: recount the address-bearing lines now that the three requests are done
  const announced = startupLines(listener.stdout);
  context.expect(
    announced.length === 1,
    `expected exactly one startup line on the listener's stdout after three requests, got `
      + `${JSON.stringify(announced)}`
  );

  await listener.kill();
  context.expect(listener.exited, 'expected the listener to terminate when the check ended');
}

/**
 * Runs every check in order and reports how many passed, failed, stood down or were
 * left unobserved
 *
 * @returns {Promise<number>} Exit status: 0 only when no check failed, none conflicted
 *   and none was left unobserved
 */
async function main() {
  const run = { shared: [], state: {} };

  // The criteria name fixed addresses, so establish the environment before the first
  // check runs: an address another process holds is a conflict, never a feature defect
  run.state.conflicts = await probeScenarioAddresses();

  run.state.envFilePresent = await detectEnvFile();
  if (run.state.envFilePresent) {
    console.log('Environment precondition: src/backend/.env is present, so config.js writes '
      + '"Environment variables loaded from .env file" instead of the .env notice; the checks '
      + 'accept either message, and a .env that sets HOST or PORT changes the address the '
      + 'defaults check (C1b) observes');
  }

  // A run that cannot resolve its declared dependency cannot start, and would leave every
  // check unobserved: say so once, up front, so the install step is read before the
  // checks rather than inferred from six verdicts. The checks still run, because each one
  // classifies its own run from what it observes and the probe can miss
  const missingDependency = await detectMissingDependency();
  if (missingDependency !== null) {
    console.log(preconditionReason(dependencyDetail(missingDependency)));
  }

  try {
    await runCheck('C1a startup line names the bound address (HOST/PORT set)', checkC1a, run);
    await runCheck('C1b startup line names the default address (HOST/PORT unset)', checkC1b, run);
    await runCheck('C2 startup line survives NODE_ENV=test', checkC2, run);
    await runCheck('C3 existing startup output preserved (development run)', checkC3, run);
    await runCheck('C4 failure path prints no startup line and exits 1', checkC4, run);
    await runCheck('C5 endpoint and per-request logging unchanged', checkC5, run);
  } finally {
    // Every handle any check shared outlives that check, so the run releases them itself
    for (const handle of run.shared) {
      try {
        await handle.kill();
      } catch (err) {
        // A listener that is already gone needs no termination
      }
    }
  }

  console.log(`${results.passed} checks passed, ${results.failed} failed, `
    + `${results.conflicted} conflicted, ${results.unobserved} unobserved`);
  return results.failed === 0 && results.conflicted === 0 && results.unobserved === 0 ? 0 : 1;
}

/**
 * Writes the usage block to standard output
 */
function printUsage() {
  USAGE_LINES.forEach((line) => console.log(line));
}

/**
 * Inspects the command line and decides whether the checks should run
 *
 * A bare invocation runs all six checks. `-h` and `--help` print the usage block and
 * stop with status 0, and any other argument is rejected with an error naming it, the
 * usage block, and status 2. Neither of those paths runs a check or prints a PASS/FAIL
 * line, so a usage answer is never mistaken for a verification result.
 *
 * @param {Array<string>} args - Arguments as passed to the script, `process.argv.slice(2)`
 * @returns {number|null} Null when the checks should run, the exit status otherwise
 */
function handleCommandLine(args) {
  if (args.length === 0) {
    return null;
  }

  if (args.length === 1 && (args[0] === '-h' || args[0] === '--help')) {
    printUsage();
    return 0;
  }

  console.log(`Unrecognised argument: ${JSON.stringify(args.join(' '))}`);
  console.log('This tool takes no arguments; run it with -h or --help for usage.');
  printUsage();
  return 2;
}

/**
 * Runs the six checks under the hard bound that keeps a wedged child from hanging the run
 */
function runChecks() {
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
}

// Only a bare invocation runs the checks: the help and rejection paths settle here,
// with no watchdog, no child process and no check ever started
const usageExitCode = handleCommandLine(process.argv.slice(2));

if (usageExitCode === null) {
  runChecks();
} else {
  process.exitCode = usageExitCode;
}
