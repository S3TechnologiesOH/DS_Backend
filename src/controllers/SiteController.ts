/**
 * Site Controller
 *
 * Handles HTTP requests for site management endpoints.
 * Follows RESTful conventions for CRUD operations.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { SiteService } from '../services/SiteService';

export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  /**
   * GET /api/v1/sites
   * List all sites for the authenticated user's customer
   */
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { page, limit, isActive, search } = req.query;

      const result = await this.siteService.list(customerId, {
        page: page as string,
        limit: limit as string,
        isActive: isActive as string,
        search: search as string,
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
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/sites/:siteId
   * Get site by ID
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const siteId = parseInt(req.params.siteId, 10);
      const customerId = req.user.customerId;

      const site = await this.siteService.getById(siteId, customerId);

      res.status(200).json({
        status: 'success',
        data: site,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/sites
   * Create new site
   */
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/sites/:siteId
   * Update site
   */
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const siteId = parseInt(req.params.siteId, 10);
      const customerId = req.user.customerId;

      const site = await this.siteService.update(siteId, customerId, req.body);

      res.status(200).json({
        status: 'success',
        data: site,
        message: 'Site updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/sites/:siteId
   * Delete site
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const siteId = parseInt(req.params.siteId, 10);
      const customerId = req.user.customerId;

      await this.siteService.delete(siteId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Site deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
