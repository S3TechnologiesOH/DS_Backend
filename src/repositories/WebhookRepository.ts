/**
 * Webhook Repository
 *
 * Database operations for webhooks and webhook deliveries.
 */

import { BaseRepository } from './BaseRepository';
import {
  Webhook,
  WebhookDelivery,
  CreateWebhookDto,
  UpdateWebhookDto,
  WebhookEvent,
} from '../models';
import { NotFoundError } from '../utils/errors';

export class WebhookRepository extends BaseRepository {
  /**
   * Find webhook by ID
   */
  async findById(webhookId: number, customerId: number): Promise<Webhook | null> {
    const sql = `
      SELECT
        WebhookId as webhookId,
        CustomerId as customerId,
        Name as name,
        Url as url,
        Events as events,
        Secret as secret,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Webhooks
      WHERE WebhookId = @webhookId AND CustomerId = @customerId
    `;

    return this.queryOne<Webhook>(sql, { webhookId, customerId });
  }

  /**
   * Find all webhooks for a customer
   */
  async findByCustomerId(customerId: number): Promise<Webhook[]> {
    const sql = `
      SELECT
        WebhookId as webhookId,
        CustomerId as customerId,
        Name as name,
        Url as url,
        Events as events,
        Secret as secret,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Webhooks
      WHERE CustomerId = @customerId
      ORDER BY Name
    `;

    return this.queryMany<Webhook>(sql, { customerId });
  }

  /**
   * Find active webhooks subscribed to an event
   */
  async findByEvent(customerId: number, event: WebhookEvent): Promise<Webhook[]> {
    const sql = `
      SELECT
        WebhookId as webhookId,
        CustomerId as customerId,
        Name as name,
        Url as url,
        Events as events,
        Secret as secret,
        IsActive as isActive,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Webhooks
      WHERE CustomerId = @customerId
        AND IsActive = 1
        AND (Events LIKE '%' + @event + '%')
    `;

    return this.queryMany<Webhook>(sql, { customerId, event });
  }

  /**
   * Create new webhook
   */
  async create(data: CreateWebhookDto): Promise<Webhook> {
    const sql = `
      INSERT INTO Webhooks (CustomerId, Name, Url, Events, Secret, CreatedBy)
      OUTPUT
        INSERTED.WebhookId as webhookId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Url as url,
        INSERTED.Events as events,
        INSERTED.Secret as secret,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (@customerId, @name, @url, @events, @secret, @createdBy)
    `;

    return this.insert<Webhook>(sql, {
      customerId: data.customerId,
      name: data.name,
      url: data.url,
      events: data.events.join(','),
      secret: data.secret || '',
      createdBy: data.createdBy,
    });
  }

  /**
   * Update webhook
   */
  async update(webhookId: number, customerId: number, data: UpdateWebhookDto): Promise<Webhook> {
    const updates: string[] = [];
    const params: Record<string, unknown> = { webhookId, customerId };

    if (data.name !== undefined) {
      updates.push('Name = @name');
      params.name = data.name;
    }
    if (data.url !== undefined) {
      updates.push('Url = @url');
      params.url = data.url;
    }
    if (data.events !== undefined) {
      updates.push('Events = @events');
      params.events = data.events.join(',');
    }
    if (data.isActive !== undefined) {
      updates.push('IsActive = @isActive');
      params.isActive = data.isActive;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('UpdatedAt = GETUTCDATE()');

    const sql = `
      UPDATE Webhooks
      SET ${updates.join(', ')}
      OUTPUT
        INSERTED.WebhookId as webhookId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.Url as url,
        INSERTED.Events as events,
        INSERTED.Secret as secret,
        INSERTED.IsActive as isActive,
        INSERTED.CreatedBy as createdBy,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      WHERE WebhookId = @webhookId AND CustomerId = @customerId
    `;

    const result = await this.insert<Webhook>(sql, params);

    if (!result) {
      throw new NotFoundError('Webhook not found');
    }

    return result;
  }

  /**
   * Delete webhook
   */
  async delete(webhookId: number, customerId: number): Promise<void> {
    const sql = `
      DELETE FROM Webhooks
      WHERE WebhookId = @webhookId AND CustomerId = @customerId
    `;

    const rowsAffected = await this.execute(sql, { webhookId, customerId });

    if (rowsAffected === 0) {
      throw new NotFoundError('Webhook not found');
    }
  }

  /**
   * Create webhook delivery record
   */
  async createDelivery(data: {
    webhookId: number;
    event: WebhookEvent;
    payload: string;
  }): Promise<WebhookDelivery> {
    const sql = `
      INSERT INTO WebhookDeliveries (WebhookId, Event, Payload, AttemptCount, IsDelivered)
      OUTPUT
        INSERTED.DeliveryId as deliveryId,
        INSERTED.WebhookId as webhookId,
        INSERTED.Event as event,
        INSERTED.Payload as payload,
        INSERTED.StatusCode as statusCode,
        INSERTED.ResponseBody as responseBody,
        INSERTED.AttemptCount as attemptCount,
        INSERTED.IsDelivered as isDelivered,
        INSERTED.DeliveredAt as deliveredAt,
        INSERTED.NextRetryAt as nextRetryAt,
        INSERTED.CreatedAt as createdAt
      VALUES (@webhookId, @event, @payload, 0, 0)
    `;

    return this.insert<WebhookDelivery>(sql, {
      webhookId: data.webhookId,
      event: data.event,
      payload: data.payload,
    });
  }

  /**
   * Update webhook delivery status
   */
  async updateDelivery(
    deliveryId: number,
    statusCode: number,
    responseBody: string | null,
    isDelivered: boolean
  ): Promise<void> {
    const sql = `
      UPDATE WebhookDeliveries
      SET StatusCode = @statusCode,
          ResponseBody = @responseBody,
          AttemptCount = AttemptCount + 1,
          IsDelivered = @isDelivered,
          DeliveredAt = CASE WHEN @isDelivered = 1 THEN GETUTCDATE() ELSE DeliveredAt END,
          NextRetryAt = CASE WHEN @isDelivered = 0 THEN DATEADD(minute, POWER(2, AttemptCount + 1), GETUTCDATE()) ELSE NULL END
      WHERE DeliveryId = @deliveryId
    `;

    await this.execute(sql, { deliveryId, statusCode, responseBody, isDelivered });
  }

  /**
   * Get webhook deliveries
   */
  async getDeliveries(
    webhookId: number,
    limit: number = 50
  ): Promise<WebhookDelivery[]> {
    const sql = `
      SELECT TOP (@limit)
        DeliveryId as deliveryId,
        WebhookId as webhookId,
        Event as event,
        Payload as payload,
        StatusCode as statusCode,
        ResponseBody as responseBody,
        AttemptCount as attemptCount,
        IsDelivered as isDelivered,
        DeliveredAt as deliveredAt,
        NextRetryAt as nextRetryAt,
        CreatedAt as createdAt
      FROM WebhookDeliveries
      WHERE WebhookId = @webhookId
      ORDER BY CreatedAt DESC
    `;

    return this.queryMany<WebhookDelivery>(sql, { webhookId, limit });
  }
}
