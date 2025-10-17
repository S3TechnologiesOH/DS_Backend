/**
 * Content Service
 *
 * Business logic for content management including file upload to Azure Blob Storage.
 * Demonstrates complete flow: file upload � storage � database.
 */

// Import Express to ensure Multer types are available
import 'express';
import { ContentRepository } from '../repositories/ContentRepository';
import { StorageService } from './StorageService';
import { Content, CreateContentDto, UpdateContentDto, ContentType } from '../models';
import { NotFoundError, ValidationError } from '../utils/errors';
import { parsePaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

type MulterFile = Express.Multer.File;

export class ContentService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly storageService: StorageService
  ) {}

  /**
   * Get content by ID
   */
  async getById(contentId: number, customerId: number): Promise<Content> {
    const content = await this.contentRepository.findById(contentId, customerId);

    if (!content) {
      throw new NotFoundError('Content not found');
    }

    return content;
  }

  /**
   * List all content for a customer with filters and pagination
   */
  async list(
    customerId: number,
    filters?: {
      page?: string;
      limit?: string;
      contentType?: ContentType;
      status?: string;
      search?: string;
    }
  ): Promise<{ data: Content[]; total: number; page: number; limit: number }> {
    const { page, limit } = parsePaginationParams({
      page: filters?.page,
      limit: filters?.limit,
    });

    const offset = (page - 1) * limit;

    const content = await this.contentRepository.findByCustomerId(customerId, {
      contentType: filters?.contentType,
      status: filters?.status,
      search: filters?.search,
      limit,
      offset,
    });

    const total = await this.contentRepository.countByCustomerId(customerId);

    return {
      data: content,
      total,
      page,
      limit,
    };
  }

  /**
   * Upload new content with file
   *
   * Complete flow:
   * 1. Validate file type and size
   * 2. Upload file to Azure Blob Storage
   * 3. Save metadata to database
   * 4. Return content record
   */
  async uploadContent(
    file: MulterFile,
    customerId: number,
    uploadedBy: number,
    metadata: {
      name: string;
      description?: string;
      contentType: ContentType;
      duration?: number;
      tags?: string;
    }
  ): Promise<Content> {
    // 1. Validate file
    this.validateFile(file, metadata.contentType);

    // 2. Upload to Azure Blob Storage
    const uploadResult = await this.storageService.uploadFile(file, customerId, 'content');

    logger.info('File uploaded to storage', {
      fileName: uploadResult.fileName,
      size: uploadResult.fileSize,
    });

    // 3. Determine dimensions for images/videos (would need image processing library)
    let width: number | undefined;
    let height: number | undefined;

    // For images, you could use sharp library to get dimensions:
    // if (metadata.contentType === 'Image') {
    //   const imageInfo = await sharp(file.buffer).metadata();
    //   width = imageInfo.width;
    //   height = imageInfo.height;
    // }

    // 4. Create content record in database
    const content = await this.contentRepository.create({
      customerId,
      name: metadata.name,
      description: metadata.description,
      contentType: metadata.contentType,
      fileUrl: uploadResult.fileUrl,
      fileSize: uploadResult.fileSize,
      duration: metadata.duration,
      width,
      height,
      mimeType: uploadResult.mimeType,
      uploadedBy,
      tags: metadata.tags,
    });

    // 5. Update status to Ready (in production, you might process async)
    const updatedContent = await this.contentRepository.update(
      content.contentId,
      customerId,
      { status: 'Ready' }
    );

    logger.info('Content created successfully', {
      contentId: content.contentId,
      customerId,
      name: metadata.name,
    });

    return updatedContent;
  }

  /**
   * Update content metadata
   */
  async update(
    contentId: number,
    customerId: number,
    data: UpdateContentDto
  ): Promise<Content> {
    // Verify content exists
    await this.getById(contentId, customerId);

    const updated = await this.contentRepository.update(contentId, customerId, data);

    logger.info('Content updated', { contentId, customerId });

    return updated;
  }

  /**
   * Delete content and associated file
   */
  async delete(contentId: number, customerId: number): Promise<void> {
    // Get content to retrieve file URL
    const content = await this.getById(contentId, customerId);

    // Delete from database first
    await this.contentRepository.delete(contentId, customerId);

    // Then delete file from storage
    if (content.fileUrl) {
      try {
        const blobName = this.storageService.extractBlobName(content.fileUrl);
        await this.storageService.deleteFile(blobName);
      } catch (error) {
        logger.error('Failed to delete file from storage', { error, contentId });
        // Don't throw - database record is already deleted
      }
    }

    logger.info('Content deleted', { contentId, customerId });
  }

  /**
   * Get storage usage for customer
   */
  async getStorageUsage(customerId: number): Promise<{
    usedBytes: number;
    usedGB: number;
    totalGB: number;
    percentUsed: number;
  }> {
    const usedBytes = await this.contentRepository.getTotalStorageUsed(customerId);
    const usedGB = usedBytes / (1024 * 1024 * 1024);

    // Get customer's storage limit (would need CustomerRepository)
    const totalGB = 10; // Placeholder - fetch from customer record

    return {
      usedBytes,
      usedGB: Math.round(usedGB * 100) / 100,
      totalGB,
      percentUsed: Math.round((usedGB / totalGB) * 100),
    };
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: MulterFile, contentType: ContentType): void {
    const maxSizes: Record<ContentType, number> = {
      Image: 10 * 1024 * 1024, // 10MB
      Video: 100 * 1024 * 1024, // 100MB
      PDF: 20 * 1024 * 1024, // 20MB
      HTML: 1 * 1024 * 1024, // 1MB
      URL: 0, // No file upload for URLs
    };

    const allowedMimeTypes: Record<ContentType, string[]> = {
      Image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      Video: ['video/mp4', 'video/webm', 'video/quicktime'],
      PDF: ['application/pdf'],
      HTML: ['text/html', 'application/octet-stream'],
      URL: [],
    };

    // Check file size
    if (file.size > maxSizes[contentType]) {
      throw new ValidationError(
        `File size exceeds maximum allowed size of ${maxSizes[contentType] / (1024 * 1024)}MB`
      );
    }

    // Check MIME type
    if (!allowedMimeTypes[contentType].includes(file.mimetype)) {
      throw new ValidationError(`Invalid file type for ${contentType}`);
    }
  }
}
