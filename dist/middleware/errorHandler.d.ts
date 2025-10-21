/**
 * Global Error Handler Middleware
 *
 * Catches all errors and formats them for client response.
 * NEVER expose stack traces or sensitive data to clients in production.
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => void;
/**
 * Handle 404 Not Found errors
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Handle unhandled promise rejections
 */
export declare const handleUnhandledRejection: () => void;
/**
 * Handle uncaught exceptions
 */
export declare const handleUncaughtException: () => void;
//# sourceMappingURL=errorHandler.d.ts.map