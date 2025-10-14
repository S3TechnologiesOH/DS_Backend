/**
 * Schedule Validation Schemas
 *
 * Zod schemas for schedule-related requests.
 */
import { z } from 'zod';
export declare const createScheduleSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        playlistId: z.ZodNumber;
        priority: z.ZodOptional<z.ZodNumber>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        startTime: z.ZodOptional<z.ZodString>;
        endTime: z.ZodOptional<z.ZodString>;
        daysOfWeek: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    }, {
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body?: {
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    };
}, {
    body?: {
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    };
}>;
export declare const updateScheduleSchema: z.ZodObject<{
    params: z.ZodObject<{
        scheduleId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        scheduleId?: number;
    }, {
        scheduleId?: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        playlistId: z.ZodOptional<z.ZodNumber>;
        priority: z.ZodOptional<z.ZodNumber>;
        startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        startTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        endTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        daysOfWeek: z.ZodOptional<z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    }, {
        isActive?: boolean;
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        scheduleId?: number;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    };
}, {
    params?: {
        scheduleId?: string;
    };
    body?: {
        isActive?: boolean;
        name?: string;
        playlistId?: number;
        priority?: number;
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
        daysOfWeek?: string;
    };
}>;
export declare const getScheduleByIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        scheduleId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        scheduleId?: number;
    }, {
        scheduleId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        scheduleId?: number;
    };
}, {
    params?: {
        scheduleId?: string;
    };
}>;
export declare const deleteScheduleSchema: z.ZodObject<{
    params: z.ZodObject<{
        scheduleId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        scheduleId?: number;
    }, {
        scheduleId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        scheduleId?: number;
    };
}, {
    params?: {
        scheduleId?: string;
    };
}>;
export declare const createScheduleAssignmentSchema: z.ZodObject<{
    params: z.ZodObject<{
        scheduleId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        scheduleId?: number;
    }, {
        scheduleId?: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        assignmentType: z.ZodEnum<["Customer", "Site", "Player"]>;
        targetCustomerId: z.ZodOptional<z.ZodNumber>;
        targetSiteId: z.ZodOptional<z.ZodNumber>;
        targetPlayerId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        assignmentType?: "Customer" | "Site" | "Player";
        targetCustomerId?: number;
        targetSiteId?: number;
        targetPlayerId?: number;
    }, {
        assignmentType?: "Customer" | "Site" | "Player";
        targetCustomerId?: number;
        targetSiteId?: number;
        targetPlayerId?: number;
    }>, {
        assignmentType?: "Customer" | "Site" | "Player";
        targetCustomerId?: number;
        targetSiteId?: number;
        targetPlayerId?: number;
    }, {
        assignmentType?: "Customer" | "Site" | "Player";
        targetCustomerId?: number;
        targetSiteId?: number;
        targetPlayerId?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        scheduleId?: number;
    };
    body?: {
        assignmentType?: "Customer" | "Site" | "Player";
        targetCustomerId?: number;
        targetSiteId?: number;
        targetPlayerId?: number;
    };
}, {
    params?: {
        scheduleId?: string;
    };
    body?: {
        assignmentType?: "Customer" | "Site" | "Player";
        targetCustomerId?: number;
        targetSiteId?: number;
        targetPlayerId?: number;
    };
}>;
export declare const deleteScheduleAssignmentSchema: z.ZodObject<{
    params: z.ZodObject<{
        scheduleId: z.ZodEffects<z.ZodString, number, string>;
        assignmentId: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        scheduleId?: number;
        assignmentId?: number;
    }, {
        scheduleId?: string;
        assignmentId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params?: {
        scheduleId?: number;
        assignmentId?: number;
    };
}, {
    params?: {
        scheduleId?: string;
        assignmentId?: string;
    };
}>;
export declare const listSchedulesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
        playlistId: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        search?: string;
        limit?: number;
        page?: number;
        playlistId?: number;
    }, {
        isActive?: string;
        search?: string;
        limit?: string;
        page?: string;
        playlistId?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query?: {
        isActive?: boolean;
        search?: string;
        limit?: number;
        page?: number;
        playlistId?: number;
    };
}, {
    query?: {
        isActive?: string;
        search?: string;
        limit?: string;
        page?: string;
        playlistId?: string;
    };
}>;
//# sourceMappingURL=schedule.validator.d.ts.map