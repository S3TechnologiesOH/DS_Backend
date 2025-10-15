/**
 * Customer Service
 *
 * Business logic for customer management.
 * Only Admin users can create and update customers.
 */
import { CustomerRepository } from '../repositories/CustomerRepository';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models';
export declare class CustomerService {
    private readonly customerRepository;
    constructor(customerRepository: CustomerRepository);
    /**
     * Get customer by ID
     * Admins can view any customer, non-admins can only view their own
     */
    getById(customerId: number, requestingUserId: number, userRole: string): Promise<Customer>;
    /**
     * List all customers
     * Only Admins can list all customers
     */
    list(userRole: string): Promise<Customer[]>;
    /**
     * Create new customer
     * Only Admins can create customers
     */
    create(data: CreateCustomerDto, userRole: string): Promise<Customer>;
    /**
     * Update customer
     * Only Admins can update customers
     */
    update(customerId: number, data: UpdateCustomerDto, userRole: string): Promise<Customer>;
    /**
     * Get customer by subdomain
     * Used for authentication and tenant identification
     */
    getBySubdomain(subdomain: string): Promise<Customer | null>;
    /**
     * Check if customer has reached their limits
     */
    checkLimits(customerId: number): Promise<{
        sites: {
            current: number;
            max: number;
            canAdd: boolean;
        };
        players: {
            current: number;
            max: number;
            canAdd: boolean;
        };
        storage: {
            current: number;
            max: number;
            canAdd: boolean;
        };
    }>;
}
//# sourceMappingURL=CustomerService.d.ts.map