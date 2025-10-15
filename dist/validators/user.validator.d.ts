/**
 * User Validation Schemas
 *
 * Zod schemas for validating user-related requests
 */
import { z } from 'zod';
/**
 * List users validation
 */
export declare const listUsersSchema: z.ZodObject<{
    query: z.ZodObject<{
        role: z.ZodOptional<z.ZodEnum<["Admin", "Editor", "Viewer", "SiteManager"]>>;
        isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
        assignedSiteId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    }, {
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: string;
        isActive?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query?: {
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    };
}, {
    query?: {
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: string;
        isActive?: string;
    };
}>;
/**
 * Get user by ID validation
 */
export declare const getUserByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        userId?: number;
    }, {
        userId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        userId?: number;
    };
}, {
    params?: {
        userId?: string;
    };
}>;
/**
 * Create user validation
 */
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        role: z.ZodEnum<["Admin", "Editor", "Viewer", "SiteManager"]>;
        assignedSiteId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
    }, {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
    };
}, {
    body?: {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
    };
}>;
/**
 * Update user validation
 */
export declare const updateUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        userId?: number;
    }, {
        userId?: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["Admin", "Editor", "Viewer", "SiteManager"]>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        assignedSiteId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    }, {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    }>, {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    }, {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        userId?: number;
    };
    body?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    };
}, {
    params?: {
        userId?: string;
    };
    body?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: "Admin" | "Editor" | "Viewer" | "SiteManager";
        assignedSiteId?: number;
        isActive?: boolean;
    };
}>;
/**
 * Delete user validation
 */
export declare const deleteUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        userId?: number;
    }, {
        userId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        userId?: number;
    };
}, {
    params?: {
        userId?: string;
    };
}>;
/**
 * Reset password validation
 */
export declare const resetPasswordSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        userId?: number;
    }, {
        userId?: string;
    }>;
    body: z.ZodObject<{
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newPassword?: string;
    }, {
        newPassword?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        userId?: number;
    };
    body?: {
        newPassword?: string;
    };
}, {
    params?: {
        userId?: string;
    };
    body?: {
        newPassword?: string;
    };
}>;
//# sourceMappingURL=user.validator.d.ts.map