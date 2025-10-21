/**
 * Player Device Routes
 *
 * API endpoints specifically for player devices (digital signage screens).
 * These endpoints are called by the player software, not by CMS users.
 *
 * @swagger
 * tags:
 *   name: Player Devices
 *   description: Endpoints for digital signage player devices
 */

import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { PlayerService } from '../services/PlayerService';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { SiteRepository } from '../repositories/SiteRepository';
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { PlaylistRepository } from '../repositories/PlaylistRepository';
import { LayoutRepository } from '../repositories/LayoutRepository';
import { ContentRepository } from '../repositories/ContentRepository';
import { ProofOfPlayRepository } from '../repositories/ProofOfPlayRepository';
import { authenticatePlayer } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Initialize dependencies
const playerRepository = new PlayerRepository();
const siteRepository = new SiteRepository();
const scheduleRepository = new ScheduleRepository();
const playlistRepository = new PlaylistRepository();
const layoutRepository = new LayoutRepository();
const contentRepository = new ContentRepository();
const proofOfPlayRepository = new ProofOfPlayRepository();
const playerService = new PlayerService(playerRepository, siteRepository);
const playerController = new PlayerController(playerService);

// All player device routes require authentication (using player JWT tokens)
router.use(authenticatePlayer);

// Validation schemas
const heartbeatSchema = z.object({
  body: z.object({
    status: z.enum(['Online', 'Offline', 'Error']),
    ipAddress: z.string().ip().optional(),
    playerVersion: z.string().optional(),
    osVersion: z.string().optional(),
  }),
});

const logSchema = z.object({
  body: z.object({
    level: z.enum(['info', 'warn', 'error', 'debug']),
    message: z.string().min(1).max(1000),
    metadata: z.record(z.any()).optional(),
  }),
});

const proofOfPlaySchema = z.object({
  params: z.object({
    playerId: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    layoutId: z.number().int().positive(),
    playlistId: z.number().int().positive().optional(),
    scheduleId: z.number().int().positive().optional(),
    playedAt: z.string().datetime(),
    duration: z.number().int().positive().optional(),
  }),
});

/**
 * @swagger
 * /api/v1/player-devices/{playerId}/heartbeat:
 *   post:
 *     summary: Update player heartbeat
 *     description: Called by player devices to indicate online status and send diagnostics
 *     tags: [Player Devices]
 *     security:
 *       - playerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Online, Offline, Error]
 *                 example: Online
 *               ipAddress:
 *                 type: string
 *                 format: ipv4
 *                 example: 192.168.1.100
 *               playerVersion:
 *                 type: string
 *                 example: 2.5.1
 *               osVersion:
 *                 type: string
 *                 example: Windows 10 Build 19045
 *     responses:
 *       200:
 *         description: Heartbeat recorded successfully
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
 *                   example: Heartbeat recorded
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/:playerId/heartbeat',
  validateRequest(heartbeatSchema),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    await playerService.heartbeat({
      playerId: Number(playerId),
      ...req.body,
    });

    res.json({
      status: 'success',
      message: 'Heartbeat recorded',
    });
  }),
);

/**
 * @swagger
 * /api/v1/player-devices/{playerId}/schedule:
 *   get:
 *     summary: Get current schedule for player
 *     description: Retrieve the active schedule with layout to display
 *     tags: [Player Devices]
 *     security:
 *       - playerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     schedule:
 *                       $ref: '#/components/schemas/Schedule'
 *                     layout:
 *                       $ref: '#/components/schemas/Layout'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: No active schedule found
 */
