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
# upward resolution serves both the root and src/backend.
#
# jest.config.js names jest-junit as a reporter without a version, so the pin below is the
# authoritative one for this repository: 17.0.0, because jest-junit 9.0.0 through 16.0.0
# depend on a uuid affected by GHSA-w5hq-g745-h8pq (16.0.0 resolves uuid 8.3.2) while 17.0.0
# audits clean. Earlier toolchain notes for this service quote 16.0.0 and label it a
# verification-environment selection rather than a repository requirement; 17.0.0 supersedes
# it and is verified against this configuration — the endpoint gate under Development exits 0
# with 5 suites and 40 tests, and coverage/junit/junit.xml records tests="40". `npm audit` run
# inside this checkout cannot tell the two versions apart: package.json declares nothing, so
# all four packages are extraneous and the audit reports no vulnerabilities at either version.
npm install --no-save jest@29.5.0 supertest@6.3.3 dotenv@16.0.3 jest-junit@17.0.0

# The install creates node_modules/ at the project root and is meant to keep it: dotenv is a
# runtime dependency, so the service does not start without it. A clean checkout is therefore
# not verified by asserting that node_modules/ is absent — after any documented install it is
# present by design. Verify instead that installing and running the suites added nothing to
# the repository: .gitignore keeps node_modules/, coverage/, .env and log files out of version
# control, so `git status --porcelain` stays empty, and a run that touched nothing leaves the
# node_modules/ and coverage/ modification times it started with.
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

`middleware/index.js` applies those three security headers to every response, and they are not
configurable. The policy names no `script-src`, `style-src`, `img-src` or `connect-src`
directive, so each of those falls back to `default-src 'none'`: the page loads no stylesheet,
script or image, and a script running inside the page cannot read the endpoint either.
`fetch`, `XMLHttpRequest` and `navigator.sendBeacon` aimed at `/welcome` are refused by the
document's own policy before any request is dispatched — `fetch` rejects with
`TypeError: Failed to fetch`, `XMLHttpRequest` reports `status 0` and an empty
`getAllResponseHeaders()`, `sendBeacon` returns `true` but delivers nothing, and no request
line appears in the access log. That refusal is the expected behaviour of the policy, not a
defect, and the policy is deliberately left as it is.

A consequence worth knowing before testing by hand: a browser cannot observe the 405 with a
scripted request. Use a **navigation** instead — a form POST is permitted, because
`form-action` does not fall back to `default-src`:

```html
<form method="POST" action="/welcome"><button>POST /welcome</button></form>
```

Submitting it returns the 405 documented below, which the browser shows through its plain-text
viewer because the body is `text/plain`. Outside a browser the equivalent check is
`curl -i -X POST http://localhost:3000/welcome`.

### Error Responses

**404 Not Found**

Returned when requesting a non-existent endpoint.

```
HTTP/1.1 404 Not Found
Content-Type: text/plain

Not Found
```

**405 Method Not Allowed**

Returned when a registered endpoint is requested with a method it does not allow — that is,
any method other than `GET` that Node's HTTP parser accepts and dispatches to the application.
The accepted set is `require('http').METHODS` (35 tokens on Node 22.x), and every one of them
except `GET` and `CONNECT` reaches `handlers/welcomeHandler.js`, fails its `isGetMethod`
guard, and is answered by `errorHandler.handle405` with the response below — `HEAD`, `OPTIONS`
and `TRACE` included.

```
HTTP/1.1 405 Method Not Allowed
Content-Type: text/plain
Allow: GET

Method Not Allowed
```

Two kinds of request never reach `server.js`, so the runtime answers them instead of this
contract:

- A method token outside `http.METHODS` — `FROBNICATE`, `FOO`, or even lowercase `get` — is
  rejected by the HTTP parser with a bare `400 Bad Request` and `Connection: close`: empty
  body, no `Allow` header, none of the three security headers, and no line in the access log.
  Answering these with a 405 would require an insecure or custom HTTP parser, which this
  service does not use.
- `CONNECT` is a tunnel request, which Node emits separately from ordinary requests. With no
  tunnel listener installed, the connection is closed without a response (curl reports
  `Empty reply from server`) and nothing is logged.

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

# Run every suite. This exits 1: 10 suites, 5 passing and 5 failing; 86 tests, 68 passing and
# 18 failing. The failing suites are config, index, router, server and utils/logger, and every
# failure is pre-existing and unrelated to the /welcome endpoint — the inventory below names
# each one with its cause.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand

# Coverage report. Both per-file thresholds are met — handlers/welcomeHandler.js at 100% on
# all four metrics and handlers/error.js at its 90/100/90/90 — so the only threshold messages
# are three global ones: statements 78.59% against 85, lines 78.84% against 85 and functions
# 77.19% against 90. The global branch threshold is met, at 82.2% against 80. Those three are
# why this exits 1.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand --coverage

