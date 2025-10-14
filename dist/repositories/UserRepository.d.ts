/**
 * User Repository
 *
 * Database operations for Users table.
 * Demonstrates how to interact with Azure SQL Database using parameterized queries.
 */
import { BaseRepository } from './BaseRepository';
import { User, CreateUserDto, UpdateUserDto } from '../models';
export declare class UserRepository extends BaseRepository {
    /**
     * Find user by ID within a customer
     * ALWAYS filter by CustomerId for multi-tenancy
     */
    findById(userId: number, customerId: number): Promise<User | null>;
    /**
     * Find user by email within a customer
     * Used for authentication
     */
    findByEmail(email: string, customerId: number): Promise<User | null>;
    /**
     * Get all users for a customer
     */
    findByCustomerId(customerId: number): Promise<User[]>;
    /**
     * Create new user
     * Returns the created user with generated ID
     */
    create(data: CreateUserDto): Promise<User>;
    /**
     * Update existing user
     */
    update(userId: number, customerId: number, data: UpdateUserDto): Promise<User>;
    /**
     * Update last login timestamp
     */
    updateLastLogin(userId: number, customerId: number): Promise<void>;
    /**
     * Delete user (soft delete by setting IsActive = false)
     */
    delete(userId: number, customerId: number): Promise<void>;
    /**
     * Check if email exists within customer
     */
    emailExists(email: string, customerId: number, excludeUserId?: number): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map