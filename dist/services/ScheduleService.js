"use strict";
/**
 * Schedule Service
 *
 * Business logic for schedule management.
 * Handles when and where playlists are played with hierarchical assignment (Customer > Site > Player).
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
class ScheduleService {
    scheduleRepository;
    playlistRepository;
    constructor(scheduleRepository, playlistRepository) {
        this.scheduleRepository = scheduleRepository;
        this.playlistRepository = playlistRepository;
    }
    /**
     * Get schedule by ID
     */
    async getById(scheduleId, customerId) {
        const schedule = await this.scheduleRepository.findById(scheduleId, customerId);
        if (!schedule) {
            throw new errors_1.NotFoundError('Schedule not found');
        }
        return schedule;
    }
    /**
     * Get schedule with all assignments
     */
    async getByIdWithAssignments(scheduleId, customerId) {
        const schedule = await this.scheduleRepository.findByIdWithAssignments(scheduleId, customerId);
        if (!schedule) {
            throw new errors_1.NotFoundError('Schedule not found');
        }
        return schedule;
    }
    /**
     * List schedules with pagination and filters
     */
    async list(customerId, filters) {
        const { page, limit } = (0, helpers_1.parsePaginationParams)({
            page: filters?.page,
            limit: filters?.limit,
        });
        const offset = (page - 1) * limit;
        // Get schedules
        const schedules = await this.scheduleRepository.findByCustomerId(customerId, {
            isActive: filters?.isActive,
            search: filters?.search,
            playlistId: filters?.playlistId,
            limit,
            offset,
        });
        // Get total count for pagination
        const allSchedules = await this.scheduleRepository.findByCustomerId(customerId, {
            isActive: filters?.isActive,
            search: filters?.search,
            playlistId: filters?.playlistId,
        });
        const total = allSchedules.length;
        logger_1.default.info(`Listed ${schedules.length} schedules for customer ${customerId}`);
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
    async create(data) {
        // Validate schedule name
        if (!data.name || data.name.trim().length === 0) {
            throw new errors_1.ValidationError('Schedule name is required');
        }
        // Validate playlist exists
        const playlist = await this.playlistRepository.findById(data.playlistId, data.customerId);
        if (!playlist) {
            throw new errors_1.NotFoundError('Playlist not found');
        }
        // Validate date range if both provided
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            if (endDate < startDate) {
                throw new errors_1.ValidationError('End date must be after start date');
            }
        }
        // Validate time range if both provided
        if (data.startTime && data.endTime) {
            // Basic time validation (HH:mm:ss format)
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
                throw new errors_1.ValidationError('Invalid time format. Use HH:mm:ss');
            }
        }
        // Validate priority
        if (data.priority !== undefined && (data.priority < 0 || data.priority > 100)) {
            throw new errors_1.ValidationError('Priority must be between 0 and 100');
        }
        const schedule = await this.scheduleRepository.create(data);
        logger_1.default.info(`Created schedule ${schedule.scheduleId} for customer ${data.customerId}`);
        return schedule;
    }
    /**
     * Update schedule
     */
    async update(scheduleId, customerId, data) {
        // Validate schedule exists
        await this.getById(scheduleId, customerId);
        // Validate name if provided
        if (data.name !== undefined && data.name.trim().length === 0) {
            throw new errors_1.ValidationError('Schedule name cannot be empty');
        }
        // Validate playlist exists if provided
        if (data.playlistId) {
            const playlist = await this.playlistRepository.findById(data.playlistId, customerId);
            if (!playlist) {
                throw new errors_1.NotFoundError('Playlist not found');
            }
        }
        // Validate priority if provided
        if (data.priority !== undefined && (data.priority < 0 || data.priority > 100)) {
            throw new errors_1.ValidationError('Priority must be between 0 and 100');
        }
        const schedule = await this.scheduleRepository.update(scheduleId, customerId, data);
        logger_1.default.info(`Updated schedule ${scheduleId}`);
        return schedule;
    }
    /**
     * Delete schedule
     */
    async delete(scheduleId, customerId) {
        // Validate schedule exists
        await this.getById(scheduleId, customerId);
        // Delete will cascade to assignments if database has cascade delete configured
        await this.scheduleRepository.delete(scheduleId, customerId);
        logger_1.default.info(`Deleted schedule ${scheduleId}`);
    }
    /**
     * Create schedule assignment
     */
    async createAssignment(scheduleId, customerId, data) {
        // Validate schedule exists and belongs to customer
        await this.getById(scheduleId, customerId);
        // Validate assignment type and target
        if (data.assignmentType === 'Customer') {
            if (!data.targetCustomerId) {
                throw new errors_1.ValidationError('Target customer ID is required for Customer assignment');
            }
            // Validate the target customer is the same as the schedule's customer
            if (data.targetCustomerId !== customerId) {
                throw new errors_1.ValidationError('Can only assign to own customer');
            }
        }
        else if (data.assignmentType === 'Site') {
            if (!data.targetSiteId) {
                throw new errors_1.ValidationError('Target site ID is required for Site assignment');
            }
            // TODO: Validate site belongs to customer
        }
        else if (data.assignmentType === 'Player') {
            if (!data.targetPlayerId) {
                throw new errors_1.ValidationError('Target player ID is required for Player assignment');
            }
            // TODO: Validate player belongs to customer
        }
        const assignment = await this.scheduleRepository.createAssignment(data);
        logger_1.default.info(`Created ${data.assignmentType} assignment for schedule ${scheduleId}`);
        return assignment;
    }
    /**
     * Delete schedule assignment
     */
    async deleteAssignment(scheduleId, assignmentId, customerId) {
        // Validate schedule exists and belongs to customer
        await this.getById(scheduleId, customerId);
        await this.scheduleRepository.deleteAssignment(assignmentId, scheduleId);
        logger_1.default.info(`Deleted assignment ${assignmentId} from schedule ${scheduleId}`);
    }
    /**
     * Get active schedules for a player (for schedule resolution)
     * Returns schedules in priority order (Player > Site > Customer)
     */
    async getActiveSchedulesForPlayer(playerId, customerId) {
        return this.scheduleRepository.getActiveSchedulesForPlayer(playerId, customerId);
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=ScheduleService.js.map