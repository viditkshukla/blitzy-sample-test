/**
 * Server Test Module
 * 
 * Tests for the Node.js HTTP server implementation, verifying server initialization,
 * request handling, and error management.
 * 
 * @jest-environment node
 */

// Import Node.js built-in modules
const http = require('http'); // native

// Import testing utilities
const request = require('supertest'); // v6.3.3

// Mock the welcome handler so the function object server.js captures at require
// time is the mock. jest.mock is hoisted above every require below.
jest.mock('../handlers/welcomeHandler', () => ({ handleWelcomeRequest: jest.fn() }));

// Import modules to test
const { startServer, stopServer } = require('../server');
const welcomeHandler = require('../handlers/welcomeHandler');
const actualWelcome = jest.requireActual('../handlers/welcomeHandler');
const { handleNotFound, handleServerError } = require('../handlers/error');
const logger = require('../utils/logger');
const { PORT, HOST } = require('../config');
const { MESSAGES, HEADERS } = require('../utils/constants');

// Global reference for test server
let testServer;

describe('createServer', () => {
  let mockServer;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a mock server object with required methods
    mockServer = {
      on: jest.fn(),
      listen: jest.fn((port, host, callback) => callback()),
      close: jest.fn(callback => callback())
    };
    
    // Mock http.createServer
    jest.spyOn(http, 'createServer').mockReturnValue(mockServer);
    
    // Mock logger functions
    jest.spyOn(logger, 'logServerStart').mockImplementation(() => {});
    jest.spyOn(logger, 'logServerStop').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore all mocks
    jest.restoreAllMocks();
    
    // Close any open server instances
    if (testServer && testServer.close) {
      testServer.close();
    }
  });

  test('should create an HTTP server with the correct request handler', async () => {
    // Start server which internally creates the HTTP server
    await startServer();
    
    // Assert http.createServer was called with a function
    expect(http.createServer).toHaveBeenCalledWith(expect.any(Function));
    
    // Assert server has been returned
    expect(mockServer).toBeDefined();
  });

  test('should handle errors on the server', async () => {
    // Start server to create and configure server instance
    await startServer();
    
    // Assert error handler was registered
    expect(mockServer.on).toHaveBeenCalledWith('error', expect.any(Function));
    
    // Simulate an error event
    const error = new Error('Test server error');
    const errorHandler = mockServer.on.mock.calls.find(call => call[0] === 'error')[1];
    errorHandler(error);
    
    // Assert that logger.error was called with the error
    expect(logger.error).toHaveBeenCalledWith('Server error', error);
  });
});

describe('startServer', () => {
  let mockServer;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockServer = {
      on: jest.fn(),
      listen: jest.fn((port, host, callback) => callback()),
      close: jest.fn(callback => callback())
    };
    
    jest.spyOn(http, 'createServer').mockReturnValue(mockServer);
    jest.spyOn(logger, 'logServerStart').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should start the server on the configured port and host', async () => {
    const server = await startServer();
    
    // Assert server.listen was called with correct parameters
    expect(mockServer.listen).toHaveBeenCalledWith(
      PORT,
      HOST,
      expect.any(Function)
    );
    
    // Assert logger was called with the correct parameters
    expect(logger.logServerStart).toHaveBeenCalledWith(HOST, PORT);
    
    // Assert the returned promise resolves to the server instance
    expect(server).toBe(mockServer);
  });

  test('should reject the promise if server fails to start', async () => {
    const startError = new Error('Failed to start server');
    
    // Make listen method call callback with an error
    mockServer.listen.mockImplementation((port, host, callback) => {
      callback(startError);
    });
    
    // Assert startServer rejects with the error
    await expect(startServer()).rejects.toThrow(startError);
    
    // Assert error was logged
    expect(logger.error).toHaveBeenCalledWith('Error starting server', startError);
  });
});

describe('stopServer', () => {
  let mockServer;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockServer = {
      close: jest.fn(callback => callback()),
      listening: true
    };
    
    jest.spyOn(logger, 'logServerStop').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should stop the server gracefully', async () => {
    await stopServer(mockServer);
    
    // Assert server.close was called
    expect(mockServer.close).toHaveBeenCalled();
    
    // Assert logger was called
    expect(logger.logServerStop).toHaveBeenCalled();
  });

  test('should reject the promise if server fails to stop', async () => {
    const closeError = new Error('Failed to close server');
    
    // Make close method call callback with an error
    mockServer.close.mockImplementation(callback => {
      callback(closeError);
    });
    
    // Assert stopServer rejects with the error
    await expect(stopServer(mockServer)).rejects.toThrow(closeError);
    
    // Assert error was logged
    expect(logger.error).toHaveBeenCalledWith('Error stopping server', closeError);
  });
});

describe('request handling', () => {
  beforeEach(async () => {
    // Restore original modules for these integration tests
    jest.restoreAllMocks();
    
    // Start a real server for request testing
    testServer = await startServer();
  });

  beforeEach(() => {
    // jest.config.js sets resetMocks: true, which strips the mock's
    // implementation before every test, so reinstate the real handler.
    welcomeHandler.handleWelcomeRequest.mockImplementation(
      (req, res) => actualWelcome.handleWelcomeRequest(req, res)
    );
  });

  afterEach(async () => {
    // Stop the server after each test
    if (testServer) {
      await stopServer(testServer);
    }
  });

  test('should route GET /welcome requests to handleWelcomeRequest', async () => {
    const response = await request(testServer)
      .get('/welcome')
      .expect(200)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_HTML);
      
    // Assert the response body carries the Welcome screen
    expect(response.text).toContain(MESSAGES.WELCOME_HEADING);
    expect(response.text).toContain(MESSAGES.WELCOME_DESCRIPTION);
  });

  test('should return 404 for the retired /hello path', async () => {
    // The retired path is no longer registered, so routeRequest falls through
    // to handleNotFound, which answers 404 with the plain-text NOT_FOUND body.
    const response = await request(testServer)
      .get('/hello')
      .expect(404)
      .expect('Content-Type', 'text/plain');

    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  test('should return 404 for requests to non-existent paths', async () => {
    await request(testServer)
      .get('/not-found')
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect('Not Found');
  });

  test('should return 405 for non-GET requests to /welcome endpoint', async () => {
    await request(testServer)
      .post('/welcome')
      .expect(405)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET')
      .expect('Method Not Allowed');
  });

  test('should handle server errors correctly', async () => {
    // Stop the server so we can restart with mocked handlers
    await stopServer(testServer);
    
    // Make the welcome handler throw for the next call only
    welcomeHandler.handleWelcomeRequest.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // Restart server with mocked handler
    testServer = await startServer();
    
    await request(testServer)
      .get('/welcome')
      .expect(500)
      .expect('Content-Type', 'text/plain')
      .expect('Internal Server Error');
  });

  test('should set security headers on responses', async () => {
    const response = await request(testServer)
      .get('/welcome');
      
    // Assert security headers are set
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });
});