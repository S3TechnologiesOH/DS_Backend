"use strict";
/**
 * User Routes
 *
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const UserService_1 = require("../services/UserService");
const UserRepository_1 = require("../repositories/UserRepository");
const SiteRepository_1 = require("../repositories/SiteRepository");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const validateRequest_1 = require("../middleware/validateRequest");
const asyncHandler_1 = require("../middleware/asyncHandler");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const userRepository = new UserRepository_1.UserRepository();
const siteRepository = new SiteRepository_1.SiteRepository();
const userService = new UserService_1.UserService(userRepository, siteRepository);
const userController = new UserController_1.UserController(userService);
// All user routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List all users
 *     description: Retrieve all users for the authenticated customer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Admin, Editor, Viewer, SiteManager]
 *         description: Filter by user role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: assignedSiteId
 *         schema:
 *           type: integer
 *         description: Filter by assigned site ID
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', (0, validateRequest_1.validateRequest)(user_validator_1.listUsersSchema), (0, asyncHandler_1.asyncHandler)(userController.list.bind(userController)));
/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:userId', (0, validateRequest_1.validateRequest)(user_validator_1.getUserByIdSchema), (0, asyncHandler_1.asyncHandler)(userController.getById.bind(userController)));
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create new user
 *     description: Create a new user account (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, and number
 *                 example: SecurePass123
 *               firstName:
 *                 type: string
 *                 example: John
 *                 minLength: 1
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 example: Doe
 *                 minLength: 1
 *                 maxLength: 50
 *               role:
 *                 type: string
 *                 enum: [Admin, Editor, Viewer, SiteManager]
 *                 example: Editor
 *               assignedSiteId:
 *                 type: integer
 *                 description: Required for SiteManager role
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(user_validator_1.createUserSchema), (0, asyncHandler_1.asyncHandler)(userController.create.bind(userController)));
/**
 * @swagger
 * /api/v1/users/{userId}:
 *   patch:
 *     summary: Update user
 *     description: Update user information (Admin only, users cannot modify their own role/status)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [Admin, Editor, Viewer, SiteManager]
 *                 example: Admin
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               assignedSiteId:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:userId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(user_validator_1.updateUserSchema), (0, asyncHandler_1.asyncHandler)(userController.update.bind(userController)));
/**
 * @swagger
 * /api/v1/users/{userId}:
 *   delete:
 *     summary: Delete user
 *     description: Soft delete a user (Admin only, cannot delete self)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:userId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(user_validator_1.deleteUserSchema), (0, asyncHandler_1.asyncHandler)(userController.delete.bind(userController)));
/**
 * @swagger
 * /api/v1/users/{userId}/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Reset a user's password (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, and number
 *                 example: NewSecurePass123
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: Password reset successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:userId/reset-password', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(user_validator_1.resetPasswordSchema), (0, asyncHandler_1.asyncHandler)(userController.resetPassword.bind(userController)));
exports.default = router;
//# sourceMappingURL=user.routes.js.map