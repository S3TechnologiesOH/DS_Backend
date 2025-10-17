/**
 * User Model
 *
 * CMS user accounts with customer-level access and roles.
 */
export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'SiteManager';
export interface User {
    userId: number;
    customerId: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    assignedSiteId: number | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserDto {
    customerId: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    assignedSiteId?: number;
}
export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    isActive?: boolean;
    assignedSiteId?: number;
}
export interface UserLoginDto {
    email: string;
    password: string;
    subdomain?: string;
}
export interface UserRegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    subdomain: string;
}
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export interface UserResponse {
    userId: number;
    customerId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    assignedSiteId: number | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=User.d.ts.map