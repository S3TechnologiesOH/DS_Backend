"use strict";
/**
 * Content Validation Schemas
 *
 * Zod schemas for content-related requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContentSchema = exports.deleteContentSchema = exports.getContentByIdSchema = exports.updateContentSchema = exports.createContentSchema = void 0;
const zod_1 = require("zod");
const contentTypes = ['Image', 'Video', 'HTML', 'URL', 'PDF'];
const contentStatuses = ['Processing', 'Ready', 'Failed'];
exports.createContentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(255),
        description: zod_1.z.string().max(5000).optional(),
        contentType: zod_1.z.enum(contentTypes, {
            errorMap: () => ({ message: 'Invalid content type' }),
        }),
        fileUrl: zod_1.z.string().url('Invalid file URL').optional(),
        thumbnailUrl: zod_1.z.string().url('Invalid thumbnail URL').optional(),
        fileSize: zod_1.z.number().int().positive().optional(),
        duration: zod_1.z.number().int().positive().optional(),
        width: zod_1.z.number().int().positive().optional(),
        height: zod_1.z.number().int().positive().optional(),
        mimeType: zod_1.z.string().max(100).optional(),
        tags: zod_1.z.string().max(500).optional(),
    }),
});
exports.updateContentSchema = zod_1.z.object({
    params: zod_1.z.object({
        contentId: zod_1.z.string().regex(/^\d+$/, 'Invalid content ID').transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
        description: zod_1.z.string().max(5000).optional(),
        contentType: zod_1.z.enum(contentTypes).optional(),
        duration: zod_1.z.number().int().positive().optional(),
        status: zod_1.z.enum(contentStatuses).optional(),
        tags: zod_1.z.string().max(500).optional(),
    }),
});
exports.getContentByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        contentId: zod_1.z.string().regex(/^\d+$/, 'Invalid content ID').transform(Number),
    }),
});
exports.deleteContentSchema = zod_1.z.object({
    params: zod_1.z.object({
        contentId: zod_1.z.string().regex(/^\d+$/, 'Invalid content ID').transform(Number),
    }),
});
exports.listContentSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        contentType: zod_1.z.enum(contentTypes).optional(),
        status: zod_1.z.enum(contentStatuses).optional(),
        search: zod_1.z.string().optional(),
        tags: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=content.validator.js.map