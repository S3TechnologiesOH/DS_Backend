/**
 * Playlist Validation Schemas
 *
 * Zod schemas for playlist-related requests.
 */

import { z } from 'zod';

const transitionTypes = ['Fade', 'Slide', 'None'] as const;

export const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().max(5000).optional(),
  }),
});

export const updatePlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getPlaylistByIdSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
  }),
});

export const deletePlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
  }),
});

export const addPlaylistItemSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
  }),
  body: z.object({
    contentId: z.number().int().positive('Invalid content ID'),
    displayOrder: z.number().int().nonnegative('Display order must be non-negative'),
    duration: z.number().int().positive().optional(),
    transitionType: z.enum(transitionTypes).optional(),
    transitionDuration: z.number().int().nonnegative().optional(),
  }),
});

export const updatePlaylistItemSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
    itemId: z.string().regex(/^\d+$/, 'Invalid item ID').transform(Number),
  }),
  body: z.object({
    displayOrder: z.number().int().nonnegative().optional(),
    duration: z.number().int().positive().optional(),
    transitionType: z.enum(transitionTypes).optional(),
    transitionDuration: z.number().int().nonnegative().optional(),
  }),
});

export const removePlaylistItemSchema = z.object({
  params: z.object({
    playlistId: z.string().regex(/^\d+$/, 'Invalid playlist ID').transform(Number),
    itemId: z.string().regex(/^\d+$/, 'Invalid item ID').transform(Number),
  }),
});

export const listPlaylistsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    isActive: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
  }),
});
