/**
 * Welcome Endpoint Handler module for Node.js Hello World application
 *
 * This module handles requests to the /welcome endpoint, validates HTTP methods,
 * and serves a self-contained HTML Welcome screen for GET requests or error
 * responses for unsupported methods.
 */

// Import required modules and constants
const { HTTP_STATUS, MESSAGES, HEADERS, HTTP_METHODS } = require('../utils/constants');
const logger = require('../utils/logger');
const { handle405 } = require('../errorHandler');

/**
 * Validates if the HTTP method is GET
 * @param {string} method - The HTTP method to validate
 * @returns {boolean} True if method is GET, false otherwise
 */
function isGetMethod(method) {
  return method === HTTP_METHODS.GET;
}

/**
 * Builds the Welcome screen as a self-contained HTML5 document.
 *
 * The markup references no stylesheet, script or image and carries no inline
 * style, because the security middleware sends
 * `Content-Security-Policy: default-src 'none'` on every response.
 *
 * Module-private and intentionally not exported: the module's public surface is
 * its request handler alone.
 *
 * @private
 * @returns {string} The Welcome screen document
 */
function renderWelcomePage() {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${MESSAGES.WELCOME_HEADING}</title>`,
    '</head>',
    '<body>',
    `<h1>${MESSAGES.WELCOME_HEADING}</h1>`,
    `<p>${MESSAGES.WELCOME_DESCRIPTION}</p>`,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

/**
 * Handles requests to the /welcome endpoint, validating the HTTP method
 * and serving the Welcome screen
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleWelcomeRequest(req, res) {
  logger.info(`Handling ${req.method} request to /welcome endpoint`);

  const method = req.method;

  if (isGetMethod(method)) {
    // Set status code to 200 (OK)
    res.statusCode = HTTP_STATUS.OK;

    // Set Content-Type header to text/html with an explicit charset
    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_HTML);

    // Send the Welcome screen as the response body. Node derives the response
    // length from this single res.end() call, so no length header is set here.
    res.end(renderWelcomePage());

    logger.info(`Successfully responded with ${HTTP_STATUS.OK} OK and the Welcome screen`);
  } else {
    // For non-GET requests, delegate the Method Not Allowed response to the
    // shared 405 handler.
    logger.error(`Received unsupported ${method} method, expected ${HTTP_METHODS.GET}`);
    handle405(res);
  }
}

module.exports = {
  handleWelcomeRequest
};
