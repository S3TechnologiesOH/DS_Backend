/**
 * Player Service
 *
 * Business logic for player management including activation code generation,
 * heartbeat updates, and player lifecycle management.
 */
import { PlayerRepository } from '../repositories/PlayerRepository';
import { SiteRepository } from '../repositories/SiteRepository';
import { Player, CreatePlayerDto, UpdatePlayerDto, PlayerHeartbeatDto } from '../models';
export declare class PlayerService {
    private readonly playerRepository;
    private readonly siteRepository;
    constructor(playerRepository: PlayerRepository, siteRepository: SiteRepository);
    /**
     * Get player by ID
     */
    getById(playerId: number, customerId: number): Promise<Player>;
    /**
     * List all players for a customer with filters and pagination
     */
    list(customerId: number, filters?: {
        page?: string;
        limit?: string;
        siteId?: number;
        status?: string;
        search?: string;
    }): Promise<{
        data: Player[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Create new player
     *
     * Business rules:
     * 1. Verify site belongs to the customer
     * 2. Check player code is unique within the site
     * 3. Create player record
     */
    create(data: CreatePlayerDto, customerId: number): Promise<Player>;
    /**
     * Update player
     *
     * Business rules:
     * 1. Verify player exists and belongs to customer
     * 2. If updating player code, check uniqueness within site
     * 3. Update player record
     */
    update(playerId: number, customerId: number, data: UpdatePlayerDto): Promise<Player>;
    /**
     * Delete player
     */
    delete(playerId: number, customerId: number): Promise<void>;
    /**
     * Update player heartbeat
     *
     * Called by player devices to indicate they are online and send status updates.
     * This endpoint does not require customerId validation as it's called by the player itself.
     */
    heartbeat(data: PlayerHeartbeatDto): Promise<void>;
    /**
     * Generate activation code for player
     *
     * Used for player activation/pairing flow.
     * Returns a short code that can be displayed on the player screen
     * for manual entry in the CMS.
     */
    generateActivationCode(playerId: number, customerId: number): Promise<{
        activationCode: string;
    }>;
}
//# sourceMappingURL=PlayerService.d.ts.map