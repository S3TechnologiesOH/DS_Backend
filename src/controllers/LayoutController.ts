/**
 * Layout Controller
 *
 * Handles HTTP requests for layout management endpoints.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { LayoutService } from '../services/LayoutService';
import { ValidationError } from '../utils/errors';

export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  /**
   * GET /api/v1/layouts
   * List all layouts for the authenticated user's customer
   */
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { page, limit, isActive, search } = req.query;

      const result = await this.layoutService.list(customerId, {
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
   * GET /api/v1/layouts/:layoutId
   * Get layout by ID with all layers
   */
  async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const customerId = req.user.customerId;

      const layout = await this.layoutService.getByIdWithLayers(
        layoutId,
        customerId
      );

      res.status(200).json({
        status: 'success',
        data: layout,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/layouts
   * Create a new layout
   */
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const userId = req.user.userId;

      const layout = await this.layoutService.create(
        customerId,
        userId,
        req.body
      );

      res.status(201).json({
        status: 'success',
        data: layout,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/layouts/:layoutId
   * Update layout metadata
   */
  async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const customerId = req.user.customerId;

      const layout = await this.layoutService.update(
        layoutId,
        customerId,
        req.body
      );

      res.status(200).json({
        status: 'success',
        data: layout,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/layouts/:layoutId
   * Delete a layout (Admin only)
   */
  async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const customerId = req.user.customerId;

      await this.layoutService.delete(layoutId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Layout deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/layouts/:layoutId/duplicate
   * Duplicate a layout
   */
  async duplicate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const customerId = req.user.customerId;
      const userId = req.user.userId;
      const { name } = req.body;

      const duplicatedLayout = await this.layoutService.duplicate(
        layoutId,
        customerId,
        userId,
        name
      );

      res.status(201).json({
        status: 'success',
        data: duplicatedLayout,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/layouts/:layoutId/layers
   * Get all layers for a layout
   */
  async getLayers(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const customerId = req.user.customerId;

      const layers = await this.layoutService.getLayers(layoutId, customerId);

      res.status(200).json({
        status: 'success',
        data: layers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/layouts/:layoutId/layers
   * Add a new layer to a layout
   */
  async addLayer(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const customerId = req.user.customerId;

      const layer = await this.layoutService.addLayer(
        layoutId,
        customerId,
        req.body
      );

      res.status(201).json({
        status: 'success',
        data: layer,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/layouts/:layoutId/layers/:layerId
   * Update a layer
   */
  async updateLayer(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const layerId = parseInt(req.params.layerId, 10);
      const customerId = req.user.customerId;

      const layer = await this.layoutService.updateLayer(
        layerId,
        layoutId,
        customerId,
        req.body
      );

      res.status(200).json({
        status: 'success',
        data: layer,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/layouts/:layoutId/layers/:layerId
   * Delete a layer from a layout
   */
  async deleteLayer(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const layoutId = parseInt(req.params.layoutId, 10);
      const layerId = parseInt(req.params.layerId, 10);
      const customerId = req.user.customerId;

      await this.layoutService.deleteLayer(layerId, layoutId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Layer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
