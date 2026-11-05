/**
 * Hello Handler Module
 *
 * Serves the /hello endpoint of the Node.js HTTP server application. A GET
 * request receives the plain-text greeting, and every other method is passed to
 * the canonical 405 policy in the sibling error handler, which owns that
 * response in full.
 *
 * @module hello
 */

// Import the shared status, header, message and method constants
const { HTTP_STATUS, MESSAGES, HEADERS, HTTP_METHODS } = require('../utils/constants');

// Import the canonical 405 handler so the method policy lives in exactly one module
const { handleMethodNotAllowed } = require('./error');

/**
 * Handles requests to the /hello endpoint
 *
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleHello(req, res) {
  // Only GET is served, compared against the shared method constant
  if (req.method === HTTP_METHODS.GET) {
    // Respond with the plain-text greeting
    res.statusCode = HTTP_STATUS.OK;
    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
    res.end(MESSAGES.HELLO_RESPONSE);
  } else {
    // Delegate to the 405 policy, which writes the status, both headers, the body
    // and its own warning record; returning without touching res keeps the response
    // free of a duplicate write and keeps this module silent on stdout
    handleMethodNotAllowed(req, res, [HTTP_METHODS.GET]);
  }
}

// Export the bare callable: server.js maps '/hello' to it and the tests call it directly
module.exports = handleHello;
