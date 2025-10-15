/**
 * Site Routes
 *
 * API endpoints for site management.
 * Sites are physical locations under a customer's organization.
 */

import { Router } from 'express';
import { SiteController } from '../controllers/SiteController';
import { SiteService } from '../services/SiteService';
import { SiteRepository } from '../repositories/SiteRepository';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createSiteSchema,
  updateSiteSchema,
  getSiteSchema,
} from '../validators/site.validator';

const router = Router();

// Initialize dependencies
const siteRepository = new SiteRepository();
const siteService = new SiteService(siteRepository);
const siteController = new SiteController(siteService);

// All site routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /sites:
 *   get:
 *     summary: List all sites
 *     description: Get all sites for the authenticated user's customer with pagination and filtering
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by site name or code
 *     responses:
 *       200:
 *         description: Sites list retrieved successfully
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
 *                     $ref: '#/components/schemas/Site'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', asyncHandler(siteController.list.bind(siteController)));

/**
 * @swagger
 * /sites/{siteId}:
 *   get:
 *     summary: Get site by ID
 *     description: Retrieve a specific site with all details
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Site'
 *       404:
 *         description: Site not found
 *       403:
 *         description: Forbidden - Cannot access this site
 */
router.get(
  '/:siteId',
  validateRequest(getSiteSchema),
  asyncHandler(siteController.getById.bind(siteController))
);

/**
 * @swagger
 * /sites:
 *   post:
 *     summary: Create new site
 *     description: Create a new physical location under the customer's organization
 *     tags: [Sites]
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
 *               - siteCode
 *             properties:
 *               name:
 *                 type: string
 *                 example: Downtown Store
 *               siteCode:
 *                 type: string
 *                 example: DT-001
 *                 description: Unique site code (uppercase, alphanumeric, hyphens, underscores)
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: New York
 *               state:
 *                 type: string
 *                 example: NY
 *               country:
 *                 type: string
 *                 example: USA
 *               postalCode:
 *                 type: string
 *                 example: 10001
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: -74.0060
 *               timeZone:
 *                 type: string
 *                 example: America/New_York
 *               openingHours:
 *                 type: string
 *                 example: Mon-Fri 9AM-5PM
 *     responses:
 *       201:
 *         description: Site created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Site'
 *                 message:
 *                   type: string
 *                   example: Site created successfully
 *       400:
 *         description: Validation error or exceeded limits
 *       403:
 *         description: Forbidden - Admin or CustomerAdmin only
 */
router.post(
  '/',
  authorize('Admin'),
  validateRequest(createSiteSchema),
  asyncHandler(siteController.create.bind(siteController))
);

/**
 * @swagger
 * /sites/{siteId}:
 *   patch:
 *     summary: Update site
 *     description: Update site details (Admin, CustomerAdmin, or assigned SiteManager)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               siteCode:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               timeZone:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               openingHours:
 *                 type: string
 *     responses:
 *       200:
 *         description: Site updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Site'
 *                 message:
 *                   type: string
 *                   example: Site updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Site not found
 */
router.patch(
  '/:siteId',
  authorize('Admin', 'SiteManager'),
  validateRequest(updateSiteSchema),
  asyncHandler(siteController.update.bind(siteController))
);

/**
 * @swagger
 * /sites/{siteId}:
 *   delete:
 *     summary: Delete site
 *     description: Delete a site and all associated data (Admin or CustomerAdmin only)
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site deleted successfully
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
 *                   example: Site deleted successfully
 *       403:
 *         description: Forbidden - Admin or CustomerAdmin only
 *       404:
 *         description: Site not found
 */
router.delete(
  '/:siteId',
  authorize('Admin'),
  validateRequest(getSiteSchema),
  asyncHandler(siteController.delete.bind(siteController))
);

export default router;
