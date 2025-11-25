/**
 * Error Handler Tests
 * 
 * Tests for the error handling functions of the Node.js HTTP server application.
 * Verifies proper handling of 404 Not Found, 405 Method Not Allowed, and 500 
 * Internal Server Error scenarios with appropriate HTTP status codes, headers,
 * and response messages.
 */

// Import the error handling functions to test
const { handleNotFound, handleMethodNotAllowed, handleServerError } = require('../../handlers/error');
// Import logger to mock its functions
const { warn, error } = require('../../utils/logger');

// Mock the logger functions
jest.mock('../../utils/logger', () => ({
  warn: jest.fn(),
  error: jest.fn()
}));

// Setup and teardown for all tests
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore all mocks after each test
  jest.restoreAllMocks();
});

describe('handleNotFound', () => {
  test('should return 404 status code and Not Found message', () => {
    // Create mock request and response objects
    const req = {
      method: 'GET',
      url: '/unknown'
    };
    
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };
    
    // Call the function being tested
    handleNotFound(req, res);
    
    // Assert status code is set to 404
    expect(res.statusCode).toBe(404);
    
    // Assert Content-Type header is set correctly
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert response body is "Not Found"
    expect(res.end).toHaveBeenCalledWith('Not Found');
    
    // Assert warning is logged with correct message
    expect(warn).toHaveBeenCalledWith(`Not Found: ${req.method} ${req.url}`);
  });
});

describe('handleMethodNotAllowed', () => {
  test('should return 405 status code, Method Not Allowed message, and set Allow header', () => {
    // Create mock request and response objects
    const req = {
      method: 'POST',
      url: '/hello'
    };
    
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };
    
    // Define allowed methods with multiple values to test join functionality
    const allowedMethods = ['GET', 'POST'];
    
    // Call the function being tested
    handleMethodNotAllowed(req, res, allowedMethods);
    
    // Assert status code is set to 405
    expect(res.statusCode).toBe(405);
    
    // Assert Content-Type header is set correctly
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert Allow header is set with joined methods
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET, POST');
    
    // Assert response body is "Method Not Allowed"
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
    
    // Assert warning is logged with correct message
    expect(warn).toHaveBeenCalledWith(`Method Not Allowed: ${req.method} ${req.url} - Allowed methods: GET, POST`);
  });
});

describe('handleServerError', () => {
  test('should return 500 status code and Internal Server Error message', () => {
    // Create mock request and response objects
    const req = {
      method: 'GET',
      url: '/hello'
    };
    
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };
    
    // Create test error object with message and stack properties
    const err = {
      message: 'Test error',
      stack: 'Error stack trace'
    };
    
    // Call the function being tested
    handleServerError(req, res, err);
    
    // Assert status code is set to 500
    expect(res.statusCode).toBe(500);
    
    // Assert Content-Type header is set correctly
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Assert response body is "Internal Server Error"
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
    
    // Assert error is logged with correct message and error object
    expect(error).toHaveBeenCalledWith(`Server Error processing ${req.method} ${req.url}`, err);
  });
});