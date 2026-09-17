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
const net = require('net'); // native

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

/**
 * Sends a raw request line to a listening server and resolves with everything
 * it writes back.
 *
 * Supertest builds its requests through Node's HTTP client, which cannot emit a
 * malformed request target, so the parser-level cases are driven over a plain
 * socket instead.
 *
 * @param {number} port - Port the server under test is listening on
 * @param {string} payload - Raw bytes to write, including the CRLF framing
 * @returns {Promise<string>} Everything the server wrote before closing
 */
function sendRaw(port, payload) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ port, host: '127.0.0.1' });
    let received = '';

    socket.setTimeout(5000);
    socket.on('data', (chunk) => { received += chunk.toString('utf8'); });
    socket.on('end', () => resolve(received));
    socket.on('close', () => resolve(received));
    socket.on('timeout', () => { socket.destroy(); reject(new Error('raw request timed out')); });
    socket.on('error', reject);
    socket.on('connect', () => socket.write(payload));
  });
}

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

describe('clientError handling', () => {
  let mockServer;

  /**
   * Builds a socket double that records what the listener writes to it.
   *
   * @param {Object} [state] - Socket state to present to the listener
   * @returns {Object} Socket double
   */
  function createMockSocket(state = {}) {
    return {
      writable: true,
      destroyed: false,
      bytesWritten: 0,
      ...state,
      end: jest.fn(),
      destroy: jest.fn()
    };
  }

  /**
   * Starts the server against the mock and returns its clientError listener.
   *
   * @returns {Promise<Function>} The registered listener
   */
  async function getClientErrorListener() {
    await startServer();

    const registration = mockServer.on.mock.calls.find(call => call[0] === 'clientError');
    expect(registration).toBeDefined();

    return registration[1];
  }

  beforeEach(() => {
    jest.clearAllMocks();

    mockServer = {
      on: jest.fn(),
      listen: jest.fn((port, host, callback) => callback()),
      close: jest.fn(callback => callback())
    };

    jest.spyOn(http, 'createServer').mockReturnValue(mockServer);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should register a clientError listener so parser rejections are not silent', async () => {
    // Node's HTTP parser answers a malformed request itself, so neither the
    // middleware chain nor the dispatcher runs and the access record is never
    // written. Without this listener the request leaves no trace at all.
    await startServer();

    expect(mockServer.on).toHaveBeenCalledWith('clientError', expect.any(Function));
  });

  test('should answer an unparseable request with 400 Bad Request', async () => {
    const listener = await getClientErrorListener();
    const socket = createMockSocket();

    // The code Node reports for an unknown method token, a lowercase method
    // and non-HTTP text alike
    listener(Object.assign(new Error('Parse Error'), { code: 'HPE_INVALID_METHOD' }), socket);

    // Registering a listener overrides Node's default reply, so the listener
    // must emit the same bytes Node would have
    expect(socket.end).toHaveBeenCalledWith(
      'HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n'
    );
    expect(socket.destroy).not.toHaveBeenCalled();
  });

  test('should answer an oversized header with 431 Request Header Fields Too Large', async () => {
    const listener = await getClientErrorListener();
    const socket = createMockSocket();

    listener(Object.assign(new Error('Parse Error'), { code: 'HPE_HEADER_OVERFLOW' }), socket);

    expect(socket.end).toHaveBeenCalledWith(
      'HTTP/1.1 431 Request Header Fields Too Large\r\nConnection: close\r\n\r\n'
    );
  });

  test('should answer every other parser rejection with 400', async () => {
    const listener = await getClientErrorListener();

    // A bogus HTTP version, and an error carrying no code at all
    for (const code of ['HPE_INVALID_VERSION', undefined]) {
      const socket = createMockSocket();

      listener(Object.assign(new Error('Parse Error'), code ? { code } : {}), socket);

      expect(socket.end).toHaveBeenCalledWith(
        'HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n'
      );
    }
  });

  test('should not write to a socket that is already gone', async () => {
    const listener = await getClientErrorListener();

    // An aborted connection reaches the listener with the socket destroyed
    const destroyed = createMockSocket({ destroyed: true });
    listener(Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' }), destroyed);

    expect(destroyed.end).not.toHaveBeenCalled();
    expect(destroyed.destroy).not.toHaveBeenCalled();

    // A socket that can no longer be written to is torn down instead, and a
    // socket that has already had bytes written is never corrupted with a
    // second response
    const unwritable = createMockSocket({ writable: false });
    listener(Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' }), unwritable);

    expect(unwritable.end).not.toHaveBeenCalled();
    expect(unwritable.destroy).toHaveBeenCalledTimes(1);

    const alreadyWritten = createMockSocket({ bytesWritten: 42 });
    listener(Object.assign(new Error('Parse Error'), { code: 'HPE_INVALID_METHOD' }), alreadyWritten);

    expect(alreadyWritten.end).not.toHaveBeenCalled();
    expect(alreadyWritten.destroy).toHaveBeenCalledTimes(1);
  });

  test('should tolerate a clientError raised without a socket', async () => {
    const listener = await getClientErrorListener();

    expect(() => {
      listener(Object.assign(new Error('Parse Error'), { code: 'HPE_INVALID_METHOD' }), undefined);
    }).not.toThrow();
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

  test('should answer a malformed request target with 404 rather than a 500', async () => {
    // A 22-byte unauthenticated request with a malformed absolute-form target
    // reaches url.parse, which raises TypeError [ERR_INVALID_URL]. Unguarded
    // that produced a 500 whose log record carried an eleven-frame stack trace
    // with absolute filesystem paths and the middleware chain. A target that
    // cannot be parsed addresses no route, so it is answered as a 404.
    const { port } = testServer.address();

    const received = await sendRaw(
      port,
      'GET http://[ HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n'
    );

    expect(received).toContain('HTTP/1.1 404 Not Found');
    expect(received).toContain('Content-Type: text/plain');
    expect(received).toContain('Not Found');

    // The 500 the finding reported is gone, and so is every disclosure it
    // carried
    expect(received).not.toContain('500');
    expect(received).not.toContain('Internal Server Error');
    expect(received).not.toContain('    at ');

    // The security headers still apply to this response
    expect(received).toContain('X-Content-Type-Options: nosniff');
    expect(received).toContain('X-Frame-Options: DENY');
    expect(received).toContain("Content-Security-Policy: default-src 'none'");
  });

  test('should keep serving normally after a malformed request target', async () => {
    const { port } = testServer.address();

    await sendRaw(port, 'GET http://[::1 HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');
    await sendRaw(port, 'GET http://user@[/ HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');

    const response = await request(testServer)
      .get('/welcome')
      .expect(200);

    expect(response.text).toContain(MESSAGES.WELCOME_HEADING);
  });

  test('should set security headers on responses', async () => {
    const response = await request(testServer)
      .get('/welcome');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });
});