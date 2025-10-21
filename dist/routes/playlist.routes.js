"use strict";
/**
 * Playlist Routes
 *
 * API endpoints for playlist management.
 * Playlists are collections of content items that play in sequence.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlaylistController_1 = require("../controllers/PlaylistController");
const PlaylistService_1 = require("../services/PlaylistService");
const PlaylistRepository_1 = require("../repositories/PlaylistRepository");
const ContentRepository_1 = require("../repositories/ContentRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const playlist_validator_1 = require("../validators/playlist.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const playlistRepository = new PlaylistRepository_1.PlaylistRepository();
const contentRepository = new ContentRepository_1.ContentRepository();
const playlistService = new PlaylistService_1.PlaylistService(playlistRepository, contentRepository);
const playlistController = new PlaylistController_1.PlaylistController(playlistService);
// All playlist routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: List all playlists
 *     description: Get all playlists for the authenticated user's customer with pagination
 *     tags: [Playlists]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by playlist name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Playlists list retrieved successfully
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
 *                     $ref: '#/components/schemas/Playlist'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', (0, validateRequest_1.validateRequest)(playlist_validator_1.listPlaylistsSchema), (0, asyncHandler_1.asyncHandler)(playlistController.list.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     description: Retrieve a specific playlist with all items
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist retrieved successfully
 *       404:
 *         description: Playlist not found
 */
router.get('/:playlistId', (0, validateRequest_1.validateRequest)(playlist_validator_1.getPlaylistByIdSchema), (0, asyncHandler_1.asyncHandler)(playlistController.getById.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}/items:
 *   get:
 *     summary: Get all items in a playlist
 *     description: Retrieve all layout items in a specific playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist items retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       playlistItemId:
 *                         type: integer
 *                       playlistId:
 *                         type: integer
 *                       layoutId:
 *                         type: integer
 *                       displayOrder:
 *                         type: integer
 *                       duration:
 *                         type: integer
 *                       transitionType:
 *                         type: string
 *                         enum: [Fade, Slide, None]
 *                       transitionDuration:
 *                         type: integer
 *                       layout:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           width:
 *                             type: integer
 *                           height:
 *                             type: integer
 *       404:
 *         description: Playlist not found
 */
router.get('/:playlistId/items', (0, validateRequest_1.validateRequest)(playlist_validator_1.getPlaylistByIdSchema), (0, asyncHandler_1.asyncHandler)(playlistController.getItems.bind(playlistController)));
/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create new playlist
 *     description: Create a new playlist for organizing content
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Holiday Promotions
 *               description:
 *                 type: string
 *                 example: Content for holiday season displays
 *     responses:
 *       201:
 *         description: Playlist created successfully
 */
router.post('/', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(playlist_validator_1.createPlaylistSchema), (0, asyncHandler_1.asyncHandler)(playlistController.create.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}:
 *   patch:
 *     summary: Update playlist
 *     description: Update playlist name, description, or active status
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 */
router.patch('/:playlistId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(playlist_validator_1.updatePlaylistSchema), (0, asyncHandler_1.asyncHandler)(playlistController.update.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}:
 *   delete:
 *     summary: Delete playlist
 *     description: Delete a playlist (Admin or CustomerAdmin only)
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 */
router.delete('/:playlistId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(playlist_validator_1.deletePlaylistSchema), (0, asyncHandler_1.asyncHandler)(playlistController.delete.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}/items:
 *   post:
 *     summary: Add item to playlist
 *     description: Add a content item to a playlist with display order
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *               - displayOrder
 *             properties:
 *               contentId:
 *                 type: integer
 *                 example: 1
 *               displayOrder:
 *                 type: integer
 *                 example: 1
 *               duration:
 *                 type: integer
 *                 example: 10
 *                 description: Display duration in seconds
 *               transitionType:
 *                 type: string
 *                 enum: [Fade, Slide, None]
 *               transitionDuration:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Item added to playlist successfully
 */
router.post('/:playlistId/items', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(playlist_validator_1.addPlaylistItemSchema), (0, asyncHandler_1.asyncHandler)(playlistController.addItem.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}/items/{itemId}:
 *   patch:
 *     summary: Update playlist item
 *     description: Update a playlist item's order, duration, or transitions
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist item updated successfully
 */
router.patch('/:playlistId/items/:itemId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(playlist_validator_1.updatePlaylistItemSchema), (0, asyncHandler_1.asyncHandler)(playlistController.updateItem.bind(playlistController)));
/**
 * @swagger
 * /playlists/{playlistId}/items/{itemId}:
 *   delete:
 *     summary: Remove item from playlist
 *     description: Remove a content item from a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from playlist successfully
 */
router.delete('/:playlistId/items/:itemId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(playlist_validator_1.removePlaylistItemSchema), (0, asyncHandler_1.asyncHandler)(playlistController.removeItem.bind(playlistController)));
exports.default = router;
//# sourceMappingURL=playlist.routes.js.map