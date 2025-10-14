"use strict";
/**
 * Database Connection Pool Management
 *
 * Manages connection pool to Azure SQL Database using mssql.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = exports.isDatabaseConnected = exports.closeDatabase = exports.getDatabase = exports.initializeDatabase = void 0;
const mssql_1 = __importDefault(require("mssql"));
exports.sql = mssql_1.default;
const database_1 = require("../config/database");
const logger_1 = __importDefault(require("../utils/logger"));
const errors_1 = require("../utils/errors");
let pool = null;
/**
 * Initialize database connection pool
 */
const initializeDatabase = async () => {
    try {
        if (pool) {
            logger_1.default.info('Database connection pool already exists');
            return pool;
        }
        logger_1.default.info('Initializing database connection pool...');
        pool = await mssql_1.default.connect(database_1.databaseConfig);
        pool.on('error', (err) => {
            logger_1.default.error('Database pool error', { error: err });
        });
        logger_1.default.info('Database connection pool initialized successfully');
        return pool;
    }
    catch (error) {
        logger_1.default.error('Failed to initialize database connection pool', { error });
        throw new errors_1.DatabaseError('Failed to connect to database');
    }
};
exports.initializeDatabase = initializeDatabase;
/**
 * Get existing database connection pool
 */
const getDatabase = () => {
    if (!pool) {
        throw new errors_1.DatabaseError('Database pool not initialized. Call initializeDatabase() first.');
    }
    return pool;
};
exports.getDatabase = getDatabase;
/**
 * Close database connection pool
 */
const closeDatabase = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            logger_1.default.info('Database connection pool closed');
        }
    }
    catch (error) {
        logger_1.default.error('Error closing database connection pool', { error });
        throw error;
    }
};
exports.closeDatabase = closeDatabase;
/**
 * Check if database is connected
 */
const isDatabaseConnected = () => {
    return pool !== null && pool.connected;
};
exports.isDatabaseConnected = isDatabaseConnected;
//# sourceMappingURL=connection.js.map