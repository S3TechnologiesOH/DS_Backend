/**
 * Database Connection Pool Management
 *
 * Manages connection pool to Azure SQL Database using mssql.
 */
import sql, { ConnectionPool } from 'mssql';
/**
 * Initialize database connection pool with retry logic
 */
export declare const initializeDatabase: (maxRetries?: number, retryDelay?: number) => Promise<ConnectionPool>;
/**
 * Get existing database connection pool
 */
export declare const getDatabase: () => ConnectionPool;
/**
 * Close database connection pool
 */
export declare const closeDatabase: () => Promise<void>;
/**
 * Check if database is connected
 */
export declare const isDatabaseConnected: () => boolean;
export { sql };
//# sourceMappingURL=connection.d.ts.map