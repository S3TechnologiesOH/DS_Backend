/**
 * Analytics Repository
 *
 * Database operations for analytics and proof-of-play data.
 */
import { BaseRepository } from './BaseRepository';
import { ProofOfPlay, ContentAnalytics, PlayerAnalytics, SiteAnalytics, PlaybackReport, ContentPerformance, AnalyticsSummary } from '../models';
export declare class AnalyticsRepository extends BaseRepository {
    /**
     * Record proof of play
     */
    createProofOfPlay(data: {
        playerId: number;
        contentId: number;
        playlistId?: number;
        scheduleId?: number;
        playbackStartTime: Date;
    }): Promise<ProofOfPlay>;
    /**
     * Update proof of play when playback ends
     */
    updateProofOfPlay(proofOfPlayId: number, endTime: Date, duration: number): Promise<void>;
    /**
     * Get analytics summary for a customer
     */
    getAnalyticsSummary(customerId: number, startDate: string, endDate: string): Promise<AnalyticsSummary>;
    /**
     * Get content analytics
     */
    getContentAnalytics(customerId: number, startDate: string, endDate: string, limit?: number): Promise<ContentAnalytics[]>;
    /**
     * Get player analytics
     */
    getPlayerAnalytics(customerId: number, siteId?: number): Promise<PlayerAnalytics[]>;
    /**
     * Get site analytics
     */
    getSiteAnalytics(customerId: number): Promise<SiteAnalytics[]>;
    /**
     * Get playback report by date
     */
    getPlaybackReport(customerId: number, startDate: string, endDate: string): Promise<PlaybackReport[]>;
    /**
     * Get content performance metrics
     */
    getContentPerformance(customerId: number, startDate: string, endDate: string, limit?: number): Promise<ContentPerformance[]>;
}
//# sourceMappingURL=AnalyticsRepository.d.ts.map