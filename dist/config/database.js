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
        requestTimeout: 30000,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    connectionTimeout: 15000,
};
//# sourceMappingURL=database.js.map