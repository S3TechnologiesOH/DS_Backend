"use strict";
/**
 * Playlist Service
 *
 * Business logic for playlist management.
 * Handles validation, orchestration, and multi-tenancy filtering.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = void 0;
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
class PlaylistService {
    playlistRepository;
    contentRepository;
    storageService;
    constructor(playlistRepository, contentRepository, storageService) {
        this.playlistRepository = playlistRepository;
        this.contentRepository = contentRepository;
        this.storageService = storageService;
    }
    /**
     * Get playlist by ID
     */
    async getById(playlistId, customerId) {
        const playlist = await this.playlistRepository.findById(playlistId, customerId);
        if (!playlist) {
            throw new errors_1.NotFoundError('Playlist not found');
        }
        return playlist;
    }
    /**
     * Get playlist with all items
     */
    async getByIdWithItems(playlistId, customerId) {
        const playlist = await this.playlistRepository.findByIdWithItems(playlistId, customerId);
        if (!playlist) {
            throw new errors_1.NotFoundError('Playlist not found');
        }
        return playlist;
    }
    /**
     * List playlists with pagination and filters
     */
    async list(customerId, filters) {
        const { page, limit } = (0, helpers_1.parsePaginationParams)({
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
        logger_1.default.info(`Listed ${playlists.length} playlists for customer ${customerId}`);
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
    async getItems(playlistId, customerId) {
        // Verify playlist exists and belongs to customer
        const playlist = await this.playlistRepository.findById(playlistId, customerId);
        if (!playlist) {
            throw new errors_1.NotFoundError('Playlist not found');
        }
        const items = await this.playlistRepository.findItemsByPlaylistId(playlistId, customerId);
        // Refresh SAS URLs for all content items
        const itemsWithFreshUrls = await Promise.all(items.map(async (item) => {
            try {
                if (item.content.url) {
                    const blobName = this.storageService.extractBlobName(item.content.url);
                    item.content.url = await this.storageService.getFileUrl(blobName, 60);
                }
            }
            catch (error) {
                logger_1.default.warn('Failed to refresh SAS URL for playlist item', { playlistItemId: item.playlistItemId, error });
            }
            return item;
        }));
        logger_1.default.info(`Retrieved ${itemsWithFreshUrls.length} items for playlist ${playlistId}`);
        return itemsWithFreshUrls;
    }
    /**
     * Create new playlist
     */
    async create(data) {
        // Validate playlist name is not empty
        if (!data.name || data.name.trim().length === 0) {
            throw new errors_1.ValidationError('Playlist name is required');
        }
        const playlist = await this.playlistRepository.create(data);
        logger_1.default.info(`Created playlist ${playlist.playlistId} for customer ${data.customerId}`);
        return playlist;
    }
    /**
     * Update playlist
     */
    async update(playlistId, customerId, data) {
        // Validate playlist exists
        await this.getById(playlistId, customerId);
        // Validate name if provided
        if (data.name !== undefined && data.name.trim().length === 0) {
            throw new errors_1.ValidationError('Playlist name cannot be empty');
        }
        const playlist = await this.playlistRepository.update(playlistId, customerId, data);
        logger_1.default.info(`Updated playlist ${playlistId}`);
        return playlist;
    }
    /**
     * Delete playlist
     */
    async delete(playlistId, customerId) {
        // Validate playlist exists
        await this.getById(playlistId, customerId);
        // TODO: Check if playlist is used in any schedules
        // If it is, either prevent deletion or cascade delete schedule assignments
        await this.playlistRepository.delete(playlistId, customerId);
        logger_1.default.info(`Deleted playlist ${playlistId}`);
    }
    /**
     * Add item to playlist
     */
    async addItem(data, customerId) {
        // Validate playlist exists and belongs to customer
        await this.getById(data.playlistId, customerId);
        // Validate content exists and belongs to customer
        const content = await this.contentRepository.findById(data.contentId, customerId);
        if (!content) {
            throw new errors_1.NotFoundError('Content not found');
        }
        // Validate display order is non-negative
        if (data.displayOrder < 0) {
            throw new errors_1.ValidationError('Display order must be non-negative');
        }
        const item = await this.playlistRepository.addItem(data);
        logger_1.default.info(`Added content ${data.contentId} to playlist ${data.playlistId}`);
        return item;
    }
    /**
     * Update playlist item
     */
    async updateItem(playlistId, itemId, customerId, data) {
        // Validate playlist exists and belongs to customer
        await this.getById(playlistId, customerId);
        // Validate display order if provided
        if (data.displayOrder !== undefined && data.displayOrder < 0) {
            throw new errors_1.ValidationError('Display order must be non-negative');
        }
        // Validate duration if provided
        if (data.duration !== undefined && data.duration <= 0) {
            throw new errors_1.ValidationError('Duration must be positive');
        }
        // Validate transition duration if provided
        if (data.transitionDuration !== undefined && data.transitionDuration < 0) {
            throw new errors_1.ValidationError('Transition duration must be non-negative');
        }
        const item = await this.playlistRepository.updateItem(itemId, playlistId, data);
        logger_1.default.info(`Updated playlist item ${itemId} in playlist ${playlistId}`);
        return item;
    }
    /**
     * Remove item from playlist
     */
    async removeItem(playlistId, itemId, customerId) {
        // Validate playlist exists and belongs to customer
        await this.getById(playlistId, customerId);
        await this.playlistRepository.removeItem(itemId, playlistId);
        logger_1.default.info(`Removed item ${itemId} from playlist ${playlistId}`);
    }
}
exports.PlaylistService = PlaylistService;
//# sourceMappingURL=PlaylistService.js.map