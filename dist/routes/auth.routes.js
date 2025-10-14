"use strict";
/**
 * Auth Routes
 *
 * API endpoints for authentication.
 * Demonstrates route setup with validation middleware.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthService_1 = require("../services/AuthService");
const UserRepository_1 = require("../repositories/UserRepository");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
// Initialize dependencies (Dependency Injection)
const userRepository = new UserRepository_1.UserRepository();
const customerRepository = new CustomerRepository_1.CustomerRepository();
const authService = new AuthService_1.AuthService(userRepository, customerRepository);
const authController = new AuthController_1.AuthController(authService);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and receive JWT tokens
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(authController.login.bind(authController)));
/**
 * POST /api/v1/auth/register
 * User registration (creates first admin user)
 */
router.post('/register', (0, validateRequest_1.validateRequest)(auth_validator_1.registerSchema), (0, asyncHandler_1.asyncHandler)(authController.register.bind(authController)));
/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', (0, validateRequest_1.validateRequest)(auth_validator_1.refreshTokenSchema), (0, asyncHandler_1.asyncHandler)(authController.refreshToken.bind(authController)));
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     description: Retrieve authenticated user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
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
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     role:
 *                       type: string
 *                       enum: [Admin, CustomerAdmin, SiteManager, ContentEditor]
 *                       example: Admin
 *                     customerId:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(authController.getCurrentUser.bind(authController)));
/**
 * POST /api/v1/auth/logout
 * User logout
 */
router.post('/logout', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(authController.logout.bind(authController)));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map