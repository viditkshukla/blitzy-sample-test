# Node.js Hello World Service

A simple Node.js HTTP server application that exposes a single REST endpoint `/welcome` which serves a Welcome screen to clients.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Overview

This project demonstrates fundamental Node.js web service concepts with minimal complexity. It serves as an educational tool and reference implementation for basic HTTP server functionality in Node.js.

The application provides a minimal, functional example of a Node.js web service that can serve as a learning tool or starter template for developers new to Node.js or as a reference implementation for more complex services.

## Features

- HTTP server implementation in Node.js
- Single `/welcome` endpoint serving a Welcome screen as HTML
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
git clone <repository-url>
cd src/backend

# `npm install` on its own installs nothing: this directory has no package.json, so npm
# resolves the root manifest, which declares no dependencies. Install the runtime dependency
# (dotenv) and the test tooling explicitly; --no-save leaves package.json and
# package-lock.json untouched, and node_modules is created at the project root, where Node's
# upward resolution serves both the root and src/backend.
#
# The command below is the one place this repository publishes a jest-junit version, and
# that version is 17.0.0. jest.config.js names the reporter as a bare module string, which
# Jest resolves through require and which cannot carry a version, so its comment points back
# here rather than repeating a figure that could drift. The pin is on security grounds: npm's
# advisory data marks jest-junit 9.0.0 - 16.0.0 as affected through uuid — GHSA-w5hq-g745-h8pq,
# "uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided", moderate, uuid
# < 11.1.1 — where 16.0.0 resolves uuid 8.3.2 and 17.0.0 requires uuid ^14.0.0. Verified
# against this configuration: the endpoint gate under Development exits 0 and jest-junit
# writes coverage/junit/junit.xml.
#
# Nothing enforces that pin. `npm audit` run inside this checkout cannot check it either:
# package.json declares nothing, so all four packages are extraneous and the audit reports no
# vulnerabilities at any version of them. Earlier toolchain notes for this service quote
# jest-junit 16.0.0 and label it a verification-environment selection rather than a repository
# requirement; 17.0.0 supersedes it. A tree provisioned from those notes carries uuid 8.3.2
# unreported: `node -p "require('jest-junit/package.json').version"` and `npm ls uuid` show
# what is actually installed, the command below replaces it, and the scratch audit under
# Security Audit is what sees the advisory — 2 moderate findings at 16.0.0, none at 17.0.0.
npm install --no-save jest@29.5.0 supertest@6.3.3 dotenv@16.0.3 jest-junit@17.0.0

# The install creates node_modules/ at the project root and is meant to keep it: dotenv is a
# runtime dependency, so the service does not start without it. A clean checkout is therefore
# not verified by asserting that node_modules/ is absent — after any documented install it is
# present by design. Verify instead that installing and running the suites added nothing to
# the repository: .gitignore keeps node_modules/, coverage/, .env and log files out of version
# control, so `git status --porcelain` stays empty, and a run that touched nothing leaves the
# node_modules/ and coverage/ modification times it started with.
```

### Docker Installation

```bash
git clone <repository-url>
cd src/backend

# This build cannot complete in the current repository. src/backend/Dockerfile copies
# package*.json — a glob that matches nothing here, which Docker tolerates — and then runs
# `npm ci`, which fails with npm error code EUSAGE ("can only install with an existing
# package-lock.json"), because this directory holds no manifest and no lockfile. Supplying
# them is outside the scope of this service; use the local start command under Usage instead.
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
cd src/backend

# `npm start` is not defined: package.json declares no `start` script, so npm falls back to
# its own default, `node server.js`, and launches the root demo server on port 3000 instead
# of this service. Start the service directly; PORT, HOST, NODE_ENV and LOG_LEVEL are all
# optional and default to 3000, 0.0.0.0, development and INFO.
PORT=3000 node index.js

# Automatic restart on change is unavailable: `npm run dev` is not defined in any manifest
# and nodemon is not installed, so nodemon.json currently has nothing to drive it.
```

### Running with Docker

```bash
docker run -p 3000:3000 node-hello-world
```

### Running with Docker Compose (includes monitoring)

```bash
cd infrastructure

