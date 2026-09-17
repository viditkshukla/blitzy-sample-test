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
 * Loads a fresh copy of the logger with output enabled.
 *
 * The logger suppresses every record when `config.IS_TEST` is set, which it is
 * under Jest, so the records below are unobservable with the module as the rest
 * of this file loads it. The configuration is therefore mocked for these tests
 * only, inside `jest.isolateModules`, so the module registry the tests above
 * use is left exactly as it was.
 *
 * @returns {Object} A logger whose records reach the console
 */
function loadLoggerWithOutputEnabled() {
  let loaded;
  
  jest.isolateModules(() => {
    jest.doMock('../../config', () => ({
      NODE_ENV: 'development',
      IS_TEST: false
    }));
    
    loaded = require('../../utils/logger');
  });
  
  jest.dontMock('../../config');
  
  return loaded;
}

describe('access record target sanitisation', () => {
  let logger;
  
  beforeEach(() => {
    mockConsole();
    logger = loadLoggerWithOutputEnabled();
  });
  
  afterEach(() => {
    resetMocks();
  });
  
  it('records the request target unchanged when it carries no query string', () => {
    // The four-field access-record format is unchanged for every path in the
    // endpoint contract, none of which carries a query string
    logger.logRequest({ method: 'GET', url: '/welcome' }, { statusCode: 200 }, 0);
    
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log.mock.calls[0][0]).toContain('GET /welcome 200 0ms');
  });
  
  it('redacts a query string so its values never reach the log', () => {
    logger.logRequest(
      { method: 'GET', url: '/welcome?token=QSTOKEN-abc123&password=QSPASS-xyz&api_key=QSKEY-42' },
      { statusCode: 200 },
      0
    );
    
    const [record] = console.log.mock.calls[0];
    
    // The path and the fact that a query was present are both retained
    expect(record).toContain('GET /welcome?[redacted] 200 0ms');
    
    // None of the values is
    expect(record).not.toContain('QSTOKEN-abc123');
    expect(record).not.toContain('QSPASS-xyz');
    expect(record).not.toContain('QSKEY-42');
    expect(record).not.toContain('token=');
    expect(record).not.toContain('password=');
  });
  
  it('redacts a fragment as it does a query string', () => {
    logger.logRequest({ method: 'GET', url: '/welcome#QSFRAGMENT-1' }, { statusCode: 200 }, 0);
    
    const [record] = console.log.mock.calls[0];
    expect(record).toContain('GET /welcome?[redacted] 200 0ms');
    expect(record).not.toContain('QSFRAGMENT-1');
  });
  
  it('bounds the recorded target so one request cannot write an unbounded record', () => {
    // A 15 000-character target previously wrote a record of the same order
    logger.logRequest({ method: 'GET', url: `/${'a'.repeat(15000)}` }, { statusCode: 404 }, 0);
    
    const [record] = console.warn.mock.calls[0];
    
    expect(record).toContain('...[truncated]');
    expect(record.length).toBeLessThan(512);
  });
  
  it('records a placeholder rather than failing when the target is absent', () => {
    logger.logRequest({ method: 'GET' }, { statusCode: 404 }, 0);
    
    expect(console.warn.mock.calls[0][0]).toContain('GET - 404 0ms');
  });
  
  it('does not throw on a malformed absolute-form target', () => {
    // 'http://[' makes url.parse raise ERR_INVALID_URL, so the sanitiser must
    // not depend on parsing the target
    expect(() => {
      logger.logRequest({ method: 'GET', url: 'http://[?token=QSTOKEN-abc123' }, { statusCode: 404 }, 0);
    }).not.toThrow();
    
    const [record] = console.warn.mock.calls[0];
    expect(record).toContain('GET http://[?[redacted] 404 0ms');
    expect(record).not.toContain('QSTOKEN-abc123');
  });
  
  it('selects the log level from the status code', () => {
    logger.logRequest({ method: 'GET', url: '/welcome' }, { statusCode: 200 }, 1);
    logger.logRequest({ method: 'GET', url: '/hello' }, { statusCode: 404 }, 2);
    logger.logRequest({ method: 'GET', url: '/boom' }, { statusCode: 500 }, 3);
    
    expect(console.log.mock.calls[0][0]).toContain('INFO: GET /welcome 200 1ms');
    expect(console.warn.mock.calls[0][0]).toContain('WARN: GET /hello 404 2ms');
    expect(console.error.mock.calls[0][0]).toContain('ERROR: GET /boom 500 3ms');
  });
});

describe('error record stack suppression', () => {
  let logger;
  
  beforeEach(() => {
    mockConsole();
    logger = loadLoggerWithOutputEnabled();
  });
  
  afterEach(() => {
    resetMocks();
  });
  
  it("records an error's message without its stack", () => {
    const err = new Error('Invalid URL');
    
    logger.error('Server Error processing GET', err);
    
    expect(console.error).toHaveBeenCalledTimes(1);
    
    const [record] = console.error.mock.calls[0];
    
    // The message is recorded
    expect(record).toContain('Server Error processing GET: Invalid URL');
    
    // The frames are not. A stack in the log discloses absolute filesystem
    // paths, internal module paths and the middleware chain, and multiplies
    // the bytes one request can write.
    expect(record).not.toContain('    at ');
    expect(record).not.toContain(err.stack);
    expect(record).not.toContain(__filename);
    expect(record.split('\n')).toHaveLength(1);
  });
  
  it('records the message alone when no error object is supplied', () => {
    logger.error('Server error');
    
    expect(console.error.mock.calls[0][0]).toContain('Server error');
    expect(console.error.mock.calls[0][0]).not.toContain('undefined');
  });
});