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

// Import logger (use object reference for test spy compatibility)
const logger = require('./utils/logger');

// Import handlers (use object reference for test spy compatibility)
const helloHandler = require('./handlers/helloHandler');
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
    '/hello': helloHandler.handleHelloRequest
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
 * Creates an HTTP server with the configured request handler
 * 
 * @returns {http.Server} The created HTTP server instance
 */
function createServer() {
  const srv = http.createServer(handleRequest);
  return srv;
}

/**
 * Sets up graceful shutdown handlers for the given server instance
 * 
 * @param {http.Server} srv - The server instance to set up shutdown for
 */
function setupGracefulShutdown(srv) {
  // Handle SIGINT signal (Ctrl+C)
  process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Shutting down server...');
    stopServer(srv)
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        logger.error('Error during shutdown', err);
        process.exit(1);
      });
  });

  // Handle SIGTERM signal (termination request)
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Shutting down server...');
    stopServer(srv)
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        logger.error('Error during shutdown', err);
        process.exit(1);
      });
  });
}

/**
 * Starts the HTTP server on the specified host and port.
 * If a server instance is provided, it is used; otherwise, a new server is created.
 * 
 * @param {http.Server} [srv] - Optional server instance to start
 * @returns {Promise<http.Server>} Promise that resolves with the server instance when started
 */
function startServer(srv) {
  return new Promise((resolve, reject) => {
    try {
      // Use provided server or create a new one
      server = srv || createServer();
      
      // Handle server errors
      server.on('error', (err) => {
        logger.error('Server error', err);
        reject(err);
      });
      
      // Start listening on the specified host and port
      server.listen(PORT, HOST, (err) => {
        if (err) {
          // Log and reject if an error occurred during startup
          logger.error('Error starting server', err);
          reject(err);
          return;
        }
        // Log successful server start
        logger.logServerStart(HOST, PORT);
        
        // Resolve the promise with the server instance
        resolve(server);
      });
    } catch (err) {
      // Log and reject if an error occurred during startup
      logger.error('Error starting server', err);
      reject(err);
    }
  });
}

/**
 * Gracefully stops the HTTP server, closing all connections
 * 
 * @param {http.Server} [srv] - Optional server instance to stop. Falls back to the module-level server if not provided.
 * @returns {Promise<void>} Promise that resolves when the server has stopped
 */
function stopServer(srv) {
  return new Promise((resolve, reject) => {
    try {
      // Use provided server or fall back to module-level server variable
      const targetServer = srv || server;
      
      // If server is null or not listening, resolve immediately
      if (!targetServer || !targetServer.listening) {
        resolve();
        return;
      }
      
      // Close the server
      targetServer.close((err) => {
        if (err) {
          // Log and reject if an error occurred during shutdown
          logger.error('Error stopping server', err);
          reject(err);
          return;
        }
        
        // Log successful server stop
        logger.logServerStop();
        
        // Reset server reference if we closed the module-level server
        if (targetServer === server) {
          server = null;
        }
        
        // Resolve the promise
        resolve();
      });
    } catch (err) {
      // Log and reject if an error occurred during shutdown
      logger.error('Error stopping server', err);
      reject(err);
    }
  });
}

// Export the server functions
module.exports = {
  createServer,
  startServer,
  stopServer,
  setupGracefulShutdown
};