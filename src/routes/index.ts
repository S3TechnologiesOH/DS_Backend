/**
 * Routes Index
 *
 * Central export point for all API routes.
 * Import this in app.ts to wire up all endpoints.
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import customerRoutes from './customer.routes';
import siteRoutes from './site.routes';
import playerRoutes from './player.routes';
import playlistRoutes from './playlist.routes';
import scheduleRoutes from './schedule.routes';
import analyticsRoutes from './analytics.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/customers', customerRoutes);
router.use('/sites', siteRoutes);
router.use('/players', playerRoutes);
router.use('/playlists', playlistRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
