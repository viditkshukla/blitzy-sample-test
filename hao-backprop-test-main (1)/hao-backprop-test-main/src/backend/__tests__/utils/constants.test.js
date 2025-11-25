/**
 * Unit tests for the constants.js utility file
 * 
 * Tests all constants used throughout the Node.js Hello World application
 * to ensure they have the expected values and types.
 */

// Import all constants from the constants.js file
// Jest v29.5.0
const {
  HTTP_STATUS,
  ROUTES,
  CONFIG,
  MESSAGES,
  HEADERS,
  HTTP_METHODS
} = require('../../utils/constants');

/**
 * Test suite for HTTP status code constants
 */
describe('HTTP_STATUS', () => {
  test('should define OK as 200', () => {
    expect(HTTP_STATUS.OK).toBe(200);
  });

  test('should define NOT_FOUND as 404', () => {
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
  });

  test('should define METHOD_NOT_ALLOWED as 405', () => {
    expect(HTTP_STATUS.METHOD_NOT_ALLOWED).toBe(405);
  });

  test('should define INTERNAL_SERVER_ERROR as 500', () => {
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  });
});

/**
 * Test suite for route path constants
 */
describe('ROUTES', () => {
  test("should define HELLO as '/hello'", () => {
    expect(ROUTES.HELLO).toBe('/hello');
  });
});

/**
 * Test suite for configuration constants
 */
describe('CONFIG', () => {
  test('should define DEFAULT_PORT as 3000', () => {
    expect(CONFIG.DEFAULT_PORT).toBe(3000);
  });

  test("should define ENV_VAR_PORT as 'PORT'", () => {
    expect(CONFIG.ENV_VAR_PORT).toBe('PORT');
  });
});

/**
 * Test suite for message string constants
 */
describe('MESSAGES', () => {
  test("should define HELLO_RESPONSE as 'Hello world'", () => {
    expect(MESSAGES.HELLO_RESPONSE).toBe('Hello world');
  });

  test("should define NOT_FOUND as 'Not Found'", () => {
    expect(MESSAGES.NOT_FOUND).toBe('Not Found');
  });

  test("should define METHOD_NOT_ALLOWED as 'Method Not Allowed'", () => {
    expect(MESSAGES.METHOD_NOT_ALLOWED).toBe('Method Not Allowed');
  });

  test("should define SERVER_ERROR as 'Internal Server Error'", () => {
    expect(MESSAGES.SERVER_ERROR).toBe('Internal Server Error');
  });

  test("should define SERVER_STARTED as 'Server running on port'", () => {
    expect(MESSAGES.SERVER_STARTED).toBe('Server started on port %d');
  });
});

/**
 * Test suite for HTTP header constants
 */
describe('HEADERS', () => {
  test("should define CONTENT_TYPE as 'Content-Type'", () => {
    expect(HEADERS.CONTENT_TYPE).toBe('Content-Type');
  });

  test("should define CONTENT_TYPE_TEXT as 'text/plain'", () => {
    expect(HEADERS.CONTENT_TYPE_TEXT).toBe('text/plain');
  });

  test("should define ALLOW as 'Allow'", () => {
    expect(HEADERS.ALLOW).toBe('Allow');
  });
});

/**
 * Test suite for HTTP method constants
 */
describe('HTTP_METHODS', () => {
  test("should define GET as 'GET'", () => {
    expect(HTTP_METHODS.GET).toBe('GET');
  });
});