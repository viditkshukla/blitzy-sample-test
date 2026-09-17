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
const http = require('http'); // native
const url = require('url'); // native

// Import configurations
const { PORT, HOST } = require('./config');

// Import shared constants
const { ROUTES } = require('./utils/constants');

// Import logger
const { info, warn, error, logServerStart, logServerStop } = require('./utils/logger');

// Import handlers
const { handleWelcomeRequest } = require('./handlers/welcomeHandler');
const { handleNotFound, handleServerError } = require('./handlers/error');

// Import middleware
const { requestLogger, securityHeaders, applyMiddleware } = require('./middleware/index');

// Server instance reference
let server = null;

// Wire responses for requests Node's HTTP parser rejects before they reach the
// application. Registering a 'clientError' listener overrides the server's
// default reply entirely, so the listener has to emit these itself or a
// rejected client would receive nothing at all. The mapping and the byte layout
// match Node's own defaults exactly, so the status a client sees is unchanged.
const PARSER_ERROR_RESPONSES = {
  HPE_HEADER_OVERFLOW: 'HTTP/1.1 431 Request Header Fields Too Large\r\nConnection: close\r\n\r\n',
  HPE_CHUNK_EXTENSIONS_OVERFLOW: 'HTTP/1.1 413 Payload Too Large\r\nConnection: close\r\n\r\n',
  ERR_HTTP_REQUEST_TIMEOUT: 'HTTP/1.1 408 Request Timeout\r\nConnection: close\r\n\r\n'
};

// Sent for every other parser rejection, as Node's default does
const DEFAULT_PARSER_ERROR_RESPONSE = 'HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n';

// Substituted when a parser error carries no code, so the record always names one
const UNKNOWN_PARSER_ERROR_CODE = 'HPE_UNKNOWN';

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
  // Parse the URL from the request
  //
  // The target is client-controlled, and a malformed absolute-form value such
  // as 'http://[' makes url.parse throw TypeError [ERR_INVALID_URL]. Left
  // unguarded that became a 500 whose log record carried a stack trace with
  // absolute filesystem paths and the middleware chain, so the failure is
  // contained here instead.
  let pathname;

  try {
    const parsedUrl = url.parse(req.url, true);

    // Extract the pathname from the parsed URL
    pathname = parsedUrl.pathname;
  } catch (err) {
    // Record the rejection by its error code alone — no client-controlled
    // bytes, so the record is bounded and cannot carry injected content
    warn(`Malformed request target rejected: ${err.code || err.name}`);

    // A target that cannot be parsed addresses no route, so it is answered the
    // same way as any unregistered path
    handleNotFound(req, res);
    return;
  }
  
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
 * Answers and records a request rejected by Node's HTTP parser
 *
 * The parser rejects a malformed request line, an unknown method token, an
 * unsupported version or an oversized header before any request object exists,
 * so neither the middleware chain nor the dispatcher runs and the access record
 * is never written. Without this listener such a request is answered but leaves
 * no trace at all, and a client can drive unlimited rejections invisibly.
 *
 * The record names only the parser's error code and the status returned. No
 * client-controlled byte is logged, so the record is bounded and carries no
 * injected content or credential.
 *
 * Because there is no request or response object at this point, the reply must
 * be written straight to the socket as a complete HTTP message.
 *
 * @param {Error} err - Parser error, carrying an llhttp code such as HPE_INVALID_METHOD
 * @param {net.Socket} socket - Socket the rejected request arrived on
 */
function handleClientError(err, socket) {
  const code = (err && err.code) || UNKNOWN_PARSER_ERROR_CODE;
  const response = PARSER_ERROR_RESPONSES[code] || DEFAULT_PARSER_ERROR_RESPONSE;

  // The status line's code, for the log record
  const statusCode = response.slice(9, 12);

  warn(`Malformed request rejected by parser: ${code} - responded ${statusCode}`);

  if (!socket || socket.destroyed) {
    // Nothing is left to answer on; the peer is already gone
    return;
  }

  // Match Node's own guard: only reply when nothing has been written yet, so a
  // response already in flight cannot be corrupted
  if (socket.writable && socket.bytesWritten === 0) {
    socket.end(response);
    return;
  }

  socket.destroy();
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
      
      // Answer and record requests the HTTP parser rejects, which never reach
      // handleRequest and so are otherwise absent from the log entirely
      server.on('clientError', handleClientError);
      
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