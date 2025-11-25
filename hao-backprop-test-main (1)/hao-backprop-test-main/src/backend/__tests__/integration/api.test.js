/**
 * Integration tests for the Node.js Hello World server API endpoints.
 * 
 * This test suite makes actual HTTP requests to a running server instance
 * and verifies the responses match the expected behavior for all supported
 * endpoints and HTTP methods.
 */

const request = require('supertest'); // v6.3.3
const { server } = require('../../index');
const { startServer, stopServer } = require('../../server');
const { HTTP_STATUS, MESSAGES, ROUTES } = require('../../utils/constants');
const getConfig = require('../../config'); // Default import

describe('API Integration Tests', () => {
  let serverInstance;
  
  // Start the server before all tests
  beforeAll(async () => {
    // Create and start a server instance for testing
    const { createServer } = require('../../server');
    serverInstance = createServer();
    await startServer(serverInstance);
  });
  
  // Stop the server after all tests
  afterAll(async () => {
    if (serverInstance && serverInstance.listening) {
      await stopServer(serverInstance);
    }
  });
  
  // Test GET request to /hello endpoint
  test('GET /hello should return 200 OK with \'Hello world\'', async () => {
    const config = getConfig();
    
    const response = await request(`http://localhost:${config.port}`)
      .get(ROUTES.HELLO)
      .expect(HTTP_STATUS.OK)
      .expect('Content-Type', 'text/plain');
    
    expect(response.text).toBe(MESSAGES.HELLO_RESPONSE);
  });
  
  // Test POST request to /hello endpoint
  test('POST /hello should return 405 Method Not Allowed', async () => {
    const config = getConfig();
    
    const response = await request(`http://localhost:${config.port}`)
      .post(ROUTES.HELLO)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET');
    
    expect(response.text).toContain('Method Not Allowed');
  });
  
  // Test PUT request to /hello endpoint
  test('PUT /hello should return 405 Method Not Allowed', async () => {
    const config = getConfig();
    
    const response = await request(`http://localhost:${config.port}`)
      .put(ROUTES.HELLO)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET');
    
    expect(response.text).toContain('Method Not Allowed');
  });
  
  // Test DELETE request to /hello endpoint
  test('DELETE /hello should return 405 Method Not Allowed', async () => {
    const config = getConfig();
    
    const response = await request(`http://localhost:${config.port}`)
      .delete(ROUTES.HELLO)
      .expect(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .expect('Content-Type', 'text/plain')
      .expect('Allow', 'GET');
    
    expect(response.text).toContain('Method Not Allowed');
  });
  
  // Test GET request to undefined route
  test('GET /undefined should return 404 Not Found', async () => {
    const config = getConfig();
    
    const response = await request(`http://localhost:${config.port}`)
      .get('/undefined')
      .expect(HTTP_STATUS.NOT_FOUND)
      .expect('Content-Type', 'text/plain');
    
    expect(response.text).toContain('Not Found');
  });
});