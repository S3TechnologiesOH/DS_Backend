"use strict";
/**
 * Player Authentication Controller
 *
 * Handles HTTP requests for player device authentication endpoints.
 * Players have a separate auth flow from CMS users.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAuthController = void 0;
class PlayerAuthController {
    playerAuthService;
    constructor(playerAuthService) {
        this.playerAuthService = playerAuthService;
    }
    /**
     * POST /api/v1/player-auth/activate
     * Activate player using activation code
     */
    async activate(req, res, next) {
        try {
            const { playerCode, activationCode } = req.body;
            const result = await this.playerAuthService.activate(playerCode, activationCode);
            res.status(200).json({
                status: 'success',
                data: result,
                message: 'Player activated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/player-auth/refresh
     * Refresh player access token
     */
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await this.playerAuthService.refresh(refreshToken);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/player-auth/logout
     * Logout player by revoking refresh token
     */
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await this.playerAuthService.logout(refreshToken);
            res.status(200).json({
                status: 'success',
                message: 'Player logged out successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlayerAuthController = PlayerAuthController;
//# sourceMappingURL=PlayerAuthController.js.map