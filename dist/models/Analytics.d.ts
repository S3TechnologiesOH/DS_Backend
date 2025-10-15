/**
 * Analytics Models
 *
 * Data structures for analytics and reporting.
 */
export interface ContentAnalytics {
    contentId: number;
    contentName: string;
    contentType: string;
    totalPlays: number;
    totalDuration: number;
    uniquePlayers: number;
    lastPlayedAt: Date | null;
}
export interface PlayerAnalytics {
    playerId: number;
    playerName: string;
    siteId: number;
    siteName: string;
    status: string;
    uptime: number;
    totalPlays: number;
    lastHeartbeat: Date | null;
    onlineSince: Date | null;
}
export interface SiteAnalytics {
    siteId: number;
    siteName: string;
    totalPlayers: number;
    onlinePlayers: number;
    offlinePlayers: number;
    totalPlays: number;
    averageUptime: number;
}
export interface PlaybackReport {
    date: string;
    totalPlays: number;
    uniqueContent: number;
    uniquePlayers: number;
    totalDuration: number;
}
export interface ContentPerformance {
    contentId: number;
    contentName: string;
    playCount: number;
    averageDuration: number;
    completionRate: number;
    engagementScore: number;
}
export interface AnalyticsFilter {
    startDate?: string;
    endDate?: string;
    siteId?: number;
    playerId?: number;
    contentId?: number;
    playlistId?: number;
}
export interface AnalyticsSummary {
    totalPlays: number;
    totalDuration: number;
    averagePlayDuration: number;
    uniqueContent: number;
    uniquePlayers: number;
    period: {
        startDate: string;
        endDate: string;
    };
}
//# sourceMappingURL=Analytics.d.ts.map