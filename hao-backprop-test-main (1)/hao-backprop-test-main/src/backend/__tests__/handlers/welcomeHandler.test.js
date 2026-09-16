/**
 * Unit tests for the Welcome Endpoint Handler
 *
 * Tests verify that the handler serves the Welcome screen for GET requests
 * and delegates non-GET methods to the shared 405 handler.
 */

// Import the handler function to test
const { handleWelcomeRequest } = require('../../handlers/welcomeHandler');

// Import constants for assertions
const {
  HTTP_STATUS,
  ROUTES,
  MESSAGES,
  HEADERS,
  HTTP_METHODS
} = require('../../utils/constants');

// Import error handler for mocking
const { handle405 } = require('../../errorHandler');

// Import logger for mocking
const logger = require('../../utils/logger');

jest.mock('../../errorHandler', () => ({
  handle405: jest.fn()
}));

// Mock the logger module. The handler records the request and the successful
// response through info, and reports an unsupported method through error;
// handle405 performs the rejection itself.
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('handleWelcomeRequest', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'GET' // Default to GET method
    };

    // Create mock response object with Jest mock functions
    res = {
      statusCode: null,
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
  });

  afterEach(() => {
    // Reset all mocks to ensure test isolation
    jest.resetAllMocks();
  });

  it('should return 200 OK with the Welcome screen for GET requests', () => {
    handleWelcomeRequest(req, res);

    expect(res.statusCode).toBe(HTTP_STATUS.OK);

    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE,
      HEADERS.CONTENT_TYPE_HTML
    );

    const body = res.end.mock.calls[0][0];
    expect(body).toContain(MESSAGES.WELCOME_HEADING);
    expect(body).toContain(MESSAGES.WELCOME_DESCRIPTION);

    // Verify both informational log lines, in order and character for
    // character. The success wording is fixed by the specification, so it is
    // pinned here rather than merely asserted to have happened.
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      `Handling ${HTTP_METHODS.GET} request to ${ROUTES.WELCOME} endpoint`
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      `Successfully responded with ${HTTP_STATUS.OK} OK and the Welcome screen`
    );

    expect(handle405).not.toHaveBeenCalled();
  });

  it('should serve a self-contained document with no subresources or inline styles', () => {
    handleWelcomeRequest(req, res);

    // Capture the markup passed to res.end
    const body = res.end.mock.calls[0][0];

    // Verify the document shell and the two content elements
    expect(body).toContain('<!DOCTYPE html>');
    expect(body).toContain('<html lang="en">');
    expect(body).toContain(`<title>${MESSAGES.WELCOME_HEADING}</title>`);
    expect(body).toContain(`<h1>${MESSAGES.WELCOME_HEADING}</h1>`);
    expect(body).toContain(`<p>${MESSAGES.WELCOME_DESCRIPTION}</p>`);

    // Verify nothing the Content-Security-Policy forbids is present
    expect(body).not.toContain('<script');
    expect(body).not.toContain('<style');
    expect(body).not.toContain('style=');
    expect(body).not.toContain('<img');
    expect(body).not.toContain('<link');
  });

  it('should call handle405 for non-GET requests', () => {
    req.method = 'POST';

    handleWelcomeRequest(req, res);

    expect(handle405).toHaveBeenCalledWith(res);

    // Verify response status and headers were not set directly
    // (because handle405 would handle that)
    expect(res.statusCode).toBe(null);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();

    // Verify the request was logged and the unsupported method was reported
    // through error, the level carried over from the handler this module
    // replaces. handle405 performs the rejection itself.
    expect(logger.info).toHaveBeenCalledWith(
      `Handling POST request to ${ROUTES.WELCOME} endpoint`
    );
    expect(logger.error).toHaveBeenCalledWith(
      `Received unsupported POST method, expected ${HTTP_METHODS.GET}`
    );
  });

  it('should correctly identify GET method', () => {
    // Test the behavior of isGetMethod indirectly through handleWelcomeRequest

    // The one allowed method should be accepted (isGetMethod returns true)
    req.method = HTTP_METHODS.GET;
    handleWelcomeRequest(req, res);
    expect(handle405).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledWith(expect.stringContaining(MESSAGES.WELCOME_HEADING));
    jest.clearAllMocks();
    res.statusCode = null;

    // POST should be rejected (isGetMethod returns false)
    req.method = 'POST';
    handleWelcomeRequest(req, res);
    expect(handle405).toHaveBeenCalled();
    jest.clearAllMocks();

    // PUT should be rejected (isGetMethod returns false)
    req.method = 'PUT';
    handleWelcomeRequest(req, res);
    expect(handle405).toHaveBeenCalled();
    jest.clearAllMocks();

    // DELETE should be rejected (isGetMethod returns false)
    req.method = 'DELETE';
    handleWelcomeRequest(req, res);
    expect(handle405).toHaveBeenCalled();
  });
});
