/**
 * Content Service
 *
 * Business logic for content management including file upload to Azure Blob Storage.
 * Demonstrates complete flow: file upload � storage � database.
 */
import { ContentRepository } from '../repositories/ContentRepository';
import { StorageService } from './StorageService';
import { Content, UpdateContentDto, ContentType } from '../models';
export declare class ContentService {
    private readonly contentRepository;
    private readonly storageService;
    constructor(contentRepository: ContentRepository, storageService: StorageService);
    /**
     * Get content by ID
     */
    getById(contentId: number, customerId: number): Promise<Content>;
    /**
     * List all content for a customer with filters and pagination
     */
    list(customerId: number, filters?: {
        page?: string;
        limit?: string;
        contentType?: ContentType;
        status?: string;
        search?: string;
    }): Promise<{
        data: Content[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Upload new content with file
     *
     * Complete flow:
     * 1. Validate file type and size
     * 2. Upload file to Azure Blob Storage
     * 3. Save metadata to database
     * 4. Return content record
     */
    uploadContent(file: Express.Multer.File, customerId: number, uploadedBy: number, metadata: {
        name: string;
        description?: string;
        contentType: ContentType;
        duration?: number;
        tags?: string;
    }): Promise<Content>;
    /**
     * Update content metadata
     */
    update(contentId: number, customerId: number, data: UpdateContentDto): Promise<Content>;
    /**
     * Delete content and associated file
     */
    delete(contentId: number, customerId: number): Promise<void>;
    /**
     * Get storage usage for customer
     */
    getStorageUsage(customerId: number): Promise<{
        usedBytes: number;
        usedGB: number;
        totalGB: number;
        percentUsed: number;
    }>;
    /**
     * Validate uploaded file
     */
    private validateFile;
}
//# sourceMappingURL=ContentService.d.ts.map