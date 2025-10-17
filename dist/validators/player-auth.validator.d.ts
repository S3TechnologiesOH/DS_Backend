/**
 * Player Authentication Validation Schemas
 *
 * Zod schemas for validating player authentication requests.
 */
import { z } from 'zod';
/**
 * POST /api/v1/player-auth/activate
 * Player activation schema
 */
export declare const activatePlayerSchema: z.ZodObject<{
    body: z.ZodObject<{
        playerCode: z.ZodString;
        activationCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        playerCode?: string;
        activationCode?: string;
    }, {
        playerCode?: string;
        activationCode?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        playerCode?: string;
        activationCode?: string;
    };
}, {
    body?: {
        playerCode?: string;
        activationCode?: string;
    };
}>;
/**
 * POST /api/v1/player-auth/refresh
 * Token refresh schema
 */
export declare const refreshPlayerTokenSchema: z.ZodObject<{
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
/**
 * POST /api/v1/player-auth/logout
 * Player logout schema
 */
export declare const logoutPlayerSchema: z.ZodObject<{
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
//# sourceMappingURL=player-auth.validator.d.ts.map