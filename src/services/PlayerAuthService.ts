/**
 * Player Authentication Service
 *
 * Handles player device authentication including activation and token refresh.
 * Players use a separate auth flow from CMS users.
 */

import jwt from 'jsonwebtoken';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { PlayerTokenRepository } from '../repositories/PlayerTokenRepository';
import { UnauthorizedError, NotFoundError } from '../utils/errors';
import { env } from '../config/environment';
import logger from '../utils/logger';

interface PlayerJwtPayload {
  playerId: number;
  customerId: number;
  siteId: number;
  type: 'player';
}

interface PlayerRefreshJwtPayload {
  playerId: number;
  type: 'player-refresh';
}

export class PlayerAuthService {
  constructor(
    private playerRepository: PlayerRepository,
    private playerTokenRepository: PlayerTokenRepository
  ) {}

  /**
   * Activate a player using activation code
   * Returns access and refresh tokens
   */
  async activate(
    playerCode: string,
    activationCode: string
  ): Promise<{
    playerId: number;
    customerId: number;
    siteId: number;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    // Find player by code
    const player = await this.playerRepository.findByPlayerCode(playerCode);

    if (!player) {
      logger.warn('Player activation failed: Player not found', { playerCode });
      throw new NotFoundError('Player not found');
    }

    // Verify activation code
    if (player.activationCode !== activationCode) {
      logger.warn('Player activation failed: Invalid activation code', {
        playerCode,
        playerId: player.playerId,
      });
      throw new UnauthorizedError('Invalid activation code');
    }

    // Check if activation code is expired
    if (
      player.activationCodeExpiresAt &&
      new Date() > player.activationCodeExpiresAt
    ) {
      logger.warn('Player activation failed: Activation code expired', {
        playerCode,
        playerId: player.playerId,
        expiresAt: player.activationCodeExpiresAt,
      });
      throw new UnauthorizedError('Activation code has expired');
    }

    // Ensure player has customerId
    if (!player.customerId) {
      logger.error('Player missing customerId', { playerId: player.playerId });
      throw new Error('Player configuration error');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(
      player.playerId,
      player.customerId,
      player.siteId
    );
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

    logger.info('Player activated successfully', {
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
  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    // Verify token signature
    let decoded: PlayerRefreshJwtPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        env.PLAYER_JWT_SECRET
      ) as PlayerRefreshJwtPayload;
    } catch (error) {
      logger.warn('Player token refresh failed: Invalid token signature');
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Verify token type
    if (decoded.type !== 'player-refresh') {
      logger.warn('Player token refresh failed: Wrong token type');
      throw new UnauthorizedError('Invalid token type');
    }

    // Check if token exists in database and is valid
    const isValid = await this.playerTokenRepository.isValid(refreshToken);

    if (!isValid) {
      logger.warn('Player token refresh failed: Token revoked or expired', {
        playerId: decoded.playerId,
      });
      throw new UnauthorizedError('Refresh token expired or revoked');
    }

    // Get player info
    const tokenRecord = await this.playerTokenRepository.findByToken(refreshToken);
    if (!tokenRecord) {
      throw new UnauthorizedError('Refresh token not found');
    }

    const player = await this.playerRepository.findById(
      decoded.playerId,
      0 // We'll get customerId from the player itself
    );

    if (!player) {
      logger.warn('Player token refresh failed: Player not found', {
        playerId: decoded.playerId,
      });
      throw new NotFoundError('Player not found');
    }

    // Get customerId via playerCode lookup to ensure we have it
    const playerWithCustomerId = await this.playerRepository.findByPlayerCode(
      player.playerCode
    );

    if (!playerWithCustomerId?.customerId) {
      logger.error('Player missing customerId', { playerId: player.playerId });
      throw new Error('Player configuration error');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(
      player.playerId,
      playerWithCustomerId.customerId,
      player.siteId
    );

    logger.info('Player token refreshed', {
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
  async logout(refreshToken: string): Promise<void> {
    await this.playerTokenRepository.revokeByToken(refreshToken);
    logger.info('Player logged out');
  }

  /**
   * Revoke all tokens for a player
   */
  async revokeAllTokens(playerId: number): Promise<void> {
    await this.playerTokenRepository.revokeAllByPlayerId(playerId);
    logger.info('All player tokens revoked', { playerId });
  }

  /**
   * Generate access token for player
   * Short-lived (1 hour)
   */
  private generateAccessToken(
    playerId: number,
    customerId: number,
    siteId: number
  ): string {
    const payload: PlayerJwtPayload = {
      playerId,
      customerId,
      siteId,
      type: 'player',
    };

    return jwt.sign(payload, env.PLAYER_JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  /**
   * Generate refresh token for player
   * Long-lived (1 year)
   */
  private generateRefreshToken(playerId: number): string {
    const payload: PlayerRefreshJwtPayload = {
      playerId,
      type: 'player-refresh',
    };

    return jwt.sign(payload, env.PLAYER_JWT_SECRET, {
      expiresIn: '365d',
    });
  }
}
