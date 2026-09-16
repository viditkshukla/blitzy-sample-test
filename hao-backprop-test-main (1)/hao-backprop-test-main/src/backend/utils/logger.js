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

// Placeholder written in place of a request field the request did not carry, so
// every request record keeps the same field count and stays machine-readable.
const MISSING_FIELD = '-';

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
 * Extracts the loggable path from a raw HTTP request target, discarding the
 * query string and the fragment.
 * 
 * Query values routinely carry credentials, password-reset codes, email
 * addresses and other personal data, while the service dispatches on the
 * pathname alone, so nothing downstream of this module needs them. Writing the
 * raw target into a log record would persist those values verbatim in process
 * logs (CWE-532), which is why the query string is dropped here, at the single
 * point where request targets enter the log stream, rather than at each call
 * site, where one missed caller would reintroduce the exposure.
 * 
 * The boundary is found by scanning for the first delimiter rather than by
 * parsing the target as a URL: an origin-form request target always begins with
 * its path, the scan cannot throw on an absent or malformed target, and the
 * path's own percent-encoding is preserved exactly as the client sent it.
 * 
 * @param {string} rawUrl - Raw request target, for example '/welcome?token=abc'
 * @returns {string} The path with no query string and no fragment, or the
 *                   missing-field placeholder when no usable path is present
 */
function extractRequestPath(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.length === 0) {
    return MISSING_FIELD;
  }
  
  // Cut the target at whichever delimiter comes first: '?' opens the query
  // string and '#' opens the fragment, and everything from there on is data the
  // access record must not carry.
  let boundary = rawUrl.length;
  const queryIndex = rawUrl.indexOf('?');
  const fragmentIndex = rawUrl.indexOf('#');
  
  if (queryIndex !== -1) {
    boundary = queryIndex;
  }
  
  if (fragmentIndex !== -1 && fragmentIndex < boundary) {
    boundary = fragmentIndex;
  }
  
  const path = rawUrl.slice(0, boundary);
  
  return path.length > 0 ? path : MISSING_FIELD;
}

/**
 * Logs an incoming HTTP request as it is received, before it is dispatched
 * 
 * This is the request-start counterpart of logRequest, which records the
 * completed exchange. Only the method and the path are emitted: the query
 * string is excluded for the reason documented on extractRequestPath.
 * 
 * @param {Object} req - HTTP request object
 * @param {string} req.method - HTTP method
 * @param {string} req.url - Raw request target; only its path is logged
 */
function request(req) {
  const method = req && req.method ? req.method : MISSING_FIELD;
  const path = extractRequestPath(req && req.url);
  
  info(`${method} ${path}`);
}

/**
 * Logs information about an HTTP request and its response
 * 
 * @param {Object} req - HTTP request object
 * @param {string} req.method - HTTP method
 * @param {string} req.url - Raw request target; only its path is logged
 * @param {Object} res - HTTP response object
 * @param {number} res.statusCode - HTTP status code
 * @param {number} responseTime - Response time in milliseconds
 */
function logRequest(req, res, responseTime) {
  const { method, url } = req;
  const { statusCode } = res;
  
  // Reduce the raw target to its path before it reaches the record, so query
  // values such as '?token=...' are never written to the log (see
  // extractRequestPath). The field shape is unchanged.
  const path = extractRequestPath(url);
  
  // Build log message with method, path, status code, and response time
  const message = `${method} ${path} ${statusCode} ${responseTime}ms`;
  
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
  request,
  logRequest
};

module.exports = logger;