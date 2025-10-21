"use strict";
/**
 * Layout Validation Schemas
 *
 * Zod schemas for layout-related requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLayerSchema = exports.updateLayerSchema = exports.addLayerSchema = exports.getLayersSchema = exports.listLayoutsSchema = exports.duplicateLayoutSchema = exports.deleteLayoutSchema = exports.getLayoutByIdSchema = exports.updateLayoutSchema = exports.createLayoutSchema = void 0;
const zod_1 = require("zod");
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
];
// Nested schemas for layer configuration
const layerContentConfigSchema = zod_1.z.object({
    // Text widget
    text: zod_1.z.string().optional(),
    fontSize: zod_1.z.number().positive().optional(),
    fontFamily: zod_1.z.string().optional(),
    fontWeight: zod_1.z.string().optional(),
    fontStyle: zod_1.z.string().optional(),
    textAlign: zod_1.z.enum(['left', 'center', 'right', 'justify']).optional(),
    color: zod_1.z.string().optional(),
    lineHeight: zod_1.z.number().positive().optional(),
    // Image widget
    imageUrl: zod_1.z.string().url().optional(),
    objectFit: zod_1.z.enum(['cover', 'contain', 'fill', 'scale-down', 'none']).optional(),
    // Video widget
    videoUrl: zod_1.z.string().url().optional(),
    autoplay: zod_1.z.boolean().optional(),
    loop: zod_1.z.boolean().optional(),
    muted: zod_1.z.boolean().optional(),
    controls: zod_1.z.boolean().optional(),
    // Playlist widget
    playlistId: zod_1.z.number().int().positive().optional(),
    // HTML widget
    htmlContent: zod_1.z.string().optional(),
    // Iframe widget
    iframeUrl: zod_1.z.string().url().optional(),
    allowFullscreen: zod_1.z.boolean().optional(),
    // Weather widget
    location: zod_1.z.string().optional(),
    units: zod_1.z.enum(['metric', 'imperial']).optional(),
    apiKey: zod_1.z.string().optional(),
    // RSS/News widget
    feedUrl: zod_1.z.string().url().optional(),
    refreshInterval: zod_1.z.number().int().positive().optional(),
    maxItems: zod_1.z.number().int().positive().optional(),
    // YouTube widget
    videoId: zod_1.z.string().optional(),
    // Clock widget
    format: zod_1.z.string().optional(),
    timezone: zod_1.z.string().optional(),
    // Shape widget
    shapeType: zod_1.z.enum(['rectangle', 'circle', 'ellipse', 'polygon']).optional(),
    fill: zod_1.z.string().optional(),
    stroke: zod_1.z.string().optional(),
    strokeWidth: zod_1.z.number().optional(),
}).optional();
const layerStyleConfigSchema = zod_1.z.object({
    backgroundColor: zod_1.z.string().optional(),
    borderWidth: zod_1.z.number().optional(),
    borderColor: zod_1.z.string().optional(),
    borderRadius: zod_1.z.number().optional(),
    borderStyle: zod_1.z.enum(['solid', 'dashed', 'dotted']).optional(),
    boxShadow: zod_1.z.string().optional(),
    padding: zod_1.z.object({
        top: zod_1.z.number(),
        right: zod_1.z.number(),
        bottom: zod_1.z.number(),
        left: zod_1.z.number(),
    }).optional(),
    blendMode: zod_1.z.string().optional(),
}).optional();
const animationConfigSchema = zod_1.z.object({
    type: zod_1.z.enum(['none', 'fadeIn', 'fadeOut', 'slideIn', 'slideOut', 'zoom', 'rotate', 'bounce']).optional(),
    duration: zod_1.z.number().optional(),
    delay: zod_1.z.number().optional(),
    iterations: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('infinite')]).optional(),
    easing: zod_1.z.string().optional(),
}).optional();
const scheduleConfigSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    startTime: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
    daysOfWeek: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).optional(),
}).optional();
const createLayerSchema = zod_1.z.object({
    layerName: zod_1.z.string().min(1).max(255),
    layerType: zod_1.z.enum(layerTypes),
    zIndex: zod_1.z.number().int().default(0),
    positionX: zod_1.z.number().int(),
    positionY: zod_1.z.number().int(),
    width: zod_1.z.number().int().positive(),
    height: zod_1.z.number().int().positive(),
    rotation: zod_1.z.number().default(0),
    opacity: zod_1.z.number().min(0).max(1).default(1),
    isVisible: zod_1.z.boolean().default(true),
    isLocked: zod_1.z.boolean().default(false),
    contentConfig: layerContentConfigSchema,
    styleConfig: layerStyleConfigSchema,
    animationConfig: animationConfigSchema,
    scheduleConfig: scheduleConfigSchema,
});
exports.createLayoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(255),
        description: zod_1.z.string().max(5000).optional(),
        width: zod_1.z.number().int().min(100).default(1920),
        height: zod_1.z.number().int().min(100).default(1080),
        backgroundColor: zod_1.z.string().default('#000000'),
        tags: zod_1.z.string().max(500).optional(),
        layers: zod_1.z.array(createLayerSchema).optional(),
    }),
});
exports.updateLayoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
        description: zod_1.z.string().max(5000).optional(),
        width: zod_1.z.number().int().min(100).optional(),
        height: zod_1.z.number().int().min(100).optional(),
        backgroundColor: zod_1.z.string().optional(),
        thumbnailUrl: zod_1.z.string().url().optional(),
        tags: zod_1.z.string().max(500).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getLayoutByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    }),
});
exports.deleteLayoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    }),
});
exports.duplicateLayoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
    }),
});
exports.listLayoutsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.getLayersSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    }),
});
exports.addLayerSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
    }),
    body: createLayerSchema,
});
exports.updateLayerSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
        layerId: zod_1.z.string().regex(/^\d+$/, 'Invalid layer ID').transform(Number),
    }),
    body: zod_1.z.object({
        layerName: zod_1.z.string().min(1).max(255).optional(),
        layerType: zod_1.z.enum(layerTypes).optional(),
        zIndex: zod_1.z.number().int().optional(),
        positionX: zod_1.z.number().int().optional(),
        positionY: zod_1.z.number().int().optional(),
        width: zod_1.z.number().int().positive().optional(),
        height: zod_1.z.number().int().positive().optional(),
        rotation: zod_1.z.number().optional(),
        opacity: zod_1.z.number().min(0).max(1).optional(),
        isVisible: zod_1.z.boolean().optional(),
        isLocked: zod_1.z.boolean().optional(),
        contentConfig: layerContentConfigSchema,
        styleConfig: layerStyleConfigSchema,
        animationConfig: animationConfigSchema,
        scheduleConfig: scheduleConfigSchema,
    }),
});
exports.deleteLayerSchema = zod_1.z.object({
    params: zod_1.z.object({
        layoutId: zod_1.z.string().regex(/^\d+$/, 'Invalid layout ID').transform(Number),
        layerId: zod_1.z.string().regex(/^\d+$/, 'Invalid layer ID').transform(Number),
    }),
});
//# sourceMappingURL=layout.validator.js.map