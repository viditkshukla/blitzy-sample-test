/**
 * Request Router module for Node.js Hello World application
 * 
 * This module examines incoming HTTP requests and directs them to the appropriate
 * handler based on the URL path. It implements routing logic for the /hello
 * endpoint and handles 404 responses for undefined routes.
 */

// Import Node.js core modules
const url = require('url'); // built-in

// Import application modules
const { handleHelloRequest } = require('./handlers/helloHandler');
const { handle404 } = require('./errorHandler');
const { ROUTES } = require('./utils/constants');
const logger = require('./utils/logger');

/**
 * Determines if a URL path matches a known route
 * @param {string} path - The URL path to match
 * @returns {function|null} Handler function if route matches, null otherwise
 */
function matchRoute(path) {
  // Normalize the path by removing trailing slashes
  const normalizedPath = path.endsWith('/') && path.length > 1 
    ? path.slice(0, -1) 
    : path;
  
  // Check if the path matches the hello endpoint
  if (normalizedPath === ROUTES.HELLO) {
    return handleHelloRequest;
  }
  
  // No match found
  return null;
}

/**
 * Routes incoming HTTP requests to the appropriate handler based on the URL path
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function route(req, res) {
  // Log the incoming request
  logger.request(req);
  
  // Parse the URL from the request
  const parsedUrl = url.parse(req.url);
  
  // Extract the pathname from the parsed URL
  const pathname = parsedUrl.pathname;
  
  // Find the matching route handler
  const handler = matchRoute(pathname);
  
  if (handler) {
    // If a handler is found, call it with the request and response objects
    logger.info(`Routing to handler for path: ${pathname}`);
    handler(req, res);
  } else {
    // If no handler is found, return a 404 Not Found response
    logger.info(`No handler found for path: ${pathname}`);
    handle404(res);
  }
}

// Export the route function as the default export
module.exports = route;