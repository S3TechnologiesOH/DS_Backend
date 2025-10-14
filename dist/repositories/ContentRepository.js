"use strict";
/**
 * Content Repository
 *
 * Database operations for Content table (media library).
 * Demonstrates pagination and filtering.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const errors_1 = require("../utils/errors");
class ContentRepository extends BaseRepository_1.BaseRepository {
    /**
     * Find content by ID within a customer
     */
    async findById(contentId, customerId) {
        const sql = `
      SELECT
        ContentId as contentId,
        CustomerId as customerId,
        Name as name,
        Description as description,
        ContentType as contentType,
        FileUrl as fileUrl,
        ThumbnailUrl as thumbnailUrl,
        FileSize as fileSize,
        Duration as duration,
        Width as width,
        Height as height,
        MimeType as mimeType,
        Status as status,
        UploadedBy as uploadedBy,
        Tags as tags,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Content
      WHERE ContentId = @contentId AND CustomerId = @customerId
    `;
        return this.queryOne(sql, { contentId, customerId });
    }
    /**
     * Get all content for a customer with optional filters
     */
    async findByCustomerId(customerId, options) {
        let sql = `
      SELECT
        ContentId as contentId,
        CustomerId as customerId,
        Name as name,
        Description as description,
        ContentType as contentType,
        FileUrl as fileUrl,
        ThumbnailUrl as thumbnailUrl,
        FileSize as fileSize,
        Duration as duration,
        Width as width,
        Height as height,
        MimeType as mimeType,
        Status as status,
        UploadedBy as uploadedBy,
        Tags as tags,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Content
      WHERE CustomerId = @customerId
    `;
        const params = { customerId };
        if (options?.contentType) {
            sql += ' AND ContentType = @contentType';
            params.contentType = options.contentType;
        }
        if (options?.status) {
            sql += ' AND Status = @status';
            params.status = options.status;
        }
        if (options?.search) {
            sql += ' AND (Name LIKE @search OR Tags LIKE @search)';
            params.search = `%${options.search}%`;
        }
        sql += ' ORDER BY CreatedAt DESC';
        if (options?.limit) {
            sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
            params.offset = options.offset || 0;
            params.limit = options.limit;
        }
        return this.queryMany(sql, params);
    }
    /**
     * Create new content
     */
    async create(data) {
        const sql = `
      INSERT INTO Content (
        CustomerId, Name, Description, ContentType, FileUrl, ThumbnailUrl,
        FileSize, Duration, Width, Height, MimeType, Status, UploadedBy, Tags
      )
      OUTPUT
        INSERTED.ContentId as contentId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Description as description,
        INSERTED.ContentType as contentType,
        INSERTED.FileUrl as fileUrl,
        INSERTED.ThumbnailUrl as thumbnailUrl,
        INSERTED.FileSize as fileSize,
        INSERTED.Duration as duration,
        INSERTED.Width as width,
        INSERTED.Height as height,
        INSERTED.MimeType as mimeType,
        INSERTED.Status as status,
        INSERTED.UploadedBy as uploadedBy,
        INSERTED.Tags as tags,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @customerId, @name, @description, @contentType, @fileUrl, @thumbnailUrl,
        @fileSize, @duration, @width, @height, @mimeType, @status, @uploadedBy, @tags
      )
    `;
        return this.insert(sql, {
            customerId: data.customerId,
            name: data.name,
            description: data.description || null,
            contentType: data.contentType,
            fileUrl: data.fileUrl || null,
            thumbnailUrl: data.thumbnailUrl || null,
            fileSize: data.fileSize || null,
            duration: data.duration || null,
            width: data.width || null,
            height: data.height || null,
            mimeType: data.mimeType || null,
            status: 'Processing',
            uploadedBy: data.uploadedBy,
            tags: data.tags || null,
        });
    }
    /**
     * Update content
     */
    async update(contentId, customerId, data) {
        const updates = [];
        const params = { contentId, customerId };
        if (data.name !== undefined) {
            updates.push('Name = @name');
            params.name = data.name;
        }
        if (data.description !== undefined) {
            updates.push('Description = @description');
            params.description = data.description;
        }
        if (data.duration !== undefined) {
            updates.push('Duration = @duration');
            params.duration = data.duration;
        }
        if (data.status !== undefined) {
            updates.push('Status = @status');
            params.status = data.status;
        }
        if (data.tags !== undefined) {
            updates.push('Tags = @tags');
            params.tags = data.tags;
        }
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        updates.push('UpdatedAt = GETUTCDATE()');
        const sql = `
      UPDATE Content
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.ContentId as contentId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Description as description,
        INSERTED.ContentType as contentType,
        INSERTED.FileUrl as fileUrl,
        INSERTED.ThumbnailUrl as thumbnailUrl,
        INSERTED.FileSize as fileSize,
        INSERTED.Duration as duration,
        INSERTED.Width as width,
        INSERTED.Height as height,
        INSERTED.MimeType as mimeType,
        INSERTED.Status as status,
        INSERTED.UploadedBy as uploadedBy,
        INSERTED.Tags as tags,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE ContentId = @contentId AND CustomerId = @customerId
    `;
        const result = await this.insert(sql, params);
        if (!result) {
            throw new errors_1.NotFoundError('Content not found');
        }
        return result;
    }
    /**
     * Delete content
     */
    async delete(contentId, customerId) {
        const sql = `
      DELETE FROM Content
      WHERE ContentId = @contentId AND CustomerId = @customerId
    `;
        const rowsAffected = await this.execute(sql, { contentId, customerId });
        if (rowsAffected === 0) {
            throw new errors_1.NotFoundError('Content not found');
        }
    }
    /**
     * Count content for a customer
     */
    async countByCustomerId(customerId) {
        const sql = `
      SELECT COUNT(*) as count
      FROM Content
      WHERE CustomerId = @customerId
    `;
        const result = await this.queryOne(sql, { customerId });
        return result?.count ?? 0;
    }
    /**
     * Get total storage used by customer (in bytes)
     */
    async getTotalStorageUsed(customerId) {
        const sql = `
      SELECT ISNULL(SUM(FileSize), 0) as totalBytes
      FROM Content
      WHERE CustomerId = @customerId AND FileSize IS NOT NULL
    `;
        const result = await this.queryOne(sql, { customerId });
        return result?.totalBytes ?? 0;
    }
}
exports.ContentRepository = ContentRepository;
//# sourceMappingURL=ContentRepository.js.map