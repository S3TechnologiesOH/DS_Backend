"use strict";
/**
 * Request Validation Middleware
 *
 * Validates request body, params, and query using Zod schemas.
 * ALWAYS validate ALL user input before processing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const asyncHandler_1 = require("./asyncHandler");
/**
 * Validate request using Zod schema
 */
const validateRequest = (schema) => {
    return (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Format Zod errors for client
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                throw new errors_1.ValidationError(`Validation failed: ${formattedErrors.map((e) => e.message).join(', ')}`);
            }
            throw error;
        }
    });
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map