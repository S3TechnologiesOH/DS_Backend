"use strict";
/**
 * Winston Logger Configuration for Digital Signage Platform
 *
 * Provides structured logging with different levels and transports.
 * NEVER log sensitive data (passwords, tokens, API keys, etc.)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeLogData = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize, errors } = winston_1.default.format;
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
const getLogLevel = () => {
    return process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
};
// Create transports array
const createTransports = () => {
    const transports = [
        // Console transport with colors
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
        }),
    ];
    // File transports in production
    if (process.env.NODE_ENV === 'production') {
        const logDir = process.env.LOG_FILE_PATH || './logs';
        transports.push(
        // Error log file
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
        }), 
        // Combined log file
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
        }));
    }
    return transports;
};
// Create logger instance
const logger = winston_1.default.createLogger({
    level: getLogLevel(),
    transports: createTransports(),
    // Don't exit on handled exceptions
    exitOnError: false,
});
// Helper function to sanitize sensitive data from logs
const sanitizeLogData = (data) => {
    const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization', 'jwt'];
    const sanitized = { ...data };
    Object.keys(sanitized).forEach((key) => {
        if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
            sanitized[key] = '***REDACTED***';
        }
    });
    return sanitized;
};
exports.sanitizeLogData = sanitizeLogData;
exports.default = logger;
//# sourceMappingURL=logger.js.map