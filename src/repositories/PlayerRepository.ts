/**
 * Player Repository
 *
 * Database operations for Players table.
 */

import { BaseRepository } from './BaseRepository';
import { Player, CreatePlayerDto, UpdatePlayerDto } from '../models';
import { NotFoundError } from '../utils/errors';

export class PlayerRepository extends BaseRepository {
  /**
   * Find player by ID
   */
  async findById(playerId: number, customerId: number): Promise<Player | null> {
    const sql = `
      SELECT
        p.PlayerId as playerId,
        p.SiteId as siteId,
        p.Name as name,
        p.PlayerCode as playerCode,
        p.MacAddress as macAddress,
        p.SerialNumber as serialNumber,
        p.Location as location,
        p.ScreenResolution as screenResolution,
        p.Orientation as orientation,
        p.Status as status,
        p.LastHeartbeat as lastHeartbeat,
        p.IpAddress as ipAddress,
        p.PlayerVersion as playerVersion,
        p.OsVersion as osVersion,
        p.IsActive as isActive,
        p.ActivationCode as activationCode,
        p.ActivatedAt as activatedAt,
        p.CreatedAt as createdAt,
        p.UpdatedAt as updatedAt
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE p.PlayerId = @playerId AND s.CustomerId = @customerId
    `;

    return this.queryOne<Player>(sql, { playerId, customerId });
  }

