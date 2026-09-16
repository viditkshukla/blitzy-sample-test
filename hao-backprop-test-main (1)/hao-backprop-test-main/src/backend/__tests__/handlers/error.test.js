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

  test('should redact query string names and values from the logged target', () => {
    // A not-found target is client-chosen and routinely carries credentials and
    // PII in its query string; none of it may reach the log (CWE-532)
    const req = {
      method: 'GET',
      url: '/missing?access_token=abc123&email=user@example.com'
    };

    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    handleNotFound(req, res);

    // Assert the record keeps the path and replaces the query with the marker
    expect(warn).toHaveBeenCalledWith('Not Found: GET /missing?[redacted]');

    // Assert no part of the raw target survives in the record
    const logged = warn.mock.calls[0][0];
    expect(logged).not.toContain('access_token');
    expect(logged).not.toContain('abc123');
    expect(logged).not.toContain('user@example.com');
    expect(logged).not.toContain(req.url);

    // Assert the client-visible response is unchanged by sanitization
    expect(res.statusCode).toBe(404);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.end).toHaveBeenCalledWith('Not Found');
  });

  test('should strip a fragment from the logged target, including a query behind it', () => {
    // The cut is made at whichever of '?' and '#' comes first, so a fragment
    // cannot smuggle parameters past the redaction
    const req = {
      method: 'GET',
      url: '/missing#section?access_token=abc123'
    };

    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    handleNotFound(req, res);

    // Assert only the path and the marker are logged
    expect(warn).toHaveBeenCalledWith('Not Found: GET /missing?[redacted]');
    expect(warn.mock.calls[0][0]).not.toContain('access_token');
  });

  test('should log the placeholder path for a target that is only a query string', () => {
    // A target with an empty path still has its parameters redacted, and the
    // absent path is reported as the placeholder rather than as empty text
    const req = {
      method: 'GET',
      url: '?access_token=abc123'
    };

    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    handleNotFound(req, res);

    // Assert the placeholder path and the redaction marker are logged
    expect(warn).toHaveBeenCalledWith('Not Found: GET -?[redacted]');
    expect(warn.mock.calls[0][0]).not.toContain('abc123');
  });

  test('should escape CR, LF, tab and terminal control characters in both fields', () => {
    // Control characters in a request field would let a caller forge additional
    // records in the newline-delimited sink or emit terminal escapes (CWE-117)
    const req = {
      method: 'GE\u001bT\n',
      url: '/a\r\nWARN: forged record\tand\u007fmore'
    };

    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    handleNotFound(req, res);

    // Assert every control character is rendered as a printable escape
    expect(warn).toHaveBeenCalledWith(
      'Not Found: GE\\x1bT\\n /a\\r\\nWARN: forged record\\tand\\x7fmore'
    );

    // Assert the record carries no raw control character of any kind
    const logged = warn.mock.calls[0][0];
    expect(logged).not.toMatch(/[\u0000-\u001F\u007F-\u009F]/);
    expect(res.end).toHaveBeenCalledWith('Not Found');
  });

  test('should log the placeholder for missing or non-string request fields', () => {
    // Fields that are absent, empty or not strings must never be coerced into
    // the record as 'undefined' or as an object rendering
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    // Absent fields
    handleNotFound({}, res);
    expect(warn).toHaveBeenNthCalledWith(1, 'Not Found: - -');

    // Empty fields
    handleNotFound({ method: '', url: '' }, res);
    expect(warn).toHaveBeenNthCalledWith(2, 'Not Found: - -');

    // Non-string fields
    handleNotFound({ method: 123, url: { path: '/missing' } }, res);
    expect(warn).toHaveBeenNthCalledWith(3, 'Not Found: - -');
  });

  test('should not throw when the request object itself is absent', () => {
    // An error handler that throws while reporting a failure is a worse outcome
    // than the failure it was called for
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    expect(() => handleNotFound(undefined, res)).not.toThrow();

    // Assert the response contract still holds and the record uses placeholders
    expect(res.statusCode).toBe(404);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.end).toHaveBeenCalledWith('Not Found');
    expect(warn).toHaveBeenCalledWith('Not Found: - -');
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

  test('should sanitize the logged request fields while still advertising allowed methods', () => {
    // The request fields are sanitized (CWE-532, CWE-117); the caller-supplied
    // allowed-method list is logged as-is so it matches the Allow header
    const req = {
      method: 'PO\nST',
      url: '/welcome?session=secret-value'
    };

    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    const allowedMethods = ['GET'];

    handleMethodNotAllowed(req, res, allowedMethods);

    // Assert the record carries the escaped method, the redacted target and the
    // untouched allowed-method list
    expect(warn).toHaveBeenCalledWith('Method Not Allowed: PO\\nST /welcome?[redacted] - Allowed methods: GET');
    expect(warn.mock.calls[0][0]).not.toContain('secret-value');

    // Assert the frozen response contract is unaffected
    expect(res.statusCode).toBe(405);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET');
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
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

  test('should redact query values and escape control characters in the logged target', () => {
    // A 500 is the record most likely to be shipped to an aggregator, so the raw
    // target must carry neither query secrets (CWE-532) nor control characters
    // that could forge surrounding records (CWE-117)
    const req = {
      method: 'GET',
      url: '/missing\t?access_token=abc123&email=user@example.com'
    };

    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    const err = {
      message: 'Test error',
      stack: 'Error stack trace'
    };

    handleServerError(req, res, err);

    // Assert the sanitized record and the unchanged error argument
    expect(error).toHaveBeenCalledWith('Server Error processing GET /missing\\t?[redacted]', err);

    // Assert nothing sensitive and no raw control character survives
    const logged = error.mock.calls[0][0];
    expect(logged).not.toContain('access_token');
    expect(logged).not.toContain('abc123');
    expect(logged).not.toContain('user@example.com');
    expect(logged).not.toMatch(/[\u0000-\u001F\u007F-\u009F]/);

    // Assert the client-visible response is unchanged by sanitization
    expect(res.statusCode).toBe(500);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
  });

  test('should log placeholders and not throw when the request object is absent', () => {
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      end: jest.fn()
    };

    const err = {
      message: 'Test error',
      stack: 'Error stack trace'
    };

    expect(() => handleServerError(undefined, res, err)).not.toThrow();

    // Assert the record uses placeholders and the response contract holds
    expect(error).toHaveBeenCalledWith('Server Error processing - -', err);
    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith('Internal Server Error');
  });
});