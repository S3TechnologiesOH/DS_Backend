"use strict";
/**
 * Player Service
 *
 * Business logic for player management including activation code generation,
 * heartbeat updates, and player lifecycle management.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
class PlayerService {
    playerRepository;
    siteRepository;
    constructor(playerRepository, siteRepository) {
        this.playerRepository = playerRepository;
        this.siteRepository = siteRepository;
    }
    /**
     * Get player by ID
     */
    async getById(playerId, customerId) {
        const player = await this.playerRepository.findById(playerId, customerId);
        if (!player) {
            throw new errors_1.NotFoundError('Player not found');
        }
        return player;
    }
    /**
     * List all players for a customer with filters and pagination
     */
    async list(customerId, filters) {
        const { page, limit } = (0, helpers_1.parsePaginationParams)({
            page: filters?.page,
            limit: filters?.limit,
        });
        const offset = (page - 1) * limit;
        const players = await this.playerRepository.findByCustomerId(customerId, {
            siteId: filters?.siteId,
            status: filters?.status,
            search: filters?.search,
            limit,
            offset,
        });
        const total = await this.playerRepository.countByCustomerId(customerId);
        return {
            data: players,
            total,
            page,
            limit,
        };
    }
    /**
     * Create new player
     *
     * Business rules:
     * 1. Verify site belongs to the customer
     * 2. Check player code is unique within the site
     * 3. Create player record
     */
    async create(data, customerId) {
        // 1. Verify site exists and belongs to customer
        const site = await this.siteRepository.findById(data.siteId, customerId);
        if (!site) {
            throw new errors_1.ForbiddenError('Site not found or does not belong to your organization');
        }
        // 2. Check player code uniqueness within site
        const codeExists = await this.playerRepository.playerCodeExists(data.playerCode, data.siteId);
        if (codeExists) {
            throw new errors_1.ValidationError(`Player code '${data.playerCode}' already exists for this site`);
        }
        // 3. Create player
        const player = await this.playerRepository.create(data);
        logger_1.default.info('Player created successfully', {
            playerId: player.playerId,
            customerId,
            siteId: data.siteId,
            playerCode: data.playerCode,
        });
        return player;
    }
    /**
     * Update player
     *
     * Business rules:
     * 1. Verify player exists and belongs to customer
     * 2. If updating player code, check uniqueness within site
     * 3. Update player record
     */
    async update(playerId, customerId, data) {
        // 1. Verify player exists
        const existingPlayer = await this.getById(playerId, customerId);
        // 2. If updating player code, check uniqueness
        if (data.playerCode && data.playerCode !== existingPlayer.playerCode) {
            const codeExists = await this.playerRepository.playerCodeExists(data.playerCode, existingPlayer.siteId, playerId);
            if (codeExists) {
                throw new errors_1.ValidationError(`Player code '${data.playerCode}' already exists for this site`);
            }
        }
        // 3. Update player
        const updated = await this.playerRepository.update(playerId, customerId, data);
        logger_1.default.info('Player updated', {
            playerId,
            customerId,
            updatedFields: Object.keys(data),
        });
        return updated;
    }
    /**
     * Delete player
     */
    async delete(playerId, customerId) {
        // Verify player exists
        await this.getById(playerId, customerId);
        // Delete player
        await this.playerRepository.delete(playerId, customerId);
        logger_1.default.info('Player deleted', { playerId, customerId });
    }
    /**
     * Update player heartbeat
     *
     * Called by player devices to indicate they are online and send status updates.
     * This endpoint does not require customerId validation as it's called by the player itself.
     */
    async heartbeat(data) {
        await this.playerRepository.updateHeartbeat(data.playerId, {
            status: data.status,
            ipAddress: data.ipAddress,
            playerVersion: data.playerVersion,
            osVersion: data.osVersion,
        });
        logger_1.default.debug('Player heartbeat recorded', {
            playerId: data.playerId,
            status: data.status,
        });
    }
    /**
     * Generate activation code for player
     *
     * Used for player activation/pairing flow.
     * Returns a short code that can be displayed on the player screen
     * for manual entry in the CMS.
     */
    async generateActivationCode(playerId, customerId) {
        // Verify player exists and belongs to customer
        await this.getById(playerId, customerId);
        // Generate new activation code
        const activationCode = await this.playerRepository.generateActivationCode(playerId, customerId);
        logger_1.default.info('Activation code generated', {
            playerId,
            customerId,
        });
        return { activationCode };
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=PlayerService.js.map