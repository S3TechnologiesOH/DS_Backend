/**
 * Auth Service
 *
 * Handles user authentication, registration, and JWT token management.
 * Demonstrates bcrypt for password hashing and JWT for authentication.
 */
import { UserRepository } from '../repositories/UserRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { UserLoginDto, UserRegisterDto, UserResponse } from '../models';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly customerRepository;
    constructor(userRepository: UserRepository, customerRepository: CustomerRepository);
    /**
     * User login with email and password (subdomain optional, extracted from email domain if not provided)
     *
     * Flow:
     * 1. Extract subdomain from email domain or use provided subdomain
     * 2. Find customer by subdomain
     * 3. Find user by email within that customer
     * 4. Verify password
     * 5. Generate JWT tokens
     */
    login(data: UserLoginDto): Promise<AuthTokens>;
    /**
     * User registration (creates first admin user for a new customer)
     *
     * Flow:
     * 1. Check if subdomain exists
     * 2. Create customer if new
     * 3. Hash password
     * 4. Create user with Admin role
     */
    register(data: UserRegisterDto): Promise<AuthTokens>;
    /**
     * Refresh access token using refresh token
     */
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    /**
     * Change user password
     */
    changePassword(userId: number, customerId: number, currentPassword: string, newPassword: string): Promise<void>;
    /**
     * Generate JWT access and refresh tokens
     */
    private generateTokens;
    /**
     * Generate JWT access token
     */
    private generateAccessToken;
    /**
     * Remove sensitive data from user object
     */
    private sanitizeUser;
}
//# sourceMappingURL=AuthService.d.ts.map