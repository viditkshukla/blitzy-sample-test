/**
 * Error Handler Module
 * 
 * Implements error handling functions for the Node.js HTTP server application.
 * Provides handlers for common HTTP error scenarios including 404 Not Found,
 * 405 Method Not Allowed, and 500 Internal Server Error.
 * 
 * @module error
 */

// Import the logger for recording error information
const { warn, error } = require('../utils/logger');

/**
 * Placeholder written in place of a request field that is absent, empty or not a
 * string. '-' is the conventional "field not present" token of the common access
 * log formats, so an operator reading the record sees a deliberate absence rather
 * than the literal text 'undefined'.
 *
 * @constant {string}
 */
const LOG_FIELD_PLACEHOLDER = '-';

/**
 * Fixed marker appended in place of a stripped query string or fragment. It tells
 * an operator that parameters were present on the request target without carrying
 * any of their names or values into the log.
 *
 * @constant {string}
 */
const REDACTED_QUERY_MARKER = '?[redacted]';

/**
 * Matches every C0 control character, DEL and every C1 control character. These
 * are the code points that can terminate or forge a record in a newline-delimited
 * console sink, or drive a terminal escape sequence when an operator cats the log.
 *
 * @constant {RegExp}
 */
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F-\u009F]/g;

/**
 * Matches the first query or fragment delimiter in a request target. Whichever of
 * '?' and '#' appears first is where the loggable part of the target ends.
 *
 * @constant {RegExp}
 */
const TARGET_DELIMITER_PATTERN = /[?#]/;

/**
 * Renders a single control character as printable text.
 *
 * The three characters with a conventional escape are emitted in that form so the
 * record stays readable; everything else becomes a two-digit lowercase hex escape.
 *
 * @param {string} character - A single control character to render
 * @returns {string} A printable escape sequence, e.g. '\\n' or '\\x1b'
 */
function escapeControlCharacter(character) {
  switch (character) {
    case '\n':
      return '\\n';
    case '\r':
      return '\\r';
    case '\t':
      return '\\t';
    default:
      // Two digits are always enough: the pattern that selects these characters
      // admits nothing above U+009F.
      return `\\x${character.charCodeAt(0).toString(16).padStart(2, '0')}`;
  }
}

/**
 * Makes a request-controlled value safe to concatenate into a log record.
 *
 * Log integrity (CWE-117): the logger writes newline-delimited records to the
 * console, so a CR/LF in a request field would let a caller append or truncate
 * records and forge log entries, and a raw ESC would let it emit terminal control
 * sequences. Every control character is therefore replaced by a printable escape
 * before formatting, never dropped, so the record still shows what arrived.
 *
 * @param {*} value - Candidate field value, of any type
 * @param {string} fallback - Text to use when the value is unusable
 * @returns {string} A control-character-free string, or the fallback
 */
function sanitizeLogValue(value, fallback) {
  // A missing or non-string field (no method on the request, a mock without one)
  // must never reach the sink as 'undefined' or via an implicit coercion.
  if (typeof value !== 'string' || value.length === 0) {
    return fallback;
  }

  return value.replace(CONTROL_CHARACTER_PATTERN, escapeControlCharacter);
}

/**
 * Reduces a raw request target to the part that is safe to persist.
 *
 * Sensitive data exposure (CWE-532): the raw target of a reachable 404/405/500 is
 * attacker- or client-chosen and routinely carries credentials and PII in its
 * query string, e.g. '/missing?access_token=...&email=...'. Writing it verbatim
 * persists those secrets in process and aggregated logs, so the target is cut at
 * the first '?' or '#' and the discarded part is replaced by a single fixed
 * marker: operators still see that parameters existed, but no parameter name or
 * value is retained. The remaining path is then escaped for log integrity.
 *
 * Plain string operations are used deliberately in place of url.parse/new URL:
 * they cannot throw on a malformed target and add no dependency to a module that
 * runs on the failure path.
 *
 * @param {*} rawUrl - The request target as received (req.url), of any type
 * @returns {string} Sanitized path, with the redaction marker when a query or
 *                   fragment was present, or the placeholder when unusable
 */
function sanitizeRequestTarget(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.length === 0) {
    return LOG_FIELD_PLACEHOLDER;
  }

  // Cut at whichever delimiter comes first, so a '#' before a '?' cannot smuggle
  // a query string past the redaction.
  const delimiterIndex = rawUrl.search(TARGET_DELIMITER_PATTERN);

  if (delimiterIndex === -1) {
    return sanitizeLogValue(rawUrl, LOG_FIELD_PLACEHOLDER);
  }

  const path = sanitizeLogValue(rawUrl.slice(0, delimiterIndex), LOG_FIELD_PLACEHOLDER);

  return `${path}${REDACTED_QUERY_MARKER}`;
}

