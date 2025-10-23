import type { Request } from 'express';
/**
 * Extracts and cleans the client IP address from the request
 * Removes port numbers if present (e.g., "172.82.26.78:51048" -> "172.82.26.78")
 *
 * This is necessary because Azure App Service and some reverse proxies
 * may include the port in the IP address, which causes issues with
 * IP validation and rate limiting.
 *
 * @param req - Express request object
 * @returns Clean IP address without port number
 */
export declare function getClientIp(req: Request): string;
//# sourceMappingURL=ipUtils.d.ts.map