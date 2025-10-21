"use strict";
/**
 * Analytics Repository
 *
 * Database operations for analytics and proof-of-play data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class AnalyticsRepository extends BaseRepository_1.BaseRepository {
    /**
     * Record proof of play
     */
    async createProofOfPlay(data) {
        const sql = `
      INSERT INTO ProofOfPlay (PlayerId, LayoutId, PlaylistId, ScheduleId, PlaybackStartTime, IsCompleted)
      OUTPUT
        INSERTED.ProofOfPlayId as proofOfPlayId,
        INSERTED.PlayerId as playerId,
        INSERTED.LayoutId as layoutId,
        INSERTED.PlaylistId as playlistId,
        INSERTED.ScheduleId as scheduleId,
        INSERTED.PlaybackStartTime as playbackStartTime,
        INSERTED.PlaybackEndTime as playbackEndTime,
        INSERTED.Duration as duration,
        INSERTED.IsCompleted as isCompleted,
        INSERTED.CreatedAt as createdAt
      VALUES (@playerId, @layoutId, @playlistId, @scheduleId, @playbackStartTime, 0)
    `;
        return this.insert(sql, {
            playerId: data.playerId,
            layoutId: data.layoutId,
            playlistId: data.playlistId || null,
            scheduleId: data.scheduleId || null,
            playbackStartTime: data.playbackStartTime,
        });
    }
    /**
     * Update proof of play when playback ends
     */
    async updateProofOfPlay(proofOfPlayId, endTime, duration) {
        const sql = `
      UPDATE ProofOfPlay
      SET PlaybackEndTime = @endTime,
          Duration = @duration,
          IsCompleted = 1
      WHERE ProofOfPlayId = @proofOfPlayId
    `;
        await this.execute(sql, { proofOfPlayId, endTime, duration });
    }
    /**
     * Get analytics summary for a customer
     */
    async getAnalyticsSummary(customerId, startDate, endDate) {
        const sql = `
      SELECT
        COUNT(*) as totalPlays,
        ISNULL(SUM(Duration), 0) as totalDuration,
        ISNULL(AVG(Duration), 0) as averagePlayDuration,
        COUNT(DISTINCT LayoutId) as uniqueContent,
        COUNT(DISTINCT PlayerId) as uniquePlayers
      FROM ProofOfPlay pop
      INNER JOIN Players p ON pop.PlayerId = p.PlayerId
      WHERE p.CustomerId = @customerId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
    `;
        const result = await this.queryOne(sql, { customerId, startDate, endDate });
        return {
            totalPlays: result?.totalPlays || 0,
            totalDuration: result?.totalDuration || 0,
            averagePlayDuration: result?.averagePlayDuration || 0,
            uniqueContent: result?.uniqueContent || 0,
            uniquePlayers: result?.uniquePlayers || 0,
            period: { startDate, endDate },
        };
    }
    /**
     * Get layout analytics
     */
    async getContentAnalytics(customerId, startDate, endDate, limit = 20) {
        const sql = `
      SELECT TOP (@limit)
        l.LayoutId as contentId,
        l.Name as contentName,
        'Layout' as contentType,
        COUNT(*) as totalPlays,
        ISNULL(SUM(pop.Duration), 0) as totalDuration,
        COUNT(DISTINCT pop.PlayerId) as uniquePlayers,
        MAX(pop.PlaybackStartTime) as lastPlayedAt
      FROM Layouts l
      LEFT JOIN ProofOfPlay pop ON l.LayoutId = pop.LayoutId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
      WHERE l.CustomerId = @customerId
      GROUP BY l.LayoutId, l.Name
      ORDER BY totalPlays DESC
    `;
        return this.queryMany(sql, { customerId, startDate, endDate, limit });
    }
    /**
     * Get player analytics
     */
    async getPlayerAnalytics(customerId, siteId) {
        const sql = `
      SELECT
        p.PlayerId as playerId,
        p.Name as playerName,
        s.SiteId as siteId,
        s.Name as siteName,
        p.Status as status,
        CASE
          WHEN p.LastHeartbeat IS NULL THEN 0
          WHEN p.LastHeartbeat < DATEADD(minute, -5, GETUTCDATE()) THEN 0
          ELSE 100
        END as uptime,
        COUNT(pop.ProofOfPlayId) as totalPlays,
        p.LastHeartbeat as lastHeartbeat,
        p.UpdatedAt as onlineSince
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      LEFT JOIN ProofOfPlay pop ON p.PlayerId = pop.PlayerId
        AND pop.PlaybackStartTime >= DATEADD(day, -7, GETUTCDATE())
      WHERE s.CustomerId = @customerId
        ${siteId ? 'AND s.SiteId = @siteId' : ''}
      GROUP BY p.PlayerId, p.Name, s.SiteId, s.Name, p.Status, p.LastHeartbeat, p.UpdatedAt
      ORDER BY p.Name
    `;
        return this.queryMany(sql, siteId ? { customerId, siteId } : { customerId });
    }
    /**
     * Get site analytics
     */
    async getSiteAnalytics(customerId) {
        const sql = `
      SELECT
        s.SiteId as siteId,
        s.Name as siteName,
        COUNT(DISTINCT p.PlayerId) as totalPlayers,
        SUM(CASE WHEN p.Status = 'Online' THEN 1 ELSE 0 END) as onlinePlayers,
        SUM(CASE WHEN p.Status != 'Online' THEN 1 ELSE 0 END) as offlinePlayers,
        COUNT(pop.ProofOfPlayId) as totalPlays,
        CASE
          WHEN COUNT(p.PlayerId) = 0 THEN 0
          ELSE AVG(CASE
            WHEN p.LastHeartbeat IS NULL THEN 0
            WHEN p.LastHeartbeat < DATEADD(minute, -5, GETUTCDATE()) THEN 0
            ELSE 100
          END)
        END as averageUptime
      FROM Sites s
      LEFT JOIN Players p ON s.SiteId = p.SiteId
      LEFT JOIN ProofOfPlay pop ON p.PlayerId = pop.PlayerId
        AND pop.PlaybackStartTime >= DATEADD(day, -7, GETUTCDATE())
      WHERE s.CustomerId = @customerId
      GROUP BY s.SiteId, s.Name
      ORDER BY s.Name
    `;
        return this.queryMany(sql, { customerId });
    }
    /**
     * Get playback report by date
     */
    async getPlaybackReport(customerId, startDate, endDate) {
        const sql = `
      SELECT
        CONVERT(varchar, pop.PlaybackStartTime, 23) as date,
        COUNT(*) as totalPlays,
        COUNT(DISTINCT pop.LayoutId) as uniqueContent,
        COUNT(DISTINCT pop.PlayerId) as uniquePlayers,
        ISNULL(SUM(pop.Duration), 0) as totalDuration
      FROM ProofOfPlay pop
      INNER JOIN Players p ON pop.PlayerId = p.PlayerId
      WHERE p.CustomerId = @customerId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
      GROUP BY CONVERT(varchar, pop.PlaybackStartTime, 23)
      ORDER BY date
    `;
        return this.queryMany(sql, { customerId, startDate, endDate });
    }
    /**
     * Get layout performance metrics
     */
    async getContentPerformance(customerId, startDate, endDate, limit = 10) {
        const sql = `
      SELECT TOP (@limit)
        l.LayoutId as contentId,
        l.Name as contentName,
        COUNT(pop.ProofOfPlayId) as playCount,
        ISNULL(AVG(pop.Duration), 0) as averageDuration,
        CASE
          WHEN COUNT(pop.ProofOfPlayId) = 0 THEN 0
          ELSE (SUM(CASE WHEN pop.IsCompleted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(pop.ProofOfPlayId))
        END as completionRate,
        COUNT(pop.ProofOfPlayId) as engagementScore
      FROM Layouts l
      LEFT JOIN ProofOfPlay pop ON l.LayoutId = pop.LayoutId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
      WHERE l.CustomerId = @customerId
      GROUP BY l.LayoutId, l.Name
      HAVING COUNT(pop.ProofOfPlayId) > 0
      ORDER BY engagementScore DESC
    `;
        return this.queryMany(sql, { customerId, startDate, endDate, limit });
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
//# sourceMappingURL=AnalyticsRepository.js.map