# Changelog

All notable changes to the Node.js Hello World HTTP server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New `/welcome` endpoint handler at `handlers/welcomeHandler.js`, retaining GET-only method validation
- Welcome screen served on `GET /welcome`: a self-contained HTML5 document with the heading `Welcome to HelloGHES`
- Short description beneath the heading: `A simple Node.js service that greets you from the /welcome endpoint.`
- Route, message and header constants for the new endpoint: `ROUTES.WELCOME`, `MESSAGES.WELCOME_HEADING`, `MESSAGES.WELCOME_DESCRIPTION` and `HEADERS.CONTENT_TYPE_HTML`
- Unit test suite for the new handler at `__tests__/handlers/welcomeHandler.test.js`
- Integration coverage asserting the retired `/hello` path now returns `404 Not Found`

### Changed
- Renamed the `/hello` endpoint to `/welcome`; the retired path is no longer registered and returns `404 Not Found` like any other unknown path, with no redirect provided
- Content-Type of the successful response changed from `text/plain` to `text/html; charset=utf-8`
- Route table now registers the path from the shared `ROUTES.WELCOME` constant instead of a hard-coded literal
- Method restriction carried over unchanged: non-GET requests to `/welcome` still receive `405 Method Not Allowed` with `Allow: GET`
- Per-file Jest coverage threshold key moved to `handlers/welcomeHandler.js`
- Deployment health check, container health check and operator-facing service URLs updated to the new endpoint and expected response body
- Documentation updated to publish `/welcome` and its HTML sample response

### Removed
- The endpoint handler module of the retired route, superseded by `handlers/welcomeHandler.js`
- The mirrored unit test of that retired handler, superseded by `__tests__/handlers/welcomeHandler.test.js`
- A second unit test module for the retired endpoint, which required a handler module that has never existed on disk and therefore covered nothing

### Fixed
- The route table required an endpoint handler module absent from the handlers directory, which prevented the server from starting; it now requires `./handlers/welcomeHandler`

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
