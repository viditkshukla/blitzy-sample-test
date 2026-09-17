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
- Documented non-GET contract for `/welcome` narrowed to the methods Node's HTTP parser accepts (`require('http').METHODS`): every one of them except `GET` and `CONNECT` receives `405` with `Allow: GET`, while a token outside that set is answered by the runtime with a bare `400 Bad Request` and `Connection: close`, and `CONNECT` is closed without a response. Behaviour is unchanged; only the published wording was too broad
- Documented way to observe the 405 from a browser changed to a navigation-based form POST. The served page's `Content-Security-Policy: default-src 'none'` refuses `fetch`, `XMLHttpRequest` and `navigator.sendBeacon` from the document itself, which is the policy working as intended; the policy and the security middleware are unchanged
- Published test record corrected to the measured shape: the per-file coverage figures, and the failing-test inventory's causes — the logger group split into four absent-export `TypeError`s and four console assertions that fail because logging is suppressed in the test environment, and the server lifecycle failures attributed to require-time logger destructuring and to the `listen` callback ignoring its argument rather than to the mock-reset settings. The retained `url: '/hello'` fixtures are recorded as sitting in the 405 and 500 tests of `__tests__/handlers/error.test.js`
- Toolchain install recipe reconciled to one published command: `infrastructure/README.md` now carries the same four pinned packages as `README.md` and `src/backend/README.md` instead of a `dotenv`-only variant, and the `jest-junit` reporter entry in `jest.config.js` points at that one recipe for the version a reporter string cannot itself express
- `infrastructure/README.md`'s "Updating Dependencies" step no longer tells an operator to run `npm update`, which prunes the whole installed tree — the runtime `dotenv` with it — because no manifest declares any of it; the step now directs the reader to the single install recipe and records that pruning is what `npm update` does here

### Removed
- The endpoint handler module of the retired route, superseded by `handlers/welcomeHandler.js`
- The mirrored unit test of that retired handler, superseded by `__tests__/handlers/welcomeHandler.test.js`
- A second unit test module for the retired endpoint, which required a handler module that has never existed on disk and therefore covered nothing

### Fixed
- The route table required an endpoint handler module absent from the handlers directory, which prevented the server from starting; it now requires `./handlers/welcomeHandler`

### Security
- `jest-junit` pinned at `17.0.0` in the one published install recipe, with the reason recorded: npm's advisory data marks `jest-junit` 9.0.0 - 16.0.0 affected through its `uuid` dependency (GHSA-w5hq-g745-h8pq, "Missing buffer bounds check in v3/v5/v6 when buf is provided", moderate, `uuid` < 11.1.1), where 16.0.0 resolves `uuid` 8.3.2 and 17.0.0 requires `uuid` ^14.0.0. Audited both in a declared scratch tree: 2 moderate findings at 16.0.0, none at 17.0.0
- Recorded the supply-chain gap this service ships with, rather than leaving it implicit: `dotenv`, `jest`, `supertest` and `jest-junit` are required by code and configuration but declared by no manifest, `package-lock.json` carries no integrity hashes, `npm ci` on a clean checkout installs nothing and the service then fails with `Cannot find module 'dotenv'`, and `npm audit` inside the checkout audits the root project alone while every installed package is extraneous to it. Declaring the four packages is out of scope for this change; both READMEs now state each consequence and the scratch audit that can see an advisory

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
