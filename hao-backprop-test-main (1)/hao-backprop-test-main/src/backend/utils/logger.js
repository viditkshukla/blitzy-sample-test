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