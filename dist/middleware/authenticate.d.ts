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
export declare const authenticate: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
/**
 * Authenticate player client requests
 */
export declare const authenticatePlayer: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
/**
 * Optional authentication - doesn't fail if no token provided
 */
export declare const optionalAuthenticate: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
/**
 * Authenticate both CMS users and player clients
 * Tries player authentication first, then falls back to user authentication
 */
export declare const authenticateUserOrPlayer: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
//# sourceMappingURL=authenticate.d.ts.map