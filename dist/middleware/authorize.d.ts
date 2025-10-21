/**
 * Authorization Middleware
 *
 * Check if authenticated user has required role(s) to access a resource.
 * MUST be used after authenticate middleware.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'SiteManager' | 'Player';
/**
 * Authorize user based on role(s)
 */
export declare const authorize: (...allowedRoles: UserRole[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
/**
 * Authorize Admin only
 */
export declare const authorizeAdmin: (req: AuthRequest, _res: Response, next: NextFunction) => void;
/**
 * Authorize Admin or Editor
 */
export declare const authorizeAdminOrEditor: (req: AuthRequest, _res: Response, next: NextFunction) => void;
/**
 * Check if user can access a specific site
 * SiteManagers can only access their assigned site
 */
export declare const authorizeSiteAccess: (siteId: number) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=authorize.d.ts.map