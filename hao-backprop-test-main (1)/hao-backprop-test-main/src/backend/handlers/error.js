/**
 * Error Handler Module
 * 
 * Implements error handling functions for the Node.js HTTP server application.
 * Provides handlers for common HTTP error scenarios including 404 Not Found,
 * 405 Method Not Allowed, and 500 Internal Server Error.
 * 
 * @module error
 */

// Import the logger for recording error information
const { warn, error } = require('../utils/logger');

/**
 * Handles 404 Not Found errors for requests to non-existent paths
 *
 * The request target is deliberately absent from this record. The access record
 * emitted by the request logger already carries it, in a bounded and
 * query-redacted form, so repeating the raw value here would write the
 * client-controlled target to the log twice and unbounded — roughly twice the
 * target's bytes per request, from an unauthenticated caller. The method is
 * retained because it is drawn from a fixed set and identifies the request.
 *
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleNotFound(req, res) {
  // Set status code to 404
  res.statusCode = 404;
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Log the not found request with warning level; the target is recorded once,
  // by the access record, rather than duplicated here
  warn(`Not Found: ${req.method}`);
  
  // Send response body and end the response
  res.end('Not Found');
}

/**
 * Handles 405 Method Not Allowed errors for requests with unsupported HTTP methods
 *
 * As with {@link handleNotFound}, the request target is left to the access
 * record rather than duplicated here, so no client-controlled value of
 * unbounded length reaches the log twice.
 *
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Array<string>} allowedMethods - Array of allowed HTTP methods
 */
function handleMethodNotAllowed(req, res, allowedMethods) {
  // Set status code to 405
  res.statusCode = 405;
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Set the Allow header to indicate which methods are permitted
  res.setHeader('Allow', allowedMethods.join(', '));
  
  // Log the method not allowed request with warning level; the target is
  // recorded once, by the access record, rather than duplicated here
  warn(`Method Not Allowed: ${req.method} - Allowed methods: ${allowedMethods.join(', ')}`);
  
  // Send response body and end the response
  res.end('Method Not Allowed');
}

/**
 * Handles 500 Internal Server Error for unexpected server-side errors
 *
 * The record names the method and the error's message. The request target is
 * left to the access record, for the reason given on {@link handleNotFound},
 * and the logger does not write the error's stack, so a request that triggers a
 * handled failure cannot disclose filesystem paths or the middleware chain.
 *
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Error} err - Error object
 */
function handleServerError(req, res, err) {
  // Set status code to 500
  res.statusCode = 500;
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Log the server error with error level, including the error's message
  error(`Server Error processing ${req.method}`, err);
  
  // Send response body with generic message (don't expose error details to client)
  res.end('Internal Server Error');
}

// Export the error handling functions
module.exports = {
  handleNotFound,
  handleMethodNotAllowed,
  handleServerError
};