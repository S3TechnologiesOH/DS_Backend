/**
 * Schedule Repository
 *
 * Database operations for Schedules and ScheduleAssignments tables.
 */
import { BaseRepository } from './BaseRepository';
import { Schedule, ScheduleAssignment, CreateScheduleDto, UpdateScheduleDto, CreateScheduleAssignmentDto, ScheduleWithAssignments } from '../models';
export declare class ScheduleRepository extends BaseRepository {
    /**
     * Find schedule by ID
     */
    findById(scheduleId: number, customerId: number): Promise<Schedule | null>;
    /**
     * Find schedule with assignments
     */
    findByIdWithAssignments(scheduleId: number, customerId: number): Promise<ScheduleWithAssignments | null>;
    /**
     * Get all schedules for a customer
     */
    findByCustomerId(customerId: number, options?: {
        isActive?: boolean;
        playlistId?: number;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Schedule[]>;
    /**
     * Create new schedule
     */
    create(data: CreateScheduleDto): Promise<Schedule>;
    /**
     * Update schedule
     */
    update(scheduleId: number, customerId: number, data: UpdateScheduleDto): Promise<Schedule>;
    /**
     * Delete schedule
     */
    delete(scheduleId: number, customerId: number): Promise<void>;
    /**
     * Create schedule assignment
     */
    createAssignment(data: CreateScheduleAssignmentDto): Promise<ScheduleAssignment>;
    /**
     * Delete schedule assignment
     */
    deleteAssignment(assignmentId: number, scheduleId: number): Promise<void>;
    /**
     * Get assignments for a schedule
     */
    getAssignments(scheduleId: number): Promise<ScheduleAssignment[]>;
    /**
     * Get active schedules for a player (for schedule resolution)
     */
    getActiveSchedulesForPlayer(playerId: number, customerId: number): Promise<ScheduleWithAssignments[]>;
}
//# sourceMappingURL=ScheduleRepository.d.ts.map