/**
 * Environment Configuration with Zod Validation
 *
 * Validates all required environment variables at startup.
 * Application will fail fast if any required variables are missing or invalid.
 */

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Environment validation schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),

  // Database
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('1433'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_ENCRYPT: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),

  // JWT Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Player Authentication
  PLAYER_JWT_SECRET: z.string().min(32, 'PLAYER_JWT_SECRET must be at least 32 characters'),
  PLAYER_JWT_EXPIRES_IN: z.string().default('30d'),

  // Azure Blob Storage
  AZURE_STORAGE_CONNECTION_STRING: z.string().min(1, 'AZURE_STORAGE_CONNECTION_STRING is required'),
  AZURE_STORAGE_CONTAINER: z.string().min(1, 'AZURE_STORAGE_CONTAINER is required'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  CORS_CREDENTIALS: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),

  // Logging
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  LOG_FILE_PATH: z.string().default('./logs'),

  // Player Configuration
  PLAYER_HEARTBEAT_TIMEOUT_MINUTES: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1))
    .default('5'),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('L Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

// Type-safe environment configuration
export type Environment = z.infer<typeof envSchema>;
