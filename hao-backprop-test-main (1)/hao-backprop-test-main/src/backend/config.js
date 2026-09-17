/**
 * Configuration Module
 * 
 * Loads environment variables from .env file and provides configuration settings with sensible defaults.
 * This module centralizes all configuration values used throughout the application.
 * 
 * @module config
 */

// External dependencies
const dotenv = require('dotenv'); // dotenv v16.0.3
const path = require('path'); // Node.js built-in module

// Default configuration values
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_LOG_LEVEL = 'INFO';

/**
 * Shape a PORT value must have, in full, before it is worth range-checking.
 *
 * Anchored at BOTH ends on purpose. `parseInt` stops at the first character that is not a
 * digit and returns the numeric PREFIX it has already read, so `parseInt('3000extra', 10)`
 * is 3000 and `parseInt('3243; touch x', 10)` is 3243. Range-checking that prefix alone
 * accepts a corrupted or templated-wrong value, binds a port the configuration never
 * specified and discards the remainder of the string without a word - while a value with
 * no leading digit at all is warned about and defaulted. Testing the whole trimmed string
 * first removes that inconsistency: a partly numeric value takes the same
 * warn-and-default path a wholly non-numeric one already takes.
 *
 * Digits only: a sign, a decimal point or an exponent is not a TCP port, and each of
 * those is a value `parseInt` would otherwise coerce into one.
 *
 * @type {RegExp}
 */
const PORT_PATTERN = /^[0-9]+$/;

/*
 * Deferred notice delivery
 * ------------------------
 * Every message this module produces has to go through `utils/logger.js` so that a
 * single grammar - `[<ISO timestamp>] <LEVEL>: <message>` - and a single set of
 * suppression rules (the logger writes nothing when NODE_ENV is `test`) govern the
 * whole process output. The logger cannot simply be required at the top of this file:
 *
 *   - `utils/logger.js` destructures this module ONCE, in its first statement
 *     (`const { NODE_ENV, IS_TEST } = require('../config')`), so it reads whatever
 *     `module.exports` holds at the moment it is evaluated.
 *   - Configuration resolution happens during this module's own evaluation, before
 *     `module.exports` is assigned. A top-level (or call-time) require from here would
 *     therefore hand the logger this module's default, empty exports: `IS_TEST` would be
 *     `undefined` and the logger's test-mode suppression would be disabled for the whole
 *     process.
 *
 * So the notices `getConfig()` raises are queued and delivered only once
 * `module.exports` holds the resolved configuration, with the logger required lazily at
 * that point. The reverse order is also handled: when `utils/logger.js` is the entry
 * point it is still mid-evaluation when the queue is first flushed, and its exports are
 * an empty object with no callable levels. That case defers the drain by exactly one
 * `process.nextTick`, by which time the logger has finished evaluating. Nothing here
 * ever writes to `console` directly: a raw sink is the defect this design removes.
 *
 * The deferred half of that drain never touches the module loader. A `process.nextTick`
 * callback outlives the stack that scheduled it, and under a test runner it can outlive
 * the module registry as well: Jest tears its environment down as soon as a test file's
 * last assertion resolves, and a `require` issued afterwards is reported as
 * "You are trying to `import` a file after the Jest environment has been torn down" -
 * printed by the runtime itself with `process.exitCode` set to 1, so no `try`/`catch`
 * around the require can intercept it. The retry therefore captures the logger's module
 * RECORD synchronously, while the loader is demonstrably usable, and the deferred
 * callback only reads that record's `exports` property. A property read is inert
 * whatever has become of the loader, and the record's `exports` is live - it is the
 * binding `module.exports = logger` assigns at the end of `utils/logger.js` - so the
 * finished logger is what the notice is delivered through.
 */

/**
 * FIFO queue of notices raised while the configuration is still being resolved.
 *
 * Each entry keeps the logger level it must be delivered at and the exact message text.
 * `undeliverable` is set only if a resolved sink threw while writing the notice, which
 * makes the drain discard it instead of reproducing the same failure on every flush.
 *
 * @type {Array<{level: string, message: string, undeliverable?: string}>}
 */
const pendingNotices = [];

/**
 * Whether `module.exports` already holds the resolved configuration object.
 *
 * While this is false the logger must not be required, because it would capture this
 * module's empty exports. Set to true immediately after the export assignment.
 *
 * @type {boolean}
 */
