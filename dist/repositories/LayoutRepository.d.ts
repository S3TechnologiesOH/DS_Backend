/**
 * Layout Repository
 *
 * Database operations for Layouts and LayoutLayers tables.
 */
import { BaseRepository } from './BaseRepository';
import { Layout, LayoutLayer, CreateLayoutDTO, CreateLayoutLayerDTO, UpdateLayoutDTO, UpdateLayoutLayerDTO } from '../models/Layout';
export declare class LayoutRepository extends BaseRepository {
    /**
     * Find layout by ID within a customer
     */
    findById(layoutId: number, customerId: number): Promise<Layout | null>;
    /**
     * Find layout with all its layers
     */
    findByIdWithLayers(layoutId: number, customerId: number): Promise<Layout | null>;
    /**
     * Get all layouts for a customer with optional filters
     */
    findByCustomerId(customerId: number, options?: {
        isActive?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Layout[]>;
    /**
     * Create a new layout
     */
    create(customerId: number, userId: number, data: CreateLayoutDTO): Promise<Layout>;
    /**
     * Update a layout
     */
    update(layoutId: number, customerId: number, data: UpdateLayoutDTO): Promise<void>;
    /**
     * Delete a layout
     */
    delete(layoutId: number, customerId: number): Promise<void>;
    /**
     * Get all layers for a layout
     */
    findLayersByLayoutId(layoutId: number): Promise<LayoutLayer[]>;
    /**
     * Create a new layer
     */
    createLayer(layoutId: number, data: CreateLayoutLayerDTO): Promise<LayoutLayer>;
    /**
     * Update a layer
     */
    updateLayer(layerId: number, data: UpdateLayoutLayerDTO): Promise<void>;
    /**
     * Delete a layer
     */
    deleteLayer(layerId: number): Promise<void>;
    /**
     * Count total layouts for a customer
     */
    countByCustomerId(customerId: number): Promise<number>;
}
//# sourceMappingURL=LayoutRepository.d.ts.map