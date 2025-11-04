/**
 * Storage Service
 *
 * Handles file uploads/downloads to Azure Blob Storage.
 * This service demonstrates how to interact with Azure Blob Storage for media files.
 */

// Import Express to ensure Multer types are available
import 'express';
import { getContainerClient } from '../config/azure';
import { sanitizeFilename, getFileExtension } from '../utils/helpers';
import logger from '../utils/logger';
import { InternalServerError } from '../utils/errors';
import { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import { env } from '../config/environment';

type MulterFile = Express.Multer.File;

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
    file: MulterFile,
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

      // Generate SAS URL for the uploaded file
      const fileUrl = await this.getFileUrl(blobName, 525600); // 1 year expiry for uploaded files

      return {
        fileUrl,
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
   * Get file download URL with SAS token for secure access
   * Generates a time-limited URL with read permissions
   */
  async getFileUrl(blobName: string, expiryMinutes: number = 60): Promise<string> {
    try {
      const containerClient = getContainerClient();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Parse connection string to get account name and key
      const connString = env.AZURE_STORAGE_CONNECTION_STRING;
      const accountNameMatch = connString.match(/AccountName=([^;]+)/);
      const accountKeyMatch = connString.match(/AccountKey=([^;]+)/);

      if (!accountNameMatch || !accountKeyMatch) {
        logger.warn('Could not parse storage account credentials, returning blob URL without SAS');
        return blockBlobClient.url;
      }

      const accountName = accountNameMatch[1];
      const accountKey = accountKeyMatch[1];

      // Create credentials
      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

      // Set SAS token expiry time
      const startsOn = new Date();
      const expiresOn = new Date(startsOn.getTime() + expiryMinutes * 60 * 1000);

      // Generate SAS token with read permissions
      const sasToken = generateBlobSASQueryParameters(
        {
          containerName: env.AZURE_STORAGE_CONTAINER,
          blobName: blobName,
          permissions: BlobSASPermissions.parse('r'), // Read-only permission
          startsOn,
          expiresOn,
        },
        sharedKeyCredential
      ).toString();

      // Return URL with SAS token
      return `${blockBlobClient.url}?${sasToken}`;
    } catch (error) {
      logger.error('Failed to generate SAS URL', { error, blobName });
      // Fallback to regular URL if SAS generation fails
      const containerClient = getContainerClient();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      return blockBlobClient.url;
    }
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
