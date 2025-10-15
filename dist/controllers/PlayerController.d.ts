/**
 * Player Controller
 *
 * Handles HTTP requests for player management endpoints.
 * Players are individual screens/devices at sites.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { PlayerService } from '../services/PlayerService';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    /**
     * GET /api/v1/players
     * List all players for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/players/:playerId
     * Get player by ID
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/players
     * Create new player
     *
     * Expects JSON body with:
     * - siteId: number (required)
     * - name: string (required)
     * - playerCode: string (required, unique within site)
     * - macAddress?: string
     * - serialNumber?: string
     * - location?: string
     * - screenResolution?: string
     * - orientation?: 'Landscape' | 'Portrait'
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/players/:playerId
     * Update player metadata
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/players/:playerId
     * Delete player
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/players/:playerId/heartbeat
     * Update player heartbeat
     *
     * Called by player devices to indicate they are online.
     * Expects JSON body with:
     * - status: 'Online' | 'Offline' | 'Error' (required)
     * - ipAddress?: string
     * - playerVersion?: string
     * - osVersion?: string
     */
    heartbeat(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/players/:playerId/activation-code
     * Generate activation code for player
     *
     * Returns a short alphanumeric code that can be used for player activation.
     */
    generateActivationCode(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=PlayerController.d.ts.map