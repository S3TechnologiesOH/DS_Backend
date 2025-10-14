"use strict";
/**
 * Authorization Middleware
 *
 * Check if authenticated user has required role(s) to access a resource.
 * MUST be used after authenticate middleware.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeSiteAccess = exports.authorizeAdminOrEditor = exports.authorizeAdmin = exports.authorize = void 0;
const errors_1 = require("../utils/errors");
/**
 * Authorize user based on role(s)
 */
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        // Ensure user is authenticated
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Authentication required');
        }
        // Check if user has one of the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            throw new errors_1.ForbiddenError('Insufficient permissions to access this resource');
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Authorize Admin only
 */
exports.authorizeAdmin = (0, exports.authorize)('Admin');
/**
 * Authorize Admin or Editor
 */
exports.authorizeAdminOrEditor = (0, exports.authorize)('Admin', 'Editor');
/**
 * Check if user can access a specific site
 * SiteManagers can only access their assigned site
 */
const authorizeSiteAccess = (siteId) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Authentication required');
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
                throw new errors_1.ForbiddenError('Site manager has no assigned site');
            }
            if (assignedSiteId !== siteId) {
                throw new errors_1.ForbiddenError('Access denied to this site');
            }
            next();
            return;
        }
        // Viewers should not have write access (handled by specific role checks)
        throw new errors_1.ForbiddenError('Insufficient permissions');
    };
};
exports.authorizeSiteAccess = authorizeSiteAccess;
//# sourceMappingURL=authorize.js.map