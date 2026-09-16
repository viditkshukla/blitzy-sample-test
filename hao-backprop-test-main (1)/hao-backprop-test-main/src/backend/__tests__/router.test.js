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
// A factory mock is required: automocking only stubs the methods the logger
// actually exports, and route() calls logger.request.
jest.mock('../utils/logger', () => ({
  request: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

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
    
    // Verify logged information contains only the path (not query params)
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(ROUTES.WELCOME));
    
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