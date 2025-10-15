/**
 * Webhook Controller
 *
 * Handles HTTP requests for webhook management endpoints.
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { WebhookService } from '../services/WebhookService';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    /**
     * GET /api/v1/webhooks
     * List all webhooks for the authenticated user's customer
     */
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/webhooks/:webhookId
     * Get webhook by ID
     */
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/webhooks
     * Create new webhook
     */
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/webhooks/:webhookId
     * Update webhook
     */
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/webhooks/:webhookId
     * Delete webhook
     */
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/webhooks/:webhookId/test
     * Test webhook
     */
    test(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/webhooks/:webhookId/deliveries
     * Get webhook deliveries
     */
    getDeliveries(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=WebhookController.d.ts.map