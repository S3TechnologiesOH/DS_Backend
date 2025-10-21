/**
 * Environment Configuration with Zod Validation
 *
 * Validates all required environment variables at startup.
 * Application will fail fast if any required variables are missing or invalid.
 */
import { z } from 'zod';
declare const envSchema: any;
export declare const env: any;
export type Environment = z.infer<typeof envSchema>;
export {};
//# sourceMappingURL=environment.d.ts.map