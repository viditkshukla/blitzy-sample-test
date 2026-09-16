/**
 * Server Module
 * 
 * Implements a Node.js HTTP server that exposes a single REST endpoint '/welcome'
 * which serves a Welcome screen to clients. This module contains the core server
 * implementation, including server creation, request routing, and error handling.
 * 
 * @module server
 */

// Import Node.js built-in modules
const http = require('http');
const url = require('url');

// Import configurations
const { PORT, HOST } = require('./config');

// Import shared constants
const { ROUTES } = require('./utils/constants');

// Import logger
const { info, error, logServerStart, logServerStop } = require('./utils/logger');

// Import handlers
const { handleWelcomeRequest } = require('./handlers/welcomeHandler');
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
    [ROUTES.WELCOME]: handleWelcomeRequest
  };
}

/**
 * Routes incoming HTTP requests to the appropriate handler based on the URL path
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function routeRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const routes = createRoutes();
  const handler = routes[pathname];

  if (handler) {
    handler(req, res);
  } else {
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
    const middlewares = [requestLogger, securityHeaders];
    const handler = applyMiddleware(routeRequest, middlewares);

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
      server = http.createServer(handleRequest);

      server.on('error', (err) => {
        error('Server error', err);
        reject(err);
      });

      server.listen(PORT, HOST, () => {
        logServerStart(HOST, PORT);
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
      if (!server || !server.listening) {
        resolve();
        return;
      }

      server.close((err) => {
        if (err) {
          // Log and reject if an error occurred during shutdown
          error('Error stopping server', err);
          reject(err);
          return;
        }

        logServerStop();
        server = null;
        resolve();
      });
    } catch (err) {
      // Log and reject if an error occurred during shutdown
      error('Error stopping server', err);
      reject(err);
    }
  });
}

module.exports = {
  startServer,
  stopServer
};