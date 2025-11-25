/**
 * Error Handler module for Node.js Hello World application
 * 
 * This module provides centralized error handling functionality for the application, 
 * including handlers for request processing errors, server errors, 404 Not Found errors,
 * and 405 Method Not Allowed errors.
 */

// Import required modules
const { HTTP_STATUS, MESSAGES, HEADERS, HTTP_METHODS } = require('./utils/constants');
const logger = require('./utils/logger');

/**
 * Handles errors that occur during request processing
 * @param {Error} error - The error that occurred
 * @param {http.ServerResponse} res - The response object to send the error
 */
function handleRequestError(error, res) {
  // Log the error with details
  logger.error(error);

  // Check if headers have already been sent
  if (res.headersSent) {
    return; // Cannot send error response if headers are already sent
  }

  // Set status code to 500
  res.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  // Set content type header
  res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
  // Send error message
  res.end(MESSAGES.SERVER_ERROR);
}

/**
 * Handles server-level errors that occur during initialization or operation
 * @param {Error} error - The error that occurred
 */
function handleServerError(error) {
  // Log the error with details
  logger.error(error);

  // Check for critical errors like port already in use
  if (error.code === 'EADDRINUSE') {
    logger.error('Port is already in use. Please use a different port or ensure no other service is using this port.');
  }
  
  // Other server error handling logic can be added here
}

/**
 * Handles 404 Not Found responses for undefined routes
 * @param {http.ServerResponse} res - The response object
 */
function handle404(res) {
  // Set status code to 404
  res.statusCode = HTTP_STATUS.NOT_FOUND;
  // Set content type header
  res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
  // Send not found message
  res.end(MESSAGES.NOT_FOUND);
  
  // Log the 404 response
  logger.info(`Responding with 404 Not Found`);
}

/**
 * Handles 405 Method Not Allowed responses for unsupported HTTP methods
 * @param {http.ServerResponse} res - The response object
 */
function handle405(res) {
  // Set status code to 405
  res.statusCode = HTTP_STATUS.METHOD_NOT_ALLOWED;
  // Set content type header
  res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
  // Set allow header to indicate allowed methods
  res.setHeader(HEADERS.ALLOW, HTTP_METHODS.GET);
  // Send method not allowed message
  res.end(MESSAGES.METHOD_NOT_ALLOWED);
  
  // Log the 405 response
  logger.info(`Responding with 405 Method Not Allowed`);
}

// Export the error handling functions
module.exports = {
  handleRequestError,
  handleServerError,
  handle404,
  handle405
};