/**
 * Playlist Validation Schemas
 *
 * Zod schemas for playlist-related requests.
 */
import { z } from 'zod';
export declare const createPlaylistSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        description?: string;
    }, {
        name?: string;
        description?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        name?: string;
        description?: string;
    };
}, {
    body?: {
        name?: string;
        description?: string;
    };
}>;
export declare const updatePlaylistSchema: z.ZodObject<{
    params: z.ZodObject<{
        playlistId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playlistId?: number;
    }, {
        playlistId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        name?: string;
        description?: string;
    }, {
        isActive?: boolean;
        name?: string;
        description?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playlistId?: number;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        description?: string;
    };
}, {
    params?: {
        playlistId?: string;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        description?: string;
    };
}>;
export declare const getPlaylistByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        playlistId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playlistId?: number;
    }, {
        playlistId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playlistId?: number;
    };
}, {
    params?: {
        playlistId?: string;
    };
}>;
export declare const deletePlaylistSchema: z.ZodObject<{
    params: z.ZodObject<{
        playlistId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playlistId?: number;
    }, {
        playlistId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playlistId?: number;
    };
}, {
    params?: {
        playlistId?: string;
    };
}>;
export declare const addPlaylistItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        playlistId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playlistId?: number;
    }, {
        playlistId?: string;
    }>;
    body: z.ZodObject<{
        contentId: z.ZodNumber;
        displayOrder: z.ZodNumber;
        duration: z.ZodOptional<z.ZodNumber>;
        transitionType: z.ZodOptional<z.ZodEnum<["Fade", "Slide", "None"]>>;
        transitionDuration: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        contentId?: number;
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    }, {
        contentId?: number;
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playlistId?: number;
    };
    body?: {
        contentId?: number;
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    };
}, {
    params?: {
        playlistId?: string;
    };
    body?: {
        contentId?: number;
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    };
}>;
export declare const updatePlaylistItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        playlistId: z.ZodEffects<z.ZodString, number, string>;
        itemId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playlistId?: number;
        itemId?: number;
    }, {
        playlistId?: string;
        itemId?: string;
    }>;
    body: z.ZodObject<{
        displayOrder: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        transitionType: z.ZodOptional<z.ZodEnum<["Fade", "Slide", "None"]>>;
        transitionDuration: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    }, {
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playlistId?: number;
        itemId?: number;
    };
    body?: {
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    };
}, {
    params?: {
        playlistId?: string;
        itemId?: string;
    };
    body?: {
        duration?: number;
        displayOrder?: number;
        transitionType?: "Fade" | "Slide" | "None";
        transitionDuration?: number;
    };
}>;
export declare const removePlaylistItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        playlistId: z.ZodEffects<z.ZodString, number, string>;
        itemId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playlistId?: number;
        itemId?: number;
    }, {
        playlistId?: string;
        itemId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playlistId?: number;
        itemId?: number;
    };
}, {
    params?: {
        playlistId?: string;
        itemId?: string;
    };
}>;
export declare const listPlaylistsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        search?: string;
        limit?: number;
        page?: number;
    }, {
        isActive?: string;
        search?: string;
        limit?: string;
        page?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query?: {
        isActive?: boolean;
        search?: string;
        limit?: number;
        page?: number;
    };
}, {
    query?: {
        isActive?: string;
        search?: string;
        limit?: string;
        page?: string;
    };
}>;
//# sourceMappingURL=playlist.validator.d.ts.map