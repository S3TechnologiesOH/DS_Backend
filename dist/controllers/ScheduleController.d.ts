/**
 * Schedule Controller
 *
 * Handles HTTP requests for schedule management endpoints.
 * Schedules determine when and where playlists are displayed.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { ScheduleService } from '../services/ScheduleService';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    /**
     * GET /api/v1/schedules
     * List all schedules for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/schedules/:scheduleId
     * Get schedule by ID with assignments
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/schedules
     * Create new schedule
     *
     * Expected body:
     * {
     *   "name": "Schedule Name",
     *   "playlistId": 1,
     *   "priority": 50,  // optional, 0-100
     *   "startDate": "2025-01-01",  // optional
     *   "endDate": "2025-12-31",    // optional
     *   "startTime": "09:00:00",    // optional
     *   "endTime": "17:00:00",      // optional
     *   "daysOfWeek": "Mon,Tue,Wed,Thu,Fri"  // optional
     * }
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/schedules/:scheduleId
     * Update schedule
     *
     * All fields are optional:
     * {
     *   "name": "Updated Name",
     *   "playlistId": 2,
     *   "priority": 75,
     *   "startDate": "2025-02-01",
     *   "endDate": "2025-11-30",
     *   "startTime": "08:00:00",
     *   "endTime": "18:00:00",
     *   "daysOfWeek": "Mon,Wed,Fri",
     *   "isActive": true
     * }
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/schedules/:scheduleId
     * Delete schedule
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/schedules/:scheduleId/assignments
     * Create schedule assignment
     *
     * Expected body (one of the following patterns):
     * { "assignmentType": "Customer", "targetCustomerId": 1 }
     * { "assignmentType": "Site", "targetSiteId": 1 }
     * { "assignmentType": "Player", "targetPlayerId": 1 }
     */
    createAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/schedules/:scheduleId/assignments/:assignmentId
     * Delete schedule assignment
     */
    deleteAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ScheduleController.d.ts.map