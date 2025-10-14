"use strict";
/**
 * Express Application Setup
 *
 * Configures Express app with middleware, security, and routes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("./config/environment");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
/**
 * Create and configure Express application
 */
const createApp = () => {
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)());
    // CORS configuration
    const corsOptions = {
        origin: environment_1.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
        credentials: environment_1.env.CORS_CREDENTIALS,
        optionsSuccessStatus: 200,
    };
    app.use((0, cors_1.default)(corsOptions));
    // Body parsing middleware
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Compression middleware
    app.use((0, compression_1.default)());
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: environment_1.env.RATE_LIMIT_WINDOW_MS,
        max: environment_1.env.RATE_LIMIT_MAX_REQUESTS,
        message: 'Too many requests from this IP, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api', limiter);
    // Request logging in development
    if (environment_1.env.NODE_ENV === 'development') {
        app.use((req, _res, next) => {
            logger_1.default.debug(`${req.method} ${req.path}`, {
                query: req.query,
                body: req.body,
            });
            next();
        });
    }
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: environment_1.env.NODE_ENV,
        });
    });
    // API Routes - all routes are prefixed with /api/v1
    app.use('/api/v1', routes_1.default);
    // Additional route modules can be added in src/routes/index.ts:
    // - /api/v1/auth (login, register, token refresh)
    // - /api/v1/content (media upload, list, update, delete)
    // - /api/v1/customers (customer management)
    // - /api/v1/sites (site management)
    // - /api/v1/players (player management)
    // - /api/v1/playlists (playlist management)
    // - /api/v1/schedules (schedule management)
    // 404 handler (must be after all routes)
    app.use(errorHandler_1.notFoundHandler);
    // Global error handler (must be last)
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map