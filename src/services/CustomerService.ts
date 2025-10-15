/**
 * Customer Service
 *
 * Business logic for customer management.
 * Only Admin users can create and update customers.
 */

import { CustomerRepository } from '../repositories/CustomerRepository';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models';
import { NotFoundError, ForbiddenError, ValidationError, ConflictError } from '../utils/errors';
import logger from '../utils/logger';

export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  /**
   * Get customer by ID
   * Admins can view any customer, non-admins can only view their own
   */
  async getById(customerId: number, requestingUserId: number, userRole: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // Non-admins can only view their own customer
    if (userRole !== 'Admin' && customer.customerId !== customerId) {
      throw new ForbiddenError('You do not have permission to view this customer');
    }

    return customer;
  }

  /**
   * List all customers
   * Only Admins can list all customers
   */
  async list(userRole: string): Promise<Customer[]> {
    // Only admins can list all customers
    if (userRole !== 'Admin') {
      throw new ForbiddenError('Only administrators can list all customers');
    }

    const customers = await this.customerRepository.findAll();

    logger.info('Customers listed', { count: customers.length });

    return customers;
  }

  /**
   * Create new customer
   * Only Admins can create customers
   */
  async create(data: CreateCustomerDto, userRole: string): Promise<Customer> {
    // Only admins can create customers
    if (userRole !== 'Admin') {
      throw new ForbiddenError('Only administrators can create customers');
    }

    // Validate subdomain format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(data.subdomain)) {
      throw new ValidationError('Subdomain must contain only lowercase letters, numbers, and hyphens');
    }

    // Check if subdomain already exists
    const subdomainExists = await this.customerRepository.subdomainExists(data.subdomain);
    if (subdomainExists) {
      throw new ConflictError('A customer with this subdomain already exists');
    }

    // Create customer
    const customer = await this.customerRepository.create(data);

    logger.info('Customer created successfully', {
      customerId: customer.customerId,
      name: customer.name,
      subdomain: customer.subdomain,
    });

    return customer;
  }

  /**
   * Update customer
   * Only Admins can update customers
   */
  async update(
    customerId: number,
    data: UpdateCustomerDto,
    userRole: string
  ): Promise<Customer> {
    // Only admins can update customers
    if (userRole !== 'Admin') {
      throw new ForbiddenError('Only administrators can update customers');
    }

    // Verify customer exists
    const existingCustomer = await this.customerRepository.findById(customerId);
    if (!existingCustomer) {
      throw new NotFoundError('Customer not found');
    }

    // If subdomain is being changed, validate it
    if (data.subdomain !== undefined) {
      // Validate subdomain format
      if (!/^[a-z0-9-]+$/.test(data.subdomain)) {
        throw new ValidationError('Subdomain must contain only lowercase letters, numbers, and hyphens');
      }

      // Check if new subdomain already exists (excluding current customer)
      const subdomainExists = await this.customerRepository.subdomainExists(
        data.subdomain,
        customerId
      );
      if (subdomainExists) {
        throw new ConflictError('A customer with this subdomain already exists');
      }
    }

    // Update customer
    const updatedCustomer = await this.customerRepository.update(customerId, data);

    logger.info('Customer updated successfully', {
      customerId,
      updatedFields: Object.keys(data),
    });

    return updatedCustomer;
  }

  /**
   * Get customer by subdomain
   * Used for authentication and tenant identification
   */
  async getBySubdomain(subdomain: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findBySubdomain(subdomain);

    if (!customer) {
      return null;
    }

    // Check if customer is active
    if (!customer.isActive) {
      throw new ForbiddenError('This customer account is inactive');
    }

    return customer;
  }

  /**
   * Check if customer has reached their limits
   */
  async checkLimits(
    customerId: number
  ): Promise<{
    sites: { current: number; max: number; canAdd: boolean };
    players: { current: number; max: number; canAdd: boolean };
    storage: { current: number; max: number; canAdd: boolean };
  }> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // In a real implementation, you would query the actual counts from Sites, Players, and Content tables
    // For now, returning placeholder values
    return {
      sites: {
        current: 0, // Would query from Sites table: COUNT(*) WHERE CustomerId = @customerId
        max: customer.maxSites,
        canAdd: true, // current < max
      },
      players: {
        current: 0, // Would query from Players table: COUNT(*) WHERE CustomerId = @customerId
        max: customer.maxPlayers,
        canAdd: true,
      },
      storage: {
        current: 0, // Would query from Content table: SUM(FileSize) WHERE CustomerId = @customerId
        max: customer.maxStorageGB,
        canAdd: true,
      },
    };
  }
}
