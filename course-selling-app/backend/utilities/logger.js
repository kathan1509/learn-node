const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize, printf } = format;

// Custom format for console logging with colors
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()), // JSON logging format for non-console transports
  transports: [
    new transports.Console({
      format: consoleLogFormat, // Custom console log format
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

// Export the logger for use in other modules
module.exports = logger;
