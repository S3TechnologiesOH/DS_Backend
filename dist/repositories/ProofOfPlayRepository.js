"use strict";
/**
 * Proof of Play Repository
 *
 * Data access layer for tracking content playback events.
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
            contentId: row.ContentId,
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
        ContentId,
        PlaylistId,
        ScheduleId,
        PlaybackStartTime,
        Duration,
        IsCompleted
      )
      OUTPUT INSERTED.*
      VALUES (
        @playerId,
        @contentId,
        @playlistId,
        @scheduleId,
        @playedAt,
        @duration,
        1
      );
    `;
        const row = await this.insert(sql, {
            playerId: data.playerId,
            contentId: data.contentId,
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
     * Get proof of play records for content
     */
    async findByContentId(contentId, options) {
        let sql = `
      SELECT *
      FROM ProofOfPlay
      WHERE ContentId = @contentId
    `;
        const params = { contentId };
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
     * Count playback events for a content item
     */
    async countByContentId(contentId, startDate, endDate) {
        let sql = `
      SELECT COUNT(*) as count
      FROM ProofOfPlay
      WHERE ContentId = @contentId
    `;
        const params = { contentId };
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