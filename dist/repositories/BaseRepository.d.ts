/**
 * Base Repository Class
 *
 * Provides common database operations for all repositories.
 * All repositories MUST extend this class to ensure consistent database access patterns.
 */
import { IRecordSet } from 'mssql';
export declare abstract class BaseRepository {
    /**
     * Execute a SELECT query that returns a single row
     */
    protected queryOne<T>(sql: string, params?: Record<string, unknown>): Promise<T | null>;
    /**
     * Execute a SELECT query that returns multiple rows
     */
    protected queryMany<T>(sql: string, params?: Record<string, unknown>): Promise<T[]>;
    /**
     * Execute an INSERT, UPDATE, or DELETE query
     * Returns the number of affected rows
     */
    protected execute(sql: string, params?: Record<string, unknown>): Promise<number>;
    /**
     * Execute an INSERT query and return the inserted row
     */
    protected insert<T>(sql: string, params?: Record<string, unknown>): Promise<T>;
    /**
     * Execute a query with multiple result sets
     */
    protected queryMultipleResultSets<T extends unknown[]>(sql: string, params?: Record<string, unknown>): Promise<{
        recordsets: IRecordSet<T[number]>[];
    }>;
    /**
     * Begin a transaction
     */
    protected beginTransaction(): Promise<import("mssql").Transaction>;
}
//# sourceMappingURL=BaseRepository.d.ts.map