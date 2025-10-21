"use strict";
/**
 * Proof of Play Repository
 *
 * Data access layer for tracking layout playback events.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofOfPlayRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class ProofOfPlayRepository extends BaseRepository_1.BaseRepository {
    /**
     * Map database row to ProofOfPlay model
     */
    mapToModel(row) {
        return {
            proofOfPlayId: row.ProofOfPlayId,
            playerId: row.PlayerId,
            layoutId: row.LayoutId,
            playlistId: row.PlaylistId,
            scheduleId: row.ScheduleId,
            playbackStartTime: row.PlaybackStartTime,
            playbackEndTime: row.PlaybackEndTime,
            duration: row.Duration,
            isCompleted: row.IsCompleted,
            createdAt: row.CreatedAt,
        };
    }
    /**
     * Create a new proof of play record
     */
    async create(data) {
        const sql = `
      INSERT INTO ProofOfPlay (
        PlayerId,
        LayoutId,
        PlaylistId,
        ScheduleId,
        PlaybackStartTime,
        Duration,
        IsCompleted
      )
      OUTPUT INSERTED.*
      VALUES (
        @playerId,
        @layoutId,
        @playlistId,
        @scheduleId,
        @playedAt,
        @duration,
        1
      );
    `;
        const row = await this.insert(sql, {
            playerId: data.playerId,
            layoutId: data.layoutId,
            playlistId: data.playlistId || null,
            scheduleId: data.scheduleId || null,
            playedAt: data.playedAt,
            duration: data.duration || null,
        });
        return this.mapToModel(row);
    }
    /**
     * Get proof of play records for a player
     */
    async findByPlayerId(playerId, options) {
        let sql = `
      SELECT *
      FROM ProofOfPlay
      WHERE PlayerId = @playerId
    `;
        const params = { playerId };
        if (options?.startDate) {
            sql += ' AND PlaybackStartTime >= @startDate';
            params.startDate = options.startDate;
        }
        if (options?.endDate) {
            sql += ' AND PlaybackStartTime <= @endDate';
            params.endDate = options.endDate;
        }
        sql += ' ORDER BY PlaybackStartTime DESC';
        if (options?.limit) {
            sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
            params.offset = options.offset || 0;
            params.limit = options.limit;
        }
        const rows = await this.queryMany(sql, params);
        return rows.map(this.mapToModel.bind(this));
    }
    /**
     * Get proof of play records for layout
     */
    async findByLayoutId(layoutId, options) {
        let sql = `
      SELECT *
      FROM ProofOfPlay
      WHERE LayoutId = @layoutId
    `;
        const params = { layoutId };
        if (options?.startDate) {
            sql += ' AND PlaybackStartTime >= @startDate';
            params.startDate = options.startDate;
        }
        if (options?.endDate) {
            sql += ' AND PlaybackStartTime <= @endDate';
            params.endDate = options.endDate;
        }
        sql += ' ORDER BY PlaybackStartTime DESC';
        if (options?.limit) {
            sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
            params.offset = options.offset || 0;
            params.limit = options.limit;
        }
        const rows = await this.queryMany(sql, params);
        return rows.map(this.mapToModel.bind(this));
    }
    /**
     * Count playback events for a layout
     */
    async countByLayoutId(layoutId, startDate, endDate) {
        let sql = `
      SELECT COUNT(*) as count
      FROM ProofOfPlay
      WHERE LayoutId = @layoutId
    `;
        const params = { layoutId };
        if (startDate) {
            sql += ' AND PlaybackStartTime >= @startDate';
            params.startDate = startDate;
        }
        if (endDate) {
            sql += ' AND PlaybackStartTime <= @endDate';
            params.endDate = endDate;
        }
        const result = await this.queryOne(sql, params);
        return result?.count ?? 0;
    }
}
exports.ProofOfPlayRepository = ProofOfPlayRepository;
//# sourceMappingURL=ProofOfPlayRepository.js.map