"use strict";
/**
 * Player Authentication Routes
 *
 * API endpoints for player device authentication.
 * Players use activation codes to authenticate, not email/password.
 *
 * @swagger
 * tags:
 *   name: Player Authentication
 *   description: Player device authentication endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerAuthController_1 = require("../controllers/PlayerAuthController");
const PlayerAuthService_1 = require("../services/PlayerAuthService");
const PlayerRepository_1 = require("../repositories/PlayerRepository");
const PlayerTokenRepository_1 = require("../repositories/PlayerTokenRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const asyncHandler_1 = require("../middleware/asyncHandler");
const player_auth_validator_1 = require("../validators/player-auth.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const playerRepository = new PlayerRepository_1.PlayerRepository();
const playerTokenRepository = new PlayerTokenRepository_1.PlayerTokenRepository();
const playerAuthService = new PlayerAuthService_1.PlayerAuthService(playerRepository, playerTokenRepository);
const playerAuthController = new PlayerAuthController_1.PlayerAuthController(playerAuthService);
/**
 * @swagger
 * /api/v1/player-auth/activate:
 *   post:
 *     summary: Activate player device
 *     description: Activate a player using activation code generated in CMS
 *     tags: [Player Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerCode
 *               - activationCode
 *             properties:
 *               playerCode:
 *                 type: string
 *                 example: NYC-001-ENT
 *                 description: Unique player code
 *               activationCode:
 *                 type: string
 *                 example: ABC123
 *                 description: 6-character activation code from CMS
 *     responses:
 *       200:
 *         description: Player activated successfully
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
 *                     playerId:
 *                       type: integer
 *                       example: 42
 *                     customerId:
 *                       type: integer
 *                       example: 1
 *                     siteId:
 *                       type: integer
 *                       example: 5
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *                       description: Access token expiration in seconds
 *                 message:
 *                   type: string
 *                   example: Player activated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid or expired activation code
 *       404:
 *         description: Player not found
 */
router.post('/activate', (0, validateRequest_1.validateRequest)(player_auth_validator_1.activatePlayerSchema), (0, asyncHandler_1.asyncHandler)(playerAuthController.activate.bind(playerAuthController)));
/**
 * @swagger
 * /api/v1/player-auth/refresh:
 *   post:
 *     summary: Refresh player access token
 *     description: Get a new access token using refresh token
 *     tags: [Player Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', (0, validateRequest_1.validateRequest)(player_auth_validator_1.refreshPlayerTokenSchema), (0, asyncHandler_1.asyncHandler)(playerAuthController.refresh.bind(playerAuthController)));
/**
 * @swagger
 * /api/v1/player-auth/logout:
 *   post:
 *     summary: Logout player device
 *     description: Revoke player refresh token
 *     tags: [Player Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logged out successfully
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
 *                   example: Player logged out successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/logout', (0, validateRequest_1.validateRequest)(player_auth_validator_1.logoutPlayerSchema), (0, asyncHandler_1.asyncHandler)(playerAuthController.logout.bind(playerAuthController)));
exports.default = router;
//# sourceMappingURL=player-auth.routes.js.map