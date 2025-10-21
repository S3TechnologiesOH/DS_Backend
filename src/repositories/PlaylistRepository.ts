/**
 * Playlist Repository
 *
 * Database operations for Playlists and PlaylistItems tables.
 */

import { BaseRepository } from './BaseRepository';
import {
  Playlist,
  PlaylistItem,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddPlaylistItemDto,
  UpdatePlaylistItemDto,
  PlaylistWithItems,
} from '../models';
import { NotFoundError } from '../utils/errors';

export class PlaylistRepository extends BaseRepository {
  /**
   * Find playlist by ID
   */
  async findById(playlistId: number, customerId: number): Promise<Playlist | null> {
    const sql = `
      SELECT
        PlaylistId as playlistId,
        CustomerId as customerId,
        Name as name,
        Description as description,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Playlists
      WHERE PlaylistId = @playlistId AND CustomerId = @customerId
    `;

    return this.queryOne<Playlist>(sql, { playlistId, customerId });
  }

  /**
   * Find playlist with items
   */
  async findByIdWithItems(playlistId: number, customerId: number): Promise<PlaylistWithItems | null> {
    const sql = `
      SELECT
        p.PlaylistId as playlistId,
        p.CustomerId as customerId,
        p.Name as name,
        p.Description as description,
        p.IsActive as isActive,
        p.CreatedBy as createdBy,
        p.CreatedAt as createdAt,
        p.UpdatedAt as updatedAt
      FROM Playlists p
      WHERE p.PlaylistId = @playlistId AND p.CustomerId = @customerId;

      SELECT
        pi.PlaylistItemId as playlistItemId,
        pi.PlaylistId as playlistId,
        pi.ContentId as contentId,
        pi.DisplayOrder as displayOrder,
        pi.Duration as duration,
        pi.TransitionType as transitionType,
        pi.TransitionDuration as transitionDuration,
        pi.CreatedAt as createdAt,
        c.Name as contentName,
        c.ContentType as contentType,
        c.Url as contentUrl
      FROM PlaylistItems pi
      INNER JOIN Content c ON pi.ContentId = c.ContentId
      WHERE pi.PlaylistId = @playlistId
      ORDER BY pi.DisplayOrder ASC;
    `;

    const result = await this.queryMultipleResultSets<[Playlist, PlaylistItem & { contentName: string; contentType: string; contentUrl: string }]>(
      sql,
      { playlistId, customerId }
    );

    if (result.recordsets[0].length === 0) {
      return null;
    }

    const playlist = result.recordsets[0][0] as Playlist;
    const itemsData = result.recordsets[1] as Array<PlaylistItem & { contentName: string; contentType: string; contentUrl: string }>;
    const items = itemsData.map(item => ({
      playlistItemId: item.playlistItemId,
      playlistId: item.playlistId,
      contentId: item.contentId,
      displayOrder: item.displayOrder,
      duration: item.duration,
      transitionType: item.transitionType,
      transitionDuration: item.transitionDuration,
      createdAt: item.createdAt,
      content: {
        name: item.contentName,
        contentType: item.contentType,
        url: item.contentUrl,
      },
    }));

    return {
      ...playlist,
      items,
    } as PlaylistWithItems;
  }

