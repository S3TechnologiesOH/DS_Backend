"use strict";
/**
 * Player Controller
 *
 * Handles HTTP requests for player management endpoints.
 * Players are individual screens/devices at sites.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const errors_1 = require("../utils/errors");
class PlayerController {
    playerService;
    constructor(playerService) {
        this.playerService = playerService;
    }
    /**
     * GET /api/v1/players
     * List all players for the authenticated user's customer
     */
    async list(req, res, next) {
        try {
            const customerId = req.user.customerId;
            const { page, limit, siteId, status, search } = req.query;
            const result = await this.playerService.list(customerId, {
                page: page,
                limit: limit,
                siteId: siteId ? parseInt(siteId, 10) : undefined,
                status: status,
                search: search,
            });
            res.status(200).json({
                status: 'success',
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/players/:playerId
     * Get player by ID
     */
    async getById(req, res, next) {
        try {
            const playerId = parseInt(req.params.playerId, 10);
            const customerId = req.user.customerId;
            if (isNaN(playerId)) {
                throw new errors_1.ValidationError('Invalid player ID');
            }
            const player = await this.playerService.getById(playerId, customerId);
            res.status(200).json({
                status: 'success',
                data: player,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/players
     * Create new player
     *
     * Expects JSON body with:
     * - siteId: number (required)
     * - name: string (required)
     * - playerCode: string (required, unique within site)
     * - macAddress?: string
     * - serialNumber?: string
     * - location?: string
     * - screenResolution?: string
     * - orientation?: 'Landscape' | 'Portrait'
     */
    async create(req, res, next) {
        try {
            const customerId = req.user.customerId;
            const { siteId, name, playerCode, macAddress, serialNumber, location, screenResolution, orientation } = req.body;
            if (!siteId || !name || !playerCode) {
                throw new errors_1.ValidationError('siteId, name, and playerCode are required');
            }
            const player = await this.playerService.create({
                siteId: parseInt(siteId, 10),
                name,
                playerCode,
                macAddress,
                serialNumber,
                location,
                screenResolution,
                orientation,
            }, customerId);
            res.status(201).json({
                status: 'success',
                data: player,
                message: 'Player created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PATCH /api/v1/players/:playerId
     * Update player metadata
     */
    async update(req, res, next) {
        try {
            const playerId = parseInt(req.params.playerId, 10);
            const customerId = req.user.customerId;
            if (isNaN(playerId)) {
                throw new errors_1.ValidationError('Invalid player ID');
            }
            const player = await this.playerService.update(playerId, customerId, req.body);
            res.status(200).json({
                status: 'success',
                data: player,
                message: 'Player updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/players/:playerId
     * Delete player
     */
    async delete(req, res, next) {
        try {
            const playerId = parseInt(req.params.playerId, 10);
            const customerId = req.user.customerId;
            if (isNaN(playerId)) {
                throw new errors_1.ValidationError('Invalid player ID');
            }
            await this.playerService.delete(playerId, customerId);
            res.status(200).json({
                status: 'success',
                message: 'Player deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/players/:playerId/heartbeat
     * Update player heartbeat
     *
     * Called by player devices to indicate they are online.
     * Expects JSON body with:
     * - status: 'Online' | 'Offline' | 'Error' (required)
     * - ipAddress?: string
     * - playerVersion?: string
     * - osVersion?: string
     */
    async heartbeat(req, res, next) {
        try {
            const playerId = parseInt(req.params.playerId, 10);
            const { status, ipAddress, playerVersion, osVersion } = req.body;
            if (isNaN(playerId)) {
                throw new errors_1.ValidationError('Invalid player ID');
            }
            if (!status) {
                throw new errors_1.ValidationError('status is required');
            }
            if (!['Online', 'Offline', 'Error'].includes(status)) {
                throw new errors_1.ValidationError('status must be Online, Offline, or Error');
            }
            await this.playerService.heartbeat({
                playerId,
                status,
                ipAddress,
                playerVersion,
                osVersion,
            });
            res.status(200).json({
                status: 'success',
                message: 'Heartbeat recorded',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/players/:playerId/activation-code
     * Generate activation code for player
     *
     * Returns a short alphanumeric code that can be used for player activation.
     */
    async generateActivationCode(req, res, next) {
        try {
            const playerId = parseInt(req.params.playerId, 10);
            const customerId = req.user.customerId;
            if (isNaN(playerId)) {
                throw new errors_1.ValidationError('Invalid player ID');
            }
            const result = await this.playerService.generateActivationCode(playerId, customerId);
            res.status(200).json({
                status: 'success',
                data: result,
                message: 'Activation code generated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlayerController = PlayerController;
//# sourceMappingURL=PlayerController.js.map