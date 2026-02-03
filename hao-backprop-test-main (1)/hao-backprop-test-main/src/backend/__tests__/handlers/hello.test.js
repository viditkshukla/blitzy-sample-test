/**
 * Unit tests for the hello handler
 * 
 * This test suite verifies that the hello handler correctly processes
 * GET requests to the /hello endpoint, returns 'Hello world' with appropriate
 * status code and headers, and properly delegates non-GET requests to the
 * method not allowed error handler.
 * 
 * @jest-environment node
 */

// Import the handler to test
const { handleHelloRequest } = require('../../handlers/helloHandler');

// Import dependencies to mock
const { handle405 } = require('../../errorHandler');
const logger = require('../../utils/logger');

// Mock the error handler and logger
jest.mock('../../errorHandler', () => ({
  handle405: jest.fn()
}));

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  request: jest.fn(),
  response: jest.fn()
}));

describe('handleHelloRequest', () => {
  // Setup mock request and response objects
  let req;
  let res;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock request and response objects
    req = {
      method: 'GET',
      url: '/hello'
    };
    
    res = {
      statusCode: 0,
      setHeader: jest.fn(),
      end: jest.fn()
    };
  });
  
  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });
  
  test('should return Hello world with 200 status for GET requests', () => {
    // Call the handler with GET request
    handleHelloRequest(req, res);
    
    // Assert that the response was configured correctly
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.end).toHaveBeenCalledWith('Hello world');
    
    // Verify that logging was performed
    expect(logger.info).toHaveBeenCalled();
  });
  
  test('should call handle405 for non-GET requests', () => {
    // Setup request with POST method
    req.method = 'POST';
    
    // Call the handler
    handleHelloRequest(req, res);
    
    // Assert that handle405 was called
    expect(handle405).toHaveBeenCalledWith(res);
    
    // Verify that the error was logged
    expect(logger.error).toHaveBeenCalled();
  });
  
  test('should handle PUT requests by delegating to handle405', () => {
    // Setup request with PUT method
    req.method = 'PUT';
    
    // Call the handler
    handleHelloRequest(req, res);
    
    // Assert that handle405 was called
    expect(handle405).toHaveBeenCalledWith(res);
    
    // Verify that the error was logged
    expect(logger.error).toHaveBeenCalled();
  });
  
  test('should handle DELETE requests by delegating to handle405', () => {
    // Setup request with DELETE method
    req.method = 'DELETE';
    
    // Call the handler
    handleHelloRequest(req, res);
    
    // Assert that handle405 was called
    expect(handle405).toHaveBeenCalledWith(res);
    
    // Verify that the error was logged
    expect(logger.error).toHaveBeenCalled();
  });
});
