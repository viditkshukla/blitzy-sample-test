# Changelog

All notable changes to the Node.js Hello World HTTP server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release of the Node.js Hello World HTTP server
- HTTP server implementation using Node.js core HTTP module
- Single `/hello` endpoint returning "Hello world" text response
- Basic error handling for server startup and request processing
- Environment variable configuration for server port
- Proper HTTP status codes and headers
- Request routing implementation
- Comprehensive test suite with Jest

## [0.1.0] - YYYY-MM-DD

### Added
- Project scaffolding and initial structure
- Basic HTTP server implementation
- Configuration management via environment variables
- Simple request router
- Hello endpoint handler
- Error handling utilities
- Logging functionality
- Test environment setup

## [Unreleased]

### Added
- `GET /health` liveness endpoint returning `200 OK` with `Content-Type: application/json` and body `{"status":"up"}`; non-GET methods return `405 Method Not Allowed` with `Allow: GET`

### Changed
- Future changes will be listed here

### Fixed
- `server.js` now loads the existing hello handler (`handlers/helloHandler.js`); it previously required the missing `handlers/hello` and failed to start