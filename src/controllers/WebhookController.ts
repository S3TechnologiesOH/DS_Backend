/**
 * Webhook Controller
 *
 * Handles HTTP requests for webhook management endpoints.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { WebhookService } from '../services/WebhookService';

export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * GET /api/v1/webhooks
   * List all webhooks for the authenticated user's customer
   */
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;

      const webhooks = await this.webhookService.list(customerId);

      res.status(200).json({
        status: 'success',
        data: webhooks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/webhooks/:webhookId
   * Get webhook by ID
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const webhookId = parseInt(req.params.webhookId, 10);
      const customerId = req.user.customerId;

      const webhook = await this.webhookService.getById(webhookId, customerId);

      res.status(200).json({
        status: 'success',
        data: webhook,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/webhooks
   * Create new webhook
   */
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user.customerId;
      const userId = req.user.userId;

      const webhook = await this.webhookService.create({
        customerId,
        name: req.body.name,
        url: req.body.url,
        events: req.body.events,
        secret: req.body.secret,
        createdBy: userId,
      });

      res.status(201).json({
        status: 'success',
        data: webhook,
        message: 'Webhook created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/webhooks/:webhookId
   * Update webhook
   */
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const webhookId = parseInt(req.params.webhookId, 10);
      const customerId = req.user.customerId;

      const webhook = await this.webhookService.update(webhookId, customerId, req.body);

      res.status(200).json({
        status: 'success',
        data: webhook,
        message: 'Webhook updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/webhooks/:webhookId
   * Delete webhook
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const webhookId = parseInt(req.params.webhookId, 10);
      const customerId = req.user.customerId;

      await this.webhookService.delete(webhookId, customerId);

      res.status(200).json({
        status: 'success',
        message: 'Webhook deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/webhooks/:webhookId/test
   * Test webhook
   */
  async test(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const webhookId = parseInt(req.params.webhookId, 10);
      const customerId = req.user.customerId;

      const result = await this.webhookService.testWebhook(webhookId, customerId);

      res.status(200).json({
        status: 'success',
        data: result,
        message: result.success ? 'Webhook test successful' : 'Webhook test failed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/webhooks/:webhookId/deliveries
   * Get webhook deliveries
   */
  async getDeliveries(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const webhookId = parseInt(req.params.webhookId, 10);
      const customerId = req.user.customerId;
      const { limit } = req.query;

      const deliveries = await this.webhookService.getDeliveries(
        webhookId,
        customerId,
        limit ? parseInt(limit as string, 10) : 50
      );

      res.status(200).json({
        status: 'success',
        data: deliveries,
      });
    } catch (error) {
      next(error);
    }
  }
}
