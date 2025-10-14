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
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 15000,
};
