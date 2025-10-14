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
 * GET /api/v1/content
 * List all content for authenticated user's customer
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
 * POST /api/v1/content/upload
 * Upload new content with file
 * Requires Admin or Editor role
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
