/**
 * Unit tests for the Hello Endpoint Handler
 * 
 * Tests verify that the handler correctly processes GET requests with 'Hello world' responses
 * and rejects non-GET methods with 405 Method Not Allowed responses.
 */

// Import the handler function to test
const { handleHelloRequest } = require('../../handlers/helloHandler');

// Import constants for assertions
const { 
  HTTP_STATUS,
  MESSAGES,
  HEADERS,
  HTTP_METHODS
} = require('../../utils/constants');

// Import error handler for mocking
const { handle405 } = require('../../errorHandler');

// Import logger for mocking
const logger = require('../../utils/logger');

// Mock the error handler module
jest.mock('../../errorHandler', () => ({
  handle405: jest.fn()
}));

// Mock the logger module
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('handleHelloRequest', () => {
  // Define mock objects
  let req;
  let res;
  
  // Setup before each test
  beforeEach(() => {
    // Create mock request object
    req = {
      method: 'GET' // Default to GET method
    };
    
    // Create mock response object with Jest mock functions
    res = {
      statusCode: null,
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
  });
  
  // Cleanup after each test
  afterEach(() => {
    // Reset all mocks to ensure test isolation
    jest.resetAllMocks();
  });

  // Test case for GET requests
  it("should return 200 OK with 'Hello world' for GET requests", () => {
    // Call the handler with mock request and response
    handleHelloRequest(req, res);
    
    // Verify response status code was set to 200 OK
    expect(res.statusCode).toBe(HTTP_STATUS.OK);
    
    // Verify Content-Type header was set correctly
    expect(res.setHeader).toHaveBeenCalledWith(
      HEADERS.CONTENT_TYPE, 
      HEADERS.CONTENT_TYPE_TEXT
    );
    
    // Verify response body was set to "Hello world"
    expect(res.end).toHaveBeenCalledWith(MESSAGES.HELLO_RESPONSE);
    
    // Verify logger.info was called with appropriate messages
    expect(logger.info).toHaveBeenNthCalledWith(1, 'Handling GET request to /hello endpoint');
    expect(logger.info).toHaveBeenNthCalledWith(2, `Successfully responded with ${HTTP_STATUS.OK} OK and "${MESSAGES.HELLO_RESPONSE}" message`);
    
    // Verify handle405 was not called
    expect(handle405).not.toHaveBeenCalled();
  });
  
  // Test case for non-GET requests
  it('should call handle405 for non-GET requests', () => {
    // Set request method to POST
    req.method = 'POST';
    
    // Call the handler with mock request and response
    handleHelloRequest(req, res);
    
    // Verify handle405 was called with the response object
    expect(handle405).toHaveBeenCalledWith(res);
    
    // Verify response status and headers were not set directly
    // (because handle405 would handle that)
    expect(res.statusCode).toBe(null);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    
    // Verify logger.info and logger.error were called with appropriate messages
    expect(logger.info).toHaveBeenCalledWith('Handling POST request to /hello endpoint');
    expect(logger.error).toHaveBeenCalledWith(`Received unsupported POST method, expected ${HTTP_METHODS.GET}`);
  });
  
  // Test case for isGetMethod function behavior
  it('should correctly identify GET method', () => {
    // Test the behavior of isGetMethod indirectly through handleHelloRequest
    
    // GET should be accepted (isGetMethod returns true)
    req.method = 'GET';
    handleHelloRequest(req, res);
    expect(handle405).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledWith(MESSAGES.HELLO_RESPONSE);
    jest.clearAllMocks();
    res.statusCode = null;
    
    // POST should be rejected (isGetMethod returns false)
    req.method = 'POST';
    handleHelloRequest(req, res);
    expect(handle405).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // PUT should be rejected (isGetMethod returns false)
    req.method = 'PUT';
    handleHelloRequest(req, res);
    expect(handle405).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // DELETE should be rejected (isGetMethod returns false)
    req.method = 'DELETE';
    handleHelloRequest(req, res);
    expect(handle405).toHaveBeenCalled();
  });

  // Characterisation: records every collaborator call and status write, in order, with arguments
  /**
   * Installs ordered recording on the logger, handle405 and the response double, so one trace
   * holds every collaborator call and status write with its exact arguments.
   *
   * @returns {Array} trace - One entry per recorded call or status write, in the order made
   */
  function traceCalls() {
    const trace = [];
    logger.info.mockImplementation((...args) => {
      trace.push(['info', ...args]);
    });
    logger.error.mockImplementation((...args) => {
      trace.push(['error', ...args]);
    });
    handle405.mockImplementation((...args) => {
      trace.push(['handle405', ...args]);
    });
    res.setHeader.mockImplementation((...args) => {
      trace.push(['setHeader', ...args]);
      return res;
    });
    res.end.mockImplementation((...args) => {
      trace.push(['end', ...args]);
    });
    let status = res.statusCode;
    Object.defineProperty(res, 'statusCode', {
      configurable: true,
      get: () => status,
      set: (value) => {
        status = value;
        trace.push(['statusCode', value]);
      }
    });
    return trace;
  }

  // Characterisation: one trace, so a status write moved before the entry log fails this case
  it('should log, set status, header and body, then log success, in that order', () => {
    const trace = traceCalls();
    const result = handleHelloRequest(req, res);

    expect(result).toBeUndefined();
    expect(trace).toEqual([
      ['info', 'Handling GET request to /hello endpoint'],
      ['statusCode', 200],
      ['setHeader', 'Content-Type', 'text/plain'],
      ['end', 'Hello world'],
      ['info', 'Successfully responded with 200 OK and "Hello world" message']
    ]);
    expect(logger.error).not.toHaveBeenCalled();
    expect(handle405).not.toHaveBeenCalled();
  });

  // Characterisation: every stringifiable non-GET method logs and delegates once, writing nothing
  it.each([
    ['POST', { method: 'POST' }, 'POST'],
    ['PUT', { method: 'PUT' }, 'PUT'],
    ['DELETE', { method: 'DELETE' }, 'DELETE'],
    ['HEAD', { method: 'HEAD' }, 'HEAD'],
    ['OPTIONS', { method: 'OPTIONS' }, 'OPTIONS'],
    ['PATCH', { method: 'PATCH' }, 'PATCH'],
    ['lowercase get', { method: 'get' }, 'get'],
    ['mixed-case Get', { method: 'Get' }, 'Get'],
    ['empty string', { method: '' }, ''],
    ['undefined method', { method: undefined }, 'undefined'],
    ['absent method property', {}, 'undefined'],
    ['null method', { method: null }, 'null'],
    ['numeric method', { method: 0 }, '0'],
    ['String object GET', { method: new String('GET') }, 'GET']
  ])('should log and delegate to handle405 once, in order, for %s', (_label, request, shown) => {
    const trace = traceCalls();
    const result = handleHelloRequest(request, res);

    expect(result).toBeUndefined();
    expect(trace).toEqual([
      ['info', `Handling ${shown} request to /hello endpoint`],
      ['error', `Received unsupported ${shown} method, expected GET`],
      ['handle405', res]
    ]);
    expect(handle405.mock.calls[0][0]).toBe(res);
    expect(res.statusCode).toBeNull();
  });

  // Characterisation: the TypeError comes from the entry-log template's read of req.method
  it.each([undefined, null])('should throw a TypeError before side effects for %p', (absent) => {
    expect(() => handleHelloRequest(absent, res)).toThrow(TypeError);
    expect(() => handleHelloRequest(absent, res)).toThrow("(reading 'method')");
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(handle405).not.toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    expect(res.statusCode).toBeNull();
  });

  // Characterisation: an unstringifiable method throws a TypeError before any side effect
  it('should throw a TypeError before side effects for a Symbol method', () => {
    const request = { method: Symbol('GET') };

    expect(() => handleHelloRequest(request, res)).toThrow(TypeError);
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(handle405).not.toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    expect(res.statusCode).toBeNull();
  });

  // Characterisation: the handler has no try/catch, so an error from res.end propagates uncaught
  it('should propagate an error thrown by res.end without logging success', () => {
    res.end.mockImplementation(() => {
      throw new Error('end failed');
    });

    expect(() => handleHelloRequest(req, res)).toThrow('end failed');
    expect(logger.info.mock.calls).toEqual([['Handling GET request to /hello endpoint']]);
    expect(logger.error).not.toHaveBeenCalled();
    expect(handle405).not.toHaveBeenCalled();
  });

  // Characterisation: no error handling exists, so an error from handle405 propagates
  it('should propagate an error thrown by handle405', () => {
    req.method = 'POST';
    handle405.mockImplementation(() => {
      throw new Error('handle405 failed');
    });

    expect(() => handleHelloRequest(req, res)).toThrow('handle405 failed');
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  // Characterisation: why the guard is a bare return: handle405's value must never leak out
  it('should return undefined even when handle405 or res.end return a value', () => {
    handle405.mockReturnValue('handle405 result');
    res.end.mockReturnValue(res);

    expect(handleHelloRequest({ method: 'POST' }, res)).toBeUndefined();
    expect(handleHelloRequest({ method: 'GET' }, res)).toBeUndefined();
  });

  // Characterisation: the export surface server.js and router.js bind to, so it must not grow
  it('should export only handleHelloRequest, taking (req, res)', () => {
    const handlerModule = require('../../handlers/helloHandler');

    expect(Object.keys(handlerModule)).toEqual(['handleHelloRequest']);
    expect(typeof handlerModule.handleHelloRequest).toBe('function');
    expect(handlerModule.handleHelloRequest).toHaveLength(2);
  });

  // Characterisation: a request whose method getter yields a different value on each read
  /**
   * Builds a request whose `method` getter yields the next value of `values` on each read, so
   * the number of reads is observable from the request itself.
   *
   * @param {Array} values - Method values to yield, in read order
   * @returns {Object} request whose method getter yields one value per read
   */
  function accessorRequest(values) {
    const request = { reads: 0 };
    Object.defineProperty(request, 'method', {
      enumerable: true,
      configurable: true,
      get: () => {
        const value = request.reads < values.length ? values[request.reads] : 'EXTRA-READ';
        request.reads += 1;
        return value;
      }
    });
    return request;
  }

  // Characterisation: req.method is read twice; the branch and the error log use the second read
  it.each([
    ['POST', 'POST'],
    ['POST', 'PUT'],
    ['GET', 'POST']
  ])('should read req.method twice and delegate when reads are %s then %s', (first, second) => {
    const request = accessorRequest([first, second]);
    const trace = traceCalls();
    const result = handleHelloRequest(request, res);

    expect(result).toBeUndefined();
    expect(request.reads).toBe(2);
    expect(trace).toEqual([
      ['info', `Handling ${first} request to /hello endpoint`],
      ['error', `Received unsupported ${second} method, expected GET`],
      ['handle405', res]
    ]);
  });

  // Characterisation: req.method is read twice; the GET path follows the second read
  it.each([
    ['GET', 'GET'],
    ['POST', 'GET']
  ])('should read req.method twice and respond when reads are %s then %s', (first, second) => {
    const request = accessorRequest([first, second]);
    const trace = traceCalls();
    const result = handleHelloRequest(request, res);

    expect(result).toBeUndefined();
    expect(request.reads).toBe(2);
    expect(trace).toEqual([
      ['info', `Handling ${first} request to /hello endpoint`],
      ['statusCode', 200],
      ['setHeader', 'Content-Type', 'text/plain'],
      ['end', 'Hello world'],
      ['info', 'Successfully responded with 200 OK and "Hello world" message']
    ]);
  });
});