/**
 * Server Module
 * 
 * Implements a Node.js HTTP server that exposes a single REST endpoint '/welcome'
 * which serves a Welcome screen to clients. This module contains the core server
 * implementation, including server creation, request routing, and error handling.
 * 
 * @module server
 */

// Import Node.js built-in modules
const http = require('http'); // native

// Import configurations
const { PORT, HOST } = require('./config');

// Import shared constants
const { ROUTES } = require('./utils/constants');

// Import logger
const { info, warn, error, logServerStart, logServerStop } = require('./utils/logger');

// Import handlers
const { handleWelcomeRequest } = require('./handlers/welcomeHandler');
const { handleNotFound, handleServerError } = require('./handlers/error');

// Import middleware
const { requestLogger, securityHeaders, applyMiddleware } = require('./middleware/index');

// Server instance reference
let server = null;

// Wire responses for requests that fail before they reach the application,
// keyed by the code Node reports with 'clientError'. Registering a
// 'clientError' listener overrides the server's default reply entirely, so the
// listener has to emit these itself or a rejected client would receive nothing
// at all. The mapping and the byte layout match Node's own defaults exactly, so
// the status a client sees is unchanged.
const PARSER_ERROR_RESPONSES = {
  HPE_HEADER_OVERFLOW: 'HTTP/1.1 431 Request Header Fields Too Large\r\nConnection: close\r\n\r\n',
  HPE_CHUNK_EXTENSIONS_OVERFLOW: 'HTTP/1.1 413 Payload Too Large\r\nConnection: close\r\n\r\n',
  ERR_HTTP_REQUEST_TIMEOUT: 'HTTP/1.1 408 Request Timeout\r\nConnection: close\r\n\r\n'
};

// Sent for every other client error, as Node's default does
const DEFAULT_PARSER_ERROR_RESPONSE = 'HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n';

// Substituted when a client error carries no code, so the record always names
// one. Deliberately not spelled as an 'HPE_' code: llhttp defines no
// HPE_UNKNOWN, and inventing one would make the record claim the parser
// reported something it never did.
const UNKNOWN_CLIENT_ERROR_CODE = 'UNKNOWN';

// Transport-level codes Node also surfaces through 'clientError'. None of these
// is a protocol violation — the peer went away or stalled mid-message — so a
// record naming the parser would attribute a client's own disconnect to a
// malformed request and let an unauthenticated client inflate the
// malformed-request rate an operator alerts on.
const TRANSPORT_ERROR_CODES = new Set([
  'ECONNRESET', // peer reset the connection
  'ECONNABORTED', // peer aborted before the message completed
  'EPIPE', // peer closed the read side while a reply was pending
  'ETIMEDOUT', // transport-level timeout on the socket
  'ECANCELED', // pending socket operation cancelled as the peer went away
  'HPE_INVALID_EOF_STATE' // llhttp: the stream ended mid-message (a truncated
                          // or abandoned request), not an invalid byte
]);

// Node's own request-level timeout, which is neither a parser rejection nor a
// transport failure: a well-formed message simply never arrived in full inside
// the server's headers/request timeout window.
const TIMEOUT_ERROR_CODES = new Set(['ERR_HTTP_REQUEST_TIMEOUT']);

// How a 'clientError' is described in its record. The kind is decided from the
// error code so that each record states what actually happened.
const CLIENT_ERROR_KINDS = {
  PARSER: 'Malformed request rejected by parser',
  TRANSPORT: 'Client connection failed before the request completed',
  TIMEOUT: 'Request timed out before a complete request arrived',
  OTHER: 'Request rejected at the connection boundary'
};

// llhttp prefixes every parser error code with this
const PARSER_ERROR_CODE_PREFIX = 'HPE_';

// Character code of '/', which marks an origin-form request target
const FORWARD_SLASH = 0x2f;

// Absolute-form request target ('http://host/welcome'), which RFC 9112 §3.2.2
// requires a server to accept: a scheme followed by '://'.
const ABSOLUTE_FORM_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//;

/**
 * Creates a mapping of URL paths to their handler functions
 * 
 * @returns {Object} Object mapping paths to handler functions
 */
function createRoutes() {
  return {
    [ROUTES.WELCOME]: handleWelcomeRequest
  };
}

