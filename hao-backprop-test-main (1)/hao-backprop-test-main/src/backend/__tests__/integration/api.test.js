/**
 * Integration tests for the Node.js server's /welcome API endpoint.
 *
 * This test suite makes actual HTTP requests to a running server instance
 * and verifies the responses match the expected behavior for the /welcome
 * endpoint, representative rejected HTTP methods, and the retired /hello path.
 */

const request = require('supertest'); // v6.3.3
const { startServer, stopServer } = require('../../server');
const { HTTP_STATUS, MESSAGES, HEADERS, ROUTES } = require('../../utils/constants');
const { PORT } = require('../../config'); // config.js exports the resolved configuration object

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
});
