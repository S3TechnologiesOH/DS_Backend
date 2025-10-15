/**
 * Player Validation Schemas
 *
 * Zod schemas for player-related requests.
 */

import { z } from 'zod';

const orientations = ['Landscape', 'Portrait'] as const;
const statuses = ['Online', 'Offline', 'Error'] as const;

export const createPlayerSchema = z.object({
  body: z.object({
    siteId: z.number().int().positive('Invalid site ID'),
    name: z.string().min(1, 'Name is required').max(255),
    playerCode: z
      .string()
      .min(1, 'Player code is required')
      .max(50)
      .regex(/^[A-Z0-9-_]+$/, 'Player code must contain only uppercase letters, numbers, hyphens, and underscores'),
    macAddress: z.string().max(20).optional(),
    serialNumber: z.string().max(100).optional(),
    location: z.string().max(200).optional(),
    screenResolution: z.string().max(20).optional(),
    orientation: z.enum(orientations).optional(),
  }),
});

export const updatePlayerSchema = z.object({
  params: z.object({
    playerId: z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    playerCode: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[A-Z0-9-_]+$/, 'Player code must contain only uppercase letters, numbers, hyphens, and underscores')
      .optional(),
    macAddress: z.string().max(20).optional(),
    serialNumber: z.string().max(100).optional(),
    location: z.string().max(200).optional(),
    screenResolution: z.string().max(20).optional(),
    orientation: z.enum(orientations).optional(),
    status: z.enum(statuses).optional(),
    ipAddress: z.string().max(50).optional(),
    playerVersion: z.string().max(50).optional(),
    osVersion: z.string().max(50).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getPlayerByIdSchema = z.object({
  params: z.object({
    playerId: z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
  }),
});

export const deletePlayerSchema = z.object({
  params: z.object({
    playerId: z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
  }),
});

export const playerHeartbeatSchema = z.object({
  params: z.object({
    playerId: z.string().regex(/^\d+$/, 'Invalid player ID').transform(Number),
  }),
  body: z.object({
    status: z.enum(statuses),
    ipAddress: z.string().max(50).optional(),
    playerVersion: z.string().max(50).optional(),
    osVersion: z.string().max(50).optional(),
  }),
});

export const activatePlayerSchema = z.object({
  body: z.object({
    activationCode: z.string().length(6, 'Activation code must be exactly 6 characters'),
  }),
});

export const listPlayersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    siteId: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(statuses).optional(),
    search: z.string().optional(),
  }),
});
