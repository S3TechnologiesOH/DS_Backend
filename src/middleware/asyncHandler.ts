/**
 * Async Handler Middleware
 *
 * Wraps async route handlers to catch rejected promises and pass them to error middleware.
 * Eliminates need for try-catch blocks in every controller method.
 */

import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Wraps an async function to catch errors and pass to next()
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
