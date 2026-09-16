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

/**
 * Loads a fresh copy of the logger with NODE_ENV forced to the supplied value.
 *
 * The emitter reads IS_TEST from the configuration module at require time and
 * suppresses every line while it is true, and Jest sets NODE_ENV=test for the
 * whole run, so the module as required at the top of this file writes nothing
 * to the console. Re-requiring it inside an isolated registry with
 * NODE_ENV='production' is what makes the formatted output observable. That
 * value is chosen deliberately: the configuration module prints a notice about
 * the absent .env file for every other environment, which would add console
 * calls this suite does not own.
 *
 * @param {string} nodeEnv - Value of NODE_ENV to load the logger under
 * @returns {Object} A freshly required logger instance
 */
function loadLoggerForEnv(nodeEnv) {
  const originalNodeEnv = process.env.NODE_ENV;
  let freshLogger;

  process.env.NODE_ENV = nodeEnv;

  try {
    jest.isolateModules(() => {
      freshLogger = require('../../utils/logger');
    });
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
  }

  return freshLogger;
}

/**
 * Joins everything a console mock was called with into one searchable string,
 * so an assertion can prove a value is absent from the whole captured output
 * rather than from one call.
 *
 * @param {Function} consoleMock - A mocked console method
 * @returns {string} Every argument of every call, newline separated
 */
function capturedOutput(consoleMock) {
  return consoleMock.mock.calls
    .map((callArguments) => callArguments.join(' '))
    .join('\n');
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

describe('logger request logging', () => {
  // Timestamp prefix the emitter puts in front of every line, so the
  // assertions below can pin the whole record rather than a fragment of it.
  const TIMESTAMP_PREFIX = '^\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z\\] ';

  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    resetMocks();
  });

  it('exports a request method, which src/backend/router.js:45 calls on every dispatch', () => {
    const logger = require('../../utils/logger');
    
    // The dispatcher's first statement is logger.request(req). While the
    // emitter exported no such method, requiring and calling the router threw
    // TypeError: logger.request is not a function before any routing happened.
    expect(typeof logger.request).toBe('function');
    expect(request).toBe(logger.request);
  });

  it('request logs the method and the path, never the query string', () => {
    const logger = loadLoggerForEnv('production');
    
    logger.request({
      method: 'GET',
      url: '/welcome?token=super-secret-token&email=user@example.com'
    });
    
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log.mock.calls[0][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET /welcome$`));
    
    // No part of the query string may reach the log stream (CWE-532)
    const output = capturedOutput(console.log);
    expect(output).not.toContain('token');
    expect(output).not.toContain('super-secret-token');
    expect(output).not.toContain('user@example.com');
    expect(output).not.toContain('?');
  });

  it('logRequest keeps the four-field access record and logs the path only', () => {
    const logger = loadLoggerForEnv('production');
    
    logger.logRequest(
      { method: 'GET', url: '/welcome?token=super-secret-token' },
      { statusCode: 200 },
      12
    );
    
    // A query string followed by a fragment: the record is cut at the '?'
    logger.logRequest(
      { method: 'GET', url: '/welcome?token=super-secret-token#top' },
      { statusCode: 200 },
      3
    );
    
    expect(console.log.mock.calls[0][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET /welcome 200 12ms$`));
    expect(console.log.mock.calls[1][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET /welcome 200 3ms$`));
    
    const output = capturedOutput(console.log);
    expect(output).not.toContain('token');
    expect(output).not.toContain('super-secret-token');
    expect(output).not.toContain('?');
  });

  it('logRequest still selects warn for 4xx and error for 5xx, with no query values in either', () => {
    const logger = loadLoggerForEnv('production');
    
    logger.logRequest({ method: 'POST', url: '/welcome?token=leak-me' }, { statusCode: 405 }, 4);
    logger.logRequest({ method: 'GET', url: '/welcome?token=leak-me' }, { statusCode: 500 }, 7);
    
    expect(console.warn.mock.calls[0][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}WARN: POST /welcome 405 4ms$`));
    expect(console.error.mock.calls[0][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}ERROR: GET /welcome 500 7ms$`));
    expect(capturedOutput(console.warn)).not.toContain('leak-me');
    expect(capturedOutput(console.error)).not.toContain('leak-me');
  });

  it('strips a fragment and falls back to a placeholder when the target is absent', () => {
    const logger = loadLoggerForEnv('production');
    
    logger.request({ method: 'GET', url: '/welcome#top' });
    logger.request({ method: 'GET', url: '/welcome#top?token=leak-me' });
    
    // A target that is nothing but a query string leaves no path behind, and
    // the placeholder must stand in for it rather than the query surviving as
    // the record's path field
    logger.request({ method: 'GET', url: '?token=leak-me' });
    
    // router.js calls logger.request(req) before it parses req.url, so an
    // absent or empty target must be recorded, not thrown on
    expect(() => logger.request({ method: 'GET' })).not.toThrow();
    expect(() => logger.request({})).not.toThrow();
    
    expect(console.log.mock.calls[0][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET /welcome$`));
    expect(console.log.mock.calls[1][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET /welcome$`));
    expect(console.log.mock.calls[2][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET -$`));
    expect(console.log.mock.calls[3][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: GET -$`));
    expect(console.log.mock.calls[4][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}INFO: - -$`));
    expect(capturedOutput(console.log)).not.toContain('leak-me');
    
    logger.logRequest({ method: 'GET', url: '' }, { statusCode: 404 }, 1);
    
    expect(console.warn.mock.calls[0][0]).toMatch(new RegExp(`${TIMESTAMP_PREFIX}WARN: GET - 404 1ms$`));
  });
});