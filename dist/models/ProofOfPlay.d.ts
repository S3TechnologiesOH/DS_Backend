/**
 * Proof of Play Model
 *
 * Tracks when and where content was displayed on player devices.
 * Used for analytics and reporting.
 */
export interface ProofOfPlay {
    proofOfPlayId: number;
    playerId: number;
    contentId: number;
    playlistId: number | null;
    scheduleId: number | null;
    playbackStartTime: Date;
    playbackEndTime: Date | null;
    duration: number | null;
    isCompleted: boolean;
    createdAt: Date;
}
export interface CreateProofOfPlayDto {
    playerId: number;
    contentId: number;
    playlistId?: number;
    scheduleId?: number;
    playedAt: Date;
    duration?: number;
}
//# sourceMappingURL=ProofOfPlay.d.ts.map