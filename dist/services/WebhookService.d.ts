/**
 * Webhook Service
 *
 * Business logic for webhooks and event delivery.
 */
import { WebhookRepository } from '../repositories/WebhookRepository';
import { Webhook, WebhookDelivery, CreateWebhookDto, UpdateWebhookDto, WebhookEvent, WebhookTestResult } from '../models';
export declare class WebhookService {
    private readonly webhookRepository;
    constructor(webhookRepository: WebhookRepository);
    /**
     * Get webhook by ID
     */
    getById(webhookId: number, customerId: number): Promise<Webhook>;
    /**
     * List all webhooks for a customer
     */
    list(customerId: number): Promise<Webhook[]>;
    /**
     * Create new webhook
     */
    create(data: CreateWebhookDto): Promise<Webhook>;
    /**
     * Update webhook
     */
    update(webhookId: number, customerId: number, data: UpdateWebhookDto): Promise<Webhook>;
    /**
     * Delete webhook
     */
    delete(webhookId: number, customerId: number): Promise<void>;
    /**
     * Test webhook by sending a test payload
     */
    testWebhook(webhookId: number, customerId: number): Promise<WebhookTestResult>;
    /**
     * Trigger webhook event
     * This is called internally when events occur
     */
    triggerEvent(customerId: number, event: WebhookEvent, data: Record<string, unknown>): Promise<void>;
    /**
     * Send webhook to endpoint
     */
    private sendWebhook;
    /**
     * Get webhook deliveries
     */
    getDeliveries(webhookId: number, customerId: number, limit?: number): Promise<WebhookDelivery[]>;
    /**
     * Generate HMAC signature for webhook payload
     */
    private generateSignature;
    /**
     * Validate URL format
     */
    private validateUrl;
}
//# sourceMappingURL=WebhookService.d.ts.map