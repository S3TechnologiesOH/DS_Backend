/**
 * Playlist Routes
 *
 * API endpoints for playlist management.
 * Playlists are collections of content items that play in sequence.
 */

import { Router } from 'express';
import { PlaylistController } from '../controllers/PlaylistController';
import { PlaylistService } from '../services/PlaylistService';
import { PlaylistRepository } from '../repositories/PlaylistRepository';
import { ContentRepository } from '../repositories/ContentRepository';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  getPlaylistByIdSchema,
  deletePlaylistSchema,
  addPlaylistItemSchema,
  updatePlaylistItemSchema,
  removePlaylistItemSchema,
  listPlaylistsSchema,
} from '../validators/playlist.validator';

const router = Router();

// Initialize dependencies
const playlistRepository = new PlaylistRepository();
const contentRepository = new ContentRepository();
const playlistService = new PlaylistService(playlistRepository, contentRepository);
const playlistController = new PlaylistController(playlistService);

// All playlist routes require authentication
router.use(authenticate);

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
router.get(
  '/',
  validateRequest(listPlaylistsSchema),
  asyncHandler(playlistController.list.bind(playlistController))
);

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
router.get(
  '/:playlistId',
  validateRequest(getPlaylistByIdSchema),
  asyncHandler(playlistController.getById.bind(playlistController))
);

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
router.post(
  '/',
  authorize('Admin', 'Editor'),
  validateRequest(createPlaylistSchema),
  asyncHandler(playlistController.create.bind(playlistController))
);

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
router.patch(
  '/:playlistId',
  authorize('Admin', 'Editor'),
  validateRequest(updatePlaylistSchema),
  asyncHandler(playlistController.update.bind(playlistController))
);

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
router.delete(
  '/:playlistId',
  authorize('Admin'),
  validateRequest(deletePlaylistSchema),
  asyncHandler(playlistController.delete.bind(playlistController))
);

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
router.post(
  '/:playlistId/items',
  authorize('Admin', 'Editor'),
  validateRequest(addPlaylistItemSchema),
  asyncHandler(playlistController.addItem.bind(playlistController))
);

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
router.patch(
  '/:playlistId/items/:itemId',
  authorize('Admin', 'Editor'),
  validateRequest(updatePlaylistItemSchema),
  asyncHandler(playlistController.updateItem.bind(playlistController))
);

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
router.delete(
  '/:playlistId/items/:itemId',
  authorize('Admin', 'Editor'),
  validateRequest(removePlaylistItemSchema),
  asyncHandler(playlistController.removeItem.bind(playlistController))
);

export default router;
