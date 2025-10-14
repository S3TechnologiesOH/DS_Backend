/**
 * Express Type Extensions
 *
 * Extends Express Request type to include custom properties.
 */

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // User authentication (CMS users)
      user?: {
        userId: number;
        customerId: number;
        email: string;
        role: 'Admin' | 'Editor' | 'Viewer' | 'SiteManager';
        assignedSiteId?: number | null;
      };

      // Player authentication (display devices)
      player?: {
        playerId: number;
        customerId: number;
        siteId: number;
        playerName: string;
      };

      // File upload information
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export interface AuthRequest extends Request {
  user: NonNullable<Request['user']>;
}

export interface PlayerAuthRequest extends Request {
  player: NonNullable<Request['player']>;
}
