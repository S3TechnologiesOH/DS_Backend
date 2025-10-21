"use strict";
/**
 * Layout Routes
 *
 * API endpoints for layout management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LayoutController_1 = require("../controllers/LayoutController");
const LayoutService_1 = require("../services/LayoutService");
const LayoutRepository_1 = require("../repositories/LayoutRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const layout_validator_1 = require("../validators/layout.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const layoutRepository = new LayoutRepository_1.LayoutRepository();
const layoutService = new LayoutService_1.LayoutService(layoutRepository);
const layoutController = new LayoutController_1.LayoutController(layoutService);
// All layout routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /layouts:
 *   get:
 *     summary: List all layouts
 *     description: Get all layouts for the authenticated user's customer
 *     tags: [Layouts]
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
 *         description: Search by name or tags
 *     responses:
 *       200:
 *         description: Layout list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', (0, validateRequest_1.validateRequest)(layout_validator_1.listLayoutsSchema), (0, asyncHandler_1.asyncHandler)(layoutController.list.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}:
 *   get:
 *     summary: Get layout by ID
 *     description: Get a specific layout with all its layers
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Layout ID
 *     responses:
 *       200:
 *         description: Layout retrieved successfully
 *       404:
 *         description: Layout not found
 */
router.get('/:layoutId', (0, validateRequest_1.validateRequest)(layout_validator_1.getLayoutByIdSchema), (0, asyncHandler_1.asyncHandler)(layoutController.getById.bind(layoutController)));
/**
 * @swagger
 * /layouts:
 *   post:
 *     summary: Create a new layout
 *     description: Create a new layout with optional layers
 *     tags: [Layouts]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Homepage Banner
 *               description:
 *                 type: string
 *                 example: Main banner for homepage
 *               width:
 *                 type: integer
 *                 default: 1920
 *               height:
 *                 type: integer
 *                 default: 1080
 *               backgroundColor:
 *                 type: string
 *                 default: '#000000'
 *               tags:
 *                 type: string
 *                 example: homepage,banner
 *               layers:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Layout created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.post('/', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(layout_validator_1.createLayoutSchema), (0, asyncHandler_1.asyncHandler)(layoutController.create.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}:
 *   patch:
 *     summary: Update layout
 *     description: Update layout metadata
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Layout updated successfully
 *       404:
 *         description: Layout not found
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.patch('/:layoutId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(layout_validator_1.updateLayoutSchema), (0, asyncHandler_1.asyncHandler)(layoutController.update.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}:
 *   delete:
 *     summary: Delete layout
 *     description: Delete a layout (Admin only)
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layout deleted successfully
 *       404:
 *         description: Layout not found
 *       403:
 *         description: Forbidden - Requires Admin role
 */
router.delete('/:layoutId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(layout_validator_1.deleteLayoutSchema), (0, asyncHandler_1.asyncHandler)(layoutController.delete.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}/duplicate:
 *   post:
 *     summary: Duplicate layout
 *     description: Create a copy of an existing layout with all its layers
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name for the duplicated layout (optional)
 *     responses:
 *       201:
 *         description: Layout duplicated successfully
 *       404:
 *         description: Layout not found
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.post('/:layoutId/duplicate', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(layout_validator_1.duplicateLayoutSchema), (0, asyncHandler_1.asyncHandler)(layoutController.duplicate.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}/layers:
 *   get:
 *     summary: Get all layers for a layout
 *     description: Retrieve all layers/widgets in a layout
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layers retrieved successfully
 *       404:
 *         description: Layout not found
 */
router.get('/:layoutId/layers', (0, validateRequest_1.validateRequest)(layout_validator_1.getLayersSchema), (0, asyncHandler_1.asyncHandler)(layoutController.getLayers.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}/layers:
 *   post:
 *     summary: Add a layer to a layout
 *     description: Create a new layer/widget in the layout
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - layerName
 *               - layerType
 *               - positionX
 *               - positionY
 *               - width
 *               - height
 *             properties:
 *               layerName:
 *                 type: string
 *                 example: Header Text
 *               layerType:
 *                 type: string
 *                 enum: [text, image, video, playlist, html, iframe, weather, rss, news, youtube, clock, shape]
 *               positionX:
 *                 type: integer
 *               positionY:
 *                 type: integer
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Layer created successfully
 *       404:
 *         description: Layout not found
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.post('/:layoutId/layers', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(layout_validator_1.addLayerSchema), (0, asyncHandler_1.asyncHandler)(layoutController.addLayer.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}/layers/{layerId}:
 *   patch:
 *     summary: Update a layer
 *     description: Update layer properties and content
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: layerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layer updated successfully
 *       404:
 *         description: Layout or layer not found
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.patch('/:layoutId/layers/:layerId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(layout_validator_1.updateLayerSchema), (0, asyncHandler_1.asyncHandler)(layoutController.updateLayer.bind(layoutController)));
/**
 * @swagger
 * /layouts/{layoutId}/layers/{layerId}:
 *   delete:
 *     summary: Delete a layer
 *     description: Remove a layer from the layout
 *     tags: [Layouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: layoutId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: layerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layer deleted successfully
 *       404:
 *         description: Layout or layer not found
 *       403:
 *         description: Forbidden - Requires Admin or Editor role
 */
router.delete('/:layoutId/layers/:layerId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, validateRequest_1.validateRequest)(layout_validator_1.deleteLayerSchema), (0, asyncHandler_1.asyncHandler)(layoutController.deleteLayer.bind(layoutController)));
exports.default = router;
//# sourceMappingURL=layout.routes.js.map