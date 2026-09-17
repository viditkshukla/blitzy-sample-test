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
 * Resolves the logger lazily and reports whether it is usable as a sink.
 *
 * Usable means an object exposing at least one of `info`, `warn` or `error` as a
 * function. An empty object means the logger is mid-evaluation because it is the entry
 * point that required this module (the reverse cycle described above), not that the
 * logger is broken.
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
 * Schedules the one and only retry of the queue drain, on the next tick.
 *
 * Used for the reverse require cycle, where the logger has not finished evaluating yet.
 * A notice that cannot be delivered even then stays queued and is never emitted, which
 * is preferred over a raw console write.
 *
 * @returns {void}
 */
function scheduleNoticeRetry() {
  if (retryScheduled || loggerLoadFailure) {
    return;
  }

  retryScheduled = true;
  process.nextTick(flushPendingNotices);
}

/**
 * Delivers every queued notice through the logger, in the order it was raised.
 *
 * Returns immediately while the queue is empty or the configuration has not been
 * published, which is what keeps the logger from reading half-initialised exports.
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
 * Validates that the port number is within valid range
 * 
 * @param {any} port - Port value to validate
 * @returns {number} - Valid port number
 */
function validatePort(port) {
  const parsedPort = parseInt(port, 10);
  
  if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
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
  
  // Get configuration values from environment variables or use defaults
  const PORT = validatePort(process.env.PORT || DEFAULT_PORT);
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
