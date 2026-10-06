/**
 * Unit tests for the Health Endpoint Handler
 *
 * Tests verify that the handler answers GET requests with a 200 OK JSON liveness document
 * and delegates non-GET methods to the shared 405 Method Not Allowed handler.
 */

// Import the handler function to test
const { handleHealthRequest } = require('../../handlers/healthHandler');

// Import constants for assertions
const {
  HTTP_STATUS,
  MESSAGES,
  HEADERS,
  HTTP_METHODS
} = require('../../utils/constants');

// Import error handler for mocking
const { handle405 } = require('../../errorHandler');

// Import logger for mocking
const logger = require('../../utils/logger');

// Mock the error handler module
jest.mock('../../errorHandler', () => ({
  handle405: jest.fn()
}));

// Mock the logger module
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('handleHealthRequest', () => {
  // Define mock objects
  let req;
  let res;

  // Setup before each test
  beforeEach(() => {
    // Create mock request object
    req = {
      method: 'GET', // Default to GET method
      url: '/health'
    };

    // Create mock response object with Jest mock functions
    res = {
      statusCode: null,
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
  });

  // Cleanup after each test
  afterEach(() => {
    // Reset all mocks to ensure test isolation
    jest.resetAllMocks();
  });

  // Test case for GET requests
  it('should return 200 OK with a JSON "up" status for GET requests', () => {
    // Call the handler with mock request and response
    handleHealthRequest(req, res);

    // Verify response status code was set to 200 OK
    expect(res.statusCode).toBe(HTTP_STATUS.OK);

    // Verify Content-Type header was set to application/json
    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE,
      HEADERS.CONTENT_TYPE_JSON
    );

    // Verify response body is the JSON liveness document
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: MESSAGES.HEALTH_STATUS_UP }));

    // Verify handle405 was not called
    expect(handle405).not.toHaveBeenCalled();

    // Verify logger.info was called with the entry and success messages
    expect(logger.info).toHaveBeenNthCalledWith(1, 'Handling GET request to /health endpoint');
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      `Successfully responded with ${HTTP_STATUS.OK} OK ` +
      `and health status "${MESSAGES.HEALTH_STATUS_UP}"`
    );
  });

  // Test case for GET requests carrying a query string
  it('should return the same response for GET requests with a query string', () => {
    // Add a query string; routing and the handler ignore it
    req.url = '/health?probe=1';

    // Call the handler with mock request and response
    handleHealthRequest(req, res);

    // Verify the status, Content-Type header and body match a bare GET /health
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE,
      HEADERS.CONTENT_TYPE_JSON
    );
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: MESSAGES.HEALTH_STATUS_UP }));
  });

  // Test cases for non-GET requests
  it.each(['POST', 'PUT', 'DELETE', 'HEAD'])('should call handle405 for %s requests', (method) => {
    // Set request method to the unsupported method
    req.method = method;

    // Call the handler with mock request and response
    handleHealthRequest(req, res);

    // Verify handle405 was called with the response object
    expect(handle405).toHaveBeenCalledWith(res);

    // Verify response status, headers and body were not set directly
    // (because handle405 would handle that)
    expect(res.statusCode).toBe(null);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();

    // Verify logger.info and logger.error were called with appropriate messages
    expect(logger.info).toHaveBeenCalledWith(`Handling ${method} request to /health endpoint`);
    expect(logger.error).toHaveBeenCalledWith(
      `Received unsupported ${method} method, expected ${HTTP_METHODS.GET}`
    );
  });

  // Test case for an exception raised while writing the response
  it('should propagate an error thrown while writing the response', () => {
    // Make setting the Content-Type header fail
    res.setHeader.mockImplementation(() => {
      throw new Error('setHeader failed');
    });

    // Verify the handler does not swallow the error
    expect(() => handleHealthRequest(req, res)).toThrow('setHeader failed');

    // Verify no response body was written
    expect(res.end).not.toHaveBeenCalled();

    // Verify only the entry message was logged; the success log was never reached
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
