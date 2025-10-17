"use strict";
/**
 * Player Authentication Validation Schemas
 *
 * Zod schemas for validating player authentication requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutPlayerSchema = exports.refreshPlayerTokenSchema = exports.activatePlayerSchema = void 0;
const zod_1 = require("zod");
/**
 * POST /api/v1/player-auth/activate
 * Player activation schema
 */
exports.activatePlayerSchema = zod_1.z.object({
    body: zod_1.z.object({
        playerCode: zod_1.z
            .string()
            .min(1, 'Player code is required')
            .max(50, 'Player code too long'),
        activationCode: zod_1.z
            .string()
            .min(1, 'Activation code is required')
            .max(50, 'Activation code too long'),
    }),
});
/**
 * POST /api/v1/player-auth/refresh
 * Token refresh schema
 */
exports.refreshPlayerTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
/**
 * POST /api/v1/player-auth/logout
 * Player logout schema
 */
exports.logoutPlayerSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
//# sourceMappingURL=player-auth.validator.js.map