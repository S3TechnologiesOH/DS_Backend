"use strict";
/**
 * Routes Index
 *
 * Central export point for all API routes.
 * Import this in app.ts to wire up all endpoints.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const content_routes_1 = __importDefault(require("./content.routes"));
const router = (0, express_1.Router)();
// Mount route modules
router.use('/auth', auth_routes_1.default);
router.use('/content', content_routes_1.default);
// Future routes can be added here:
// router.use('/customers', customerRoutes);
// router.use('/sites', siteRoutes);
// router.use('/players', playerRoutes);
// router.use('/playlists', playlistRoutes);
// router.use('/schedules', scheduleRoutes);
exports.default = router;
//# sourceMappingURL=index.js.map