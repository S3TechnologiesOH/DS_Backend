/**
 * Auth Controller
 *
 * Handles HTTP requests for authentication endpoints.
 * Demonstrates the controller pattern: thin layer that delegates to services.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AuthService } from '../services/AuthService';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    /**
     * POST /api/v1/auth/login
     * User login
     */
    login(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/register
     * User registration
     */
    register(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/refresh
     * Refresh access token
     */
    refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/auth/me
     * Get current user info
     */
    getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/logout
     * User logout (client-side token removal)
     */
    logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map