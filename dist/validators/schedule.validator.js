"use strict";
/**
 * Schedule Validation Schemas
 *
 * Zod schemas for schedule-related requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchedulesSchema = exports.deleteScheduleAssignmentSchema = exports.createScheduleAssignmentSchema = exports.deleteScheduleSchema = exports.getScheduleByIdSchema = exports.updateScheduleSchema = exports.createScheduleSchema = void 0;
const zod_1 = require("zod");
const assignmentTypes = ['Customer', 'Site', 'Player'];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
exports.createScheduleSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(255),
        layoutId: zod_1.z.number().int().positive('Invalid layout ID'),
        priority: zod_1.z.number().int().nonnegative().optional(),
        startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
        endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
        startTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format (HH:mm:ss)').optional(),
        endTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format (HH:mm:ss)').optional(),
        daysOfWeek: zod_1.z
            .string()
            .refine((val) => val.split(',').every((day) => daysOfWeek.includes(day.trim())), 'Invalid days of week format')
            .optional(),
    }),
});
exports.updateScheduleSchema = zod_1.z.object({
    params: zod_1.z.object({
        scheduleId: zod_1.z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
        layoutId: zod_1.z.number().int().positive().optional(),
        priority: zod_1.z.number().int().nonnegative().optional(),
        startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
        endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
        startTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).nullable().optional(),
        endTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).nullable().optional(),
        daysOfWeek: zod_1.z
            .string()
            .refine((val) => val.split(',').every((day) => daysOfWeek.includes(day.trim())), 'Invalid days of week format')
            .nullable()
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getScheduleByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        scheduleId: zod_1.z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
    }),
});
exports.deleteScheduleSchema = zod_1.z.object({
    params: zod_1.z.object({
        scheduleId: zod_1.z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
    }),
});
exports.createScheduleAssignmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        scheduleId: zod_1.z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
    }),
    body: zod_1.z.object({
        assignmentType: zod_1.z.enum(assignmentTypes, {
            errorMap: () => ({ message: 'Invalid assignment type' }),
        }),
        targetCustomerId: zod_1.z.number().int().positive().optional(),
        targetSiteId: zod_1.z.number().int().positive().optional(),
        targetPlayerId: zod_1.z.number().int().positive().optional(),
    }).refine((data) => {
        // Ensure exactly one target is provided based on assignment type
        if (data.assignmentType === 'Customer') {
            return data.targetCustomerId && !data.targetSiteId && !data.targetPlayerId;
        }
        if (data.assignmentType === 'Site') {
            return data.targetSiteId && !data.targetCustomerId && !data.targetPlayerId;
        }
        if (data.assignmentType === 'Player') {
            return data.targetPlayerId && !data.targetCustomerId && !data.targetSiteId;
        }
        return false;
    }, {
        message: 'Exactly one target must be specified based on assignment type',
    }),
});
exports.deleteScheduleAssignmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        scheduleId: zod_1.z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
        assignmentId: zod_1.z.string().regex(/^\d+$/, 'Invalid assignment ID').transform(Number),
    }),
});
exports.listSchedulesSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        search: zod_1.z.string().optional(),
        isActive: zod_1.z
            .string()
            .transform((val) => val === 'true')
            .optional(),
        layoutId: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }),
});
//# sourceMappingURL=schedule.validator.js.map