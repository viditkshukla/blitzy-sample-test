/**
 * Entry Point for Node.js Hello World Application
 * 
 * This is the main entry point for the Node.js Hello World application.
 * It initializes and starts the HTTP server, handles process signals for
 * graceful shutdown, and exports the main function for testing purposes.
 * 
 * @module index
 */

// Import server functions
const { createServer, startServer, setupGracefulShutdown } = require('./server');

// Import logger for application logging
const logger = require('./utils/logger');

// Import configuration
const getConfig = require('./config');
const { IS_TEST } = getConfig();

/**
 * Main function that initializes and starts the application
 * 
 * @returns {Promise<http.Server>} Promise that resolves with the server instance when started
 */
async function main() {
  try {
    // Create the HTTP server instance
    const server = createServer();
    
    // Start the HTTP server
    await startServer(server);
    
    // Set up graceful shutdown
    setupGracefulShutdown(server);
    
    // Log successful initialization
    logger.info('Application initialized successfully');
    
    // Return the server instance
    return server;
  } catch (err) {
    // Log error and re-throw
    logger.error('Failed to initialize application:');
    logger.error(err);
    throw err;
  }
}

// Start the server if not in test mode
if (!IS_TEST) {
  main().catch(() => {
    process.exit(1);
  });
}

// Export the main function for testing
module.exports = main;
