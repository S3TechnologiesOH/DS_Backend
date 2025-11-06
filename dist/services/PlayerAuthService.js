"use strict";
/**
 * Player Authentication Service
 *
 * Handles player device authentication including activation and token refresh.
 * Players use a separate auth flow from CMS users.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const environment_1 = require("../config/environment");
const logger_1 = __importDefault(require("../utils/logger"));
class PlayerAuthService {
    playerRepository;
    playerTokenRepository;
    constructor(playerRepository, playerTokenRepository) {
        this.playerRepository = playerRepository;
        this.playerTokenRepository = playerTokenRepository;
    }
    /**
     * Activate a player using activation code
     * Returns access and refresh tokens
     */
    async activate(playerCode, activationCode) {
        // Find player by code
        const player = await this.playerRepository.findByPlayerCode(playerCode);
        if (!player) {
            logger_1.default.warn('Player activation failed: Player not found', { playerCode });
            throw new errors_1.NotFoundError('Player not found');
        }
        // Verify activation code
        if (player.activationCode !== activationCode) {
            logger_1.default.warn('Player activation failed: Invalid activation code', {
                playerCode,
                playerId: player.playerId,
            });
            throw new errors_1.UnauthorizedError('Invalid activation code');
        }
        // Check if activation code is expired
        if (player.activationCodeExpiresAt &&
            new Date() > player.activationCodeExpiresAt) {
            logger_1.default.warn('Player activation failed: Activation code expired', {
                playerCode,
                playerId: player.playerId,
                expiresAt: player.activationCodeExpiresAt,
            });
            throw new errors_1.UnauthorizedError('Activation code has expired');
        }
        // Ensure player has customerId
        if (!player.customerId) {
            logger_1.default.error('Player missing customerId', { playerId: player.playerId });
            throw new Error('Player configuration error');
        }
        // Generate tokens
        const accessToken = this.generateAccessToken(player.playerId, player.customerId, player.siteId);
        const refreshToken = this.generateRefreshToken(player.playerId);
        // Store refresh token with 1-year expiration
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await this.playerTokenRepository.create({
            playerId: player.playerId,
            token: refreshToken,
            expiresAt,
        });
        // Update player activation timestamp
        await this.playerRepository.updateActivation(player.playerId, {
            activatedAt: new Date(),
        });
        logger_1.default.info('Player activated successfully', {
            playerId: player.playerId,
            playerCode,
            customerId: player.customerId,
        });
        return {
            playerId: player.playerId,
            customerId: player.customerId,
            siteId: player.siteId,
            accessToken,
            refreshToken,
            expiresIn: 3600, // 1 hour in seconds
        };
    }
    /**
     * Refresh access token using refresh token
     */
    async refresh(refreshToken) {
        // Verify token signature
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, environment_1.env.PLAYER_JWT_SECRET);
        }
        catch (error) {
            logger_1.default.warn('Player token refresh failed: Invalid token signature');
            throw new errors_1.UnauthorizedError('Invalid refresh token');
        }
        // Verify token type
        if (decoded.type !== 'player-refresh') {
            logger_1.default.warn('Player token refresh failed: Wrong token type');
            throw new errors_1.UnauthorizedError('Invalid token type');
        }
        // Check if token exists in database and is valid
        const isValid = await this.playerTokenRepository.isValid(refreshToken);
        if (!isValid) {
            logger_1.default.warn('Player token refresh failed: Token revoked or expired', {
                playerId: decoded.playerId,
            });
            throw new errors_1.UnauthorizedError('Refresh token expired or revoked');
        }
        // Get player info
        const tokenRecord = await this.playerTokenRepository.findByToken(refreshToken);
        if (!tokenRecord) {
            throw new errors_1.UnauthorizedError('Refresh token not found');
        }
        const player = await this.playerRepository.findById(decoded.playerId, 0 // We'll get customerId from the player itself
        );
        if (!player) {
            logger_1.default.warn('Player token refresh failed: Player not found', {
                playerId: decoded.playerId,
            });
            throw new errors_1.NotFoundError('Player not found');
        }
        // Get customerId via playerCode lookup to ensure we have it
        const playerWithCustomerId = await this.playerRepository.findByPlayerCode(player.playerCode);
        if (!playerWithCustomerId?.customerId) {
            logger_1.default.error('Player missing customerId', { playerId: player.playerId });
            throw new Error('Player configuration error');
        }
        // Generate new access token
        const accessToken = this.generateAccessToken(player.playerId, playerWithCustomerId.customerId, player.siteId);
        logger_1.default.info('Player token refreshed', {
            playerId: player.playerId,
        });
        return {
            accessToken,
            expiresIn: 3600, // 1 hour in seconds
        };
    }
    /**
     * Logout player by revoking refresh token
     */
    async logout(refreshToken) {
        await this.playerTokenRepository.revokeByToken(refreshToken);
        logger_1.default.info('Player logged out');
    }
    /**
     * Revoke all tokens for a player
     */
    async revokeAllTokens(playerId) {
        await this.playerTokenRepository.revokeAllByPlayerId(playerId);
        logger_1.default.info('All player tokens revoked', { playerId });
    }
    /**
     * Generate access token for player
     * Short-lived (1 hour)
     */
    generateAccessToken(playerId, customerId, siteId) {
        const payload = {
            playerId,
            customerId,
            siteId,
            type: 'player',
        };
        return jsonwebtoken_1.default.sign(payload, environment_1.env.PLAYER_JWT_SECRET, {
            expiresIn: '1h',
        });
    }
    /**
     * Generate refresh token for player
     * Long-lived (1 year)
     */
    generateRefreshToken(playerId) {
        const payload = {
            playerId,
            type: 'player-refresh',
        };
        return jsonwebtoken_1.default.sign(payload, environment_1.env.PLAYER_JWT_SECRET, {
            expiresIn: '365d',
        });
    }
}
exports.PlayerAuthService = PlayerAuthService;
//# sourceMappingURL=PlayerAuthService.js.map