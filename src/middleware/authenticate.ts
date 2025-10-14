/**
 * Authentication Middleware
 *
 * Verifies JWT tokens for both CMS users and player clients.
 * Separate authentication flows for users and players.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { UnauthorizedError } from '../utils/errors';
import { asyncHandler } from './asyncHandler';

interface UserJwtPayload {
  userId: number;
  customerId: number;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'SiteManager';
  assignedSiteId?: number | null;
}

interface PlayerJwtPayload {
  playerId: number;
  customerId: number;
  siteId: number;
  playerName: string;
}

/**
 * Extract token from Authorization header
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Authenticate CMS user requests
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;

      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        customerId: decoded.customerId,
        email: decoded.email,
        role: decoded.role,
        assignedSiteId: decoded.assignedSiteId,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Authentication token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid authentication token');
      }
      throw new UnauthorizedError('Authentication failed');
    }
  }
);

/**
 * Authenticate player client requests
 */
export const authenticatePlayer = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('No player authentication token provided');
    }

    try {
      const decoded = jwt.verify(token, env.PLAYER_JWT_SECRET) as PlayerJwtPayload;

      // Attach player info to request
      req.player = {
        playerId: decoded.playerId,
        customerId: decoded.customerId,
        siteId: decoded.siteId,
        playerName: decoded.playerName,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Player authentication token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid player authentication token');
      }
      throw new UnauthorizedError('Player authentication failed');
    }
  }
);

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuthenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = extractToken(req);

    if (!token) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;

      req.user = {
        userId: decoded.userId,
        customerId: decoded.customerId,
        email: decoded.email,
        role: decoded.role,
        assignedSiteId: decoded.assignedSiteId,
      };
    } catch (error) {
      // Silently fail for optional auth
    }

    next();
  }
);
