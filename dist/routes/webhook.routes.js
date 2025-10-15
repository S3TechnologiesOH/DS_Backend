"use strict";
/**
 * Webhook Routes
 *
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: Webhook management and event delivery endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WebhookController_1 = require("../controllers/WebhookController");
const WebhookService_1 = require("../services/WebhookService");
const WebhookRepository_1 = require("../repositories/WebhookRepository");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Initialize dependencies
const webhookRepository = new WebhookRepository_1.WebhookRepository();
const webhookService = new WebhookService_1.WebhookService(webhookRepository);
const webhookController = new WebhookController_1.WebhookController(webhookService);
// All webhook routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /api/v1/webhooks:
 *   get:
 *     summary: List all webhooks
 *     description: Retrieve all webhooks for the authenticated user's customer
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Webhooks retrieved successfully
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
 *                     $ref: '#/components/schemas/Webhook'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(webhookController.list.bind(webhookController)));
/**
 * @swagger
 * /api/v1/webhooks/{webhookId}:
 *   get:
 *     summary: Get webhook by ID
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Webhook ID
 *     responses:
 *       200:
 *         description: Webhook retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Webhook'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:webhookId', (0, asyncHandler_1.asyncHandler)(webhookController.getById.bind(webhookController)));
/**
 * @swagger
 * /api/v1/webhooks:
 *   post:
 *     summary: Create new webhook
 *     description: Create a webhook to receive event notifications
 *     tags: [Webhooks]
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
 *               - url
 *               - events
 *             properties:
 *               name:
 *                 type: string
 *                 description: Webhook name
 *                 example: Production Webhook
 *                 minLength: 1
 *                 maxLength: 100
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Webhook endpoint URL (must be https)
 *                 example: https://api.example.com/webhooks/digital-signage
 *               events:
 *                 type: array
 *                 description: List of events to subscribe to
 *                 items:
 *                   type: string
 *                   enum:
 *                     - player.online
 *                     - player.offline
 *                     - player.error
 *                     - content.created
 *                     - content.updated
 *                     - content.deleted
 *                     - playlist.created
 *                     - playlist.updated
 *                     - playlist.deleted
 *                     - schedule.created
 *                     - schedule.updated
 *                     - schedule.deleted
 *                     - site.created
 *                     - site.updated
 *                     - site.deleted
 *                 example: ["player.online", "player.offline", "content.created"]
 *                 minItems: 1
 *               secret:
 *                 type: string
 *                 description: Webhook secret for signature verification (auto-generated if not provided)
 *                 example: my-secret-key-12345
 *                 minLength: 16
 *     responses:
 *       201:
 *         description: Webhook created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Webhook'
 *                 message:
 *                   type: string
 *                   example: Webhook created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', (0, authorize_1.authorize)('Admin', 'Editor'), (0, asyncHandler_1.asyncHandler)(webhookController.create.bind(webhookController)));
/**
 * @swagger
 * /api/v1/webhooks/{webhookId}:
 *   patch:
 *     summary: Update webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Webhook ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Webhook name
 *                 example: Updated Webhook Name
 *                 minLength: 1
 *                 maxLength: 100
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Webhook endpoint URL
 *                 example: https://api.example.com/webhooks/new-endpoint
 *               events:
 *                 type: array
 *                 description: List of events to subscribe to
 *                 items:
 *                   type: string
 *                 example: ["player.online", "player.offline"]
 *                 minItems: 1
 *               isActive:
 *                 type: boolean
 *                 description: Enable or disable webhook
 *                 example: true
 *     responses:
 *       200:
 *         description: Webhook updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Webhook'
 *                 message:
 *                   type: string
 *                   example: Webhook updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:webhookId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, asyncHandler_1.asyncHandler)(webhookController.update.bind(webhookController)));
/**
 * @swagger
 * /api/v1/webhooks/{webhookId}:
 *   delete:
 *     summary: Delete webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Webhook ID
 *     responses:
 *       200:
 *         description: Webhook deleted successfully
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
 *                   example: Webhook deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:webhookId', (0, authorize_1.authorize)('Admin', 'Editor'), (0, asyncHandler_1.asyncHandler)(webhookController.delete.bind(webhookController)));
/**
 * @swagger
 * /api/v1/webhooks/{webhookId}/test:
 *   post:
 *     summary: Test webhook
 *     description: Send a test payload to the webhook endpoint to verify connectivity
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Webhook ID
 *     responses:
 *       200:
 *         description: Webhook test completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/WebhookTestResult'
 *                 message:
 *                   type: string
 *                   example: Webhook test successful
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:webhookId/test', (0, authorize_1.authorize)('Admin', 'Editor'), (0, asyncHandler_1.asyncHandler)(webhookController.test.bind(webhookController)));
/**
 * @swagger
 * /api/v1/webhooks/{webhookId}/deliveries:
 *   get:
 *     summary: Get webhook deliveries
 *     description: Retrieve recent webhook delivery history
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Webhook ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of deliveries to retrieve
 *     responses:
 *       200:
 *         description: Webhook deliveries retrieved successfully
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
 *                     $ref: '#/components/schemas/WebhookDelivery'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:webhookId/deliveries', (0, asyncHandler_1.asyncHandler)(webhookController.getDeliveries.bind(webhookController)));
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map