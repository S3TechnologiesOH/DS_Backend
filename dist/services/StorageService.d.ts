/**
 * Storage Service
 *
 * Handles file uploads/downloads to Azure Blob Storage.
 * This service demonstrates how to interact with Azure Blob Storage for media files.
 */
import 'express';
type MulterFile = Express.Multer.File;
export interface UploadResult {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
}
export declare class StorageService {
    /**
     * Upload file to Azure Blob Storage
     *
     * Example usage:
     * const file = req.file; // From multer middleware
     * const result = await storageService.uploadFile(file, customerId, 'content');
     */
    uploadFile(file: MulterFile, customerId: number, folder?: string): Promise<UploadResult>;
    /**
     * Delete file from Azure Blob Storage
     */
    deleteFile(blobName: string): Promise<void>;
    /**
     * Get file download URL (with SAS token for private access)
     * For public access, just return the blob URL
     */
    getFileUrl(blobName: string): Promise<string>;
    /**
     * Check if file exists
     */
    fileExists(blobName: string): Promise<boolean>;
    /**
     * Extract blob name from full URL
     */
    extractBlobName(fileUrl: string): string;
}
export {};
//# sourceMappingURL=StorageService.d.ts.map