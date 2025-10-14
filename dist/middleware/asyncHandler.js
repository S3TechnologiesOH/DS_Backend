"use strict";
/**
 * Async Handler Middleware
 *
 * Wraps async route handlers to catch rejected promises and pass them to error middleware.
 * Eliminates need for try-catch blocks in every controller method.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * Wraps an async function to catch errors and pass to next()
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map