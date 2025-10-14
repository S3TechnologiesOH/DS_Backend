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
 * POST /api/v1/auth/login
 * User login
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
 * GET /api/v1/auth/me
 * Get current user info (requires authentication)
 */
router.get('/me', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(authController.getCurrentUser.bind(authController)));
/**
 * POST /api/v1/auth/logout
 * User logout
 */
router.post('/logout', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(authController.logout.bind(authController)));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map