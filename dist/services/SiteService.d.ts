/**
 * Site Service
 *
 * Business logic for site management.
 * Handles CRUD operations for sites with proper multi-tenancy filtering.
 */
import { SiteRepository } from '../repositories/SiteRepository';
import { Site, CreateSiteDto, UpdateSiteDto } from '../models';
export declare class SiteService {
    private readonly siteRepository;
    constructor(siteRepository: SiteRepository);
    /**
     * Get site by ID
     */
    getById(siteId: number, customerId: number): Promise<Site>;
    /**
     * List all sites for a customer with filters and pagination
     */
    list(customerId: number, filters?: {
        page?: string;
        limit?: string;
        isActive?: string;
        search?: string;
    }): Promise<{
        data: Site[];
        total: number;
        page: number;
        limit: number;
    }>;
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
}
//# sourceMappingURL=SiteService.d.ts.map