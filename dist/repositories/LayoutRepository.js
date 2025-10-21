"use strict";
/**
 * Layout Repository
 *
 * Database operations for Layouts and LayoutLayers tables.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class LayoutRepository extends BaseRepository_1.BaseRepository {
    /**
     * Find layout by ID within a customer
     */
    async findById(layoutId, customerId) {
        const sql = `
      SELECT
        LayoutId as layoutId,
        CustomerId as customerId,
        Name as name,
        Description as description,
        Width as width,
        Height as height,
        BackgroundColor as backgroundColor,
        ThumbnailUrl as thumbnailUrl,
        Tags as tags,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Layouts
      WHERE LayoutId = @layoutId AND CustomerId = @customerId
    `;
        return this.queryOne(sql, { layoutId, customerId });
    }
    /**
     * Find layout with all its layers
     */
    async findByIdWithLayers(layoutId, customerId) {
        const sql = `
      SELECT
        l.LayoutId as layoutId,
        l.CustomerId as customerId,
        l.Name as name,
        l.Description as description,
        l.Width as width,
        l.Height as height,
        l.BackgroundColor as backgroundColor,
        l.ThumbnailUrl as thumbnailUrl,
        l.Tags as tags,
        l.IsActive as isActive,
        l.CreatedBy as createdBy,
        l.CreatedAt as createdAt,
        l.UpdatedAt as updatedAt
      FROM Layouts l
      WHERE l.LayoutId = @layoutId AND l.CustomerId = @customerId;

      SELECT
        LayerId as layerId,
        LayoutId as layoutId,
        LayerName as layerName,
        LayerType as layerType,
        ZIndex as zIndex,
        PositionX as positionX,
        PositionY as positionY,
        Width as width,
        Height as height,
        Rotation as rotation,
        Opacity as opacity,
        IsVisible as isVisible,
        IsLocked as isLocked,
        ContentConfig as contentConfig,
        StyleConfig as styleConfig,
        AnimationConfig as animationConfig,
        ScheduleConfig as scheduleConfig,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM LayoutLayers
      WHERE LayoutId = @layoutId
      ORDER BY ZIndex ASC;
    `;
        const result = await this.queryMultipleResultSets(sql, {
            layoutId,
            customerId,
        });
        const layouts = result.recordsets[0];
        const layers = result.recordsets[1];
        if (layouts.length === 0) {
            return null;
        }
        const layout = layouts[0];
        // Parse JSON fields for layers
        layout.layers = layers.map((layer) => ({
            ...layer,
            contentConfig: layer.contentConfig ? JSON.parse(layer.contentConfig) : null,
            styleConfig: layer.styleConfig ? JSON.parse(layer.styleConfig) : null,
            animationConfig: layer.animationConfig ? JSON.parse(layer.animationConfig) : null,
            scheduleConfig: layer.scheduleConfig ? JSON.parse(layer.scheduleConfig) : null,
        }));
        return layout;
    }
    /**
     * Get all layouts for a customer with optional filters
     */
    async findByCustomerId(customerId, options) {
        let sql = `
      SELECT
        LayoutId as layoutId,
        CustomerId as customerId,
        Name as name,
        Description as description,
        Width as width,
        Height as height,
        BackgroundColor as backgroundColor,
        ThumbnailUrl as thumbnailUrl,
        Tags as tags,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Layouts
      WHERE CustomerId = @customerId
    `;
        const params = { customerId };
        if (options?.isActive !== undefined) {
            sql += ' AND IsActive = @isActive';
            params.isActive = options.isActive;
        }
        if (options?.search) {
            sql += ' AND (Name LIKE @search OR Tags LIKE @search)';
            params.search = `%${options.search}%`;
        }
        sql += ' ORDER BY UpdatedAt DESC';
        if (options?.limit) {
            sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
            params.offset = options.offset || 0;
            params.limit = options.limit;
        }
        return this.queryMany(sql, params);
    }
    /**
     * Create a new layout
     */
    async create(customerId, userId, data) {
        const sql = `
      INSERT INTO Layouts (
        CustomerId, Name, Description, Width, Height, BackgroundColor,
        Tags, CreatedBy
      )
      OUTPUT
        INSERTED.LayoutId as layoutId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Description as description,
        INSERTED.Width as width,
        INSERTED.Height as height,
        INSERTED.BackgroundColor as backgroundColor,
        INSERTED.ThumbnailUrl as thumbnailUrl,
        INSERTED.Tags as tags,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @customerId, @name, @description, @width, @height, @backgroundColor,
        @tags, @createdBy
      )
    `;
        return this.insert(sql, {
            customerId,
            name: data.name,
            description: data.description || null,
            width: data.width || 1920,
            height: data.height || 1080,
            backgroundColor: data.backgroundColor || '#000000',
            tags: data.tags || null,
            createdBy: userId,
        });
    }
    /**
     * Update a layout
     */
    async update(layoutId, customerId, data) {
        const updates = [];
        const params = { layoutId, customerId };
        if (data.name !== undefined) {
            updates.push('Name = @name');
            params.name = data.name;
        }
        if (data.description !== undefined) {
            updates.push('Description = @description');
            params.description = data.description;
        }
        if (data.width !== undefined) {
            updates.push('Width = @width');
            params.width = data.width;
        }
        if (data.height !== undefined) {
            updates.push('Height = @height');
            params.height = data.height;
        }
        if (data.backgroundColor !== undefined) {
            updates.push('BackgroundColor = @backgroundColor');
            params.backgroundColor = data.backgroundColor;
        }
        if (data.thumbnailUrl !== undefined) {
            updates.push('ThumbnailUrl = @thumbnailUrl');
            params.thumbnailUrl = data.thumbnailUrl;
        }
        if (data.tags !== undefined) {
            updates.push('Tags = @tags');
            params.tags = data.tags;
        }
        if (data.isActive !== undefined) {
            updates.push('IsActive = @isActive');
            params.isActive = data.isActive;
        }
        if (updates.length === 0) {
            return;
        }
        updates.push('UpdatedAt = GETUTCDATE()');
        const sql = `
      UPDATE Layouts
      SET ${updates.join(', ')}
      WHERE LayoutId = @layoutId AND CustomerId = @customerId
    `;
        await this.execute(sql, params);
    }
    /**
     * Delete a layout
     */
    async delete(layoutId, customerId) {
        const sql = `
      DELETE FROM Layouts
      WHERE LayoutId = @layoutId AND CustomerId = @customerId
    `;
        await this.execute(sql, { layoutId, customerId });
    }
    /**
     * Get all layers for a layout
     */
    async findLayersByLayoutId(layoutId) {
        const sql = `
      SELECT
        LayerId as layerId,
        LayoutId as layoutId,
        LayerName as layerName,
        LayerType as layerType,
        ZIndex as zIndex,
        PositionX as positionX,
        PositionY as positionY,
        Width as width,
        Height as height,
        Rotation as rotation,
        Opacity as opacity,
        IsVisible as isVisible,
        IsLocked as isLocked,
        ContentConfig as contentConfig,
        StyleConfig as styleConfig,
        AnimationConfig as animationConfig,
        ScheduleConfig as scheduleConfig,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM LayoutLayers
      WHERE LayoutId = @layoutId
      ORDER BY ZIndex ASC
    `;
        const layers = await this.queryMany(sql, { layoutId });
        // Parse JSON fields
        return layers.map((layer) => ({
            ...layer,
            contentConfig: layer.contentConfig ? JSON.parse(layer.contentConfig) : null,
            styleConfig: layer.styleConfig ? JSON.parse(layer.styleConfig) : null,
            animationConfig: layer.animationConfig ? JSON.parse(layer.animationConfig) : null,
            scheduleConfig: layer.scheduleConfig ? JSON.parse(layer.scheduleConfig) : null,
        }));
    }
    /**
     * Create a new layer
     */
    async createLayer(layoutId, data) {
        const sql = `
      INSERT INTO LayoutLayers (
        LayoutId, LayerName, LayerType, ZIndex, PositionX, PositionY,
        Width, Height, Rotation, Opacity, IsVisible, IsLocked,
        ContentConfig, StyleConfig, AnimationConfig, ScheduleConfig
      )
      OUTPUT
        INSERTED.LayerId as layerId,
        INSERTED.LayoutId as layoutId,
        INSERTED.LayerName as layerName,
        INSERTED.LayerType as layerType,
        INSERTED.ZIndex as zIndex,
        INSERTED.PositionX as positionX,
        INSERTED.PositionY as positionY,
        INSERTED.Width as width,
        INSERTED.Height as height,
        INSERTED.Rotation as rotation,
        INSERTED.Opacity as opacity,
        INSERTED.IsVisible as isVisible,
        INSERTED.IsLocked as isLocked,
        INSERTED.ContentConfig as contentConfig,
        INSERTED.StyleConfig as styleConfig,
        INSERTED.AnimationConfig as animationConfig,
        INSERTED.ScheduleConfig as scheduleConfig,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @layoutId, @layerName, @layerType, @zIndex, @positionX, @positionY,
        @width, @height, @rotation, @opacity, @isVisible, @isLocked,
        @contentConfig, @styleConfig, @animationConfig, @scheduleConfig
      )
    `;
        const layer = await this.insert(sql, {
            layoutId,
            layerName: data.layerName,
            layerType: data.layerType,
            zIndex: data.zIndex || 0,
            positionX: data.positionX,
            positionY: data.positionY,
            width: data.width,
            height: data.height,
            rotation: data.rotation || 0,
            opacity: data.opacity || 1.0,
            isVisible: data.isVisible !== undefined ? data.isVisible : true,
            isLocked: data.isLocked || false,
            contentConfig: data.contentConfig ? JSON.stringify(data.contentConfig) : null,
            styleConfig: data.styleConfig ? JSON.stringify(data.styleConfig) : null,
            animationConfig: data.animationConfig ? JSON.stringify(data.animationConfig) : null,
            scheduleConfig: data.scheduleConfig ? JSON.stringify(data.scheduleConfig) : null,
        });
        // Parse JSON fields back
        return {
            ...layer,
            contentConfig: layer.contentConfig ? JSON.parse(layer.contentConfig) : null,
            styleConfig: layer.styleConfig ? JSON.parse(layer.styleConfig) : null,
            animationConfig: layer.animationConfig ? JSON.parse(layer.animationConfig) : null,
            scheduleConfig: layer.scheduleConfig ? JSON.parse(layer.scheduleConfig) : null,
        };
    }
    /**
     * Update a layer
     */
    async updateLayer(layerId, data) {
        const updates = [];
        const params = { layerId };
        if (data.layerName !== undefined) {
            updates.push('LayerName = @layerName');
            params.layerName = data.layerName;
        }
        if (data.layerType !== undefined) {
            updates.push('LayerType = @layerType');
            params.layerType = data.layerType;
        }
        if (data.zIndex !== undefined) {
            updates.push('ZIndex = @zIndex');
            params.zIndex = data.zIndex;
        }
        if (data.positionX !== undefined) {
            updates.push('PositionX = @positionX');
            params.positionX = data.positionX;
        }
        if (data.positionY !== undefined) {
            updates.push('PositionY = @positionY');
            params.positionY = data.positionY;
        }
        if (data.width !== undefined) {
            updates.push('Width = @width');
            params.width = data.width;
        }
        if (data.height !== undefined) {
            updates.push('Height = @height');
            params.height = data.height;
        }
        if (data.rotation !== undefined) {
            updates.push('Rotation = @rotation');
            params.rotation = data.rotation;
        }
        if (data.opacity !== undefined) {
            updates.push('Opacity = @opacity');
            params.opacity = data.opacity;
        }
        if (data.isVisible !== undefined) {
            updates.push('IsVisible = @isVisible');
            params.isVisible = data.isVisible;
        }
        if (data.isLocked !== undefined) {
            updates.push('IsLocked = @isLocked');
            params.isLocked = data.isLocked;
        }
        if (data.contentConfig !== undefined) {
            updates.push('ContentConfig = @contentConfig');
            params.contentConfig = JSON.stringify(data.contentConfig);
        }
        if (data.styleConfig !== undefined) {
            updates.push('StyleConfig = @styleConfig');
            params.styleConfig = JSON.stringify(data.styleConfig);
        }
        if (data.animationConfig !== undefined) {
            updates.push('AnimationConfig = @animationConfig');
            params.animationConfig = JSON.stringify(data.animationConfig);
        }
        if (data.scheduleConfig !== undefined) {
            updates.push('ScheduleConfig = @scheduleConfig');
            params.scheduleConfig = JSON.stringify(data.scheduleConfig);
        }
        if (updates.length === 0) {
            return;
        }
        updates.push('UpdatedAt = GETUTCDATE()');
        const sql = `
      UPDATE LayoutLayers
      SET ${updates.join(', ')}
      WHERE LayerId = @layerId
    `;
        await this.execute(sql, params);
    }
    /**
     * Delete a layer
     */
    async deleteLayer(layerId) {
        const sql = `
      DELETE FROM LayoutLayers
      WHERE LayerId = @layerId
    `;
        await this.execute(sql, { layerId });
    }
    /**
     * Count total layouts for a customer
     */
    async countByCustomerId(customerId) {
        const sql = `
      SELECT COUNT(*) as count
      FROM Layouts
      WHERE CustomerId = @customerId
    `;
        const result = await this.queryOne(sql, { customerId });
        return result?.count || 0;
    }
}
exports.LayoutRepository = LayoutRepository;
//# sourceMappingURL=LayoutRepository.js.map