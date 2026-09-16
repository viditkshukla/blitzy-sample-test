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
    jest.clearAllMocks();

    // Create a mock server object with required methods
    mockServer = {
      on: jest.fn(),
      listen: jest.fn((port, host, callback) => callback()),
      close: jest.fn(callback => callback())
    };

    jest.spyOn(http, 'createServer').mockReturnValue(mockServer);

    // Mock logger functions
    jest.spyOn(logger, 'logServerStart').mockImplementation(() => {});
    jest.spyOn(logger, 'logServerStop').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();

    // Close any open server instances
    if (testServer && testServer.close) {
      testServer.close();
    }
  });

  test('should create an HTTP server with the correct request handler', async () => {
    const startedServer = await startServer();

    expect(http.createServer).toHaveBeenCalledTimes(1);

    // server.js keeps handleRequest private, so the handler it passes is
    // identified by name and (req, res) arity rather than by reference.
    const [requestHandler] = http.createServer.mock.calls[0];
    expect(typeof requestHandler).toBe('function');
    expect(requestHandler.name).toBe('handleRequest');
    expect(requestHandler).toHaveLength(2);

    expect(startedServer).toBe(mockServer);
  });

  test('should handle errors on the server', async () => {
    await startServer();

    expect(mockServer.on).toHaveBeenCalledWith('error', expect.any(Function));

    const error = new Error('Test server error');
    const errorHandler = mockServer.on.mock.calls.find(call => call[0] === 'error')[1];
    errorHandler(error);

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

    expect(mockServer.listen).toHaveBeenCalledWith(
      PORT,
      HOST,
      expect.any(Function)
    );

    expect(logger.logServerStart).toHaveBeenCalledWith(HOST, PORT);

    expect(server).toBe(mockServer);
  });

  test('should apply bounded timeouts and a connection ceiling before listening', async () => {
    let limitsWhenListening;

    mockServer.listen.mockImplementation((port, host, callback) => {
      limitsWhenListening = {
        requestTimeout: mockServer.requestTimeout,
        headersTimeout: mockServer.headersTimeout,
        keepAliveTimeout: mockServer.keepAliveTimeout,
        maxConnections: mockServer.maxConnections
      };
      callback();
    });

    await startServer();

    // SERVER_LIMITS is module-private in server.js, so the contracted bounds
    // are stated here. Capturing them inside listen is what proves they are
    // in force before the first connection can be accepted.
    expect(limitsWhenListening).toEqual({
      requestTimeout: 30000,
      headersTimeout: 10000,
      keepAliveTimeout: 5000,
      maxConnections: 512
    });
    expect(limitsWhenListening.headersTimeout)
      .toBeLessThan(limitsWhenListening.requestTimeout);
  });

  test('should reject the promise if server fails to start', async () => {
    const startError = new Error('Failed to start server');

    mockServer.listen.mockImplementation((port, host, callback) => {
      callback(startError);
    });

    await expect(startServer()).rejects.toThrow(startError);

    expect(logger.error).toHaveBeenCalledWith('Error starting server', startError);
  });
});

describe('stopServer', () => {
  let mockServer;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockServer = {
      on: jest.fn(),
      listen: jest.fn((port, host, callback) => callback()),
      close: jest.fn(callback => callback()),
      listening: true
    };

    jest.spyOn(http, 'createServer').mockReturnValue(mockServer);
    jest.spyOn(logger, 'logServerStart').mockImplementation(() => {});
    jest.spyOn(logger, 'logServerStop').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});

    // stopServer() takes no parameters and acts on server.js's module-level
    // instance, so the mock has to be installed there by starting it. Without
    // this the per-test close behaviour below would never be reached.
    await startServer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should stop the server gracefully', async () => {
    await stopServer();

    expect(mockServer.close).toHaveBeenCalled();

    expect(logger.logServerStop).toHaveBeenCalled();
  });

  test('should reject the promise if server fails to stop', async () => {
    const closeError = new Error('Failed to close server');

    // The mock is the module-level server started above, so overriding its
    // close callback here is the failure the production stopServer() sees.
    mockServer.close.mockImplementation(callback => {
      callback(closeError);
    });

    await expect(stopServer()).rejects.toThrow(closeError);

    expect(logger.error).toHaveBeenCalledWith('Error stopping server', closeError);
  });
});

describe('request handling', () => {
  beforeEach(async () => {
    // Restore spies before starting the real server. This undoes the lifecycle
    // blocks' jest.spyOn calls; the hoisted welcomeHandler module mock is not
    // affected by it and stays in place.
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

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });
});