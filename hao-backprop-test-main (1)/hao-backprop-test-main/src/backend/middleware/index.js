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
 * Exactly one access record is emitted per exchange, and it is emitted from the
 * response's own completion rather than from the invocation of `res.end`:
 * the completed-request line is written by a `finish` listener, so a response
 * that never finished is never reported as completed, and the measured duration
 * spans the whole exchange including the time Node spends flushing the body.
 * 
 * A connection torn down before the response completed emits `close` with no
 * preceding `finish`; that case is reported distinctly at warning level so an
 * aborted request stays visible in the log while remaining impossible to
 * mistake for a served response.
 * 
 * `requestLogger` is a public export, so a response object that is not an
 * EventEmitter — a plain object carrying only an `end` function — is still
 * supported: for those the original `end` is wrapped, called first, and the
 * record is emitted only after it has returned successfully.
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Function to call the next middleware
 */
function requestLogger(req, res, next) {
  // Record start time to calculate response time
  const startTime = Date.now();
  
  // One record per exchange. On a normal response 'close' fires after 'finish',
  // and an aborted connection can fire 'close' alone, so both listeners share
  // this flag and each checks it before writing: whichever event arrives first
  // produces the record and suppresses the other.
  let recorded = false;
  
  // Emits the completed-request access record through the logger utility, which
  // keeps the status-based level routing. Any failure inside the logger is
  // contained here because these calls run from an event listener, where an
  // escaping exception would become an uncaught exception for the process.
  function recordCompletedRequest() {
    if (recorded) return;
    recorded = true;
    
    try {
      logRequest(req, res, Date.now() - startTime);
    } catch (err) {
      error('Failed to log request', err);
    }
  }
  
  if (typeof res.once === 'function') {
    // 'finish' is the response's own statement that it completed: the record
    // written here describes a response that genuinely went out.
    res.once('finish', recordCompletedRequest);
    
    // 'close' without a preceding 'finish' means the exchange ended early.
    res.once('close', function() {
      if (recorded) return;
      recorded = true;
      
      // Keep the access-log field order recognisable (method, path, status,
      // duration) but log only the path: a raw request URL would carry
      // query-string values such as tokens or addresses into the process log.
      const requestUrl = typeof req.url === 'string' ? req.url : '';
      const queryStart = requestUrl.indexOf('?');
      const requestPath = queryStart === -1
        ? requestUrl
        : requestUrl.slice(0, queryStart);
      
      try {
        warn(
          `${req.method} ${requestPath} ${res.statusCode} ` +
          `${Date.now() - startTime}ms - response did not complete`
        );
      } catch (err) {
        error('Failed to log prematurely closed request', err);
      }
    });
  } else {
    // Fallback for a response object that is not an EventEmitter. Store the
    // original end method and wrap it so the original runs first: the record is
    // written only once the response-ending operation has returned, so an `end`
    // that throws produces no completed-request line here either.
    const originalEnd = res.end;
    
    res.end = function(chunk, encoding) {
      // Call the original end method with the same arguments and preserve its
      // return value for callers that chain on it
      const result = originalEnd.call(this, chunk, encoding);
      
      recordCompletedRequest();
      
      return result;
    };
  }
  
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