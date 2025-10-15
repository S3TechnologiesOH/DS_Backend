"use strict";
/**
 * Site Validators
 *
 * Zod schemas for validating site API requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteSchema = exports.updateSiteSchema = exports.createSiteSchema = void 0;
const zod_1 = require("zod");
exports.createSiteSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        siteCode: zod_1.z
            .string()
            .min(1)
            .max(50)
            .regex(/^[A-Z0-9-_]+$/, 'Site code must contain only uppercase letters, numbers, hyphens, and underscores'),
        address: zod_1.z.string().max(200).optional(),
        city: zod_1.z.string().max(100).optional(),
        state: zod_1.z.string().max(100).optional(),
        country: zod_1.z.string().max(100).optional(),
        postalCode: zod_1.z.string().max(20).optional(),
        latitude: zod_1.z.number().min(-90).max(90).optional(),
        longitude: zod_1.z.number().min(-180).max(180).optional(),
        timeZone: zod_1.z.string().max(50).optional(),
        openingHours: zod_1.z.string().optional(),
    }),
});
exports.updateSiteSchema = zod_1.z.object({
    params: zod_1.z.object({
        siteId: zod_1.z.string().regex(/^\d+$/, 'Site ID must be a number'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100).optional(),
        siteCode: zod_1.z
            .string()
            .min(1)
            .max(50)
            .regex(/^[A-Z0-9-_]+$/, 'Site code must contain only uppercase letters, numbers, hyphens, and underscores')
            .optional(),
        address: zod_1.z.string().max(200).optional(),
        city: zod_1.z.string().max(100).optional(),
        state: zod_1.z.string().max(100).optional(),
        country: zod_1.z.string().max(100).optional(),
        postalCode: zod_1.z.string().max(20).optional(),
        latitude: zod_1.z.number().min(-90).max(90).optional(),
        longitude: zod_1.z.number().min(-180).max(180).optional(),
        timeZone: zod_1.z.string().max(50).optional(),
        isActive: zod_1.z.boolean().optional(),
        openingHours: zod_1.z.string().optional(),
    }),
});
exports.getSiteSchema = zod_1.z.object({
    params: zod_1.z.object({
        siteId: zod_1.z.string().regex(/^\d+$/, 'Site ID must be a number'),
    }),
});
//# sourceMappingURL=site.validator.js.map