  /**
   * Get all players for a customer
   */
  async findByCustomerId(
    customerId: number,
    options?: {
      siteId?: number;
      status?: string;
      search?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Player[]> {
    let sql = `
      SELECT
        p.PlayerId as playerId,
        p.SiteId as siteId,
        p.Name as name,
        p.PlayerCode as playerCode,
        p.MacAddress as macAddress,
        p.SerialNumber as serialNumber,
        p.Location as location,
        p.ScreenResolution as screenResolution,
        p.Orientation as orientation,
        p.Status as status,
        p.LastHeartbeat as lastHeartbeat,
        p.IpAddress as ipAddress,
        p.PlayerVersion as playerVersion,
        p.OsVersion as osVersion,
        p.IsActive as isActive,
        p.ActivationCode as activationCode,
        p.ActivatedAt as activatedAt,
        p.CreatedAt as createdAt,
        p.UpdatedAt as updatedAt
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE s.CustomerId = @customerId
    `;

    const params: Record<string, unknown> = { customerId };

    if (options?.siteId) {
      sql += ' AND p.SiteId = @siteId';
      params.siteId = options.siteId;
    }

    if (options?.status) {
      sql += ' AND p.Status = @status';
      params.status = options.status;
    }

    if (options?.search) {
      sql += ' AND (p.Name LIKE @search OR p.PlayerCode LIKE @search OR p.Location LIKE @search)';
      params.search = `%${options.search}%`;
    }

    sql += ' ORDER BY p.Name ASC';

    if (options?.limit) {
      sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = options.offset || 0;
      params.limit = options.limit;
    }

    return this.queryMany<Player>(sql, params);
  }

  /**
   * Get all players for a site
   */
  async findBySiteId(siteId: number, customerId: number): Promise<Player[]> {
    const sql = `
      SELECT
        p.PlayerId as playerId,
        p.SiteId as siteId,
        p.Name as name,
        p.PlayerCode as playerCode,
        p.MacAddress as macAddress,
        p.SerialNumber as serialNumber,
        p.Location as location,
        p.ScreenResolution as screenResolution,
        p.Orientation as orientation,
        p.Status as status,
        p.LastHeartbeat as lastHeartbeat,
        p.IpAddress as ipAddress,
        p.PlayerVersion as playerVersion,
        p.OsVersion as osVersion,
        p.IsActive as isActive,
        p.ActivationCode as activationCode,
        p.ActivatedAt as activatedAt,
        p.CreatedAt as createdAt,
        p.UpdatedAt as updatedAt
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE p.SiteId = @siteId AND s.CustomerId = @customerId
      ORDER BY p.Name ASC
    `;

    return this.queryMany<Player>(sql, { siteId, customerId });
  }

  /**
   * Create new player
   */
  async create(data: CreatePlayerDto): Promise<Player> {
    const sql = `
      INSERT INTO Players (
        SiteId, Name, PlayerCode, MacAddress, SerialNumber, Location,
        ScreenResolution, Orientation
      )
      OUTPUT
        INSERTED.PlayerId as playerId,
        INSERTED.SiteId as siteId,
        INSERTED.Name as name,
        INSERTED.PlayerCode as playerCode,
        INSERTED.MacAddress as macAddress,
        INSERTED.SerialNumber as serialNumber,
        INSERTED.Location as location,
        INSERTED.ScreenResolution as screenResolution,
        INSERTED.Orientation as orientation,
        INSERTED.Status as status,
        INSERTED.LastHeartbeat as lastHeartbeat,
        INSERTED.IpAddress as ipAddress,
        INSERTED.PlayerVersion as playerVersion,
        INSERTED.OsVersion as osVersion,
        INSERTED.IsActive as isActive,
        INSERTED.ActivationCode as activationCode,
        INSERTED.ActivatedAt as activatedAt,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @siteId, @name, @playerCode, @macAddress, @serialNumber, @location,
        @screenResolution, @orientation
      )
    `;

    return this.insert<Player>(sql, {
      siteId: data.siteId,
      name: data.name,
      playerCode: data.playerCode,
      macAddress: data.macAddress || null,
      serialNumber: data.serialNumber || null,
      location: data.location || null,
      screenResolution: data.screenResolution || null,
      orientation: data.orientation || 'Landscape',
    });
  }

  /**
   * Update player
   */
  async update(playerId: number, customerId: number, data: UpdatePlayerDto): Promise<Player> {
    const updates: string[] = [];
    const params: Record<string, unknown> = { playerId };

    if (data.name !== undefined) {
      updates.push('Name = @name');
      params.name = data.name;
    }
    if (data.playerCode !== undefined) {
      updates.push('PlayerCode = @playerCode');
      params.playerCode = data.playerCode;
    }
    if (data.macAddress !== undefined) {
      updates.push('MacAddress = @macAddress');
      params.macAddress = data.macAddress;
    }
    if (data.serialNumber !== undefined) {
      updates.push('SerialNumber = @serialNumber');
      params.serialNumber = data.serialNumber;
    }
    if (data.location !== undefined) {
      updates.push('Location = @location');
      params.location = data.location;
    }
    if (data.screenResolution !== undefined) {
      updates.push('ScreenResolution = @screenResolution');
      params.screenResolution = data.screenResolution;
    }
    if (data.orientation !== undefined) {
      updates.push('Orientation = @orientation');
      params.orientation = data.orientation;
    }
    if (data.status !== undefined) {
      updates.push('Status = @status');
      params.status = data.status;
    }
    if (data.ipAddress !== undefined) {
      updates.push('IpAddress = @ipAddress');
      params.ipAddress = data.ipAddress;
    }
    if (data.playerVersion !== undefined) {
      updates.push('PlayerVersion = @playerVersion');
      params.playerVersion = data.playerVersion;
    }
    if (data.osVersion !== undefined) {
      updates.push('OsVersion = @osVersion');
      params.osVersion = data.osVersion;
    }
    if (data.isActive !== undefined) {
      updates.push('IsActive = @isActive');
      params.isActive = data.isActive;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('UpdatedAt = GETUTCDATE()');

    const sql = `
      UPDATE p
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.PlayerId as playerId,
        INSERTED.SiteId as siteId,
        INSERTED.Name as name,
        INSERTED.PlayerCode as playerCode,
        INSERTED.MacAddress as macAddress,
        INSERTED.SerialNumber as serialNumber,
        INSERTED.Location as location,
        INSERTED.ScreenResolution as screenResolution,
        INSERTED.Orientation as orientation,
        INSERTED.Status as status,
        INSERTED.LastHeartbeat as lastHeartbeat,
        INSERTED.IpAddress as ipAddress,
        INSERTED.PlayerVersion as playerVersion,
        INSERTED.OsVersion as osVersion,
        INSERTED.IsActive as isActive,
        INSERTED.ActivationCode as activationCode,
        INSERTED.ActivatedAt as activatedAt,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE p.PlayerId = @playerId AND s.CustomerId = @customerId
    `;

    params.customerId = customerId;

    const result = await this.insert<Player>(sql, params);

    if (!result) {
      throw new NotFoundError('Player not found');
    }

    return result;
  }

  /**
   * Update player heartbeat
   */
  async updateHeartbeat(playerId: number, data: { status: string; ipAddress?: string; playerVersion?: string; osVersion?: string }): Promise<void> {
    const updates: string[] = ['LastHeartbeat = GETUTCDATE()', 'Status = @status', 'UpdatedAt = GETUTCDATE()'];
    const params: Record<string, unknown> = { playerId, status: data.status };

    if (data.ipAddress) {
      updates.push('IpAddress = @ipAddress');
      params.ipAddress = data.ipAddress;
    }
    if (data.playerVersion) {
      updates.push('PlayerVersion = @playerVersion');
      params.playerVersion = data.playerVersion;
    }
    if (data.osVersion) {
      updates.push('OsVersion = @osVersion');
      params.osVersion = data.osVersion;
    }

    const sql = `
      UPDATE Players
      SET ${updates.join(', ')}
      WHERE PlayerId = @playerId
    `;

    await this.execute(sql, params);
  }

  /**
   * Delete player
   */
  async delete(playerId: number, customerId: number): Promise<void> {
    const sql = `
      DELETE p
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE p.PlayerId = @playerId AND s.CustomerId = @customerId
    `;

    const rowsAffected = await this.execute(sql, { playerId, customerId });

    if (rowsAffected === 0) {
      throw new NotFoundError('Player not found');
    }
  }

  /**
   * Count players for a customer
   */
  async countByCustomerId(customerId: number): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE s.CustomerId = @customerId
    `;

    const result = await this.queryOne<{ count: number }>(sql, { customerId });
    return result?.count ?? 0;
  }

  /**
   * Check if player code exists
   */
  async playerCodeExists(playerCode: string, siteId: number, excludePlayerId?: number): Promise<boolean> {
    let sql = `
      SELECT COUNT(*) as count
      FROM Players
      WHERE PlayerCode = @playerCode AND SiteId = @siteId
    `;

    const params: Record<string, unknown> = { playerCode, siteId };

    if (excludePlayerId) {
      sql += ' AND PlayerId != @excludePlayerId';
      params.excludePlayerId = excludePlayerId;
    }

    const result = await this.queryOne<{ count: number }>(sql, params);
    return (result?.count ?? 0) > 0;
  }

  /**
   * Generate activation code for player
   */
  async generateActivationCode(playerId: number, customerId: number): Promise<string> {
    // Generate 6-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const sql = `
      UPDATE p
      SET ActivationCode = @code, UpdatedAt = GETUTCDATE()
      OUTPUT INSERTED.ActivationCode as activationCode
      FROM Players p
      INNER JOIN Sites s ON p.SiteId = s.SiteId
      WHERE p.PlayerId = @playerId AND s.CustomerId = @customerId
    `;

    const result = await this.insert<{ activationCode: string }>(sql, {
      playerId,
      customerId,
      code,
    });

    if (!result) {
      throw new NotFoundError('Player not found');
    }

    return result.activationCode;
  }
}
