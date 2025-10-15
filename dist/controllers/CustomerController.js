"use strict";
/**
 * Customer Controller
 *
 * Handles HTTP requests for customer management endpoints.
 * Only Admin users can create and update customers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    /**
     * GET /api/v1/customers
     * List all customers (Admin only)
     */
    async list(req, res, next) {
        try {
            const userRole = req.user.role;
            const customers = await this.customerService.list(userRole);
            res.status(200).json({
                status: 'success',
                data: customers,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/customers/:customerId
     * Get customer by ID
     * Admins can view any customer, non-admins can only view their own
     */
    async getById(req, res, next) {
        try {
            const customerId = parseInt(req.params.customerId, 10);
            const requestingUserId = req.user.userId;
            const userRole = req.user.role;
            const customer = await this.customerService.getById(customerId, requestingUserId, userRole);
            res.status(200).json({
                status: 'success',
                data: customer,
            });
        }
        catch (error) {
            next(error);
        }
    }
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
    async create(req, res, next) {
        try {
            const userRole = req.user.role;
            const customer = await this.customerService.create(req.body, userRole);
            res.status(201).json({
                status: 'success',
                data: customer,
                message: 'Customer created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
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
    async update(req, res, next) {
        try {
            const customerId = parseInt(req.params.customerId, 10);
            const userRole = req.user.role;
            const customer = await this.customerService.update(customerId, req.body, userRole);
            res.status(200).json({
                status: 'success',
                data: customer,
                message: 'Customer updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/customers/:customerId/limits
     * Get customer resource limits and current usage
     */
    async getLimits(req, res, next) {
        try {
            const customerId = parseInt(req.params.customerId, 10);
            // Users can only check limits for their own customer
            if (req.user.role !== 'Admin' && req.user.customerId !== customerId) {
                res.status(403).json({
                    status: 'error',
                    message: 'You do not have permission to view limits for this customer',
                });
                return;
            }
            const limits = await this.customerService.checkLimits(customerId);
            res.status(200).json({
                status: 'success',
                data: limits,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=CustomerController.js.map