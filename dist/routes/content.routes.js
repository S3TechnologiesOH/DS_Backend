"use strict";
/**
 * Content Routes
 *
 * API endpoints for content management.
 * Demonstrates file upload with multer middleware.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ContentController_1 = require("../controllers/ContentController");
const ContentService_1 = require("../services/ContentService");
const StorageService_1 = require("../services/StorageService");
const ContentRepository_1 = require("../repositories/ContentRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const content_validator_1 = require("../validators/content.validator");
const router = (0, express_1.Router)();
// Configure multer for file uploads (store in memory)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max
    },
});
// Initialize dependencies
const contentRepository = new ContentRepository_1.ContentRepository();
const storageService = new StorageService_1.StorageService();
const contentService = new ContentService_1.ContentService(contentRepository, storageService);
const contentController = new ContentController_1.ContentController(contentService);
// All content routes require authentication
router.use(authenticate_1.authenticate);
/**
 * GET /api/v1/content
 * List all content for authenticated user's customer
 */
router.get('/', (0, validateRequest_1.validateRequest)(content_validator_1.listContentSchema), (0, asyncHandler_1.asyncHandler)(contentController.list.bind(contentController)));
/**
 * GET /api/v1/content/storage/usage
 * Get storage usage statistics
 */
router.get('/storage/usage', (0, asyncHandler_1.asyncHandler)(contentController.getStorageUsage.bind(contentController)));
/**
 * GET /api/v1/content/:contentId
 * Get content by ID
 */
router.get('/:contentId', (0, validateRequest_1.validateRequest)(content_validator_1.getContentByIdSchema), (0, asyncHandler_1.asyncHandler)(contentController.getById.bind(contentController)));
/**
 * POST /api/v1/content/upload
 * Upload new content with file
 * Requires Admin or Editor role
 */
router.post('/upload', (0, authorize_1.authorize)('Admin', 'Editor'), upload.single('file'), (0, asyncHandler_1.asyncHandler)(contentController.upload.bind(contentController)));
/**
 * PATCH /api/v1/content/:contentId
 * Update content metadata
 * Requires Admin or Editor role
 */
router.patch('/:contentId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(content_validator_1.updateContentSchema), (0, asyncHandler_1.asyncHandler)(contentController.update.bind(contentController)));
/**
 * DELETE /api/v1/content/:contentId
 * Delete content
 * Requires Admin role only
 */
router.delete('/:contentId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(content_validator_1.deleteContentSchema), (0, asyncHandler_1.asyncHandler)(contentController.delete.bind(contentController)));
exports.default = router;
//# sourceMappingURL=content.routes.js.map