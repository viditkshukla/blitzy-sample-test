/**
 * Jest setup file for the Node.js Hello World server application.
 * This file configures the test environment before tests are executed,
 * setting up global mocks, utilities, and configurations needed across
 * multiple test files.
 */

// Import internal dependencies
const logger = require('../utils/logger');

/**
 * Sets up global mocks for console methods and other utilities
 */
function setupGlobalMocks() {
  // Mock console methods to prevent console output during tests
  jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
  jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
  jest.spyOn(global.console, 'warn').mockImplementation(jest.fn());
  jest.spyOn(global.console, 'debug').mockImplementation(jest.fn());
}

/**
 * Sets up mocks for the logger utility functions
 */
function setupLoggerMocks() {
  // Mock logger methods to prevent logging during tests
  jest.spyOn(logger, 'info').mockImplementation(jest.fn());
  jest.spyOn(logger, 'error').mockImplementation(jest.fn());
  jest.spyOn(logger, 'warn').mockImplementation(jest.fn());
  jest.spyOn(logger, 'debug').mockImplementation(jest.fn());
  jest.spyOn(logger, 'request').mockImplementation(jest.fn());
  jest.spyOn(logger, 'response').mockImplementation(jest.fn());
}

/**
 * Configures the Jest test environment with global settings
 */
function setupTestEnvironment() {
  // Set Jest timeout to match the configured testTimeout
  jest.setTimeout(10000); // Default to 10 seconds if not configured
  
  // Configure Jest to reset mocks automatically after each test
  // This is handled by our beforeEach and afterEach hooks
}

/**
 * Global beforeEach hook that runs before each test
 */
const globalBeforeEach = () => {
  // Setup fresh mocks for each test to ensure test isolation
  setupGlobalMocks();
  setupLoggerMocks();
};

/**
 * Global afterEach hook that runs after each test
 */
const globalAfterEach = () => {
  // Clean up mocks and restore original functionality
  jest.restoreAllMocks();
};

// Set up global hooks
beforeEach(globalBeforeEach);
afterEach(globalAfterEach);

// Initialize test environment
setupTestEnvironment();