/**
 * Database Connection Pool Management
 *
 * Manages connection pool to Azure SQL Database using mssql.
 */

import sql, { ConnectionPool } from 'mssql';
import { databaseConfig } from '../config/database';
import logger from '../utils/logger';
import { DatabaseError } from '../utils/errors';

let pool: ConnectionPool | null = null;

/**
 * Initialize database connection pool with retry logic
 */
export const initializeDatabase = async (maxRetries = 5, retryDelay = 3000): Promise<ConnectionPool> => {
  if (pool) {
    logger.info('Database connection pool already exists');
    return pool;
  }

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`Initializing database connection pool (attempt ${attempt}/${maxRetries})...`);
      pool = await sql.connect(databaseConfig);

      pool.on('error', (err) => {
        logger.error('Database pool error', { error: err });
      });

      logger.info('Database connection pool initialized successfully');
      return pool;
    } catch (error) {
      lastError = error;
      logger.warn(`Database connection attempt ${attempt} failed`, { error });

      if (attempt < maxRetries) {
        logger.info(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        // Exponential backoff: increase delay for next retry
        retryDelay = Math.min(retryDelay * 1.5, 15000);
      }
    }
  }

  logger.error('Failed to initialize database connection pool after all retries', { error: lastError });
  throw new DatabaseError('Failed to connect to database after multiple attempts');
};

/**
 * Get existing database connection pool
 */
export const getDatabase = (): ConnectionPool => {
  if (!pool) {
    throw new DatabaseError('Database pool not initialized. Call initializeDatabase() first.');
  }
  return pool;
};

/**
 * Close database connection pool
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      logger.info('Database connection pool closed');
    }
  } catch (error) {
    logger.error('Error closing database connection pool', { error });
    throw error;
  }
};

/**
 * Check if database is connected
 */
export const isDatabaseConnected = (): boolean => {
  return pool !== null && pool.connected;
};

export { sql };
