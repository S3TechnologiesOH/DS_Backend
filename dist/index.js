"use strict";
/**
 * Application Entry Point
 *
 * Initializes database, Azure services, and starts Express server.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const environment_1 = require("./config/environment");
const connection_1 = require("./database/connection");
const azure_1 = require("./config/azure");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
// Handle uncaught exceptions and unhandled rejections
(0, errorHandler_1.handleUncaughtException)();
(0, errorHandler_1.handleUnhandledRejection)();
/**
 * Start the server
 */
const startServer = async () => {
    try {
        // Initialize database connection
        logger_1.default.info('Connecting to database...');
        await (0, connection_1.initializeDatabase)();
        logger_1.default.info('Database connected successfully');
        // Initialize Azure Blob Storage
        logger_1.default.info('Initializing Azure Blob Storage...');
        (0, azure_1.initializeBlobStorage)();
        logger_1.default.info('Azure Blob Storage initialized');
        // Create Express app
        const app = (0, app_1.createApp)();
        // Start listening
        const server = app.listen(environment_1.env.PORT, () => {
            logger_1.default.info(`Server started successfully`, {
                port: environment_1.env.PORT,
                environment: environment_1.env.NODE_ENV,
                nodeVersion: process.version,
            });
            logger_1.default.info(`Health check available at http://localhost:${environment_1.env.PORT}/health`);
        });
        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            logger_1.default.info(`${signal} received, starting graceful shutdown...`);
            server.close(async () => {
                logger_1.default.info('HTTP server closed');
                try {
                    await (0, connection_1.closeDatabase)();
                    logger_1.default.info('Database connection closed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.default.error('Error during shutdown', { error });
                    process.exit(1);
                }
            });
            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger_1.default.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        // Listen for termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        logger_1.default.error('Failed to start server', { error });
        process.exit(1);
    }
};
// Start the server
startServer();
//# sourceMappingURL=index.js.map