let configurationPublished = false;

/**
 * Whether the single `process.nextTick` retry has been scheduled.
 *
 * Never reset, so at most one retry is ever queued: there is no nextTick loop and no
 * busy-wait, whatever the require order turns out to be.
 *
 * @type {boolean}
 */
let retryScheduled = false;

/**
 * The reason `require('./utils/logger')` failed, when it has failed.
 *
 * A module that throws while loading throws again when it is re-required, so this also
 * suppresses the retry: there is nothing a second attempt could reach.
 *
 * @type {string|null}
 */
let loggerLoadFailure = null;

/**
 * The logger's module record, captured while the loader was still usable.
 *
 * Held only for the one deferred drain: `scheduleNoticeRetry()` captures it on the
 * synchronous path and `drainDeferredNotices()` reads its `exports` on the next tick,
 * which is what keeps the deferred callback out of the module system entirely. Null
 * means no record could be captured, and therefore that no retry was scheduled.
 *
 * @type {NodeModule|null}
 */
let deferredLoggerModule = null;

/**
 * Captures the logger's module record from the loader's cache, without loading anything.
 *
 * Every CommonJS loader registers a module record BEFORE it executes the module body -
 * that is the mechanism a circular require relies on - and Jest's registry behaves the
 * same way, with `require.cache` exposed as a live proxy over it. So in the reverse
 * cycle, where the logger is mid-evaluation because it is what triggered this module's
 * evaluation, its record is already present and its `exports` is the binding the
 * logger's final `module.exports = logger` assigns. Capturing the record rather than the
 * exports object is what makes that reassignment visible: the empty object handed back
 * during the cycle is stale forever, and caching it would silently discard the notice.
 *
 * Returns null rather than throwing on any host that does not expose a require cache, or
 * cannot resolve the logger's path, because a missing log line must never fail
 * configuration resolution.
 *
 * @returns {NodeModule|null} The logger's module record, or null when unobtainable
 */
function captureLoggerModule() {
  // A loader without a cache (a bundler's shim, an embedded runtime) cannot hand back a
  // record, so there is nothing a later tick could read.
  if (!require.cache) {
    return null;
  }

  try {
    return require.cache[require.resolve('./utils/logger')] || null;
  } catch (resolveError) {
    // `require.resolve` throws when the module cannot be located at all - the same
    // condition `resolveLogger()` records as a load failure. Silent here: the notices
    // stay queued, which is this module's documented fallback.
    return null;
  }
}

/**
 * Reports whether a candidate module's exports can accept a notice.
 *
 * Usable means an object exposing at least one of `info`, `warn` or `error` as a
 * function. An empty object means the logger is mid-evaluation because it is the entry
 * point that required this module (the reverse cycle described above), not that the
 * logger is broken.
 *
 * Shared by both drain entry points so that the synchronous flush and the deferred
 * retry accept exactly the same shapes - and so that neither of them assumes anything
 * about the logger beyond those three levels, which is all this module needs from it.
 *
 * @param {any} candidate - Value a loader or a module record handed back as the logger
 * @returns {object|null} The candidate when it can accept a notice, otherwise null
 */
function asNoticeSink(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  // A circular require hands back the logger's still-empty exports object, and Node
  // replaces that object's prototype with a proxy that prints
  // "Warning: Accessing non-existent property 'info' of module exports inside circular
  // dependency" to stderr for any property miss. Reading a property here would therefore
  // produce exactly the kind of unformatted output this module exists to eliminate.
  // `Reflect.ownKeys` never consults the prototype, so the half-initialised logger is
  // recognised without emitting anything.
  if (Reflect.ownKeys(candidate).length === 0) {
    return null;
  }

  const hasSink = typeof candidate.info === 'function'
    || typeof candidate.warn === 'function'
    || typeof candidate.error === 'function';

  return hasSink ? candidate : null;
}

/**
 * Resolves the logger lazily and reports whether it is usable as a sink.
 *
 * Every caller of this function is on the synchronous path - this module's own
 * evaluation, driven by `notify()` and by the flush that follows the export assignment -
 * where the loader is demonstrably usable because it is the loader that is running this
 * file. The deferred drain deliberately does not come through here: it reads the module
 * record captured for it instead, so that no `require` is ever issued from a
 * `process.nextTick` callback.
 *
 * @returns {object|null} The logger module when it can accept a notice, otherwise null
 */
