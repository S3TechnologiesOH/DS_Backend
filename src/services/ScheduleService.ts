/**
 * Schedule Service
 *
 * Business logic for schedule management.
 * Handles when and where layouts are played with hierarchical assignment (Customer > Site > Player).
 */

import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { LayoutRepository } from '../repositories/LayoutRepository';
import {
  Schedule,
  ScheduleAssignment,
  CreateScheduleDto,
  UpdateScheduleDto,
  CreateScheduleAssignmentDto,
  ScheduleWithAssignments,
} from '../models';
import { NotFoundError, ValidationError } from '../utils/errors';
import { parsePaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly layoutRepository: LayoutRepository
  ) {}

  /**
   * Get schedule by ID
   */
  async getById(scheduleId: number, customerId: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(scheduleId, customerId);

    if (!schedule) {
      throw new NotFoundError('Schedule not found');
    }

    return schedule;
  }

  /**
   * Get schedule with all assignments
   */
  async getByIdWithAssignments(scheduleId: number, customerId: number): Promise<ScheduleWithAssignments> {
    const schedule = await this.scheduleRepository.findByIdWithAssignments(scheduleId, customerId);

    if (!schedule) {
      throw new NotFoundError('Schedule not found');
    }

    return schedule;
  }

  /**
   * List schedules with pagination and filters
   */
  async list(
    customerId: number,
    filters?: {
      page?: string;
      limit?: string;
      search?: string;
      isActive?: boolean;
      layoutId?: number;
    }
  ): Promise<{ data: Schedule[]; total: number; page: number; limit: number }> {
    const { page, limit } = parsePaginationParams({
      page: filters?.page,
      limit: filters?.limit,
    });

    const offset = (page - 1) * limit;

    // Get schedules
    const schedules = await this.scheduleRepository.findByCustomerId(customerId, {
      isActive: filters?.isActive,
      search: filters?.search,
      layoutId: filters?.layoutId,
      limit,
      offset,
    });

    // Get total count for pagination
    const allSchedules = await this.scheduleRepository.findByCustomerId(customerId, {
      isActive: filters?.isActive,
      search: filters?.search,
      layoutId: filters?.layoutId,
    });
    const total = allSchedules.length;

    logger.info(`Listed ${schedules.length} schedules for customer ${customerId}`);

    return {
      data: schedules,
      total,
      page,
      limit,
    };
  }

  /**
   * Create new schedule
   */
  async create(data: CreateScheduleDto): Promise<Schedule> {
    // Validate schedule name
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Schedule name is required');
    }

    // Validate layout exists
    const layout = await this.layoutRepository.findById(data.layoutId, data.customerId);
    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    // Validate date range if both provided
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (endDate < startDate) {
        throw new ValidationError('End date must be after start date');
      }
    }

    // Validate time range if both provided
    if (data.startTime && data.endTime) {
      // Basic time validation (HH:mm:ss format)
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
        throw new ValidationError('Invalid time format. Use HH:mm:ss');
      }
    }

    // Validate priority
    if (data.priority !== undefined && (data.priority < 0 || data.priority > 100)) {
      throw new ValidationError('Priority must be between 0 and 100');
    }

    const schedule = await this.scheduleRepository.create(data);

    logger.info(`Created schedule ${schedule.scheduleId} for customer ${data.customerId}`);

    return schedule;
  }

  /**
   * Update schedule
   */
  async update(scheduleId: number, customerId: number, data: UpdateScheduleDto): Promise<Schedule> {
    // Validate schedule exists
    await this.getById(scheduleId, customerId);

    // Validate name if provided
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError('Schedule name cannot be empty');
    }

    // Validate layout exists if provided
    if (data.layoutId) {
      const layout = await this.layoutRepository.findById(data.layoutId, customerId);
      if (!layout) {
        throw new NotFoundError('Layout not found');
      }
    }

    // Validate priority if provided
    if (data.priority !== undefined && (data.priority < 0 || data.priority > 100)) {
      throw new ValidationError('Priority must be between 0 and 100');
    }

    const schedule = await this.scheduleRepository.update(scheduleId, customerId, data);

    logger.info(`Updated schedule ${scheduleId}`);

    return schedule;
  }

  /**
   * Delete schedule
   */
  async delete(scheduleId: number, customerId: number): Promise<void> {
    // Validate schedule exists
    await this.getById(scheduleId, customerId);

    // Delete will cascade to assignments if database has cascade delete configured
    await this.scheduleRepository.delete(scheduleId, customerId);

    logger.info(`Deleted schedule ${scheduleId}`);
  }

  /**
   * Create schedule assignment
   */
  async createAssignment(
    scheduleId: number,
    customerId: number,
    data: CreateScheduleAssignmentDto
  ): Promise<ScheduleAssignment> {
    // Validate schedule exists and belongs to customer
    await this.getById(scheduleId, customerId);

    // Validate assignment type and target
    if (data.assignmentType === 'Customer') {
      if (!data.targetCustomerId) {
        throw new ValidationError('Target customer ID is required for Customer assignment');
      }
      // Validate the target customer is the same as the schedule's customer
      if (data.targetCustomerId !== customerId) {
        throw new ValidationError('Can only assign to own customer');
      }
    } else if (data.assignmentType === 'Site') {
      if (!data.targetSiteId) {
        throw new ValidationError('Target site ID is required for Site assignment');
      }
      // TODO: Validate site belongs to customer
    } else if (data.assignmentType === 'Player') {
      if (!data.targetPlayerId) {
        throw new ValidationError('Target player ID is required for Player assignment');
      }
      // TODO: Validate player belongs to customer
    }

    const assignment = await this.scheduleRepository.createAssignment(data);

    logger.info(`Created ${data.assignmentType} assignment for schedule ${scheduleId}`);

    return assignment;
  }

  /**
   * Delete schedule assignment
   */
  async deleteAssignment(
    scheduleId: number,
    assignmentId: number,
    customerId: number
  ): Promise<void> {
    // Validate schedule exists and belongs to customer
    await this.getById(scheduleId, customerId);

    await this.scheduleRepository.deleteAssignment(assignmentId, scheduleId);

    logger.info(`Deleted assignment ${assignmentId} from schedule ${scheduleId}`);
  }

  /**
   * Get active schedules for a player (for schedule resolution)
   * Returns schedules in priority order (Player > Site > Customer)
   */
  async getActiveSchedulesForPlayer(
    playerId: number,
    customerId: number
  ): Promise<ScheduleWithAssignments[]> {
    return this.scheduleRepository.getActiveSchedulesForPlayer(playerId, customerId);
  }
}
