/**
 * Content Validation Schemas
 *
 * Zod schemas for content-related requests.
 */

import { z } from 'zod';

const contentTypes = ['Image', 'Video', 'HTML', 'URL', 'PDF'] as const;
const contentStatuses = ['Processing', 'Ready', 'Failed'] as const;

export const createContentSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().max(5000).optional(),
    contentType: z.enum(contentTypes, {
      errorMap: () => ({ message: 'Invalid content type' }),
    }),
    fileUrl: z.string().url('Invalid file URL').optional(),
    thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
    fileSize: z.number().int().positive().optional(),
    duration: z.number().int().positive().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    mimeType: z.string().max(100).optional(),
    tags: z.string().max(500).optional(),
  }),
});

export const updateContentSchema = z.object({
  params: z.object({
    contentId: z.string().regex(/^\d+$/, 'Invalid content ID').transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    contentType: z.enum(contentTypes).optional(),
    duration: z.number().int().positive().optional(),
    status: z.enum(contentStatuses).optional(),
    tags: z.string().max(500).optional(),
  }),
});

export const getContentByIdSchema = z.object({
  params: z.object({
    contentId: z.string().regex(/^\d+$/, 'Invalid content ID').transform(Number),
  }),
});

export const deleteContentSchema = z.object({
  params: z.object({
    contentId: z.string().regex(/^\d+$/, 'Invalid content ID').transform(Number),
  }),
});

export const listContentSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    contentType: z.enum(contentTypes).optional(),
    status: z.enum(contentStatuses).optional(),
    search: z.string().optional(),
    tags: z.string().optional(),
  }),
});
