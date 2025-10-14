"use strict";
/**
 * Content Controller
 *
 * Handles HTTP requests for content management endpoints.
 * Demonstrates file upload handling with multer and Azure Blob Storage.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const errors_1 = require("../utils/errors");
class ContentController {
    contentService;
    constructor(contentService) {
        this.contentService = contentService;
    }
    /**
     * GET /api/v1/content
     * List all content for the authenticated user's customer
     */
    async list(req, res, next) {
        try {
            const customerId = req.user.customerId;
            const { page, limit, contentType, status, search } = req.query;
            const result = await this.contentService.list(customerId, {
                page: page,
                limit: limit,
                contentType: contentType,
                status: status,
                search: search,
            });
            res.status(200).json({
                status: 'success',
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/content/:contentId
     * Get content by ID
     */
    async getById(req, res, next) {
        try {
            const contentId = parseInt(req.params.contentId, 10);
            const customerId = req.user.customerId;
            const content = await this.contentService.getById(contentId, customerId);
            res.status(200).json({
                status: 'success',
                data: content,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/content/upload
     * Upload new content with file
     *
     * Expects multipart/form-data with:
     * - file: The actual file
     * - name: Content name
     * - description: Optional description
     * - contentType: Image, Video, PDF, HTML, URL
     * - duration: Optional duration for videos
     * - tags: Optional comma-separated tags
     */
    async upload(req, res, next) {
        try {
            const customerId = req.user.customerId;
            const uploadedBy = req.user.userId;
            // File is attached by multer middleware
            if (!req.file) {
                throw new errors_1.ValidationError('No file uploaded');
            }
            const { name, description, contentType, duration, tags } = req.body;
            if (!name || !contentType) {
                throw new errors_1.ValidationError('Name and contentType are required');
            }
            const content = await this.contentService.uploadContent(req.file, customerId, uploadedBy, {
                name,
                description,
                contentType,
                duration: duration ? parseInt(duration, 10) : undefined,
                tags,
            });
            res.status(201).json({
                status: 'success',
                data: content,
                message: 'Content uploaded successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PATCH /api/v1/content/:contentId
     * Update content metadata
     */
    async update(req, res, next) {
        try {
            const contentId = parseInt(req.params.contentId, 10);
            const customerId = req.user.customerId;
            const content = await this.contentService.update(contentId, customerId, req.body);
            res.status(200).json({
                status: 'success',
                data: content,
                message: 'Content updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/content/:contentId
     * Delete content and associated file
     */
    async delete(req, res, next) {
        try {
            const contentId = parseInt(req.params.contentId, 10);
            const customerId = req.user.customerId;
            await this.contentService.delete(contentId, customerId);
            res.status(200).json({
                status: 'success',
                message: 'Content deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/content/storage/usage
     * Get storage usage for customer
     */
    async getStorageUsage(req, res, next) {
        try {
            const customerId = req.user.customerId;
            const usage = await this.contentService.getStorageUsage(customerId);
            res.status(200).json({
                status: 'success',
                data: usage,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ContentController = ContentController;
//# sourceMappingURL=ContentController.js.map