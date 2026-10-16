/**
 * Hello Endpoint Handler module for Node.js Hello World application
 * 
 * This module handles requests to the /hello endpoint, validates HTTP methods,
 * and generates appropriate responses with 'Hello world' for GET requests
 * or error responses for unsupported methods.
 */

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
 * Handles requests to the /hello endpoint, validating the HTTP method 
 * and generating appropriate responses
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleHelloRequest(req, res) {
  logger.info(`Handling ${req.method} request to /hello endpoint`);
  
  const method = req.method;
  
  if (!isGetMethod(method)) {
    logger.error(`Received unsupported ${method} method, expected ${HTTP_METHODS.GET}`);
    handle405(res);
    return;
  }

  res.statusCode = HTTP_STATUS.OK;
  res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
  res.end(MESSAGES.HELLO_RESPONSE);
  logger.info(`Successfully responded with ${HTTP_STATUS.OK} OK and "${MESSAGES.HELLO_RESPONSE}" message`);
}

module.exports = {
  handleHelloRequest
};