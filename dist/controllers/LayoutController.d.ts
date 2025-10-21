/**
 * Layout Controller
 *
 * Handles HTTP requests for layout management endpoints.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { LayoutService } from '../services/LayoutService';
export declare class LayoutController {
    private readonly layoutService;
    constructor(layoutService: LayoutService);
    /**
     * GET /api/v1/layouts
     * List all layouts for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/layouts/:layoutId
     * Get layout by ID with all layers
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/layouts
     * Create a new layout
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/layouts/:layoutId
     * Update layout metadata
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/layouts/:layoutId
     * Delete a layout (Admin only)
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/layouts/:layoutId/duplicate
     * Duplicate a layout
     */
    duplicate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/layouts/:layoutId/layers
     * Get all layers for a layout
     */
    getLayers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/layouts/:layoutId/layers
     * Add a new layer to a layout
     */
    addLayer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/layouts/:layoutId/layers/:layerId
     * Update a layer
     */
    updateLayer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/layouts/:layoutId/layers/:layerId
     * Delete a layer from a layout
     */
    deleteLayer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=LayoutController.d.ts.map