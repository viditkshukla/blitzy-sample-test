/**
 * Health Endpoint Handler module for Node.js Hello World application
 *
 * This module handles requests to the /health endpoint, reports that the server
 * is running with a JSON status document for GET requests, and returns error
 * responses for unsupported methods.
 */

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
  logger.info(`Handling ${req.method} request to /health endpoint`);

  if (req.method === HTTP_METHODS.GET) {
    res.statusCode = HTTP_STATUS.OK;

    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_JSON);

    res.end(JSON.stringify({ status: MESSAGES.HEALTH_STATUS_UP }));

    logger.info(
      `Successfully responded with ${HTTP_STATUS.OK} OK and health status ` +
      `"${MESSAGES.HEALTH_STATUS_UP}"`
    );
  } else {
    logger.error(`Received unsupported ${req.method} method, expected ${HTTP_METHODS.GET}`);
    handle405(res);
  }
}

module.exports = {
  handleHealthRequest
};
