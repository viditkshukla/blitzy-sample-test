/**
 * Integration tests for the Node.js server's /welcome API endpoint.
 * 
 * This test suite makes actual HTTP requests to a running server instance
 * and verifies the responses match the expected behavior for the /welcome
 * endpoint, every HTTP method it rejects, and the retired /hello path.
 */

const request = require('supertest'); // v6.3.3
const { server } = require('../../index');
const { startServer, stopServer } = require('../../server');
const { HTTP_STATUS, MESSAGES, HEADERS, ROUTES } = require('../../utils/constants');
const { PORT } = require('../../config'); // config.js exports the resolved configuration object

describe('API Integration Tests', () => {
  let serverInstance;
  let baseUrl;
  
  // Start the server before all tests
  beforeAll(async () => {
    // startServer creates the HTTP server itself and resolves with the instance
    serverInstance = await startServer();
    baseUrl = `http://localhost:${PORT}`;
  });
  
  // Stop the server after all tests
  afterAll(async () => {
    if (serverInstance && serverInstance.listening) {
      await stopServer();
    }
  });
  
  // Test GET request to /welcome endpoint
  test('GET /welcome should return 200 OK with the Welcome screen', async () => {
    const response = await request(baseUrl)
      .get(ROUTES.WELCOME)
      .expect(HTTP_STATUS.OK);
    
    expect(response.text).toContain(MESSAGES.WELCOME_HEADING);
    expect(response.text).toContain(MESSAGES.WELCOME_DESCRIPTION);
  });
  
  // Test the content type served by the /welcome endpoint
  test('GET /welcome should be served as HTML with an explicit charset', async () => {
    await request(baseUrl)
      .get(ROUTES.WELCOME)
      .expect(HTTP_STATUS.OK)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_HTML);
  });
  
  // Test POST request to /welcome endpoint
  test('POST /welcome should return 405 Method Not Allowed', async () => {
    const response = await request(baseUrl)
      .post(ROUTES.WELCOME)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT)
      .expect('Allow', 'GET');
    
    expect(response.text).toContain(MESSAGES.METHOD_NOT_ALLOWED);
  });
  
  // Test PUT request to /welcome endpoint
  test('PUT /welcome should return 405 Method Not Allowed', async () => {
    const response = await request(baseUrl)
      .put(ROUTES.WELCOME)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT)
      .expect('Allow', 'GET');
    
    expect(response.text).toContain(MESSAGES.METHOD_NOT_ALLOWED);
  });
  
  // Test DELETE request to /welcome endpoint
  test('DELETE /welcome should return 405 Method Not Allowed', async () => {
    const response = await request(baseUrl)
      .delete(ROUTES.WELCOME)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT)
      .expect('Allow', 'GET');
    
    expect(response.text).toContain(MESSAGES.METHOD_NOT_ALLOWED);
  });
  
  // Test GET request to the retired /hello path
  test('GET /hello should return 404 Not Found now that the route is retired', async () => {
    const response = await request(baseUrl)
      .get('/hello')
      .expect(HTTP_STATUS.NOT_FOUND)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT);
    
    expect(response.text).toContain(MESSAGES.NOT_FOUND);
    
    // The retired path is not redirected anywhere
    expect(response.headers.location).toBeUndefined();
  });
  
  // Test GET request to undefined route
  test('GET /undefined should return 404 Not Found', async () => {
    const response = await request(baseUrl)
      .get('/undefined')
      .expect(HTTP_STATUS.NOT_FOUND)
      .expect('Content-Type', HEADERS.CONTENT_TYPE_TEXT);
    
    expect(response.text).toContain(MESSAGES.NOT_FOUND);
  });
});