/**
 * Resolves the path a client-controlled request target addresses
 *
 * Only the path is needed: the dispatcher matches it against the route table by
 * exact object key, so the query and fragment are discarded and nothing is
 * normalized. Each request-target form of RFC 9112 §3.2 is handled explicitly:
 *
 * - **origin-form** (`/welcome?x=1`), what every ordinary client sends. The
 *   path is taken verbatim up to the first `?` or `#`. It is deliberately left
 *   unnormalized — no dot-segment resolution, no trailing-slash folding, no
 *   case or separator rewriting — because normalizing here would silently widen
 *   the route table to alternate spellings such as `/foo/../welcome`.
 * - **absolute-form** (`http://host/welcome`), which §3.2.2 requires a server
 *   to accept. The target is validated with the WHATWG `URL` parser, which
 *   rejects a malformed authority by throwing `TypeError [ERR_INVALID_URL]`;
 *   the path is then taken from the raw target so absolute-form and
 *   origin-form match identically.
 * - **asterisk-form** (`*`) and **authority-form** (`host:443`) address the
 *   server rather than a resource, so they are returned as-is: they match no
 *   route and are answered by the not-found handler.
 *
 * The WHATWG parser is used instead of the legacy `url.parse`, which on Node 20
 * and later emits a `DEP0170` deprecation notice for an invalid URL. That
 * notice is written by the runtime straight to stderr, outside the logger's
 * `[<timestamp>] <LEVEL>: <message>` grammar, and it carries the process id and
 * the client's malformed target — two unparseable records an unauthenticated
 * client could trigger. Nothing in this module reaches the legacy parser now.
 *
 * @param {string} target - Raw request target (`req.url`)
 * @returns {string} Path to match against the route table
 * @throws {TypeError} ERR_INVALID_URL when an absolute-form target is malformed
 */
function resolveRequestPathname(target) {
  if (typeof target !== 'string') {
    // Node supplies a string target for every parsed request; an absent one
    // addresses no route and is answered as a not-found path
    return '';
  }

  // Drop the query and the fragment before anything else, so a value inside
  // them can never be mistaken for part of the path
  const queryIndex = target.indexOf('?');
  const fragmentIndex = target.indexOf('#');
  let pathEnd = queryIndex;

  if (pathEnd === -1 || (fragmentIndex !== -1 && fragmentIndex < pathEnd)) {
    pathEnd = fragmentIndex;
  }

  const path = pathEnd === -1 ? target : target.slice(0, pathEnd);

  // origin-form: the common case, matched verbatim
  if (path.charCodeAt(0) === FORWARD_SLASH) {
    return path;
  }

  // absolute-form: validate the whole target, then read the path from it
  if (ABSOLUTE_FORM_PATTERN.test(path)) {
    // Throws TypeError [ERR_INVALID_URL] for a malformed authority such as
    // 'http://[::1', which the caller records and answers as a 404
    new URL(target);

    const pathStart = path.indexOf('/', path.indexOf('://') + 3);

    return pathStart === -1 ? '/' : path.slice(pathStart);
  }

  // asterisk-form, authority-form or an unrecognised target: no route
  return path;
}

/**
 * Routes incoming HTTP requests to the appropriate handler based on the URL path
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function routeRequest(req, res) {
  // Resolve the path from the request target
  //
  // The target is client-controlled, and a malformed absolute-form value such
  // as 'http://[' makes the URL parser throw TypeError [ERR_INVALID_URL]. Left
  // unguarded that became a 500 whose log record carried a stack trace with
  // absolute filesystem paths and the middleware chain, so the failure is
  // contained here instead.
  let pathname;

  try {
    pathname = resolveRequestPathname(req.url);
  } catch (err) {
    // Record the rejection by its error code alone — no client-controlled
    // bytes, so the record is bounded and cannot carry injected content
    warn(`Malformed request target rejected: ${err.code || err.name}`);

    // A target that cannot be parsed addresses no route, so it is answered the
    // same way as any unregistered path
    handleNotFound(req, res);
    return;
  }
  
  // Get the routes mapping
  const routes = createRoutes();
  
  // Get the handler for this path, if it exists
  const handler = routes[pathname];
  
  // If a handler exists for this path, call it
  if (handler) {
    handler(req, res);
  } else {
    // Otherwise, handle as a 404 Not Found
    handleNotFound(req, res);
  }
}

/**
 * Main request handler function that applies middleware and routes the request
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleRequest(req, res) {
  try {
    // Create an array of middleware functions
    const middlewares = [requestLogger, securityHeaders];
    
    // Apply middleware to the routeRequest function
    const handler = applyMiddleware(routeRequest, middlewares);
    
    // Call the enhanced handler
    handler(req, res);
  } catch (err) {
    // Handle any errors that occur during request processing
    handleServerError(req, res, err);
  }
}

/**
 * Classifies a 'clientError' by its error code
 *
 * Node raises 'clientError' for three unrelated situations, and the record has
 * to tell them apart. The parser rejects a malformed request line, an unknown
 * method token, an unsupported version or an oversized header (an `HPE_` code);
 * the transport fails when the peer resets or half-closes the connection
 * mid-message (`ECONNRESET` and friends, and llhttp's `HPE_INVALID_EOF_STATE`,
 * which reports a truncated stream rather than an invalid byte); and the
 * server's own timeout fires when a complete request never arrives.
 *
 * Labelling all three as parser rejections lets an unauthenticated client
 * manufacture a false malformed-request signal simply by disconnecting, so the
 * transport and timeout cases are checked before the `HPE_` prefix.
 *
 * @param {string} code - Error code carried by the clientError
 * @returns {string} One of CLIENT_ERROR_KINDS, describing what happened
 */
