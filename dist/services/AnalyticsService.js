"use strict";
/**
 * Analytics Service
 *
 * Business logic for analytics and reporting.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class AnalyticsService {
    analyticsRepository;
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    /**
     * Record proof of play (called by players)
     */
    async recordProofOfPlay(data) {
        const proofOfPlay = await this.analyticsRepository.createProofOfPlay({
            ...data,
            playbackStartTime: new Date(),
        });
        logger_1.default.info(`Recorded proof of play for player ${data.playerId}, layout ${data.layoutId}`);
        return proofOfPlay;
    }
    /**
     * Complete proof of play (called by players when playback ends)
     */
    async completeProofOfPlay(proofOfPlayId, duration) {
        if (duration < 0) {
            throw new errors_1.ValidationError('Duration must be non-negative');
        }
        const endTime = new Date();
        await this.analyticsRepository.updateProofOfPlay(proofOfPlayId, endTime, duration);
        logger_1.default.info(`Completed proof of play ${proofOfPlayId}, duration: ${duration}s`);
    }
    /**
     * Get analytics summary
     */
    async getSummary(customerId, filter) {
        const { startDate, endDate } = this.validateAndSetDates(filter);
        return this.analyticsRepository.getAnalyticsSummary(customerId, startDate, endDate);
    }
    /**
     * Get content analytics
     */
    async getContentAnalytics(customerId, filter) {
        const { startDate, endDate } = this.validateAndSetDates(filter);
        return this.analyticsRepository.getContentAnalytics(customerId, startDate, endDate);
    }
    /**
     * Get player analytics
     */
    async getPlayerAnalytics(customerId, siteId) {
        return this.analyticsRepository.getPlayerAnalytics(customerId, siteId);
    }
    /**
     * Get site analytics
     */
    async getSiteAnalytics(customerId) {
        return this.analyticsRepository.getSiteAnalytics(customerId);
    }
    /**
     * Get playback report
     */
    async getPlaybackReport(customerId, filter) {
        const { startDate, endDate } = this.validateAndSetDates(filter);
        return this.analyticsRepository.getPlaybackReport(customerId, startDate, endDate);
    }
    /**
     * Get content performance metrics
     */
    async getContentPerformance(customerId, filter) {
        const { startDate, endDate } = this.validateAndSetDates(filter);
        return this.analyticsRepository.getContentPerformance(customerId, startDate, endDate);
    }
    /**
     * Validate and set default dates
     */
    validateAndSetDates(filter) {
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
            throw new errors_1.ValidationError('Invalid date format. Use YYYY-MM-DD');
        }
        // Validate date range
        if (startDate > endDate) {
            throw new errors_1.ValidationError('Start date must be before end date');
        }
        // Validate range not too large (max 1 year)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 365) {
            throw new errors_1.ValidationError('Date range cannot exceed 365 days');
        }
        return { startDate, endDate };
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=AnalyticsService.js.map