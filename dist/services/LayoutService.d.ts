/**
 * Layout Service
 *
 * Business logic for layout management including layout composition and layer operations.
 */
import { LayoutRepository } from '../repositories/LayoutRepository';
import { Layout, LayoutLayer, CreateLayoutDTO, CreateLayoutLayerDTO, UpdateLayoutDTO, UpdateLayoutLayerDTO } from '../models/Layout';
export declare class LayoutService {
    private readonly layoutRepository;
    constructor(layoutRepository: LayoutRepository);
    /**
     * Get layout by ID
     */
    getById(layoutId: number, customerId: number): Promise<Layout>;
    /**
     * Get layout by ID with all layers
     */
    getByIdWithLayers(layoutId: number, customerId: number): Promise<Layout>;
    /**
     * List all layouts for a customer with filters and pagination
     */
    list(customerId: number, filters?: {
        page?: string;
        limit?: string;
        isActive?: string;
        search?: string;
    }): Promise<{
        data: Layout[];
        total: number;
        page: number;
        limit: number;
    }>;
    /**
     * Create a new layout
     */
    create(customerId: number, userId: number, data: CreateLayoutDTO): Promise<Layout>;
    /**
     * Update a layout
     */
    update(layoutId: number, customerId: number, data: UpdateLayoutDTO): Promise<Layout>;
    /**
     * Delete a layout
     */
    delete(layoutId: number, customerId: number): Promise<void>;
    /**
     * Get all layers for a layout
     */
    getLayers(layoutId: number, customerId: number): Promise<LayoutLayer[]>;
    /**
     * Add a new layer to a layout
     */
    addLayer(layoutId: number, customerId: number, data: CreateLayoutLayerDTO): Promise<LayoutLayer>;
    /**
     * Update a layer
     */
    updateLayer(layerId: number, layoutId: number, customerId: number, data: UpdateLayoutLayerDTO): Promise<LayoutLayer>;
    /**
     * Delete a layer
     */
    deleteLayer(layerId: number, layoutId: number, customerId: number): Promise<void>;
    /**
     * Duplicate a layout
     */
    duplicate(layoutId: number, customerId: number, userId: number, newName?: string): Promise<Layout>;
}
//# sourceMappingURL=LayoutService.d.ts.map