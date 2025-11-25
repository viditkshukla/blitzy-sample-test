/**
 * Test suite for the error handler module
 * 
 * This file contains tests for the error handling functions including
 * request error handling, server error handling, 404 Not Found handling,
 * and 405 Method Not Allowed handling.
 */

// Import error handler functions
const { handleRequestError, handleServerError, handle404, handle405 } = require('../errorHandler');
// Import constants for HTTP status codes, messages, and headers
const { HTTP_STATUS, MESSAGES, HEADERS, HTTP_METHODS } = require('../utils/constants');
// Import logger for mocking and verification
const logger = require('../utils/logger');

// Mock the logger module
jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

/**
 * Helper function to create a mock response object for testing
 * @returns {Object} Mock response object with statusCode, setHeader, and end methods
 */
function createMockResponse() {
  return {
    statusCode: 200,
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    headersSent: false
  };
}

/**
 * Helper function to create a mock Error object
 * @param {string} message - Error message
 * @param {string} code - Optional error code
 * @returns {Error} Error object with message and optional code
 */
function createMockError(message = 'Test error', code = null) {
  const error = new Error(message);
  if (code) {
    error.code = code;
  }
  return error;
}

describe('Error Handler', () => {
  
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleRequestError', () => {
    it('should log the error and send a 500 response', () => {
      // Create a mock error
      const error = createMockError();
      
      // Create a mock response
      const res = createMockResponse();
      
      // Call the function under test
      handleRequestError(error, res);
      
      // Verify logger.error was called with the error
      expect(logger.error).toHaveBeenCalledWith(error);
      
      // Verify response was properly set
      expect(res.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.setHeader).toHaveBeenCalledWith(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
      expect(res.end).toHaveBeenCalledWith(MESSAGES.SERVER_ERROR);
    });

    it('should handle the case where response is already sent', () => {
      // Create a mock error
      const error = createMockError();
      
      // Create a mock response with headersSent=true
      const res = createMockResponse();
      res.headersSent = true;
      
      // Call the function under test
      handleRequestError(error, res);
      
      // Verify logger.error was called with the error
      expect(logger.error).toHaveBeenCalledWith(error);
      
      // Verify response methods were not called
      expect(res.setHeader).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
    });
  });

  describe('handleServerError', () => {
    it('should log the server error', () => {
      // Create a mock error
      const error = createMockError();
      
      // Call the function under test
      handleServerError(error);
      
      // Verify logger.error was called with the error
      expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should handle critical errors differently', () => {
      // Create a mock error with code EADDRINUSE
      const error = createMockError('Port already in use', 'EADDRINUSE');
      
      // Call the function under test
      handleServerError(error);
      
      // Verify logger.error was called with the error
      expect(logger.error).toHaveBeenCalledWith(error);
      
      // Verify logger.error was called with additional message about critical error
      expect(logger.error).toHaveBeenCalledWith(
        'Port is already in use. Please use a different port or ensure no other service is using this port.'
      );
    });
  });

  describe('handle404', () => {
    it('should send a 404 response with correct headers and body', () => {
      // Create a mock response
      const res = createMockResponse();
      
      // Call the function under test
      handle404(res);
      
      // Verify response was properly set
      expect(res.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.setHeader).toHaveBeenCalledWith(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
      expect(res.end).toHaveBeenCalledWith(MESSAGES.NOT_FOUND);
      
      // Verify logger.info was called
      expect(logger.info).toHaveBeenCalledWith('Responding with 404 Not Found');
    });
  });

  describe('handle405', () => {
    it('should send a 405 response with correct headers and body', () => {
      // Create a mock response
      const res = createMockResponse();
      
      // Call the function under test
      handle405(res);
      
      // Verify response was properly set
      expect(res.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
      expect(res.setHeader).toHaveBeenCalledWith(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
      expect(res.setHeader).toHaveBeenCalledWith(HEADERS.ALLOW, HTTP_METHODS.GET);
      expect(res.end).toHaveBeenCalledWith(MESSAGES.METHOD_NOT_ALLOWED);
      
      // Verify logger.info was called
      expect(logger.info).toHaveBeenCalledWith('Responding with 405 Method Not Allowed');
    });
  });
});