function resolveLogger() {
  let candidate;

  try {
    // Deferred deliberately: by the time this runs, `require('../config')` inside the
    // logger resolves to this module's complete exports.
    candidate = require('./utils/logger');
  } catch (loadError) {
    // Configuration resolution must not fail because a log line could not be written,
    // so the notices stay queued and the reason is remembered for the retry decision.
    loggerLoadFailure = loadError.message;
    return null;
  }

  return asNoticeSink(candidate);
}

/**
 * Schedules the one and only retry of the queue drain, on the next tick.
 *
 * Used for the reverse require cycle, where the logger has not finished evaluating yet.
 * The logger's module record is captured here, synchronously, because this is the last
 * moment at which the loader is known to be usable; the retry is scheduled only when
 * there is a record for it to read. When there is none, the notices stay queued and are
 * never emitted, which is preferred over a raw console write.
 *
 * @returns {void}
 */
function scheduleNoticeRetry() {
  if (retryScheduled || loggerLoadFailure) {
    return;
  }

  deferredLoggerModule = captureLoggerModule();

  if (!deferredLoggerModule) {
    // Nothing a later tick could read, so scheduling one would only burn a tick and,
    // under a test runner, risk running after the environment is gone. `retryScheduled`
    // stays false: a subsequent synchronous `notify()` may still find the loader in a
    // state where a record can be captured.
    return;
  }

  retryScheduled = true;
  process.nextTick(drainDeferredNotices);
}

/**
 * Drains the queue on the next tick, through the module record captured for it.
 *
 * Contains no `require` call, and must not acquire one. This callback outlives the stack
 * that scheduled it and, under a test runner, the module registry itself: Jest reports a
 * require issued after its environment has been torn down by printing a `ReferenceError`
 * and setting `process.exitCode = 1` from inside the runtime, which no `try`/`catch` in
 * this module can intercept. Reading `exports` off a record captured earlier is a plain
 * property access, so it is inert whatever has become of the loader, and it still sees
 * the finished logger because `module.exports = logger` writes to that same record.
 *
 * @returns {void}
 */
function drainDeferredNotices() {
  if (pendingNotices.length === 0 || !configurationPublished) {
    return;
  }

  const logger = asNoticeSink(deferredLoggerModule.exports);

  if (!logger) {
    // The logger never finished exporting a usable sink - it threw while evaluating, or
    // the environment discarded it. There is no second retry by design, so the notices
    // stay queued and silent.
    return;
  }

  deliverQueuedNotices(logger);
}

/**
 * Writes every queued notice to the resolved sink, in the order it was raised.
 *
 * The queue is drained from the front and each notice is removed only once it has been
 * written, so a sink that fails mid-queue leaves the remaining notices in order.
 *
 * @param {object} logger - Sink accepted by `asNoticeSink`, keyed by notice level
 * @returns {void}
 */
function deliverQueuedNotices(logger) {
  while (pendingNotices.length > 0) {
    const notice = pendingNotices[0];
    const sink = logger[notice.level];

    // Several test suites install partial `jest.mock` logger factories that expose only
    // the levels they assert on, and a notice previously rejected by its sink cannot
    // succeed now. Both are discarded rather than allowed to throw or to block the
    // queue inside an unrelated suite.
    if (typeof sink !== 'function' || notice.undeliverable) {
      pendingNotices.shift();
      continue;
    }

    try {
      sink(notice.message);
      pendingNotices.shift();
    } catch (deliveryError) {
      // Mark the notice so the next flush drops it, and stop draining so the notices
      // behind it keep their order for that flush.
      notice.undeliverable = deliveryError.message;
      return;
    }
  }
}

/**
 * Delivers every queued notice through the logger, in the order it was raised.
 *
 * The synchronous entry point, called from `notify()` and once more after the export
 * assignment. Returns immediately while the queue is empty or the configuration has not
 * been published, which is what keeps the logger from reading half-initialised exports.
 *
 * @returns {void}
 */
function flushPendingNotices() {
  if (pendingNotices.length === 0 || !configurationPublished) {
    return;
  }

  const logger = resolveLogger();

  if (!logger) {
    scheduleNoticeRetry();
    return;
  }

  deliverQueuedNotices(logger);
}