  /**
   * Get all playlists for a customer
   */
  async findByCustomerId(
    customerId: number,
    options?: {
      isActive?: boolean;
      search?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Playlist[]> {
    let sql = `
      SELECT
        PlaylistId as playlistId,
        CustomerId as customerId,
        Name as name,
        Description as description,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Playlists
      WHERE CustomerId = @customerId
    `;

    const params: Record<string, unknown> = { customerId };

    if (options?.isActive !== undefined) {
      sql += ' AND IsActive = @isActive';
      params.isActive = options.isActive;
    }

    if (options?.search) {
      sql += ' AND (Name LIKE @search OR Description LIKE @search)';
      params.search = `%${options.search}%`;
    }

    sql += ' ORDER BY Name ASC';

    if (options?.limit) {
      sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = options.offset || 0;
      params.limit = options.limit;
    }

    return this.queryMany<Playlist>(sql, params);
  }

  /**
   * Get all items for a playlist
   */
  async findItemsByPlaylistId(playlistId: number, customerId: number): Promise<Array<PlaylistItem & { content: { name: string; contentType: string; url: string } }>> {
    const sql = `
      SELECT
        pi.PlaylistItemId as playlistItemId,
        pi.PlaylistId as playlistId,
        pi.ContentId as contentId,
        pi.DisplayOrder as displayOrder,
        pi.Duration as duration,
        pi.TransitionType as transitionType,
        pi.TransitionDuration as transitionDuration,
        pi.CreatedAt as createdAt,
        c.Name as contentName,
        c.ContentType as contentType,
        c.Url as contentUrl
      FROM PlaylistItems pi
      INNER JOIN Content c ON pi.ContentId = c.ContentId
      INNER JOIN Playlists p ON pi.PlaylistId = p.PlaylistId
      WHERE pi.PlaylistId = @playlistId AND p.CustomerId = @customerId
      ORDER BY pi.DisplayOrder ASC
    `;

    const itemsData = await this.queryMany<PlaylistItem & { contentName: string; contentType: string; contentUrl: string }>(sql, { playlistId, customerId });

    return itemsData.map(item => ({
      playlistItemId: item.playlistItemId,
      playlistId: item.playlistId,
      contentId: item.contentId,
      displayOrder: item.displayOrder,
      duration: item.duration,
      transitionType: item.transitionType,
      transitionDuration: item.transitionDuration,
      createdAt: item.createdAt,
      content: {
        name: item.contentName,
        contentType: item.contentType,
        url: item.contentUrl,
      },
    }));
  }

  /**
   * Create new playlist
   */
  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const sql = `
      INSERT INTO Playlists (CustomerId, Name, Description, CreatedBy)
      OUTPUT
        INSERTED.PlaylistId as playlistId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Description as description,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (@customerId, @name, @description, @createdBy)
    `;

    return this.insert<Playlist>(sql, {
      customerId: data.customerId,
      name: data.name,
      description: data.description || null,
      createdBy: data.createdBy,
    });
  }

  /**
   * Update playlist
   */
  async update(playlistId: number, customerId: number, data: UpdatePlaylistDto): Promise<Playlist> {
    const updates: string[] = [];
    const params: Record<string, unknown> = { playlistId, customerId };

    if (data.name !== undefined) {
      updates.push('Name = @name');
      params.name = data.name;
    }
    if (data.description !== undefined) {
      updates.push('Description = @description');
      params.description = data.description;
    }
    if (data.isActive !== undefined) {
      updates.push('IsActive = @isActive');
      params.isActive = data.isActive;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('UpdatedAt = GETUTCDATE()');

    const sql = `
      UPDATE Playlists
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.PlaylistId as playlistId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Description as description,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE PlaylistId = @playlistId AND CustomerId = @customerId
    `;

    const result = await this.insert<Playlist>(sql, params);

    if (!result) {
      throw new NotFoundError('Playlist not found');
    }

    return result;
  }

  /**
   * Delete playlist
   */
  async delete(playlistId: number, customerId: number): Promise<void> {
    const sql = `
      DELETE FROM Playlists
      WHERE PlaylistId = @playlistId AND CustomerId = @customerId
    `;

    const rowsAffected = await this.execute(sql, { playlistId, customerId });

    if (rowsAffected === 0) {
      throw new NotFoundError('Playlist not found');
    }
  }

  /**
   * Add item to playlist
   */
  async addItem(data: AddPlaylistItemDto): Promise<PlaylistItem> {
    const sql = `
      INSERT INTO PlaylistItems (
        PlaylistId, ContentId, DisplayOrder, Duration, TransitionType, TransitionDuration
      )
      OUTPUT
        INSERTED.PlaylistItemId as playlistItemId,
        INSERTED.PlaylistId as playlistId,
        INSERTED.ContentId as contentId,
        INSERTED.DisplayOrder as displayOrder,
        INSERTED.Duration as duration,
        INSERTED.TransitionType as transitionType,
        INSERTED.TransitionDuration as transitionDuration,
        INSERTED.CreatedAt as createdAt
      VALUES (@playlistId, @contentId, @displayOrder, @duration, @transitionType, @transitionDuration)
    `;

    return this.insert<PlaylistItem>(sql, {
      playlistId: data.playlistId,
      contentId: data.contentId,
      displayOrder: data.displayOrder,
      duration: data.duration || null,
      transitionType: data.transitionType || 'None',
      transitionDuration: data.transitionDuration || 500,
    });
  }

  /**
   * Update playlist item
   */
  async updateItem(itemId: number, playlistId: number, data: UpdatePlaylistItemDto): Promise<PlaylistItem> {
    const updates: string[] = [];
    const params: Record<string, unknown> = { itemId, playlistId };

    if (data.displayOrder !== undefined) {
      updates.push('DisplayOrder = @displayOrder');
      params.displayOrder = data.displayOrder;
    }
    if (data.duration !== undefined) {
      updates.push('Duration = @duration');
      params.duration = data.duration;
    }
    if (data.transitionType !== undefined) {
      updates.push('TransitionType = @transitionType');
      params.transitionType = data.transitionType;
    }
    if (data.transitionDuration !== undefined) {
      updates.push('TransitionDuration = @transitionDuration');
      params.transitionDuration = data.transitionDuration;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    const sql = `
      UPDATE PlaylistItems
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.PlaylistItemId as playlistItemId,
        INSERTED.PlaylistId as playlistId,
        INSERTED.LayoutId as layoutId,
        INSERTED.DisplayOrder as displayOrder,
        INSERTED.Duration as duration,
        INSERTED.TransitionType as transitionType,
        INSERTED.TransitionDuration as transitionDuration,
        INSERTED.CreatedAt as createdAt
      WHERE PlaylistItemId = @itemId AND PlaylistId = @playlistId
    `;

    const result = await this.insert<PlaylistItem>(sql, params);

    if (!result) {
      throw new NotFoundError('Playlist item not found');
    }

    return result;
  }

  /**
   * Remove item from playlist
   */
  async removeItem(itemId: number, playlistId: number): Promise<void> {
    const sql = `
      DELETE FROM PlaylistItems
      WHERE PlaylistItemId = @itemId AND PlaylistId = @playlistId
    `;

    const rowsAffected = await this.execute(sql, { itemId, playlistId });

    if (rowsAffected === 0) {
      throw new NotFoundError('Playlist item not found');
    }
  }

  /**
   * Get all items for a playlist
   */
  async getItems(playlistId: number): Promise<PlaylistItem[]> {
    const sql = `
      SELECT
        PlaylistItemId as playlistItemId,
        PlaylistId as playlistId,
        LayoutId as layoutId,
        DisplayOrder as displayOrder,
        Duration as duration,
        TransitionType as transitionType,
        TransitionDuration as transitionDuration,
        CreatedAt as createdAt
      FROM PlaylistItems
      WHERE PlaylistId = @playlistId
      ORDER BY DisplayOrder ASC
    `;

    return this.queryMany<PlaylistItem>(sql, { playlistId });
  }
}
