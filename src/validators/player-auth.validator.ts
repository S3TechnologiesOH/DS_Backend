/**
 * Player Authentication Validation Schemas
 *
 * Zod schemas for validating player authentication requests.
 */

import { z } from 'zod';

/**
 * POST /api/v1/player-auth/activate
 * Player activation schema
 */
export const activatePlayerSchema = z.object({
  body: z.object({
    playerCode: z
      .string()
      .min(1, 'Player code is required')
      .max(50, 'Player code too long'),
    activationCode: z
      .string()
      .min(1, 'Activation code is required')
      .max(50, 'Activation code too long'),
  }),
});

/**
 * POST /api/v1/player-auth/refresh
 * Token refresh schema
 */
export const refreshPlayerTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

/**
 * POST /api/v1/player-auth/logout
 * Player logout schema
 */
export const logoutPlayerSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});
