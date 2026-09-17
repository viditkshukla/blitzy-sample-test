/**
 * Integration tests for the Node.js server's /welcome API endpoint.
 *
 * This test suite makes actual HTTP requests to a running server instance
 * and verifies the responses match the expected behavior for the /welcome
 * endpoint, representative rejected HTTP methods, and the retired /hello path.
 */

const net = require('net'); // native
const request = require('supertest'); // v6.3.3
const { startServer, stopServer } = require('../../server');
const { HTTP_STATUS, MESSAGES, HEADERS, ROUTES } = require('../../utils/constants');
const { PORT } = require('../../config'); // config.js exports the resolved configuration object

/**
 * Sends a raw request line to the running server and resolves with everything
 * it writes back.
 *
 * Supertest builds its requests through Node's HTTP client, which always sends
 * an origin-form target and normalises what it is given, so the absolute-form
 * and alternate-spelling cases below are driven over a plain socket instead.
 *
 * @param {string} target - Request target to put on the request line, verbatim
 * @returns {Promise<string>} Everything the server wrote before closing
 */
function sendRawRequest(target) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ port: PORT, host: '127.0.0.1' });
    let received = '';

    socket.setTimeout(5000);
    socket.on('data', (chunk) => { received += chunk.toString('utf8'); });
    socket.on('close', () => resolve(received));
    socket.on('timeout', () => { socket.destroy(); reject(new Error('raw request timed out')); });
    socket.on('error', reject);
    socket.on('connect', () => {
      socket.write(`GET ${target} HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n`);
    });
  });
}

