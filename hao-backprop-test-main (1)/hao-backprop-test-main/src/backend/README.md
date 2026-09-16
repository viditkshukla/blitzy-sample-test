# Node.js Hello World Service

A simple Node.js HTTP server application that exposes a single REST endpoint `/welcome` which serves a Welcome screen to clients.

## Overview

This project demonstrates fundamental Node.js web service concepts with minimal complexity. It serves as an educational tool and reference implementation for basic HTTP server functionality in Node.js.

## Features

- HTTP server implementation in Node.js
- Single `/welcome` endpoint serving a Welcome screen (heading and short description) as HTML
- Support for both native HTTP module and Express.js implementations
- Basic request logging
- Error handling for various scenarios
- Security headers
- Configurable server settings

## Requirements

- Node.js 18.x LTS or higher
- npm 9.x or higher

## Installation

```bash
git clone <repository-url>
cd src/backend

# `npm install` on its own installs nothing: this directory has no package.json, so npm
# resolves the root manifest, which declares no dependencies. Install the runtime dependency
# (dotenv) and the test tooling explicitly; --no-save leaves package.json and
# package-lock.json untouched, and node_modules is created at the project root, where Node's
# upward resolution serves both the root and src/backend. jest.config.js configures jest-junit
# as a reporter, so the runs below need it; pin 17.0.0 — jest-junit 9.0.0 through 16.0.0
# resolve a uuid affected by GHSA-w5hq-g745-h8pq, while 17.0.0 audits clean.
npm install --no-save jest@29.5.0 supertest@6.3.3 dotenv@16.0.3 jest-junit@17.0.0
```

## Configuration

The application can be configured using environment variables or a `.env` file in the backend directory.

### Available Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | The port number the server will listen on |
| HOST | 0.0.0.0 | The host address the server will bind to |
| NODE_ENV | development | Environment mode (development, production, test) |
| LOG_LEVEL | INFO | Logging level (INFO, WARN, ERROR) |

### Example .env file

```
PORT=8080
HOST=127.0.0.1
NODE_ENV=development
LOG_LEVEL=INFO
```

A sample configuration file is provided as `.env.example`.

## Usage

### Starting the Server

```bash
# `npm start` is not defined: package.json declares no `start` script, so npm falls back to
# its own default, `node server.js`, and launches the root demo server on port 3000 instead
# of this service. Start the service directly; PORT, HOST, NODE_ENV and LOG_LEVEL are all
# optional and default to 3000, 0.0.0.0, development and INFO.
PORT=3000 node index.js

# Automatic restart on change is unavailable: `npm run dev` is not defined in any manifest
# and nodemon is not installed, so nodemon.json currently has nothing to drive it.
```

### Using the API

Once the server is running, you can access the endpoint:

```bash
curl http://localhost:3000/welcome

# Expected response
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Welcome to HelloGHES</title>
</head>
<body>
<h1>Welcome to HelloGHES</h1>
<p>A simple Node.js service that greets you from the /welcome endpoint.</p>
</body>
</html>
```

You can also access the endpoint in a web browser by navigating to `http://localhost:3000/welcome`.

## Project Structure

```
src/backend/
├── __tests__/            # Test files
│   ├── handlers/        # Handler tests
│   ├── integration/     # Supertest endpoint contract tests
│   ├── utils/           # Constants and logger tests
│   ├── config.test.js   # Configuration tests
│   ├── errorHandler.test.js # Shared error handler tests
│   ├── index.test.js    # Entry point tests
│   ├── router.test.js   # Standalone dispatcher tests
│   ├── server.test.js   # Native HTTP server tests
│   └── setup.js         # Shared mocks, not loaded: jest.config.js sets no setupFiles
├── handlers/            # Request handlers
│   ├── error.js         # Error handlers
│   └── welcomeHandler.js  # Welcome endpoint handler
├── middleware/          # Middleware functions
│   └── index.js         # Middleware definitions
├── utils/               # Utility functions
│   ├── constants.js     # Route, message and header constants
│   └── logger.js        # Logging utility
├── CHANGELOG.md         # Backend change history
├── config.js            # Application configuration
├── Dockerfile           # Docker configuration
├── errorHandler.js      # Constants-driven 404/405/500 responses
├── index.js             # Application entry point
├── jest.config.js       # Jest test configuration
├── nodemon.json         # Nodemon configuration
├── README.md            # This documentation file
├── router.js            # Standalone dispatcher, not used by server.js
└── server.js            # Native HTTP server implementation
```

