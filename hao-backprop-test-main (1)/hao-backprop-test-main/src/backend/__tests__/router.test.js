/**
 * Unit tests for the router.js module that handles routing of incoming HTTP requests
 * to appropriate handlers.
 */

// Import the route function from the router module
const route = require('../router');

// Import handlers and utilities used by the router
const { handleWelcomeRequest } = require('../handlers/welcomeHandler');
const { handle404 } = require('../errorHandler');
const { ROUTES } = require('../utils/constants');
const logger = require('../utils/logger');

// Mock dependencies
jest.mock('../handlers/welcomeHandler');
jest.mock('../errorHandler');
// The logger mock is derived from the real module's own export surface rather
// than hand-written. It still supplies request, info, warn and error, because
// src/backend/utils/logger.js exports all four, but it cannot invent a method
// the emitter does not have: drop request from the logger and logger.request
// becomes undefined here, so route()'s first statement throws in this suite
// instead of the defect being masked until production.
jest.mock('../utils/logger', () => {
  const actualLogger = jest.requireActual('../utils/logger');
  
  return Object.keys(actualLogger).reduce((mockLogger, method) => {
    mockLogger[method] = typeof actualLogger[method] === 'function'
      ? jest.fn()
      : actualLogger[method];
    
    return mockLogger;
  }, {});
});

describe('route', () => {
  // Mock request and response objects
  let req;
  let res;

  beforeEach(() => {
    // Setup fresh mocks before each test
    req = {
      url: ROUTES.WELCOME,
      method: 'GET'
    };
    res = {};
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    jest.resetAllMocks();
  });

  it('should route to handleWelcomeRequest for /welcome path', () => {
    // Set request URL to /welcome
    req.url = ROUTES.WELCOME;
    
    // Call the route function
    route(req, res);
    
    // Verify the logger was called with the request
    expect(logger.request).toHaveBeenCalledWith(req);
    
    // Verify routing information was logged
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(ROUTES.WELCOME));
    
    // Verify the correct handler was called
    expect(handleWelcomeRequest).toHaveBeenCalledWith(req, res);
    
    // Verify the 404 handler was not called
    expect(handle404).not.toHaveBeenCalled();
  });

  it('should call handle404 for undefined routes', () => {
    // Set request URL to an undefined route
    req.url = '/undefined';
    
    // Call the route function
    route(req, res);
    
    // Verify the logger was called with the request
    expect(logger.request).toHaveBeenCalledWith(req);
    
    // Verify routing information was logged
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('/undefined'));
    
    // Verify the 404 handler was called
    expect(handle404).toHaveBeenCalledWith(res);
    
    // Verify the welcome handler was not called
    expect(handleWelcomeRequest).not.toHaveBeenCalled();
  });

  it('should correctly parse URL path from request', () => {
    // Set request URL with query parameters
    req.url = `${ROUTES.WELCOME}?param=value`;
    
    // Call the route function
    route(req, res);
    
    // Verify logged information contains only the path (not query params).
    // The comparison is exact, and a second assertion rejects the query string
    // outright: a substring match would also accept the leaked
    // '/welcome?param=value', which is the opposite of what this test claims.
    expect(logger.info).toHaveBeenCalledWith(`Routing to handler for path: ${ROUTES.WELCOME}`);
    expect(logger.info).not.toHaveBeenCalledWith(expect.stringContaining('?param=value'));
    
    // Verify the correct handler was called based on the parsed path
    expect(handleWelcomeRequest).toHaveBeenCalledWith(req, res);
    
    // Verify the 404 handler was not called
    expect(handle404).not.toHaveBeenCalled();
  });

  it('should handle URL parsing errors gracefully', () => {
    // Set URL to a value that might cause parsing issues
    req.url = undefined;
    
    // Call the route function
    route(req, res);
    
    // Verify fallback behavior for parsing errors
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('/'));
    expect(handle404).toHaveBeenCalledWith(res);
    expect(handleWelcomeRequest).not.toHaveBeenCalled();
  });

  it('should correctly match routes to handlers', () => {
    // Since matchRoute is internal, we'll test the behavior it controls
    
    // Test the main /welcome route
    req.url = ROUTES.WELCOME;
    route(req, res);
    expect(handleWelcomeRequest).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // Test with trailing slash (which should be normalized)
    req.url = ROUTES.WELCOME + '/';
    route(req, res);
    expect(handleWelcomeRequest).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // Test an undefined route
    req.url = '/notdefined';
    route(req, res);
    expect(handle404).toHaveBeenCalled();
  });
});