/**
 * Layout Service
 *
 * Business logic for layout management including layout composition and layer operations.
 */

import { LayoutRepository } from '../repositories/LayoutRepository';
import {
  Layout,
  LayoutLayer,
  CreateLayoutDTO,
  CreateLayoutLayerDTO,
  UpdateLayoutDTO,
  UpdateLayoutLayerDTO,
} from '../models/Layout';
import { NotFoundError, ValidationError } from '../utils/errors';
import { parsePaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

export class LayoutService {
  constructor(private readonly layoutRepository: LayoutRepository) {}

  /**
   * Get layout by ID
   */
  async getById(layoutId: number, customerId: number): Promise<Layout> {
    const layout = await this.layoutRepository.findById(layoutId, customerId);

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    return layout;
  }

  /**
   * Get layout by ID with all layers
   */
  async getByIdWithLayers(
    layoutId: number,
    customerId: number
  ): Promise<Layout> {
    const layout = await this.layoutRepository.findByIdWithLayers(
      layoutId,
      customerId
    );

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    return layout;
  }

  /**
   * List all layouts for a customer with filters and pagination
   */
  async list(
    customerId: number,
    filters?: {
      page?: string;
      limit?: string;
      isActive?: string;
      search?: string;
    }
  ): Promise<{ data: Layout[]; total: number; page: number; limit: number }> {
    const { page, limit } = parsePaginationParams({
      page: filters?.page,
      limit: filters?.limit,
    });

    const offset = (page - 1) * limit;

    const isActive =
      filters?.isActive !== undefined
        ? filters.isActive === 'true'
        : undefined;

    const layouts = await this.layoutRepository.findByCustomerId(customerId, {
      isActive,
      search: filters?.search,
      limit,
      offset,
    });

    const total = await this.layoutRepository.countByCustomerId(customerId);

    return {
      data: layouts,
      total,
      page,
      limit,
    };
  }

  /**
   * Create a new layout
   */
  async create(
    customerId: number,
    userId: number,
    data: CreateLayoutDTO
  ): Promise<Layout> {
    // Validate layout dimensions
    if (data.width && data.width < 100) {
      throw new ValidationError('Layout width must be at least 100px');
    }
    if (data.height && data.height < 100) {
      throw new ValidationError('Layout height must be at least 100px');
    }

    logger.info('Creating new layout', {
      customerId,
      userId,
      layoutName: data.name,
    });

    // Create the layout
    const layout = await this.layoutRepository.create(customerId, userId, data);

    // If layers are provided, create them
    if (data.layers && data.layers.length > 0) {
      const createdLayers: LayoutLayer[] = [];

      for (const layerData of data.layers) {
        const layer = await this.layoutRepository.createLayer(
          layout.layoutId,
          layerData
        );
        createdLayers.push(layer);
      }

      layout.layers = createdLayers;
    }

    logger.info('Layout created successfully', { layoutId: layout.layoutId });

    return layout;
  }

  /**
   * Update a layout
   */
  async update(
    layoutId: number,
    customerId: number,
    data: UpdateLayoutDTO
  ): Promise<Layout> {
    // Verify layout exists
    const existingLayout = await this.layoutRepository.findById(
      layoutId,
      customerId
    );

    if (!existingLayout) {
      throw new NotFoundError('Layout not found');
    }

    // Validate layout dimensions
    if (data.width && data.width < 100) {
      throw new ValidationError('Layout width must be at least 100px');
    }
    if (data.height && data.height < 100) {
      throw new ValidationError('Layout height must be at least 100px');
    }

    logger.info('Updating layout', { layoutId, customerId });

    await this.layoutRepository.update(layoutId, customerId, data);

    // Return updated layout
    return this.getById(layoutId, customerId);
  }

  /**
   * Delete a layout
   */
  async delete(layoutId: number, customerId: number): Promise<void> {
    // Verify layout exists
    const layout = await this.layoutRepository.findById(layoutId, customerId);

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    logger.info('Deleting layout', { layoutId, customerId });

    await this.layoutRepository.delete(layoutId, customerId);

    logger.info('Layout deleted successfully', { layoutId });
  }

  /**
   * Get all layers for a layout
   */
  async getLayers(
    layoutId: number,
    customerId: number
  ): Promise<LayoutLayer[]> {
    // Verify layout exists and belongs to customer
    const layout = await this.layoutRepository.findById(layoutId, customerId);

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    return this.layoutRepository.findLayersByLayoutId(layoutId);
  }

  /**
   * Add a new layer to a layout
   */
  async addLayer(
    layoutId: number,
    customerId: number,
    data: CreateLayoutLayerDTO
  ): Promise<LayoutLayer> {
    // Verify layout exists and belongs to customer
    const layout = await this.layoutRepository.findById(layoutId, customerId);

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    // Validate layer dimensions
    if (data.width < 1) {
      throw new ValidationError('Layer width must be at least 1px');
    }
    if (data.height < 1) {
      throw new ValidationError('Layer height must be at least 1px');
    }

    logger.info('Adding layer to layout', {
      layoutId,
      layerName: data.layerName,
      layerType: data.layerType,
    });

    const layer = await this.layoutRepository.createLayer(layoutId, data);

    logger.info('Layer added successfully', { layerId: layer.layerId });

    return layer;
  }

  /**
   * Update a layer
   */
  async updateLayer(
    layerId: number,
    layoutId: number,
    customerId: number,
    data: UpdateLayoutLayerDTO
  ): Promise<LayoutLayer> {
    // Verify layout exists and belongs to customer
    const layout = await this.layoutRepository.findById(layoutId, customerId);

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    // Validate layer dimensions
    if (data.width !== undefined && data.width < 1) {
      throw new ValidationError('Layer width must be at least 1px');
    }
    if (data.height !== undefined && data.height < 1) {
      throw new ValidationError('Layer height must be at least 1px');
    }

    logger.info('Updating layer', { layerId, layoutId });

    await this.layoutRepository.updateLayer(layerId, data);

    // Get and return the updated layer
    const layers = await this.layoutRepository.findLayersByLayoutId(layoutId);
    const updatedLayer = layers.find((l) => l.layerId === layerId);

    if (!updatedLayer) {
      throw new NotFoundError('Layer not found');
    }

    logger.info('Layer updated successfully', { layerId });

    return updatedLayer;
  }

  /**
   * Delete a layer
   */
  async deleteLayer(
    layerId: number,
    layoutId: number,
    customerId: number
  ): Promise<void> {
    // Verify layout exists and belongs to customer
    const layout = await this.layoutRepository.findById(layoutId, customerId);

    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    logger.info('Deleting layer', { layerId, layoutId });

    await this.layoutRepository.deleteLayer(layerId);

    logger.info('Layer deleted successfully', { layerId });
  }

  /**
   * Duplicate a layout
   */
  async duplicate(
    layoutId: number,
    customerId: number,
    userId: number,
    newName?: string
  ): Promise<Layout> {
    // Get the original layout with all layers
    const originalLayout = await this.layoutRepository.findByIdWithLayers(
      layoutId,
      customerId
    );

    if (!originalLayout) {
      throw new NotFoundError('Layout not found');
    }

    logger.info('Duplicating layout', { layoutId, customerId });

    // Create the new layout
    const duplicatedLayout = await this.layoutRepository.create(
      customerId,
      userId,
      {
        name: newName || `${originalLayout.name} (Copy)`,
        description: originalLayout.description || undefined,
        width: originalLayout.width,
        height: originalLayout.height,
        backgroundColor: originalLayout.backgroundColor,
        tags: originalLayout.tags || undefined,
      }
    );

    // Duplicate all layers
    if (originalLayout.layers && originalLayout.layers.length > 0) {
      const duplicatedLayers: LayoutLayer[] = [];

      for (const layer of originalLayout.layers) {
        const newLayer = await this.layoutRepository.createLayer(
          duplicatedLayout.layoutId,
          {
            layerName: layer.layerName,
            layerType: layer.layerType,
            zIndex: layer.zIndex,
            positionX: layer.positionX,
            positionY: layer.positionY,
            width: layer.width,
            height: layer.height,
            rotation: layer.rotation,
            opacity: layer.opacity,
            isVisible: layer.isVisible,
            isLocked: layer.isLocked,
            contentConfig: layer.contentConfig || undefined,
            styleConfig: layer.styleConfig || undefined,
            animationConfig: layer.animationConfig || undefined,
            scheduleConfig: layer.scheduleConfig || undefined,
          }
        );
        duplicatedLayers.push(newLayer);
      }

      duplicatedLayout.layers = duplicatedLayers;
    }

    logger.info('Layout duplicated successfully', {
      originalLayoutId: layoutId,
      newLayoutId: duplicatedLayout.layoutId,
    });

    return duplicatedLayout;
  }
}
