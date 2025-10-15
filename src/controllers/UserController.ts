/**
 * User Controller
 *
 * HTTP request handlers for user management endpoints
 */

import { Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../types/express';

export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * List all users
   * GET /api/v1/users
   */
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.customerId;
      const { role, isActive, assignedSiteId } = req.query;

      const users = await this.userService.list(customerId, {
        role: role as any,
        isActive: isActive as any,
        assignedSiteId: assignedSiteId ? Number(assignedSiteId) : undefined,
      });

      res.json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/v1/users/:userId
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.customerId;
      const { userId } = req.params;

      const user = await this.userService.getById(Number(userId), customerId);

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   * POST /api/v1/users
   */
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.customerId;

      const user = await this.userService.create(customerId, req.body);

      res.status(201).json({
        status: 'success',
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PATCH /api/v1/users/:userId
   */
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.customerId;
      const requestingUserId = req.user!.userId;
      const { userId } = req.params;

      const user = await this.userService.update(
        Number(userId),
        customerId,
        req.body,
        requestingUserId,
      );

      res.json({
        status: 'success',
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * DELETE /api/v1/users/:userId
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.customerId;
      const requestingUserId = req.user!.userId;
      const { userId } = req.params;

      await this.userService.delete(Number(userId), customerId, requestingUserId);

      res.json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset user password
   * POST /api/v1/users/:userId/reset-password
   */
  async resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.customerId;
      const { userId } = req.params;
      const { newPassword } = req.body;

      await this.userService.resetPassword(Number(userId), customerId, newPassword);

      res.json({
        status: 'success',
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
