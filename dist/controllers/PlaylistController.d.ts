/**
 * Playlist Controller
 *
 * Handles HTTP requests for playlist management endpoints.
 * Follows RESTful conventions for CRUD operations.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { PlaylistService } from '../services/PlaylistService';
export declare class PlaylistController {
    private readonly playlistService;
    constructor(playlistService: PlaylistService);
    /**
     * GET /api/v1/playlists
     * List all playlists for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/playlists/:playlistId
     * Get playlist by ID with items
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/playlists/:playlistId/items
     * Get all items for a playlist
     */
    getItems(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
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
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
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
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/playlists/:playlistId
     * Delete playlist
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
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
    addItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
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
    updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/playlists/:playlistId/items/:itemId
     * Remove item from playlist
     */
    removeItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=PlaylistController.d.ts.map