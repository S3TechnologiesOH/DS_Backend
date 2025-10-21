/**
 * Winston Logger Configuration for Digital Signage Platform
 *
 * Provides structured logging with different levels and transports.
 * NEVER log sensitive data (passwords, tokens, API keys, etc.)
 */
import winston from 'winston';
declare const logger: winston.Logger;
export declare const sanitizeLogData: (data: Record<string, unknown>) => Record<string, unknown>;
export default logger;
//# sourceMappingURL=logger.d.ts.map