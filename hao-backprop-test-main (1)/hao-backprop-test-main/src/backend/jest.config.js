/**
 * Jest configuration for Node.js Hello World application
 * 
 * This configuration file sets up the testing environment and parameters for the 
 * Hello World API testing. It defines test patterns, coverage requirements,
 * reporting formats, and other test-related settings to ensure consistent
 * test execution across different environments.
 * 
 * The configuration enforces strict coverage requirements for critical components
 * like the Hello Handler (100% coverage) while maintaining high but more flexible
 * requirements for other components.
 */

module.exports = {
  // Use Node.js as the test environment
  testEnvironment: 'node',
  
  // Look for test files in __tests__ directories with .test.js extension
  testMatch: ['**/__tests__/**/*.test.js'],
  
  // Collect coverage from all JavaScript files, with some exclusions
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/.eslintrc.js'
  ],
  
  // Set coverage thresholds - failing the test run if not met
  coverageThreshold: {
    // Global thresholds
    global: {
      branches: 80,
      functions: 90,
      lines: 85,
      statements: 85
    },
    // Critical path coverage requirements
    './handlers/hello.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    './handlers/error.js': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90
    }
  },
  
  // Configure reporters for test results output
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › '
      }
    ]
  ],
  
  // Enable verbose output for detailed test information
  verbose: true,
  
  // Mock behavior settings
  clearMocks: true,   // Clear mock calls between tests
  resetMocks: true,   // Reset mock state between tests
  restoreMocks: true  // Restore mocked implementations between tests
};