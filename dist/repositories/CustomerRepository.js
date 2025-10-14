"use strict";
/**
 * Customer Repository
 *
 * Database operations for Customers table.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const errors_1 = require("../utils/errors");
class CustomerRepository extends BaseRepository_1.BaseRepository {
    /**
     * Find customer by ID
     */
    async findById(customerId) {
        const sql = `
      SELECT
        CustomerId as customerId,
        Name as name,
        Subdomain as subdomain,
        IsActive as isActive,
        SubscriptionTier as subscriptionTier,
        MaxSites as maxSites,
        MaxPlayers as maxPlayers,
        MaxStorageGB as maxStorageGB,
        ContactEmail as contactEmail,
        ContactPhone as contactPhone,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Customers
      WHERE CustomerId = @customerId
    `;
        return this.queryOne(sql, { customerId });
    }
    /**
     * Find customer by subdomain
     * Used for authentication to identify which customer the user belongs to
     */
    async findBySubdomain(subdomain) {
        const sql = `
      SELECT
        CustomerId as customerId,
        Name as name,
        Subdomain as subdomain,
        IsActive as isActive,
        SubscriptionTier as subscriptionTier,
        MaxSites as maxSites,
        MaxPlayers as maxPlayers,
        MaxStorageGB as maxStorageGB,
        ContactEmail as contactEmail,
        ContactPhone as contactPhone,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Customers
      WHERE Subdomain = @subdomain
    `;
        return this.queryOne(sql, { subdomain: subdomain.toLowerCase() });
    }
    /**
     * Get all customers
     */
    async findAll() {
        const sql = `
      SELECT
        CustomerId as customerId,
        Name as name,
        Subdomain as subdomain,
        IsActive as isActive,
        SubscriptionTier as subscriptionTier,
        MaxSites as maxSites,
        MaxPlayers as maxPlayers,
        MaxStorageGB as maxStorageGB,
        ContactEmail as contactEmail,
        ContactPhone as contactPhone,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Customers
      ORDER BY CreatedAt DESC
    `;
        return this.queryMany(sql);
    }
    /**
     * Create new customer
     */
    async create(data) {
        const sql = `
      INSERT INTO Customers (
        Name, Subdomain, SubscriptionTier, MaxSites, MaxPlayers, MaxStorageGB, ContactEmail, ContactPhone
      )
      OUTPUT
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Subdomain as subdomain,
        INSERTED.IsActive as isActive,
        INSERTED.SubscriptionTier as subscriptionTier,
        INSERTED.MaxSites as maxSites,
        INSERTED.MaxPlayers as maxPlayers,
        INSERTED.MaxStorageGB as maxStorageGB,
        INSERTED.ContactEmail as contactEmail,
        INSERTED.ContactPhone as contactPhone,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @name, @subdomain, @subscriptionTier, @maxSites, @maxPlayers, @maxStorageGB, @contactEmail, @contactPhone
      )
    `;
        return this.insert(sql, {
            name: data.name,
            subdomain: data.subdomain.toLowerCase(),
            subscriptionTier: data.subscriptionTier || 'Free',
            maxSites: data.maxSites || 5,
            maxPlayers: data.maxPlayers || 10,
            maxStorageGB: data.maxStorageGB || 10,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone || null,
        });
    }
    /**
     * Update customer
     */
    async update(customerId, data) {
        const updates = [];
        const params = { customerId };
        if (data.name !== undefined) {
            updates.push('Name = @name');
            params.name = data.name;
        }
        if (data.subdomain !== undefined) {
            updates.push('Subdomain = @subdomain');
            params.subdomain = data.subdomain.toLowerCase();
        }
        if (data.isActive !== undefined) {
            updates.push('IsActive = @isActive');
            params.isActive = data.isActive;
        }
        if (data.subscriptionTier !== undefined) {
            updates.push('SubscriptionTier = @subscriptionTier');
            params.subscriptionTier = data.subscriptionTier;
        }
        if (data.maxSites !== undefined) {
            updates.push('MaxSites = @maxSites');
            params.maxSites = data.maxSites;
        }
        if (data.maxPlayers !== undefined) {
            updates.push('MaxPlayers = @maxPlayers');
            params.maxPlayers = data.maxPlayers;
        }
        if (data.maxStorageGB !== undefined) {
            updates.push('MaxStorageGB = @maxStorageGB');
            params.maxStorageGB = data.maxStorageGB;
        }
        if (data.contactEmail !== undefined) {
            updates.push('ContactEmail = @contactEmail');
            params.contactEmail = data.contactEmail;
        }
        if (data.contactPhone !== undefined) {
            updates.push('ContactPhone = @contactPhone');
            params.contactPhone = data.contactPhone;
        }
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        updates.push('UpdatedAt = GETUTCDATE()');
        const sql = `
      UPDATE Customers
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Subdomain as subdomain,
        INSERTED.IsActive as isActive,
        INSERTED.SubscriptionTier as subscriptionTier,
        INSERTED.MaxSites as maxSites,
        INSERTED.MaxPlayers as maxPlayers,
        INSERTED.MaxStorageGB as maxStorageGB,
        INSERTED.ContactEmail as contactEmail,
        INSERTED.ContactPhone as contactPhone,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE CustomerId = @customerId
    `;
        const result = await this.insert(sql, params);
        if (!result) {
            throw new errors_1.NotFoundError('Customer not found');
        }
        return result;
    }
    /**
     * Check if subdomain exists
     */
    async subdomainExists(subdomain, excludeCustomerId) {
        let sql = `
      SELECT COUNT(*) as count
      FROM Customers
      WHERE Subdomain = @subdomain
    `;
        const params = { subdomain: subdomain.toLowerCase() };
        if (excludeCustomerId) {
            sql += ' AND CustomerId != @excludeCustomerId';
            params.excludeCustomerId = excludeCustomerId;
        }
        const result = await this.queryOne(sql, params);
        return (result?.count ?? 0) > 0;
    }
}
exports.CustomerRepository = CustomerRepository;
//# sourceMappingURL=CustomerRepository.js.map