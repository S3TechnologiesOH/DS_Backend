"use strict";
/**
 * Global Error Handler Middleware
 *
 * Catches all errors and formats them for client response.
 * NEVER expose stack traces or sensitive data to clients in production.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUncaughtException = exports.handleUnhandledRejection = exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const environment_1 = require("../config/environment");
const errorHandler = (err, req, res, _next) => {
    // Default to 500 server error
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;
    // Handle AppError instances
    if (err instanceof errors_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }
    // Log error
    const logLevel = statusCode >= 500 ? 'error' : 'warn';
    logger_1.default[logLevel]('Error occurred', {
        statusCode,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        user: req.user?.userId,
    });
    // Prepare error response
    const errorResponse = {
        status: 'error',
        message: isOperational ? message : 'An unexpected error occurred',
    };
    // Include stack trace in development
    if (environment_1.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
/**
 * Handle 404 Not Found errors
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (reason) => {
        logger_1.default.error('Unhandled Promise Rejection', { reason: reason.message, stack: reason.stack });
        // Don't exit in production - let the process manager handle it
        if (environment_1.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    });
};
exports.handleUnhandledRejection = handleUnhandledRejection;
/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = () => {
    process.on('uncaughtException', (error) => {
        logger_1.default.error('Uncaught Exception', { error: error.message, stack: error.stack });
        // Exit process on uncaught exception
        process.exit(1);
    });
};
exports.handleUncaughtException = handleUncaughtException;
//# sourceMappingURL=errorHandler.js.map