/**
 * Integration tests for the Node.js server's /welcome API endpoint.
 *
 * This test suite makes actual HTTP requests to a running server instance
 * and verifies the responses match the expected behavior for the /welcome
 * endpoint, representative rejected HTTP methods, and the retired /hello path.
 */

const request = require('supertest'); // v6.3.3
const { server } = require('../../index');
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
  });

  test('GET /welcome should be served as HTML with an explicit charset', async () => {
    await request(baseUrl)
      .get(ROUTES.WELCOME)
      .expect(HTTP_STATUS.OK)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_HTML);
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
