/**
 * Integration tests for the Node.js Hello World server API endpoints.
 * 
 * This test suite makes actual HTTP requests to a running server instance
 * and verifies the responses match the expected behavior for all supported
 * endpoints and HTTP methods.
 * 
 * Uses supertest with the server instance directly to avoid port conflicts
 * during parallel test execution. Supertest handles ephemeral port binding
 * automatically when given an http.Server instance.
 */

const request = require('supertest'); // v6.3.3
const { createServer } = require('../../server');
const { HTTP_STATUS, MESSAGES, ROUTES } = require('../../utils/constants');

describe('API Integration Tests', () => {
  let serverInstance;
  
  // Create the server before all tests — supertest binds to an ephemeral port
  beforeAll(() => {
    serverInstance = createServer();
  });
  
  // Close the server after all tests to release resources
  afterAll((done) => {
    if (serverInstance && serverInstance.listening) {
      serverInstance.close(done);
    } else {
      done();
    }
  });
  
  // Test GET request to /hello endpoint
  test('GET /hello should return 200 OK with \'Hello world\'', async () => {
    const response = await request(serverInstance)
      .get(ROUTES.HELLO)
      .expect(HTTP_STATUS.OK)
      .expect('Content-Type', 'text/plain');
    
    expect(response.text).toBe(MESSAGES.HELLO_RESPONSE);
  });
  
  // Test POST request to /hello endpoint
  test('POST /hello should return 405 Method Not Allowed', async () => {
    const response = await request(serverInstance)
      .post(ROUTES.HELLO)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET');
    
    expect(response.text).toContain('Method Not Allowed');
  });
  
  // Test PUT request to /hello endpoint
  test('PUT /hello should return 405 Method Not Allowed', async () => {
    const response = await request(serverInstance)
      .put(ROUTES.HELLO)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET');
    
    expect(response.text).toContain('Method Not Allowed');
  });
  
  // Test DELETE request to /hello endpoint
  test('DELETE /hello should return 405 Method Not Allowed', async () => {
    const response = await request(serverInstance)
      .delete(ROUTES.HELLO)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET');
    
    expect(response.text).toContain('Method Not Allowed');
  });
  
  // Test GET request to undefined route
  test('GET /undefined should return 404 Not Found', async () => {
    const response = await request(serverInstance)
      .get('/undefined')
      .expect(HTTP_STATUS.NOT_FOUND)
      .expect('Content-Type', 'text/plain');
    
    expect(response.text).toContain('Not Found');
  });
});