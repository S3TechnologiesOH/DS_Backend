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
        ProofOfPlay: {
          type: 'object',
          properties: {
            proofOfPlayId: {
              type: 'integer',
              example: 1,
            },
            playerId: {
              type: 'integer',
              example: 1,
            },
            contentId: {
              type: 'integer',
              example: 5,
            },
            playlistId: {
              type: 'integer',
              nullable: true,
              example: 3,
            },
            scheduleId: {
              type: 'integer',
              nullable: true,
              example: 2,
            },
            playbackStartTime: {
              type: 'string',
              format: 'date-time',
            },
            playbackEndTime: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            duration: {
              type: 'integer',
              example: 30,
              description: 'Playback duration in seconds',
            },
          },
        },
        AnalyticsSummary: {
          type: 'object',
          properties: {
            totalPlays: {
              type: 'integer',
              example: 1234,
            },
            totalDuration: {
              type: 'integer',
              example: 45600,
              description: 'Total duration in seconds',
            },
            uniquePlayers: {
              type: 'integer',
              example: 25,
            },
            uniqueContent: {
              type: 'integer',
              example: 150,
            },
            activeSites: {
              type: 'integer',
              example: 10,
            },
          },
        },
        ContentAnalytics: {
          type: 'object',
          properties: {
            contentId: {
              type: 'integer',
              example: 5,
            },
            contentName: {
              type: 'string',
              example: 'Spring Sale Banner',
            },
            totalPlays: {
              type: 'integer',
              example: 245,
            },
            totalDuration: {
              type: 'integer',
              example: 7350,
              description: 'Total duration in seconds',
            },
            uniquePlayers: {
              type: 'integer',
              example: 15,
            },
            lastPlayedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        PlayerAnalytics: {
          type: 'object',
          properties: {
            playerId: {
              type: 'integer',
              example: 1,
            },
            playerName: {
              type: 'string',
              example: 'Lobby Display',
            },
            siteId: {
              type: 'integer',
              example: 1,
            },
            siteName: {
              type: 'string',
              example: 'Main Street Store',
            },
            status: {
              type: 'string',
              enum: ['Online', 'Offline', 'Error'],
              example: 'Online',
            },
            totalPlays: {
              type: 'integer',
              example: 156,
            },
            lastHeartbeat: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SiteAnalytics: {
          type: 'object',
          properties: {
            siteId: {
              type: 'integer',
              example: 1,
            },
            siteName: {
              type: 'string',
              example: 'Main Street Store',
            },
            totalPlayers: {
              type: 'integer',
              example: 5,
            },
            onlinePlayers: {
              type: 'integer',
              example: 4,
            },
            totalPlays: {
              type: 'integer',
              example: 780,
            },
          },
        },
        PlaybackReport: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              example: '2025-01-15',
            },
            totalPlays: {
              type: 'integer',
              example: 156,
            },
            totalDuration: {
              type: 'integer',
              example: 4680,
              description: 'Total duration in seconds',
            },
            uniquePlayers: {
              type: 'integer',
              example: 12,
            },
            uniqueContent: {
              type: 'integer',
              example: 45,
            },
          },
        },
        ContentPerformance: {
          type: 'object',
          properties: {
            contentId: {
              type: 'integer',
              example: 5,
            },
            contentName: {
              type: 'string',
              example: 'Spring Sale Banner',
            },
            contentType: {
              type: 'string',
              enum: ['Image', 'Video', 'HTML', 'URL', 'PDF'],
              example: 'Image',
            },
            totalPlays: {
              type: 'integer',
              example: 245,
            },
            avgDuration: {
              type: 'number',
              format: 'float',
              example: 28.5,
              description: 'Average playback duration in seconds',
            },
            completionRate: {
              type: 'number',
              format: 'float',
              example: 0.95,
              description: 'Completion rate (0-1)',
            },
          },
        },
        Webhook: {
          type: 'object',
          properties: {
            webhookId: {
              type: 'integer',
              example: 1,
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Production Webhook',
            },
            url: {
              type: 'string',
              format: 'uri',
              example: 'https://api.example.com/webhooks/digital-signage',
            },
            events: {
              type: 'string',
              example: 'player.online,player.offline,content.created',
              description: 'Comma-separated list of subscribed events',
            },
            secret: {
              type: 'string',
              example: 'abc123def456',
              description: 'Secret key for HMAC signature verification',
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
        WebhookDelivery: {
          type: 'object',
          properties: {
            deliveryId: {
              type: 'integer',
              example: 1,
            },
            webhookId: {
              type: 'integer',
              example: 1,
            },
            event: {
              type: 'string',
              example: 'player.online',
            },
            payload: {
              type: 'string',
              example: '{"event":"player.online","timestamp":"2025-01-15T10:30:00Z","customerId":1,"data":{...}}',
              description: 'JSON payload sent to webhook',
            },
            statusCode: {
              type: 'integer',
              nullable: true,
              example: 200,
            },
            responseBody: {
              type: 'string',
              nullable: true,
              example: '{"status":"ok"}',
            },
            attemptCount: {
              type: 'integer',
              example: 1,
            },
            isDelivered: {
              type: 'boolean',
              example: true,
            },
            deliveredAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            nextRetryAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        WebhookTestResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            statusCode: {
              type: 'integer',
              example: 200,
            },
            responseTime: {
              type: 'integer',
              example: 245,
              description: 'Response time in milliseconds',
            },
            error: {
              type: 'string',
              nullable: true,
              example: null,
            },
          },
        },
        WebhookPayload: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              example: 'player.online',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-15T10:30:00Z',
            },
            customerId: {
              type: 'integer',
              example: 1,
            },
            data: {
              type: 'object',
              description: 'Event-specific data',
              example: {
                playerId: 5,
                playerName: 'Lobby Display',
                siteId: 2,
              },
            },
          },
        },
        PlayerActivationResponse: {
          type: 'object',
          properties: {
            playerId: {
              type: 'integer',
              example: 42,
              description: 'ID of the activated player',
            },
            customerId: {
              type: 'integer',
              example: 1,
              description: 'Customer ID the player belongs to',
            },
            siteId: {
              type: 'integer',
              example: 5,
              description: 'Site ID where player is located',
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT access token (expires in 1 hour)',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT refresh token (expires in 30 days)',
            },
            expiresIn: {
              type: 'integer',
              example: 3600,
              description: 'Access token expiration time in seconds',
            },
          },
        },
        PlayerTokenRefreshResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'New JWT access token',
            },
            expiresIn: {
              type: 'integer',
              example: 3600,
              description: 'Token expiration time in seconds',
            },
          },
        },
        ActivationCodeResponse: {
          type: 'object',
          properties: {
            activationCode: {
              type: 'string',
              example: 'ABC123',
              description: '6-character activation code',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-18T14:30:00.000Z',
              description: 'When the activation code expires (24 hours)',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
        description: 'Authentication endpoints for CMS users',
      },
      {
        name: 'Player Authentication',
        description: 'Authentication endpoints for player devices',
      },
      {
        name: 'Player Devices',
        description: 'Operational endpoints for player devices (schedule, heartbeat, proof-of-play)',
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
        description: 'Player device management (CMS)',
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
      {
        name: 'Webhooks',
        description: 'Webhook event notifications',
      },
    ],
  },
  // Path to route files with JSDoc comments
  apis: [
    './src/routes/*.ts',      // Development: TypeScript source files
    './dist/routes/*.js',     // Production: Compiled JavaScript files
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
