"use strict";
/**
 * Customer Validators
 *
 * Zod schemas for validating customer API requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerSchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const subscriptionTiers = ['Free', 'Pro', 'Enterprise'];
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        subdomain: zod_1.z
            .string()
            .min(3)
            .max(50)
            .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens'),
        subscriptionTier: zod_1.z.enum(subscriptionTiers).optional(),
        maxSites: zod_1.z.number().int().min(1).optional(),
        maxPlayers: zod_1.z.number().int().min(1).optional(),
        maxStorageGB: zod_1.z.number().int().min(1).optional(),
        contactEmail: zod_1.z.string().email(),
        contactPhone: zod_1.z.string().optional(),
    }),
});
exports.updateCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        customerId: zod_1.z.string().regex(/^\d+$/, 'Customer ID must be a number'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100).optional(),
        subdomain: zod_1.z
            .string()
            .min(3)
            .max(50)
            .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens')
            .optional(),
        isActive: zod_1.z.boolean().optional(),
        subscriptionTier: zod_1.z.enum(subscriptionTiers).optional(),
        maxSites: zod_1.z.number().int().min(1).optional(),
        maxPlayers: zod_1.z.number().int().min(1).optional(),
        maxStorageGB: zod_1.z.number().int().min(1).optional(),
        contactEmail: zod_1.z.string().email().optional(),
        contactPhone: zod_1.z.string().optional(),
    }),
});
exports.getCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        customerId: zod_1.z.string().regex(/^\d+$/, 'Customer ID must be a number'),
    }),
});
//# sourceMappingURL=customer.validator.js.map