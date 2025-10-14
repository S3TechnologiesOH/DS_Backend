/**
 * Authentication Validation Schemas
 *
 * Zod schemas for auth-related requests.
 */
import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        subdomain: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password?: string;
        email?: string;
        subdomain?: string;
    }, {
        password?: string;
        email?: string;
        subdomain?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        password?: string;
        email?: string;
        subdomain?: string;
    };
}, {
    body?: {
        password?: string;
        email?: string;
        subdomain?: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        subdomain: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        subdomain?: string;
    }, {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        subdomain?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        subdomain?: string;
    };
}, {
    body?: {
        password?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        subdomain?: string;
    };
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken?: string;
    }, {
        refreshToken?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        refreshToken?: string;
    };
}, {
    body?: {
        refreshToken?: string;
    };
}>;
export declare const changePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currentPassword?: string;
        newPassword?: string;
    }, {
        currentPassword?: string;
        newPassword?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        currentPassword?: string;
        newPassword?: string;
    };
}, {
    body?: {
        currentPassword?: string;
        newPassword?: string;
    };
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        subdomain: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email?: string;
        subdomain?: string;
    }, {
        email?: string;
        subdomain?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        email?: string;
        subdomain?: string;
    };
}, {
    body?: {
        email?: string;
        subdomain?: string;
    };
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password?: string;
        token?: string;
    }, {
        password?: string;
        token?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        password?: string;
        token?: string;
    };
}, {
    body?: {
        password?: string;
        token?: string;
    };
}>;
//# sourceMappingURL=auth.validator.d.ts.map