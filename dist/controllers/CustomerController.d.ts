/**
 * Customer Controller
 *
 * Handles HTTP requests for customer management endpoints.
 * Only Admin users can create and update customers.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.d';
import { CustomerService } from '../services/CustomerService';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    /**
     * GET /api/v1/customers
     * List all customers (Admin only)
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/customers/:customerId
     * Get customer by ID
     * Admins can view any customer, non-admins can only view their own
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/customers
     * Create new customer (Admin only)
     *
     * Expected body:
     * {
     *   "name": "Company Name",
     *   "subdomain": "company-subdomain",
     *   "contactEmail": "contact@company.com",
     *   "contactPhone": "+1234567890", // optional
     *   "subscriptionTier": "Pro", // optional, defaults to "Free"
     *   "maxSites": 10, // optional, defaults based on tier
     *   "maxPlayers": 20, // optional, defaults based on tier
     *   "maxStorageGB": 50 // optional, defaults based on tier
     * }
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/customers/:customerId
     * Update customer (Admin only)
     *
     * All fields are optional:
     * {
     *   "name": "Updated Name",
     *   "subdomain": "new-subdomain",
     *   "isActive": true,
     *   "subscriptionTier": "Enterprise",
     *   "maxSites": 50,
     *   "maxPlayers": 100,
     *   "maxStorageGB": 500,
     *   "contactEmail": "newemail@company.com",
     *   "contactPhone": "+9876543210"
     * }
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/customers/:customerId/limits
     * Get customer resource limits and current usage
     */
    getLimits(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=CustomerController.d.ts.map