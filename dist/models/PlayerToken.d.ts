/**
 * PlayerToken Model
 *
 * Represents refresh tokens for player device authentication.
 */
export interface PlayerToken {
    tokenId: number;
    playerId: number;
    token: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
}
export interface CreatePlayerTokenDto {
    playerId: number;
    token: string;
    expiresAt: Date;
}
export interface UpdatePlayerTokenDto {
    revokedAt?: Date;
}
//# sourceMappingURL=PlayerToken.d.ts.map