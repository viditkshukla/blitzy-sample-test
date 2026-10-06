/**
 * Unit tests for the Health Endpoint Handler
 *
 * Tests verify that the handler answers GET requests with a 200 OK JSON liveness document
 * and delegates non-GET methods to the shared 405 Method Not Allowed handler.
 */

const { handleHealthRequest } = require('../../handlers/healthHandler');

const {
  HTTP_STATUS,
  MESSAGES,
  HEADERS,
  HTTP_METHODS
} = require('../../utils/constants');

const { handle405 } = require('../../errorHandler');

const logger = require('../../utils/logger');

/**
 * Replaces the error handler module, so 405 delegation is observed without writing a response.
 *
 * @returns {Object} Mock errorHandler module whose handle405 is a Jest mock
 */
jest.mock('../../errorHandler', () => ({
  handle405: jest.fn()
}));

/**
 * Replaces the logger module, so the handler's log calls can be asserted.
 *
 * @returns {Object} Mock logger module exposing info and error as Jest mocks
 */
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

/**
 * Test suite for handleHealthRequest, run with a fresh mock request and response per case.
 */
describe('handleHealthRequest', () => {
  let req;
  let res;

  /**
   * Builds a fresh GET /health request and an unwritten response with a null statusCode,
   * a chainable setHeader mock and an end mock.
   */
  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/health'
    };

    res = {
      statusCode: null,
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
  });

  /**
   * Resets the calls and implementations of every mock after each case.
   */
  afterEach(() => {
    // Reset all mocks to ensure test isolation
    jest.resetAllMocks();
  });

  /**
   * Asserts that GET writes a single 200 JSON "up" response without delegating to handle405,
   * and logs the entry and success messages in that order.
   */
  it('should return 200 OK with a JSON "up" status for GET requests', () => {
    handleHealthRequest(req, res);

    expect(res.statusCode).toBe(HTTP_STATUS.OK);

    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE,
      HEADERS.CONTENT_TYPE_JSON
    );
    expect(res.setHeader).toHaveBeenCalledTimes(1);

    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: MESSAGES.HEALTH_STATUS_UP }));
    expect(res.end).toHaveBeenCalledTimes(1);

    expect(handle405).not.toHaveBeenCalled();

    expect(logger.info).toHaveBeenNthCalledWith(1, 'Handling GET request to /health endpoint');
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      `Successfully responded with ${HTTP_STATUS.OK} OK ` +
      `and health status "${MESSAGES.HEALTH_STATUS_UP}"`
    );
  });

  /**
   * Asserts that a query string leaves the GET liveness response unchanged, because the
   * handler reads only the request method.
   */
  it('should return the same response for GET requests with a query string', () => {
    // Add a query string; routing and the handler ignore it
    req.url = '/health?probe=1';

    handleHealthRequest(req, res);

    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE,
      HEADERS.CONTENT_TYPE_JSON
    );
    expect(res.setHeader).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: MESSAGES.HEALTH_STATUS_UP }));
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  /**
   * Asserts that an unsupported method is logged as an error and delegated, with the same
   * response object, to handle405, which alone writes the 405 response.
   *
   * @param {string} method - Unsupported HTTP method under test: POST, PUT, DELETE or HEAD
   */
  it.each(['POST', 'PUT', 'DELETE', 'HEAD'])('should call handle405 for %s requests', (method) => {
    req.method = method;

    handleHealthRequest(req, res);

    expect(handle405).toHaveBeenCalledWith(res);
    expect(handle405).toHaveBeenCalledTimes(1);
    expect(handle405.mock.calls[0][0]).toBe(res);

    // Verify response status, headers and body were not set directly
    // (because handle405 would handle that)
    expect(res.statusCode).toBe(null);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();

    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      `Handling ${method} request to /health endpoint`
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      `Received unsupported ${method} method, expected ${HTTP_METHODS.GET}`
    );
  });

  /**
   * Asserts that an error thrown while writing the response propagates out of the handler,
   * which neither swallows it nor answers with a 405.
   */
  it('should propagate an error thrown while writing the response', () => {
    /**
     * Fails the Content-Type header write, before any response body is sent.
     *
     * @throws {Error} Always, with the message 'setHeader failed'
     */
    res.setHeader.mockImplementation(() => {
      throw new Error('setHeader failed');
    });

    /**
     * Runs the handler so the assertion observes the error it lets escape.
     *
     * @throws {Error} The 'setHeader failed' error, propagated from the handler
     */
    expect(() => handleHealthRequest(req, res)).toThrow('setHeader failed');

    expect(res.end).not.toHaveBeenCalled();

    expect(handle405).not.toHaveBeenCalled();

    // Verify the entry message was the first and only info log; the success log was never reached
    expect(logger.info).toHaveBeenNthCalledWith(1, 'Handling GET request to /health endpoint');
    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
