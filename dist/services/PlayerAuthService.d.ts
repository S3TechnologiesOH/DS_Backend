/**
 * Player Authentication Service
 *
 * Handles player device authentication including activation and token refresh.
 * Players use a separate auth flow from CMS users.
 */
import { PlayerRepository } from '../repositories/PlayerRepository';
import { PlayerTokenRepository } from '../repositories/PlayerTokenRepository';
export declare class PlayerAuthService {
    private playerRepository;
    private playerTokenRepository;
    constructor(playerRepository: PlayerRepository, playerTokenRepository: PlayerTokenRepository);
    /**
     * Activate a player using activation code
     * Returns access and refresh tokens
     */
    activate(playerCode: string, activationCode: string): Promise<{
        playerId: number;
        customerId: number;
        siteId: number;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    /**
     * Refresh access token using refresh token
     */
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    /**
     * Logout player by revoking refresh token
     */
    logout(refreshToken: string): Promise<void>;
    /**
     * Revoke all tokens for a player
     */
    revokeAllTokens(playerId: number): Promise<void>;
    /**
     * Generate access token for player
     * Short-lived (1 hour)
     */
    private generateAccessToken;
    /**
     * Generate refresh token for player
     * Long-lived (1 year)
     */
    private generateRefreshToken;
}
//# sourceMappingURL=PlayerAuthService.d.ts.map