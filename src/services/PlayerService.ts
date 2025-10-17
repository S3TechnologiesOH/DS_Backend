/**
 * Player Service
 *
 * Business logic for player management including activation code generation,
 * heartbeat updates, and player lifecycle management.
 */

import { PlayerRepository } from '../repositories/PlayerRepository';
import { SiteRepository } from '../repositories/SiteRepository';
import {
  Player,
  CreatePlayerDto,
  UpdatePlayerDto,
  PlayerHeartbeatDto,
} from '../models';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';
import { parsePaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly siteRepository: SiteRepository
  ) {}

  /**
   * Get player by ID
   */
  async getById(playerId: number, customerId: number): Promise<Player> {
    const player = await this.playerRepository.findById(playerId, customerId);

    if (!player) {
      throw new NotFoundError('Player not found');
    }

    return player;
  }

  /**
   * List all players for a customer with filters and pagination
   */
  async list(
    customerId: number,
    filters?: {
      page?: string;
      limit?: string;
      siteId?: number;
      status?: string;
      search?: string;
    }
  ): Promise<{ data: Player[]; total: number; page: number; limit: number }> {
    const { page, limit } = parsePaginationParams({
      page: filters?.page,
      limit: filters?.limit,
    });

    const offset = (page - 1) * limit;

    const players = await this.playerRepository.findByCustomerId(customerId, {
      siteId: filters?.siteId,
      status: filters?.status,
      search: filters?.search,
      limit,
      offset,
    });

    const total = await this.playerRepository.countByCustomerId(customerId);

    return {
      data: players,
      total,
      page,
      limit,
    };
  }

  /**
   * Create new player
   *
   * Business rules:
   * 1. Verify site belongs to the customer
   * 2. Check player code is unique within the site
   * 3. Create player record
   */
  async create(data: CreatePlayerDto, customerId: number): Promise<Player> {
    // 1. Verify site exists and belongs to customer
    const site = await this.siteRepository.findById(data.siteId, customerId);

    if (!site) {
      throw new ForbiddenError('Site not found or does not belong to your organization');
    }

    // 2. Check player code uniqueness within site
    const codeExists = await this.playerRepository.playerCodeExists(
      data.playerCode,
      data.siteId
    );

    if (codeExists) {
      throw new ValidationError(
        `Player code '${data.playerCode}' already exists for this site`
      );
    }

    // 3. Create player
    const player = await this.playerRepository.create(data);

    logger.info('Player created successfully', {
      playerId: player.playerId,
      customerId,
      siteId: data.siteId,
      playerCode: data.playerCode,
    });

    return player;
  }

  /**
   * Update player
   *
   * Business rules:
   * 1. Verify player exists and belongs to customer
   * 2. If updating player code, check uniqueness within site
   * 3. Update player record
   */
  async update(
    playerId: number,
    customerId: number,
    data: UpdatePlayerDto
  ): Promise<Player> {
    // 1. Verify player exists
    const existingPlayer = await this.getById(playerId, customerId);

    // 2. If updating player code, check uniqueness
    if (data.playerCode && data.playerCode !== existingPlayer.playerCode) {
      const codeExists = await this.playerRepository.playerCodeExists(
        data.playerCode,
        existingPlayer.siteId,
        playerId
      );

      if (codeExists) {
        throw new ValidationError(
          `Player code '${data.playerCode}' already exists for this site`
        );
      }
    }

    // 3. Update player
    const updated = await this.playerRepository.update(playerId, customerId, data);

    logger.info('Player updated', {
      playerId,
      customerId,
      updatedFields: Object.keys(data),
    });

    return updated;
  }

  /**
   * Delete player
   */
  async delete(playerId: number, customerId: number): Promise<void> {
    // Verify player exists
    await this.getById(playerId, customerId);

    // Delete player
    await this.playerRepository.delete(playerId, customerId);

    logger.info('Player deleted', { playerId, customerId });
  }

  /**
   * Update player heartbeat
   *
   * Called by player devices to indicate they are online and send status updates.
   * This endpoint does not require customerId validation as it's called by the player itself.
   */
  async heartbeat(data: PlayerHeartbeatDto): Promise<void> {
    await this.playerRepository.updateHeartbeat(data.playerId, {
      status: data.status,
      ipAddress: data.ipAddress,
      playerVersion: data.playerVersion,
      osVersion: data.osVersion,
    });

    logger.debug('Player heartbeat recorded', {
      playerId: data.playerId,
      status: data.status,
    });
  }

  /**
   * Generate activation code for player
   *
   * Used for player activation/pairing flow.
   * Returns a short code that can be displayed on the player screen
   * for manual entry in the CMS.
   */
  async generateActivationCode(
    playerId: number,
    customerId: number
  ): Promise<{ activationCode: string; expiresAt: Date }> {
    // Verify player exists and belongs to customer
    await this.getById(playerId, customerId);

    // Generate new activation code with expiration
    const result = await this.playerRepository.generateActivationCode(
      playerId,
      customerId
    );

    logger.info('Activation code generated', {
      playerId,
      customerId,
      expiresAt: result.expiresAt,
    });

    return result;
  }
}
