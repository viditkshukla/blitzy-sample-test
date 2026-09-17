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
    
    // Assert warning is logged with correct message. The request target is
    // deliberately absent: the request logger's access record is the single
    // place it is written, in a bounded and query-redacted form.
    expect(warn).toHaveBeenCalledWith(`Not Found: ${req.method}`);
  });

  test('should not write the request target to the log, leaving it to the access record', () => {
    // A target carrying secrets in its query string, as a client can send
    const req = {
      method: 'GET',
      url: '/oops?session_id=QSSESSION-777&access_token=QSBEARER-999'
    };
    
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };
    
    handleNotFound(req, res);
    
    // Exactly one record, and it carries neither the target nor its secrets
    expect(warn).toHaveBeenCalledTimes(1);
    
    const [message] = warn.mock.calls[0];
    expect(message).not.toContain(req.url);
    expect(message).not.toContain('QSSESSION-777');
    expect(message).not.toContain('QSBEARER-999');
    expect(message).not.toContain('?');
  });

  test('should keep the log record bounded regardless of request target length', () => {
    // A 15 000-character target, which previously produced a record of the
    // same order and a second copy of it on this path
    const req = {
      method: 'GET',
      url: `/${'a'.repeat(15000)}`
    };
    
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };
    
    handleNotFound(req, res);
    
    const [message] = warn.mock.calls[0];
    
    // The record's length is a function of the method alone, not of the target
    expect(message).toBe('Not Found: GET');
    expect(message.length).toBeLessThan(64);
    
    // The response contract is unaffected
    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith('Not Found');
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
    
    // Assert warning is logged with correct message. As on the 404 path, the
    // request target is left to the access record rather than duplicated here.
    expect(warn).toHaveBeenCalledWith(`Method Not Allowed: ${req.method} - Allowed methods: GET, POST`);
    
    const [message] = warn.mock.calls[0];
    expect(message).not.toContain(req.url);
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
    
    // Assert error is logged with correct message and error object. The target
    // is left to the access record; the error object is still passed, and the
    // logger records only its message, never its stack.
    expect(error).toHaveBeenCalledWith(`Server Error processing ${req.method}`, err);
    
    const [message] = error.mock.calls[0];
    expect(message).not.toContain(req.url);
  });

  test('should not write the request target or the error stack into the log record', () => {
    // A malformed absolute-form target, the shape that reaches this handler
    // when a client-controlled target cannot be parsed
    const req = {
      method: 'GET',
      url: 'http://[?token=QSTOKEN-abc123'
    };
    
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };
    
    // A real Error, so it carries a real multi-frame stack
    const err = new Error('Invalid URL');
    
    handleServerError(req, res, err);
    
    // One record, naming the method and nothing client-controlled
    expect(error).toHaveBeenCalledTimes(1);
    
    const [message, loggedError] = error.mock.calls[0];
    expect(message).toBe('Server Error processing GET');
    expect(message).not.toContain('http://[');
    expect(message).not.toContain('QSTOKEN-abc123');
    
    // The handler hands the error object to the logger, which records its
    // message without its frames; the message itself carries no stack
    expect(loggedError).toBe(err);
    expect(message).not.toContain('    at ');
    
    // The client still receives the generic response
    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
  });
});