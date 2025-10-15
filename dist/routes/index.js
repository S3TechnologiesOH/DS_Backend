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
const customer_routes_1 = __importDefault(require("./customer.routes"));
const site_routes_1 = __importDefault(require("./site.routes"));
const player_routes_1 = __importDefault(require("./player.routes"));
const playlist_routes_1 = __importDefault(require("./playlist.routes"));
const schedule_routes_1 = __importDefault(require("./schedule.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const webhook_routes_1 = __importDefault(require("./webhook.routes"));
const router = (0, express_1.Router)();
// Mount route modules
router.use('/auth', auth_routes_1.default);
router.use('/content', content_routes_1.default);
router.use('/customers', customer_routes_1.default);
router.use('/sites', site_routes_1.default);
router.use('/players', player_routes_1.default);
router.use('/playlists', playlist_routes_1.default);
router.use('/schedules', schedule_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/webhooks', webhook_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map