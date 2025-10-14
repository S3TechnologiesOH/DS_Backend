/**
 * User Repository
 *
 * Database operations for Users table.
 * Demonstrates how to interact with Azure SQL Database using parameterized queries.
 */

import { BaseRepository } from './BaseRepository';
import { User, CreateUserDto, UpdateUserDto } from '../models';
import { NotFoundError } from '../utils/errors';

export class UserRepository extends BaseRepository {
  /**
   * Find user by ID within a customer
   * ALWAYS filter by CustomerId for multi-tenancy
   */
  async findById(userId: number, customerId: number): Promise<User | null> {
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

    return this.queryOne<User>(sql, { userId, customerId });
  }

  /**
   * Find user by email within a customer
   * Used for authentication
   */
  async findByEmail(email: string, customerId: number): Promise<User | null> {
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

    return this.queryOne<User>(sql, { email, customerId });
  }

  /**
   * Get all users for a customer
   */
  async findByCustomerId(customerId: number): Promise<User[]> {
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

    return this.queryMany<User>(sql, { customerId });
  }

  /**
   * Create new user
   * Returns the created user with generated ID
   */
  async create(data: CreateUserDto): Promise<User> {
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

    return this.insert<User>(sql, {
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
  async update(userId: number, customerId: number, data: UpdateUserDto): Promise<User> {
    // Build dynamic update query based on provided fields
    const updates: string[] = [];
    const params: Record<string, unknown> = { userId, customerId };

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

    const result = await this.insert<User>(sql, params);

    if (!result) {
      throw new NotFoundError('User not found');
    }

    return result;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: number, customerId: number): Promise<void> {
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
  async delete(userId: number, customerId: number): Promise<void> {
    const sql = `
      UPDATE Users
      SET IsActive = 0, UpdatedAt = GETUTCDATE()
      WHERE UserId = @userId AND CustomerId = @customerId
    `;

    const rowsAffected = await this.execute(sql, { userId, customerId });

    if (rowsAffected === 0) {
      throw new NotFoundError('User not found');
    }
  }

  /**
   * Check if email exists within customer
   */
  async emailExists(email: string, customerId: number, excludeUserId?: number): Promise<boolean> {
    let sql = `
      SELECT COUNT(*) as count
      FROM Users
      WHERE Email = @email AND CustomerId = @customerId
    `;

    const params: Record<string, unknown> = { email, customerId };

    if (excludeUserId) {
      sql += ' AND UserId != @excludeUserId';
      params.excludeUserId = excludeUserId;
    }

    const result = await this.queryOne<{ count: number }>(sql, params);
    return (result?.count ?? 0) > 0;
  }
}
