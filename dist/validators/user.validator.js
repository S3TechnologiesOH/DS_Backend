"use strict";
/**
 * User Validation Schemas
 *
 * Zod schemas for validating user-related requests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.deleteUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.getUserByIdSchema = exports.listUsersSchema = void 0;
const zod_1 = require("zod");
// Valid user roles
const userRoleEnum = zod_1.z.enum(['Admin', 'Editor', 'Viewer', 'SiteManager']);
/**
 * List users validation
 */
exports.listUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        role: userRoleEnum.optional(),
        isActive: zod_1.z
            .string()
            .transform((val) => val === 'true')
            .optional(),
        assignedSiteId: zod_1.z.string().transform(Number).optional(),
    }),
});
/**
 * Get user by ID validation
 */
exports.getUserByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().transform(Number),
    }),
});
/**
 * Create user validation
 */
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        firstName: zod_1.z.string().min(1, 'First name is required').max(50, 'First name too long'),
        lastName: zod_1.z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
        role: userRoleEnum,
        assignedSiteId: zod_1.z.number().positive().optional(),
    }),
});
/**
 * Update user validation
 */
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().transform(Number),
    }),
    body: zod_1.z
        .object({
        email: zod_1.z.string().email('Invalid email format').optional(),
        firstName: zod_1.z.string().min(1).max(50).optional(),
        lastName: zod_1.z.string().min(1).max(50).optional(),
        role: userRoleEnum.optional(),
        isActive: zod_1.z.boolean().optional(),
        assignedSiteId: zod_1.z.number().positive().nullable().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
/**
 * Delete user validation
 */
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().transform(Number),
    }),
});
/**
 * Reset password validation
 */
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().transform(Number),
    }),
    body: zod_1.z.object({
        newPassword: zod_1.z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
});
//# sourceMappingURL=user.validator.js.map