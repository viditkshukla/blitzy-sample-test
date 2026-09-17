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
const { spawnSync } = require('child_process'); // native

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

/**
 * Reserves a free loopback port and releases it again.
 *
 * Used for the child process below, which needs a port nothing else holds: this
 * suite and the integration suite already bind the configured one, and the
 * documented default must stay free.
 *
 * @returns {Promise<number>} A port that was free a moment ago
 */
function reserveFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();

    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();

      probe.close(() => resolve(port));
    });
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

  /**
   * Loads a fresh copy of the server module against a mocked logger and returns
   * its clientError listener together with that logger.
   *
   * server.js destructures the logger's functions at require time, so a spy
   * installed on the shared logger module afterwards is never reached, and the
   * real logger writes nothing at all under NODE_ENV=test (utils/logger.js
   * suppresses output when IS_TEST). Loading the module in an isolated registry
   * is therefore what makes the record text assertable, and it leaves the
   * registry the rest of this suite shares untouched. The http.createServer
   * spy installed in beforeEach still applies: core modules are shared across
   * registries, so the isolated copy receives the same mock server.
   *
   * @returns {Promise<{listener: Function, logger: Object}>} The listener and the logger it records through
   */
  async function getRecordingClientErrorListener() {
    let isolatedLogger;
    let isolatedStartServer;

    jest.isolateModules(() => {
      jest.doMock('../utils/logger', () => ({
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        logServerStart: jest.fn(),
        logServerStop: jest.fn(),
        logRequest: jest.fn()
      }));

      isolatedLogger = require('../utils/logger');
      ({ startServer: isolatedStartServer } = require('../server'));
    });

    await isolatedStartServer();

    const registration = mockServer.on.mock.calls.find(call => call[0] === 'clientError');
    expect(registration).toBeDefined();

    return { listener: registration[1], logger: isolatedLogger };
  }

  /**
   * Returns the single record the listener wrote.
   *
   * @param {Object} logger - Mocked logger the isolated server records through
   * @returns {string} The record text
   */
  function singleRecord(logger) {
    expect(logger.warn).toHaveBeenCalledTimes(1);

    return logger.warn.mock.calls[0][0];
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

  test('should record a genuine parser rejection as one, with the status it wrote', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();
    const socket = createMockSocket();

    listener(Object.assign(new Error('Parse Error'), { code: 'HPE_INVALID_METHOD' }), socket);

    // An llhttp code on an untouched socket: a real protocol violation, and the
    // 400 named in the record is the one written on the line below it
    expect(socket.end).toHaveBeenCalledWith('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
    expect(singleRecord(logger)).toBe(
      'Malformed request rejected by parser: HPE_INVALID_METHOD - responded 400'
    );
  });

  test('should record a transport reset as a connection failure and claim no status', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();

    // Node raises clientError for socket errors too. A client that resets the
    // connection has violated no protocol rule, and the destroyed-socket guard
    // below writes nothing, so neither a parser rejection nor a status may be
    // claimed — otherwise a client manufactures a 400-rate signal by aborting.
    const socket = createMockSocket({ destroyed: true });

    listener(Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' }), socket);

    expect(socket.end).not.toHaveBeenCalled();
    expect(socket.destroy).not.toHaveBeenCalled();

    const record = singleRecord(logger);

    expect(record).toBe(
      'Client connection failed before the request completed: ECONNRESET - no response sent, connection already closed'
    );
    expect(record).not.toContain('parser');
    expect(record).not.toContain('responded');
  });

  test('should record a premature end of message as a transport failure', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();
    const socket = createMockSocket();

    // llhttp reports a stream that ended mid-message as HPE_INVALID_EOF_STATE.
    // It carries the parser prefix but describes an abandoned upload or an
    // aborted request, not a malformed one. Here the peer only half-closed, so
    // the socket is still writable and the 400 the record names was sent.
    listener(Object.assign(new Error('Parse Error'), { code: 'HPE_INVALID_EOF_STATE' }), socket);

    expect(socket.end).toHaveBeenCalledWith('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
    expect(singleRecord(logger)).toBe(
      'Client connection failed before the request completed: HPE_INVALID_EOF_STATE - responded 400'
    );
  });

  test('should claim no status on the branch that destroys the socket', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();

    // Bytes are already on the wire, so the listener tears the connection down
    // rather than corrupting the response in flight - and reports exactly that
    const socket = createMockSocket({ bytesWritten: 42 });

    listener(Object.assign(new Error('Parse Error'), { code: 'HPE_INVALID_METHOD' }), socket);

    expect(socket.end).not.toHaveBeenCalled();
    expect(socket.destroy).toHaveBeenCalledTimes(1);
    expect(singleRecord(logger)).toBe(
      'Malformed request rejected by parser: HPE_INVALID_METHOD - no response sent, connection destroyed'
    );
  });

  test('should record a request timeout as a timeout, with the 408 it wrote', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();
    const socket = createMockSocket();

    // Node's own headers/request timeout: a complete request never arrived, so
    // this is neither a protocol violation nor a transport failure
    listener(Object.assign(new Error('Request timeout'), { code: 'ERR_HTTP_REQUEST_TIMEOUT' }), socket);

    expect(socket.end).toHaveBeenCalledWith('HTTP/1.1 408 Request Timeout\r\nConnection: close\r\n\r\n');
    expect(singleRecord(logger)).toBe(
      'Request timed out before a complete request arrived: ERR_HTTP_REQUEST_TIMEOUT - responded 408'
    );
  });

  test('should name a code-less client error without inventing a parser code', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();
    const socket = createMockSocket();

    listener(new Error('Parse Error'), socket);

    const record = singleRecord(logger);

    // llhttp defines no HPE_UNKNOWN, so the record must not spell the
    // substitute as a parser code or claim the parser reported anything
    expect(record).toBe('Request rejected at the connection boundary: UNKNOWN - responded 400');
    expect(record).not.toContain('HPE_');
    expect(socket.end).toHaveBeenCalledWith('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
  });

  test('should not throw when the error carries a code that is not a string', async () => {
    const { listener, logger } = await getRecordingClientErrorListener();
    const socket = createMockSocket();

    // The code is interpolated into the record and tested for the parser
    // prefix, and a throw inside a clientError listener would end the process
    expect(() => {
      listener(Object.assign(new Error('Parse Error'), { code: 42 }), socket);
    }).not.toThrow();

    expect(singleRecord(logger)).toBe(
      'Request rejected at the connection boundary: UNKNOWN - responded 400'
    );
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

  test('should match the route by exact path, without normalising alternate spellings', async () => {
    // The dispatcher is an exact object-key lookup, so every spelling below
    // addresses no route. Resolving dot segments, folding a trailing slash or
    // promoting a scheme-relative target to a host would silently widen the
    // route table to all of them.
    const { port } = testServer.address();
    const spellings = [
      '/welcome/',
      '/./welcome',
      '/foo/../welcome',
      '/welcome/../welcome',
      '//welcome',
      '//evil.example/welcome',
      '/welcome%2F',
      '/WELCOME'
    ];

    for (const spelling of spellings) {
      const received = await sendRaw(
        port,
        `GET ${spelling} HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n`
      );

      expect(received).toContain('HTTP/1.1 404 Not Found');
      expect(received).not.toContain(MESSAGES.WELCOME_HEADING);
    }

    // The registered spelling still resolves
    const welcome = await sendRaw(port, 'GET /welcome HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');

    expect(welcome).toContain('HTTP/1.1 200 OK');
    expect(welcome).toContain(MESSAGES.WELCOME_HEADING);
  });

  test('should answer an asterisk-form request target with 404', async () => {
    // 'OPTIONS *' addresses the server rather than a resource, so it matches no
    // route and is answered as any unregistered path is
    const { port } = testServer.address();

    const received = await sendRaw(port, 'OPTIONS * HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n');

    expect(received).toContain('HTTP/1.1 404 Not Found');
    expect(received).toContain(MESSAGES.NOT_FOUND);
    expect(received).not.toContain('Allow:');
  });

  test('should accept an absolute-form request target as RFC 9112 requires', async () => {
    // A proxy-style target names the resource in absolute-form; the dispatcher
    // matches the path it carries, and the retired path stays retired in this
    // form too
    const { port } = testServer.address();

    const welcome = await sendRaw(
      port,
      'GET http://evil.example/welcome HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n'
    );

    expect(welcome).toContain('HTTP/1.1 200 OK');
    expect(welcome).toContain(MESSAGES.WELCOME_HEADING);

    const retired = await sendRaw(
      port,
      'GET http://evil.example/hello HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n'
    );

    expect(retired).toContain('HTTP/1.1 404 Not Found');
    expect(retired).toContain(MESSAGES.NOT_FOUND);

    // A path that only reaches the route through dot-segment resolution does
    // not reach it
    const normalised = await sendRaw(
      port,
      'GET http://evil.example/foo/../welcome HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n'
    );

    expect(normalised).toContain('HTTP/1.1 404 Not Found');
  });

  test('should set security headers on responses', async () => {
    const response = await request(testServer)
      .get('/welcome');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });

describe('request target parsing', () => {
  test('should answer a malformed request target without writing outside the logger grammar', async () => {
    // The legacy url.parse emits a DEP0170 deprecation notice for an invalid
    // URL on Node 20 and later. The runtime writes that notice straight to
    // stderr - carrying the process id and the client's malformed target - so
    // it lands outside the logger's '[<timestamp>] <LEVEL>: <message>' grammar,
    // where a line-oriented log reader cannot parse it, and an unauthenticated
    // client triggers it with a 22-byte request.
    //
    // The check runs in a child process for two reasons: the notice is written
    // by the runtime rather than raised through this process's warning
    // listeners, which jest's sandboxed process object never receives; and the
    // logger is silent under NODE_ENV=test, so only a child started outside the
    // test environment produces the records this asserts on.
    const port = await reserveFreePort();
    const serverModule = require.resolve('../server');
    const probe = `
      const net = require('net');
      const { startServer, stopServer } = require(${JSON.stringify(serverModule)});

      startServer()
        .then(() => new Promise((resolve) => {
          let received = '';
          const socket = net.createConnection({ port: ${port}, host: '127.0.0.1' }, () => {
            socket.write('GET http://[::1 HTTP/1.1\\r\\nHost: x\\r\\nConnection: close\\r\\n\\r\\n');
          });

          socket.on('data', (chunk) => { received += chunk.toString('utf8'); });
          socket.on('close', () => {
            process.stdout.write('PROBE-STATUS ' + received.split('\\r\\n')[0] + '\\n');
            resolve();
          });
          socket.on('error', (err) => {
            process.stdout.write('PROBE-ERROR ' + err.code + '\\n');
            resolve();
          });
        }))
        .then(() => stopServer())
        .catch((err) => {
          process.stdout.write('PROBE-FAILED ' + err.message + '\\n');
          process.exitCode = 1;
        });
    `;

    const child = spawnSync(process.execPath, ['-e', probe], {
      encoding: 'utf8',
      timeout: 30000,
      env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', NODE_ENV: 'development' }
    });

    expect(child.status).toBe(0);

    const output = `${child.stdout}${child.stderr}`;

    // The target addresses no route, so it is answered as any unregistered
    // path is - no 500, and the rejection is still recorded by error code alone
    expect(output).toContain('PROBE-STATUS HTTP/1.1 404 Not Found');
    expect(output).toContain('WARN: Malformed request target rejected: ERR_INVALID_URL');

    // Nothing was written outside the logger: no deprecation notice, and no
    // line that is neither a log record nor this probe's own marker
    expect(output).not.toContain('DeprecationWarning');
    expect(output).not.toContain('DEP0170');

    const strayLines = output
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .filter((line) => !line.startsWith('[') && !line.startsWith('PROBE-STATUS'));

    expect(strayLines).toEqual([]);
  });
});

});