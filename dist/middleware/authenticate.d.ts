/**
 * Authentication Middleware
 *
 * Verifies JWT tokens for both CMS users and player clients.
 * Separate authentication flows for users and players.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Authenticate CMS user requests
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Authenticate player client requests
 */
export declare const authenticatePlayer: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Optional authentication - doesn't fail if no token provided
 */
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authenticate.d.ts.map