/**
 * Hello Endpoint Handler module for Node.js Hello World application
 * 
 * This module handles requests to the /hello endpoint, validates HTTP methods,
 * and generates appropriate responses with 'Hello world' for GET requests
 * or error responses for unsupported methods.
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
 * Handles requests to the /hello endpoint, validating the HTTP method 
 * and generating appropriate responses
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleHelloRequest(req, res) {
  // Log the incoming request
  logger.info(`Handling ${req.method} request to /hello endpoint`);
  
  // Extract the HTTP method from the request
  const method = req.method;
  
  // Check if the method is GET
  if (isGetMethod(method)) {
    // Set status code to 200 (OK)
    res.statusCode = HTTP_STATUS.OK;
    
    // Set Content-Type header to text/plain
    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
    
    // Send 'Hello world' message as the response body
    res.end(MESSAGES.HELLO_RESPONSE);
    
    // Log the successful response
    logger.info(`Successfully responded with ${HTTP_STATUS.OK} OK and "${MESSAGES.HELLO_RESPONSE}" message`);
  } else {
    // For non-GET requests, handle Method Not Allowed
    logger.error(`Received unsupported ${method} method, expected ${HTTP_METHODS.GET}`);
    handle405(res);
  }
}

// Export the hello endpoint handler function
module.exports = {
  handleHelloRequest
};