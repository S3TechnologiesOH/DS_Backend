/**
 * Auth Routes
 *
 * API endpoints for authentication.
 * Demonstrates route setup with validation middleware.
 */

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';

const router = Router();

// Initialize dependencies (Dependency Injection)
const userRepository = new UserRepository();
const customerRepository = new CustomerRepository();
const authService = new AuthService(userRepository, customerRepository);
const authController = new AuthController(authService);

/**
 * POST /api/v1/auth/login
 * User login
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

/**
 * POST /api/v1/auth/register
 * User registration (creates first admin user)
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  validateRequest(refreshTokenSchema),
  asyncHandler(authController.refreshToken.bind(authController))
);

/**
 * GET /api/v1/auth/me
 * Get current user info (requires authentication)
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getCurrentUser.bind(authController))
);

/**
 * POST /api/v1/auth/logout
 * User logout
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(authController.logout.bind(authController))
);

export default router;
