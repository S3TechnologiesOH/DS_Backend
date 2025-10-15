/**
 * Customer Validators
 *
 * Zod schemas for validating customer API requests.
 */

import { z } from 'zod';

const subscriptionTiers = ['Free', 'Pro', 'Enterprise'] as const;

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    subdomain: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens'),
    subscriptionTier: z.enum(subscriptionTiers).optional(),
    maxSites: z.number().int().min(1).optional(),
    maxPlayers: z.number().int().min(1).optional(),
    maxStorageGB: z.number().int().min(1).optional(),
    contactEmail: z.string().email(),
    contactPhone: z.string().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    customerId: z.string().regex(/^\d+$/, 'Customer ID must be a number'),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    subdomain: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens')
      .optional(),
    isActive: z.boolean().optional(),
    subscriptionTier: z.enum(subscriptionTiers).optional(),
    maxSites: z.number().int().min(1).optional(),
    maxPlayers: z.number().int().min(1).optional(),
    maxStorageGB: z.number().int().min(1).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
  }),
});

export const getCustomerSchema = z.object({
  params: z.object({
    customerId: z.string().regex(/^\d+$/, 'Customer ID must be a number'),
  }),
});
