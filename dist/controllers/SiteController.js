"use strict";
/**
 * Site Controller
 *
 * Handles HTTP requests for site management endpoints.
 * Follows RESTful conventions for CRUD operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteController = void 0;
class SiteController {
    siteService;
    constructor(siteService) {
        this.siteService = siteService;
    }
    /**
     * GET /api/v1/sites
     * List all sites for the authenticated user's customer
     */
    async list(req, res, next) {
        try {
            const customerId = req.user.customerId;
            const { page, limit, isActive, search } = req.query;
            const result = await this.siteService.list(customerId, {
                page: page,
                limit: limit,
                isActive: isActive,
                search: search,
            });
            res.status(200).json({
                status: 'success',
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/sites/:siteId
     * Get site by ID
     */
    async getById(req, res, next) {
        try {
            const siteId = parseInt(req.params.siteId, 10);
            const customerId = req.user.customerId;
            const site = await this.siteService.getById(siteId, customerId);
            res.status(200).json({
                status: 'success',
                data: site,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/sites
     * Create new site
     */
    async create(req, res, next) {
        try {
            const customerId = req.user.customerId;
            // Merge customerId from authenticated user into the request body
            const siteData = {
                ...req.body,
                customerId,
            };
            const site = await this.siteService.create(siteData);
            res.status(201).json({
                status: 'success',
                data: site,
                message: 'Site created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PATCH /api/v1/sites/:siteId
     * Update site
     */
    async update(req, res, next) {
        try {
            const siteId = parseInt(req.params.siteId, 10);
            const customerId = req.user.customerId;
            const site = await this.siteService.update(siteId, customerId, req.body);
            res.status(200).json({
                status: 'success',
                data: site,
                message: 'Site updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/sites/:siteId
     * Delete site
     */
    async delete(req, res, next) {
        try {
            const siteId = parseInt(req.params.siteId, 10);
            const customerId = req.user.customerId;
            await this.siteService.delete(siteId, customerId);
            res.status(200).json({
                status: 'success',
                message: 'Site deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SiteController = SiteController;
//# sourceMappingURL=SiteController.js.map