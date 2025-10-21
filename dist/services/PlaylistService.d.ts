/**
 * Playlist Service
 *
 * Business logic for playlist management.
 * Handles validation, orchestration, and multi-tenancy filtering.
 */
import { PlaylistRepository } from '../repositories/PlaylistRepository';
import { LayoutRepository } from '../repositories/LayoutRepository';
import { Playlist, PlaylistItem, CreatePlaylistDto, UpdatePlaylistDto, AddPlaylistItemDto, UpdatePlaylistItemDto, PlaylistWithItems } from '../models';
export declare class PlaylistService {
    private readonly playlistRepository;
    private readonly layoutRepository;
    constructor(playlistRepository: PlaylistRepository, layoutRepository: LayoutRepository);
    /**
     * Get playlist by ID
     */
    getById(playlistId: number, customerId: number): Promise<Playlist>;
    /**
     * Get playlist with all items
     */
    getByIdWithItems(playlistId: number, customerId: number): Promise<PlaylistWithItems>;
    /**
     * List playlists with pagination and filters
     */
    list(customerId: number, filters?: {
        page?: string;
        limit?: string;
        search?: string;
        isActive?: boolean;
    }): Promise<{
        data: Playlist[];
        total: number;
        page: number;
        limit: number;
    }>;
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
    addItem(data: AddPlaylistItemDto, customerId: number): Promise<PlaylistItem>;
    /**
     * Update playlist item
     */
    updateItem(playlistId: number, itemId: number, customerId: number, data: UpdatePlaylistItemDto): Promise<PlaylistItem>;
    /**
     * Remove item from playlist
     */
    removeItem(playlistId: number, itemId: number, customerId: number): Promise<void>;
    /**
     * Get all items for a playlist
     */
    getItems(playlistId: number, customerId: number): Promise<PlaylistItem[]>;
}
//# sourceMappingURL=PlaylistService.d.ts.map