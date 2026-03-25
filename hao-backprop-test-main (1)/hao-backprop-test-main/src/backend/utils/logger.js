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
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

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
  return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Base logging function that outputs messages to the console
 * 
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 */
function log(level, message) {
  const formattedMessage = formatLogMessage(level, message);
  
  if (level === LOG_LEVELS.ERROR) {
    console.error(formattedMessage);
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(formattedMessage);
  } else if (level === LOG_LEVELS.DEBUG) {
    console.debug(formattedMessage);
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
  // If first argument is an Error object, log its message and stack separately
  if (message instanceof Error) {
    const formattedMessage = formatLogMessage(LOG_LEVELS.ERROR, message.message);
    console.error(formattedMessage);
    if (message.stack) {
      console.error(message.stack);
    }
    return;
  }
  
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
 * @param {Object} req - HTTP request object
 * @param {string} req.method - HTTP method
 * @param {string} req.url - Request URL
 * @param {Object} res - HTTP response object
 * @param {number} res.statusCode - HTTP status code
 * @param {number} responseTime - Response time in milliseconds
 */
function logRequest(req, res, responseTime) {
  const { method, url } = req;
  const { statusCode } = res;
  
  // Build log message with method, url, status code, and response time
  const message = `${method} ${url} ${statusCode} ${responseTime}ms`;
  
  // Log with appropriate level based on status code
  if (statusCode >= 500) {
    error(message);
  } else if (statusCode >= 400) {
    warn(message);
  } else {
    info(message);
  }
}

/**
 * Logs a debug message (only in development environment)
 * Checks process.env.NODE_ENV at call time for dynamic environment switching
 * 
 * @param {string} message - Debug message
 */
function debug(message) {
  if (process.env.NODE_ENV === 'development') {
    log(LOG_LEVELS.DEBUG, message);
  }
}

/**
 * Logs incoming HTTP request information
 * 
 * @param {Object} req - HTTP request object
 * @param {string} req.method - HTTP method (GET, POST, etc.)
 * @param {string} req.url - Request URL path
 */
function request(req) {
  const { method, url } = req;
  log(LOG_LEVELS.INFO, `${method} ${url}`);
}

/**
 * Logs outgoing HTTP response information
 * 
 * @param {Object} res - HTTP response object
 * @param {number} res.statusCode - HTTP status code
 * @param {Function} res.getHeader - Method to get response headers
 */
function response(res) {
  const { statusCode } = res;
  const contentLength = res.getHeader('Content-Length');
  log(LOG_LEVELS.INFO, `${statusCode} - ${contentLength} bytes`);
}

// Export the logger object
const logger = {
  info,
  warn,
  error,
  debug,
  request,
  response,
  logServerStart,
  logServerStop,
  logRequest
};

module.exports = logger;