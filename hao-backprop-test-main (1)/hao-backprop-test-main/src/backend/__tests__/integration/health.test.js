/**
 * Integration tests for the /health liveness endpoint of the Node.js Hello World server.
 *
 * This test suite makes actual HTTP requests to running server instances started
 * through startServer(), so every request passes through the full middleware
 * pipeline (request logging and security headers) and the exact-match router.
 * It verifies the liveness response, the shared 405, 404 and 500 error formats, the
 * security headers on success and error responses, the request log entry for a
 * query-string request, and that the existing /hello endpoint keeps its behaviour.
 */

const request = require('supertest'); // v6.3.3

// config.js reads process.env once, when it is first loaded, so the port must be set
// before the server module (and with it config.js) is required. A fixed non-default
// port avoids clashing with a local server on the default port 3000.
const ORIGINAL_PORT = process.env.PORT;
process.env.PORT = '3101';

// The middleware module destructures logRequest from the logger when it is first loaded,
// so the observer must replace the logger export before the server module is required.
// It is a plain call-through function rather than jest.spyOn(): before each test, the
// resetMocks setting in jest.config.js would erase a spy's call-through implementation,
// so the spy the middleware captured would stop calling the real logRequest.
const logger = require('../../utils/logger');
const originalLogRequest = logger.logRequest;
const loggedRequests = [];

/**
 * Records the method, URL, status code and response time the request logger passes to
 * logRequest, then calls the real logRequest so logging behaves as it does unobserved.
 *
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {number} responseTime - Response time in milliseconds
 * @returns {*} Whatever the real logRequest returns
 */
function observeLogRequest(req, res, responseTime) {
  loggedRequests.push({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime
  });
  return originalLogRequest.call(this, req, res, responseTime);
}

logger.logRequest = observeLogRequest;

const serverModule = require('../../server');
const { HTTP_STATUS, MESSAGES, HEADERS, HTTP_METHODS } = require('../../utils/constants');

/**
 * Restores process.env.PORT to the value it held before this test file ran,
 * removing the variable entirely when it was not set originally.
 */
function restorePort() {
  if (ORIGINAL_PORT === undefined) {
    delete process.env.PORT;
  } else {
    process.env.PORT = ORIGINAL_PORT;
  }
}

/**
 * Puts the real logRequest back on the logger export, removing the request observer.
 */
function restoreLogRequest() {
  logger.logRequest = originalLogRequest;
}

// Jest runs afterAll hooks even when assertions fail, so the port and logger are always restored
afterAll(restorePort);
afterAll(restoreLogRequest);

/**
 * Test suite for the live pipeline, sharing one server on port 3101 from the module at file top.
 */
describe('GET /health live pipeline integration', () => {
  let server;

  /**
   * Starts a real server from the server module required at file top, on port 3101.
   *
   * @returns {Promise<void>} Resolves when the server is listening and stored for the tests
   */
  beforeAll(async () => {
    server = await serverModule.startServer();
  });

  /**
   * Stops the server this block started, through the same module's stopServer().
   *
   * @returns {Promise<void>} Resolves when the server has stopped
   */
  afterAll(async () => {
    await serverModule.stopServer();
  });

  /**
   * Asserts that GET /health answers with the JSON liveness document and the security headers.
   *
   * @returns {Promise<void>} Resolves when the response has been checked
   */
  test('should return 200 OK with the JSON liveness status and security headers', async () => {
    const response = await request(server).get('/health');

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_JSON);
    expect(response.body).toEqual({ status: MESSAGES.HEALTH_STATUS_UP });
    // Pin the wire value independently of the constant the handler also reads
    expect(response.body.status).toBe('up');

    // Security headers are set as literals by the middleware; constants.js defines none
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });

  /**
   * Asserts that GET /health?probe=1 gets the same liveness response and logs its original URL.
   *
   * @returns {Promise<void>} Resolves when the response and its single log entry have been checked
   */
  test('should return the same liveness response when a query string is present', async () => {
    // Observe only the request this test sends
    loggedRequests.length = 0;

    const response = await request(server).get('/health?probe=1');

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_JSON);
    expect(response.body).toEqual({ status: MESSAGES.HEALTH_STATUS_UP });
    // Pin the wire value independently of the constant the handler also reads
    expect(response.body.status).toBe('up');

    // Security headers are set as literals by the middleware; constants.js defines none
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");

    // The request logger logs the original URL, query string included, with its timing
    expect(loggedRequests).toHaveLength(1);
    const [loggedRequest] = loggedRequests;
    expect(loggedRequest.method).toBe(HTTP_METHODS.GET);
    expect(loggedRequest.url).toBe('/health?probe=1');
    expect(loggedRequest.statusCode).toBe(HTTP_STATUS.OK);
    expect(Number.isFinite(loggedRequest.responseTime)).toBe(true);
    expect(loggedRequest.responseTime).toBeGreaterThanOrEqual(0);
  });

  /**
   * Asserts that POST /health gets the shared 405 response, security headers included.
   *
   * @returns {Promise<void>} Resolves when the response has been checked
   */
  test('should return 405 Method Not Allowed for POST /health', async () => {
    const response = await request(server).post('/health');

    expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(response.headers.allow).toBe(HTTP_METHODS.GET);
    expect(response.text).toBe(MESSAGES.METHOD_NOT_ALLOWED);

    // The security middleware runs before routing, so error responses carry the headers too
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });

  /**
   * Asserts that exact-match routing gives GET /health/ the shared 404, security headers included.
   *
   * @returns {Promise<void>} Resolves when the response has been checked
   */
  test('should return 404 Not Found for GET /health/ with a trailing slash', async () => {
    const response = await request(server).get('/health/');

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);

    // The security middleware runs before routing, so error responses carry the headers too
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });

  /**
   * Asserts that GET /hello still answers 200 text/plain 'Hello world' beside the new route.
   *
   * @returns {Promise<void>} Resolves when the response has been checked
   */
  test('should keep returning 200 OK with \'Hello world\' for GET /hello', async () => {
    const response = await request(server).get('/hello');

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(response.text).toBe(MESSAGES.HELLO_RESPONSE);
  });

  /**
   * Asserts that POST /hello still gets the shared text/plain 405 response with Allow: GET.
   *
   * @returns {Promise<void>} Resolves when the response has been checked
   */
  test('should keep returning 405 Method Not Allowed with Allow: GET for POST /hello', async () => {
    const response = await request(server).post('/hello');

    expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(response.headers.allow).toBe(HTTP_METHODS.GET);
    expect(response.text).toBe(MESSAGES.METHOD_NOT_ALLOWED);
  });
});

