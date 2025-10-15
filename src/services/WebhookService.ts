/**
 * Webhook Service
 *
 * Business logic for webhooks and event delivery.
 */

import crypto from 'crypto';
import axios from 'axios';
import { WebhookRepository } from '../repositories/WebhookRepository';
import {
  Webhook,
  WebhookDelivery,
  CreateWebhookDto,
  UpdateWebhookDto,
  WebhookEvent,
  WebhookPayload,
  WebhookTestResult,
} from '../models';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

export class WebhookService {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  /**
   * Get webhook by ID
   */
  async getById(webhookId: number, customerId: number): Promise<Webhook> {
    const webhook = await this.webhookRepository.findById(webhookId, customerId);

    if (!webhook) {
      throw new NotFoundError('Webhook not found');
    }

    return webhook;
  }

  /**
   * List all webhooks for a customer
   */
  async list(customerId: number): Promise<Webhook[]> {
    return this.webhookRepository.findByCustomerId(customerId);
  }

  /**
   * Create new webhook
   */
  async create(data: CreateWebhookDto): Promise<Webhook> {
    // Validate URL
    this.validateUrl(data.url);

    // Generate secret if not provided
    if (!data.secret) {
      data.secret = crypto.randomBytes(32).toString('hex');
    }

    // Validate events
    if (!data.events || data.events.length === 0) {
      throw new ValidationError('At least one event must be specified');
    }

    const webhook = await this.webhookRepository.create(data);

    logger.info(`Created webhook ${webhook.webhookId} for customer ${data.customerId}`);

    return webhook;
  }

  /**
   * Update webhook
   */
  async update(webhookId: number, customerId: number, data: UpdateWebhookDto): Promise<Webhook> {
    // Validate webhook exists
    await this.getById(webhookId, customerId);

    // Validate URL if provided
    if (data.url) {
      this.validateUrl(data.url);
    }

    // Validate events if provided
    if (data.events && data.events.length === 0) {
      throw new ValidationError('At least one event must be specified');
    }

    const webhook = await this.webhookRepository.update(webhookId, customerId, data);

    logger.info(`Updated webhook ${webhookId}`);

    return webhook;
  }

  /**
   * Delete webhook
   */
  async delete(webhookId: number, customerId: number): Promise<void> {
    // Validate webhook exists
    await this.getById(webhookId, customerId);

    await this.webhookRepository.delete(webhookId, customerId);

    logger.info(`Deleted webhook ${webhookId}`);
  }

  /**
   * Test webhook by sending a test payload
   */
  async testWebhook(webhookId: number, customerId: number): Promise<WebhookTestResult> {
    const webhook = await this.getById(webhookId, customerId);

    const testPayload: WebhookPayload = {
      event: 'player.online',
      timestamp: new Date().toISOString(),
      customerId,
      data: {
        test: true,
        message: 'This is a test webhook delivery',
      },
    };

    const startTime = Date.now();

    try {
      const response = await axios.post(webhook.url, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': this.generateSignature(JSON.stringify(testPayload), webhook.secret),
          'User-Agent': 'DigitalSignage-Webhook/1.0',
        },
        timeout: 10000, // 10 second timeout
      });

      const responseTime = Date.now() - startTime;

      logger.info(`Webhook test successful for ${webhookId}, status: ${response.status}`);

      return {
        success: true,
        statusCode: response.status,
        responseTime,
      };
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      const err = error as { response?: { status?: number }; message?: string };

      logger.warn(`Webhook test failed for ${webhookId}`, { error: err.message });

      return {
        success: false,
        statusCode: err.response?.status,
        responseTime,
        error: err.message || 'Unknown error',
      };
    }
  }

  /**
   * Trigger webhook event
   * This is called internally when events occur
   */
  async triggerEvent(customerId: number, event: WebhookEvent, data: Record<string, unknown>): Promise<void> {
    // Find all active webhooks subscribed to this event
    const webhooks = await this.webhookRepository.findByEvent(customerId, event);

    if (webhooks.length === 0) {
      logger.debug(`No webhooks subscribed to event ${event} for customer ${customerId}`);
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      customerId,
      data,
    };

    const payloadString = JSON.stringify(payload);

    // Create delivery records and send webhooks
    for (const webhook of webhooks) {
      try {
        // Create delivery record
        const delivery = await this.webhookRepository.createDelivery({
          webhookId: webhook.webhookId,
          event,
          payload: payloadString,
        });

        // Send webhook asynchronously (don't wait for response)
        this.sendWebhook(webhook, payload, delivery.deliveryId).catch((error) => {
          logger.error(`Failed to send webhook ${webhook.webhookId}`, { error });
        });
      } catch (error) {
        logger.error(`Failed to create webhook delivery for ${webhook.webhookId}`, { error });
      }
    }

    logger.info(`Triggered ${webhooks.length} webhooks for event ${event}`);
  }

  /**
   * Send webhook to endpoint
   */
  private async sendWebhook(
    webhook: Webhook,
    payload: WebhookPayload,
    deliveryId: number
  ): Promise<void> {
    const payloadString = JSON.stringify(payload);

    try {
      const response = await axios.post(webhook.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': this.generateSignature(payloadString, webhook.secret),
          'X-Webhook-Event': payload.event,
          'User-Agent': 'DigitalSignage-Webhook/1.0',
        },
        timeout: 30000, // 30 second timeout
      });

      // Update delivery as successful
      await this.webhookRepository.updateDelivery(
        deliveryId,
        response.status,
        response.data ? JSON.stringify(response.data) : null,
        true
      );

      logger.info(`Webhook delivery ${deliveryId} successful`, { statusCode: response.status });
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown }; message?: string };

      // Update delivery as failed
      await this.webhookRepository.updateDelivery(
        deliveryId,
        err.response?.status || 0,
        err.response?.data ? JSON.stringify(err.response.data) : err.message || 'Unknown error',
        false
      );

      logger.warn(`Webhook delivery ${deliveryId} failed`, {
        statusCode: err.response?.status,
        error: err.message,
      });
    }
  }

  /**
   * Get webhook deliveries
   */
  async getDeliveries(webhookId: number, customerId: number, limit: number = 50): Promise<WebhookDelivery[]> {
    // Validate webhook exists
    await this.getById(webhookId, customerId);

    return this.webhookRepository.getDeliveries(webhookId, limit);
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Validate URL format
   */
  private validateUrl(url: string): void {
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      throw new ValidationError('Invalid URL format');
    }
  }
}
