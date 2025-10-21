/**
 * Site Validators
 *
 * Zod schemas for validating site API requests.
 */
import { z } from 'zod';
export declare const createSiteSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        siteCode: z.ZodString;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
        timeZone: z.ZodOptional<z.ZodString>;
        openingHours: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    }, {
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    };
}, {
    body?: {
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    };
}>;
export declare const updateSiteSchema: z.ZodObject<{
    params: z.ZodObject<{
        siteId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        siteId?: string;
    }, {
        siteId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        siteCode: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
        timeZone: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        openingHours: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    }, {
        isActive?: boolean;
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        siteId?: string;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    };
}, {
    params?: {
        siteId?: string;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        siteCode?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        latitude?: number;
        longitude?: number;
        timeZone?: string;
        openingHours?: string;
    };
}>;
export declare const getSiteSchema: z.ZodObject<{
    params: z.ZodObject<{
        siteId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        siteId?: string;
    }, {
        siteId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        siteId?: string;
    };
}, {
    params?: {
        siteId?: string;
    };
}>;
//# sourceMappingURL=site.validator.d.ts.map