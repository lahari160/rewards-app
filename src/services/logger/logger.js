/**
 * Log levels enum
 * @readonly
 * @enum {string}
 */
export const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Logger configuration
 * @type {Object}
 */
const config = {
  level: process.env.REACT_APP_LOG_LEVEL || LogLevel.INFO,
  enableConsole: process.env.NODE_ENV !== 'production'
};

/**
 * Custom logger class for application-wide logging
 * @class Logger
 */
class Logger {
  /**
   * Creates timestamp for log entries
   * @private
   * @returns {string} Formatted timestamp
   */
  static #getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Formats log message with metadata
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   * @returns {Object} Formatted log entry
   */
  static #formatLog(level, message, meta = {}) {
    return {
      timestamp: this.#getTimestamp(),
      level,
      message,
      ...meta
    };
  }

  /**
   * Logs error messages
   * @param {string} message - Error message
   * @param {Error|Object} [error] - Error object or additional data
   */
  static error(message, error = {}) {
    const logEntry = this.#formatLog(LogLevel.ERROR, message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });

    if (config.enableConsole) {
      console.error(logEntry);
    }
    // Add persistence logic here if needed
  }

  /**
   * Logs warning messages
   * @param {string} message - Warning message
   * @param {Object} [meta] - Additional metadata
   */
  static warn(message, meta = {}) {
    const logEntry = this.#formatLog(LogLevel.WARN, message, meta);
    
    if (config.enableConsole) {
      console.warn(logEntry);
    }
  }

  /**
   * Logs info messages
   * @param {string} message - Info message
   * @param {Object} [meta] - Additional metadata
   */
  static info(message, meta = {}) {
    if (config.level === LogLevel.DEBUG || config.level === LogLevel.INFO) {
      const logEntry = this.#formatLog(LogLevel.INFO, message, meta);
      
      if (config.enableConsole) {
        console.info(logEntry);
      }
    }
  }

  /**
   * Logs debug messages
   * @param {string} message - Debug message
   * @param {Object} [meta] - Additional metadata
   */
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