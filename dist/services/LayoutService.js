"use strict";
/**
 * Layout Service
 *
 * Business logic for layout management including layout composition and layer operations.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutService = void 0;
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
class LayoutService {
    layoutRepository;
    constructor(layoutRepository) {
        this.layoutRepository = layoutRepository;
    }
    /**
     * Get layout by ID
     */
    async getById(layoutId, customerId) {
        const layout = await this.layoutRepository.findById(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        return layout;
    }
    /**
     * Get layout by ID with all layers
     */
    async getByIdWithLayers(layoutId, customerId) {
        const layout = await this.layoutRepository.findByIdWithLayers(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        return layout;
    }
    /**
     * List all layouts for a customer with filters and pagination
     */
    async list(customerId, filters) {
        const { page, limit } = (0, helpers_1.parsePaginationParams)({
            page: filters?.page,
            limit: filters?.limit,
        });
        const offset = (page - 1) * limit;
        const isActive = filters?.isActive !== undefined
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
    async create(customerId, userId, data) {
        // Validate layout dimensions
        if (data.width && data.width < 100) {
            throw new errors_1.ValidationError('Layout width must be at least 100px');
        }
        if (data.height && data.height < 100) {
            throw new errors_1.ValidationError('Layout height must be at least 100px');
        }
        logger_1.default.info('Creating new layout', {
            customerId,
            userId,
            layoutName: data.name,
        });
        // Create the layout
        const layout = await this.layoutRepository.create(customerId, userId, data);
        // If layers are provided, create them
        if (data.layers && data.layers.length > 0) {
            const createdLayers = [];
            for (const layerData of data.layers) {
                const layer = await this.layoutRepository.createLayer(layout.layoutId, layerData);
                createdLayers.push(layer);
            }
            layout.layers = createdLayers;
        }
        logger_1.default.info('Layout created successfully', { layoutId: layout.layoutId });
        return layout;
    }
    /**
     * Update a layout
     */
    async update(layoutId, customerId, data) {
        // Verify layout exists
        const existingLayout = await this.layoutRepository.findById(layoutId, customerId);
        if (!existingLayout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        // Validate layout dimensions
        if (data.width && data.width < 100) {
            throw new errors_1.ValidationError('Layout width must be at least 100px');
        }
        if (data.height && data.height < 100) {
            throw new errors_1.ValidationError('Layout height must be at least 100px');
        }
        logger_1.default.info('Updating layout', { layoutId, customerId });
        await this.layoutRepository.update(layoutId, customerId, data);
        // Return updated layout
        return this.getById(layoutId, customerId);
    }
    /**
     * Delete a layout
     */
    async delete(layoutId, customerId) {
        // Verify layout exists
        const layout = await this.layoutRepository.findById(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        logger_1.default.info('Deleting layout', { layoutId, customerId });
        await this.layoutRepository.delete(layoutId, customerId);
        logger_1.default.info('Layout deleted successfully', { layoutId });
    }
    /**
     * Get all layers for a layout
     */
    async getLayers(layoutId, customerId) {
        // Verify layout exists and belongs to customer
        const layout = await this.layoutRepository.findById(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        return this.layoutRepository.findLayersByLayoutId(layoutId);
    }
    /**
     * Add a new layer to a layout
     */
    async addLayer(layoutId, customerId, data) {
        // Verify layout exists and belongs to customer
        const layout = await this.layoutRepository.findById(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        // Validate layer dimensions
        if (data.width < 1) {
            throw new errors_1.ValidationError('Layer width must be at least 1px');
        }
        if (data.height < 1) {
            throw new errors_1.ValidationError('Layer height must be at least 1px');
        }
        logger_1.default.info('Adding layer to layout', {
            layoutId,
            layerName: data.layerName,
            layerType: data.layerType,
        });
        const layer = await this.layoutRepository.createLayer(layoutId, data);
        logger_1.default.info('Layer added successfully', { layerId: layer.layerId });
        return layer;
    }
    /**
     * Update a layer
     */
    async updateLayer(layerId, layoutId, customerId, data) {
        // Verify layout exists and belongs to customer
        const layout = await this.layoutRepository.findById(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        // Validate layer dimensions
        if (data.width !== undefined && data.width < 1) {
            throw new errors_1.ValidationError('Layer width must be at least 1px');
        }
        if (data.height !== undefined && data.height < 1) {
            throw new errors_1.ValidationError('Layer height must be at least 1px');
        }
        logger_1.default.info('Updating layer', { layerId, layoutId });
        await this.layoutRepository.updateLayer(layerId, data);
        // Get and return the updated layer
        const layers = await this.layoutRepository.findLayersByLayoutId(layoutId);
        const updatedLayer = layers.find((l) => l.layerId === layerId);
        if (!updatedLayer) {
            throw new errors_1.NotFoundError('Layer not found');
        }
        logger_1.default.info('Layer updated successfully', { layerId });
        return updatedLayer;
    }
    /**
     * Delete a layer
     */
    async deleteLayer(layerId, layoutId, customerId) {
        // Verify layout exists and belongs to customer
        const layout = await this.layoutRepository.findById(layoutId, customerId);
        if (!layout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        logger_1.default.info('Deleting layer', { layerId, layoutId });
        await this.layoutRepository.deleteLayer(layerId);
        logger_1.default.info('Layer deleted successfully', { layerId });
    }
    /**
     * Duplicate a layout
     */
    async duplicate(layoutId, customerId, userId, newName) {
        // Get the original layout with all layers
        const originalLayout = await this.layoutRepository.findByIdWithLayers(layoutId, customerId);
        if (!originalLayout) {
            throw new errors_1.NotFoundError('Layout not found');
        }
        logger_1.default.info('Duplicating layout', { layoutId, customerId });
        // Create the new layout
        const duplicatedLayout = await this.layoutRepository.create(customerId, userId, {
            name: newName || `${originalLayout.name} (Copy)`,
            description: originalLayout.description || undefined,
            width: originalLayout.width,
            height: originalLayout.height,
            backgroundColor: originalLayout.backgroundColor,
            tags: originalLayout.tags || undefined,
        });
        // Duplicate all layers
        if (originalLayout.layers && originalLayout.layers.length > 0) {
            const duplicatedLayers = [];
            for (const layer of originalLayout.layers) {
                const newLayer = await this.layoutRepository.createLayer(duplicatedLayout.layoutId, {
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
                });
                duplicatedLayers.push(newLayer);
            }
            duplicatedLayout.layers = duplicatedLayers;
        }
        logger_1.default.info('Layout duplicated successfully', {
            originalLayoutId: layoutId,
            newLayoutId: duplicatedLayout.layoutId,
        });
        return duplicatedLayout;
    }
}
exports.LayoutService = LayoutService;
//# sourceMappingURL=LayoutService.js.map