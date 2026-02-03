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
const getConfig = require('./config');
const { PORT, HOST } = getConfig();

// Import logger
const logger = require('./utils/logger');

// Import handlers
const { handleHelloRequest } = require('./handlers/helloHandler');
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
    '/hello': handleHelloRequest
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
 * Creates an HTTP server instance without starting it
 * 
 * @returns {http.Server} The HTTP server instance
 */
function createServer() {
  // Create an HTTP server with the handleRequest function
  const serverInstance = http.createServer(handleRequest);
  
  // Handle server errors
  serverInstance.on('error', (err) => {
    logger.error('Server error', err);
  });
  
  return serverInstance;
}

/**
 * Creates and starts the HTTP server on the specified host and port
 * 
 * @param {http.Server} [serverInstance] - Optional server instance to start
 * @returns {Promise<http.Server>} Promise that resolves with the server instance when started
 */
function startServer(serverInstance) {
  return new Promise((resolve, reject) => {
    try {
      // Use provided server instance or create a new one
      server = serverInstance || createServer();
      
      // Start listening on the specified host and port
      server.listen(PORT, HOST, () => {
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
 * @param {http.Server} [serverInstance] - Optional server instance to stop
 * @returns {Promise<void>} Promise that resolves when the server has stopped
 */
function stopServer(serverInstance) {
  return new Promise((resolve, reject) => {
    try {
      // Use provided server instance or module-level server
      const targetServer = serverInstance || server;
      
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
        
        // Reset server reference if we stopped the module-level server
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

/**
 * Sets up event listeners for process termination signals to ensure graceful server shutdown
 * 
 * @param {http.Server} serverInstance - Server instance to gracefully shutdown on signals
 */
function setupGracefulShutdown(serverInstance) {
  // Handle SIGINT signal (Ctrl+C)
  process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Shutting down server...');
    stopServer(serverInstance)
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
    stopServer(serverInstance)
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        logger.error('Error during shutdown', err);
        process.exit(1);
      });
  });
}

// Export the server functions
module.exports = {
  createServer,
  startServer,
  stopServer,
  setupGracefulShutdown
};