# This stack does not come up in the current repository. The only Compose file lives one
# level further down, at infrastructure/local/docker-compose.yml, so this command finds no
# configuration here; that file defines a single application service and no Prometheus or
# Grafana service; its build uses the root Dockerfile blocked above; and its
# `command: npm run dev` names a script no manifest defines. Prometheus and Grafana are
# configuration-only, under infrastructure/monitoring.
docker-compose up -d
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
├── infrastructure/        # Deployment and infrastructure files
│   ├── local/             # Local Docker Compose stack
│   │   └── docker-compose.yml # Docker Compose configuration
│   ├── monitoring/        # Prometheus and Grafana configuration
│   ├── scripts/           # Deployment and utility scripts
│   └── README.md          # Infrastructure documentation
├── src/
│   └── backend/           # Node.js application code
│       ├── __tests__/     # Test files
│       ├── handlers/      # Request handlers
│       ├── middleware/    # Middleware functions
│       ├── utils/         # Utility functions
│       ├── config.js      # Application configuration
│       ├── errorHandler.js # Shared 404/405/500 responses
│       ├── index.js       # Application entry point
│       ├── router.js      # Standalone dispatcher, not used by server.js
│       └── server.js      # Native HTTP server implementation
├── CODE_OF_CONDUCT.md     # Contributor code of conduct
├── CONTRIBUTING.md        # Contribution guidelines
├── Dockerfile             # Docker build for the backend service
├── LICENSE                # MIT license file
├── package.json           # Package manifest: no dependencies, placeholder test script
├── package-lock.json      # Lockfile mirroring that empty dependency set
├── server.js              # Standalone demo server, not the /welcome service
└── README.md              # This documentation file
```

For more detailed information about the backend structure, see [src/backend/README.md](src/backend/README.md).

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

The three security headers are applied to every response by the security middleware and are
not configurable. The policy names no `script-src`, `style-src`, `img-src` or `connect-src`
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
except `GET` and `CONNECT` produces the response below, `HEAD`, `OPTIONS` and `TRACE`
included.

```
HTTP/1.1 405 Method Not Allowed
Content-Type: text/plain
Allow: GET

Method Not Allowed
```

Two kinds of request never reach the application, so the runtime answers them instead of this
contract:

- A method token outside `http.METHODS` — `FROBNICATE`, `FOO`, or even lowercase `get` — is
  rejected by the HTTP parser with a bare `400 Bad Request` and `Connection: close`: empty
  body, no `Allow` header, none of the three security headers, and no line in the access log.
- `CONNECT` is a tunnel request, which Node surfaces separately from ordinary requests. With
  no tunnel listener installed, the connection is closed without a response (curl reports
  `Empty reply from server`) and nothing is logged.

## Implementation Details

This project provides two server implementations:

1. **Native HTTP Module** (`server.js`): Uses Node.js built-in HTTP module without additional frameworks.

2. **Express.js** (`server-express.js`): Uses the Express.js framework for simplified routing and middleware.

By default, the application uses the native HTTP implementation. To use the Express implementation, modify the `index.js` file to import from `server-express.js` instead of `server.js`.

### Key Components

- **HTTP Server**: Lightweight Node.js server handling incoming HTTP requests
- **Request Router**: Directs incoming requests to appropriate handlers based on URL path
- **Welcome Handler**: Processes requests to `/welcome` endpoint and generates responses
- **Error Handler**: Manages error conditions and generates appropriate error responses
- **Middleware**: Provides logging, security headers, and other cross-cutting concerns

### Request Logging

Every record follows one grammar, `[<ISO timestamp>] <LEVEL>: <message>`, and is written to
stdout (`INFO`), stderr (`ERROR`) or the console's warning stream (`WARN`). One request
produces exactly one **access record**, emitted when the response ends:

```
[2026-01-01T00:00:00.000Z] INFO: GET /welcome 200 1ms
[2026-01-01T00:00:00.000Z] WARN: GET /hello 404 0ms
```

The four fields are the method, the request target, the status code and the elapsed time. The
level follows the status: `INFO` for 2xx, `WARN` for 4xx, `ERROR` for 5xx.

The request target is the only client-controlled value in the log, so it is the only one that
is sanitized, and it is sanitized at the single point that writes it:

- **Query strings and fragments are redacted, not recorded.** Everything from the first `?` or
  `#` is replaced by the fixed marker `?[redacted]`, so `GET /welcome?token=abc123` is
  recorded as `GET /welcome?[redacted] 200 0ms`. The presence of a query stays visible to an
  operator while its values never reach the log — query parameters routinely carry tokens,
  passwords, API keys and session identifiers (CWE-532, insertion of sensitive information
  into log data).
