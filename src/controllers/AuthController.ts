/**
 * Auth Controller
 *
 * Handles HTTP requests for authentication endpoints.
 * Demonstrates the controller pattern: thin layer that delegates to services.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AuthService } from '../services/AuthService';
import { UserLoginDto, UserRegisterDto } from '../models';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/login
   * User login
   */
  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData: UserLoginDto = req.body;

      const result = await this.authService.login(loginData);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/register
   * User registration
   */
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const registerData: UserRegisterDto = req.body;

      const result = await this.authService.register(registerData);

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token
   */
  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const result = await this.authService.refreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Get current user info
   */
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // User is already attached by authenticate middleware
      res.status(200).json({
        status: 'success',
        data: { user: req.user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * User logout (client-side token removal)
   */
  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a more complex system, you might invalidate the refresh token here
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
