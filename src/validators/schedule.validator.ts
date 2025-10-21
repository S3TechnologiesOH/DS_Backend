/**
 * Schedule Validation Schemas
 *
 * Zod schemas for schedule-related requests.
 */

import { z } from 'zod';

const assignmentTypes = ['Customer', 'Site', 'Player'] as const;
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const createScheduleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    layoutId: z.number().int().positive('Invalid layout ID'),
    priority: z.number().int().nonnegative().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format (HH:mm:ss)').optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 'Invalid time format (HH:mm:ss)').optional(),
    daysOfWeek: z
      .string()
      .refine(
        (val) => val.split(',').every((day) => daysOfWeek.includes(day.trim())),
        'Invalid days of week format'
      )
      .optional(),
  }),
});

export const updateScheduleSchema = z.object({
  params: z.object({
    scheduleId: z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    layoutId: z.number().int().positive().optional(),
    priority: z.number().int().nonnegative().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).nullable().optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).nullable().optional(),
    daysOfWeek: z
      .string()
      .refine(
        (val) => val.split(',').every((day) => daysOfWeek.includes(day.trim())),
        'Invalid days of week format'
      )
      .nullable()
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getScheduleByIdSchema = z.object({
  params: z.object({
    scheduleId: z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
  }),
});

export const deleteScheduleSchema = z.object({
  params: z.object({
    scheduleId: z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
  }),
});

export const createScheduleAssignmentSchema = z.object({
  params: z.object({
    scheduleId: z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
  }),
  body: z.object({
    assignmentType: z.enum(assignmentTypes, {
      errorMap: () => ({ message: 'Invalid assignment type' }),
    }),
    targetCustomerId: z.number().int().positive().optional(),
    targetSiteId: z.number().int().positive().optional(),
    targetPlayerId: z.number().int().positive().optional(),
  }).refine(
    (data) => {
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
    },
    {
      message: 'Exactly one target must be specified based on assignment type',
    }
  ),
});

export const deleteScheduleAssignmentSchema = z.object({
  params: z.object({
    scheduleId: z.string().regex(/^\d+$/, 'Invalid schedule ID').transform(Number),
    assignmentId: z.string().regex(/^\d+$/, 'Invalid assignment ID').transform(Number),
  }),
});

export const listSchedulesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    isActive: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    layoutId: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
