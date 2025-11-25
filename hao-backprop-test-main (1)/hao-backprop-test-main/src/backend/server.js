/**
 * Server Module
 * 
 * Implements a Node.js HTTP server that exposes a single REST endpoint '/hello'
 * which returns 'Hello world' to clients. This module contains the core server
 * implementation, including server creation, request routing, and error handling.
 * 
 * @module server
 */

// Import Node.js built-in modules
const http = require('http'); // native
const url = require('url'); // native

// Import configurations
const { PORT, HOST } = require('./config');

// Import logger
const { info, error, logServerStart, logServerStop } = require('./utils/logger');

// Import handlers
const handleHello = require('./handlers/hello');
const { handleNotFound, handleServerError } = require('./handlers/error');

// Import middleware
const { requestLogger, securityHeaders, applyMiddleware } = require('./middleware/index');

// Server instance reference
let server = null;

/**
 * Creates a mapping of URL paths to their handler functions
 * 
 * @returns {Object} Object mapping paths to handler functions
 */
function createRoutes() {
  return {
    '/hello': handleHello
  };
}

/**
 * Routes incoming HTTP requests to the appropriate handler based on the URL path
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function routeRequest(req, res) {
  // Parse the URL from the request
  const parsedUrl = url.parse(req.url, true);
  
  // Extract the pathname from the parsed URL
  const pathname = parsedUrl.pathname;
  
  // Get the routes mapping
  const routes = createRoutes();
  
  // Get the handler for this path, if it exists
  const handler = routes[pathname];
  
  // If a handler exists for this path, call it
  if (handler) {
    handler(req, res);
  } else {
    // Otherwise, handle as a 404 Not Found
    handleNotFound(req, res);
  }
}

/**
 * Main request handler function that applies middleware and routes the request
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleRequest(req, res) {
  try {
    // Create an array of middleware functions
    const middlewares = [requestLogger, securityHeaders];
    
    // Apply middleware to the routeRequest function
    const handler = applyMiddleware(routeRequest, middlewares);
    
    // Call the enhanced handler
    handler(req, res);
  } catch (err) {
    // Handle any errors that occur during request processing
    handleServerError(req, res, err);
  }
}

/**
 * Creates and starts the HTTP server on the specified host and port
 * 
 * @returns {Promise<http.Server>} Promise that resolves with the server instance when started
 */
function startServer() {
  return new Promise((resolve, reject) => {
    try {
      // Create an HTTP server with the handleRequest function
      server = http.createServer(handleRequest);
      
      // Handle server errors
      server.on('error', (err) => {
        error('Server error', err);
        reject(err);
      });
      
      // Start listening on the specified host and port
      server.listen(PORT, HOST, () => {
        // Log successful server start
        logServerStart(HOST, PORT);
        
        // Resolve the promise with the server instance
        resolve(server);
      });
    } catch (err) {
      // Log and reject if an error occurred during startup
      error('Error starting server', err);
      reject(err);
    }
  });
}

/**
 * Gracefully stops the HTTP server, closing all connections
 * 
 * @returns {Promise<void>} Promise that resolves when the server has stopped
 */
function stopServer() {
  return new Promise((resolve, reject) => {
    try {
      // If server is null or not listening, resolve immediately
      if (!server || !server.listening) {
        resolve();
        return;
      }
      
      // Close the server
      server.close((err) => {
        if (err) {
          // Log and reject if an error occurred during shutdown
          error('Error stopping server', err);
          reject(err);
          return;
        }
        
        // Log successful server stop
        logServerStop();
        
        // Reset server reference
        server = null;
        
        // Resolve the promise
        resolve();
      });
    } catch (err) {
      // Log and reject if an error occurred during shutdown
      error('Error stopping server', err);
      reject(err);
    }
  });
}

// Export the server functions
module.exports = {
  startServer,
  stopServer
};