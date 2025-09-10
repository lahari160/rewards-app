/**
 * Log levels enum
 * @readonly
 * @enum {string}
 */
export const LogLevel = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

/**
 * Logger configuration
 * @type {Object}
 */
const config = {
  level: process.env.REACT_APP_LOG_LEVEL || LogLevel.INFO,
  enableConsole: process.env.NODE_ENV !== "production",
};

/**
 * Allow updating log level dynamically (useful for tests & runtime config)
 * @param {string} level - New log level
 */
export const setLogLevel = (level) => {
  if (Object.values(LogLevel).includes(level)) {
    config.level = level;
  } else {
    throw new Error(`Invalid log level: ${level}`);
  }
};

/**
 * Custom logger class for application-wide logging
 * @class Logger
 */
class Logger {
  static #getTimestamp() {
    return new Date().toISOString();
  }

  static #formatLog(level, message, meta = {}) {
    return {
      timestamp: this.#getTimestamp(),
      level,
      message,
      ...meta,
    };
  }

  static error(message, error = {}) {
    const logEntry = this.#formatLog(LogLevel.ERROR, message, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });

    if (config.enableConsole) {
      console.error(logEntry);
    }
  }

  static warn(message, meta = {}) {
    const logEntry = this.#formatLog(LogLevel.WARN, message, meta);

    if (config.enableConsole) {
      console.warn(logEntry);
    }
  }

  static info(message, meta = {}) {
    if (config.level === LogLevel.DEBUG || config.level === LogLevel.INFO) {
      const logEntry = this.#formatLog(LogLevel.INFO, message, meta);

      if (config.enableConsole) {
        console.info(logEntry);
      }
    }
  }

  static debug(message, meta = {}) {
    if (config.level === LogLevel.DEBUG) {
      const logEntry = this.#formatLog(LogLevel.DEBUG, message, meta);

      if (config.enableConsole) {
        console.debug(logEntry);
      }
    }
  }
}

export default Logger;