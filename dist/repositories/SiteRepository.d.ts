/**
 * Site Repository
 *
 * Database operations for Sites table.
 */
import { BaseRepository } from './BaseRepository';
import { Site, CreateSiteDto, UpdateSiteDto } from '../models';
export declare class SiteRepository extends BaseRepository {
    /**
     * Find site by ID within a customer
     */
    findById(siteId: number, customerId: number): Promise<Site | null>;
    /**
     * Get all sites for a customer
     */
    findByCustomerId(customerId: number, options?: {
        isActive?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Site[]>;
    /**
     * Create new site
     */
    create(data: CreateSiteDto): Promise<Site>;
    /**
     * Update site
     */
    update(siteId: number, customerId: number, data: UpdateSiteDto): Promise<Site>;
    /**
     * Delete site
     */
    delete(siteId: number, customerId: number): Promise<void>;
    /**
     * Count sites for a customer
     */
    countByCustomerId(customerId: number): Promise<number>;
    /**
     * Check if site code exists
     */
    siteCodeExists(siteCode: string, customerId: number, excludeSiteId?: number): Promise<boolean>;
}
//# sourceMappingURL=SiteRepository.d.ts.map