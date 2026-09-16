/**
 * Unit tests for the Welcome Endpoint Handler
 * 
 * Tests verify that the handler serves the Welcome screen for GET requests
 * and rejects non-GET methods with 405 Method Not Allowed responses.
 */

// Import the handler function to test
const { handleWelcomeRequest } = require('../../handlers/welcomeHandler');

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

describe('handleWelcomeRequest', () => {
  // Define mock objects
  let req;
  let res;
  
  // Setup before each test
  beforeEach(() => {
    // Create mock request object
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
  
  // Cleanup after each test
  afterEach(() => {
    // Reset all mocks to ensure test isolation
    jest.resetAllMocks();
  });

  // Test case for GET requests
  it('should return 200 OK with the Welcome screen for GET requests', () => {
    // Call the handler with mock request and response
    handleWelcomeRequest(req, res);
    
    // Verify response status code was set to 200 OK
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    
    // Verify Content-Type header was set to HTML with an explicit charset
    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE, 
      HEADERS.CONTENT_TYPE_HTML
    );
    
    // Verify the response body carries the heading and the description
    const body = res.end.mock.calls[0][0];
    expect(body).toContain(MESSAGES.WELCOME_HEADING);
    expect(body).toContain(MESSAGES.WELCOME_DESCRIPTION);
    
    // Verify logger.info was called with appropriate messages
    expect(logger.info).toHaveBeenNthCalledWith(1, 'Handling GET request to /welcome endpoint');
    expect(logger.info).toHaveBeenNthCalledWith(2, `Successfully responded with ${HTTP_STATUS.OK} OK and the "${MESSAGES.WELCOME_HEADING}" screen`);
    
    // Verify handle405 was not called
    expect(handle405).not.toHaveBeenCalled();
  });

  // Test case for the served markup
  it('should serve a self-contained document with no subresources or inline styles', () => {
    // Call the handler with mock request and response
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
  
  // Test case for non-GET requests
  it('should call handle405 for non-GET requests', () => {
    // Set request method to POST
    req.method = 'POST';
    
    // Call the handler with mock request and response
    handleWelcomeRequest(req, res);
    
    // Verify handle405 was called with the response object
    expect(handle405).toHaveBeenCalledWith(res);
    
    // Verify response status and headers were not set directly
    // (because handle405 would handle that)
    expect(res.statusCode).toBe(null);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    
    // Verify logger.info and logger.error were called with appropriate messages
    expect(logger.info).toHaveBeenCalledWith('Handling POST request to /welcome endpoint');
    expect(logger.error).toHaveBeenCalledWith(`Received unsupported POST method, expected ${HTTP_METHODS.GET}`);
  });
  
  // Test case for isGetMethod function behavior
  it('should correctly identify GET method', () => {
    // Test the behavior of isGetMethod indirectly through handleWelcomeRequest
    
    // GET should be accepted (isGetMethod returns true)
    req.method = 'GET';
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
