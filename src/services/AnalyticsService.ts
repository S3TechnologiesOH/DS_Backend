/**
 * Analytics Service
 *
 * Business logic for analytics and reporting.
 */

import { AnalyticsRepository } from '../repositories/AnalyticsRepository';
import {
  ProofOfPlay,
  ContentAnalytics,
  PlayerAnalytics,
  SiteAnalytics,
  PlaybackReport,
  ContentPerformance,
  AnalyticsSummary,
  AnalyticsFilter,
} from '../models';
import { ValidationError } from '../utils/errors';
import logger from '../utils/logger';

export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  /**
   * Record proof of play (called by players)
   */
  async recordProofOfPlay(data: {
    playerId: number;
    layoutId: number;
    playlistId?: number;
    scheduleId?: number;
  }): Promise<ProofOfPlay> {
    const proofOfPlay = await this.analyticsRepository.createProofOfPlay({
      ...data,
      playbackStartTime: new Date(),
    });

    logger.info(`Recorded proof of play for player ${data.playerId}, layout ${data.layoutId}`);

    return proofOfPlay;
  }

  /**
   * Complete proof of play (called by players when playback ends)
   */
  async completeProofOfPlay(proofOfPlayId: number, duration: number): Promise<void> {
    if (duration < 0) {
      throw new ValidationError('Duration must be non-negative');
    }

    const endTime = new Date();
    await this.analyticsRepository.updateProofOfPlay(proofOfPlayId, endTime, duration);

    logger.info(`Completed proof of play ${proofOfPlayId}, duration: ${duration}s`);
  }

  /**
   * Get analytics summary
   */
  async getSummary(customerId: number, filter: AnalyticsFilter): Promise<AnalyticsSummary> {
    const { startDate, endDate } = this.validateAndSetDates(filter);

    return this.analyticsRepository.getAnalyticsSummary(customerId, startDate, endDate);
  }

  /**
   * Get content analytics
   */
  async getContentAnalytics(
    customerId: number,
    filter: AnalyticsFilter
  ): Promise<ContentAnalytics[]> {
    const { startDate, endDate } = this.validateAndSetDates(filter);

    return this.analyticsRepository.getContentAnalytics(customerId, startDate, endDate);
  }

  /**
   * Get player analytics
   */
  async getPlayerAnalytics(
    customerId: number,
    siteId?: number
  ): Promise<PlayerAnalytics[]> {
    return this.analyticsRepository.getPlayerAnalytics(customerId, siteId);
  }

  /**
   * Get site analytics
   */
  async getSiteAnalytics(customerId: number): Promise<SiteAnalytics[]> {
    return this.analyticsRepository.getSiteAnalytics(customerId);
  }

  /**
   * Get playback report
   */
  async getPlaybackReport(
    customerId: number,
    filter: AnalyticsFilter
  ): Promise<PlaybackReport[]> {
    const { startDate, endDate } = this.validateAndSetDates(filter);

    return this.analyticsRepository.getPlaybackReport(customerId, startDate, endDate);
  }

  /**
   * Get content performance metrics
   */
  async getContentPerformance(
    customerId: number,
    filter: AnalyticsFilter
  ): Promise<ContentPerformance[]> {
    const { startDate, endDate } = this.validateAndSetDates(filter);

    return this.analyticsRepository.getContentPerformance(customerId, startDate, endDate);
  }

  /**
   * Validate and set default dates
   */
  private validateAndSetDates(filter: AnalyticsFilter): { startDate: string; endDate: string } {
    let startDate = filter.startDate;
    let endDate = filter.endDate;

    // Default to last 30 days
    if (!startDate) {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      startDate = date.toISOString().split('T')[0];
    }

    if (!endDate) {
      endDate = new Date().toISOString().split('T')[0];
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
    }

    // Validate date range
    if (startDate > endDate) {
      throw new ValidationError('Start date must be before end date');
    }

    // Validate range not too large (max 1 year)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 365) {
      throw new ValidationError('Date range cannot exceed 365 days');
    }

    return { startDate, endDate };
  }
}
