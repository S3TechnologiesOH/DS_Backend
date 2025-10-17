"use strict";
/**
 * Storage Service
 *
 * Handles file uploads/downloads to Azure Blob Storage.
 * This service demonstrates how to interact with Azure Blob Storage for media files.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
// Import Express to ensure Multer types are available
require("express");
const azure_1 = require("../config/azure");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
const errors_1 = require("../utils/errors");
class StorageService {
    /**
     * Upload file to Azure Blob Storage
     *
     * Example usage:
     * const file = req.file; // From multer middleware
     * const result = await storageService.uploadFile(file, customerId, 'content');
     */
    async uploadFile(file, customerId, folder = 'content') {
        try {
            const containerClient = (0, azure_1.getContainerClient)();
            // Generate unique filename: {customerId}/{folder}/{timestamp}-{sanitized-name}
            const timestamp = Date.now();
            const sanitized = (0, helpers_1.sanitizeFilename)(file.originalname);
            const blobName = `${customerId}/${folder}/${timestamp}-${sanitized}`;
            // Get blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            // Upload file buffer to blob
            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
            });
            logger_1.default.info('File uploaded to Azure Blob Storage', {
                blobName,
                size: file.size,
                mimeType: file.mimetype,
            });
            return {
                fileUrl: blockBlobClient.url,
                fileName: blobName,
                fileSize: file.size,
                mimeType: file.mimetype,
            };
        }
        catch (error) {
            logger_1.default.error('Failed to upload file to Azure Blob Storage', { error });
            throw new errors_1.InternalServerError('File upload failed');
        }
    }
    /**
     * Delete file from Azure Blob Storage
     */
    async deleteFile(blobName) {
        try {
            const containerClient = (0, azure_1.getContainerClient)();
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.deleteIfExists();
            logger_1.default.info('File deleted from Azure Blob Storage', { blobName });
        }
        catch (error) {
            logger_1.default.error('Failed to delete file from Azure Blob Storage', { error, blobName });
            throw new errors_1.InternalServerError('File deletion failed');
        }
    }
    /**
     * Get file download URL (with SAS token for private access)
     * For public access, just return the blob URL
     */
    async getFileUrl(blobName) {
        const containerClient = (0, azure_1.getContainerClient)();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        return blockBlobClient.url;
    }
    /**
     * Check if file exists
     */
    async fileExists(blobName) {
        try {
            const containerClient = (0, azure_1.getContainerClient)();
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            return await blockBlobClient.exists();
        }
        catch (error) {
            logger_1.default.error('Failed to check file existence', { error, blobName });
            return false;
        }
    }
    /**
     * Extract blob name from full URL
     */
    extractBlobName(fileUrl) {
        const url = new URL(fileUrl);
        const pathParts = url.pathname.split('/');
        // Remove container name (first segment) and return the rest
        return pathParts.slice(2).join('/');
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=StorageService.js.map