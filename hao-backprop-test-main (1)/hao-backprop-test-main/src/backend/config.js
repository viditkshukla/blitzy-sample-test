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
  
  if (isNaN(parsedPort) || parsedPort < 1024 || parsedPort > 65535) {
    return null;
  }
  
  return parsedPort;
}

/**
 * Retrieves the configuration object with all settings.
 * Returns a frozen object with both lowercase keys (primary API) and
 * uppercase keys (backward compatibility for existing consumers).
 * 
 * @returns {object} - Frozen configuration object with port, host, env, logLevel, isDev, isProd, isTest
 */
function getConfig() {
  // Load environment variables from .env file if it exists
  loadEnv();
  
  // Get and validate port — fall back to DEFAULT_PORT if validatePort returns null
  const rawPort = process.env.PORT || DEFAULT_PORT;
  const validatedPort = validatePort(rawPort);
  const port = validatedPort !== null ? validatedPort : DEFAULT_PORT;
  
  // Get remaining configuration values from environment variables or defaults
  const host = process.env.HOST || DEFAULT_HOST;
  const env = process.env.NODE_ENV || DEFAULT_NODE_ENV;
  const logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
  
  // Environment helper flags
  const isDev = env === 'development';
  const isProd = env === 'production';
  const isTest = env === 'test';
  
  return Object.freeze({
    // Lowercase keys (primary API)
    port,
    host,
    env,
    logLevel,
    isDev,
    isProd,
    isTest,
    // Uppercase keys (backward compatibility for server.js, index.js, logger.js)
    PORT: port,
    HOST: host,
    NODE_ENV: env,
    LOG_LEVEL: logLevel,
    IS_DEV: isDev,
    IS_PROD: isProd,
    IS_TEST: isTest
  });
}

// Run getConfig once at module load for backward-compatible property access
const config = getConfig();

// Export getConfig as the default callable export
module.exports = getConfig;

// Named export for validatePort
module.exports.validatePort = validatePort;

// Attach config properties directly for backward-compatible destructuring:
// e.g., const { PORT, HOST } = require('./config') still works
module.exports.PORT = config.PORT;
module.exports.HOST = config.HOST;
module.exports.NODE_ENV = config.NODE_ENV;
module.exports.LOG_LEVEL = config.LOG_LEVEL;
module.exports.IS_DEV = config.IS_DEV;
module.exports.IS_PROD = config.IS_PROD;
module.exports.IS_TEST = config.IS_TEST;