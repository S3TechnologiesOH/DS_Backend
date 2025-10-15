"use strict";
/**
 * Webhook Repository
 *
 * Database operations for webhooks and webhook deliveries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const errors_1 = require("../utils/errors");
class WebhookRepository extends BaseRepository_1.BaseRepository {
    /**
     * Find webhook by ID
     */
    async findById(webhookId, customerId) {
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
        return this.queryOne(sql, { webhookId, customerId });
    }
    /**
     * Find all webhooks for a customer
     */
    async findByCustomerId(customerId) {
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
        return this.queryMany(sql, { customerId });
    }
    /**
     * Find active webhooks subscribed to an event
     */
    async findByEvent(customerId, event) {
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
        return this.queryMany(sql, { customerId, event });
    }
    /**
     * Create new webhook
     */
    async create(data) {
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
        return this.insert(sql, {
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
    async update(webhookId, customerId, data) {
        const updates = [];
        const params = { webhookId, customerId };
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
        const result = await this.insert(sql, params);
        if (!result) {
            throw new errors_1.NotFoundError('Webhook not found');
        }
        return result;
    }
    /**
     * Delete webhook
     */
    async delete(webhookId, customerId) {
        const sql = `
      DELETE FROM Webhooks
      WHERE WebhookId = @webhookId AND CustomerId = @customerId
    `;
        const rowsAffected = await this.execute(sql, { webhookId, customerId });
        if (rowsAffected === 0) {
            throw new errors_1.NotFoundError('Webhook not found');
        }
    }
    /**
     * Create webhook delivery record
     */
    async createDelivery(data) {
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
        return this.insert(sql, {
            webhookId: data.webhookId,
            event: data.event,
            payload: data.payload,
        });
    }
    /**
     * Update webhook delivery status
     */
    async updateDelivery(deliveryId, statusCode, responseBody, isDelivered) {
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
    async getDeliveries(webhookId, limit = 50) {
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
        return this.queryMany(sql, { webhookId, limit });
    }
}
exports.WebhookRepository = WebhookRepository;
//# sourceMappingURL=WebhookRepository.js.map