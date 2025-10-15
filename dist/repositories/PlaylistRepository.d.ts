/**
 * Playlist Repository
 *
 * Database operations for Playlists and PlaylistItems tables.
 */
import { BaseRepository } from './BaseRepository';
import { Playlist, PlaylistItem, CreatePlaylistDto, UpdatePlaylistDto, AddPlaylistItemDto, UpdatePlaylistItemDto, PlaylistWithItems } from '../models';
export declare class PlaylistRepository extends BaseRepository {
    /**
     * Find playlist by ID
     */
    findById(playlistId: number, customerId: number): Promise<Playlist | null>;
    /**
     * Find playlist with items
     */
    findByIdWithItems(playlistId: number, customerId: number): Promise<PlaylistWithItems | null>;
    /**
     * Get all playlists for a customer
     */
    findByCustomerId(customerId: number, options?: {
        isActive?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Playlist[]>;
    /**
     * Create new playlist
     */
    create(data: CreatePlaylistDto): Promise<Playlist>;
    /**
     * Update playlist
     */
    update(playlistId: number, customerId: number, data: UpdatePlaylistDto): Promise<Playlist>;
    /**
     * Delete playlist
     */
    delete(playlistId: number, customerId: number): Promise<void>;
    /**
     * Add item to playlist
     */
    addItem(data: AddPlaylistItemDto): Promise<PlaylistItem>;
    /**
     * Update playlist item
     */
    updateItem(itemId: number, playlistId: number, data: UpdatePlaylistItemDto): Promise<PlaylistItem>;
    /**
     * Remove item from playlist
     */
    removeItem(itemId: number, playlistId: number): Promise<void>;
    /**
     * Get all items for a playlist
     */
    getItems(playlistId: number): Promise<PlaylistItem[]>;
}
//# sourceMappingURL=PlaylistRepository.d.ts.map