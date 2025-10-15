/**
 * Site Controller
 *
 * Handles HTTP requests for site management endpoints.
 * Follows RESTful conventions for CRUD operations.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { SiteService } from '../services/SiteService';
export declare class SiteController {
    private readonly siteService;
    constructor(siteService: SiteService);
    /**
     * GET /api/v1/sites
     * List all sites for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/sites/:siteId
     * Get site by ID
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/sites
     * Create new site
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/sites/:siteId
     * Update site
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/sites/:siteId
     * Delete site
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=SiteController.d.ts.map