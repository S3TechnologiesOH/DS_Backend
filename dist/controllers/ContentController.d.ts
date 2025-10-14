/**
 * Content Controller
 *
 * Handles HTTP requests for content management endpoints.
 * Demonstrates file upload handling with multer and Azure Blob Storage.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { ContentService } from '../services/ContentService';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    /**
     * GET /api/v1/content
     * List all content for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/content/:contentId
     * Get content by ID
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/content/upload
     * Upload new content with file
     *
     * Expects multipart/form-data with:
     * - file: The actual file
     * - name: Content name
     * - description: Optional description
     * - contentType: Image, Video, PDF, HTML, URL
     * - duration: Optional duration for videos
     * - tags: Optional comma-separated tags
     */
    upload(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/content/:contentId
     * Update content metadata
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/content/:contentId
     * Delete content and associated file
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/content/storage/usage
     * Get storage usage for customer
     */
    getStorageUsage(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ContentController.d.ts.map