/**
 * Content Repository
 *
 * Database operations for Content table (media library).
 * Demonstrates pagination and filtering.
 */
import { BaseRepository } from './BaseRepository';
import { Content, CreateContentDto, UpdateContentDto } from '../models';
export declare class ContentRepository extends BaseRepository {
    /**
     * Find content by ID within a customer
     */
    findById(contentId: number, customerId: number): Promise<Content | null>;
    /**
     * Get all content for a customer with optional filters
     */
    findByCustomerId(customerId: number, options?: {
        contentType?: string;
        status?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Content[]>;
    /**
     * Create new content
     */
    create(data: CreateContentDto): Promise<Content>;
    /**
     * Update content
     */
    update(contentId: number, customerId: number, data: UpdateContentDto): Promise<Content>;
    /**
     * Delete content
     */
    delete(contentId: number, customerId: number): Promise<void>;
    /**
     * Count content for a customer
     */
    countByCustomerId(customerId: number): Promise<number>;
    /**
     * Get total storage used by customer (in bytes)
     */
    getTotalStorageUsed(customerId: number): Promise<number>;
}
//# sourceMappingURL=ContentRepository.d.ts.map