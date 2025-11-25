/**
 * Tests for the configuration module that handles server port configuration.
 * These tests verify that the configuration module correctly reads and validates
 * port settings from environment variables with appropriate fallbacks to defaults.
 * 
 * @jest v29.5.0
 */

// Import the configuration module and constants
const getConfig = require('../../config');
const { validatePort } = require('../../config');
const { CONFIG } = require('../../utils/constants');

/**
 * Helper function to mock environment variables for testing
 * @param {string} name - Name of the environment variable
 * @param {any} value - Value to set for the environment variable
 * @return {Function} Cleanup function to restore original value
 */
function mockEnvironmentVariable(name, value) {
  // Store the original value
  const originalValue = process.env[name];
  
  // Set the new value
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
  
  // Return a cleanup function
  return () => {
    if (originalValue === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = originalValue;
    }
  };
}

describe('Config Module', () => {
  // Clean up environment variables after each test
  afterEach(() => {
    delete process.env[CONFIG.ENV_VAR_PORT];
  });

  it('should return default port when PORT environment variable is not set', () => {
    // Ensure PORT environment variable is not set
    delete process.env[CONFIG.ENV_VAR_PORT];
    
    // Call getConfig()
    const config = getConfig();
    
    // Verify the returned configuration object has port property equal to CONFIG.DEFAULT_PORT
    expect(config.port).toBe(CONFIG.DEFAULT_PORT);
  });

  it('should return PORT environment variable value when it is set', () => {
    // Mock PORT environment variable with a valid port number
    const testPort = 4000;
    const cleanup = mockEnvironmentVariable(CONFIG.ENV_VAR_PORT, testPort.toString());
    
    try {
      // Call getConfig()
      const config = getConfig();
      
      // Verify the returned configuration object has port property equal to the mocked value
      expect(config.port).toBe(testPort);
    } finally {
      // Clean up the environment variable
      cleanup();
    }
  });

  it('should return default port when PORT environment variable is invalid', () => {
    // Mock PORT environment variable with an invalid value
    const cleanup = mockEnvironmentVariable(CONFIG.ENV_VAR_PORT, 'not-a-number');
    
    try {
      // Call getConfig()
      const config = getConfig();
      
      // Verify the returned configuration object has port property equal to CONFIG.DEFAULT_PORT
      expect(config.port).toBe(CONFIG.DEFAULT_PORT);
    } finally {
      // Clean up the environment variable
      cleanup();
    }
  });

  it('should return default port when PORT environment variable is out of range', () => {
    // Mock PORT environment variable with a value outside the valid range
    const cleanup = mockEnvironmentVariable(CONFIG.ENV_VAR_PORT, '100000');
    
    try {
      // Call getConfig()
      const config = getConfig();
      
      // Verify the returned configuration object has port property equal to CONFIG.DEFAULT_PORT
      expect(config.port).toBe(CONFIG.DEFAULT_PORT);
    } finally {
      // Clean up the environment variable
      cleanup();
    }
  });
});

describe('validatePort function', () => {
  it('should validate a valid port number', () => {
    // Call validatePort with a valid port number
    const result = validatePort(3000);
    
    // Verify the function returns the port number
    expect(result).toBe(3000);
  });

  it('should validate a valid port string', () => {
    // Call validatePort with a valid port as string
    const result = validatePort('3000');
    
    // Verify the function returns the port number as a number
    expect(result).toBe(3000);
  });

  it('should return null for non-numeric port', () => {
    // Call validatePort with a non-numeric value
    const result = validatePort('abc');
    
    // Verify the function returns null
    expect(result).toBeNull();
  });

  it('should return null for port below valid range', () => {
    // Call validatePort with a port below the valid range
    const result = validatePort(1000);
    
    // Verify the function returns null
    expect(result).toBeNull();
  });

  it('should return null for port above valid range', () => {
    // Call validatePort with a port above the valid range
    const result = validatePort(70000);
    
    // Verify the function returns null
    expect(result).toBeNull();
  });
});