/**
 * Analytics Repository
 *
 * Database operations for analytics and proof-of-play data.
 */

import { BaseRepository } from './BaseRepository';
import {
  ProofOfPlay,
  ContentAnalytics,
  PlayerAnalytics,
  SiteAnalytics,
  PlaybackReport,
  ContentPerformance,
  AnalyticsSummary,
} from '../models';

export class AnalyticsRepository extends BaseRepository {
  /**
   * Record proof of play
   */
  async createProofOfPlay(data: {
    playerId: number;
    contentId: number;
    playlistId?: number;
    scheduleId?: number;
    playbackStartTime: Date;
  }): Promise<ProofOfPlay> {
    const sql = `
      INSERT INTO ProofOfPlay (PlayerId, ContentId, PlaylistId, ScheduleId, PlaybackStartTime, IsCompleted)
      OUTPUT
        INSERTED.ProofOfPlayId as proofOfPlayId,
        INSERTED.PlayerId as playerId,
        INSERTED.ContentId as contentId,
        INSERTED.PlaylistId as playlistId,
        INSERTED.ScheduleId as scheduleId,
        INSERTED.PlaybackStartTime as playbackStartTime,
        INSERTED.PlaybackEndTime as playbackEndTime,
        INSERTED.Duration as duration,
        INSERTED.IsCompleted as isCompleted,
        INSERTED.CreatedAt as createdAt
      VALUES (@playerId, @contentId, @playlistId, @scheduleId, @playbackStartTime, 0)
    `;

    return this.insert<ProofOfPlay>(sql, {
      playerId: data.playerId,
      contentId: data.contentId,
      playlistId: data.playlistId || null,
      scheduleId: data.scheduleId || null,
      playbackStartTime: data.playbackStartTime,
    });
  }

  /**
   * Update proof of play when playback ends
   */
  async updateProofOfPlay(proofOfPlayId: number, endTime: Date, duration: number): Promise<void> {
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
  async getAnalyticsSummary(
    customerId: number,
    startDate: string,
    endDate: string
  ): Promise<AnalyticsSummary> {
    const sql = `
      SELECT
        COUNT(*) as totalPlays,
        ISNULL(SUM(Duration), 0) as totalDuration,
        ISNULL(AVG(Duration), 0) as averagePlayDuration,
        COUNT(DISTINCT ContentId) as uniqueContent,
        COUNT(DISTINCT PlayerId) as uniquePlayers
      FROM ProofOfPlay pop
      INNER JOIN Players p ON pop.PlayerId = p.PlayerId
      WHERE p.CustomerId = @customerId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
    `;

    const result = await this.queryOne<{
      totalPlays: number;
      totalDuration: number;
      averagePlayDuration: number;
      uniqueContent: number;
      uniquePlayers: number;
    }>(sql, { customerId, startDate, endDate });

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
   * Get content analytics
   */
  async getContentAnalytics(
    customerId: number,
    startDate: string,
    endDate: string,
    limit: number = 20
  ): Promise<ContentAnalytics[]> {
    const sql = `
      SELECT TOP (@limit)
        c.ContentId as contentId,
        c.Name as contentName,
        c.ContentType as contentType,
        COUNT(*) as totalPlays,
        ISNULL(SUM(pop.Duration), 0) as totalDuration,
        COUNT(DISTINCT pop.PlayerId) as uniquePlayers,
        MAX(pop.PlaybackStartTime) as lastPlayedAt
      FROM Content c
      LEFT JOIN ProofOfPlay pop ON c.ContentId = pop.ContentId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
      WHERE c.CustomerId = @customerId
      GROUP BY c.ContentId, c.Name, c.ContentType
      ORDER BY totalPlays DESC
    `;

    return this.queryMany<ContentAnalytics>(sql, { customerId, startDate, endDate, limit });
  }

  /**
   * Get player analytics
   */
  async getPlayerAnalytics(
    customerId: number,
    siteId?: number
  ): Promise<PlayerAnalytics[]> {
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

    return this.queryMany<PlayerAnalytics>(sql, siteId ? { customerId, siteId } : { customerId });
  }

  /**
   * Get site analytics
   */
  async getSiteAnalytics(customerId: number): Promise<SiteAnalytics[]> {
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

    return this.queryMany<SiteAnalytics>(sql, { customerId });
  }

  /**
   * Get playback report by date
   */
  async getPlaybackReport(
    customerId: number,
    startDate: string,
    endDate: string
  ): Promise<PlaybackReport[]> {
    const sql = `
      SELECT
        CONVERT(varchar, pop.PlaybackStartTime, 23) as date,
        COUNT(*) as totalPlays,
        COUNT(DISTINCT pop.ContentId) as uniqueContent,
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

    return this.queryMany<PlaybackReport>(sql, { customerId, startDate, endDate });
  }

  /**
   * Get content performance metrics
   */
  async getContentPerformance(
    customerId: number,
    startDate: string,
    endDate: string,
    limit: number = 10
  ): Promise<ContentPerformance[]> {
    const sql = `
      SELECT TOP (@limit)
        c.ContentId as contentId,
        c.Name as contentName,
        COUNT(pop.ProofOfPlayId) as playCount,
        ISNULL(AVG(pop.Duration), 0) as averageDuration,
        CASE
          WHEN COUNT(pop.ProofOfPlayId) = 0 THEN 0
          ELSE (SUM(CASE WHEN pop.IsCompleted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(pop.ProofOfPlayId))
        END as completionRate,
        COUNT(pop.ProofOfPlayId) as engagementScore
      FROM Content c
      LEFT JOIN ProofOfPlay pop ON c.ContentId = pop.ContentId
        AND pop.PlaybackStartTime >= @startDate
        AND pop.PlaybackStartTime < DATEADD(day, 1, @endDate)
      WHERE c.CustomerId = @customerId
      GROUP BY c.ContentId, c.Name
      HAVING COUNT(pop.ProofOfPlayId) > 0
      ORDER BY engagementScore DESC
    `;

    return this.queryMany<ContentPerformance>(sql, { customerId, startDate, endDate, limit });
  }
}
