/**
 * Integration tests for the /health liveness endpoint of the Node.js Hello World server.
 *
 * This test suite makes actual HTTP requests to running server instances started
 * through startServer(), so every request passes through the full middleware
 * pipeline (request logging and security headers) and the exact-match router.
 * It verifies the liveness response, the shared 405, 404 and 500 error formats,
 * and that the existing /hello endpoint keeps its behaviour.
 */

const request = require('supertest'); // v6.3.3

// config.js reads process.env once, when it is first loaded, so the port must be set
// before the server module (and with it config.js) is required. A fixed non-default
// port avoids clashing with a local server on the default port 3000.
const ORIGINAL_PORT = process.env.PORT;
process.env.PORT = '3101';

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

// Jest runs afterAll hooks even when assertions fail, so the port is always restored
afterAll(restorePort);

describe('GET /health live pipeline integration', () => {
  let server;

  // Start a real server instance before all tests in this block
  beforeAll(async () => {
    server = await serverModule.startServer();
  });

  // Stop the server started by this block after all of its tests
  afterAll(async () => {
    await serverModule.stopServer();
  });

  test('should return 200 OK with the JSON liveness status and security headers', async () => {
    const response = await request(server).get('/health');

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_JSON);
    expect(response.body).toEqual({ status: MESSAGES.HEALTH_STATUS_UP });

    // Security headers are set as literals by the middleware; constants.js defines none
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });

  test('should return the same liveness response when a query string is present', async () => {
    const response = await request(server).get('/health?probe=1');

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_JSON);
    expect(response.body).toEqual({ status: MESSAGES.HEALTH_STATUS_UP });

    // Security headers are set as literals by the middleware; constants.js defines none
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
  });

  test('should return 405 Method Not Allowed for POST /health', async () => {
    const response = await request(server).post('/health');

    expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(response.headers.allow).toBe(HTTP_METHODS.GET);
    expect(response.text).toBe(MESSAGES.METHOD_NOT_ALLOWED);
  });

  test('should return 404 Not Found for GET /health/ with a trailing slash', async () => {
    const response = await request(server).get('/health/');

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.text).toBe(MESSAGES.NOT_FOUND);
  });

  test('should keep returning 200 OK with \'Hello world\' for GET /hello', async () => {
    const response = await request(server).get('/hello');

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.text).toBe(MESSAGES.HELLO_RESPONSE);
  });

  test('should keep returning 405 Method Not Allowed with Allow: GET for POST /hello', async () => {
    const response = await request(server).post('/hello');

    expect(response.status).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(response.headers.allow).toBe(HTTP_METHODS.GET);
  });
});

describe('GET /health when the handler throws before responding', () => {
  let isolatedServerModule;
  let server;

  beforeAll(async () => {
    // The isolated module registry reloads config.js, so this server binds its own port
    process.env.PORT = '3102';

    // Load a separate server module instance whose /health handler throws synchronously
    // before writing the response. The factory returns a plain function rather than
    // jest.fn(), because the resetMocks setting in jest.config.js would wipe a mock
    // implementation before the test runs.
    jest.isolateModules(() => {
      jest.doMock('../../handlers/healthHandler', () => ({
        handleHealthRequest: () => {
          throw new Error('simulated failure');
        }
      }));
      isolatedServerModule = require('../../server');
    });

    server = await isolatedServerModule.startServer();
  });

  afterAll(async () => {
    // Each server module instance holds its own private server reference, so the
    // live-pipeline block's stopServer() cannot close this server, and vice versa
    if (isolatedServerModule) {
      await isolatedServerModule.stopServer();
    }
    jest.dontMock('../../handlers/healthHandler');
    restorePort();
  });

  test('should return 500 Internal Server Error and keep serving later requests', async () => {
    // A synchronous throw before the response is written reaches the middleware's
    // error path, which answers with the shared 500 format
    const failedResponse = await request(server).get('/health');

    expect(failedResponse.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(failedResponse.headers['content-type']).toBe(HEADERS.CONTENT_TYPE_TEXT);
    expect(failedResponse.text).toBe(MESSAGES.SERVER_ERROR);

    // The same server keeps answering subsequent requests
    const followUpResponse = await request(server).get('/hello');

    expect(followUpResponse.status).toBe(HTTP_STATUS.OK);
    expect(followUpResponse.text).toBe(MESSAGES.HELLO_RESPONSE);
  });
});
