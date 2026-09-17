/**
 * Tests for the configuration module that resolves the server's PORT from the
 * environment.
 *
 * The module is exercised black-box, the way every consumer uses it: `require('../config')`
 * returns the already-resolved configuration object (`{ PORT, HOST, NODE_ENV, LOG_LEVEL,
 * IS_DEV, IS_PROD, IS_TEST }`), not a factory, and its port validator is module-private.
 * So each case sets `process.env.PORT`, re-requires the module on a clean registry and
 * asserts on two observable things: the `PORT` the module published, and whether it
 * reported the value through the logger.
 *
 * These cases are the regression guard for the prefix-truncation defect: validation used
 * to `parseInt` the raw value and range-check only the digits it managed to read, so
 * `4000extra` or `4000; touch nope.txt` bound port 4000 and the rest of the string was
 * discarded without a warning, while a value with no leading digit was warned about and
 * defaulted. Every partly numeric value below must now take that same warn-and-default
 * path, and a value that is set but empty must be reported rather than quietly replaced
 * by the default.
 *
 * @jest v29.5.0
 */

// Every notice the configuration module raises goes through `utils/logger`, which writes
// nothing while NODE_ENV is `test`. A recording double is therefore the only way to
// observe what the module reported. The factory runs once per module registry, so
// `jest.resetModules()` hands each case a fresh set of spies.
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

const { CONFIG } = require('../utils/constants');

// Captured before any case mutates it. Jest runs suites with `--runInBand` in a single
// process, and `__tests__/server.test.js` and `__tests__/integration/api.test.js` both
// bind the port this variable carries, so a value leaked from here would break them.
const ORIGINAL_PORT = process.env[CONFIG.ENV_VAR_PORT];

/**
 * Loads the configuration module afresh with a given PORT value in the environment.
 *
 * `jest.resetModules()` first, so the module re-evaluates instead of returning the
 * cached configuration from an earlier case, and the logger is required only afterwards
 * so the returned spies are the very instance the configuration module delivered its
 * notices to.
 *
 * @param {string|undefined} portValue - Value to set PORT to; `undefined` unsets it
 * @returns {{config: object, logger: {info: Function, warn: Function, error: Function}}}
 */
function loadConfigWithPort(portValue) {
  jest.resetModules();

  if (portValue === undefined) {
    delete process.env[CONFIG.ENV_VAR_PORT];
  } else {
    process.env[CONFIG.ENV_VAR_PORT] = portValue;
  }

  const config = require('../config');
  const logger = require('../utils/logger');

  return { config, logger };
}

/**
 * Restores PORT to the value the test process started with.
 *
 * @returns {void}
 */
function restoreOriginalPort() {
  if (ORIGINAL_PORT === undefined) {
    delete process.env[CONFIG.ENV_VAR_PORT];
  } else {
    process.env[CONFIG.ENV_VAR_PORT] = ORIGINAL_PORT;
  }
}

/**
 * Builds the warning text the configuration module emits for a rejected value.
 *
 * @param {string} reportedValue - Value as the module reports it in the message
 * @returns {string} The expected single-line warning
 */
function expectedWarning(reportedValue) {
  return `Invalid port: ${reportedValue}. Using default port: ${CONFIG.DEFAULT_PORT}`;
}

// Values that are valid ports and must be adopted exactly, with nothing reported.
// Surrounding whitespace is formatting from .env and YAML sources, not corruption, so it
// is stripped rather than rejected.
const ACCEPTED_PORTS = [
  { label: 'a plain numeric string', value: '4000', expected: 4000 },
  { label: 'a numeric string padded with whitespace', value: '  4000  ', expected: 4000 },
  { label: 'the highest port in range', value: '65535', expected: 65535 }
];

// Values that must all be reported and replaced by the default. The first four were
// already rejected before the prefix-truncation fix and are locked down here; the last
// three are the regression cases that used to be accepted by their numeric prefix.
const REJECTED_PORTS = [
  { label: 'a wholly non-numeric value', value: 'not-a-number', adoptsPrefix: false },
  { label: 'a value far above the valid range', value: '100000', adoptsPrefix: false },
  { label: 'zero, which is not a bindable port', value: '0', adoptsPrefix: false },
  { label: 'one past the top of the range', value: '65536', adoptsPrefix: false },
  { label: 'digits followed by a shell command', value: '4000; touch nope.txt', adoptsPrefix: true },
  { label: 'digits followed by a shell operator', value: '4000 && echo x', adoptsPrefix: true },
  { label: 'digits followed by a text suffix', value: '4000extra', adoptsPrefix: true }
];

describe('Config module PORT resolution', () => {
  afterEach(() => {
    restoreOriginalPort();
  });

  afterAll(() => {
    restoreOriginalPort();
  });

  it('publishes the resolved configuration object rather than a factory', () => {
    const { config } = loadConfigWithPort('4000');

    expect(typeof config).toBe('object');
    expect(typeof config).not.toBe('function');
    expect(typeof config.PORT).toBe('number');
    expect(config).toEqual(expect.objectContaining({
      PORT: 4000,
      HOST: expect.any(String),
      NODE_ENV: expect.any(String),
      LOG_LEVEL: expect.any(String),
      IS_DEV: expect.any(Boolean),
      IS_PROD: expect.any(Boolean),
      IS_TEST: expect.any(Boolean)
    }));
  });

  it('uses the default port, without reporting anything, when PORT is not set', () => {
    const { config, logger } = loadConfigWithPort(undefined);

    // An absent variable is the documented default path, not a misconfiguration, so it
    // must stay silent.
    expect(config.PORT).toBe(CONFIG.DEFAULT_PORT);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  ACCEPTED_PORTS.forEach(({ label, value, expected }) => {
    it(`adopts ${label} (${JSON.stringify(value)}) without reporting anything`, () => {
      const { config, logger } = loadConfigWithPort(value);

      expect(config.PORT).toBe(expected);
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });

  REJECTED_PORTS.forEach(({ label, value, adoptsPrefix }) => {
    it(`reports and defaults ${label} (${JSON.stringify(value)})`, () => {
      const { config, logger } = loadConfigWithPort(value);

      expect(config.PORT).toBe(CONFIG.DEFAULT_PORT);
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(expectedWarning(value));

      if (adoptsPrefix) {
        // The crux of the regression: the leading digits must NOT become the bound port.
        expect(config.PORT).not.toBe(4000);
      }
    });
  });

  it('reports a PORT that is set but empty instead of silently defaulting', () => {
    const { config, logger } = loadConfigWithPort('');

    // An empty value used to be falsy at the call site, so it never reached the
    // validator and the default was adopted with no notice at all.
    expect(config.PORT).toBe(CONFIG.DEFAULT_PORT);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(expectedWarning('(empty)'));
  });

  it('reports a whitespace-only PORT as empty rather than as a blank value', () => {
    const { config, logger } = loadConfigWithPort('   ');

    expect(config.PORT).toBe(CONFIG.DEFAULT_PORT);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(expectedWarning('(empty)'));
  });

  it('leaves PORT in the environment untouched for the suites that run after it', () => {
    loadConfigWithPort('4000');
    restoreOriginalPort();

    expect(process.env[CONFIG.ENV_VAR_PORT]).toBe(ORIGINAL_PORT);
  });
});
