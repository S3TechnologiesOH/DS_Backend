/**
 * Playlist Controller
 *
 * Handles HTTP requests for playlist management endpoints.
 * Follows RESTful conventions for CRUD operations.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { PlaylistService } from '../services/PlaylistService';

export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  /**
   * GET /api/v1/playlists
   * List all playlists for the authenticated user's customer
   */
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const { page, limit, search, isActive } = req.query;

      const result = await this.playlistService.list(customerId, {
        page: page as string,
        limit: limit as string,
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
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
   * GET /api/v1/playlists/:playlistId
   * Get playlist by ID with items
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistId = parseInt(req.params.playlistId, 10);
      const customerId = req.user.customerId;

      const playlist = await this.playlistService.getByIdWithItems(playlistId, customerId);

      res.status(200).json({
        status: 'success',
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/playlists
   * Create new playlist
   *
   * Expected body:
   * {
   *   "name": "Playlist Name",
   *   "description": "Optional description"
   * }
   */
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const userId = req.user.userId;

      const playlist = await this.playlistService.create({
        customerId,
        name: req.body.name,
        description: req.body.description,
        createdBy: userId,
      });

      res.status(201).json({
        status: 'success',
        data: playlist,
        message: 'Playlist created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/playlists/:playlistId
   * Update playlist
   *
   * All fields are optional:
   * {
   *   "name": "Updated Name",
   *   "description": "Updated description",
   *   "isActive": true
   * }
   */
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistId = parseInt(req.params.playlistId, 10);
      const customerId = req.user.customerId;

      const playlist = await this.playlistService.update(playlistId, customerId, req.body);

      res.status(200).json({
        status: 'success',
        data: playlist,
        message: 'Playlist updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/playlists/:playlistId
   * Delete playlist
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistId = parseInt(req.params.playlistId, 10);
      const customerId = req.user.customerId;

      await this.playlistService.delete(playlistId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Playlist deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/playlists/:playlistId/items
   * Add item to playlist
   *
   * Expected body:
   * {
   *   "contentId": 1,
   *   "displayOrder": 0,
   *   "duration": 10,  // optional, in seconds
   *   "transitionType": "Fade",  // optional: "Fade", "Slide", "None"
   *   "transitionDuration": 500  // optional, in milliseconds
   * }
   */
  async addItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistId = parseInt(req.params.playlistId, 10);
      const customerId = req.user.customerId;

      const item = await this.playlistService.addItem(
        {
          playlistId,
          layoutId: req.body.layoutId,
          displayOrder: req.body.displayOrder,
          duration: req.body.duration,
          transitionType: req.body.transitionType,
          transitionDuration: req.body.transitionDuration,
        },
        customerId
      );

      res.status(201).json({
        status: 'success',
        data: item,
        message: 'Item added to playlist successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/playlists/:playlistId/items/:itemId
   * Update playlist item
   *
   * All fields are optional:
   * {
   *   "displayOrder": 1,
   *   "duration": 15,
   *   "transitionType": "Slide",
   *   "transitionDuration": 1000
   * }
   */
  async updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistId = parseInt(req.params.playlistId, 10);
      const itemId = parseInt(req.params.itemId, 10);
      const customerId = req.user.customerId;

      const item = await this.playlistService.updateItem(playlistId, itemId, customerId, req.body);

      res.status(200).json({
        status: 'success',
        data: item,
        message: 'Playlist item updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/playlists/:playlistId/items/:itemId
   * Remove item from playlist
   */
  async removeItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlistId = parseInt(req.params.playlistId, 10);
      const itemId = parseInt(req.params.itemId, 10);
      const customerId = req.user.customerId;

      await this.playlistService.removeItem(playlistId, itemId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Item removed from playlist successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
