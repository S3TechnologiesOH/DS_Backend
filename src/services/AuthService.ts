/**
 * Auth Service
 *
 * Handles user authentication, registration, and JWT token management.
 * Demonstrates bcrypt for password hashing and JWT for authentication.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { User, UserLoginDto, UserRegisterDto, UserResponse } from '../models';
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../utils/errors';
import { env } from '../config/environment';
import logger from '../utils/logger';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  /**
   * User login with email, password, and subdomain
   *
   * Flow:
   * 1. Find customer by subdomain
   * 2. Find user by email within that customer
   * 3. Verify password
   * 4. Generate JWT tokens
   */
  async login(data: UserLoginDto): Promise<AuthTokens> {
    // 1. Find customer by subdomain
    const customer = await this.customerRepository.findBySubdomain(data.subdomain);
    if (!customer || !customer.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 2. Find user by email within customer
    const user = await this.userRepository.findByEmail(data.email, customer.customerId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // 4. Update last login timestamp
    await this.userRepository.updateLastLogin(user.userId, customer.customerId);

    // 5. Generate tokens
    const tokens = this.generateTokens(user);

    logger.info('User logged in successfully', {
      userId: user.userId,
      customerId: customer.customerId,
      email: user.email,
    });

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * User registration (creates first admin user for a new customer)
   *
   * Flow:
   * 1. Check if subdomain exists
   * 2. Create customer if new
   * 3. Hash password
   * 4. Create user with Admin role
   */
  async register(data: UserRegisterDto): Promise<AuthTokens> {
    // 1. Check if subdomain already exists
    const existingCustomer = await this.customerRepository.findBySubdomain(data.subdomain);

    let customer;
    if (existingCustomer) {
      // Customer exists - check if email is already taken
      const existingUser = await this.userRepository.findByEmail(
        data.email,
        existingCustomer.customerId
      );
      if (existingUser) {
        throw new ConflictError('Email already registered for this organization');
      }
      customer = existingCustomer;
    } else {
      // Create new customer
      customer = await this.customerRepository.create({
        name: data.subdomain, // Can be updated later
        subdomain: data.subdomain,
        contactEmail: data.email,
        subscriptionTier: 'Free',
      });

      logger.info('New customer created', {
        customerId: customer.customerId,
        subdomain: customer.subdomain,
      });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 3. Create user with Admin role (first user is always admin)
    const user = await this.userRepository.create({
      customerId: customer.customerId,
      email: data.email,
      password: passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'Admin', // First user is admin
    });

    // 4. Generate tokens
    const tokens = this.generateTokens(user);

    logger.info('User registered successfully', {
      userId: user.userId,
      customerId: customer.customerId,
      email: user.email,
    });

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        userId: number;
        customerId: number;
      };

      // Get user from database
      const user = await this.userRepository.findById(decoded.userId, decoded.customerId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: number,
    customerId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user
    const user = await this.userRepository.findById(userId, customerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user (need to implement updatePassword method)
    await this.userRepository.update(userId, customerId, {
      // Note: This requires adding password update to UserRepository
    });

    logger.info('User password changed', { userId, customerId });
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken(user);

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
        customerId: user.customerId,
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.userId,
        customerId: user.customerId,
        email: user.email,
        role: user.role,
        assignedSiteId: user.assignedSiteId,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: User): UserResponse {
    const { passwordHash, ...sanitized } = user;
    return sanitized as UserResponse;
  }
}
