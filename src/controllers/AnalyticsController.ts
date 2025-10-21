/**
 * Analytics Controller
 *
 * Handles HTTP requests for analytics and reporting endpoints.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AnalyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET /api/v1/analytics/summary
   * Get analytics summary for date range
   */
  async getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { startDate, endDate, siteId, playerId, layoutId, playlistId } = req.query;

      const summary = await this.analyticsService.getSummary(customerId, {
        startDate: startDate as string,
        endDate: endDate as string,
        siteId: siteId ? parseInt(siteId as string, 10) : undefined,
        playerId: playerId ? parseInt(playerId as string, 10) : undefined,
        layoutId: layoutId ? parseInt(layoutId as string, 10) : undefined,
        playlistId: playlistId ? parseInt(playlistId as string, 10) : undefined,
      });

      res.status(200).json({
        status: 'success',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/content
   * Get content analytics
   */
  async getContentAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { startDate, endDate } = req.query;

      const analytics = await this.analyticsService.getContentAnalytics(customerId, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({
        status: 'success',
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/players
   * Get player analytics
   */
  async getPlayerAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { siteId } = req.query;

      const analytics = await this.analyticsService.getPlayerAnalytics(
        customerId,
        siteId ? parseInt(siteId as string, 10) : undefined
      );

      res.status(200).json({
        status: 'success',
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/sites
   * Get site analytics
   */
  async getSiteAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;

      const analytics = await this.analyticsService.getSiteAnalytics(customerId);

      res.status(200).json({
        status: 'success',
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/playback-report
   * Get playback report by date
   */
  async getPlaybackReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { startDate, endDate } = req.query;

      const report = await this.analyticsService.getPlaybackReport(customerId, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({
        status: 'success',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/analytics/content-performance
   * Get content performance metrics
   */
  async getContentPerformance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { startDate, endDate } = req.query;

      const performance = await this.analyticsService.getContentPerformance(customerId, {
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json({
        status: 'success',
        data: performance,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/analytics/proof-of-play
   * Record proof of play (called by players)
   */
  async recordProofOfPlay(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { playerId, layoutId, playlistId, scheduleId } = req.body;

      const proofOfPlay = await this.analyticsService.recordProofOfPlay({
        playerId,
        layoutId,
        playlistId,
        scheduleId,
      });

      res.status(201).json({
        status: 'success',
        data: proofOfPlay,
        message: 'Proof of play recorded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/analytics/proof-of-play/:proofOfPlayId
   * Complete proof of play (called by players)
   */
  async completeProofOfPlay(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const proofOfPlayId = parseInt(req.params.proofOfPlayId, 10);
      const { duration } = req.body;

      await this.analyticsService.completeProofOfPlay(proofOfPlayId, duration);

      res.status(200).json({
        status: 'success',
        message: 'Proof of play completed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
