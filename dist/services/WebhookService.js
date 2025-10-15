"use strict";
/**
 * Webhook Service
 *
 * Business logic for webhooks and event delivery.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class WebhookService {
    webhookRepository;
    constructor(webhookRepository) {
        this.webhookRepository = webhookRepository;
    }
    /**
     * Get webhook by ID
     */
    async getById(webhookId, customerId) {
        const webhook = await this.webhookRepository.findById(webhookId, customerId);
        if (!webhook) {
            throw new errors_1.NotFoundError('Webhook not found');
        }
        return webhook;
    }
    /**
     * List all webhooks for a customer
     */
    async list(customerId) {
        return this.webhookRepository.findByCustomerId(customerId);
    }
    /**
     * Create new webhook
     */
    async create(data) {
        // Validate URL
        this.validateUrl(data.url);
        // Generate secret if not provided
        if (!data.secret) {
            data.secret = crypto_1.default.randomBytes(32).toString('hex');
        }
        // Validate events
        if (!data.events || data.events.length === 0) {
            throw new errors_1.ValidationError('At least one event must be specified');
        }
        const webhook = await this.webhookRepository.create(data);
        logger_1.default.info(`Created webhook ${webhook.webhookId} for customer ${data.customerId}`);
        return webhook;
    }
    /**
     * Update webhook
     */
    async update(webhookId, customerId, data) {
        // Validate webhook exists
        await this.getById(webhookId, customerId);
        // Validate URL if provided
        if (data.url) {
            this.validateUrl(data.url);
        }
        // Validate events if provided
        if (data.events && data.events.length === 0) {
            throw new errors_1.ValidationError('At least one event must be specified');
        }
        const webhook = await this.webhookRepository.update(webhookId, customerId, data);
        logger_1.default.info(`Updated webhook ${webhookId}`);
        return webhook;
    }
    /**
     * Delete webhook
     */
    async delete(webhookId, customerId) {
        // Validate webhook exists
        await this.getById(webhookId, customerId);
        await this.webhookRepository.delete(webhookId, customerId);
        logger_1.default.info(`Deleted webhook ${webhookId}`);
    }
    /**
     * Test webhook by sending a test payload
     */
    async testWebhook(webhookId, customerId) {
        const webhook = await this.getById(webhookId, customerId);
        const testPayload = {
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
            const response = await axios_1.default.post(webhook.url, testPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': this.generateSignature(JSON.stringify(testPayload), webhook.secret),
                    'User-Agent': 'DigitalSignage-Webhook/1.0',
                },
                timeout: 10000, // 10 second timeout
            });
            const responseTime = Date.now() - startTime;
            logger_1.default.info(`Webhook test successful for ${webhookId}, status: ${response.status}`);
            return {
                success: true,
                statusCode: response.status,
                responseTime,
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            const err = error;
            logger_1.default.warn(`Webhook test failed for ${webhookId}`, { error: err.message });
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
    async triggerEvent(customerId, event, data) {
        // Find all active webhooks subscribed to this event
        const webhooks = await this.webhookRepository.findByEvent(customerId, event);
        if (webhooks.length === 0) {
            logger_1.default.debug(`No webhooks subscribed to event ${event} for customer ${customerId}`);
            return;
        }
        const payload = {
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
                    logger_1.default.error(`Failed to send webhook ${webhook.webhookId}`, { error });
                });
            }
            catch (error) {
                logger_1.default.error(`Failed to create webhook delivery for ${webhook.webhookId}`, { error });
            }
        }
        logger_1.default.info(`Triggered ${webhooks.length} webhooks for event ${event}`);
    }
    /**
     * Send webhook to endpoint
     */
    async sendWebhook(webhook, payload, deliveryId) {
        const payloadString = JSON.stringify(payload);
        try {
            const response = await axios_1.default.post(webhook.url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': this.generateSignature(payloadString, webhook.secret),
                    'X-Webhook-Event': payload.event,
                    'User-Agent': 'DigitalSignage-Webhook/1.0',
                },
                timeout: 30000, // 30 second timeout
            });
            // Update delivery as successful
            await this.webhookRepository.updateDelivery(deliveryId, response.status, response.data ? JSON.stringify(response.data) : null, true);
            logger_1.default.info(`Webhook delivery ${deliveryId} successful`, { statusCode: response.status });
        }
        catch (error) {
            const err = error;
            // Update delivery as failed
            await this.webhookRepository.updateDelivery(deliveryId, err.response?.status || 0, err.response?.data ? JSON.stringify(err.response.data) : err.message || 'Unknown error', false);
            logger_1.default.warn(`Webhook delivery ${deliveryId} failed`, {
                statusCode: err.response?.status,
                error: err.message,
            });
        }
    }
    /**
     * Get webhook deliveries
     */
    async getDeliveries(webhookId, customerId, limit = 50) {
        // Validate webhook exists
        await this.getById(webhookId, customerId);
        return this.webhookRepository.getDeliveries(webhookId, limit);
    }
    /**
     * Generate HMAC signature for webhook payload
     */
    generateSignature(payload, secret) {
        return crypto_1.default.createHmac('sha256', secret).update(payload).digest('hex');
    }
    /**
     * Validate URL format
     */
    validateUrl(url) {
        try {
            const parsedUrl = new URL(url);
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                throw new Error('Invalid protocol');
            }
        }
        catch {
            throw new errors_1.ValidationError('Invalid URL format');
        }
    }
}
exports.WebhookService = WebhookService;
//# sourceMappingURL=WebhookService.js.map