/**
 * Configuration Module
 * 
 * Loads environment variables from .env file and provides configuration settings with sensible defaults.
 * This module centralizes all configuration values used throughout the application.
 * 
 * @module config
 */

// External dependencies
const dotenv = require('dotenv'); // dotenv v16.0.3
const path = require('path'); // Node.js built-in module

// Default configuration values
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_LOG_LEVEL = 'INFO';

// Port validation range (user/dynamic ports only, avoiding privileged ports)
const MIN_PORT = 1024;
const MAX_PORT = 65535;

/**
 * Loads environment variables from .env file if it exists
 */
function loadEnv() {
  try {
    const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    
    if (result.error) {
      // If .env file doesn't exist or can't be read, that's fine in production
      // as environment variables should be set through the deployment platform
      if (process.env.NODE_ENV !== 'production') {
        console.log('No .env file found or unable to read it. Using default values and environment variables.');
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Environment variables loaded from .env file');
    }
  } catch (error) {
    console.error('Error loading .env file:', error.message);
  }
}

/**
 * Validates that the port number is within valid range (1024-65535)
 * 
 * @param {any} port - Port value to validate
 * @returns {number|null} - Valid port number, or null if invalid
 */
function validatePort(port) {
  const parsedPort = parseInt(port, 10);
  
  // Return null if not a number or outside valid range
  if (isNaN(parsedPort) || parsedPort < MIN_PORT || parsedPort > MAX_PORT) {
    return null;
  }
  
  return parsedPort;
}

/**
 * Retrieves the configuration object with all settings
 * 
 * @returns {object} - Configuration object
 */
function getConfig() {
  // Load environment variables from .env file if it exists
  loadEnv();
  
  // Get configuration values from environment variables or use defaults
  const validatedPort = validatePort(process.env.PORT);
  const port = validatedPort !== null ? validatedPort : DEFAULT_PORT;
  const host = process.env.HOST || DEFAULT_HOST;
  const nodeEnv = process.env.NODE_ENV || DEFAULT_NODE_ENV;
  const logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
  
  // Environment helper flags
  const isDev = nodeEnv === 'development';
  const isProd = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';
  
  return {
    port,
    host,
    nodeEnv,
    logLevel,
    isDev,
    isProd,
    isTest,
    // Also expose uppercase versions for backward compatibility
    PORT: port,
    HOST: host,
    NODE_ENV: nodeEnv,
    LOG_LEVEL: logLevel,
    IS_DEV: isDev,
    IS_PROD: isProd,
    IS_TEST: isTest
  };
}

// Export getConfig as the default export for backwards compatibility and tests
// Also export validatePort as a named export for direct testing
module.exports = getConfig;
module.exports.getConfig = getConfig;
module.exports.validatePort = validatePort;