/**
 * Test suite for the failure case: an isolated server on port 3102 whose /health handler throws.
 */
describe('GET /health when the handler throws before responding', () => {
  let isolatedServerModule;
  let server;

  /**
   * Starts an isolated server module on port 3102 whose /health handler always throws.
   *
   * @returns {Promise<void>} Resolves when the isolated server is listening and stored
   */
  beforeAll(async () => {
    // The isolated module registry reloads config.js, so this server binds its own port
    process.env.PORT = '3102';

    // Load a separate server module instance whose /health handler throws synchronously
    // before writing the response. The factory returns a plain function rather than
    // jest.fn(), because the resetMocks setting in jest.config.js would wipe a mock
    // implementation before the test runs.
    /**
     * Mocks the health handler, then loads a fresh server module into isolatedServerModule.
     */
    jest.isolateModules(() => {
      /**
       * Builds the stand-in for the health handler module.
       *
       * @returns {Object} Module whose handleHealthRequest always throws
       */
      jest.doMock('../../handlers/healthHandler', () => ({
        /**
         * Fails deliberately before any response is written, to drive the shared 500 path.
         *
         * @throws {Error} Always, with message 'simulated failure'
         */
        handleHealthRequest: () => {
          throw new Error('simulated failure');
        }
      }));
      isolatedServerModule = require('../../server');
    });

    server = await isolatedServerModule.startServer();
  });

  /**
   * Stops the isolated server if its module loaded, then un-mocks the handler and restores PORT.
   *
   * @returns {Promise<void>} Resolves when the isolated server has stopped and state is restored
   */
  afterAll(async () => {
    // Each server module instance holds its own private server reference, so the
    // live-pipeline block's stopServer() cannot close this server, and vice versa
    if (isolatedServerModule) {
      await isolatedServerModule.stopServer();
    }
    jest.dontMock('../../handlers/healthHandler');
    restorePort();
  });

  /**
   * Asserts that the throw yields the shared 500 and that the same server then answers GET /hello.
   *
   * @returns {Promise<void>} Resolves when both responses have been checked
   */
  test('should return 500 Internal Server Error and keep serving later requests', async () => {
    // A synchronous throw before the response is written reaches the middleware's
    // error path, which answers with the shared 500 format
    const failedResponse = await request(server).get('/health');

    expect(failedResponse.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(failedResponse.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(failedResponse.text).toBe(MESSAGES.SERVER_ERROR);

    // The security headers set before the handler threw survive into the 500 response
    expect(failedResponse.headers['x-content-type-options']).toBe('nosniff');
    expect(failedResponse.headers['x-frame-options']).toBe('DENY');
    expect(failedResponse.headers['content-security-policy']).toBe("default-src 'none'");

    // The same server keeps answering subsequent requests
    const followUpResponse = await request(server).get('/hello');

    expect(followUpResponse.status).toBe(HTTP_STATUS.OK);
    expect(followUpResponse.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(followUpResponse.text).toBe(MESSAGES.HELLO_RESPONSE);
  });
});
