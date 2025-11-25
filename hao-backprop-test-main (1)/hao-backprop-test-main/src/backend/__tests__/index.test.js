/**
 * Unit tests for the index.js module that serves as the entry point for the Node.js Hello World HTTP server application.
 * Tests verify server initialization, graceful shutdown setup, and error handling during startup.
 */

// Mock dependencies before importing the module to test
jest.mock('../server');
jest.mock('../errorHandler');
jest.mock('../utils/logger');

// Import mocked dependencies
const { createServer, startServer, setupGracefulShutdown } = require('../server');
const { handleServerError } = require('../errorHandler');
const logger = require('../utils/logger');
const { MESSAGES } = require('../utils/constants');

// Import the module to test - importing as "main" to match the specification
const main = require('../index');

describe('index.js', () => {
  // Mock server object
  const mockServer = { listening: true };
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Configure default mock implementations
    createServer.mockReturnValue(mockServer);
    startServer.mockResolvedValue(mockServer);
  });
  
  afterEach(() => {
    // Cleanup after each test
    jest.resetAllMocks();
    jest.resetModules();
  });
  
  it('should initialize and start the server successfully', async () => {
    // Call the function being tested
    const server = await main();
    
    // Verify server was created and started correctly
    expect(createServer).toHaveBeenCalledTimes(1);
    expect(startServer).toHaveBeenCalledWith(mockServer);
    expect(setupGracefulShutdown).toHaveBeenCalledWith(mockServer);
    
    // Verify successful initialization was logged
    expect(logger.info).toHaveBeenCalledWith('Application initialized successfully');
    
    // Verify the server instance was returned
    expect(server).toBe(mockServer);
  });
  
  it('should handle errors during server creation', async () => {
    // Setup mock to throw an error
    const error = new Error('Server creation failed');
    createServer.mockImplementation(() => {
      throw error;
    });
    
    // Verify the error is properly handled
    await expect(main()).rejects.toThrow(error);
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith('Failed to initialize application:');
    expect(logger.error).toHaveBeenCalledWith(error);
  });
  
  it('should handle errors during server startup', async () => {
    // Setup mock to reject with an error
    const error = new Error('Server startup failed');
    startServer.mockRejectedValue(error);
    
    // Verify the error is properly handled
    await expect(main()).rejects.toThrow(error);
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith('Failed to initialize application:');
    expect(logger.error).toHaveBeenCalledWith(error);
  });
  
  it('should export the server instance', async () => {
    // Call the main function to get the server instance
    const server = await main();
    
    // Verify the correct server instance is returned
    expect(server).toBe(mockServer);
  });
});