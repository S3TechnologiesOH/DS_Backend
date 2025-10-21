/**
 * Playlist Service
 *
 * Business logic for playlist management.
 * Handles validation, orchestration, and multi-tenancy filtering.
 */

import { PlaylistRepository } from '../repositories/PlaylistRepository';
import { LayoutRepository } from '../repositories/LayoutRepository';
import {
  Playlist,
  PlaylistItem,
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddPlaylistItemDto,
  UpdatePlaylistItemDto,
  PlaylistWithItems,
} from '../models';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { parsePaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

export class PlaylistService {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly layoutRepository: LayoutRepository
  ) {}

  /**
   * Get playlist by ID
   */
  async getById(playlistId: number, customerId: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(playlistId, customerId);

    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }

    return playlist;
  }

  /**
   * Get playlist with all items
   */
  async getByIdWithItems(playlistId: number, customerId: number): Promise<PlaylistWithItems> {
    const playlist = await this.playlistRepository.findByIdWithItems(playlistId, customerId);

    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }

    return playlist;
  }

  /**
   * List playlists with pagination and filters
   */
  async list(
    customerId: number,
    filters?: {
      page?: string;
      limit?: string;
      search?: string;
      isActive?: boolean;
    }
  ): Promise<{ data: Playlist[]; total: number; page: number; limit: number }> {
    const { page, limit } = parsePaginationParams({
      page: filters?.page,
      limit: filters?.limit,
    });

    const offset = (page - 1) * limit;

    // Get playlists
    const playlists = await this.playlistRepository.findByCustomerId(customerId, {
      isActive: filters?.isActive,
      search: filters?.search,
      limit,
      offset,
    });

    // Get total count for pagination
    const allPlaylists = await this.playlistRepository.findByCustomerId(customerId, {
      isActive: filters?.isActive,
      search: filters?.search,
    });
    const total = allPlaylists.length;

    logger.info(`Listed ${playlists.length} playlists for customer ${customerId}`);

    return {
      data: playlists,
      total,
      page,
      limit,
    };
  }

  /**
   * Get all items for a playlist
   */
  async getItems(playlistId: number, customerId: number): Promise<Array<PlaylistItem & { layout: { name: string; width: number; height: number } }>> {
    // Verify playlist exists and belongs to customer
    const playlist = await this.playlistRepository.findById(playlistId, customerId);
    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }

    const items = await this.playlistRepository.findItemsByPlaylistId(playlistId, customerId);

    logger.info(`Retrieved ${items.length} items for playlist ${playlistId}`);

    return items;
  }

  /**
   * Create new playlist
   */
  async create(data: CreatePlaylistDto): Promise<Playlist> {
    // Validate playlist name is not empty
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Playlist name is required');
    }

    const playlist = await this.playlistRepository.create(data);

    logger.info(`Created playlist ${playlist.playlistId} for customer ${data.customerId}`);

    return playlist;
  }

  /**
   * Update playlist
   */
  async update(playlistId: number, customerId: number, data: UpdatePlaylistDto): Promise<Playlist> {
    // Validate playlist exists
    await this.getById(playlistId, customerId);

    // Validate name if provided
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError('Playlist name cannot be empty');
    }

    const playlist = await this.playlistRepository.update(playlistId, customerId, data);

    logger.info(`Updated playlist ${playlistId}`);

    return playlist;
  }

  /**
   * Delete playlist
   */
  async delete(playlistId: number, customerId: number): Promise<void> {
    // Validate playlist exists
    await this.getById(playlistId, customerId);

    // TODO: Check if playlist is used in any schedules
    // If it is, either prevent deletion or cascade delete schedule assignments

    await this.playlistRepository.delete(playlistId, customerId);

    logger.info(`Deleted playlist ${playlistId}`);
  }

  /**
   * Add item to playlist
   */
  async addItem(data: AddPlaylistItemDto, customerId: number): Promise<PlaylistItem> {
    // Validate playlist exists and belongs to customer
    await this.getById(data.playlistId, customerId);

    // Validate layout exists and belongs to customer
    const layout = await this.layoutRepository.findById(data.layoutId, customerId);
    if (!layout) {
      throw new NotFoundError('Layout not found');
    }

    // Validate display order is non-negative
    if (data.displayOrder < 0) {
      throw new ValidationError('Display order must be non-negative');
    }

    const item = await this.playlistRepository.addItem(data);

    logger.info(`Added layout ${data.layoutId} to playlist ${data.playlistId}`);

    return item;
  }

  /**
   * Update playlist item
   */
  async updateItem(
    playlistId: number,
    itemId: number,
    customerId: number,
    data: UpdatePlaylistItemDto
  ): Promise<PlaylistItem> {
    // Validate playlist exists and belongs to customer
    await this.getById(playlistId, customerId);

    // Validate display order if provided
    if (data.displayOrder !== undefined && data.displayOrder < 0) {
      throw new ValidationError('Display order must be non-negative');
    }

    // Validate duration if provided
    if (data.duration !== undefined && data.duration <= 0) {
      throw new ValidationError('Duration must be positive');
    }

    // Validate transition duration if provided
    if (data.transitionDuration !== undefined && data.transitionDuration < 0) {
      throw new ValidationError('Transition duration must be non-negative');
    }

    const item = await this.playlistRepository.updateItem(itemId, playlistId, data);

    logger.info(`Updated playlist item ${itemId} in playlist ${playlistId}`);

    return item;
  }

  /**
   * Remove item from playlist
   */
  async removeItem(playlistId: number, itemId: number, customerId: number): Promise<void> {
    // Validate playlist exists and belongs to customer
    await this.getById(playlistId, customerId);

    await this.playlistRepository.removeItem(itemId, playlistId);

    logger.info(`Removed item ${itemId} from playlist ${playlistId}`);
  }

  /**
   * Get all items for a playlist
   */
  async getItems(playlistId: number, customerId: number): Promise<PlaylistItem[]> {
    // Validate playlist exists and belongs to customer
    await this.getById(playlistId, customerId);

    return this.playlistRepository.getItems(playlistId);
  }
}
