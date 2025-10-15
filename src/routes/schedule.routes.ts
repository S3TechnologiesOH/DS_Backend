/**
 * Schedule Routes
 *
 * API endpoints for schedule management.
 * Schedules determine when and where playlists are played with hierarchical assignment.
 */

import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import { ScheduleService } from '../services/ScheduleService';
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { PlaylistRepository } from '../repositories/PlaylistRepository';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createScheduleSchema,
  updateScheduleSchema,
  getScheduleByIdSchema,
  deleteScheduleSchema,
  createScheduleAssignmentSchema,
  deleteScheduleAssignmentSchema,
  listSchedulesSchema,
} from '../validators/schedule.validator';

const router = Router();

// Initialize dependencies
const scheduleRepository = new ScheduleRepository();
const playlistRepository = new PlaylistRepository();
const scheduleService = new ScheduleService(scheduleRepository, playlistRepository);
const scheduleController = new ScheduleController(scheduleService);

// All schedule routes require authentication
router.use(authenticate);

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
 *         name: playlistId
 *         schema:
 *           type: integer
 *         description: Filter by playlist ID
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
router.get(
  '/',
  validateRequest(listSchedulesSchema),
  asyncHandler(scheduleController.list.bind(scheduleController))
);

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
router.get(
  '/:scheduleId',
  validateRequest(getScheduleByIdSchema),
  asyncHandler(scheduleController.getById.bind(scheduleController))
);

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create new schedule
 *     description: Create a new schedule for playing playlists at specific times
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
 *               - playlistId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Morning Schedule
 *               playlistId:
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
router.post(
  '/',
  authorize('Admin', 'SiteManager'),
  validateRequest(createScheduleSchema),
  asyncHandler(scheduleController.create.bind(scheduleController))
);

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
 *               playlistId:
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
router.patch(
  '/:scheduleId',
  authorize('Admin', 'SiteManager'),
  validateRequest(updateScheduleSchema),
  asyncHandler(scheduleController.update.bind(scheduleController))
);

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
router.delete(
  '/:scheduleId',
  authorize('Admin'),
  validateRequest(deleteScheduleSchema),
  asyncHandler(scheduleController.delete.bind(scheduleController))
);

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
router.post(
  '/:scheduleId/assignments',
  authorize('Admin', 'SiteManager'),
  validateRequest(createScheduleAssignmentSchema),
  asyncHandler(scheduleController.createAssignment.bind(scheduleController))
);

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
router.delete(
  '/:scheduleId/assignments/:assignmentId',
  authorize('Admin', 'SiteManager'),
  validateRequest(deleteScheduleAssignmentSchema),
  asyncHandler(scheduleController.deleteAssignment.bind(scheduleController))
);

export default router;
