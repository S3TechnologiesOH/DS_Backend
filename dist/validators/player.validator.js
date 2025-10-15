"use strict";
/**
 * Player Validation Schemas
 *
 * Zod schemas for player-related requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlayersSchema = exports.activatePlayerSchema = exports.playerHeartbeatSchema = exports.deletePlayerSchema = exports.getPlayerByIdSchema = exports.updatePlayerSchema = exports.createPlayerSchema = void 0;
const zod_1 = require("zod");
const orientations = ['Landscape', 'Portrait'];
const statuses = ['Online', 'Offline', 'Error'];
exports.createPlayerSchema = zod_1.z.object({
    body: zod_1.z.object({
        siteId: zod_1.z.number().int().positive('Invalid site ID'),
        name: zod_1.z.string().min(1, 'Name is required').max(255),
        playerCode: zod_1.z
            .string()
            .min(1, 'Player code is required')
            .max(50)
            .regex(/^[A-Z0-9-_]+$/, 'Player code must contain only uppercase letters, numbers, hyphens, and underscores'),
        macAddress: zod_1.z.string().max(20).optional(),
        serialNumber: zod_1.z.string().max(100).optional(),
        location: zod_1.z.string().max(200).optional(),
        screenResolution: zod_1.z.string().max(20).optional(),
        orientation: zod_1.z.enum(orientations).optional(),
    }),
});
exports.updatePlayerSchema = zod_1.z.object({
    params: zod_1.z.object({
        playerId: zod_1.z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
        playerCode: zod_1.z
            .string()
            .min(1)
            .max(50)
            .regex(/^[A-Z0-9-_]+$/, 'Player code must contain only uppercase letters, numbers, hyphens, and underscores')
            .optional(),
        macAddress: zod_1.z.string().max(20).optional(),
        serialNumber: zod_1.z.string().max(100).optional(),
        location: zod_1.z.string().max(200).optional(),
        screenResolution: zod_1.z.string().max(20).optional(),
        orientation: zod_1.z.enum(orientations).optional(),
        status: zod_1.z.enum(statuses).optional(),
        ipAddress: zod_1.z.string().max(50).optional(),
        playerVersion: zod_1.z.string().max(50).optional(),
        osVersion: zod_1.z.string().max(50).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getPlayerByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        playerId: zod_1.z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
    }),
});
exports.deletePlayerSchema = zod_1.z.object({
    params: zod_1.z.object({
        playerId: zod_1.z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
    }),
});
exports.playerHeartbeatSchema = zod_1.z.object({
    params: zod_1.z.object({
        playerId: zod_1.z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(statuses),
        ipAddress: zod_1.z.string().max(50).optional(),
        playerVersion: zod_1.z.string().max(50).optional(),
        osVersion: zod_1.z.string().max(50).optional(),
    }),
});
exports.activatePlayerSchema = zod_1.z.object({
    body: zod_1.z.object({
        activationCode: zod_1.z.string().length(6, 'Activation code must be exactly 6 characters'),
    }),
});
exports.listPlayersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        siteId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        status: zod_1.z.enum(statuses).optional(),
        search: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=player.validator.js.map