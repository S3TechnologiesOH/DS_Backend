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

import { Router } from 'express';
import { PlayerAuthController } from '../controllers/PlayerAuthController';
import { PlayerAuthService } from '../services/PlayerAuthService';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { PlayerTokenRepository } from '../repositories/PlayerTokenRepository';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  activatePlayerSchema,
  refreshPlayerTokenSchema,
  logoutPlayerSchema,
} from '../validators/player-auth.validator';

const router = Router();

// Initialize dependencies
const playerRepository = new PlayerRepository();
const playerTokenRepository = new PlayerTokenRepository();
const playerAuthService = new PlayerAuthService(playerRepository, playerTokenRepository);
const playerAuthController = new PlayerAuthController(playerAuthService);

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
router.post(
  '/activate',
  validateRequest(activatePlayerSchema),
  asyncHandler(playerAuthController.activate.bind(playerAuthController))
);

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
router.post(
  '/refresh',
  validateRequest(refreshPlayerTokenSchema),
  asyncHandler(playerAuthController.refresh.bind(playerAuthController))
);

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
router.post(
  '/logout',
  validateRequest(logoutPlayerSchema),
  asyncHandler(playerAuthController.logout.bind(playerAuthController))
);

export default router;
