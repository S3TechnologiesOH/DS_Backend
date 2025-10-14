"use strict";
/**
 * User Repository
 *
 * Database operations for Users table.
 * Demonstrates how to interact with Azure SQL Database using parameterized queries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const errors_1 = require("../utils/errors");
class UserRepository extends BaseRepository_1.BaseRepository {
    /**
     * Find user by ID within a customer
     * ALWAYS filter by CustomerId for multi-tenancy
     */
    async findById(userId, customerId) {
        const sql = `
      SELECT
        UserId as userId,
        CustomerId as customerId,
        Email as email,
        PasswordHash as passwordHash,
        FirstName as firstName,
        LastName as lastName,
        Role as role,
        IsActive as isActive,
        AssignedSiteId as assignedSiteId,
        LastLoginAt as lastLoginAt,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Users
      WHERE UserId = @userId AND CustomerId = @customerId
    `;
        return this.queryOne(sql, { userId, customerId });
    }
    /**
     * Find user by email within a customer
     * Used for authentication
     */
    async findByEmail(email, customerId) {
        const sql = `
      SELECT
        UserId as userId,
        CustomerId as customerId,
        Email as email,
        PasswordHash as passwordHash,
        FirstName as firstName,
        LastName as lastName,
        Role as role,
        IsActive as isActive,
        AssignedSiteId as assignedSiteId,
        LastLoginAt as lastLoginAt,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Users
      WHERE Email = @email AND CustomerId = @customerId
    `;
        return this.queryOne(sql, { email, customerId });
    }
    /**
     * Get all users for a customer
     */
    async findByCustomerId(customerId) {
        const sql = `
      SELECT
        UserId as userId,
        CustomerId as customerId,
        Email as email,
        PasswordHash as passwordHash,
        FirstName as firstName,
        LastName as lastName,
        Role as role,
        IsActive as isActive,
        AssignedSiteId as assignedSiteId,
        LastLoginAt as lastLoginAt,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Users
      WHERE CustomerId = @customerId
      ORDER BY CreatedAt DESC
    `;
        return this.queryMany(sql, { customerId });
    }
    /**
     * Create new user
     * Returns the created user with generated ID
     */
    async create(data) {
        const sql = `
      INSERT INTO Users (
        CustomerId, Email, PasswordHash, FirstName, LastName, Role, AssignedSiteId
      )
      OUTPUT
        INSERTED.UserId as userId,
        INSERTED.CustomerId as customerId,
        INSERTED.Email as email,
        INSERTED.PasswordHash as passwordHash,
        INSERTED.FirstName as firstName,
        INSERTED.LastName as lastName,
        INSERTED.Role as role,
        INSERTED.IsActive as isActive,
        INSERTED.AssignedSiteId as assignedSiteId,
        INSERTED.LastLoginAt as lastLoginAt,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (
        @customerId, @email, @passwordHash, @firstName, @lastName, @role, @assignedSiteId
      )
    `;
        return this.insert(sql, {
            customerId: data.customerId,
            email: data.email,
            passwordHash: data.password, // Should be hashed before calling this
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            assignedSiteId: data.assignedSiteId || null,
        });
    }
    /**
     * Update existing user
     */
    async update(userId, customerId, data) {
        // Build dynamic update query based on provided fields
        const updates = [];
        const params = { userId, customerId };
        if (data.email !== undefined) {
            updates.push('Email = @email');
            params.email = data.email;
        }
        if (data.firstName !== undefined) {
            updates.push('FirstName = @firstName');
            params.firstName = data.firstName;
        }
        if (data.lastName !== undefined) {
            updates.push('LastName = @lastName');
            params.lastName = data.lastName;
        }
        if (data.role !== undefined) {
            updates.push('Role = @role');
            params.role = data.role;
        }
        if (data.isActive !== undefined) {
            updates.push('IsActive = @isActive');
            params.isActive = data.isActive;
        }
        if (data.assignedSiteId !== undefined) {
            updates.push('AssignedSiteId = @assignedSiteId');
            params.assignedSiteId = data.assignedSiteId;
        }
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        updates.push('UpdatedAt = GETUTCDATE()');
        const sql = `
      UPDATE Users
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.UserId as userId,
        INSERTED.CustomerId as customerId,
        INSERTED.Email as email,
        INSERTED.PasswordHash as passwordHash,
        INSERTED.FirstName as firstName,
        INSERTED.LastName as lastName,
        INSERTED.Role as role,
        INSERTED.IsActive as isActive,
        INSERTED.AssignedSiteId as assignedSiteId,
        INSERTED.LastLoginAt as lastLoginAt,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE UserId = @userId AND CustomerId = @customerId
    `;
        const result = await this.insert(sql, params);
        if (!result) {
            throw new errors_1.NotFoundError('User not found');
        }
        return result;
    }
    /**
     * Update last login timestamp
     */
    async updateLastLogin(userId, customerId) {
        const sql = `
      UPDATE Users
      SET LastLoginAt = GETUTCDATE()
      WHERE UserId = @userId AND CustomerId = @customerId
    `;
        await this.execute(sql, { userId, customerId });
    }
    /**
     * Delete user (soft delete by setting IsActive = false)
     */
    async delete(userId, customerId) {
        const sql = `
      UPDATE Users
      SET IsActive = 0, UpdatedAt = GETUTCDATE()
      WHERE UserId = @userId AND CustomerId = @customerId
    `;
        const rowsAffected = await this.execute(sql, { userId, customerId });
        if (rowsAffected === 0) {
            throw new errors_1.NotFoundError('User not found');
        }
    }
    /**
     * Check if email exists within customer
     */
    async emailExists(email, customerId, excludeUserId) {
        let sql = `
      SELECT COUNT(*) as count
      FROM Users
      WHERE Email = @email AND CustomerId = @customerId
    `;
        const params = { email, customerId };
        if (excludeUserId) {
            sql += ' AND UserId != @excludeUserId';
            params.excludeUserId = excludeUserId;
        }
        const result = await this.queryOne(sql, params);
        return (result?.count ?? 0) > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map