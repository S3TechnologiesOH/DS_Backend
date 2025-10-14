/**
 * Storage Service
 *
 * Handles file uploads/downloads to Azure Blob Storage.
 * This service demonstrates how to interact with Azure Blob Storage for media files.
 */

import { getContainerClient } from '../config/azure';
import { sanitizeFilename, getFileExtension } from '../utils/helpers';
import logger from '../utils/logger';
import { InternalServerError } from '../utils/errors';

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export class StorageService {
  /**
   * Upload file to Azure Blob Storage
   *
   * Example usage:
   * const file = req.file; // From multer middleware
   * const result = await storageService.uploadFile(file, customerId, 'content');
   */
  async uploadFile(
    file: Express.Multer.File,
    customerId: number,
    folder: string = 'content'
  ): Promise<UploadResult> {
    try {
      const containerClient = getContainerClient();

      // Generate unique filename: {customerId}/{folder}/{timestamp}-{sanitized-name}
      const timestamp = Date.now();
      const sanitized = sanitizeFilename(file.originalname);
      const blobName = `${customerId}/${folder}/${timestamp}-${sanitized}`;

      // Get blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload file buffer to blob
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      logger.info('File uploaded to Azure Blob Storage', {
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
    } catch (error) {
      logger.error('Failed to upload file to Azure Blob Storage', { error });
      throw new InternalServerError('File upload failed');
    }
  }

  /**
   * Delete file from Azure Blob Storage
   */
  async deleteFile(blobName: string): Promise<void> {
    try {
      const containerClient = getContainerClient();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.deleteIfExists();

      logger.info('File deleted from Azure Blob Storage', { blobName });
    } catch (error) {
      logger.error('Failed to delete file from Azure Blob Storage', { error, blobName });
      throw new InternalServerError('File deletion failed');
    }
  }

  /**
   * Get file download URL (with SAS token for private access)
   * For public access, just return the blob URL
   */
  async getFileUrl(blobName: string): Promise<string> {
    const containerClient = getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    return blockBlobClient.url;
  }

  /**
   * Check if file exists
   */
  async fileExists(blobName: string): Promise<boolean> {
    try {
      const containerClient = getContainerClient();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      return await blockBlobClient.exists();
    } catch (error) {
      logger.error('Failed to check file existence', { error, blobName });
      return false;
    }
  }

  /**
   * Extract blob name from full URL
   */
  extractBlobName(fileUrl: string): string {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    // Remove container name (first segment) and return the rest
    return pathParts.slice(2).join('/');
  }
}
