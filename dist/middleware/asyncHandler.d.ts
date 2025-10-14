/**
 * Async Handler Middleware
 *
 * Wraps async route handlers to catch rejected promises and pass them to error middleware.
 * Eliminates need for try-catch blocks in every controller method.
 */
import { Request, Response, NextFunction } from 'express';
type AsyncFunction = (req: any, res: Response, next: NextFunction) => Promise<void>;
/**
 * Wraps an async function to catch errors and pass to next()
 */
export declare const asyncHandler: (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map