/**
 * Site Service
 *
 * Business logic for site management.
 * Handles CRUD operations for sites with proper multi-tenancy filtering.
 */

import { SiteRepository } from '../repositories/SiteRepository';
import { Site, CreateSiteDto, UpdateSiteDto } from '../models';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { parsePaginationParams } from '../utils/helpers';
import logger from '../utils/logger';

export class SiteService {
  constructor(private readonly siteRepository: SiteRepository) {}

  /**
   * Get site by ID
   */
  async getById(siteId: number, customerId: number): Promise<Site> {
    const site = await this.siteRepository.findById(siteId, customerId);

    if (!site) {
      throw new NotFoundError('Site not found');
    }

    return site;
  }

  /**
   * List all sites for a customer with filters and pagination
   */
  async list(
    customerId: number,
    filters?: {
      page?: string;
      limit?: string;
      isActive?: string;
      search?: string;
    }
  ): Promise<{ data: Site[]; total: number; page: number; limit: number }> {
    const { page, limit } = parsePaginationParams({
      page: filters?.page,
      limit: filters?.limit,
    });

    const offset = (page - 1) * limit;

    // Parse isActive filter
    let isActive: boolean | undefined;
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
  async create(data: CreateSiteDto): Promise<Site> {
    // Validate required fields
    if (!data.name || !data.siteCode) {
      throw new ValidationError('Name and site code are required');
    }

    // Check if site code already exists for this customer
    const codeExists = await this.siteRepository.siteCodeExists(
      data.siteCode,
      data.customerId
    );

    if (codeExists) {
      throw new ConflictError(
        `Site code '${data.siteCode}' already exists for this customer`
      );
    }

    const site = await this.siteRepository.create(data);

    logger.info('Site created successfully', {
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
  async update(
    siteId: number,
    customerId: number,
    data: UpdateSiteDto
  ): Promise<Site> {
    // Verify site exists
    await this.getById(siteId, customerId);

    // If updating site code, check for conflicts
    if (data.siteCode) {
      const codeExists = await this.siteRepository.siteCodeExists(
        data.siteCode,
        customerId,
        siteId
      );

      if (codeExists) {
        throw new ConflictError(
          `Site code '${data.siteCode}' already exists for this customer`
        );
      }
    }

    const updated = await this.siteRepository.update(siteId, customerId, data);

    logger.info('Site updated', {
      siteId,
      customerId,
      updatedFields: Object.keys(data),
    });

    return updated;
  }

  /**
   * Delete site
   */
  async delete(siteId: number, customerId: number): Promise<void> {
    // Verify site exists
    await this.getById(siteId, customerId);

    // Delete from database
    await this.siteRepository.delete(siteId, customerId);

    logger.info('Site deleted', { siteId, customerId });
  }
}