router.get(
  '/:playerId/schedule',
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const player = await playerRepository.findById(Number(playerId), req.user!.customerId);

    if (!player) {
      res.status(404).json({
        status: 'error',
        message: 'Player not found',
      });
      return;
    }

    // Get active schedules for this specific player (priority: Player > Site > Customer)
    const schedules = await scheduleRepository.getActiveSchedulesForPlayer(Number(playerId), req.user!.customerId);

    if (schedules.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'No active schedule found for this player',
      });
      return;
    }

    // Take the highest priority schedule (they're already sorted by priority DESC)
    const activeSchedule = schedules[0];

    // Get layout with all layers directly from the schedule
    const layout = await layoutRepository.findByIdWithLayers(activeSchedule.layoutId, req.user!.customerId);

    if (!layout) {
      res.status(404).json({
        status: 'error',
        message: 'Layout not found',
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        schedule: activeSchedule,
        layout,
      },
    });
  }),
);

/**
 * @swagger
 * /api/v1/player-devices/{playerId}/content:
 *   get:
 *     summary: Get content list for player
 *     description: Retrieve all content that should be available on this player for offline caching
 *     tags: [Player Devices]
 *     security:
 *       - playerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Content list retrieved successfully
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
 *                     $ref: '#/components/schemas/Content'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/:playerId/content',
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const player = await playerRepository.findById(Number(playerId), req.user!.customerId);

    if (!player) {
      res.status(404).json({
        status: 'error',
        message: 'Player not found',
      });
      return;
    }

    // Get all active content for this customer (Status = 'Active')
    const content = await contentRepository.findByCustomerId(req.user!.customerId, {
      status: 'Active',
    });

    res.json({
      status: 'success',
      data: content,
    });
  }),
);

/**
 * @swagger
 * /api/v1/player-devices/{playerId}/logs:
 *   post:
 *     summary: Submit player logs
 *     description: Player devices can submit logs for centralized monitoring
 *     tags: [Player Devices]
 *     security:
 *       - playerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *               - message
 *             properties:
 *               level:
 *                 type: string
 *                 enum: [info, warn, error, debug]
 *                 example: error
 *               message:
 *                 type: string
 *                 example: Failed to load content item
 *                 maxLength: 1000
 *               metadata:
 *                 type: object
 *                 description: Additional context data
 *                 example:
 *                   contentId: 123
 *                   errorCode: NETWORK_ERROR
 *     responses:
 *       201:
 *         description: Log submitted successfully
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
 *                   example: Log recorded
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/:playerId/logs',
  validateRequest(logSchema),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { level, message, metadata } = req.body;

    // In production, you would insert this into PlayerLogs table
    // For now, we'll just log it server-side
    const logData = {
      playerId: Number(playerId),
      customerId: req.user!.customerId,
      level,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
      timestamp: new Date(),
    };

    // TODO: Insert into PlayerLogs table via repository
    console.log('[PLAYER LOG]', logData);

    res.status(201).json({
      status: 'success',
      message: 'Log recorded',
    });
  }),
);

/**
 * @swagger
 * /api/v1/player-devices/{playerId}/proof-of-play:
 *   post:
 *     summary: Submit proof of play
 *     description: Record that a content item was displayed on the player
 *     tags: [Player Devices]
 *     security:
 *       - playerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - layoutId
 *               - playedAt
 *             properties:
 *               layoutId:
 *                 type: integer
 *                 example: 101
 *                 description: ID of layout that was played
 *               playlistId:
 *                 type: integer
 *                 example: 5
 *                 description: ID of playlist (if part of playlist)
 *               scheduleId:
 *                 type: integer
 *                 example: 10
 *                 description: ID of schedule (if part of schedule)
 *               playedAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-17T14:30:00.000Z
 *                 description: When content started playing
 *               duration:
 *                 type: integer
 *                 example: 10
 *                 description: Actual duration played in seconds
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
 *                 message:
 *                   type: string
 *                   example: Proof of play recorded
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/:playerId/proof-of-play',
  validateRequest(proofOfPlaySchema),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { layoutId, playlistId, scheduleId, playedAt, duration } = req.body;

    await proofOfPlayRepository.create({
      playerId: Number(playerId),
      layoutId,
      playlistId,
      scheduleId,
      playedAt: new Date(playedAt),
      duration,
    });

    res.status(201).json({
      status: 'success',
      message: 'Proof of play recorded',
    });
  }),
);

export default router;
