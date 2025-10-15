/**
 * Customer Validators
 *
 * Zod schemas for validating customer API requests.
 */
import { z } from 'zod';
export declare const createCustomerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        subdomain: z.ZodString;
        subscriptionTier: z.ZodOptional<z.ZodEnum<["Free", "Pro", "Enterprise"]>>;
        maxSites: z.ZodOptional<z.ZodNumber>;
        maxPlayers: z.ZodOptional<z.ZodNumber>;
        maxStorageGB: z.ZodOptional<z.ZodNumber>;
        contactEmail: z.ZodString;
        contactPhone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    }, {
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    };
}, {
    body?: {
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    };
}>;
export declare const updateCustomerSchema: z.ZodObject<{
    params: z.ZodObject<{
        customerId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        customerId?: string;
    }, {
        customerId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        subdomain: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        subscriptionTier: z.ZodOptional<z.ZodEnum<["Free", "Pro", "Enterprise"]>>;
        maxSites: z.ZodOptional<z.ZodNumber>;
        maxPlayers: z.ZodOptional<z.ZodNumber>;
        maxStorageGB: z.ZodOptional<z.ZodNumber>;
        contactEmail: z.ZodOptional<z.ZodString>;
        contactPhone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    }, {
        isActive?: boolean;
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        customerId?: string;
    };
    body?: {
        isActive?: boolean;
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    };
}, {
    params?: {
        customerId?: string;
    };
    body?: {
        isActive?: boolean;
        subdomain?: string;
        name?: string;
        subscriptionTier?: "Free" | "Pro" | "Enterprise";
        maxSites?: number;
        maxPlayers?: number;
        maxStorageGB?: number;
        contactEmail?: string;
        contactPhone?: string;
    };
}>;
export declare const getCustomerSchema: z.ZodObject<{
    params: z.ZodObject<{
        customerId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        customerId?: string;
    }, {
        customerId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        customerId?: string;
    };
}, {
    params?: {
        customerId?: string;
    };
}>;
//# sourceMappingURL=customer.validator.d.ts.map