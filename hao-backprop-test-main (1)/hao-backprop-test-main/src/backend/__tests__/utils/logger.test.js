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