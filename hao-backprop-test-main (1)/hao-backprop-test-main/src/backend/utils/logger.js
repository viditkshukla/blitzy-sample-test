/**
 * Logger Module
 * 
 * Provides logging functionality for the Node.js Hello World application with
 * different severity levels and specialized logging functions for specific events.
 * 
 * @module logger
 */

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
 * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
 * @param {string} message - Log message
 * @returns {string} Formatted log message
 */
function formatLogMessage(level, message) {
  const timestamp = formatTimestamp();
  return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Logs an informational message to console.log
 * 
 * @param {string} message - Log message
 */
function info(message) {
  const formattedMessage = formatLogMessage(LOG_LEVELS.INFO, message);
  console.log(formattedMessage);
}

/**
 * Logs a warning message to console.warn
 * 
 * @param {string} message - Log message
 */
function warn(message) {
  const formattedMessage = formatLogMessage(LOG_LEVELS.WARN, message);
  console.warn(formattedMessage);
}

/**
 * Logs an error message to console.error
 * If an Error object is passed, logs the message and stack trace separately
 * 
 * @param {string|Error} messageOrError - Log message or Error object
 */
function error(messageOrError) {
  if (messageOrError instanceof Error) {
    // Log the error message first
    const formattedMessage = formatLogMessage(LOG_LEVELS.ERROR, messageOrError.message);
    console.error(formattedMessage);
    // Log the stack trace separately
    if (messageOrError.stack) {
      console.error(messageOrError.stack);
    }
  } else {
    const formattedMessage = formatLogMessage(LOG_LEVELS.ERROR, messageOrError);
    console.error(formattedMessage);
  }
}

/**
 * Logs a debug message to console.debug (only in development environment)
 * 
 * @param {string} message - Log message
 */
function debug(message) {
  // Only log debug messages in development environment
  if (process.env.NODE_ENV === 'development') {
    const formattedMessage = formatLogMessage(LOG_LEVELS.DEBUG, message);
    console.debug(formattedMessage);
  }
}

/**
 * Logs information about an incoming HTTP request
 * 
 * @param {Object} req - HTTP request object
 * @param {string} req.method - HTTP method
 * @param {string} req.url - Request URL
 */
function request(req) {
  const { method, url } = req;
  info(`${method} ${url}`);
}

/**
 * Logs information about an HTTP response
 * 
 * @param {Object} res - HTTP response object
 * @param {number} res.statusCode - HTTP status code
 * @param {function} res.getHeader - Function to get response headers
 */
function response(res) {
  const { statusCode } = res;
  const contentLength = res.getHeader('Content-Length');
  info(`${statusCode} - ${contentLength} bytes`);
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
 * Logs information about an HTTP request and its response with timing
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {number} responseTime - Response time in milliseconds
 */
function logRequest(req, res, responseTime) {
  const { method, url } = req;
  const { statusCode } = res;
  
  const message = `${method} ${url} ${statusCode} ${responseTime}ms`;
  
  if (statusCode >= 500) {
    error(message);
  } else if (statusCode >= 400) {
    warn(message);
  } else {
    info(message);
  }
}

// Export individual functions for direct import
module.exports = {
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