# Re-run on change. Interactive, so it does not exit on its own.
npx jest --config jest.config.js --rootDir . --watch
```

### Pre-existing test failures

All 18 failing tests predate the `/welcome` rename and are unchanged by it: none asserts
anything about the endpoint, and each fails inside a shared module or a suite whose repair is
outside this service's scope. The list is worth keeping exact rather than counting failures,
because a new failure can otherwise hide behind an inherited one.

| Suite | Test | Cause |
|---|---|---|
| `utils/logger.test.js` | `debug method should log debug messages to console.debug when in development environment` | `TypeError: debug is not a function` — not exported |
| `utils/logger.test.js` | `debug method should not log debug messages when not in development environment` | `TypeError: debug is not a function` — not exported |
| `utils/logger.test.js` | `request method should log HTTP request information to console.log` | `TypeError: request is not a function` — not exported |
| `utils/logger.test.js` | `response method should log HTTP response information to console.log` | `TypeError: response is not a function` — not exported |
| `utils/logger.test.js` | `info method should log informational messages to console.log with proper formatting` | Console assertion, `Received number of calls: 0` — `IS_TEST` suppression plus log-format mismatch |
| `utils/logger.test.js` | `warn method should log warning messages to console.warn with proper formatting` | Same as above |
| `utils/logger.test.js` | `error method should log error messages to console.error with proper formatting` | Same as above |
| `utils/logger.test.js` | `error method should log Error objects to console.error with message and stack trace` | Same as above |
| `server.test.js` | `should handle errors on the server` | `logger.error` spy sees 0 calls — require-time logger destructure |
| `server.test.js` | `should start the server on the configured port and host` | `logger.logServerStart` spy sees 0 calls — same cause; the `listen` assertion above it passes |
| `server.test.js` | `should stop the server gracefully` | `logger.logServerStop` spy sees 0 calls — same cause; the `close` assertion above it passes |
| `server.test.js` | `should reject the promise if server fails to stop` | `logger.error` spy sees 0 calls — same cause |
| `server.test.js` | `should reject the promise if server fails to start` | Promise resolves instead of rejecting — the `listen` callback ignores its argument |
| `index.test.js` | `should initialize and start the server successfully` | `TypeError: Cannot read properties of undefined (reading 'mockReturnValue')` — `createServer` is not exported |
| `index.test.js` | `should handle errors during server creation` | Same as above |
| `index.test.js` | `should handle errors during server startup` | Same as above |
| `index.test.js` | `should export the server instance` | Same as above |
| `router.test.js` | `should handle URL parsing errors gracefully` | `TypeError: The "url" argument must be of type string` at `router.js:48` — `route()` has no `try`/`catch` |

The logger and server groups are the two easiest to misattribute, so their causes are stated
in full:

- **Absent logger exports.** `utils/logger.js` exports `info`, `warn`, `error`,
  `logServerStart`, `logServerStop` and `logRequest`. The suite also calls `debug`, `request`
  and `response`, which do not exist, so those four tests throw before asserting anything.
- **`IS_TEST` suppression and the log format.** The other four logger tests call methods that
  *are* exported, so they do not throw; they fail their console assertions with zero calls,
  because `log()` returns early when `IS_TEST` — `config.js` derives it from
  `NODE_ENV === 'test'`, which Jest sets — so nothing reaches the console under Jest.
  Removing the suppression alone would not make them pass: the emitted line takes the form
  `[<ISO timestamp>] INFO: Test info message`, while the suite's regex requires
  `[<ISO timestamp>] [INFO] Test info message`.
- **Require-time destructuring in `server.js`.** `server.js` destructures the logger's
  functions at require time, so the module holds direct references and a later
  `jest.spyOn(logger, …)` on the exported object cannot intercept them — hence four lifecycle
  tests seeing zero calls. The `http.createServer` spy is *not* the problem: it survives the
  `clearMocks` / `resetMocks` / `restoreMocks` settings (Jest applies those before user
  `beforeEach` hooks), and the `mockServer.listen` and `mockServer.close` assertions in those
  same tests pass. The mock-reset settings are still load-bearing elsewhere — they are why the
  request-handling block in `server.test.js` must reinstate its handler implementation in a
  `beforeEach`. The fifth lifecycle failure is unrelated to mocking: `startServer`'s `listen`
  callback takes no error argument, so a listen failure never reaches the promise and the test
  gets a resolved promise where it expects a rejection.

`__tests__/config.test.js` contributes none of the 18 names: it fails to load with
`Cannot find module '../../config'` — a wrong require depth — so it registers no tests, while
still counting as one of the five failing suites.

### Coverage

Both per-file thresholds in `jest.config.js` are met: `handlers/welcomeHandler.js` at
100/100/100/100 and `handlers/error.js` at its 90/100/90/90. Three of the four global
thresholds (85 statements / 80 branches / 85 lines / 90 functions) are not: statements reach
78.59%, lines 78.84% and functions 77.19%. The branch threshold is met, at 82.2% against 80.
The shortfall is a function of which suites load rather than of anything in the `/welcome`
endpoint. Measured:

| File | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| `index.js` | 23.07 | 50 | 0 | 23.07 |
| `config.js` | 81.15 | 70.45 | 100 | 81.15 |
| `middleware/index.js` | 82.5 | 61.53 | 100 | 84.61 |
| `server.js` | 89.55 | 91.3 | 100 | 89.55 |
| `__tests__/setup.js` | 0 | 100 | 0 | 0 |
| `router.js`, `errorHandler.js`, `handlers/error.js`, `handlers/welcomeHandler.js`, `utils/constants.js`, `utils/logger.js` | 100 | 100 | 100 | 100 |

`index.js` is not at zero — `__tests__/integration/api.test.js` requires it, so its
module-level statements run — and `router.js` is not partly covered but complete, because
`router.test.js` mocks the logger with a factory that supplies `request`, letting four of its
five tests execute every line and branch of the module. `config.js` loads in every suite that
loads at all, since `logger.js`, `server.js` and `middleware/index.js` all require it. The
largest single drag is `__tests__/setup.js`: `jest.config.js` declares no `setupFiles`, so it
is never loaded, yet `collectCoverageFrom` still collects it and it reports 0%.

### Retired-path references kept in the suites

`__tests__/handlers/error.test.js` keeps two `url: '/hello'` fixtures — one in the **405** test
(`handleMethodNotAllowed`, line 68) and one in the **500** test (`handleServerError`, line
105). They stand for an arbitrary request URL rather than a route, and the retirement of
`/hello` makes them more accurate, not less, so both are deliberate keeps. The **404** test in
the same file uses `url: '/unknown'` (line 37).

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