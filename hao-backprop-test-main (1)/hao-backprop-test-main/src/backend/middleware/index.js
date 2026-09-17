/**
 * Middleware Module
 * 
 * Implements middleware functions for the Node.js HTTP server application.
 * This module provides middleware for request logging, security headers, and
 * error handling that can be applied to both the native HTTP server and 
 * Express.js implementations.
 * 
 * @module middleware
 */

// Import dependencies
const { logRequest, warn, error } = require('../utils/logger');
const { handleServerError } = require('../handlers/error');

/**
 * Middleware that logs information about HTTP requests and responses
 * 
 * The record is emitted from the response object's own lifecycle events, not
 * from a wrapper around res.end. Do not restore the wrapper: it ran before the
 * response bytes were handed off, which made the measured duration cover handler
 * time only and made an abandoned response indistinguishable from a delivered
 * one in the log.
 * 
 * - 'finish' fires once the last segment of headers and body has been handed to
 *   the operating system, so the duration covers delivery and res.statusCode is
 *   final by then. This is the ordinary access record, emitted by logRequest,
 *   which selects INFO/WARN/ERROR from the status code.
 * - 'close' fires when the response is torn down. Reaching it without having
 *   emitted the access record means the client went away before the response
 *   completed, so that is reported as a premature termination at WARN level: an
 *   aborted client is not a server fault, and ERROR here would raise a false
 *   alarm on any error-rate alert.
 * 
 * Exactly one record is written per request. A delivered response fires 'finish'
 * then 'close'; an abandoned one fires 'close' alone. The `recorded` flag, rather
 * than res.writableEnded, is what distinguishes them, because res.end() may have
 * been called on a response whose bytes never reached the client.
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Function to call the next middleware
 */
function requestLogger(req, res, next) {
  // Record start time to calculate response time
  const startTime = Date.now();
  
  // Set by whichever response event fires first, so the other one stays silent
  let recorded = false;
  
  // The response was fully handed off for delivery: emit the access record
  res.once('finish', () => {
    if (recorded) {
      return;
    }
    recorded = true;
    
    // Calculate response time, now inclusive of delivery
    const responseTime = Date.now() - startTime;
    
    // Log the request using the logger utility
    logRequest(req, res, responseTime);
  });
  
  // The response was torn down; if nothing has been recorded yet, it never completed
  res.once('close', () => {
    if (recorded) {
      return;
    }
    recorded = true;
    
    // Calculate the time spent before the connection went away
    const responseTime = Date.now() - startTime;
    
    // Keep the access line's four leading fields in the same order so existing
    // log parsers keep working, then append prose that makes the record
    // self-describing. Nothing client-supplied beyond the method and URL the
    // access line already carries is logged - no headers, no body, no peer address.
    warn(`${req.method} ${req.url} ${res.statusCode} ${responseTime}ms client closed the connection before the response completed`);
  });
  
  // Continue to the next middleware or handler
  next();
}

/**
 * Middleware that adds security headers to HTTP responses
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Function to call the next middleware
 */
function securityHeaders(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Content Security Policy to restrict resource loading
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  
  // Continue to the next middleware or handler
  next();
}

/**
 * Middleware that handles errors in the request processing pipeline
 * 
 * @param {Error} err - Error object
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Function to call the next middleware (not used in this case)
 */
function errorMiddleware(err, req, res, next) {
  // Use the error handler to process the server error
  handleServerError(req, res, err);
  
  // No need to call next() as this is the final error handler
}

/**
 * Helper function that applies an array of middleware functions to a request handler
 * 
 * @param {Function} handler - The request handler function
 * @param {Array<Function>} middlewares - Array of middleware functions to apply
 * @returns {Function} Enhanced request handler with middleware applied
 */
function applyMiddleware(handler, middlewares = []) {
  // If no middlewares provided, return the original handler
  if (!middlewares.length) {
    return handler;
  }
  
  // Create a middleware chain that ends with the handler
  return function(req, res) {
    try {
      // Execute the middleware chain
      createMiddlewareChain(middlewares, handler)(req, res);
    } catch (err) {
      // Handle any synchronous errors that occur
      errorMiddleware(err, req, res);
    }
  };
}

/**
 * Creates a chain of middleware functions that execute in sequence
 * 
 * @param {Array<Function>} middlewares - Array of middleware functions
 * @param {Function} finalHandler - The final handler to call after all middleware
 * @returns {Function} Function that executes the middleware chain
 * @private
 */
function createMiddlewareChain(middlewares, finalHandler) {
  return function(req, res) {
    let index = 0;
    
    // Function to call the next middleware in the chain
    function next(err) {
      // If an error occurred, skip to error handling
      if (err) {
        return errorMiddleware(err, req, res);
      }
      
      // Get the current middleware
      const middleware = index < middlewares.length
        ? middlewares[index++]
        : finalHandler;
        
      // If we've reached the end of the chain, stop
      if (!middleware) return;
      
      try {
        // Call the current middleware with request, response, and next
        middleware(req, res, next);
      } catch (err) {
        // Handle any synchronous errors
        next(err);
      }
    }
    
    // Start the middleware chain
    next();
  };
}

// Export middleware functions and helpers
module.exports = {
  requestLogger,
  securityHeaders,
  errorMiddleware,
  applyMiddleware
};