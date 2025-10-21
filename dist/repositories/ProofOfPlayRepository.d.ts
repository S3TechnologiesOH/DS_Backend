/**
 * Proof of Play Repository
 *
 * Data access layer for tracking layout playback events.
 */
import { BaseRepository } from './BaseRepository';
import { ProofOfPlay, CreateProofOfPlayDto } from '../models/ProofOfPlay';
export declare class ProofOfPlayRepository extends BaseRepository {
    /**
     * Map database row to ProofOfPlay model
     */
    private mapToModel;
    /**
     * Create a new proof of play record
     */
    create(data: CreateProofOfPlayDto): Promise<ProofOfPlay>;
    /**
     * Get proof of play records for a player
     */
    findByPlayerId(playerId: number, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<ProofOfPlay[]>;
    /**
     * Get proof of play records for layout
     */
    findByLayoutId(layoutId: number, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<ProofOfPlay[]>;
    /**
     * Count playback events for a layout
     */
    countByLayoutId(layoutId: number, startDate?: Date, endDate?: Date): Promise<number>;
}
//# sourceMappingURL=ProofOfPlayRepository.d.ts.map