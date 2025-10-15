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
        User: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              example: 1,
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            role: {
              type: 'string',
              enum: ['Admin', 'Editor', 'Viewer', 'SiteManager'],
              example: 'Editor',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            assignedSiteId: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
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
            contentType: {
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
            fileSize: {
              type: 'integer',
              example: 1024000,
              description: 'File size in bytes',
            },
            mimeType: {
              type: 'string',
              example: 'image/jpeg',
            },
            tags: {
              type: 'string',
              example: 'promotion,sale',
              nullable: true,
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Playlist: {
          type: 'object',
          properties: {
            playlistId: {
              type: 'integer',
              example: 1,
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Holiday Campaign',
            },
            description: {
              type: 'string',
              example: 'Content for holiday season',
              nullable: true,
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdBy: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        PlaylistItem: {
          type: 'object',
          properties: {
            playlistItemId: {
              type: 'integer',
              example: 1,
            },
            playlistId: {
              type: 'integer',
              example: 1,
            },
            contentId: {
              type: 'integer',
              example: 1,
            },
            displayOrder: {
              type: 'integer',
              example: 0,
            },
            duration: {
              type: 'integer',
              example: 10,
              nullable: true,
              description: 'Display duration in seconds',
            },
            transitionType: {
              type: 'string',
              enum: ['Fade', 'Slide', 'None'],
              example: 'Fade',
            },
            transitionDuration: {
              type: 'integer',
              example: 500,
              description: 'Transition duration in milliseconds',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Schedule: {
          type: 'object',
          properties: {
            scheduleId: {
              type: 'integer',
              example: 1,
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Morning Schedule',
            },
            playlistId: {
              type: 'integer',
              example: 1,
            },
            priority: {
              type: 'integer',
              example: 50,
              description: 'Priority 0-100, higher wins',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2025-01-01',
              nullable: true,
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2025-12-31',
              nullable: true,
            },
            startTime: {
              type: 'string',
              example: '09:00:00',
              nullable: true,
              description: 'Time in HH:mm:ss format',
            },
            endTime: {
              type: 'string',
              example: '17:00:00',
              nullable: true,
              description: 'Time in HH:mm:ss format',
            },
            daysOfWeek: {
              type: 'string',
              example: 'Mon,Tue,Wed,Thu,Fri',
              nullable: true,
              description: 'Comma-separated days',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdBy: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ScheduleAssignment: {
          type: 'object',
          properties: {
            assignmentId: {
              type: 'integer',
              example: 1,
            },
            scheduleId: {
              type: 'integer',
              example: 1,
            },
            assignmentType: {
              type: 'string',
              enum: ['Customer', 'Site', 'Player'],
              example: 'Player',
            },
            targetCustomerId: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            targetSiteId: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            targetPlayerId: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 20,
            },
            total: {
              type: 'integer',
              example: 100,
            },
            totalPages: {
              type: 'integer',
              example: 5,
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
