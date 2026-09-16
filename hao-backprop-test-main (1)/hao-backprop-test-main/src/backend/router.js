/**
 * Request Router module for Node.js Hello World application
 * 
 * This module examines incoming HTTP requests and directs them to the appropriate
 * handler based on the URL path. It implements routing logic for the /welcome
 * endpoint and handles 404 responses for undefined routes.
 */

// Import Node.js core modules
const url = require('url');

// Import application modules
const { handleWelcomeRequest } = require('./handlers/welcomeHandler');
const { handle404 } = require('./errorHandler');
const { ROUTES } = require('./utils/constants');
const logger = require('./utils/logger');

/**
 * Determines if a URL path matches a known route
 * @param {*} path - The URL path to match. Any value is accepted: a non-string
 *   argument is treated as no match rather than raising an error.
 * @returns {function|null} Handler function if route matches, null otherwise
 */
function matchRoute(path) {
  // url.parse can yield a null pathname (an empty request URL does), so a
  // non-string path resolves to no match and reaches the caller's fixed 404.
  if (typeof path !== 'string') {
    return null;
  }

  // Normalize the path by removing one trailing slash
  const normalizedPath = path.endsWith('/') && path.length > 1 
    ? path.slice(0, -1) 
    : path;
  
  if (normalizedPath === ROUTES.WELCOME) {
    return handleWelcomeRequest;
  }
  
  return null;
}

/**
 * Routes incoming HTTP requests to the appropriate handler based on the URL path
 *
 * Caller contract: `req.url` must be a string, which Node's http server always
 * sets. A non-string request target propagates the ERR_INVALID_ARG_TYPE raised
 * by url.parse rather than producing a response, so a caller that does not get
 * its request from the http server must validate the target before dispatching.
 * A null pathname is handled: it matches no route and answers 404.
 * @param {object} req - The HTTP request object
 * @param {string} req.url - Request target; only its pathname selects the handler
 * @param {object} res - The HTTP response object
 */
function route(req, res) {
  logger.request(req);
  
  const parsedUrl = url.parse(req.url);
  
  const pathname = parsedUrl.pathname;
  
  const handler = matchRoute(pathname);
  
  if (handler) {
    logger.info(`Routing to handler for path: ${pathname}`);
    handler(req, res);
  } else {
    logger.info(`No handler found for path: ${pathname}`);
    handle404(res);
  }
}

module.exports = route;