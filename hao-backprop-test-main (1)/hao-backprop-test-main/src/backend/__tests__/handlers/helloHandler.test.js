/**
 * Unit tests for the Hello Endpoint Handler
 * 
 * Tests verify that the handler correctly processes GET requests with 'Hello world' responses
 * and rejects non-GET methods with 405 Method Not Allowed responses.
 */

// Import the handler function to test
const { handleHelloRequest } = require('../../handlers/helloHandler');

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

describe('handleHelloRequest', () => {
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
  it("should return 200 OK with 'Hello world' for GET requests", () => {
    // Call the handler with mock request and response
    handleHelloRequest(req, res);
    
    // Verify response status code was set to 200 OK
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    
    // Verify Content-Type header was set correctly
    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE, 
      HEADERS.CONTENT_TYPE_TEXT
    );
    
    // Verify response body was set to "Hello world"
    expect(res.end).toHaveBeenCalledWith(MESSAGES.HELLO_RESPONSE);
    
    // Verify logger.info was called with appropriate messages
    expect(logger.info).toHaveBeenNthCalledWith(1, 'Handling GET request to /hello endpoint');
    expect(logger.info).toHaveBeenNthCalledWith(2, `Successfully responded with ${HTTP_STATUS.OK} OK and "${MESSAGES.HELLO_RESPONSE}" message`);
    
    // Verify handle405 was not called
    expect(handle405).not.toHaveBeenCalled();
  });
  
  // Test case for non-GET requests
  it('should call handle405 for non-GET requests', () => {
    // Set request method to POST
    req.method = 'POST';
    
    // Call the handler with mock request and response
    handleHelloRequest(req, res);
    
    // Verify handle405 was called with the response object
    expect(handle405).toHaveBeenCalledWith(res);
    
    // Verify response status and headers were not set directly
    // (because handle405 would handle that)
    expect(res.statusCode).toBe(null);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    
    // Verify logger.info and logger.error were called with appropriate messages
    expect(logger.info).toHaveBeenCalledWith('Handling POST request to /hello endpoint');
    expect(logger.error).toHaveBeenCalledWith(`Received unsupported POST method, expected ${HTTP_METHODS.GET}`);
  });
  
  // Test case for isGetMethod function behavior
  it('should correctly identify GET method', () => {
    // Test the behavior of isGetMethod indirectly through handleHelloRequest
    
    // GET should be accepted (isGetMethod returns true)
    req.method = 'GET';
    handleHelloRequest(req, res);
    expect(handle405).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledWith(MESSAGES.HELLO_RESPONSE);
    jest.clearAllMocks();
    res.statusCode = null;
    
    // POST should be rejected (isGetMethod returns false)
    req.method = 'POST';
    handleHelloRequest(req, res);
    expect(handle405).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // PUT should be rejected (isGetMethod returns false)
    req.method = 'PUT';
    handleHelloRequest(req, res);
    expect(handle405).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // DELETE should be rejected (isGetMethod returns false)
    req.method = 'DELETE';
    handleHelloRequest(req, res);
    expect(handle405).toHaveBeenCalled();
  });
});