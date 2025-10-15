"use strict";
/**
 * Player Routes
 *
 * API endpoints for player (digital signage device) management.
 * Players are individual screens/devices at sites.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerController_1 = require("../controllers/PlayerController");
const PlayerService_1 = require("../services/PlayerService");
const PlayerRepository_1 = require("../repositories/PlayerRepository");
const SiteRepository_1 = require("../repositories/SiteRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const player_validator_1 = require("../validators/player.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const playerRepository = new PlayerRepository_1.PlayerRepository();
const siteRepository = new SiteRepository_1.SiteRepository();
const playerService = new PlayerService_1.PlayerService(playerRepository, siteRepository);
const playerController = new PlayerController_1.PlayerController(playerService);
// All player routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /players:
 *   get:
 *     summary: List all players
 *     description: Get all players for the authenticated user's customer with pagination and filtering
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: integer
 *         description: Filter by site ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Online, Offline, Error]
 *         description: Filter by player status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by player name or code
 *     responses:
 *       200:
 *         description: Players list retrieved successfully
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
 *                     $ref: '#/components/schemas/Player'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', (0, validateRequest_1.validateRequest)(player_validator_1.listPlayersSchema), (0, asyncHandler_1.asyncHandler)(playerController.list.bind(playerController)));
/**
 * @swagger
 * /players/{playerId}:
 *   get:
 *     summary: Get player by ID
 *     description: Retrieve a specific player with all details
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 *       403:
 *         description: Forbidden - Cannot access this player
 */
router.get('/:playerId', (0, validateRequest_1.validateRequest)(player_validator_1.getPlayerByIdSchema), (0, asyncHandler_1.asyncHandler)(playerController.getById.bind(playerController)));
/**
 * @swagger
 * /players:
 *   post:
 *     summary: Create new player
 *     description: Create a new player device at a specific site
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - siteId
 *               - name
 *               - playerCode
 *             properties:
 *               siteId:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Entrance Display
 *               playerCode:
 *                 type: string
 *                 example: PLAYER-001
 *                 description: Unique player code (uppercase, alphanumeric, hyphens, underscores)
 *               macAddress:
 *                 type: string
 *                 example: AA:BB:CC:DD:EE:FF
 *               serialNumber:
 *                 type: string
 *                 example: SN-123456789
 *               location:
 *                 type: string
 *                 example: Main entrance, left wall
 *               screenResolution:
 *                 type: string
 *                 example: 1920x1080
 *               orientation:
 *                 type: string
 *                 enum: [Landscape, Portrait]
 *                 example: Landscape
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 message:
 *                   type: string
 *                   example: Player created successfully
 *       400:
 *         description: Validation error or exceeded limits
 *       403:
 *         description: Forbidden - Admin, CustomerAdmin, or SiteManager only
 */
router.post('/', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(player_validator_1.createPlayerSchema), (0, asyncHandler_1.asyncHandler)(playerController.create.bind(playerController)));
/**
 * @swagger
 * /players/{playerId}:
 *   patch:
 *     summary: Update player
 *     description: Update player details and metadata
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               playerCode:
 *                 type: string
 *               macAddress:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               location:
 *                 type: string
 *               screenResolution:
 *                 type: string
 *               orientation:
 *                 type: string
 *                 enum: [Landscape, Portrait]
 *               status:
 *                 type: string
 *                 enum: [Online, Offline, Error]
 *               ipAddress:
 *                 type: string
 *               playerVersion:
 *                 type: string
 *               osVersion:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Player updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 message:
 *                   type: string
 *                   example: Player updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Player not found
 */
router.patch('/:playerId', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(player_validator_1.updatePlayerSchema), (0, asyncHandler_1.asyncHandler)(playerController.update.bind(playerController)));
/**
 * @swagger
 * /players/{playerId}:
 *   delete:
 *     summary: Delete player
 *     description: Delete a player device (Admin or CustomerAdmin only)
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player deleted successfully
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
 *                   example: Player deleted successfully
 *       403:
 *         description: Forbidden - Admin or CustomerAdmin only
 *       404:
 *         description: Player not found
 */
router.delete('/:playerId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(player_validator_1.deletePlayerSchema), (0, asyncHandler_1.asyncHandler)(playerController.delete.bind(playerController)));
/**
 * @swagger
 * /players/{playerId}/heartbeat:
 *   post:
 *     summary: Send player heartbeat
 *     description: Update player status and record that device is online (called by player devices)
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
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
 *                 example: 192.168.1.100
 *               playerVersion:
 *                 type: string
 *                 example: 2.1.0
 *               osVersion:
 *                 type: string
 *                 example: Windows 10
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
 *         description: Validation error
 *       404:
 *         description: Player not found
 */
router.post('/:playerId/heartbeat', (0, validateRequest_1.validateRequest)(player_validator_1.playerHeartbeatSchema), (0, asyncHandler_1.asyncHandler)(playerController.heartbeat.bind(playerController)));
/**
 * @swagger
 * /players/{playerId}/activation-code:
 *   post:
 *     summary: Generate activation code
 *     description: Generate a 6-character activation code for player device setup
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Activation code generated successfully
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
 *                     activationCode:
 *                       type: string
 *                       example: ABC123
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: Activation code generated successfully
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Player not found
 */
router.post('/:playerId/activation-code', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(player_validator_1.getPlayerByIdSchema), (0, asyncHandler_1.asyncHandler)(playerController.generateActivationCode.bind(playerController)));
exports.default = router;
//# sourceMappingURL=player.routes.js.map