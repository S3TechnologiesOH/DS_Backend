/**
 * Authorization Middleware
 *
 * Check if authenticated user has required role(s) to access a resource.
 * MUST be used after authenticate middleware.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'SiteManager' | 'Player';

/**
 * Authorize user based on role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    // Ensure user is authenticated
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions to access this resource');
    }

    next();
  };
};

/**
 * Authorize Admin only
 */
export const authorizeAdmin = authorize('Admin');

/**
 * Authorize Admin or Editor
 */
export const authorizeAdminOrEditor = authorize('Admin', 'Editor');

/**
 * Check if user can access a specific site
 * SiteManagers can only access their assigned site
 */
export const authorizeSiteAccess = (siteId: number) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { role, assignedSiteId } = req.user;

    // Admins and Editors can access all sites
    if (role === 'Admin' || role === 'Editor') {
      next();
      return;
    }

    // SiteManagers can only access their assigned site
    if (role === 'SiteManager') {
      if (!assignedSiteId) {
        throw new ForbiddenError('Site manager has no assigned site');
      }
      if (assignedSiteId !== siteId) {
        throw new ForbiddenError('Access denied to this site');
      }
      next();
      return;
    }

    // Viewers should not have write access (handled by specific role checks)
    throw new ForbiddenError('Insufficient permissions');
  };
};