/**
 * Records a notice for delivery through the logger and attempts to deliver the queue.
 *
 * This is the only sink this module uses; it replaces the direct `console` writes that
 * bypassed the logger's format and its test-mode suppression.
 *
 * @param {'info'|'warn'|'error'} level - Logger level the notice must be written at
 * @param {string} message - Single-line message text, already fully formatted
 * @returns {void}
 */
function notify(level, message) {
  pendingNotices.push({ level, message });
  flushPendingNotices();
}

/**
 * Loads environment variables from .env file if it exists
 */
function loadEnv() {
  try {
    const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    
    if (result.error) {
      // If .env file doesn't exist or can't be read, that's fine in production
      // as environment variables should be set through the deployment platform
      if (process.env.NODE_ENV !== 'production') {
        notify('info', 'No .env file found or unable to read it. Using default values and environment variables.');
      }
    } else if (process.env.NODE_ENV === 'development') {
      notify('info', 'Environment variables loaded from .env file');
    }
  } catch (error) {
    // Composed into one line on purpose: passing the Error object as the logger's second
    // argument would append its stack, and the continuation lines would not carry the
    // `[timestamp] LEVEL:` prefix every log line is required to have.
    notify('error', `Error loading .env file: ${error.message}`);
  }
}

/**
 * Validates that the port value is a whole number within the valid TCP port range.
 *
 * The value is checked as a complete string against `PORT_PATTERN` BEFORE it is parsed,
 * so anything only partly numeric is rejected rather than silently truncated to its
 * leading digits. Whatever the value, an unusable one is reported at `warn` and the
 * documented default is returned; the configuration never fails to resolve over a port.
 *
 * @param {any} port - Port value to validate, from the environment or a numeric caller
 * @returns {number} - The validated port number, or `DEFAULT_PORT` when unusable
 */
function validatePort(port) {
  // Stringified so one rule covers both an environment variable and a numeric caller,
  // and trimmed because .env and YAML sources pad values with surrounding whitespace -
  // that is formatting, not corruption, so it is stripped rather than rejected.
  const rawPort = String(port).trim();

  if (!PORT_PATTERN.test(rawPort)) {
    // An empty or whitespace-only value would otherwise render as `Invalid port: .`;
    // the `(empty)` literal keeps the line legible. Every other value is reported
    // verbatim, exactly as it was supplied.
    const reportedPort = rawPort === '' ? '(empty)' : port;
    notify('warn', `Invalid port: ${reportedPort}. Using default port: ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
  }

  // Safe now: the string is digits end to end, so the parse consumes all of it.
  const parsedPort = parseInt(rawPort, 10);

  if (parsedPort < 1 || parsedPort > 65535) {
    notify('warn', `Invalid port: ${port}. Using default port: ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
  }

  return parsedPort;
}

/**
 * Retrieves the configuration object with all settings
 * 
 * @returns {object} - Configuration object
 */
function getConfig() {
  // Load environment variables from .env file if it exists
  loadEnv();
  
  // Get configuration values from environment variables or use defaults.
  //
  // PORT distinguishes "not configured" from "configured badly", which `||` cannot: an
  // explicitly set but empty PORT is falsy, so it would fall through to the default and
  // never reach the validator - the same silent adoption of a broken value that
  // prefix-based parsing used to allow. Absent means take the documented default;
  // present means validate it and say so when it is unusable.
  const PORT = process.env.PORT === undefined
    ? DEFAULT_PORT
    : validatePort(process.env.PORT);
  const HOST = process.env.HOST || DEFAULT_HOST;
  const NODE_ENV = process.env.NODE_ENV || DEFAULT_NODE_ENV;
  const LOG_LEVEL = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
  
  // Environment helper flags
  const IS_DEV = NODE_ENV === 'development';
  const IS_PROD = NODE_ENV === 'production';
  const IS_TEST = NODE_ENV === 'test';
  
  return {
    PORT,
    HOST,
    NODE_ENV,
    LOG_LEVEL,
    IS_DEV,
    IS_PROD,
    IS_TEST
  };
}

// Get configuration
const config = getConfig();

// Export configuration
module.exports = config;

// The resolved configuration is now reachable through `require('./config')`, so the
// logger can be loaded without observing a half-initialised module. Publish first, then
// deliver every notice `getConfig()` queued above.
configurationPublished = true;
flushPendingNotices();
