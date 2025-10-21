"use strict";
/**
 * Schedule Repository
 *
 * Database operations for Schedules and ScheduleAssignments tables.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const errors_1 = require("../utils/errors");
class ScheduleRepository extends BaseRepository_1.BaseRepository {
    /**
     * Find schedule by ID
     */
    async findById(scheduleId, customerId) {
        const sql = `
      SELECT
        ScheduleId as scheduleId,
        CustomerId as customerId,
        Name as name,
        LayoutId as layoutId,
        Priority as priority,
        StartDate as startDate,
        EndDate as endDate,
        StartTime as startTime,
        EndTime as endTime,
        DaysOfWeek as daysOfWeek,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Schedules
      WHERE ScheduleId = @scheduleId AND CustomerId = @customerId
    `;
        return this.queryOne(sql, { scheduleId, customerId });
    }
    /**
     * Find schedule with assignments
     */
    async findByIdWithAssignments(scheduleId, customerId) {
        const sql = `
      SELECT
        s.ScheduleId as scheduleId,
        s.CustomerId as customerId,
        s.Name as name,
        s.LayoutId as layoutId,
        s.Priority as priority,
        s.StartDate as startDate,
        s.EndDate as endDate,
        s.StartTime as startTime,
        s.EndTime as endTime,
        s.DaysOfWeek as daysOfWeek,
        s.IsActive as isActive,
        s.CreatedBy as createdBy,
        s.CreatedAt as createdAt,
        s.UpdatedAt as updatedAt,
        l.Name as layoutName
      FROM Schedules s
      INNER JOIN Layouts l ON s.LayoutId = l.LayoutId
      WHERE s.ScheduleId = @scheduleId AND s.CustomerId = @customerId;

      SELECT
        AssignmentId as assignmentId,
        ScheduleId as scheduleId,
        AssignmentType as assignmentType,
        TargetCustomerId as targetCustomerId,
        TargetSiteId as targetSiteId,
        TargetPlayerId as targetPlayerId,
        CreatedAt as createdAt
      FROM ScheduleAssignments
      WHERE ScheduleId = @scheduleId;
    `;
        const result = await this.queryMultipleResultSets(sql, { scheduleId, customerId });
        if (result.recordsets[0].length === 0) {
            return null;
        }
        const scheduleData = result.recordsets[0][0];
        const assignmentsData = result.recordsets[1];
        return {
            scheduleId: scheduleData.scheduleId,
            customerId: scheduleData.customerId,
            name: scheduleData.name,
            layoutId: scheduleData.layoutId,
            priority: scheduleData.priority,
            startDate: scheduleData.startDate,
            endDate: scheduleData.endDate,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            daysOfWeek: scheduleData.daysOfWeek,
            isActive: scheduleData.isActive,
            createdBy: scheduleData.createdBy,
            createdAt: scheduleData.createdAt,
            updatedAt: scheduleData.updatedAt,
            layoutName: scheduleData.layoutName,
            assignments: assignmentsData,
        };
    }
    /**
     * Get all schedules for a customer
     */
    async findByCustomerId(customerId, options) {
        let sql = `
      SELECT
        ScheduleId as scheduleId,
        CustomerId as customerId,
        Name as name,
        LayoutId as layoutId,
        Priority as priority,
        StartDate as startDate,
        EndDate as endDate,
        StartTime as startTime,
        EndTime as endTime,
        DaysOfWeek as daysOfWeek,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Schedules
      WHERE CustomerId = @customerId
    `;
        const params = { customerId };
        if (options?.isActive !== undefined) {
            sql += ' AND IsActive = @isActive';
            params.isActive = options.isActive;
        }
        if (options?.layoutId) {
            sql += ' AND LayoutId = @layoutId';
            params.layoutId = options.layoutId;
        }
        if (options?.search) {
            sql += ' AND Name LIKE @search';
            params.search = `%${options.search}%`;
        }
        sql += ' ORDER BY Priority DESC, Name ASC';
        if (options?.limit) {
            sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
            params.offset = options.offset || 0;
            params.limit = options.limit;
        }
        return this.queryMany(sql, params);
    }
    /**
     * Create new schedule
     */
    async create(data) {
        const sql = `
      INSERT INTO Schedules (
        CustomerId, Name, LayoutId, Priority, StartDate, EndDate, StartTime, EndTime, DaysOfWeek, CreatedBy
      )
      OUTPUT
        INSERTED.ScheduleId as scheduleId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.LayoutId as layoutId,
        INSERTED.Priority as priority,
        INSERTED.StartDate as startDate,
        INSERTED.EndDate as endDate,
        INSERTED.StartTime as startTime,
        INSERTED.EndTime as endTime,
        INSERTED.DaysOfWeek as daysOfWeek,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @customerId, @name, @layoutId, @priority, @startDate, @endDate, @startTime, @endTime, @daysOfWeek, @createdBy
      )
    `;
        return this.insert(sql, {
            customerId: data.customerId,
            name: data.name,
            layoutId: data.layoutId,
            priority: data.priority || 50,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            startTime: data.startTime || null,
            endTime: data.endTime || null,
            daysOfWeek: data.daysOfWeek || null,
            createdBy: data.createdBy,
        });
    }
    /**
     * Update schedule
     */
    async update(scheduleId, customerId, data) {
        const updates = [];
        const params = { scheduleId, customerId };
        if (data.name !== undefined) {
            updates.push('Name = @name');
            params.name = data.name;
        }
        if (data.layoutId !== undefined) {
            updates.push('LayoutId = @layoutId');
            params.layoutId = data.layoutId;
        }
        if (data.priority !== undefined) {
            updates.push('Priority = @priority');
            params.priority = data.priority;
        }
        if (data.startDate !== undefined) {
            updates.push('StartDate = @startDate');
            params.startDate = data.startDate;
        }
        if (data.endDate !== undefined) {
            updates.push('EndDate = @endDate');
            params.endDate = data.endDate;
        }
        if (data.startTime !== undefined) {
            updates.push('StartTime = @startTime');
            params.startTime = data.startTime;
        }
        if (data.endTime !== undefined) {
            updates.push('EndTime = @endTime');
            params.endTime = data.endTime;
        }
        if (data.daysOfWeek !== undefined) {
            updates.push('DaysOfWeek = @daysOfWeek');
            params.daysOfWeek = data.daysOfWeek;
        }
        if (data.isActive !== undefined) {
            updates.push('IsActive = @isActive');
            params.isActive = data.isActive;
        }
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        updates.push('UpdatedAt = GETUTCDATE()');
        const sql = `
      UPDATE Schedules
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.ScheduleId as scheduleId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.LayoutId as layoutId,
        INSERTED.Priority as priority,
        INSERTED.StartDate as startDate,
        INSERTED.EndDate as endDate,
        INSERTED.StartTime as startTime,
        INSERTED.EndTime as endTime,
        INSERTED.DaysOfWeek as daysOfWeek,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE ScheduleId = @scheduleId AND CustomerId = @customerId
    `;
        const result = await this.insert(sql, params);
        if (!result) {
            throw new errors_1.NotFoundError('Schedule not found');
        }
        return result;
    }
    /**
     * Delete schedule
     */
    async delete(scheduleId, customerId) {
        const sql = `
      DELETE FROM Schedules
      WHERE ScheduleId = @scheduleId AND CustomerId = @customerId
    `;
        const rowsAffected = await this.execute(sql, { scheduleId, customerId });
        if (rowsAffected === 0) {
            throw new errors_1.NotFoundError('Schedule not found');
        }
    }
    /**
     * Create schedule assignment
     */
    async createAssignment(data) {
        const sql = `
      INSERT INTO ScheduleAssignments (
        ScheduleId, AssignmentType, TargetCustomerId, TargetSiteId, TargetPlayerId
      )
      OUTPUT
        INSERTED.AssignmentId as assignmentId,
        INSERTED.ScheduleId as scheduleId,
        INSERTED.AssignmentType as assignmentType,
        INSERTED.TargetCustomerId as targetCustomerId,
        INSERTED.TargetSiteId as targetSiteId,
        INSERTED.TargetPlayerId as targetPlayerId,
        INSERTED.CreatedAt as createdAt
      VALUES (@scheduleId, @assignmentType, @targetCustomerId, @targetSiteId, @targetPlayerId)
    `;
        return this.insert(sql, {
            scheduleId: data.scheduleId,
            assignmentType: data.assignmentType,
            targetCustomerId: data.targetCustomerId || null,
            targetSiteId: data.targetSiteId || null,
            targetPlayerId: data.targetPlayerId || null,
        });
    }
    /**
     * Delete schedule assignment
     */
    async deleteAssignment(assignmentId, scheduleId) {
        const sql = `
      DELETE FROM ScheduleAssignments
      WHERE AssignmentId = @assignmentId AND ScheduleId = @scheduleId
    `;
        const rowsAffected = await this.execute(sql, { assignmentId, scheduleId });
        if (rowsAffected === 0) {
            throw new errors_1.NotFoundError('Schedule assignment not found');
        }
    }
    /**
     * Get assignments for a schedule
     */
    async getAssignments(scheduleId) {
        const sql = `
      SELECT
        AssignmentId as assignmentId,
        ScheduleId as scheduleId,
        AssignmentType as assignmentType,
        TargetCustomerId as targetCustomerId,
        TargetSiteId as targetSiteId,
        TargetPlayerId as targetPlayerId,
        CreatedAt as createdAt
      FROM ScheduleAssignments
      WHERE ScheduleId = @scheduleId
    `;
        return this.queryMany(sql, { scheduleId });
    }
    /**
     * Get active schedules for a player (for schedule resolution)
     */
    async getActiveSchedulesForPlayer(playerId, customerId) {
        const sql = `
      SELECT DISTINCT
        s.ScheduleId as scheduleId,
        s.CustomerId as customerId,
        s.Name as name,
        s.LayoutId as layoutId,
        s.Priority as priority,
        s.StartDate as startDate,
        s.EndDate as endDate,
        s.StartTime as startTime,
        s.EndTime as endTime,
        s.DaysOfWeek as daysOfWeek,
        s.IsActive as isActive,
        s.CreatedBy as createdBy,
        s.CreatedAt as createdAt,
        s.UpdatedAt as updatedAt,
        l.Name as layoutName,
        sa.AssignmentType as assignmentType
      FROM Schedules s
      INNER JOIN Layouts l ON s.LayoutId = l.LayoutId
      INNER JOIN ScheduleAssignments sa ON s.ScheduleId = sa.ScheduleId
      INNER JOIN Players pl ON pl.PlayerId = @playerId
      WHERE s.CustomerId = @customerId
        AND s.IsActive = 1
        AND (
          (sa.AssignmentType = 'Customer' AND sa.TargetCustomerId = @customerId)
          OR (sa.AssignmentType = 'Site' AND sa.TargetSiteId = pl.SiteId)
          OR (sa.AssignmentType = 'Player' AND sa.TargetPlayerId = @playerId)
        )
      ORDER BY s.Priority DESC
    `;
        const schedules = await this.queryMany(sql, {
            playerId,
            customerId,
        });
        // For each schedule, get its assignments
        const result = [];
        for (const schedule of schedules) {
            const assignments = await this.getAssignments(schedule.scheduleId);
            result.push({
                scheduleId: schedule.scheduleId,
                customerId: schedule.customerId,
                name: schedule.name,
                layoutId: schedule.layoutId,
                priority: schedule.priority,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                daysOfWeek: schedule.daysOfWeek,
                isActive: schedule.isActive,
                createdBy: schedule.createdBy,
                createdAt: schedule.createdAt,
                updatedAt: schedule.updatedAt,
                layoutName: schedule.layoutName,
                assignments,
            });
        }
        return result;
    }
}
exports.ScheduleRepository = ScheduleRepository;
//# sourceMappingURL=ScheduleRepository.js.map