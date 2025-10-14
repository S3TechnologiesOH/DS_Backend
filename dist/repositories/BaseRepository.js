"use strict";
/**
 * Base Repository Class
 *
 * Provides common database operations for all repositories.
 * All repositories MUST extend this class to ensure consistent database access patterns.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const connection_1 = require("../database/connection");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class BaseRepository {
    /**
     * Execute a SELECT query that returns a single row
     */
    async queryOne(sql, params) {
        try {
            const pool = (0, connection_1.getDatabase)();
            const request = pool.request();
            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }
            const result = await request.query(sql);
            if (result.recordset.length === 0) {
                return null;
            }
            return result.recordset[0];
        }
        catch (error) {
            logger_1.default.error('Database query error (queryOne)', {
                sql,
                params,
                error,
            });
            throw new errors_1.DatabaseError('Database query failed');
        }
    }
    /**
     * Execute a SELECT query that returns multiple rows
     */
    async queryMany(sql, params) {
        try {
            const pool = (0, connection_1.getDatabase)();
            const request = pool.request();
            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }
            const result = await request.query(sql);
            return result.recordset;
        }
        catch (error) {
            logger_1.default.error('Database query error (queryMany)', {
                sql,
                params,
                error,
            });
            throw new errors_1.DatabaseError('Database query failed');
        }
    }
    /**
     * Execute an INSERT, UPDATE, or DELETE query
     * Returns the number of affected rows
     */
    async execute(sql, params) {
        try {
            const pool = (0, connection_1.getDatabase)();
            const request = pool.request();
            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }
            const result = await request.query(sql);
            return result.rowsAffected[0] || 0;
        }
        catch (error) {
            logger_1.default.error('Database execution error', {
                sql,
                params,
                error,
            });
            throw new errors_1.DatabaseError('Database operation failed');
        }
    }
    /**
     * Execute an INSERT query and return the inserted row
     */
    async insert(sql, params) {
        try {
            const pool = (0, connection_1.getDatabase)();
            const request = pool.request();
            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }
            const result = await request.query(sql);
            if (result.recordset.length === 0) {
                throw new errors_1.DatabaseError('Insert failed: no row returned');
            }
            return result.recordset[0];
        }
        catch (error) {
            logger_1.default.error('Database insert error', {
                sql,
                params,
                error,
            });
            throw new errors_1.DatabaseError('Database insert failed');
        }
    }
    /**
     * Execute a query with multiple result sets
     */
    async queryMultipleResultSets(sql, params) {
        try {
            const pool = (0, connection_1.getDatabase)();
            const request = pool.request();
            // Add parameters if provided
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    request.input(key, value);
                });
            }
            const result = await request.query(sql);
            return { recordsets: result.recordsets };
        }
        catch (error) {
            logger_1.default.error('Database query error (queryMultipleResultSets)', {
                sql,
                params,
                error,
            });
            throw new errors_1.DatabaseError('Database query failed');
        }
    }
    /**
     * Begin a transaction
     */
    async beginTransaction() {
        const pool = (0, connection_1.getDatabase)();
        const transaction = pool.transaction();
        await transaction.begin();
        return transaction;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map