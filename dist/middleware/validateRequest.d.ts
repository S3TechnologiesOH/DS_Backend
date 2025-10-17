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
export declare const validateRequest: (schema: AnyZodObject) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
//# sourceMappingURL=validateRequest.d.ts.map