"use strict";
/**
 * Playlist Validation Schemas
 *
 * Zod schemas for playlist-related requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlaylistsSchema = exports.removePlaylistItemSchema = exports.updatePlaylistItemSchema = exports.addPlaylistItemSchema = exports.deletePlaylistSchema = exports.getPlaylistByIdSchema = exports.updatePlaylistSchema = exports.createPlaylistSchema = void 0;
const zod_1 = require("zod");
const transitionTypes = ['Fade', 'Slide', 'None'];
exports.createPlaylistSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(255),
        description: zod_1.z.string().max(5000).optional(),
    }),
});
exports.updatePlaylistSchema = zod_1.z.object({
    params: zod_1.z.object({
        playlistId: zod_1.z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
        description: zod_1.z.string().max(5000).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getPlaylistByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        playlistId: zod_1.z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
    }),
});
exports.deletePlaylistSchema = zod_1.z.object({
    params: zod_1.z.object({
        playlistId: zod_1.z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
    }),
});
exports.addPlaylistItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        playlistId: zod_1.z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
    }),
    body: zod_1.z.object({
        contentId: zod_1.z.number().int().positive('Invalid content ID'),
        displayOrder: zod_1.z.number().int().nonnegative('Display order must be non-negative'),
        duration: zod_1.z.number().int().positive().optional(),
        transitionType: zod_1.z.enum(transitionTypes).optional(),
        transitionDuration: zod_1.z.number().int().nonnegative().optional(),
    }),
});
exports.updatePlaylistItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        playlistId: zod_1.z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
        itemId: zod_1.z.string().regex(/^\d+$/, 'Invalid item ID').transform(Number),
    }),
    body: zod_1.z.object({
        displayOrder: zod_1.z.number().int().nonnegative().optional(),
        duration: zod_1.z.number().int().positive().optional(),
        transitionType: zod_1.z.enum(transitionTypes).optional(),
        transitionDuration: zod_1.z.number().int().nonnegative().optional(),
    }),
});
exports.removePlaylistItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        playlistId: zod_1.z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
        itemId: zod_1.z.string().regex(/^\d+$/, 'Invalid item ID').transform(Number),
    }),
});
exports.listPlaylistsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        search: zod_1.z.string().optional(),
        isActive: zod_1.z
            .string()
            .transform((val) => val === 'true')
            .optional(),
    }),
});
//# sourceMappingURL=playlist.validator.js.map