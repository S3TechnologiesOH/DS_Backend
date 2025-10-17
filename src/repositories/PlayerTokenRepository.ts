/**
 * PlayerToken Repository
 *
 * Data access layer for player refresh tokens.
 * Handles CRUD operations for the PlayerTokens table.
 */

import { BaseRepository } from './BaseRepository';
import { PlayerToken, CreatePlayerTokenDto } from '../models/PlayerToken';

interface PlayerTokenRow {
  TokenId: number;
  PlayerId: number;
  Token: string;
  ExpiresAt: Date;
  RevokedAt: Date | null;
  CreatedAt: Date;
}

export class PlayerTokenRepository extends BaseRepository {
  /**
   * Map database row to PlayerToken model
   */
  private mapToModel(row: PlayerTokenRow): PlayerToken {
    return {
      tokenId: row.TokenId,
      playerId: row.PlayerId,
      token: row.Token,
      expiresAt: row.ExpiresAt,
      revokedAt: row.RevokedAt,
      createdAt: row.CreatedAt,
    };
  }

  /**
   * Create a new player token
   */
  async create(data: CreatePlayerTokenDto): Promise<PlayerToken> {
    const sql = `
      INSERT INTO PlayerTokens (PlayerId, Token, ExpiresAt)
      OUTPUT INSERTED.*
      VALUES (@playerId, @token, @expiresAt);
    `;

    const row = await this.insert<PlayerTokenRow>(sql, {
      playerId: data.playerId,
      token: data.token,
      expiresAt: data.expiresAt,
    });

    return this.mapToModel(row);
  }

  /**
   * Find token by token string
   */
  async findByToken(token: string): Promise<PlayerToken | null> {
    const sql = `
      SELECT *
      FROM PlayerTokens
      WHERE Token = @token
        AND RevokedAt IS NULL;
    `;

    const row = await this.queryOne<PlayerTokenRow>(sql, { token });
    return row ? this.mapToModel(row) : null;
  }

  /**
   * Find all tokens for a player
   */
  async findByPlayerId(playerId: number): Promise<PlayerToken[]> {
    const sql = `
      SELECT *
      FROM PlayerTokens
      WHERE PlayerId = @playerId
        AND RevokedAt IS NULL
      ORDER BY CreatedAt DESC;
    `;

    const rows = await this.queryMany<PlayerTokenRow>(sql, { playerId });
    return rows.map(this.mapToModel);
  }

  /**
   * Revoke a token by token string
   */
  async revokeByToken(token: string): Promise<void> {
    const sql = `
      UPDATE PlayerTokens
      SET RevokedAt = GETUTCDATE()
      WHERE Token = @token
        AND RevokedAt IS NULL;
    `;

    await this.execute(sql, { token });
  }

  /**
   * Revoke all tokens for a player
   */
  async revokeAllByPlayerId(playerId: number): Promise<void> {
    const sql = `
      UPDATE PlayerTokens
      SET RevokedAt = GETUTCDATE()
      WHERE PlayerId = @playerId
        AND RevokedAt IS NULL;
    `;

    await this.execute(sql, { playerId });
  }

  /**
   * Delete expired tokens (cleanup)
   */
  async deleteExpired(): Promise<number> {
    const sql = `
      DELETE FROM PlayerTokens
      WHERE ExpiresAt < GETUTCDATE();
    `;

    return await this.execute(sql);
  }

  /**
   * Check if token is valid (not expired and not revoked)
   */
  async isValid(token: string): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) as Count
      FROM PlayerTokens
      WHERE Token = @token
        AND RevokedAt IS NULL
        AND ExpiresAt > GETUTCDATE();
    `;

    const result = await this.queryOne<{ Count: number }>(sql, { token });
    return result ? result.Count > 0 : false;
  }
}
