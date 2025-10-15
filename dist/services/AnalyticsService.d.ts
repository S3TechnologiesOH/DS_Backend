/**
 * Analytics Service
 *
 * Business logic for analytics and reporting.
 */
import { AnalyticsRepository } from '../repositories/AnalyticsRepository';
import { ProofOfPlay, ContentAnalytics, PlayerAnalytics, SiteAnalytics, PlaybackReport, ContentPerformance, AnalyticsSummary, AnalyticsFilter } from '../models';
export declare class AnalyticsService {
    private readonly analyticsRepository;
    constructor(analyticsRepository: AnalyticsRepository);
    /**
     * Record proof of play (called by players)
     */
    recordProofOfPlay(data: {
        playerId: number;
        contentId: number;
        playlistId?: number;
        scheduleId?: number;
    }): Promise<ProofOfPlay>;
    /**
     * Complete proof of play (called by players when playback ends)
     */
    completeProofOfPlay(proofOfPlayId: number, duration: number): Promise<void>;
    /**
     * Get analytics summary
     */
    getSummary(customerId: number, filter: AnalyticsFilter): Promise<AnalyticsSummary>;
    /**
     * Get content analytics
     */
    getContentAnalytics(customerId: number, filter: AnalyticsFilter): Promise<ContentAnalytics[]>;
    /**
     * Get player analytics
     */
    getPlayerAnalytics(customerId: number, siteId?: number): Promise<PlayerAnalytics[]>;
    /**
     * Get site analytics
     */
    getSiteAnalytics(customerId: number): Promise<SiteAnalytics[]>;
    /**
     * Get playback report
     */
    getPlaybackReport(customerId: number, filter: AnalyticsFilter): Promise<PlaybackReport[]>;
    /**
     * Get content performance metrics
     */
    getContentPerformance(customerId: number, filter: AnalyticsFilter): Promise<ContentPerformance[]>;
    /**
     * Validate and set default dates
     */
    private validateAndSetDates;
}
//# sourceMappingURL=AnalyticsService.d.ts.map