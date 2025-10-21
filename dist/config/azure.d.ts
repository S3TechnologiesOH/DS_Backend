/**
 * Azure Blob Storage Configuration
 *
 * Configuration for Azure Blob Storage service used for media files.
 */
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
export declare const getContainerClient: () => any;
export declare const azureConfig: {
    containerName: any;
    connectionString: any;
};
//# sourceMappingURL=azure.d.ts.map