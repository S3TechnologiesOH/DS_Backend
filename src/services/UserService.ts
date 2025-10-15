/**
 * User Service
 *
 * Business logic for user management
 */

import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { SiteRepository } from '../repositories/SiteRepository';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../models';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly siteRepository: SiteRepository,
  ) {}

  /**
   * Get user by ID
   */
  async getById(userId: number, customerId: number): Promise<User> {
    const user = await this.userRepository.findById(userId, customerId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * List all users for a customer
   */
  async list(
    customerId: number,
    filters?: {
      role?: UserRole;
      isActive?: boolean;
      assignedSiteId?: number;
    },
  ): Promise<User[]> {
    let users = await this.userRepository.findByCustomerId(customerId);

    // Apply filters
    if (filters?.role) {
      users = users.filter((user) => user.role === filters.role);
    }

    if (filters?.isActive !== undefined) {
      users = users.filter((user) => user.isActive === filters.isActive);
    }

    if (filters?.assignedSiteId) {
      users = users.filter((user) => user.assignedSiteId === filters.assignedSiteId);
    }

    // Remove password hashes
    return users.map(({ passwordHash, ...user }) => user as User);
  }

  /**
   * Create new user
   */
  async create(customerId: number, data: Omit<CreateUserDto, 'customerId'>): Promise<User> {
    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(data.email, customerId);
    if (emailExists) {
      throw new ValidationError('Email already in use');
    }

    // If SiteManager role, validate assignedSiteId is provided and exists
    if (data.role === 'SiteManager') {
      if (!data.assignedSiteId) {
        throw new ValidationError('SiteManager role requires assignedSiteId');
      }

      const site = await this.siteRepository.findById(data.assignedSiteId, customerId);
      if (!site) {
        throw new NotFoundError('Assigned site not found');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      customerId,
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      assignedSiteId: data.assignedSiteId,
    });

    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Update user
   */
  async update(
    userId: number,
    customerId: number,
    data: UpdateUserDto,
    requestingUserId: number,
  ): Promise<User> {
    // Check user exists
    const existingUser = await this.userRepository.findById(userId, customerId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Prevent users from modifying their own role or active status
    if (userId === requestingUserId) {
      if (data.role !== undefined || data.isActive !== undefined) {
        throw new ForbiddenError('Cannot modify your own role or active status');
      }
    }

    // If changing email, check it's not already in use
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.userRepository.emailExists(data.email, customerId, userId);
      if (emailExists) {
        throw new ValidationError('Email already in use');
      }
    }

    // If changing to SiteManager role, validate assignedSiteId
    if (data.role === 'SiteManager' && !data.assignedSiteId && !existingUser.assignedSiteId) {
      throw new ValidationError('SiteManager role requires assignedSiteId');
    }

    // If assignedSiteId is provided, validate it exists
    if (data.assignedSiteId) {
      const site = await this.siteRepository.findById(data.assignedSiteId, customerId);
      if (!site) {
        throw new NotFoundError('Assigned site not found');
      }
    }

    // Update user
    const user = await this.userRepository.update(userId, customerId, data);

    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Delete user (soft delete)
   */
  async delete(userId: number, customerId: number, requestingUserId: number): Promise<void> {
    // Prevent users from deleting themselves
    if (userId === requestingUserId) {
      throw new ForbiddenError('Cannot delete your own account');
    }

    // Check user exists
    const user = await this.userRepository.findById(userId, customerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.delete(userId, customerId);
  }

  /**
   * Reset user password (admin function)
   */
  async resetPassword(userId: number, customerId: number, newPassword: string): Promise<void> {
    // Check user exists
    const user = await this.userRepository.findById(userId, customerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password hash in database
    await this.userRepository.updatePassword(userId, customerId, hashedPassword);
  }
}
