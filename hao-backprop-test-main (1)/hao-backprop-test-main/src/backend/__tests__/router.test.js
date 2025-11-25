/**
 * Unit tests for the router.js module that handles routing of incoming HTTP requests
 * to appropriate handlers.
 */

// Import the route function from the router module
const route = require('../router');

// Import handlers and utilities used by the router
const { handleHelloRequest } = require('../handlers/helloHandler');
const { handle404 } = require('../errorHandler');
const { ROUTES } = require('../utils/constants');
const logger = require('../utils/logger');

// Mock dependencies
jest.mock('../handlers/helloHandler');
jest.mock('../errorHandler');
jest.mock('../utils/logger');

describe('route', () => {
  // Mock request and response objects
  let req;
  let res;

  beforeEach(() => {
    // Setup fresh mocks before each test
    req = {
      url: '/hello',
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

  it('should route to handleHelloRequest for /hello path', () => {
    // Set request URL to /hello
    req.url = '/hello';
    
    // Call the route function
    route(req, res);
    
    // Verify the logger was called with the request
    expect(logger.request).toHaveBeenCalledWith(req);
    
    // Verify debugging information was logged
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('/hello'));
    
    // Verify the correct handler was called
    expect(handleHelloRequest).toHaveBeenCalledWith(req, res);
    
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
    
    // Verify debugging information was logged
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('/undefined'));
    
    // Verify the 404 handler was called
    expect(handle404).toHaveBeenCalledWith(res);
    
    // Verify the hello handler was not called
    expect(handleHelloRequest).not.toHaveBeenCalled();
  });

  it('should correctly parse URL path from request', () => {
    // Set request URL with query parameters
    req.url = '/hello?param=value';
    
    // Call the route function
    route(req, res);
    
    // Verify debugging information contains only the path (not query params)
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('/hello'));
    
    // Verify the correct handler was called based on the parsed path
    expect(handleHelloRequest).toHaveBeenCalledWith(req, res);
    
    // Verify the 404 handler was not called
    expect(handle404).not.toHaveBeenCalled();
  });

  it('should handle URL parsing errors gracefully', () => {
    // Set URL to a value that might cause parsing issues
    req.url = undefined;
    
    // Call the route function
    route(req, res);
    
    // Verify fallback behavior for parsing errors
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('/'));
    expect(handle404).toHaveBeenCalledWith(res);
    expect(handleHelloRequest).not.toHaveBeenCalled();
  });

  it('should correctly match routes to handlers', () => {
    // Since matchRoute is internal, we'll test the behavior it controls
    
    // Test the main /hello route
    req.url = ROUTES.HELLO;
    route(req, res);
    expect(handleHelloRequest).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // Test with trailing slash (which should be normalized)
    req.url = ROUTES.HELLO + '/';
    route(req, res);
    expect(handleHelloRequest).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // Test an undefined route
    req.url = '/notdefined';
    route(req, res);
    expect(handle404).toHaveBeenCalled();
  });
});