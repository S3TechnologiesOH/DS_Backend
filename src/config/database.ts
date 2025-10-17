/**
 * Database Configuration for Azure SQL Database
 *
 * Provides connection configuration using mssql library.
 */

import { config as SqlConfig } from 'mssql';
import { env } from './environment';

export const databaseConfig: SqlConfig = {
  server: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  options: {
    encrypt: env.DB_ENCRYPT,
    trustServerCertificate: env.NODE_ENV === 'development',
    enableArithAbort: true,
    requestTimeout: 60000, // Increased to 60 seconds for Azure SQL
    connectTimeout: 30000, // Connection timeout
    instanceName: undefined, // Explicitly set for Azure SQL
    useUTC: true, // Use UTC timestamps
    abortTransactionOnError: true,
  },
  pool: {
    max: 10,
    min: 2, // Keep at least 2 connections alive for Azure SQL
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000, // Timeout for acquiring connection from pool
  },
  connectionTimeout: 30000, // Increased from 15s to 30s for Azure
};
