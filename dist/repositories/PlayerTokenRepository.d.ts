/**
 * PlayerToken Repository
 *
 * Data access layer for player refresh tokens.
 * Handles CRUD operations for the PlayerTokens table.
 */
import { BaseRepository } from './BaseRepository';
import { PlayerToken, CreatePlayerTokenDto } from '../models/PlayerToken';
export declare class PlayerTokenRepository extends BaseRepository {
    /**
     * Map database row to PlayerToken model
     */
    private mapToModel;
    /**
     * Create a new player token
     */
    create(data: CreatePlayerTokenDto): Promise<PlayerToken>;
    /**
     * Find token by token string
     */
    findByToken(token: string): Promise<PlayerToken | null>;
    /**
     * Find all tokens for a player
     */
    findByPlayerId(playerId: number): Promise<PlayerToken[]>;
    /**
     * Revoke a token by token string
     */
    revokeByToken(token: string): Promise<void>;
    /**
     * Revoke all tokens for a player
     */
    revokeAllByPlayerId(playerId: number): Promise<void>;
    /**
     * Delete expired tokens (cleanup)
     */
    deleteExpired(): Promise<number>;
    /**
     * Check if token is valid (not expired and not revoked)
     */
    isValid(token: string): Promise<boolean>;
}
//# sourceMappingURL=PlayerTokenRepository.d.ts.map