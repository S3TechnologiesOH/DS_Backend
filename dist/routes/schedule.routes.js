"use strict";
/**
 * Schedule Routes
 *
 * API endpoints for schedule management.
 * Schedules determine when and where layouts are played with hierarchical assignment.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ScheduleController_1 = require("../controllers/ScheduleController");
const ScheduleService_1 = require("../services/ScheduleService");
const ScheduleRepository_1 = require("../repositories/ScheduleRepository");
const LayoutRepository_1 = require("../repositories/LayoutRepository");
const validateRequest_1 = require("../middleware/validateRequest");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const asyncHandler_1 = require("../middleware/asyncHandler");
const schedule_validator_1 = require("../validators/schedule.validator");
const router = (0, express_1.Router)();
// Initialize dependencies
const scheduleRepository = new ScheduleRepository_1.ScheduleRepository();
const layoutRepository = new LayoutRepository_1.LayoutRepository();
const scheduleService = new ScheduleService_1.ScheduleService(scheduleRepository, layoutRepository);
const scheduleController = new ScheduleController_1.ScheduleController(scheduleService);
// All schedule routes require authentication
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: List all schedules
 *     description: Get all schedules for the authenticated user's customer with pagination
 *     tags: [Schedules]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by schedule name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: layoutId
 *         schema:
 *           type: integer
 *         description: Filter by layout ID
 *     responses:
 *       200:
 *         description: Schedules list retrieved successfully
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
 *                     $ref: '#/components/schemas/Schedule'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', (0, validateRequest_1.validateRequest)(schedule_validator_1.listSchedulesSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.list.bind(scheduleController)));
/**
 * @swagger
 * /schedules/{scheduleId}:
 *   get:
 *     summary: Get schedule by ID
 *     description: Retrieve a specific schedule with all assignments
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Schedule not found
 */
router.get('/:scheduleId', (0, validateRequest_1.validateRequest)(schedule_validator_1.getScheduleByIdSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.getById.bind(scheduleController)));
/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create new schedule
 *     description: Create a new schedule for playing layouts at specific times
 *     tags: [Schedules]
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
 *               - layoutId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Morning Schedule
 *               layoutId:
 *                 type: integer
 *                 example: 1
 *               priority:
 *                 type: integer
 *                 example: 10
 *                 description: Higher priority schedules override lower ones
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *               startTime:
 *                 type: string
 *                 example: 09:00:00
 *               endTime:
 *                 type: string
 *                 example: 17:00:00
 *               daysOfWeek:
 *                 type: string
 *                 example: Mon,Tue,Wed,Thu,Fri
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(schedule_validator_1.createScheduleSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.create.bind(scheduleController)));
/**
 * @swagger
 * /schedules/{scheduleId}:
 *   patch:
 *     summary: Update schedule
 *     description: Update schedule details and timing
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
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
 *               layoutId:
 *                 type: integer
 *               priority:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               daysOfWeek:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 */
router.patch('/:scheduleId', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(schedule_validator_1.updateScheduleSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.update.bind(scheduleController)));
/**
 * @swagger
 * /schedules/{scheduleId}:
 *   delete:
 *     summary: Delete schedule
 *     description: Delete a schedule (Admin or CustomerAdmin only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
router.delete('/:scheduleId', (0, authorize_1.authorize)('Admin'), (0, validateRequest_1.validateRequest)(schedule_validator_1.deleteScheduleSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.delete.bind(scheduleController)));
/**
 * @swagger
 * /schedules/{scheduleId}/assignments:
 *   post:
 *     summary: Create schedule assignment
 *     description: Assign schedule to a customer, site, or player (hierarchical priority)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
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
 *               - assignmentType
 *             properties:
 *               assignmentType:
 *                 type: string
 *                 enum: [Customer, Site, Player]
 *                 example: Player
 *               targetCustomerId:
 *                 type: integer
 *                 description: Required if assignmentType is Customer
 *               targetSiteId:
 *                 type: integer
 *                 description: Required if assignmentType is Site
 *               targetPlayerId:
 *                 type: integer
 *                 description: Required if assignmentType is Player
 *                 example: 1
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Validation error
 */
router.post('/:scheduleId/assignments', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(schedule_validator_1.createScheduleAssignmentSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.createAssignment.bind(scheduleController)));
/**
 * @swagger
 * /schedules/{scheduleId}/assignments/{assignmentId}:
 *   delete:
 *     summary: Delete schedule assignment
 *     description: Remove a schedule assignment from a customer, site, or player
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 */
router.delete('/:scheduleId/assignments/:assignmentId', (0, authorize_1.authorize)('Admin', 'SiteManager'), (0, validateRequest_1.validateRequest)(schedule_validator_1.deleteScheduleAssignmentSchema), (0, asyncHandler_1.asyncHandler)(scheduleController.deleteAssignment.bind(scheduleController)));
exports.default = router;
//# sourceMappingURL=schedule.routes.js.map