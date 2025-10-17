/**
 * Express Type Extensions
 *
 * Extends Express Request type to include custom properties.
 */

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // User authentication (CMS users) or Player authentication (display devices)
      user?: {
        // CMS User fields
        userId?: number;
        email?: string;
        role: 'Admin' | 'Editor' | 'Viewer' | 'SiteManager' | 'Player';
        assignedSiteId?: number | null;

        // Player fields (when role === 'Player')
        playerId?: number;
        siteId?: number;

        // Common fields
        customerId: number;
      };

      // File upload information
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export interface AuthRequest extends Request {
  user: NonNullable<Request['user']>;
  body: any;
  query: any;
  params: any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}