describe('API Integration Tests', () => {
  let serverInstance;
  let baseUrl;

  beforeAll(async () => {
    // startServer creates the HTTP server itself and resolves with the instance
    serverInstance = await startServer();
    baseUrl = `http://localhost:${PORT}`;
  });

  afterAll(async () => {
    if (serverInstance && serverInstance.listening) {
      await stopServer();
    }
  });

  test('GET /welcome should return 200 OK with the Welcome screen', async () => {
    const response = await request(baseUrl)
      .get(ROUTES.WELCOME)
      .expect(HTTP_STATUS.OK);

    expect(response.text).toContain(MESSAGES.WELCOME_HEADING);
    expect(response.text).toContain(MESSAGES.WELCOME_DESCRIPTION);

    // Deliberate literal wire-contract anchors — do not "tidy" these into
    // constants. Every other copy assertion in this repository reads the same
    // MESSAGES constants the handler renders, so both sides move together and a
    // changed constant serves new copy with every suite still green. AAP 0.3.4's
    // "literals stay in the constants module" governs source modules; this is a
    // verification artifact, and AAP 0.9.3 makes this suite the authoritative
    // proof of the 0.3.1 contract, so the copy of 0.3.3 is pinned here verbatim.
    expect(response.text).toContain('Welcome to HelloGHES');
    expect(response.text).toContain('A simple Node.js service that greets you from the /welcome endpoint.');
  });

  test('GET /welcome should be served as HTML with an explicit charset', async () => {
    const response = await request(baseUrl)
      .get(ROUTES.WELCOME)
      .expect(HTTP_STATUS.OK)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_HTML);

    // Deliberate literal wire-contract anchor — do not replace with the constant.
    // The chain assertion above is an exact compare, but it reads the same
    // HEADERS.CONTENT_TYPE_HTML the handler sets, so retyping the response (and
    // losing the charset this test claims to prove) keeps it green. AAP 0.3.4's
    // constants rule is a source-module rule; this suite is the authoritative
    // proof of the AAP 0.3.1 content type, so that value is pinned here verbatim.
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
  });

  test('POST /welcome should return 405 Method Not Allowed', async () => {
    const response = await request(baseUrl)
      .post(ROUTES.WELCOME)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT)
      .expect('Allow', 'GET');

    expect(response.text).toContain(MESSAGES.METHOD_NOT_ALLOWED);
  });

  test('PUT /welcome should return 405 Method Not Allowed', async () => {
    const response = await request(baseUrl)
      .put(ROUTES.WELCOME)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT)
      .expect('Allow', 'GET');

    expect(response.text).toContain(MESSAGES.METHOD_NOT_ALLOWED);
  });

  test('DELETE /welcome should return 405 Method Not Allowed', async () => {
    const response = await request(baseUrl)
      .delete(ROUTES.WELCOME)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT)
      .expect('Allow', 'GET');

    expect(response.text).toContain(MESSAGES.METHOD_NOT_ALLOWED);
  });

  test('GET /hello should return 404 Not Found now that the route is retired', async () => {
    const response = await request(baseUrl)
      .get('/hello')
      .expect(HTTP_STATUS.NOT_FOUND)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT);

    expect(response.text).toContain(MESSAGES.NOT_FOUND);

    // The retired path is not redirected anywhere
    expect(response.headers.location).toBeUndefined();
  });

  test('GET /undefined should return 404 Not Found', async () => {
    const response = await request(baseUrl)
      .get('/undefined')
      .expect(HTTP_STATUS.NOT_FOUND)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT);

    expect(response.text).toContain(MESSAGES.NOT_FOUND);
  });

  test('a malformed request target should return 404 Not Found and disclose nothing', async () => {
    // 'http://[::1' is an absolute-form target with a malformed authority. It
    // reaches the URL parser, which rejects it; a target that cannot be parsed
    // addresses no route, so it is answered exactly as any unregistered path
    // is - no 500, no stack trace, and no redirect.
    const received = await sendRawRequest('http://[::1');

    expect(received).toContain(`HTTP/1.1 ${HTTP_STATUS.NOT_FOUND} Not Found`);
    expect(received).toContain(`${HEADERS.CONTENT_TYPE}: ${HEADERS.CONTENT_TYPE_TEXT}`);
    expect(received).toContain(MESSAGES.NOT_FOUND);
    expect(received).not.toContain('Location:');
    expect(received).not.toContain(`${HTTP_STATUS.INTERNAL_SERVER_ERROR}`);
    expect(received).not.toContain('    at ');
  });

  test('an absolute-form request target should serve the Welcome screen', async () => {
    // RFC 9112 §3.2.2 requires a server to accept a proxy-style target. The
    // dispatcher matches the path it carries, and the retired path stays
    // retired in this form too.
    const welcome = await sendRawRequest(`http://proxy.example${ROUTES.WELCOME}`);

    expect(welcome).toContain(`HTTP/1.1 ${HTTP_STATUS.OK} OK`);
    expect(welcome).toContain(MESSAGES.WELCOME_HEADING);
    expect(welcome).toContain(MESSAGES.WELCOME_DESCRIPTION);

    const retired = await sendRawRequest('http://proxy.example/hello');

    expect(retired).toContain(`HTTP/1.1 ${HTTP_STATUS.NOT_FOUND} Not Found`);
    expect(retired).toContain(MESSAGES.NOT_FOUND);
  });

  test('alternate spellings of the route should return 404 Not Found', async () => {
    // The route table is matched by exact path. Resolving dot segments,
    // folding a trailing slash or promoting a scheme-relative target to a host
    // would widen the single registered route to every spelling below, so each
    // one must stay a not-found path in both origin-form and absolute-form.
    const spellings = [
      `${ROUTES.WELCOME}/`,
      `/.${ROUTES.WELCOME}`,
      `/foo/..${ROUTES.WELCOME}`,
      `${ROUTES.WELCOME}/..${ROUTES.WELCOME}`,
      `/${ROUTES.WELCOME}`,
      `//proxy.example${ROUTES.WELCOME}`,
      `http://proxy.example/foo/..${ROUTES.WELCOME}`
    ];

    for (const spelling of spellings) {
      const received = await sendRawRequest(spelling);

      expect(received).toContain(`HTTP/1.1 ${HTTP_STATUS.NOT_FOUND} Not Found`);
      expect(received).not.toContain(MESSAGES.WELCOME_HEADING);
    }
  });
});
