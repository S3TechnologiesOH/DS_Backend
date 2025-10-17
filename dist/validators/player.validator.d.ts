/**
 * Player Validation Schemas
 *
 * Zod schemas for player-related requests.
 */
import { z } from 'zod';
export declare const createPlayerSchema: z.ZodObject<{
    body: z.ZodObject<{
        siteId: z.ZodNumber;
        name: z.ZodString;
        playerCode: z.ZodString;
        macAddress: z.ZodOptional<z.ZodString>;
        serialNumber: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        screenResolution: z.ZodOptional<z.ZodString>;
        orientation: z.ZodOptional<z.ZodEnum<["Landscape", "Portrait"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        siteId?: number;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
    }, {
        name?: string;
        siteId?: number;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        name?: string;
        siteId?: number;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
    };
}, {
    body?: {
        name?: string;
        siteId?: number;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
    };
}>;
export declare const updatePlayerSchema: z.ZodObject<{
    params: z.ZodObject<{
        playerId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playerId?: number;
    }, {
        playerId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        playerCode: z.ZodOptional<z.ZodString>;
        macAddress: z.ZodOptional<z.ZodString>;
        serialNumber: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        screenResolution: z.ZodOptional<z.ZodString>;
        orientation: z.ZodOptional<z.ZodEnum<["Landscape", "Portrait"]>>;
        status: z.ZodOptional<z.ZodEnum<["Online", "Offline", "Error"]>>;
        ipAddress: z.ZodOptional<z.ZodString>;
        playerVersion: z.ZodOptional<z.ZodString>;
        osVersion: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        status?: "Online" | "Offline" | "Error";
        isActive?: boolean;
        name?: string;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    }, {
        status?: "Online" | "Offline" | "Error";
        isActive?: boolean;
        name?: string;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playerId?: number;
    };
    body?: {
        status?: "Online" | "Offline" | "Error";
        isActive?: boolean;
        name?: string;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    };
}, {
    params?: {
        playerId?: string;
    };
    body?: {
        status?: "Online" | "Offline" | "Error";
        isActive?: boolean;
        name?: string;
        playerCode?: string;
        macAddress?: string;
        serialNumber?: string;
        location?: string;
        screenResolution?: string;
        orientation?: "Landscape" | "Portrait";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    };
}>;
export declare const getPlayerByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        playerId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playerId?: number;
    }, {
        playerId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playerId?: number;
    };
}, {
    params?: {
        playerId?: string;
    };
}>;
export declare const deletePlayerSchema: z.ZodObject<{
    params: z.ZodObject<{
        playerId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playerId?: number;
    }, {
        playerId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playerId?: number;
    };
}, {
    params?: {
        playerId?: string;
    };
}>;
export declare const playerHeartbeatSchema: z.ZodObject<{
    params: z.ZodObject<{
        playerId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        playerId?: number;
    }, {
        playerId?: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["Online", "Offline", "Error"]>;
        ipAddress: z.ZodOptional<z.ZodString>;
        playerVersion: z.ZodOptional<z.ZodString>;
        osVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "Online" | "Offline" | "Error";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    }, {
        status?: "Online" | "Offline" | "Error";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        playerId?: number;
    };
    body?: {
        status?: "Online" | "Offline" | "Error";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    };
}, {
    params?: {
        playerId?: string;
    };
    body?: {
        status?: "Online" | "Offline" | "Error";
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    };
}>;
export declare const activatePlayerSchema: z.ZodObject<{
    body: z.ZodObject<{
        activationCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        activationCode?: string;
    }, {
        activationCode?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        activationCode?: string;
    };
}, {
    body?: {
        activationCode?: string;
    };
}>;
export declare const listPlayersSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        siteId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        status: z.ZodOptional<z.ZodEnum<["Online", "Offline", "Error"]>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "Online" | "Offline" | "Error";
        siteId?: number;
        search?: string;
        limit?: number;
        page?: number;
    }, {
        status?: "Online" | "Offline" | "Error";
        siteId?: string;
        search?: string;
        limit?: string;
        page?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query?: {
        status?: "Online" | "Offline" | "Error";
        siteId?: number;
        search?: string;
        limit?: number;
        page?: number;
    };
}, {
    query?: {
        status?: "Online" | "Offline" | "Error";
        siteId?: string;
        search?: string;
        limit?: string;
        page?: string;
    };
}>;
//# sourceMappingURL=player.validator.d.ts.map