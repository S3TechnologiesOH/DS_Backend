"use strict";
/**
 * Content Service
 *
 * Business logic for content management including file upload to Azure Blob Storage.
 * Demonstrates complete flow: file upload � storage � database.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
// Import Express to ensure Multer types are available
require("express");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
class ContentService {
    contentRepository;
    storageService;
    constructor(contentRepository, storageService) {
        this.contentRepository = contentRepository;
        this.storageService = storageService;
    }
    /**
     * Refresh SAS URLs for content items
     * Generates fresh SAS tokens for fileUrl and thumbnailUrl
     */
    async refreshContentUrls(content) {
        try {
            // Generate fresh SAS URL for file
            if (content.fileUrl) {
                const blobName = this.storageService.extractBlobName(content.fileUrl);
                content.fileUrl = await this.storageService.getFileUrl(blobName, 60); // 60 minute expiry
            }
            // Generate fresh SAS URL for thumbnail
            if (content.thumbnailUrl) {
                const thumbnailBlobName = this.storageService.extractBlobName(content.thumbnailUrl);
                content.thumbnailUrl = await this.storageService.getFileUrl(thumbnailBlobName, 60);
            }
            return content;
        }
        catch (error) {
            logger_1.default.warn('Failed to refresh SAS URLs for content', { contentId: content.contentId, error });
            // Return content with original URLs if refresh fails
            return content;
        }
    }
    /**
     * Get content by ID
     */
    async getById(contentId, customerId) {
        const content = await this.contentRepository.findById(contentId, customerId);
        if (!content) {
            throw new errors_1.NotFoundError('Content not found');
        }
        // Refresh SAS URLs before returning
        return this.refreshContentUrls(content);
    }
    /**
     * List all content for a customer with filters and pagination
     */
    async list(customerId, filters) {
        const { page, limit } = (0, helpers_1.parsePaginationParams)({
            page: filters?.page,
            limit: filters?.limit,
        });
        const offset = (page - 1) * limit;
        const content = await this.contentRepository.findByCustomerId(customerId, {
            contentType: filters?.contentType,
            status: filters?.status,
            search: filters?.search,
            limit,
            offset,
        });
        // Refresh SAS URLs for all content items
        const contentWithFreshUrls = await Promise.all(content.map((item) => this.refreshContentUrls(item)));
        const total = await this.contentRepository.countByCustomerId(customerId);
        return {
            data: contentWithFreshUrls,
            total,
            page,
            limit,
        };
    }
    /**
     * Upload new content with file
     *
     * Complete flow:
     * 1. Validate file type and size
     * 2. Upload file to Azure Blob Storage
     * 3. Save metadata to database
     * 4. Return content record
     */
    async uploadContent(file, customerId, uploadedBy, metadata) {
        // 1. Validate file
        this.validateFile(file, metadata.contentType);
        // 2. Upload to Azure Blob Storage
        const uploadResult = await this.storageService.uploadFile(file, customerId, 'content');
        logger_1.default.info('File uploaded to storage', {
            fileName: uploadResult.fileName,
            size: uploadResult.fileSize,
        });
        // 3. Determine dimensions for images/videos (would need image processing library)
        let width;
        let height;
        // For images, you could use sharp library to get dimensions:
        // if (metadata.contentType === 'Image') {
        //   const imageInfo = await sharp(file.buffer).metadata();
        //   width = imageInfo.width;
        //   height = imageInfo.height;
        // }
        // 4. Create content record in database
        const content = await this.contentRepository.create({
            customerId,
            name: metadata.name,
            description: metadata.description,
            contentType: metadata.contentType,
            fileUrl: uploadResult.fileUrl,
            fileSize: uploadResult.fileSize,
            duration: metadata.duration,
            width,
            height,
            mimeType: uploadResult.mimeType,
            uploadedBy,
            tags: metadata.tags,
        });
        // 5. Update status to Ready (in production, you might process async)
        const updatedContent = await this.contentRepository.update(content.contentId, customerId, { status: 'Ready' });
        logger_1.default.info('Content created successfully', {
            contentId: content.contentId,
            customerId,
            name: metadata.name,
        });
        return updatedContent;
    }
    /**
     * Update content metadata
     */
    async update(contentId, customerId, data) {
        // Verify content exists
        await this.getById(contentId, customerId);
        const updated = await this.contentRepository.update(contentId, customerId, data);
        logger_1.default.info('Content updated', { contentId, customerId });
        return updated;
    }
    /**
     * Delete content and associated file
     */
    async delete(contentId, customerId) {
        // Get content to retrieve file URL
        const content = await this.getById(contentId, customerId);
        // Delete from database first
        await this.contentRepository.delete(contentId, customerId);
        // Then delete file from storage
        if (content.fileUrl) {
            try {
                const blobName = this.storageService.extractBlobName(content.fileUrl);
                await this.storageService.deleteFile(blobName);
            }
            catch (error) {
                logger_1.default.error('Failed to delete file from storage', { error, contentId });
                // Don't throw - database record is already deleted
            }
        }
        logger_1.default.info('Content deleted', { contentId, customerId });
    }
    /**
     * Get storage usage for customer
     */
    async getStorageUsage(customerId) {
        const usedBytes = await this.contentRepository.getTotalStorageUsed(customerId);
        const usedGB = usedBytes / (1024 * 1024 * 1024);
        // Get customer's storage limit (would need CustomerRepository)
        const totalGB = 10; // Placeholder - fetch from customer record
        return {
            usedBytes,
            usedGB: Math.round(usedGB * 100) / 100,
            totalGB,
            percentUsed: Math.round((usedGB / totalGB) * 100),
        };
    }
    /**
     * Validate uploaded file
     */
    validateFile(file, contentType) {
        const maxSizes = {
            Image: 10 * 1024 * 1024, // 10MB
            Video: 100 * 1024 * 1024, // 100MB
            PDF: 20 * 1024 * 1024, // 20MB
            HTML: 1 * 1024 * 1024, // 1MB
            URL: 0, // No file upload for URLs
        };
        const allowedMimeTypes = {
            Image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            Video: ['video/mp4', 'video/webm', 'video/quicktime'],
            PDF: ['application/pdf'],
            HTML: ['text/html', 'application/octet-stream'],
            URL: [],
        };
        // Check file size
        if (file.size > maxSizes[contentType]) {
            throw new errors_1.ValidationError(`File size exceeds maximum allowed size of ${maxSizes[contentType] / (1024 * 1024)}MB`);
        }
        // Check MIME type
        if (!allowedMimeTypes[contentType].includes(file.mimetype)) {
            throw new errors_1.ValidationError(`Invalid file type for ${contentType}`);
        }
    }
}
exports.ContentService = ContentService;
//# sourceMappingURL=ContentService.js.map