"use strict";
/**
 * Environment Configuration with Zod Validation
 *
 * Validates all required environment variables at startup.
 * Application will fail fast if any required variables are missing or invalid.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
// Environment validation schema
const envSchema = zod_1.z.object({
    // Application
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(65535)).default('3000'),
    // Database
    DB_HOST: zod_1.z.string().min(1, 'DB_HOST is required'),
    DB_PORT: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(65535)).default('1433'),
    DB_NAME: zod_1.z.string().min(1, 'DB_NAME is required'),
    DB_USER: zod_1.z.string().min(1, 'DB_USER is required'),
    DB_PASSWORD: zod_1.z.string().min(1, 'DB_PASSWORD is required'),
    DB_ENCRYPT: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .default('true'),
    // JWT Authentication
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('1h'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Player Authentication
    PLAYER_JWT_SECRET: zod_1.z.string().min(32, 'PLAYER_JWT_SECRET must be at least 32 characters'),
    PLAYER_JWT_EXPIRES_IN: zod_1.z.string().default('30d'),
    // Azure Blob Storage
    AZURE_STORAGE_CONNECTION_STRING: zod_1.z.string().min(1, 'AZURE_STORAGE_CONNECTION_STRING is required'),
    AZURE_STORAGE_CONTAINER: zod_1.z.string().min(1, 'AZURE_STORAGE_CONTAINER is required'),
    // CORS
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3001'),
    CORS_CREDENTIALS: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .default('true'),
    // Logging
    LOG_LEVEL: zod_1.z
        .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
        .default('info'),
    LOG_FILE_PATH: zod_1.z.string().default('./logs'),
    // Player Configuration
    PLAYER_HEARTBEAT_TIMEOUT_MINUTES: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().min(1))
        .default('5'),
});
// Validate and parse environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('L Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};
exports.env = parseEnv();
//# sourceMappingURL=environment.js.map