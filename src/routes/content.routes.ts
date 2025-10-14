/**
 * Content Routes
 *
 * API endpoints for content management.
 * Demonstrates file upload with multer middleware.
 */

import { Router } from 'express';
import multer from 'multer';
import { ContentController } from '../controllers/ContentController';
import { ContentService } from '../services/ContentService';
import { StorageService } from '../services/StorageService';
import { ContentRepository } from '../repositories/ContentRepository';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  listContentSchema,
  getContentByIdSchema,
  updateContentSchema,
  deleteContentSchema,
} from '../validators/content.validator';

const router = Router();

// Configure multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

// Initialize dependencies
const contentRepository = new ContentRepository();
const storageService = new StorageService();
const contentService = new ContentService(contentRepository, storageService);
const contentController = new ContentController(contentService);

// All content routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /content:
 *   get:
 *     summary: List all content
 *     description: Get all content items for the authenticated user's customer
 *     tags: [Content]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Image, Video, HTML, URL, PDF]
 *         description: Filter by content type
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
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  validateRequest(listContentSchema),
  asyncHandler(contentController.list.bind(contentController))
);

/**
 * GET /api/v1/content/storage/usage
 * Get storage usage statistics
 */
router.get(
  '/storage/usage',
  asyncHandler(contentController.getStorageUsage.bind(contentController))
);

/**
 * GET /api/v1/content/:contentId
 * Get content by ID
 */
router.get(
  '/:contentId',
  validateRequest(getContentByIdSchema),
  asyncHandler(contentController.getById.bind(contentController))
);

/**
 * @swagger
 * /content/upload:
 *   post:
 *     summary: Upload new content
 *     description: Upload a new media file (image, video, PDF) to Azure Blob Storage
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - name
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file to upload (max 100MB)
 *               name:
 *                 type: string
 *                 example: Spring Sale Banner
 *               type:
 *                 type: string
 *                 enum: [Image, Video, HTML, URL, PDF]
 *                 example: Image
 *               duration:
 *                 type: integer
 *                 example: 10
 *                 description: Display duration in seconds
 *               tags:
 *                 type: string
 *                 example: promotion,seasonal
 *     responses:
 *       201:
 *         description: Content uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Validation error or file too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.post(
  '/upload',
  authorize('Admin', 'Editor'),
  upload.single('file'),
  asyncHandler(contentController.upload.bind(contentController))
);

/**
 * PATCH /api/v1/content/:contentId
 * Update content metadata
 * Requires Admin or Editor role
 */
router.patch(
  '/:contentId',
  authorize('Admin', 'Editor'),
  validateRequest(updateContentSchema),
  asyncHandler(contentController.update.bind(contentController))
);

/**
 * DELETE /api/v1/content/:contentId
 * Delete content
 * Requires Admin role only
 */
router.delete(
  '/:contentId',
  authorize('Admin'),
  validateRequest(deleteContentSchema),
  asyncHandler(contentController.delete.bind(contentController))
);

export default router;
