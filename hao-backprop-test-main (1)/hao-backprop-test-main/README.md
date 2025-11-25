# Node.js Hello World Service

A simple Node.js HTTP server application that exposes a single REST endpoint `/hello` which returns "Hello world" to clients.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Overview

This project demonstrates fundamental Node.js web service concepts with minimal complexity. It serves as an educational tool and reference implementation for basic HTTP server functionality in Node.js.

The application provides a minimal, functional example of a Node.js web service that can serve as a learning tool or starter template for developers new to Node.js or as a reference implementation for more complex services.

## Features

- HTTP server implementation in Node.js
- Single `/hello` endpoint returning "Hello world" text
- Support for both native HTTP module and Express.js implementations
- Basic request logging
- Error handling for various scenarios
- Security headers
- Configurable server settings
- Docker and Docker Compose support
- Monitoring with Prometheus and Grafana

## Requirements

- Node.js 18.x LTS or higher
- npm 9.x or higher

For containerized deployment:
- Docker
- Docker Compose (optional, for running with monitoring)

## Installation

### Local Development

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the backend directory
cd src/backend

# Install dependencies
npm install
```

### Docker Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the backend directory
cd src/backend

# Build the Docker image
docker build -t node-hello-world .
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

A sample configuration file is provided as `.env.example` in the backend directory.

## Usage

### Starting the Server Locally

```bash
# Navigate to the backend directory
cd src/backend

# Start the server using the native HTTP implementation
npm start

# Start the server with automatic restart during development
npm run dev
```

### Running with Docker

```bash
# Run the Docker container
docker run -p 3000:3000 node-hello-world
```

### Running with Docker Compose (includes monitoring)

```bash
# Navigate to the infrastructure directory
cd infrastructure

# Start all services (application, Prometheus, Grafana)
docker-compose up -d
```

### Using the API

Once the server is running, you can access the endpoint:

```bash
# Using curl
curl http://localhost:3000/hello

# Expected response
Hello world
```

You can also access the endpoint in a web browser by navigating to `http://localhost:3000/hello`.

## Project Structure

```
├── .github/                # GitHub configuration files
│   ├── workflows/         # GitHub Actions workflows
│   └── ISSUE_TEMPLATE/    # Issue templates
├── infrastructure/        # Deployment and infrastructure files
│   ├── monitoring/        # Prometheus and Grafana configuration
│   ├── scripts/           # Deployment and utility scripts
│   └── docker-compose.yml # Docker Compose configuration
├── src/
│   └── backend/           # Node.js application code
│       ├── __tests__/     # Test files
│       ├── handlers/      # Request handlers
│       ├── middleware/    # Middleware functions
│       ├── utils/         # Utility functions
│       ├── config.js      # Application configuration
│       ├── index.js       # Application entry point
│       ├── server.js      # Native HTTP server implementation
│       └── server-express.js # Express server implementation
├── .gitignore             # Git ignore file
├── LICENSE                # MIT license file
└── README.md              # This documentation file
```

For more detailed information about the backend structure, see [src/backend/README.md](src/backend/README.md).

## API Documentation

### GET /hello

Returns a simple "Hello world" message.

**Request**

```
GET /hello HTTP/1.1
Host: localhost:3000
```

**Response**

```
HTTP/1.1 200 OK
Content-Type: text/plain
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'

Hello world
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

## Implementation Details

This project provides two server implementations:

1. **Native HTTP Module** (`server.js`): Uses Node.js built-in HTTP module without additional frameworks.

2. **Express.js** (`server-express.js`): Uses the Express.js framework for simplified routing and middleware.

By default, the application uses the native HTTP implementation. To use the Express implementation, modify the `index.js` file to import from `server-express.js` instead of `server.js`.

### Key Components

- **HTTP Server**: Lightweight Node.js server handling incoming HTTP requests
- **Request Router**: Directs incoming requests to appropriate handlers based on URL path
- **Hello Handler**: Processes requests to `/hello` endpoint and generates responses
- **Error Handler**: Manages error conditions and generates appropriate error responses
- **Middleware**: Provides logging, security headers, and other cross-cutting concerns

## Development

### Running Tests

```bash
# Navigate to the backend directory
cd src/backend

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

## Monitoring

When running with Docker Compose, the application includes Prometheus and Grafana for monitoring:

- **Prometheus**: Collects metrics from the application
  - Access at: http://localhost:9090

- **Grafana**: Provides visualization dashboards
  - Access at: http://localhost:3001
  - Default credentials: admin/admin

The monitoring setup includes:
- Basic server metrics (CPU, memory, request count)
- Response time tracking
- Error rate monitoring
- Health check status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code passes all tests and linting checks before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.