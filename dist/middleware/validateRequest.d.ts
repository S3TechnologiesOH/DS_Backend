/**
 * Request Validation Middleware
 *
 * Validates request body, params, and query using Zod schemas.
 * ALWAYS validate ALL user input before processing.
 */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
/**
 * Validate request using Zod schema
 */
export declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateRequest.d.ts.map