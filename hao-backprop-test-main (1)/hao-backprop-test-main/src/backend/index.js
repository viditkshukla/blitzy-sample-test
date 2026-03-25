/**
 * Entry Point for Node.js Hello World Application
 * 
 * This is the main entry point for the Node.js Hello World application.
 * It initializes and starts the HTTP server, handles process signals for
 * graceful shutdown, and exports the main initialization function for testing purposes.
 * 
 * @module index
 */

// Import server functions
const { createServer, startServer, setupGracefulShutdown } = require('./server');

// Import logger for application logging
const { info, error } = require('./utils/logger');

// Import configuration
const { IS_TEST } = require('./config');

/**
 * Main function that initializes and starts the application.
 * Creates the HTTP server, starts it, sets up graceful shutdown,
 * and returns the server instance.
 * 
 * @returns {Promise<http.Server>} Promise that resolves with the server instance
 */
async function main() {
  try {
    // Create the HTTP server
    const server = createServer();
    
    // Start the HTTP server
    await startServer(server);
    
    // Set up graceful shutdown
    setupGracefulShutdown(server);
    
    // Log successful initialization
    info('Application initialized successfully');
    
    return server;
  } catch (err) {
    // Log the error message and error object separately
    error('Failed to initialize application:');
    error(err);
    throw err;
  }
}

// Start the server if not in test mode
if (!IS_TEST) {
  main();
}

// Export main as the default export
module.exports = main;