/**
 * Health Endpoint Handler module for Node.js Hello World application
 *
 * This module handles requests to the /health endpoint, reports that the server
 * is running with a JSON status document for GET requests, and returns error
 * responses for unsupported methods.
 */

// Import required modules and constants
const { HTTP_STATUS, MESSAGES, HEADERS, HTTP_METHODS } = require('../utils/constants');
const logger = require('../utils/logger');
const { handle405 } = require('../errorHandler');

/**
 * Handles requests to the /health endpoint, validating the HTTP method
 * and reporting that the server process is alive and serving
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleHealthRequest(req, res) {
  // Log the incoming request
  logger.info(`Handling ${req.method} request to /health endpoint`);

  // Check if the method is GET
  if (req.method === HTTP_METHODS.GET) {
    // Set status code to 200 (OK)
    res.statusCode = HTTP_STATUS.OK;

    // Set Content-Type header to application/json
    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_JSON);

    // Send the liveness status document as the response body
    res.end(JSON.stringify({ status: MESSAGES.HEALTH_STATUS_UP }));

    // Log the successful response
    logger.info(
      `Successfully responded with ${HTTP_STATUS.OK} OK and health status ` +
      `"${MESSAGES.HEALTH_STATUS_UP}"`
    );
  } else {
    // For non-GET requests, handle Method Not Allowed
    logger.error(`Received unsupported ${req.method} method, expected ${HTTP_METHODS.GET}`);
    handle405(res);
  }
}

// Export the health endpoint handler function
module.exports = {
  handleHealthRequest
};
