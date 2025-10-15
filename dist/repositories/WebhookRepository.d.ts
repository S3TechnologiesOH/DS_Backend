/**
 * Webhook Repository
 *
 * Database operations for webhooks and webhook deliveries.
 */
import { BaseRepository } from './BaseRepository';
import { Webhook, WebhookDelivery, CreateWebhookDto, UpdateWebhookDto, WebhookEvent } from '../models';
export declare class WebhookRepository extends BaseRepository {
    /**
     * Find webhook by ID
     */
    findById(webhookId: number, customerId: number): Promise<Webhook | null>;
    /**
     * Find all webhooks for a customer
     */
    findByCustomerId(customerId: number): Promise<Webhook[]>;
    /**
     * Find active webhooks subscribed to an event
     */
    findByEvent(customerId: number, event: WebhookEvent): Promise<Webhook[]>;
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
     * Create webhook delivery record
     */
    createDelivery(data: {
        webhookId: number;
        event: WebhookEvent;
        payload: string;
    }): Promise<WebhookDelivery>;
    /**
     * Update webhook delivery status
     */
    updateDelivery(deliveryId: number, statusCode: number, responseBody: string | null, isDelivered: boolean): Promise<void>;
    /**
     * Get webhook deliveries
     */
    getDeliveries(webhookId: number, limit?: number): Promise<WebhookDelivery[]>;
}
//# sourceMappingURL=WebhookRepository.d.ts.map