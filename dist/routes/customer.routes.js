"use strict";
/**
 * Customer Routes
 *
 * API endpoints for customer management.
 * Admin-only operations for managing multi-tenant customers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerController_1 = require("../controllers/CustomerController");
const CustomerService_1 = require("../services/CustomerService");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const customer_validator_1 = require("../validators/customer.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const customerRepository = new CustomerRepository_1.CustomerRepository();
const customerService = new CustomerService_1.CustomerService(customerRepository);
const customerController = new CustomerController_1.CustomerController(customerService);
// All customer routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /customers:
 *   get:
 *     summary: List all customers
 *     description: Get all customers (Admin can see all, others see only their own)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(customerController.list.bind(customerController)));
/**
 * @swagger
 * /customers/{customerId}:
 *   get:
 *     summary: Get customer by ID
 *     description: Retrieve a specific customer (Admin can view any, others only their own)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *       403:
 *         description: Forbidden - Cannot access this customer
 */
router.get('/:customerId', (0, validateRequest_1.validateRequest)(customer_validator_1.getCustomerSchema), (0, asyncHandler_1.asyncHandler)(customerController.getById.bind(customerController)));
/**
 * @swagger
 * /customers/{customerId}/limits:
 *   get:
 *     summary: Get customer resource limits
 *     description: Retrieve resource limits and current usage for a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Limits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     maxSites:
 *                       type: integer
 *                     currentSites:
 *                       type: integer
 *                     maxPlayers:
 *                       type: integer
 *                     currentPlayers:
 *                       type: integer
 *                     maxStorageGB:
 *                       type: integer
 *                     currentStorageGB:
 *                       type: number
 *       403:
 *         description: Forbidden - Cannot access this customer's limits
 */
router.get('/:customerId/limits', (0, validateRequest_1.validateRequest)(customer_validator_1.getCustomerSchema), (0, asyncHandler_1.asyncHandler)(customerController.getLimits.bind(customerController)));
/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create new customer
 *     description: Create a new customer organization (Admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subdomain
 *               - contactEmail
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Corporation
 *               subdomain:
 *                 type: string
 *                 example: acme
 *                 description: Unique subdomain (lowercase, alphanumeric, hyphens only)
 *               subscriptionTier:
 *                 type: string
 *                 enum: [Free, Pro, Enterprise]
 *                 default: Free
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: contact@acme.com
 *               contactPhone:
 *                 type: string
 *                 example: +1-555-0100
 *               maxSites:
 *                 type: integer
 *                 example: 10
 *               maxPlayers:
 *                 type: integer
 *                 example: 50
 *               maxStorageGB:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *                 message:
 *                   type: string
 *                   example: Customer created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(customer_validator_1.createCustomerSchema), (0, asyncHandler_1.asyncHandler)(customerController.create.bind(customerController)));
/**
 * @swagger
 * /customers/{customerId}:
 *   patch:
 *     summary: Update customer
 *     description: Update customer details (Admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subdomain:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               subscriptionTier:
 *                 type: string
 *                 enum: [Free, Pro, Enterprise]
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               contactPhone:
 *                 type: string
 *               maxSites:
 *                 type: integer
 *               maxPlayers:
 *                 type: integer
 *               maxStorageGB:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *                 message:
 *                   type: string
 *                   example: Customer updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Customer not found
 */
router.patch('/:customerId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(customer_validator_1.updateCustomerSchema), (0, asyncHandler_1.asyncHandler)(customerController.update.bind(customerController)));
exports.default = router;
//# sourceMappingURL=customer.routes.js.map