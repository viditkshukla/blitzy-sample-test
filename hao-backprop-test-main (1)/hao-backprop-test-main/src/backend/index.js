/**
 * Entry Point for Node.js Hello World Application
 * 
 * This is the main entry point for the Node.js Hello World application.
 * It initializes and starts the HTTP server, handles process signals for
 * graceful shutdown, and exports the server instance for testing purposes.
 * 
 * @module index
 */

// Import server functions
const { startServer, stopServer } = require('./server');

// Import logger for application logging
const { info, error } = require('./utils/logger');

// Import configuration
const { IS_TEST } = require('./config');

// Server instance reference
let server = null;

/**
 * Sets up event listeners for process termination signals to ensure graceful server shutdown
 */
function setupGracefulShutdown() {
  // Handle SIGINT signal (Ctrl+C)
  process.on('SIGINT', () => {
    info('SIGINT signal received. Shutting down server...');
    stopServer()
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        error('Error during shutdown', err);
        process.exit(1);
      });
  });

  // Handle SIGTERM signal (termination request)
  process.on('SIGTERM', () => {
    info('SIGTERM signal received. Shutting down server...');
    stopServer()
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        error('Error during shutdown', err);
        process.exit(1);
      });
  });
}

/**
 * Main function that initializes and starts the application
 * 
 * @returns {Promise<void>} Promise that resolves when the server has started
 */
async function main() {
  try {
    info('Starting Node.js Hello World application...');
    
    // Start the HTTP server
    server = await startServer();
    
    // Set up graceful shutdown
    setupGracefulShutdown();
    
    info('Application startup complete.');
  } catch (err) {
    error('Failed to start application', err);
    process.exit(1);
  }
}

// Start the server if not in test mode
if (!IS_TEST) {
  main();
}

// Export the server instance for testing
module.exports = {
  server
};