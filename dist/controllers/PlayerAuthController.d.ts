/**
 * Player Authentication Controller
 *
 * Handles HTTP requests for player device authentication endpoints.
 * Players have a separate auth flow from CMS users.
 */
import { Request, Response, NextFunction } from 'express';
import { PlayerAuthService } from '../services/PlayerAuthService';
export declare class PlayerAuthController {
    private readonly playerAuthService;
    constructor(playerAuthService: PlayerAuthService);
    /**
     * POST /api/v1/player-auth/activate
     * Activate player using activation code
     */
    activate(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/player-auth/refresh
     * Refresh player access token
     */
    refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/player-auth/logout
     * Logout player by revoking refresh token
     */
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=PlayerAuthController.d.ts.map