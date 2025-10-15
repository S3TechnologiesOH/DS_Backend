/**
 * Player Repository
 *
 * Database operations for Players table.
 */
import { BaseRepository } from './BaseRepository';
import { Player, CreatePlayerDto, UpdatePlayerDto } from '../models';
export declare class PlayerRepository extends BaseRepository {
    /**
     * Find player by ID
     */
    findById(playerId: number, customerId: number): Promise<Player | null>;
    /**
     * Get all players for a customer
     */
    findByCustomerId(customerId: number, options?: {
        siteId?: number;
        status?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Player[]>;
    /**
     * Get all players for a site
     */
    findBySiteId(siteId: number, customerId: number): Promise<Player[]>;
    /**
     * Create new player
     */
    create(data: CreatePlayerDto): Promise<Player>;
    /**
     * Update player
     */
    update(playerId: number, customerId: number, data: UpdatePlayerDto): Promise<Player>;
    /**
     * Update player heartbeat
     */
    updateHeartbeat(playerId: number, data: {
        status: string;
        ipAddress?: string;
        playerVersion?: string;
        osVersion?: string;
    }): Promise<void>;
    /**
     * Delete player
     */
    delete(playerId: number, customerId: number): Promise<void>;
    /**
     * Count players for a customer
     */
    countByCustomerId(customerId: number): Promise<number>;
    /**
     * Check if player code exists
     */
    playerCodeExists(playerCode: string, siteId: number, excludePlayerId?: number): Promise<boolean>;
    /**
     * Generate activation code for player
     */
    generateActivationCode(playerId: number, customerId: number): Promise<string>;
}
//# sourceMappingURL=PlayerRepository.d.ts.map