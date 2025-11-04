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
const storage_blob_1 = require("@azure/storage-blob");
const environment_1 = require("../config/environment");
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
            // Generate SAS URL for the uploaded file
            const fileUrl = await this.getFileUrl(blobName, 525600); // 1 year expiry for uploaded files
            return {
                fileUrl,
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
     * Get file download URL with SAS token for secure access
     * Generates a time-limited URL with read permissions
     */
    async getFileUrl(blobName, expiryMinutes = 60) {
        try {
            const containerClient = (0, azure_1.getContainerClient)();
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            // Parse connection string to get account name and key
            const connString = environment_1.env.AZURE_STORAGE_CONNECTION_STRING;
            const accountNameMatch = connString.match(/AccountName=([^;]+)/);
            const accountKeyMatch = connString.match(/AccountKey=([^;]+)/);
            if (!accountNameMatch || !accountKeyMatch) {
                logger_1.default.warn('Could not parse storage account credentials, returning blob URL without SAS');
                return blockBlobClient.url;
            }
            const accountName = accountNameMatch[1];
            const accountKey = accountKeyMatch[1];
            // Create credentials
            const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
            // Set SAS token expiry time
            const startsOn = new Date();
            const expiresOn = new Date(startsOn.getTime() + expiryMinutes * 60 * 1000);
            // Generate SAS token with read permissions
            const sasToken = (0, storage_blob_1.generateBlobSASQueryParameters)({
                containerName: environment_1.env.AZURE_STORAGE_CONTAINER,
                blobName: blobName,
                permissions: storage_blob_1.BlobSASPermissions.parse('r'), // Read-only permission
                startsOn,
                expiresOn,
            }, sharedKeyCredential).toString();
            // Return URL with SAS token
            return `${blockBlobClient.url}?${sasToken}`;
        }
        catch (error) {
            logger_1.default.error('Failed to generate SAS URL', { error, blobName });
            // Fallback to regular URL if SAS generation fails
            const containerClient = (0, azure_1.getContainerClient)();
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            return blockBlobClient.url;
        }
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