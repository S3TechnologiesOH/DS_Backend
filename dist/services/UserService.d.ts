/**
 * User Service
 *
 * Business logic for user management
 */
import { UserRepository } from '../repositories/UserRepository';
import { SiteRepository } from '../repositories/SiteRepository';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../models';
export declare class UserService {
    private readonly userRepository;
    private readonly siteRepository;
    constructor(userRepository: UserRepository, siteRepository: SiteRepository);
    /**
     * Get user by ID
     */
    getById(userId: number, customerId: number): Promise<User>;
    /**
     * List all users for a customer
     */
    list(customerId: number, filters?: {
        role?: UserRole;
        isActive?: boolean;
        assignedSiteId?: number;
    }): Promise<User[]>;
    /**
     * Create new user
     */
    create(customerId: number, data: Omit<CreateUserDto, 'customerId'>): Promise<User>;
    /**
     * Update user
     */
    update(userId: number, customerId: number, data: UpdateUserDto, requestingUserId: number): Promise<User>;
    /**
     * Delete user (soft delete)
     */
    delete(userId: number, customerId: number, requestingUserId: number): Promise<void>;
    /**
     * Reset user password (admin function)
     */
    resetPassword(userId: number, customerId: number, newPassword: string): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map