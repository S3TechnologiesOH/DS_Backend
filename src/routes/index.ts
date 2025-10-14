/**
 * Routes Index
 *
 * Central export point for all API routes.
 * Import this in app.ts to wire up all endpoints.
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/content', contentRoutes);

// Future routes can be added here:
// router.use('/customers', customerRoutes);
// router.use('/sites', siteRoutes);
// router.use('/players', playerRoutes);
// router.use('/playlists', playlistRoutes);
// router.use('/schedules', scheduleRoutes);

export default router;
