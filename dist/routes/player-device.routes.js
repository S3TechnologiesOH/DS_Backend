"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerController_1 = require("../controllers/PlayerController");
const PlayerService_1 = require("../services/PlayerService");
const PlayerRepository_1 = require("../repositories/PlayerRepository");
const SiteRepository_1 = require("../repositories/SiteRepository");
const ScheduleRepository_1 = require("../repositories/ScheduleRepository");
const PlaylistRepository_1 = require("../repositories/PlaylistRepository");
const LayoutRepository_1 = require("../repositories/LayoutRepository");
const ContentRepository_1 = require("../repositories/ContentRepository");
const ProofOfPlayRepository_1 = require("../repositories/ProofOfPlayRepository");
const authenticate_1 = require("../middleware/authenticate");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validateRequest_1 = require("../middleware/validateRequest");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Initialize dependencies
const playerRepository = new PlayerRepository_1.PlayerRepository();
const siteRepository = new SiteRepository_1.SiteRepository();
const scheduleRepository = new ScheduleRepository_1.ScheduleRepository();
const playlistRepository = new PlaylistRepository_1.PlaylistRepository();
const layoutRepository = new LayoutRepository_1.LayoutRepository();
const contentRepository = new ContentRepository_1.ContentRepository();
const proofOfPlayRepository = new ProofOfPlayRepository_1.ProofOfPlayRepository();
const playerService = new PlayerService_1.PlayerService(playerRepository, siteRepository);
const playerController = new PlayerController_1.PlayerController(playerService);
// All player device routes require authentication (using player JWT tokens)
router.use(authenticate_1.authenticatePlayer);
// Validation schemas
const heartbeatSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['Online', 'Offline', 'Error']),
        ipAddress: zod_1.z
            .string()
            .refine((val) => {
            // Allow IP addresses with or without port (e.g., "192.168.1.1" or "192.168.1.1:8080")
            const ipWithoutPort = val.split(':')[0];
            // Basic IP validation (IPv4 or IPv6)
            const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
            const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
            return ipv4Regex.test(ipWithoutPort) || ipv6Regex.test(ipWithoutPort);
        }, { message: 'Invalid IP address format' })
            .transform((val) => val.split(':')[0]) // Strip port if present
            .optional(),
        playerVersion: zod_1.z.string().optional(),
        osVersion: zod_1.z.string().optional(),
    }),
});
const logSchema = zod_1.z.object({
    body: zod_1.z.object({
        level: zod_1.z.enum(['info', 'warn', 'error', 'debug']),
        message: zod_1.z.string().min(1).max(1000),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
const proofOfPlaySchema = zod_1.z.object({
    params: zod_1.z.object({
        playerId: zod_1.z.string().regex(/^\d+$/),
    }),
    body: zod_1.z.object({
        layoutId: zod_1.z.number().int().positive(),
        playlistId: zod_1.z.number().int().positive().optional(),
        scheduleId: zod_1.z.number().int().positive().optional(),
        playedAt: zod_1.z.string().datetime(),
        duration: zod_1.z.number().int().positive().optional(),
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
router.post('/:playerId/heartbeat', (0, validateRequest_1.validateRequest)(heartbeatSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { playerId } = req.params;
    await playerService.heartbeat({
        playerId: Number(playerId),
        ...req.body,
    });
    res.json({
        status: 'success',
        message: 'Heartbeat recorded',
    });
}));
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
router.get('/:playerId/schedule', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { playerId } = req.params;
    const player = await playerRepository.findById(Number(playerId), req.user.customerId);
    if (!player) {
        res.status(404).json({
            status: 'error',
            message: 'Player not found',
        });
        return;
    }
    // Get active schedules for this specific player (priority: Player > Site > Customer)
    const schedules = await scheduleRepository.getActiveSchedulesForPlayer(Number(playerId), req.user.customerId);
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
    const layout = await layoutRepository.findByIdWithLayers(activeSchedule.layoutId, req.user.customerId);
    if (!layout) {
        res.status(404).json({
            status: 'error',
            message: 'Layout not found',
        });
        return;
    }
    // Extract content from layout layers
    const content = [];
    for (const layer of layout.layers) {
        // Check if layer has playlist content configuration
        if (layer.contentConfig) {
            const config = typeof layer.contentConfig === 'string'
                ? JSON.parse(layer.contentConfig)
                : layer.contentConfig;
            const playlistId = config.playlistId;
            if (playlistId) {
                // Get playlist with items and content details
                const playlistWithItems = await playlistRepository.findByIdWithItems(playlistId, req.user.customerId);
                if (playlistWithItems && playlistWithItems.items) {
                    // Add each content item from this playlist
                    for (const item of playlistWithItems.items) {
                        content.push({
                            contentId: item.contentId,
                            name: item.content.name,
                            contentType: item.content.contentType,
                            fileUrl: item.content.url,
                            thumbnailUrl: null, // Not in current schema
                            duration: item.duration || 10,
                            displayOrder: item.displayOrder,
                            transitionType: item.transitionType || 'None',
                            transitionDuration: item.transitionDuration || 0,
                            mimeType: null, // Not in current schema
                            fileSize: null, // Not in current schema
                            width: null, // Not in current schema
                            height: null, // Not in current schema
                        });
                    }
                }
            }
        }
    }
    // Sort content by display order
    content.sort((a, b) => a.displayOrder - b.displayOrder);
    res.json({
        status: 'success',
        data: {
            schedule: activeSchedule,
            playlist: {
                playlistId: 0, // Virtual playlist from layout
                name: layout.name,
                description: `Content from layout: ${layout.name}`,
                isActive: true,
            },
            layout,
            content,
        },
    });
}));
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
router.get('/:playerId/content', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { playerId } = req.params;
    const player = await playerRepository.findById(Number(playerId), req.user.customerId);
    if (!player) {
        res.status(404).json({
            status: 'error',
            message: 'Player not found',
        });
        return;
    }
    // Get all active content for this customer (Status = 'Active')
    const content = await contentRepository.findByCustomerId(req.user.customerId, {
        status: 'Active',
    });
    res.json({
        status: 'success',
        data: content,
    });
}));
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
router.post('/:playerId/logs', (0, validateRequest_1.validateRequest)(logSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { playerId } = req.params;
    const { level, message, metadata } = req.body;
    // In production, you would insert this into PlayerLogs table
    // For now, we'll just log it server-side
    const logData = {
        playerId: Number(playerId),
        customerId: req.user.customerId,
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
}));
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
router.post('/:playerId/proof-of-play', (0, validateRequest_1.validateRequest)(proofOfPlaySchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
}));
exports.default = router;
//# sourceMappingURL=player-device.routes.js.map