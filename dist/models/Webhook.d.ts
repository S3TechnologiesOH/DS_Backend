/**
 * Webhook Models
 *
 * Webhooks allow real-time notifications of events to external systems.
 */
export type WebhookEvent = 'player.online' | 'player.offline' | 'player.error' | 'content.created' | 'content.updated' | 'content.deleted' | 'playlist.created' | 'playlist.updated' | 'schedule.created' | 'schedule.updated' | 'site.created';
export interface Webhook {
    webhookId: number;
    customerId: number;
    name: string;
    url: string;
    events: string;
    secret: string;
    isActive: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface WebhookDelivery {
    deliveryId: number;
    webhookId: number;
    event: WebhookEvent;
    payload: string;
    statusCode: number | null;
    responseBody: string | null;
    attemptCount: number;
    isDelivered: boolean;
    deliveredAt: Date | null;
    nextRetryAt: Date | null;
    createdAt: Date;
}
export interface CreateWebhookDto {
    customerId: number;
    name: string;
    url: string;
    events: WebhookEvent[];
    secret?: string;
    createdBy: number;
}
export interface UpdateWebhookDto {
    name?: string;
    url?: string;
    events?: WebhookEvent[];
    isActive?: boolean;
}
export interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    customerId: number;
    data: Record<string, unknown>;
}
export interface WebhookTestResult {
    success: boolean;
    statusCode?: number;
    responseTime?: number;
    error?: string;
}
//# sourceMappingURL=Webhook.d.ts.map