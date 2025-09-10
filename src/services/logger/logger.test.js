import Logger, { LogLevel, setLogLevel } from "./logger";

describe("Logger with dynamic log levels", () => {
  let mockError, mockWarn, mockInfo, mockDebug;

  beforeEach(() => {
    mockError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockInfo = jest.spyOn(console, "info").mockImplementation(() => {});
    mockDebug = jest.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log error messages", () => {
    Logger.error("Error message");
    expect(mockError).toHaveBeenCalled();
  });

  it("should log info if level is INFO", () => {
    setLogLevel(LogLevel.INFO);
    Logger.info("Info message");
    expect(mockInfo).toHaveBeenCalled();
  });

  it("should not log debug if level is INFO", () => {
    setLogLevel(LogLevel.INFO);
    Logger.debug("This should not appear");
    expect(mockDebug).not.toHaveBeenCalled();
  });

  it("should log debug if level is DEBUG", () => {
    setLogLevel(LogLevel.DEBUG);
    Logger.debug("Debug message");
    expect(mockDebug).toHaveBeenCalled();
  });

  it("should throw error for invalid log level", () => {
    expect(() => setLogLevel("INVALID")).toThrow("Invalid log level: INVALID");
  });
});