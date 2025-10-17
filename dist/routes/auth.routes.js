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
 *               - subdomain
 *               - email
 *               - password
 *             properties:
 *               subdomain:
 *                 type: string
 *                 description: Organization identifier
 *                 example: mycompany
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: admin@mycompany.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *                 example: Admin123!
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: admin@mycompany.com
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         role:
 *                           type: string
 *                           example: Admin
 *                         customerId:
 *                           type: integer
 *                           example: 1
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(authController.login.bind(authController)));
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     description: Create a new customer organization and admin user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subdomain
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               subdomain:
 *                 type: string
 *                 description: Unique organization identifier
 *                 example: mycompany
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: admin@mycompany.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Strong password (8+ chars, uppercase, lowercase, number)
 *                 example: Admin123!
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: Doe
 *     responses:
 *       201:
 *         description: Registration successful
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: admin@mycompany.com
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         role:
 *                           type: string
 *                           example: Admin
 *                         customerId:
 *                           type: integer
 *                           example: 1
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       400:
 *         description: Validation error or user/customer already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', (0, validateRequest_1.validateRequest)(auth_validator_1.registerSchema), (0, asyncHandler_1.asyncHandler)(authController.register.bind(authController)));
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using a valid refresh token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refresh successful
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
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Revoke the current user's refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(authController.logout.bind(authController)));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map