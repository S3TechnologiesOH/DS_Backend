/**
 * Schedule Service
 *
 * Business logic for schedule management.
 * Handles when and where playlists are played with hierarchical assignment (Customer > Site > Player).
 */
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { PlaylistRepository } from '../repositories/PlaylistRepository';
import { Schedule, ScheduleAssignment, CreateScheduleDto, UpdateScheduleDto, CreateScheduleAssignmentDto, ScheduleWithAssignments } from '../models';
export declare class ScheduleService {
    private readonly scheduleRepository;
    private readonly playlistRepository;
    constructor(scheduleRepository: ScheduleRepository, playlistRepository: PlaylistRepository);
    /**
     * Get schedule by ID
     */
    getById(scheduleId: number, customerId: number): Promise<Schedule>;
    /**
     * Get schedule with all assignments
     */
    getByIdWithAssignments(scheduleId: number, customerId: number): Promise<ScheduleWithAssignments>;
    /**
     * List schedules with pagination and filters
     */
    list(customerId: number, filters?: {
        page?: string;
        limit?: string;
        search?: string;
        isActive?: boolean;
        playlistId?: number;
    }): Promise<{
        data: Schedule[];
        total: number;
        page: number;
        limit: number;
    }>;
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
    createAssignment(scheduleId: number, customerId: number, data: CreateScheduleAssignmentDto): Promise<ScheduleAssignment>;
    /**
     * Delete schedule assignment
     */
    deleteAssignment(scheduleId: number, assignmentId: number, customerId: number): Promise<void>;
    /**
     * Get active schedules for a player (for schedule resolution)
     * Returns schedules in priority order (Player > Site > Customer)
     */
    getActiveSchedulesForPlayer(playerId: number, customerId: number): Promise<ScheduleWithAssignments[]>;
}
//# sourceMappingURL=ScheduleService.d.ts.map