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
 * Validates that the port number is within valid range
 * 
 * @param {any} port - Port value to validate
 * @returns {number} - Valid port number
 */
function validatePort(port) {
  const parsedPort = parseInt(port, 10);
  
  if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    console.warn(`Invalid port: ${port}. Using default port: ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
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
  const PORT = validatePort(process.env.PORT || DEFAULT_PORT);
  const HOST = process.env.HOST || DEFAULT_HOST;
  const NODE_ENV = process.env.NODE_ENV || DEFAULT_NODE_ENV;
  const LOG_LEVEL = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
  
  // Environment helper flags
  const IS_DEV = NODE_ENV === 'development';
  const IS_PROD = NODE_ENV === 'production';
  const IS_TEST = NODE_ENV === 'test';
  
  return {
    PORT,
    HOST,
    NODE_ENV,
    LOG_LEVEL,
    IS_DEV,
    IS_PROD,
    IS_TEST
  };
}

// Get configuration
const config = getConfig();

// Export configuration
module.exports = config;