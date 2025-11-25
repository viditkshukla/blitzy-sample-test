/**
 * Application-wide constants for the Node.js Hello World server application
 * 
 * This module defines constants used throughout the application including:
 * - HTTP status codes
 * - Route paths
 * - Configuration values
 * - Message strings
 * - HTTP headers
 * - HTTP methods
 */

/**
 * HTTP status code constants
 */
const HTTP_STATUS = {
  /** HTTP 200 OK */
  OK: 200,
  /** HTTP 404 Not Found */
  NOT_FOUND: 404,
  /** HTTP 405 Method Not Allowed */
  METHOD_NOT_ALLOWED: 405,
  /** HTTP 500 Internal Server Error */
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Route path constants
 */
const ROUTES = {
  /** Hello endpoint route */
  HELLO: '/hello'
};

/**
 * Server configuration constants
 */
const CONFIG = {
  /** Default server port when not specified in environment */
  DEFAULT_PORT: 3000,
  /** Environment variable name for port configuration */
  ENV_VAR_PORT: 'PORT'
};

/**
 * Message string constants for responses and logging
 */
const MESSAGES = {
  /** Response text for the hello endpoint */
  HELLO_RESPONSE: 'Hello world',
  /** Message for 404 Not Found responses */
  NOT_FOUND: 'Not Found',
  /** Message for 405 Method Not Allowed responses */
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  /** Message for 500 Internal Server Error responses */
  SERVER_ERROR: 'Internal Server Error',
  /** Server startup message (format with port number) */
  SERVER_STARTED: 'Server started on port %d'
};

/**
 * HTTP header constants
 */
const HEADERS = {
  /** Content-Type header name */
  CONTENT_TYPE: 'Content-Type',
  /** Content-Type value for plain text responses */
  CONTENT_TYPE_TEXT: 'text/plain',
  /** Allow header for Method Not Allowed responses */
  ALLOW: 'Allow'
};

/**
 * HTTP method constants
 */
const HTTP_METHODS = {
  /** GET method */
  GET: 'GET'
};

// Export all constants for use throughout the application
module.exports = {
  HTTP_STATUS,
  ROUTES,
  CONFIG,
  MESSAGES,
  HEADERS,
  HTTP_METHODS
};