function classifyClientError(code) {
  // Checked first: HPE_INVALID_EOF_STATE carries the parser prefix but reports
  // a connection that ended mid-message, not a protocol violation
  if (TRANSPORT_ERROR_CODES.has(code)) {
    return CLIENT_ERROR_KINDS.TRANSPORT;
  }

  if (TIMEOUT_ERROR_CODES.has(code)) {
    return CLIENT_ERROR_KINDS.TIMEOUT;
  }

  if (code.startsWith(PARSER_ERROR_CODE_PREFIX)) {
    return CLIENT_ERROR_KINDS.PARSER;
  }

  // A code Node introduced since, or an error carrying none at all: named
  // without a claim about its cause
  return CLIENT_ERROR_KINDS.OTHER;
}

/**
 * Answers and records a request that failed at the connection boundary
 *
 * Node raises 'clientError' before any request object exists, so neither the
 * middleware chain nor the dispatcher runs and the access record is never
 * written. Without this listener such a request is answered but leaves no trace
 * at all, and a client can drive unlimited rejections invisibly.
 *
 * The record names what happened (see classifyClientError), the error code, and
 * the response only when this listener actually wrote one — two of the three
 * branches below send nothing, and claiming a status on those let a client
 * fabricate a 400-rate signal out of connections the server never answered. No
 * client-controlled byte is logged, so the record stays bounded and carries no
 * injected content or credential.
 *
 * Because there is no request or response object at this point, the reply must
 * be written straight to the socket as a complete HTTP message.
 *
 * @param {Error} err - Client error, carrying a code such as HPE_INVALID_METHOD or ECONNRESET
 * @param {net.Socket} socket - Socket the failed request arrived on
 */
function handleClientError(err, socket) {
  // The code is both interpolated into the record and tested for the parser
  // prefix, and a throw inside a 'clientError' listener would take the process
  // down, so anything that is not a non-empty string is normalised here
  const code = err && typeof err.code === 'string' && err.code.length > 0
    ? err.code
    : UNKNOWN_CLIENT_ERROR_CODE;

  const response = PARSER_ERROR_RESPONSES[code] || DEFAULT_PARSER_ERROR_RESPONSE;

  // The status line's code, for the log record
  const statusCode = response.slice(9, 12);
  const kind = classifyClientError(code);

  if (!socket || socket.destroyed) {
    // Nothing is left to answer on; the peer is already gone
    warn(`${kind}: ${code} - no response sent, connection already closed`);
    return;
  }

  // Match Node's own guard: only reply when nothing has been written yet, so a
  // response already in flight cannot be corrupted
  if (socket.writable && socket.bytesWritten === 0) {
    socket.end(response);
    warn(`${kind}: ${code} - responded ${statusCode}`);
    return;
  }

  // The socket can no longer be written to, or a reply is already on the wire
  // and a second one would corrupt it
  socket.destroy();
  warn(`${kind}: ${code} - no response sent, connection destroyed`);
}

/**
 * Creates and starts the HTTP server on the specified host and port
 * 
 * @returns {Promise<http.Server>} Promise that resolves with the server instance when started
 */
function startServer() {
  return new Promise((resolve, reject) => {
    try {
      // Create an HTTP server with the handleRequest function
      server = http.createServer(handleRequest);
      
      // Handle server errors
      server.on('error', (err) => {
        error('Server error', err);
        reject(err);
      });
      
      // Answer and record requests the HTTP parser rejects, which never reach
      // handleRequest and so are otherwise absent from the log entirely
      server.on('clientError', handleClientError);
      
      // Start listening on the specified host and port
      server.listen(PORT, HOST, () => {
        // Log successful server start
        logServerStart(HOST, PORT);
        
        // Resolve the promise with the server instance
        resolve(server);
      });
    } catch (err) {
      // Log and reject if an error occurred during startup
      error('Error starting server', err);
      reject(err);
    }
  });
}

/**
 * Gracefully stops the HTTP server, closing all connections
 * 
 * @returns {Promise<void>} Promise that resolves when the server has stopped
 */
function stopServer() {
  return new Promise((resolve, reject) => {
    try {
      // If server is null or not listening, resolve immediately
      if (!server || !server.listening) {
        resolve();
        return;
      }
      
      // Close the server
      server.close((err) => {
        if (err) {
          // Log and reject if an error occurred during shutdown
          error('Error stopping server', err);
          reject(err);
          return;
        }
        
        // Log successful server stop
        logServerStop();
        
        // Reset server reference
        server = null;
        
        // Resolve the promise
        resolve();
      });
    } catch (err) {
      // Log and reject if an error occurred during shutdown
      error('Error stopping server', err);
      reject(err);
    }
  });
}

// Export the server functions
module.exports = {
  startServer,
  stopServer
};