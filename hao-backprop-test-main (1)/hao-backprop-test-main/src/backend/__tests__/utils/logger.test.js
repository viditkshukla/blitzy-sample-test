const { info, error, warn, debug, request, response } = require('../../utils/logger');

/**
 * Sets up mocks for console methods to capture and verify logging output
 */
function mockConsole() {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'debug').mockImplementation(() => {});
}

/**
 * Resets all console method mocks after each test
 */
function resetMocks() {
  console.log.mockRestore();
  console.error.mockRestore();
  console.warn.mockRestore();
  console.debug.mockRestore();
}

/**
 * Creates a mock HTTP request object for testing request logging
 * @returns {object} Mock HTTP request object
 */
function createMockRequest() {
  return {
    method: 'GET',
    url: '/hello'
  };
}

/**
 * Creates a mock HTTP response object for testing response logging
 * @returns {object} Mock HTTP response object
 */
function createMockResponse() {
  return {
    statusCode: 200,
    getHeader: jest.fn().mockReturnValue(11) // "Hello world" is 11 bytes
  };
}

describe('logger', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    resetMocks();
  });

  it('info method should log informational messages to console.log with proper formatting', () => {
    info('Test info message');
    
    expect(console.log).toHaveBeenCalledTimes(1);
    // Check that the log message has the correct format with timestamp and INFO level
    expect(console.log.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[INFO\] Test info message$/);
  });

  it('error method should log error messages to console.error with proper formatting', () => {
    error('Test error message');
    
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[ERROR\] Test error message$/);
  });

  it('error method should log Error objects to console.error with message and stack trace', () => {
    const testError = new Error('Test error object');
    error(testError);
    
    expect(console.error).toHaveBeenCalledTimes(2);
    // First call should have the formatted error message
    expect(console.error.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[ERROR\] Test error object$/);
    // Second call should have the stack trace
    expect(console.error.mock.calls[1][0]).toBe(testError.stack);
  });

  it('warn method should log warning messages to console.warn with proper formatting', () => {
    warn('Test warning message');
    
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[WARN\] Test warning message$/);
  });

  it('debug method should log debug messages to console.debug when in development environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    debug('Test debug message');
    
    expect(console.debug).toHaveBeenCalledTimes(1);
    expect(console.debug.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[DEBUG\] Test debug message$/);
    
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('debug method should not log debug messages when not in development environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    debug('Test debug message');
    
    expect(console.debug).not.toHaveBeenCalled();
    
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('request method should log HTTP request information to console.log', () => {
    const mockReq = createMockRequest();
    request(mockReq);
    
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[INFO\] GET \/hello$/);
  });

  it('response method should log HTTP response information to console.log', () => {
    const mockRes = createMockResponse();
    response(mockRes);
    
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log.mock.calls[0][0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[INFO\] 200 - 11 bytes$/);
    expect(mockRes.getHeader).toHaveBeenCalledWith('Content-Length');
  });
});

/**
 * The access record written by `logRequest` is the only place in the service
 * that puts a request target into the log, and the target is entirely
 * client-controlled. These tests pin the two properties that make it safe to
 * persist: query and fragment values are redacted rather than recorded
 * (CWE-532, sensitive information in log data) and the retained path is capped
 * (CWE-779, an unbounded record one caller can inflate at will).
 *
 * `logRequest` has to be exercised through a logger loaded in an isolated
 * module registry. The module reads `IS_TEST` from `config.js` once, at require
 * time, and `log()` returns early when it is set — which Jest always sets,
 * because it runs with `NODE_ENV=test`. Loading a copy against a configuration
 * double with `IS_TEST: false` is what makes the record text observable at all,
 * and `jest.isolateModules` keeps that copy out of the registry the rest of
 * this file shares. The same technique, and the same reason for it, is
 * documented in `__tests__/server.test.js`.
 */
describe('logRequest access record', () => {
  /**
   * Captures the single access record `logRequest` writes for one exchange.
   *
   * @param {string|undefined} url - Raw request target to record
   * @param {number} [statusCode] - Response status, which selects the console method
   * @returns {string} The formatted record, without its timestamp prefix
   */
  function recordFor(url, statusCode = 200) {
    let isolatedLogger;

    jest.isolateModules(() => {
      // Only the two fields logger.js reads are needed; IS_TEST: false is what
      // lifts the test-environment suppression inside log().
      jest.doMock('../../config', () => ({
        NODE_ENV: 'development',
        IS_TEST: false
      }));

      isolatedLogger = require('../../utils/logger');
    });

    isolatedLogger.logRequest({ method: 'GET', url }, { statusCode }, 0);

    // 2xx records go to console.log, 4xx to console.warn, 5xx to console.error
    const sink = statusCode >= 500
      ? console.error
      : statusCode >= 400
        ? console.warn
        : console.log;

    expect(sink).toHaveBeenCalledTimes(1);

    return sink.mock.calls[0][0].replace(/^\[[^\]]+\] [A-Z]+: /, '');
  }

  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    resetMocks();
    jest.dontMock('../../config');
  });

  it('records an ordinary target verbatim, keeping the four-field shape', () => {
    expect(recordFor('/welcome')).toBe('GET /welcome 200 0ms');
  });

  it('redacts a query string instead of recording its values', () => {
    expect(recordFor('/welcome?token=SECRET_TOKEN_VALUE&password=hunter2'))
      .toBe('GET /welcome?[redacted] 200 0ms');
  });

  it('redacts a query string on a 404 record as well as a 200', () => {
    const record = recordFor('/hello?token=SECRET_TOKEN_VALUE&password=hunter2', 404);

    expect(record).toBe('GET /hello?[redacted] 404 0ms');
    expect(record).not.toContain('SECRET_TOKEN_VALUE');
    expect(record).not.toContain('hunter2');
  });

  it('redacts a fragment, which a client can also send in the target', () => {
    expect(recordFor('/welcome#secret-anchor')).toBe('GET /welcome?[redacted] 200 0ms');
  });

  it('redacts a query string on a 5xx record, which is emitted at error level', () => {
    const record = recordFor('/welcome?token=SECRET_TOKEN_VALUE', 500);

    expect(record).toBe('GET /welcome?[redacted] 500 0ms');
    expect(record).not.toContain('SECRET_TOKEN_VALUE');
  });

  it('caps a long path so one request cannot write an unbounded record', () => {
    const record = recordFor(`/${'Z'.repeat(7000)}?token=LONGSECRET`, 404);

    // 256 retained characters, the truncation marker, then the redacted query
    expect(record).toBe(`GET /${'Z'.repeat(255)}...[truncated]?[redacted] 404 0ms`);
    expect(record).not.toContain('LONGSECRET');
    expect(record.length).toBeLessThan(300);
  });

  it('leaves a path exactly at the cap untruncated', () => {
    const atCap = `/${'Z'.repeat(255)}`;

    expect(recordFor(atCap)).toBe(`GET ${atCap} 200 0ms`);
  });

  it('substitutes a placeholder when the target is absent, keeping the field count', () => {
    expect(recordFor(undefined)).toBe('GET - 200 0ms');
  });

  it('substitutes a placeholder for an empty target, keeping the field count', () => {
    expect(recordFor('')).toBe('GET - 200 0ms');
  });
});