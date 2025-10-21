/**
 * Proof of Play Model
 *
 * Tracks when and where layouts were displayed on player devices.
 * Used for analytics and reporting.
 */

export interface ProofOfPlay {
  proofOfPlayId: number;
  playerId: number;
  layoutId: number;
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
  layoutId: number;
  playlistId?: number;
  scheduleId?: number;
  playedAt: Date;
  duration?: number;
}
