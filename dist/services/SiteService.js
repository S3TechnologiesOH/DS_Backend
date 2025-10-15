"use strict";
/**
 * Site Service
 *
 * Business logic for site management.
 * Handles CRUD operations for sites with proper multi-tenancy filtering.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteService = void 0;
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
class SiteService {
    siteRepository;
    constructor(siteRepository) {
        this.siteRepository = siteRepository;
    }
    /**
     * Get site by ID
     */
    async getById(siteId, customerId) {
        const site = await this.siteRepository.findById(siteId, customerId);
        if (!site) {
            throw new errors_1.NotFoundError('Site not found');
        }
        return site;
    }
    /**
     * List all sites for a customer with filters and pagination
     */
    async list(customerId, filters) {
        const { page, limit } = (0, helpers_1.parsePaginationParams)({
            page: filters?.page,
            limit: filters?.limit,
        });
        const offset = (page - 1) * limit;
        // Parse isActive filter
        let isActive;
        if (filters?.isActive !== undefined) {
            isActive = filters.isActive === 'true' || filters.isActive === '1';
        }
        const sites = await this.siteRepository.findByCustomerId(customerId, {
            isActive,
            search: filters?.search,
            limit,
            offset,
        });
        const total = await this.siteRepository.countByCustomerId(customerId);
        return {
            data: sites,
            total,
            page,
            limit,
        };
    }
    /**
     * Create new site
     */
    async create(data) {
        // Validate required fields
        if (!data.name || !data.siteCode) {
            throw new errors_1.ValidationError('Name and site code are required');
        }
        // Check if site code already exists for this customer
        const codeExists = await this.siteRepository.siteCodeExists(data.siteCode, data.customerId);
        if (codeExists) {
            throw new errors_1.ConflictError(`Site code '${data.siteCode}' already exists for this customer`);
        }
        const site = await this.siteRepository.create(data);
        logger_1.default.info('Site created successfully', {
            siteId: site.siteId,
            customerId: data.customerId,
            name: data.name,
            siteCode: data.siteCode,
        });
        return site;
    }
    /**
     * Update site
     */
    async update(siteId, customerId, data) {
        // Verify site exists
        await this.getById(siteId, customerId);
        // If updating site code, check for conflicts
        if (data.siteCode) {
            const codeExists = await this.siteRepository.siteCodeExists(data.siteCode, customerId, siteId);
            if (codeExists) {
                throw new errors_1.ConflictError(`Site code '${data.siteCode}' already exists for this customer`);
            }
        }
        const updated = await this.siteRepository.update(siteId, customerId, data);
        logger_1.default.info('Site updated', {
            siteId,
            customerId,
            updatedFields: Object.keys(data),
        });
        return updated;
    }
    /**
     * Delete site
     */
    async delete(siteId, customerId) {
        // Verify site exists
        await this.getById(siteId, customerId);
        // Delete from database
        await this.siteRepository.delete(siteId, customerId);
        logger_1.default.info('Site deleted', { siteId, customerId });
    }
}
exports.SiteService = SiteService;
//# sourceMappingURL=SiteService.js.map