- **The target is length-capped.** The retained path is truncated at 256 characters with the
  marker `...[truncated]`, so one caller cannot inflate a record without bound (CWE-779). A
  7 000-character request path yields a 326-character record instead of a 7 066-character one.
- **The target is recorded once per request.** The 404, 405 and 500 error records name the
  request *method* only and leave the target to the access record, so no client-controlled
  value is written twice. A request to an unregistered path therefore logs
  `WARN: Not Found: GET` alongside the access record above.

An ordinary target — no query, no fragment, within the cap — is recorded verbatim, so the
access record for the endpoint reads exactly `GET /welcome 200 1ms`. Requests rejected before
they reach the application are recorded by the connection-boundary listener, which logs the
parser's own error code and no client bytes at all.

## Development

### Running Tests

```bash
cd src/backend

# `npm test` only runs the placeholder script in package.json, which prints
# "Error: no test specified" and exits 1; `test:coverage` and `test:watch` are not defined at
# all. Invoke Jest directly, after the --no-save install shown under Installation. --runInBand
# is required because the server and integration suites both bind the configured port and
# jest.config.js sets no maxWorkers.

# Run the suites covering the /welcome endpoint and the shared error handlers. Exits 0.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand \
  --testPathPattern "(handlers/welcomeHandler|integration/api|utils/constants|errorHandler|handlers/error)"

# Run every suite. This exits 1: 10 suites, 6 passing and 4 failing; 113 tests, 95 passing and
# 18 failing. Every failure is pre-existing and unrelated to the /welcome endpoint — see
# "Pre-existing test failures" below.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand

# Coverage report. Both per-file thresholds are met — handlers/welcomeHandler.js at 100% on
# all four metrics and handlers/error.js at its 90/100/90/90 — so the only threshold messages
# are the four global ones: statements 80.22% against 85, branches 78.28% against 80, lines
# 80.44% against 85 and functions 77.41% against 90. Those four are why this exits 1. The
# access-record tests take utils/logger.js to 100/95.83/100/100, while the deferred
# notice-drain fallbacks in config.js are unreachable from the suites, so the global branch
# figure stays just under its threshold.
npx jest --config jest.config.js --rootDir . --ci --watchAll=false --runInBand --coverage

# Re-run on change. Interactive, so it does not exit on its own.
npx jest --config jest.config.js --rootDir . --watch
```

### Pre-existing test failures

The 18 failing tests are the same set before and after the `/welcome` rename: none of them
asserts anything about the endpoint, and each fails inside a shared module, or in a suite,
whose repair lies outside this service's scope. By cause, as measured:

- **`__tests__/utils/logger.test.js` — 8 failures in two groups, not one.** Four are
  `TypeError: … is not a function` for methods `utils/logger.js` does not export (`debug`
  twice, `request`, `response`; the module exports `info`, `warn`, `error`, `logServerStart`,
  `logServerStop` and `logRequest`). The other four — `info`, `warn` and both `error` tests —
  fail on their console assertions with `Received number of calls: 0`, because those methods
  *are* exported but `log()` returns early in the test environment, so nothing reaches the
  console under Jest; the emitted `[timestamp] INFO: message` format also does not match the
  `[timestamp] [INFO] message` the suite expects. The nine access-record tests in the same
  file all pass: they load the logger in an isolated module registry against a configuration
  double, which is what lifts the test-environment suppression and makes a record assertable.
- **`__tests__/server.test.js` — 5 lifecycle failures.** Four assert on `logger.error`,
  `logger.logServerStart` or `logger.logServerStop` and see zero calls, because `server.js`
  destructures those functions at require time, so spying on the logger object afterwards
  cannot intercept the references the module captured. The fifth expects a rejected promise
  and gets a resolved one, because `startServer`'s `listen` callback ignores its argument. The
  `http.createServer` spy is unaffected by the mock-reset settings, and the `listen` and
  `close` assertions in these same tests pass.
- **`__tests__/index.test.js` — 4 failures.** The suite mocks `createServer` and
  `setupGracefulShutdown`, which `server.js` does not export, so the mock is `undefined`
  (`TypeError: Cannot read properties of undefined (reading 'mockReturnValue')`).
