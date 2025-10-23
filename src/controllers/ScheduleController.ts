/**
 * Schedule Controller
 *
 * Handles HTTP requests for schedule management endpoints.
 * Schedules determine when and where layouts are displayed.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { ScheduleService } from '../services/ScheduleService';

export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * GET /api/v1/schedules
   * List all schedules for the authenticated user's customer
   */
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { page, limit, search, isActive, layoutId } = req.query;

      const result = await this.scheduleService.list(customerId, {
        page: page as string,
        limit: limit as string,
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        layoutId: layoutId ? parseInt(layoutId as string, 10) : undefined,
      });

      res.status(200).json({
        status: 'success',
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/schedules/:scheduleId
   * Get schedule by ID with assignments
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const customerId = req.user.customerId;

      const schedule = await this.scheduleService.getByIdWithAssignments(scheduleId, customerId);

      res.status(200).json({
        status: 'success',
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/schedules
   * Create new schedule
   *
   * Expected body:
   * {
   *   "name": "Schedule Name",
   *   "layoutId": 1,
   *   "priority": 50,  // optional, 0-100
   *   "startDate": "2025-01-01",  // optional
   *   "endDate": "2025-12-31",    // optional
   *   "startTime": "09:00:00",    // optional
   *   "endTime": "17:00:00",      // optional
   *   "daysOfWeek": "Mon,Tue,Wed,Thu,Fri"  // optional
   * }
   */
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const userId = req.user.userId;

      const schedule = await this.scheduleService.create({
        customerId,
        name: req.body.name,
        layoutId: req.body.layoutId,
        priority: req.body.priority,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        daysOfWeek: req.body.daysOfWeek,
        createdBy: userId,
      });

      res.status(201).json({
        status: 'success',
        data: schedule,
        message: 'Schedule created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/schedules/:scheduleId
   * Update schedule
   *
   * All fields are optional:
   * {
   *   "name": "Updated Name",
   *   "layoutId": 2,
   *   "priority": 75,
   *   "startDate": "2025-02-01",
   *   "endDate": "2025-11-30",
   *   "startTime": "08:00:00",
   *   "endTime": "18:00:00",
   *   "daysOfWeek": "Mon,Wed,Fri",
   *   "isActive": true
   * }
   */
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const customerId = req.user.customerId;

      const schedule = await this.scheduleService.update(scheduleId, customerId, req.body);

      res.status(200).json({
        status: 'success',
        data: schedule,
        message: 'Schedule updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/schedules/:scheduleId
   * Delete schedule
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const customerId = req.user.customerId;

      await this.scheduleService.delete(scheduleId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Schedule deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/schedules/:scheduleId/assignments
   * Get all assignments for a schedule
   */
  async getAssignments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const customerId = req.user.customerId;

      // Verify schedule belongs to customer
      const schedule = await this.scheduleService.getByIdWithAssignments(scheduleId, customerId);

      if (!schedule) {
        res.status(404).json({
          status: 'error',
          message: 'Schedule not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: schedule.assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/schedules/:scheduleId/assignments
   * Create schedule assignment
   *
   * Expected body (one of the following patterns):
   * { "assignmentType": "Customer", "targetCustomerId": 1 }
   * { "assignmentType": "Site", "targetSiteId": 1 }
   * { "assignmentType": "Player", "targetPlayerId": 1 }
   */
  async createAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const customerId = req.user.customerId;

      const assignment = await this.scheduleService.createAssignment(scheduleId, customerId, {
        scheduleId,
        assignmentType: req.body.assignmentType,
        targetCustomerId: req.body.targetCustomerId,
        targetSiteId: req.body.targetSiteId,
        targetPlayerId: req.body.targetPlayerId,
      });

      res.status(201).json({
        status: 'success',
        data: assignment,
        message: 'Schedule assignment created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/schedules/:scheduleId/assignments/:assignmentId
   * Delete schedule assignment
   */
  async deleteAssignment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const assignmentId = parseInt(req.params.assignmentId, 10);
      const customerId = req.user.customerId;

      await this.scheduleService.deleteAssignment(scheduleId, assignmentId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Schedule assignment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
