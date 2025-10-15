/**
 * Analytics Routes
 *
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting endpoints
 */

import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { AnalyticsService } from '../services/AnalyticsService';
import { AnalyticsRepository } from '../repositories/AnalyticsRepository';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Initialize dependencies
const analyticsRepository = new AnalyticsRepository();
const analyticsService = new AnalyticsService(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsService);

// All analytics routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/analytics/summary:
 *   get:
 *     summary: Get analytics summary for date range
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date (YYYY-MM-DD). Defaults to 30 days ago.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: End date (YYYY-MM-DD). Defaults to today.
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: integer
 *         description: Filter by site ID
 *       - in: query
 *         name: playerId
 *         schema:
 *           type: integer
 *         description: Filter by player ID
 *       - in: query
 *         name: contentId
 *         schema:
 *           type: integer
 *         description: Filter by content ID
 *       - in: query
 *         name: playlistId
 *         schema:
 *           type: integer
 *         description: Filter by playlist ID
 *     responses:
 *       200:
 *         description: Analytics summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/AnalyticsSummary'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/summary', asyncHandler(analyticsController.getSummary.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/content:
 *   get:
 *     summary: Get content analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date (YYYY-MM-DD). Defaults to 30 days ago.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: End date (YYYY-MM-DD). Defaults to today.
 *     responses:
 *       200:
 *         description: Content analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentAnalytics'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/content', asyncHandler(analyticsController.getContentAnalytics.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/players:
 *   get:
 *     summary: Get player analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: integer
 *         description: Filter by site ID
 *     responses:
 *       200:
 *         description: Player analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PlayerAnalytics'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/players', asyncHandler(analyticsController.getPlayerAnalytics.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/sites:
 *   get:
 *     summary: Get site analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Site analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SiteAnalytics'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/sites', asyncHandler(analyticsController.getSiteAnalytics.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/playback-report:
 *   get:
 *     summary: Get playback report by date
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date (YYYY-MM-DD). Defaults to 30 days ago.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: End date (YYYY-MM-DD). Defaults to today.
 *     responses:
 *       200:
 *         description: Playback report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PlaybackReport'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/playback-report', asyncHandler(analyticsController.getPlaybackReport.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/content-performance:
 *   get:
 *     summary: Get content performance metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date (YYYY-MM-DD). Defaults to 30 days ago.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: End date (YYYY-MM-DD). Defaults to today.
 *     responses:
 *       200:
 *         description: Content performance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentPerformance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/content-performance', asyncHandler(analyticsController.getContentPerformance.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/proof-of-play:
 *   post:
 *     summary: Record proof of play (called by players)
 *     description: Called by digital signage players when content playback starts
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerId
 *               - contentId
 *             properties:
 *               playerId:
 *                 type: integer
 *                 description: ID of the player device
 *                 example: 1
 *               contentId:
 *                 type: integer
 *                 description: ID of the content being played
 *                 example: 5
 *               playlistId:
 *                 type: integer
 *                 description: Optional playlist ID if content is from a playlist
 *                 example: 3
 *               scheduleId:
 *                 type: integer
 *                 description: Optional schedule ID if content is scheduled
 *                 example: 2
 *     responses:
 *       201:
 *         description: Proof of play recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ProofOfPlay'
 *                 message:
 *                   type: string
 *                   example: Proof of play recorded successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/proof-of-play', asyncHandler(analyticsController.recordProofOfPlay.bind(analyticsController)));

/**
 * @swagger
 * /api/v1/analytics/proof-of-play/{proofOfPlayId}:
 *   patch:
 *     summary: Complete proof of play (called by players)
 *     description: Called by digital signage players when content playback ends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proofOfPlayId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Proof of play ID returned from POST /proof-of-play
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: Playback duration in seconds
 *                 example: 30
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Proof of play completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Proof of play completed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/proof-of-play/:proofOfPlayId', asyncHandler(analyticsController.completeProofOfPlay.bind(analyticsController)));

export default router;
