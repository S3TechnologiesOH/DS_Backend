/**
 * Winston Logger Configuration for Digital Signage Platform
 *
 * Provides structured logging with different levels and transports.
 * NEVER log sensitive data (passwords, tokens, API keys, etc.)
 */

import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  // Add stack trace for errors
  if (stack) {
    msg += `\n${stack}`;
  }

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }

  return msg;
});

// Determine log level from environment
const getLogLevel = (): string => {
  return process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
};

// Create transports array
const createTransports = (): winston.transport[] => {
  const transports: winston.transport[] = [
    // Console transport with colors
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    }),
  ];

  // File transports in production
  if (process.env.NODE_ENV === 'production') {
    const logDir = process.env.LOG_FILE_PATH || './logs';

    transports.push(
      // Error log file
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          logFormat
        ),
      }),
      // Combined log file
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          logFormat
        ),
      })
    );
  }

  return transports;
};

// Create logger instance
const logger = winston.createLogger({
  level: getLogLevel(),
  transports: createTransports(),
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Helper function to sanitize sensitive data from logs
export const sanitizeLogData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization', 'jwt'];
  const sanitized = { ...data };

  Object.keys(sanitized).forEach((key) => {
    if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '***REDACTED***';
    }
  });

  return sanitized;
};

export default logger;
