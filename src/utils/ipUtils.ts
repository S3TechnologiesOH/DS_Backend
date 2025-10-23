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
export function getClientIp(req: Request): string {
  // Get the IP from Express (considers trust proxy settings and X-Forwarded-For)
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Remove port if present (handles both IPv4:port and [IPv6]:port formats)
  // Examples:
  // - "172.82.26.78:51048" -> "172.82.26.78"
  // - "[::1]:3000" -> "::1"
  // - "192.168.1.1" -> "192.168.1.1" (no change)
  const cleanedIp = ip.replace(/:\d+$/, '').replace(/^\[(.+)\]$/, '$1');

  return cleanedIp;
}
