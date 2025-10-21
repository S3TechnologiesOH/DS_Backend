/**
 * Environment Configuration with Zod Validation
 *
 * Validates all required environment variables at startup.
 * Application will fail fast if any required variables are missing or invalid.
 */
import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    DB_HOST: z.ZodString;
    DB_PORT: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    DB_NAME: z.ZodString;
    DB_USER: z.ZodString;
    DB_PASSWORD: z.ZodString;
    DB_ENCRYPT: z.ZodDefault<z.ZodEffects<z.ZodString, boolean, string>>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_REFRESH_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    PLAYER_JWT_SECRET: z.ZodString;
    PLAYER_JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    AZURE_STORAGE_CONNECTION_STRING: z.ZodString;
    AZURE_STORAGE_CONTAINER: z.ZodString;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    CORS_CREDENTIALS: z.ZodDefault<z.ZodEffects<z.ZodString, boolean, string>>;
    RATE_LIMIT_WINDOW_MS: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    RATE_LIMIT_MAX_REQUESTS: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "http", "verbose", "debug", "silly"]>>;
    LOG_FILE_PATH: z.ZodDefault<z.ZodString>;
    PLAYER_HEARTBEAT_TIMEOUT_MINUTES: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: number;
    DB_HOST?: string;
    DB_PORT?: number;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_ENCRYPT?: boolean;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_REFRESH_EXPIRES_IN?: string;
    PLAYER_JWT_SECRET?: string;
    PLAYER_JWT_EXPIRES_IN?: string;
    AZURE_STORAGE_CONNECTION_STRING?: string;
    AZURE_STORAGE_CONTAINER?: string;
    CORS_ORIGIN?: string;
    CORS_CREDENTIALS?: boolean;
    RATE_LIMIT_WINDOW_MS?: number;
    RATE_LIMIT_MAX_REQUESTS?: number;
    LOG_LEVEL?: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
    LOG_FILE_PATH?: string;
    PLAYER_HEARTBEAT_TIMEOUT_MINUTES?: number;
}, {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_ENCRYPT?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_REFRESH_EXPIRES_IN?: string;
    PLAYER_JWT_SECRET?: string;
    PLAYER_JWT_EXPIRES_IN?: string;
    AZURE_STORAGE_CONNECTION_STRING?: string;
    AZURE_STORAGE_CONTAINER?: string;
    CORS_ORIGIN?: string;
    CORS_CREDENTIALS?: string;
    RATE_LIMIT_WINDOW_MS?: string;
    RATE_LIMIT_MAX_REQUESTS?: string;
    LOG_LEVEL?: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
    LOG_FILE_PATH?: string;
    PLAYER_HEARTBEAT_TIMEOUT_MINUTES?: string;
}>;
export declare const env: {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: number;
    DB_HOST?: string;
    DB_PORT?: number;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_ENCRYPT?: boolean;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_REFRESH_EXPIRES_IN?: string;
    PLAYER_JWT_SECRET?: string;
    PLAYER_JWT_EXPIRES_IN?: string;
    AZURE_STORAGE_CONNECTION_STRING?: string;
    AZURE_STORAGE_CONTAINER?: string;
    CORS_ORIGIN?: string;
    CORS_CREDENTIALS?: boolean;
    RATE_LIMIT_WINDOW_MS?: number;
    RATE_LIMIT_MAX_REQUESTS?: number;
    LOG_LEVEL?: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
    LOG_FILE_PATH?: string;
    PLAYER_HEARTBEAT_TIMEOUT_MINUTES?: number;
};
export type Environment = z.infer<typeof envSchema>;
export {};
//# sourceMappingURL=environment.d.ts.map