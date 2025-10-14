"use strict";
/**
 * Auth Controller
 *
 * Handles HTTP requests for authentication endpoints.
 * Demonstrates the controller pattern: thin layer that delegates to services.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * POST /api/v1/auth/login
     * User login
     */
    async login(req, res, next) {
        try {
            const loginData = req.body;
            const result = await this.authService.login(loginData);
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
     * POST /api/v1/auth/register
     * User registration
     */
    async register(req, res, next) {
        try {
            const registerData = req.body;
            const result = await this.authService.register(registerData);
            res.status(201).json({
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/auth/refresh
     * Refresh access token
     */
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await this.authService.refreshToken(refreshToken);
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
     * GET /api/v1/auth/me
     * Get current user info
     */
    async getCurrentUser(req, res, next) {
        try {
            // User is already attached by authenticate middleware
            res.status(200).json({
                status: 'success',
                data: { user: req.user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/auth/logout
     * User logout (client-side token removal)
     */
    async logout(req, res, next) {
        try {
            // In a more complex system, you might invalidate the refresh token here
            res.status(200).json({
                status: 'success',
                message: 'Logged out successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map