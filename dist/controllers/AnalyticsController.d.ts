/**
 * Analytics Controller
 *
 * Handles HTTP requests for analytics and reporting endpoints.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AnalyticsService } from '../services/AnalyticsService';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    /**
     * GET /api/v1/analytics/summary
     * Get analytics summary for date range
     */
    getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/analytics/content
     * Get content analytics
     */
    getContentAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/analytics/players
     * Get player analytics
     */
    getPlayerAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/analytics/sites
     * Get site analytics
     */
    getSiteAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/analytics/playback-report
     * Get playback report by date
     */
    getPlaybackReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/analytics/content-performance
     * Get content performance metrics
     */
    getContentPerformance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/analytics/proof-of-play
     * Record proof of play (called by players)
     */
    recordProofOfPlay(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/analytics/proof-of-play/:proofOfPlayId
     * Complete proof of play (called by players)
     */
    completeProofOfPlay(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AnalyticsController.d.ts.map