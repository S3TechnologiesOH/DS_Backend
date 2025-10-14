/**
 * Request Validation Middleware
 *
 * Validates request body, params, and query using Zod schemas.
 * ALWAYS validate ALL user input before processing.
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
import { asyncHandler } from './asyncHandler';

/**
 * Validate request using Zod schema
 */
export const validateRequest = (schema: AnyZodObject) => {
  return asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          // Format Zod errors for client
          const formattedErrors = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          throw new ValidationError(
            `Validation failed: ${formattedErrors.map((e) => e.message).join(', ')}`
          );
        }
        throw error;
      }
    }
  );
};
