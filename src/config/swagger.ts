/**
 * Swagger/OpenAPI Configuration
 *
 * Configures API documentation using swagger-jsdoc
 * Access documentation at: /api-docs
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './environment';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Signage Platform API',
      version: '1.0.0',
      description:
        'Multi-tenant backend API for managing digital signage content across customers, sites, and players.',
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://digital-signage-backend.azurewebsites.net/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token from /auth/login endpoint',
        },
        playerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your player JWT token from /auth/player/login endpoint',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'An error occurred',
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
            },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            customerId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Acme Corporation',
            },
            subscriptionTier: {
              type: 'string',
              enum: ['Basic', 'Professional', 'Enterprise'],
              example: 'Enterprise',
            },
            maxSites: {
              type: 'integer',
              example: 100,
            },
            maxPlayers: {
              type: 'integer',
              example: 500,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Site: {
          type: 'object',
          properties: {
            siteId: {
              type: 'integer',
              example: 1,
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Main Street Store',
            },
            location: {
              type: 'string',
              example: '123 Main St, New York, NY 10001',
            },
            timezone: {
              type: 'string',
              example: 'America/New_York',
            },
            latitude: {
              type: 'number',
              format: 'double',
              example: 40.7128,
            },
            longitude: {
              type: 'number',
              format: 'double',
              example: -74.006,
            },
          },
        },
        Player: {
          type: 'object',
          properties: {
            playerId: {
              type: 'integer',
              example: 1,
            },
            siteId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Lobby Display',
            },
            deviceId: {
              type: 'string',
              example: 'DEVICE-12345',
            },
            status: {
              type: 'string',
              enum: ['Online', 'Offline', 'Error'],
              example: 'Online',
            },
            lastHeartbeat: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Content: {
          type: 'object',
          properties: {
            contentId: {
              type: 'integer',
              example: 1,
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Spring Sale Banner',
            },
            type: {
              type: 'string',
              enum: ['Image', 'Video', 'HTML', 'URL', 'PDF'],
              example: 'Image',
            },
            fileUrl: {
              type: 'string',
              example: 'https://storage.azure.com/content/image123.jpg',
            },
            duration: {
              type: 'integer',
              example: 10,
              description: 'Duration in seconds',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints for users and players',
      },
      {
        name: 'Customers',
        description: 'Customer management (Admin only)',
      },
      {
        name: 'Sites',
        description: 'Site management',
      },
      {
        name: 'Players',
        description: 'Player device management',
      },
      {
        name: 'Content',
        description: 'Media content management',
      },
      {
        name: 'Playlists',
        description: 'Playlist management',
      },
      {
        name: 'Schedules',
        description: 'Content scheduling',
      },
      {
        name: 'Users',
        description: 'User management',
      },
      {
        name: 'Analytics',
        description: 'Proof of play and analytics',
      },
    ],
  },
  // Path to route files with JSDoc comments
  apis: [
    './src/routes/*.ts',
    './src/routes/*.js', // Include compiled JS for production
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
