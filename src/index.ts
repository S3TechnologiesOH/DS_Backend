/**
 * Application Entry Point
 *
 * Initializes database, Azure services, and starts Express server.
 */

import { createApp } from './app';
import { env } from './config/environment';
import { initializeDatabase, closeDatabase } from './database/connection';
import { initializeBlobStorage } from './config/azure';
import {
  handleUncaughtException,
  handleUnhandledRejection,
} from './middleware/errorHandler';
import logger from './utils/logger';

// Handle uncaught exceptions and unhandled rejections
handleUncaughtException();
handleUnhandledRejection();

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connection
    logger.info('Connecting to database...');
    await initializeDatabase();
    logger.info('Database connected successfully');

    // Initialize Azure Blob Storage
    logger.info('Initializing Azure Blob Storage...');
    initializeBlobStorage();
    logger.info('Azure Blob Storage initialized');

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(env.PORT, () => {
      logger.info(`Server started successfully`, {
        port: env.PORT,
        environment: env.NODE_ENV,
        nodeVersion: process.version,
      });
      logger.info(`Health check available at http://localhost:${env.PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await closeDatabase();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error });
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Start the server
startServer();