- **`__tests__/router.test.js` — 1 failure.** `route()` has no `try`/`catch`, so parsing an
  undefined URL throws where the test expects it to be handled.

`__tests__/config.test.js` is no longer among the failing suites. Its require depth is
corrected, so the suite loads and all 15 of its cases pass; four suites fail, not five.

The remaining global coverage shortfall follows from which suites load, not from the rename:
`index.js` covers 23.07%, `config.js` 78.26% of statements but only 66.1% of branches,
`middleware/index.js` 93.54% of lines but only 66.66% of branches, and the never-loaded
`__tests__/setup.js` sits at 0% while still being collected. `router.js`,
`utils/constants.js`, `errorHandler.js`, `handlers/error.js`, `handlers/welcomeHandler.js`
and `utils/logger.js` are all at 100% of statements and lines, and `server.js` at 91.66%.

Two `url: '/hello'` fixtures are kept deliberately in `__tests__/handlers/error.test.js` — one
in the 405 test and one in the 500 test. They describe an arbitrary request URL rather than a
route, and the retired path makes them more accurate, not less; the 404 test in the same file
uses `url: '/unknown'`. Both fixtures now also serve as assertions that the record does *not*
echo them. See [src/backend/README.md](src/backend/README.md) for the per-test detail.

### Linting

```bash
# No lint gate exists: this repository contains no ESLint or Prettier configuration and
# declares no lint dependency, so `npm run lint` and `npm run lint:fix` are not defined. The
# available static check is a syntax pass over every source file, from the project root.
for f in $(find src -name '*.js' -not -path '*/node_modules/*' -not -path '*/coverage/*'); do node --check "$f" || echo "SYNTAX FAIL $f"; done
```

### Security Audit

```bash
# `npm run audit` and `npm run audit:fix` are not defined. npm's built-in audit runs from the
# project root and reports on declared dependencies only: package.json declares none, so it
# audits the root package alone. It prints "found 0 vulnerabilities" while 309 packages sit in
# node_modules, and `npm audit --json` shows why — "dependencies":{"prod":1,...,"total":0}.
# Every package installed with --no-save above is extraneous and invisible to it.
npm audit

# What does cover them: declare the same four versions in a scratch package.json outside this
# checkout and audit there. At the pinned versions this reports no vulnerabilities; substitute
# jest-junit 16.0.0 and it reports 2 moderate, both GHSA-w5hq-g745-h8pq through uuid 8.3.2.
probe=$(mktemp -d) && cd "$probe"
printf '{"name":"audit-probe","version":"1.0.0","private":true,"dependencies":{"dotenv":"16.0.3"},"devDependencies":{"jest":"29.5.0","supertest":"6.3.3","jest-junit":"17.0.0"}}' > package.json
npm install --no-audit --no-fund > /dev/null && npm audit
```

**Known gap — nothing declares the packages this service needs.** `dotenv` is a runtime
dependency (`src/backend/config.js` requires it) and `jest`, `supertest` and `jest-junit` are
required by the test configuration, yet `package.json` declares neither a `dependencies` nor a
`devDependencies` block and `package-lock.json` carries no dependency tree at all:
`grep -c integrity package-lock.json` returns `0`. Four reproducible consequences:

- `npm ci` on a clean checkout reports `up to date, audited 1 package` and creates no
  `node_modules` at all, so nothing is installed and no version is fixed by an integrity hash.
- In that state the service cannot start: `node -e "require('./src/backend/config.js')"` fails
  with `Error: Cannot find module 'dotenv'`. The `--no-save` install under Installation is not
  optional convenience — it is how the application gets its runtime dependency.
- `npm audit` has no tree to audit, as above, so an advisory affecting an installed package is
  never reported from inside this checkout.
- `npm update` **removes** the installed tree instead of updating it. With nothing declared,
  every installed package is extraneous and npm prunes it — the command reports
  `removed 309 packages` and the service stops starting. Re-run the `--no-save` install
  to restore it.

Declaring the four packages and committing a populated lockfile is out of scope for the change
that introduced `/welcome`, so the gap is recorded here rather than closed. Until an authorizing
change declares them, the pinned `--no-save` command under Installation is this repository's
only statement of the intended versions, and the scratch audit above is the only way to audit
them.

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