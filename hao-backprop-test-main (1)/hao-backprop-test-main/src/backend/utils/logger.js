/**
 * Logger Module
 * 
 * Provides logging functionality for the Node.js Hello World application with
 * different severity levels and specialized logging functions for specific events.
 * 
 * @module logger
 */

// Import dependencies
const { NODE_ENV, IS_TEST } = require('../config');

// Define log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

// Maximum number of request-target characters retained in a log record. The
// request target is fully client-controlled and bounded only by Node's 16 KB
// request-line limit, so an unbounded record lets one unauthenticated client
// drive megabytes of log growth per thousand requests (CWE-779).
const MAX_LOGGED_TARGET_LENGTH = 256;

// Appended in place of the characters dropped when a target exceeds the cap.
const TARGET_TRUNCATION_MARKER = '...[truncated]';

// Substituted for a query string so that its presence stays visible to an
// operator while its values never reach the log. Query strings routinely carry
// tokens, passwords, API keys and session identifiers (CWE-532).
const REDACTED_QUERY_MARKER = '?[redacted]';

// Substituted for a request target that is absent or not a string, so a log
// record always has a value in the target position and the record keeps its
// field count.
const EMPTY_TARGET_PLACEHOLDER = '-';

/**
 * Reduces a client-controlled request target to a form that is safe and bounded
 * to persist in a log record.
 *
 * Two hazards are removed:
 *
 * 1. **Sensitive values.** Everything from the first `?` or `#` is replaced by a
 *    fixed marker, so secrets passed as query parameters are never written to
 *    the log while the fact that a query was present is still recorded
 *    (CWE-532, insertion of sensitive information into log data).
 * 2. **Unbounded length.** The retained path is capped, so a single request
 *    cannot write an arbitrarily long record (CWE-779, logging of excessive
 *    data).
 *
 * A target carrying neither a query nor a fragment, and no more than
 * {@link MAX_LOGGED_TARGET_LENGTH} characters, is returned unchanged — so an
 * ordinary access record still reads `GET /welcome 200 0ms`.
 *
 * The split is performed on the raw string rather than through `url.parse` or
 * the WHATWG `URL` constructor, because this function runs on the logging path
 * and must never throw: a malformed target such as `http://[` makes either
 * parser raise `TypeError [ERR_INVALID_URL]`, and a logging failure would take
 * down the response it was recording.
 *
 * The returned value contains no whitespace beyond whatever the client sent in
 * the path itself — an unencoded space in the request line is rejected by the
 * HTTP parser before the request reaches the application — so the four-field
 * access-record format is preserved.
 *
 * Module-private and intentionally not exported: the module's public surface is
 * unchanged by this hardening, and the sanitiser is an implementation detail of
 * the single record that writes a request target.
 *
 * @private
 * @param {string} target - Raw request target (`req.url`)
 * @returns {string} Bounded, query-redacted target safe for a log record
 */
function sanitizeRequestTarget(target) {
  if (typeof target !== 'string' || target.length === 0) {
    return EMPTY_TARGET_PLACEHOLDER;
  }

  // Locate the start of the query or fragment component, if either is present
  const componentStart = target.search(/[?#]/);
  const hasQueryOrFragment = componentStart !== -1;

  // Retain only the path portion of the target
  let path = hasQueryOrFragment ? target.slice(0, componentStart) : target;

  // Cap the retained path so one request cannot write an unbounded record
  if (path.length > MAX_LOGGED_TARGET_LENGTH) {
    path = path.slice(0, MAX_LOGGED_TARGET_LENGTH) + TARGET_TRUNCATION_MARKER;
  }

  return hasQueryOrFragment ? path + REDACTED_QUERY_MARKER : path;
}

/**
 * Formats the current date and time as an ISO string for log timestamps
 * 
 * @returns {string} Formatted timestamp in ISO format
 */
function formatTimestamp() {
  return new Date().toISOString();
}

/**
 * Formats a log message with timestamp, level, and message content
 * 
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 * @returns {string} Formatted log message
 */
function formatLogMessage(level, message) {
  const timestamp = formatTimestamp();
  return `[${timestamp}] ${level}: ${message}`;
}

/**
 * Base logging function that outputs messages to the console
 * 
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 */
function log(level, message) {
  // Suppress logging in test environment
  if (IS_TEST) {
    return;
  }
  
  const formattedMessage = formatLogMessage(level, message);
  
  if (level === LOG_LEVELS.ERROR) {
    console.error(formattedMessage);
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(formattedMessage);
  } else {
    console.log(formattedMessage);
  }
}

/**
 * Logs an informational message
 * 
 * @param {string} message - Log message
 */
function info(message) {
  log(LOG_LEVELS.INFO, message);
}

/**
 * Logs a warning message
 * 
 * @param {string} message - Log message
 */
function warn(message) {
  log(LOG_LEVELS.WARN, message);
}

/**
 * Logs an error message with optional error object details
 * 
 * @param {string} message - Log message
 * @param {Error} [err] - Optional Error object
 */
function error(message, err) {
  let errorMessage = message;
  
  if (err) {
    errorMessage += `: ${err.message}`;
    if (err.stack) {
      errorMessage += `\n${err.stack}`;
    }
  }
  
  log(LOG_LEVELS.ERROR, errorMessage);
}

/**
 * Logs a message when the server starts successfully
 * 
 * @param {string} host - Server host
 * @param {number} port - Server port
 */
function logServerStart(host, port) {
  info(`Server started on ${host}:${port}`);
}

/**
 * Logs a message when the server stops
 */
function logServerStop() {
  info('Server stopped');
}

/**
 * Logs information about an HTTP request and its response
 *
 * This access record is the single place in the service where a request target
 * is written to the log, so it is also the single place the target has to be
 * made safe. The raw value is passed through {@link sanitizeRequestTarget}
 * first, which redacts any query string and caps the length; the error handlers
 * record the method alone and leave the target to this record, so a
 * client-controlled value is written exactly once per request.
 *
 * The four-field `${method} ${target} ${statusCode} ${responseTime}ms` shape is
 * unchanged, and for an ordinary target with no query string the recorded value
 * is the target itself.
 *
 * @param {Object} req - HTTP request object
 * @param {string} req.method - HTTP method
 * @param {string} req.url - Raw request target; recorded in sanitized form
 * @param {Object} res - HTTP response object
 * @param {number} res.statusCode - HTTP status code
 * @param {number} responseTime - Response time in milliseconds
 */
function logRequest(req, res, responseTime) {
  const { method, url } = req;
  const { statusCode } = res;
  
  // Reduce the client-controlled target to a bounded, query-redacted form
  const target = sanitizeRequestTarget(url);
  
  // Build log message with method, target, status code, and response time
  const message = `${method} ${target} ${statusCode} ${responseTime}ms`;
  
  // Log with appropriate level based on status code
  if (statusCode >= 500) {
    error(message);
  } else if (statusCode >= 400) {
    warn(message);
  } else {
    info(message);
  }
}

// Export the logger object
const logger = {
  info,
  warn,
  error,
  logServerStart,
  logServerStop,
  logRequest
};

module.exports = logger;