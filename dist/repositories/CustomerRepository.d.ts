/**
 * Customer Repository
 *
 * Database operations for Customers table.
 */
import { BaseRepository } from './BaseRepository';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models';
export declare class CustomerRepository extends BaseRepository {
    /**
     * Find customer by ID
     */
    findById(customerId: number): Promise<Customer | null>;
    /**
     * Find customer by subdomain
     * Used for authentication to identify which customer the user belongs to
     */
    findBySubdomain(subdomain: string): Promise<Customer | null>;
    /**
     * Get all customers
     */
    findAll(): Promise<Customer[]>;
    /**
     * Create new customer
     */
    create(data: CreateCustomerDto): Promise<Customer>;
    /**
     * Update customer
     */
    update(customerId: number, data: UpdateCustomerDto): Promise<Customer>;
    /**
     * Check if subdomain exists
     */
    subdomainExists(subdomain: string, excludeCustomerId?: number): Promise<boolean>;
}
//# sourceMappingURL=CustomerRepository.d.ts.map