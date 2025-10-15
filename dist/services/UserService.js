"use strict";
/**
 * User Service
 *
 * Business logic for user management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../utils/errors");
class UserService {
    userRepository;
    siteRepository;
    constructor(userRepository, siteRepository) {
        this.userRepository = userRepository;
        this.siteRepository = siteRepository;
    }
    /**
     * Get user by ID
     */
    async getById(userId, customerId) {
        const user = await this.userRepository.findById(userId, customerId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Don't return password hash
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    /**
     * List all users for a customer
     */
    async list(customerId, filters) {
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
        return users.map(({ passwordHash, ...user }) => user);
    }
    /**
     * Create new user
     */
    async create(customerId, data) {
        // Check if email already exists
        const emailExists = await this.userRepository.emailExists(data.email, customerId);
        if (emailExists) {
            throw new errors_1.ValidationError('Email already in use');
        }
        // If SiteManager role, validate assignedSiteId is provided and exists
        if (data.role === 'SiteManager') {
            if (!data.assignedSiteId) {
                throw new errors_1.ValidationError('SiteManager role requires assignedSiteId');
            }
            const site = await this.siteRepository.findById(data.assignedSiteId, customerId);
            if (!site) {
                throw new errors_1.NotFoundError('Assigned site not found');
            }
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
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
        return userWithoutPassword;
    }
    /**
     * Update user
     */
    async update(userId, customerId, data, requestingUserId) {
        // Check user exists
        const existingUser = await this.userRepository.findById(userId, customerId);
        if (!existingUser) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Prevent users from modifying their own role or active status
        if (userId === requestingUserId) {
            if (data.role !== undefined || data.isActive !== undefined) {
                throw new errors_1.ForbiddenError('Cannot modify your own role or active status');
            }
        }
        // If changing email, check it's not already in use
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await this.userRepository.emailExists(data.email, customerId, userId);
            if (emailExists) {
                throw new errors_1.ValidationError('Email already in use');
            }
        }
        // If changing to SiteManager role, validate assignedSiteId
        if (data.role === 'SiteManager' && !data.assignedSiteId && !existingUser.assignedSiteId) {
            throw new errors_1.ValidationError('SiteManager role requires assignedSiteId');
        }
        // If assignedSiteId is provided, validate it exists
        if (data.assignedSiteId) {
            const site = await this.siteRepository.findById(data.assignedSiteId, customerId);
            if (!site) {
                throw new errors_1.NotFoundError('Assigned site not found');
            }
        }
        // Update user
        const user = await this.userRepository.update(userId, customerId, data);
        // Don't return password hash
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    /**
     * Delete user (soft delete)
     */
    async delete(userId, customerId, requestingUserId) {
        // Prevent users from deleting themselves
        if (userId === requestingUserId) {
            throw new errors_1.ForbiddenError('Cannot delete your own account');
        }
        // Check user exists
        const user = await this.userRepository.findById(userId, customerId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        await this.userRepository.delete(userId, customerId);
    }
    /**
     * Reset user password (admin function)
     */
    async resetPassword(userId, customerId, newPassword) {
        // Check user exists
        const user = await this.userRepository.findById(userId, customerId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Hash new password
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Update password hash in database
        await this.userRepository.updatePassword(userId, customerId, hashedPassword);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map