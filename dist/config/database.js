"use strict";
/**
 * Database Configuration for Azure SQL Database
 *
 * Provides connection configuration using mssql library.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const environment_1 = require("./environment");
exports.databaseConfig = {
    server: environment_1.env.DB_HOST,
    port: environment_1.env.DB_PORT,
    database: environment_1.env.DB_NAME,
    user: environment_1.env.DB_USER,
    password: environment_1.env.DB_PASSWORD,
    options: {
        encrypt: environment_1.env.DB_ENCRYPT,
        trustServerCertificate: environment_1.env.NODE_ENV === 'development',
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
//# sourceMappingURL=database.js.map