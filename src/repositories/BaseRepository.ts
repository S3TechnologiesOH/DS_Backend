/**
 * Base Repository Class
 *
 * Provides common database operations for all repositories.
 * All repositories MUST extend this class to ensure consistent database access patterns.
 */

import { IResult, IRecordSet } from 'mssql';
import { getDatabase } from '../database/connection';
import { DatabaseError } from '../utils/errors';
import logger from '../utils/logger';

export abstract class BaseRepository {
  /**
   * Execute a SELECT query that returns a single row
   */
  protected async queryOne<T>(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<T | null> {
    try {
      const pool = getDatabase();
      const request = pool.request();

      // Add parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result: IResult<T> = await request.query(sql);

      if (result.recordset.length === 0) {
        return null;
      }

      return result.recordset[0];
    } catch (error) {
      logger.error('Database query error (queryOne)', {
        sql,
        params,
        error,
      });
      throw new DatabaseError('Database query failed');
    }
  }

  /**
   * Execute a SELECT query that returns multiple rows
   */
  protected async queryMany<T>(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<T[]> {
    try {
      const pool = getDatabase();
      const request = pool.request();

      // Add parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result: IResult<T> = await request.query(sql);
      return result.recordset;
    } catch (error) {
      logger.error('Database query error (queryMany)', {
        sql,
        params,
        error,
      });
      throw new DatabaseError('Database query failed');
    }
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE query
   * Returns the number of affected rows
   */
  protected async execute(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<number> {
    try {
      const pool = getDatabase();
      const request = pool.request();

      // Add parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result: IResult<unknown> = await request.query(sql);
      return result.rowsAffected[0] || 0;
    } catch (error) {
      logger.error('Database execution error', {
        sql,
        params,
        error,
      });
      throw new DatabaseError('Database operation failed');
    }
  }

  /**
   * Execute an INSERT query and return the inserted row
   */
  protected async insert<T>(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    try {
      const pool = getDatabase();
      const request = pool.request();

      // Add parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result: IResult<T> = await request.query(sql);

      if (result.recordset.length === 0) {
        throw new DatabaseError('Insert failed: no row returned');
      }

      return result.recordset[0];
    } catch (error) {
      logger.error('Database insert error', {
        sql,
        params,
        error,
      });
      throw new DatabaseError('Database insert failed');
    }
  }

  /**
   * Execute a query with multiple result sets
   */
  protected async queryMultipleResultSets<T extends unknown[]>(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<{ recordsets: IRecordSet<T[number]>[] }> {
    try {
      const pool = getDatabase();
      const request = pool.request();

      // Add parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result = await request.query(sql);
      return { recordsets: result.recordsets };
    } catch (error) {
      logger.error('Database query error (queryMultipleResultSets)', {
        sql,
        params,
        error,
      });
      throw new DatabaseError('Database query failed');
    }
  }

  /**
   * Begin a transaction
   */
  protected async beginTransaction() {
    const pool = getDatabase();
    const transaction = pool.transaction();
    await transaction.begin();
    return transaction;
  }
}