## API Documentation

### GET /welcome

Returns a simple Welcome screen as an HTML document.

**Request**

```
GET /welcome HTTP/1.1
Host: localhost:3000
```

**Response**

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Welcome to HelloGHES</title>
</head>
<body>
<h1>Welcome to HelloGHES</h1>
<p>A simple Node.js service that greets you from the /welcome endpoint.</p>
</body>
</html>
```

### Error Responses

**404 Not Found**

Returned when requesting a non-existent endpoint.

```
HTTP/1.1 404 Not Found
Content-Type: text/plain

Not Found
```

**405 Method Not Allowed**

Returned when using an unsupported HTTP method on an existing endpoint.

```
HTTP/1.1 405 Method Not Allowed
Content-Type: text/plain
Allow: GET

Method Not Allowed
```

## Development

### Running Tests

```bash
# `npm test` only runs the placeholder script in package.json, which prints
# "Error: no test specified" and exits 1; `test:coverage` and `test:watch` are not defined at
# all. Invoke Jest directly from this directory, after the --no-save install shown under
# Installation. --runInBand is required because the server and integration suites both bind
# the configured port and jest.config.js sets no maxWorkers.

# Run the suites covering the /welcome endpoint and the shared error handlers. Exits 0.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand \
  --testPathPattern "(handlers/welcomeHandler|integration/api|utils/constants|errorHandler|handlers/error)"

# Run every suite. This exits 1: the config, index, router, server and utils/logger suites
# carry pre-existing failures unrelated to the /welcome endpoint.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand

# Coverage report. handlers/welcomeHandler.js meets its 100% per-file threshold; the four
# global thresholds are unmet while the suites above fail, so this also exits 1.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand --coverage

# Re-run on change. Interactive, so it does not exit on its own.
npx jest --config jest.config.js --rootDir . --watch
```

### Linting

```bash
# No lint gate exists: this repository contains no ESLint or Prettier configuration and
# declares no lint dependency, so `npm run lint` and `npm run lint:fix` are not defined. The
# available static check is a syntax pass over every source file in this directory tree.
for f in $(find . -name '*.js' -not -path './node_modules/*' -not -path './coverage/*'); do node --check "$f" || echo "SYNTAX FAIL $f"; done
```

### Security Audit

```bash
# `npm run audit` and `npm run audit:fix` are not defined. npm's built-in audit resolves the
# root manifest from here and reports on declared dependencies only: package.json declares
# none, so it audits the root package alone and reports no vulnerabilities. It does not cover
# the packages installed with --no-save above: audit those by declaring the same four versions
# in a scratch package.json outside this checkout and running `npm audit` there.
npm audit
```

## Docker

The application includes a Dockerfile for containerization.

### Building the Docker Image

```bash
docker build -t node-hello-world .
```

### Running the Container

```bash
docker run -p 3000:3000 node-hello-world
```

You can also use Docker Compose with the provided configuration in the `infrastructure` directory:

```bash
cd ../../infrastructure
docker-compose up
```

## Implementation Details

This project provides two server implementations:

1. **Native HTTP Module** (`server.js`): Uses Node.js built-in HTTP module without additional frameworks.

2. **Express.js** (`server-express.js`): Uses the Express.js framework for simplified routing and middleware.

By default, the application uses the native HTTP implementation. To use the Express implementation, modify the `index.js` file to import from `server-express.js` instead of `server.js`.

## License

MIT