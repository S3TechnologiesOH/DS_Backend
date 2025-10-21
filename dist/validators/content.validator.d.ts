/**
 * Content Validation Schemas
 *
 * Zod schemas for content-related requests.
 */
import { z } from 'zod';
export declare const createContentSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        contentType: z.ZodEnum<["Image", "Video", "HTML", "URL", "PDF"]>;
        fileUrl: z.ZodOptional<z.ZodString>;
        thumbnailUrl: z.ZodOptional<z.ZodString>;
        fileSize: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        mimeType: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        fileUrl?: string;
        thumbnailUrl?: string;
        fileSize?: number;
        duration?: number;
        width?: number;
        height?: number;
        mimeType?: string;
        tags?: string;
    }, {
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        fileUrl?: string;
        thumbnailUrl?: string;
        fileSize?: number;
        duration?: number;
        width?: number;
        height?: number;
        mimeType?: string;
        tags?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        fileUrl?: string;
        thumbnailUrl?: string;
        fileSize?: number;
        duration?: number;
        width?: number;
        height?: number;
        mimeType?: string;
        tags?: string;
    };
}, {
    body?: {
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        fileUrl?: string;
        thumbnailUrl?: string;
        fileSize?: number;
        duration?: number;
        width?: number;
        height?: number;
        mimeType?: string;
        tags?: string;
    };
}>;
export declare const updateContentSchema: z.ZodObject<{
    params: z.ZodObject<{
        contentId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        contentId?: number;
    }, {
        contentId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        contentType: z.ZodOptional<z.ZodEnum<["Image", "Video", "HTML", "URL", "PDF"]>>;
        duration: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<["Processing", "Ready", "Failed"]>>;
        tags: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "Processing" | "Ready" | "Failed";
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        duration?: number;
        tags?: string;
    }, {
        status?: "Processing" | "Ready" | "Failed";
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        duration?: number;
        tags?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        contentId?: number;
    };
    body?: {
        status?: "Processing" | "Ready" | "Failed";
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        duration?: number;
        tags?: string;
    };
}, {
    params?: {
        contentId?: string;
    };
    body?: {
        status?: "Processing" | "Ready" | "Failed";
        name?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        description?: string;
        duration?: number;
        tags?: string;
    };
}>;
export declare const getContentByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        contentId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        contentId?: number;
    }, {
        contentId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        contentId?: number;
    };
}, {
    params?: {
        contentId?: string;
    };
}>;
export declare const deleteContentSchema: z.ZodObject<{
    params: z.ZodObject<{
        contentId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        contentId?: number;
    }, {
        contentId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        contentId?: number;
    };
}, {
    params?: {
        contentId?: string;
    };
}>;
export declare const listContentSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        contentType: z.ZodOptional<z.ZodEnum<["Image", "Video", "HTML", "URL", "PDF"]>>;
        status: z.ZodOptional<z.ZodEnum<["Processing", "Ready", "Failed"]>>;
        search: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "Processing" | "Ready" | "Failed";
        search?: string;
        limit?: number;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        tags?: string;
        page?: number;
    }, {
        status?: "Processing" | "Ready" | "Failed";
        search?: string;
        limit?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        tags?: string;
        page?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query?: {
        status?: "Processing" | "Ready" | "Failed";
        search?: string;
        limit?: number;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        tags?: string;
        page?: number;
    };
}, {
    query?: {
        status?: "Processing" | "Ready" | "Failed";
        search?: string;
        limit?: string;
        contentType?: "Image" | "Video" | "HTML" | "URL" | "PDF";
        tags?: string;
        page?: string;
    };
}>;
//# sourceMappingURL=content.validator.d.ts.map