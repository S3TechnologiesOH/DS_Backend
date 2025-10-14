"use strict";
/**
 * Auth Service
 *
 * Handles user authentication, registration, and JWT token management.
 * Demonstrates bcrypt for password hashing and JWT for authentication.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const environment_1 = require("../config/environment");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthService {
    userRepository;
    customerRepository;
    constructor(userRepository, customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }
    /**
     * User login with email, password, and subdomain
     *
     * Flow:
     * 1. Find customer by subdomain
     * 2. Find user by email within that customer
     * 3. Verify password
     * 4. Generate JWT tokens
     */
    async login(data) {
        // 1. Find customer by subdomain
        const customer = await this.customerRepository.findBySubdomain(data.subdomain);
        if (!customer || !customer.isActive) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // 2. Find user by email within customer
        const user = await this.userRepository.findByEmail(data.email, customer.customerId);
        if (!user || !user.isActive) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // 3. Verify password
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // 4. Update last login timestamp
        await this.userRepository.updateLastLogin(user.userId, customer.customerId);
        // 5. Generate tokens
        const tokens = this.generateTokens(user);
        logger_1.default.info('User logged in successfully', {
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
    async register(data) {
        // 1. Check if subdomain already exists
        const existingCustomer = await this.customerRepository.findBySubdomain(data.subdomain);
        let customer;
        if (existingCustomer) {
            // Customer exists - check if email is already taken
            const existingUser = await this.userRepository.findByEmail(data.email, existingCustomer.customerId);
            if (existingUser) {
                throw new errors_1.ConflictError('Email already registered for this organization');
            }
            customer = existingCustomer;
        }
        else {
            // Create new customer
            customer = await this.customerRepository.create({
                name: data.subdomain, // Can be updated later
                subdomain: data.subdomain,
                contactEmail: data.email,
                subscriptionTier: 'Free',
            });
            logger_1.default.info('New customer created', {
                customerId: customer.customerId,
                subdomain: customer.subdomain,
            });
        }
        // 2. Hash password
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
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
        logger_1.default.info('User registered successfully', {
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
    async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jsonwebtoken_1.default.verify(refreshToken, environment_1.env.JWT_REFRESH_SECRET);
            // Get user from database
            const user = await this.userRepository.findById(decoded.userId, decoded.customerId);
            if (!user || !user.isActive) {
                throw new errors_1.UnauthorizedError('Invalid refresh token');
            }
            // Generate new access token
            const accessToken = this.generateAccessToken(user);
            return { accessToken };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.UnauthorizedError('Refresh token expired');
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError('Invalid refresh token');
            }
            throw error;
        }
    }
    /**
     * Change user password
     */
    async changePassword(userId, customerId, currentPassword, newPassword) {
        // Get user
        const user = await this.userRepository.findById(userId, customerId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Verify current password
        const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new errors_1.ValidationError('Current password is incorrect');
        }
        // Hash new password
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        // Update user (need to implement updatePassword method)
        await this.userRepository.update(userId, customerId, {
        // Note: This requires adding password update to UserRepository
        });
        logger_1.default.info('User password changed', { userId, customerId });
    }
    /**
     * Generate JWT access and refresh tokens
     */
    generateTokens(user) {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: user.userId,
            customerId: user.customerId,
        }, environment_1.env.JWT_REFRESH_SECRET, { expiresIn: environment_1.env.JWT_REFRESH_EXPIRES_IN });
        return { accessToken, refreshToken };
    }
    /**
     * Generate JWT access token
     */
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({
            userId: user.userId,
            customerId: user.customerId,
            email: user.email,
            role: user.role,
            assignedSiteId: user.assignedSiteId,
        }, environment_1.env.JWT_SECRET, { expiresIn: environment_1.env.JWT_EXPIRES_IN });
    }
    /**
     * Remove sensitive data from user object
     */
    sanitizeUser(user) {
        const { passwordHash, ...sanitized } = user;
        return sanitized;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map