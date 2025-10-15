/**
 * User Validation Schemas
 *
 * Zod schemas for validating user-related requests
 */

import { z } from 'zod';

// Valid user roles
const userRoleEnum = z.enum(['Admin', 'Editor', 'Viewer', 'SiteManager']);

/**
 * List users validation
 */
export const listUsersSchema = z.object({
  query: z.object({
    role: userRoleEnum.optional(),
    isActive: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    assignedSiteId: z.string().transform(Number).optional(),
  }),
});

/**
 * Get user by ID validation
 */
export const getUserByIdSchema = z.object({
  params: z.object({
    userId: z.string().transform(Number),
  }),
});

/**
 * Create user validation
 */
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    role: userRoleEnum,
    assignedSiteId: z.number().positive().optional(),
  }),
});

/**
 * Update user validation
 */
export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().transform(Number),
  }),
  body: z
    .object({
      email: z.string().email('Invalid email format').optional(),
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      role: userRoleEnum.optional(),
      isActive: z.boolean().optional(),
      assignedSiteId: z.number().positive().nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

/**
 * Delete user validation
 */
export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().transform(Number),
  }),
});

/**
 * Reset password validation
 */
export const resetPasswordSchema = z.object({
  params: z.object({
    userId: z.string().transform(Number),
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});
