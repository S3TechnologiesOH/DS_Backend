/**
 * Site Validators
 *
 * Zod schemas for validating site API requests.
 */

import { z } from 'zod';

export const createSiteSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    siteCode: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[A-Z0-9-_]+$/, 'Site code must contain only uppercase letters, numbers, hyphens, and underscores'),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    timeZone: z.string().max(50).optional(),
    openingHours: z.string().optional(),
  }),
});

export const updateSiteSchema = z.object({
  params: z.object({
    siteId: z.string().regex(/^\d+$/, 'Site ID must be a number'),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    siteCode: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[A-Z0-9-_]+$/, 'Site code must contain only uppercase letters, numbers, hyphens, and underscores')
      .optional(),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    timeZone: z.string().max(50).optional(),
    isActive: z.boolean().optional(),
    openingHours: z.string().optional(),
  }),
});

export const getSiteSchema = z.object({
  params: z.object({
    siteId: z.string().regex(/^\d+$/, 'Site ID must be a number'),
  }),
});
