/**
 * User Controller
 *
 * HTTP request handlers for user management endpoints
 */
import { Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../types/express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    /**
     * List all users
     * GET /api/v1/users
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by ID
     * GET /api/v1/users/:userId
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create new user
     * POST /api/v1/users
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user
     * PATCH /api/v1/users/:userId
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete user
     * DELETE /api/v1/users/:userId
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Reset user password
     * POST /api/v1/users/:userId/reset-password
     */
    resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map