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
# Clone the repository (if you haven't already)
git clone <repository-url>

# Navigate to the backend directory
cd src/backend

# Install dependencies
npm install
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
# Start the server using the native HTTP implementation
npm start

# Start the server with automatic restart during development
npm run dev
```

### Using the API

Once the server is running, you can access the endpoint:

```bash
# Using curl
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
│   ├── server.test.js   # Native HTTP server tests
│   └── server-express.test.js # Express server tests
├── handlers/            # Request handlers
│   ├── error.js         # Error handlers
│   └── welcomeHandler.js  # Welcome endpoint handler
├── middleware/          # Middleware functions
│   └── index.js         # Middleware definitions
├── utils/               # Utility functions
│   └── logger.js        # Logging utility
├── .env.example         # Example environment variables
├── .eslintrc.js         # ESLint configuration
├── config.js            # Application configuration
├── Dockerfile           # Docker configuration
├── index.js             # Application entry point
├── jest.config.js       # Jest test configuration
├── nodemon.json         # Nodemon configuration
├── package.json         # Project dependencies and scripts
├── README.md            # This documentation file
├── server.js            # Native HTTP server implementation
└── server-express.js    # Express server implementation
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
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix automatically fixable issues
npm run lint:fix
```

### Security Audit

```bash
# Check for vulnerabilities
npm run audit

# Fix vulnerabilities when possible
npm run audit:fix
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