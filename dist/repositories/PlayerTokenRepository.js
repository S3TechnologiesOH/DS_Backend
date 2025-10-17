"use strict";
/**
 * PlayerToken Repository
 *
 * Data access layer for player refresh tokens.
 * Handles CRUD operations for the PlayerTokens table.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTokenRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class PlayerTokenRepository extends BaseRepository_1.BaseRepository {
    /**
     * Map database row to PlayerToken model
     */
    mapToModel(row) {
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
    async create(data) {
        const sql = `
      INSERT INTO PlayerTokens (PlayerId, Token, ExpiresAt)
      OUTPUT INSERTED.*
      VALUES (@playerId, @token, @expiresAt);
    `;
        const row = await this.insert(sql, {
            playerId: data.playerId,
            token: data.token,
            expiresAt: data.expiresAt,
        });
        return this.mapToModel(row);
    }
    /**
     * Find token by token string
     */
    async findByToken(token) {
        const sql = `
      SELECT *
      FROM PlayerTokens
      WHERE Token = @token
        AND RevokedAt IS NULL;
    `;
        const row = await this.queryOne(sql, { token });
        return row ? this.mapToModel(row) : null;
    }
    /**
     * Find all tokens for a player
     */
    async findByPlayerId(playerId) {
        const sql = `
      SELECT *
      FROM PlayerTokens
      WHERE PlayerId = @playerId
        AND RevokedAt IS NULL
      ORDER BY CreatedAt DESC;
    `;
        const rows = await this.queryMany(sql, { playerId });
        return rows.map(this.mapToModel);
    }
    /**
     * Revoke a token by token string
     */
    async revokeByToken(token) {
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
    async revokeAllByPlayerId(playerId) {
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
    async deleteExpired() {
        const sql = `
      DELETE FROM PlayerTokens
      WHERE ExpiresAt < GETUTCDATE();
    `;
        return await this.execute(sql);
    }
    /**
     * Check if token is valid (not expired and not revoked)
     */
    async isValid(token) {
        const sql = `
      SELECT COUNT(*) as Count
      FROM PlayerTokens
      WHERE Token = @token
        AND RevokedAt IS NULL
        AND ExpiresAt > GETUTCDATE();
    `;
        const result = await this.queryOne(sql, { token });
        return result ? result.Count > 0 : false;
    }
}
exports.PlayerTokenRepository = PlayerTokenRepository;
//# sourceMappingURL=PlayerTokenRepository.js.map