/**
 * Builds the '<method> <target>' fragment shared by all three error records.
 *
 * Every log statement in this module composes its message through this one path,
 * so the privacy and log-integrity guarantees above hold for the 404, 405 and 500
 * records alike and cannot drift apart. The request object is read defensively:
 * an error handler that throws while reporting a failure is a worse outcome than
 * the failure it was called for, so a missing request, or a request missing its
 * method or target, yields the placeholder instead.
 *
 * @param {Object} req - HTTP request object, possibly absent or incomplete
 * @returns {string} Sanitized method and request target, separated by a space
 */
function formatRequestDescriptor(req) {
  // Guard only against null/undefined: property reads on any other value are safe
  // and resolve to undefined, which sanitizeLogValue turns into the placeholder.
  const source = req || {};

  return `${sanitizeLogValue(source.method, LOG_FIELD_PLACEHOLDER)} ${sanitizeRequestTarget(source.url)}`;
}

/**
 * Handles 404 Not Found errors for requests to non-existent paths
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleNotFound(req, res) {
  // Set status code to 404
  res.statusCode = 404;
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Log the not found request with warning level. The method and target are
  // sanitized first: the target's query and fragment are redacted so credentials
  // and PII on an unrouted URL are not persisted (CWE-532), and control
  // characters are escaped so a crafted request cannot forge log records
  // (CWE-117).
  warn(`Not Found: ${formatRequestDescriptor(req)}`);
  
  // Send response body and end the response
  res.end('Not Found');
}

/**
 * Handles 405 Method Not Allowed errors for requests with unsupported HTTP methods
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Array<string>} allowedMethods - Array of allowed HTTP methods
 */
function handleMethodNotAllowed(req, res, allowedMethods) {
  // Set status code to 405
  res.statusCode = 405;
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Set the Allow header to indicate which methods are permitted
  res.setHeader('Allow', allowedMethods.join(', '));
  
  // Log the method not allowed request with warning level. Only the request
  // fields are sanitized (CWE-532, CWE-117); the allowed-method list is supplied
  // by the caller, not by the request, and is logged as-is so it matches the
  // Allow header exactly.
  warn(`Method Not Allowed: ${formatRequestDescriptor(req)} - Allowed methods: ${allowedMethods.join(', ')}`);
  
  // Send response body and end the response
  res.end('Method Not Allowed');
}

/**
 * Handles 500 Internal Server Error for unexpected server-side errors
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Error} err - Error object
 */
function handleServerError(req, res, err) {
  // Set status code to 500
  res.statusCode = 500;
  
  // Set content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Log the server error with error level, including the error details. The
  // request fields are sanitized first: a 500 is exactly the record most likely
  // to be shipped to an aggregator, so the raw target must not carry query
  // secrets into it (CWE-532) or control characters that could forge surrounding
  // records (CWE-117).
  error(`Server Error processing ${formatRequestDescriptor(req)}`, err);
  
  // Send response body with generic message (don't expose error details to client)
  res.end('Internal Server Error');
}

// Export the error handling functions
module.exports = {
  handleNotFound,
  handleMethodNotAllowed,
  handleServerError
};