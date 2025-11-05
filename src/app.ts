/**
 * Express Application Setup
 *
 * Configures Express app with middleware, security, and routes.
 */

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/environment';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import apiRoutes from './routes';
import { swaggerSpec } from './config/swagger';
import { getClientIp } from './utils/ipUtils';

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
  const app: Application = express();

  // Trust proxy - Required for Azure App Service and other reverse proxies
  // This allows Express to properly read X-Forwarded-* headers
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet());

  // CORS configuration
  const corsOptions = {
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: env.CORS_CREDENTIALS,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Rate limiting - Disabled in development, lenient in production
  // Skip player device endpoints as they're authenticated and have legitimate high frequency
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    // Custom key generator to handle IPs with port numbers (from Azure App Service)
    keyGenerator: (req) => getClientIp(req),
    // Skip rate limiting for:
    // - Development environment (too restrictive for dev workflow)
    // - Player device endpoints (authenticated, need high frequency for heartbeats/schedules)
    skip: (req) => {
      return env.NODE_ENV === 'development' || req.path.startsWith('/v1/player-devices');
    },
  });
  app.use('/api', limiter);

  // Request logging in development
  if (env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
      logger.debug(`${req.method} ${req.path}`, {
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
      environment: env.NODE_ENV,
    });
  });

  // Swagger API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Digital Signage API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // OpenAPI JSON specification endpoint
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // API Routes - all routes are prefixed with /api/v1
  app.use('/api/v1', apiRoutes);

  // Additional route modules can be added in src/routes/index.ts:
  // - /api/v1/auth (login, register, token refresh)
  // - /api/v1/content (media upload, list, update, delete)
  // - /api/v1/customers (customer management)
  // - /api/v1/sites (site management)
  // - /api/v1/players (player management)
  // - /api/v1/playlists (playlist management)
  // - /api/v1/schedules (schedule management)

  // 404 handler (must be after all routes)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
