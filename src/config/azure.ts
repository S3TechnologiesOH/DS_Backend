/**
 * Azure Blob Storage Configuration
 *
 * Configuration for Azure Blob Storage service used for media files.
 */

import { BlobServiceClient } from '@azure/storage-blob';
import { env } from './environment';
import logger from '../utils/logger';

let blobServiceClient: BlobServiceClient | null = null;

/**
 * Initialize Azure Blob Storage client
 */
export const initializeBlobStorage = (): BlobServiceClient => {
  try {
    if (!blobServiceClient) {
      blobServiceClient = BlobServiceClient.fromConnectionString(
        env.AZURE_STORAGE_CONNECTION_STRING
      );
      logger.info('Azure Blob Storage client initialized');
    }
    return blobServiceClient;
  } catch (error) {
    logger.error('Failed to initialize Azure Blob Storage client', { error });
    throw error;
  }
};

/**
 * Get Azure Blob Storage client instance
 */
export const getBlobServiceClient = (): BlobServiceClient => {
  if (!blobServiceClient) {
    return initializeBlobStorage();
  }
  return blobServiceClient;
};

/**
 * Get container client for media storage
 */
export const getContainerClient = () => {
  const blobService = getBlobServiceClient();
  return blobService.getContainerClient(env.AZURE_STORAGE_CONTAINER);
};

export const azureConfig = {
  containerName: env.AZURE_STORAGE_CONTAINER,
  connectionString: env.AZURE_STORAGE_CONNECTION_STRING,
};
