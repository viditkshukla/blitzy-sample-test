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
const handleHello = require('../../handlers/hello');

// Import dependencies to mock
const { handleMethodNotAllowed } = require('../../handlers/error');
const { logger } = require('../../utils/logger');

// Mock the error handler and logger
jest.mock('../../handlers/error', () => ({
  handleMethodNotAllowed: jest.fn()
}));

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  logger: {
    info: jest.fn()
  }
}));

describe('handleHello', () => {
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
    handleHello(req, res);
    
    // Assert that the response was configured correctly
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.end).toHaveBeenCalledWith('Hello world');
    
    // Verify that the request was logged
    expect(logger.info).toHaveBeenCalledWith(`Handling request: GET /hello`);
  });
  
  test('should call handleMethodNotAllowed for non-GET requests', () => {
    // Setup request with POST method
    req.method = 'POST';
    
    // Call the handler
    handleHello(req, res);
    
    // Assert that handleMethodNotAllowed was called
    expect(handleMethodNotAllowed).toHaveBeenCalledWith(req, res, ['GET']);
    
    // Verify that normal response methods were not called
    expect(res.statusCode).toBe(0); // Unchanged
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });
  
  test('should handle PUT requests by delegating to handleMethodNotAllowed', () => {
    // Setup request with PUT method
    req.method = 'PUT';
    
    // Call the handler
    handleHello(req, res);
    
    // Assert that handleMethodNotAllowed was called
    expect(handleMethodNotAllowed).toHaveBeenCalledWith(req, res, ['GET']);
    
    // Verify that normal response methods were not called
    expect(res.statusCode).toBe(0); // Unchanged
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });
  
  test('should handle DELETE requests by delegating to handleMethodNotAllowed', () => {
    // Setup request with DELETE method
    req.method = 'DELETE';
    
    // Call the handler
    handleHello(req, res);
    
    // Assert that handleMethodNotAllowed was called
    expect(handleMethodNotAllowed).toHaveBeenCalledWith(req, res, ['GET']);
    
    // Verify that normal response methods were not called
    expect(res.statusCode).toBe(0); // Unchanged
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });
});