/**
 * Azure Blob Storage Configuration
 *
 * Configuration for Azure Blob Storage service used for media files.
 */
import { BlobServiceClient } from '@azure/storage-blob';
/**
 * Initialize Azure Blob Storage client
 */
export declare const initializeBlobStorage: () => BlobServiceClient;
/**
 * Get Azure Blob Storage client instance
 */
export declare const getBlobServiceClient: () => BlobServiceClient;
/**
 * Get container client for media storage
 */
export declare const getContainerClient: () => import("@azure/storage-blob").ContainerClient;
export declare const azureConfig: {
    containerName: string;
    connectionString: string;
};
//# sourceMappingURL=azure.d.ts.map