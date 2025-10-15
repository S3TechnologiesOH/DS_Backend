/**
 * Site Repository
 *
 * Database operations for Sites table.
 */

import { BaseRepository } from './BaseRepository';
import { Site, CreateSiteDto, UpdateSiteDto } from '../models';
import { NotFoundError } from '../utils/errors';

export class SiteRepository extends BaseRepository {
  /**
   * Find site by ID within a customer
   */
  async findById(siteId: number, customerId: number): Promise<Site | null> {
    const sql = `
      SELECT
        SiteId as siteId,
        CustomerId as customerId,
        Name as name,
        SiteCode as siteCode,
        Address as address,
        City as city,
        State as state,
        Country as country,
        PostalCode as postalCode,
        Latitude as latitude,
        Longitude as longitude,
        TimeZone as timeZone,
        IsActive as isActive,
        OpeningHours as openingHours,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Sites
      WHERE SiteId = @siteId AND CustomerId = @customerId
    `;

    return this.queryOne<Site>(sql, { siteId, customerId });
  }

  /**
   * Get all sites for a customer
   */
  async findByCustomerId(
    customerId: number,
    options?: {
      isActive?: boolean;
      search?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Site[]> {
    let sql = `
      SELECT
        SiteId as siteId,
        CustomerId as customerId,
        Name as name,
        SiteCode as siteCode,
        Address as address,
        City as city,
        State as state,
        Country as country,
        PostalCode as postalCode,
        Latitude as latitude,
        Longitude as longitude,
        TimeZone as timeZone,
        IsActive as isActive,
        OpeningHours as openingHours,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Sites
      WHERE CustomerId = @customerId
    `;

    const params: Record<string, unknown> = { customerId };

    if (options?.isActive !== undefined) {
      sql += ' AND IsActive = @isActive';
      params.isActive = options.isActive;
    }

    if (options?.search) {
      sql += ' AND (Name LIKE @search OR SiteCode LIKE @search OR City LIKE @search)';
      params.search = `%${options.search}%`;
    }

    sql += ' ORDER BY Name ASC';

    if (options?.limit) {
      sql += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = options.offset || 0;
      params.limit = options.limit;
    }

    return this.queryMany<Site>(sql, params);
  }

  /**
   * Create new site
   */
  async create(data: CreateSiteDto): Promise<Site> {
    const sql = `
      INSERT INTO Sites (
        CustomerId, Name, SiteCode, Address, City, State, Country, PostalCode,
        Latitude, Longitude, TimeZone, OpeningHours
      )
      OUTPUT
        INSERTED.SiteId as siteId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.SiteCode as siteCode,
        INSERTED.Address as address,
        INSERTED.City as city,
        INSERTED.State as state,
        INSERTED.Country as country,
        INSERTED.PostalCode as postalCode,
        INSERTED.Latitude as latitude,
        INSERTED.Longitude as longitude,
        INSERTED.TimeZone as timeZone,
        INSERTED.IsActive as isActive,
        INSERTED.OpeningHours as openingHours,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @customerId, @name, @siteCode, @address, @city, @state, @country, @postalCode,
        @latitude, @longitude, @timeZone, @openingHours
      )
    `;

    return this.insert<Site>(sql, {
      customerId: data.customerId,
      name: data.name,
      siteCode: data.siteCode,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      postalCode: data.postalCode || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      timeZone: data.timeZone || 'UTC',
      openingHours: data.openingHours || null,
    });
  }

  /**
   * Update site
   */
  async update(siteId: number, customerId: number, data: UpdateSiteDto): Promise<Site> {
    const updates: string[] = [];
    const params: Record<string, unknown> = { siteId, customerId };

    if (data.name !== undefined) {
      updates.push('Name = @name');
      params.name = data.name;
    }
    if (data.siteCode !== undefined) {
      updates.push('SiteCode = @siteCode');
      params.siteCode = data.siteCode;
    }
    if (data.address !== undefined) {
      updates.push('Address = @address');
      params.address = data.address;
    }
    if (data.city !== undefined) {
      updates.push('City = @city');
      params.city = data.city;
    }
    if (data.state !== undefined) {
      updates.push('State = @state');
      params.state = data.state;
    }
    if (data.country !== undefined) {
      updates.push('Country = @country');
      params.country = data.country;
    }
    if (data.postalCode !== undefined) {
      updates.push('PostalCode = @postalCode');
      params.postalCode = data.postalCode;
    }
    if (data.latitude !== undefined) {
      updates.push('Latitude = @latitude');
      params.latitude = data.latitude;
    }
    if (data.longitude !== undefined) {
      updates.push('Longitude = @longitude');
      params.longitude = data.longitude;
    }
    if (data.timeZone !== undefined) {
      updates.push('TimeZone = @timeZone');
      params.timeZone = data.timeZone;
    }
    if (data.isActive !== undefined) {
      updates.push('IsActive = @isActive');
      params.isActive = data.isActive;
    }
    if (data.openingHours !== undefined) {
      updates.push('OpeningHours = @openingHours');
      params.openingHours = data.openingHours;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('UpdatedAt = GETUTCDATE()');

    const sql = `
      UPDATE Sites
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.SiteId as siteId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.SiteCode as siteCode,
        INSERTED.Address as address,
        INSERTED.City as city,
        INSERTED.State as state,
        INSERTED.Country as country,
        INSERTED.PostalCode as postalCode,
        INSERTED.Latitude as latitude,
        INSERTED.Longitude as longitude,
        INSERTED.TimeZone as timeZone,
        INSERTED.IsActive as isActive,
        INSERTED.OpeningHours as openingHours,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE SiteId = @siteId AND CustomerId = @customerId
    `;

    const result = await this.insert<Site>(sql, params);

    if (!result) {
      throw new NotFoundError('Site not found');
    }

    return result;
  }

  /**
   * Delete site
   */
  async delete(siteId: number, customerId: number): Promise<void> {
    const sql = `
      DELETE FROM Sites
      WHERE SiteId = @siteId AND CustomerId = @customerId
    `;

    const rowsAffected = await this.execute(sql, { siteId, customerId });

    if (rowsAffected === 0) {
      throw new NotFoundError('Site not found');
    }
  }

  /**
   * Count sites for a customer
   */
  async countByCustomerId(customerId: number): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count
      FROM Sites
      WHERE CustomerId = @customerId
    `;

    const result = await this.queryOne<{ count: number }>(sql, { customerId });
    return result?.count ?? 0;
  }

  /**
   * Check if site code exists
   */
  async siteCodeExists(siteCode: string, customerId: number, excludeSiteId?: number): Promise<boolean> {
    let sql = `
      SELECT COUNT(*) as count
      FROM Sites
      WHERE SiteCode = @siteCode AND CustomerId = @customerId
    `;

    const params: Record<string, unknown> = { siteCode, customerId };

    if (excludeSiteId) {
      sql += ' AND SiteId != @excludeSiteId';
      params.excludeSiteId = excludeSiteId;
    }

    const result = await this.queryOne<{ count: number }>(sql, params);
    return (result?.count ?? 0) > 0;
  }
}
