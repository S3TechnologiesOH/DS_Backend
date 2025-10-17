"use strict";
/**
 * Authentication Middleware
 *
 * Verifies JWT tokens for both CMS users and player clients.
 * Separate authentication flows for users and players.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticatePlayer = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const errors_1 = require("../utils/errors");
const asyncHandler_1 = require("./asyncHandler");
/**
 * Extract token from Authorization header
 */
const extractToken = (req) => {
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
exports.authenticate = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const token = extractToken(req);
    if (!token) {
        throw new errors_1.UnauthorizedError('No authentication token provided');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.env.JWT_SECRET);
        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            customerId: decoded.customerId,
            email: decoded.email,
            role: decoded.role,
            assignedSiteId: decoded.assignedSiteId,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errors_1.UnauthorizedError('Authentication token expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errors_1.UnauthorizedError('Invalid authentication token');
        }
        throw new errors_1.UnauthorizedError('Authentication failed');
    }
});
/**
 * Authenticate player client requests
 */
exports.authenticatePlayer = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const token = extractToken(req);
    if (!token) {
        throw new errors_1.UnauthorizedError('No player authentication token provided');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.env.PLAYER_JWT_SECRET);
        // Verify token type
        if (decoded.type !== 'player') {
            throw new errors_1.UnauthorizedError('Invalid player token type');
        }
        // Attach player info to request (as user with Player role)
        req.user = {
            playerId: decoded.playerId,
            customerId: decoded.customerId,
            siteId: decoded.siteId,
            role: 'Player',
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errors_1.UnauthorizedError('Player authentication token expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errors_1.UnauthorizedError('Invalid player authentication token');
        }
        throw new errors_1.UnauthorizedError('Player authentication failed');
    }
});
/**
 * Optional authentication - doesn't fail if no token provided
 */
exports.optionalAuthenticate = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const token = extractToken(req);
    if (!token) {
        next();
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            customerId: decoded.customerId,
            email: decoded.email,
            role: decoded.role,
            assignedSiteId: decoded.assignedSiteId,
        };
    }
    catch (error) {
        // Silently fail for optional auth
    }
    next();
});
//# sourceMappingURL=authenticate.js.map