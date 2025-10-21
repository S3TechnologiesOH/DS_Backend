/**
 * Layout Validation Schemas
 *
 * Zod schemas for layout-related requests.
 */

import { z } from 'zod';

const layerTypes = [
  'text',
  'image',
  'video',
  'playlist',
  'html',
  'iframe',
  'weather',
  'rss',
  'news',
  'youtube',
  'clock',
  'shape',
] as const;

// Nested schemas for layer configuration
const layerContentConfigSchema = z.object({
  // Text widget
  text: z.string().optional(),
  fontSize: z.number().positive().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.string().optional(),
  fontStyle: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  color: z.string().optional(),
  lineHeight: z.number().positive().optional(),

  // Image widget
  imageUrl: z.string().url().optional(),
  objectFit: z.enum(['cover', 'contain', 'fill', 'scale-down', 'none']).optional(),

  // Video widget
  videoUrl: z.string().url().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
  controls: z.boolean().optional(),

  // Playlist widget
  playlistId: z.number().int().positive().optional(),

  // HTML widget
  htmlContent: z.string().optional(),

  // Iframe widget
  iframeUrl: z.string().url().optional(),
  allowFullscreen: z.boolean().optional(),

  // Weather widget
  location: z.string().optional(),
  units: z.enum(['metric', 'imperial']).optional(),
  apiKey: z.string().optional(),

  // RSS/News widget
  feedUrl: z.string().url().optional(),
  refreshInterval: z.number().int().positive().optional(),
  maxItems: z.number().int().positive().optional(),

  // YouTube widget
  videoId: z.string().optional(),

  // Clock widget
  format: z.string().optional(),
  timezone: z.string().optional(),

  // Shape widget
  shapeType: z.enum(['rectangle', 'circle', 'ellipse', 'polygon']).optional(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
}).optional();

const layerStyleConfigSchema = z.object({
  backgroundColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderColor: z.string().optional(),
  borderRadius: z.number().optional(),
  borderStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  boxShadow: z.string().optional(),
  padding: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
  }).optional(),
  blendMode: z.string().optional(),
}).optional();

const animationConfigSchema = z.object({
  type: z.enum(['none', 'fadeIn', 'fadeOut', 'slideIn', 'slideOut', 'zoom', 'rotate', 'bounce']).optional(),
  duration: z.number().optional(),
  delay: z.number().optional(),
  iterations: z.union([z.number(), z.literal('infinite')]).optional(),
  easing: z.string().optional(),
}).optional();

const scheduleConfigSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
}).optional();

const createLayerSchema = z.object({
  layerName: z.string().min(1).max(255),
  layerType: z.enum(layerTypes),
  zIndex: z.number().int().default(0),
  positionX: z.number().int(),
  positionY: z.number().int(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  rotation: z.number().default(0),
  opacity: z.number().min(0).max(1).default(1),
  isVisible: z.boolean().default(true),
  isLocked: z.boolean().default(false),
  contentConfig: layerContentConfigSchema,
  styleConfig: layerStyleConfigSchema,
  animationConfig: animationConfigSchema,
  scheduleConfig: scheduleConfigSchema,
});

export const createLayoutSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().max(5000).optional(),
    width: z.number().int().min(100).default(1920),
    height: z.number().int().min(100).default(1080),
    backgroundColor: z.string().default('#000000'),
    tags: z.string().max(500).optional(),
    layers: z.array(createLayerSchema).optional(),
  }),
});

export const updateLayoutSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    width: z.number().int().min(100).optional(),
    height: z.number().int().min(100).optional(),
    backgroundColor: z.string().optional(),
    thumbnailUrl: z.string().url().optional(),
    tags: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getLayoutByIdSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
  }),
});

export const deleteLayoutSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
  }),
});

export const duplicateLayoutSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
  }),
});

export const listLayoutsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
});

export const getLayersSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
  }),
});

export const addLayerSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
  }),
  body: createLayerSchema,
});

export const updateLayerSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    layerId: z.string().regex(/^\d+$/, 'Invalid layer ID').transform(Number),
  }),
  body: z.object({
    layerName: z.string().min(1).max(255).optional(),
    layerType: z.enum(layerTypes).optional(),
    zIndex: z.number().int().optional(),
    positionX: z.number().int().optional(),
    positionY: z.number().int().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    rotation: z.number().optional(),
    opacity: z.number().min(0).max(1).optional(),
    isVisible: z.boolean().optional(),
    isLocked: z.boolean().optional(),
    contentConfig: layerContentConfigSchema,
    styleConfig: layerStyleConfigSchema,
    animationConfig: animationConfigSchema,
    scheduleConfig: scheduleConfigSchema,
  }),
});

export const deleteLayerSchema = z.object({
  params: z.object({
    layoutId: z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    layerId: z.string().regex(/^\d+$/, 'Invalid layer ID').transform(Number),
  }),
});
