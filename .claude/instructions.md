Backend Development Instructions for Claude Code
Technology Choice: TypeScript
Use TypeScript (strongly recommended) for the following reasons:

Type Safety: Prevents runtime errors and catches bugs at compile time
Better IDE Support: Autocomplete, refactoring, and navigation
Self-Documenting: Interfaces and types serve as inline documentation
Scalability: Essential for large codebases and team collaboration
Maintainability: Easier to refactor and understand code over time
Azure SDK Compatibility: All Azure SDKs have excellent TypeScript support

Do NOT use JavaScript - the type safety and developer experience benefits of TypeScript are critical for a project of this scale.

Project Setup and Configuration
Required Configuration Files
json// package.json
{
  "name": "digital-signage-backend",
  "version": "1.0.0",
  "description": "Digital Signage Platform Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "migrate": "node dist/database/migrate.js"
  },
  "keywords": ["digital-signage", "cms", "api"],
  "author": "",
  "license": "MIT"
}
json// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
json// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
json// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

---

## **Core Architecture Principles**

### **1. Layered Architecture (MANDATORY)**

The application MUST follow a strict layered architecture with clear separation of concerns:
```
src/
├── index.ts                    # Application entry point
├── config/                     # Configuration management
│   ├── database.ts
│   ├── azure.ts
│   ├── swagger.ts             # Swagger/OpenAPI configuration
│   └── environment.ts
├── routes/                     # HTTP route definitions (thin layer)
│   ├── index.ts
│   ├── auth.routes.ts
│   ├── content.routes.ts
│   ├── player.routes.ts
│   ├── site.routes.ts
│   └── playlist.routes.ts
├── controllers/                # Request/response handling
│   ├── auth.controller.ts
│   ├── content.controller.ts
│   ├── player.controller.ts
│   ├── site.controller.ts
│   └── playlist.controller.ts
├── services/                   # Business logic (core of application)
│   ├── auth.service.ts
│   ├── content.service.ts
│   ├── player.service.ts
│   ├── site.service.ts
│   ├── playlist.service.ts
│   └── schedule.service.ts
├── repositories/               # Database access layer
│   ├── base.repository.ts
│   ├── content.repository.ts
│   ├── player.repository.ts
│   ├── site.repository.ts
│   └── playlist.repository.ts
├── middleware/                 # Express middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validation.middleware.ts
│   └── logging.middleware.ts
├── models/                     # TypeScript interfaces and types
│   ├── content.model.ts
│   ├── player.model.ts
│   ├── site.model.ts
│   ├── playlist.model.ts
│   └── user.model.ts
├── validators/                 # Input validation schemas
│   ├── content.validator.ts
│   ├── player.validator.ts
│   ├── site.validator.ts
│   └── playlist.validator.ts
├── utils/                      # Utility functions
│   ├── logger.ts
│   ├── errors.ts
│   └── helpers.ts
├── database/                   # Database connection and migrations
│   ├── connection.ts
│   ├── migrations/
│   └── seeds/
├── docs/                       # API documentation (auto-generated)
│   └── swagger.json           # Generated OpenAPI spec
└── types/                      # Global TypeScript type definitions
    └── express.d.ts
Layer Communication Rules:

Routes → Controllers → Services → Repositories → Database
NEVER skip layers (e.g., Routes should NEVER call Services directly)
NEVER have circular dependencies between layers
Each layer should only know about the layer directly below it
Repositories return domain models, NOT raw database rows

2. Dependency Injection Pattern
Use constructor-based dependency injection for all services and repositories:
typescript// ❌ BAD - Hard-coded dependencies
class ContentService {
  private repository = new ContentRepository();
  
  async getContent(id: number) {
    return this.repository.findById(id);
  }
}

// ✅ GOOD - Dependency injection
class ContentService {
  constructor(private readonly contentRepository: ContentRepository) {}
  
  async getContent(id: number): Promise<Content | null> {
    return this.contentRepository.findById(id);
  }
}
3. Interface-Based Design
Define interfaces for all repositories and services:
typescript// models/content.model.ts
export interface Content {
  contentId: number;
  customerId: number;
  name: string;
  contentType: ContentType;
  fileUrl: string;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContentType {
  Image = 'Image',
  Video = 'Video',
  HTML = 'HTML',
  URL = 'URL',
  PDF = 'PDF',
}

export enum ContentStatus {
  Processing = 'Processing',
  Ready = 'Ready',
  Failed = 'Failed',
}

// repositories/content.repository.interface.ts
export interface IContentRepository {
  findById(id: number, customerId: number): Promise<Content | null>;
  findByCustomer(customerId: number): Promise<Content[]>;
  create(data: CreateContentDto): Promise<Content>;
  update(id: number, data: UpdateContentDto): Promise<Content>;
  delete(id: number, customerId: number): Promise<boolean>;
}

Dependency Management Rules
Allowed Core Dependencies ONLY:
json{
  "dependencies": {
    // Core framework
    "express": "^4.18.0",
    
    // Database
    "mssql": "^10.0.0",  // Azure SQL Database driver
    
    // Azure services
    "@azure/storage-blob": "^12.17.0",
    "@azure/identity": "^4.0.0",
    
    // Authentication
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    
    // Validation
    "zod": "^3.22.0",  // Type-safe validation
    
    // Environment
    "dotenv": "^16.3.0",
    
    // API Documentation (REQUIRED)
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    
    // Date handling (if needed)
    "date-fns": "^2.30.0",
    
    // File uploads
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    // TypeScript
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    
    // Development tools
    "tsx": "^4.7.0",  // TypeScript execution
    
    // Linting and formatting
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.18.0",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "prettier": "^3.1.0",
    
    // Testing
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0"
  }
}
Dependency Rules:

NEVER install a dependency without justification
Document WHY each dependency is needed in comments
Prefer native Node.js features over external libraries when possible
Avoid "convenience" libraries that add unnecessary bloat
Do NOT use:

Lodash (use native JS array methods)
Moment.js (use date-fns or native Date)
Request (deprecated, use native fetch)
Heavy ORMs like TypeORM or Sequelize (write raw SQL with mssql)
Express generators or boilerplates
Unnecessary middleware packages


Before adding ANY new dependency:

Check if native JavaScript/TypeScript can solve it
Check the package size and weekly downloads
Check when it was last updated
Verify it has TypeScript definitions
Document the reason in code comments




API Documentation with Swagger (MANDATORY)
Swagger Setup
Every API endpoint MUST be documented with Swagger/OpenAPI specifications.
typescript// config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './environment';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Signage Platform API',
      version: '1.0.0',
      description: 'API documentation for the Digital Signage Platform',
      contact: {
        name: 'API Support',
        email: 'support@digitalsignage.com',
      },
    },
    servers: [
      {
        url: env.NODE_ENV === 'production' 
          ? 'https://api.digitalsignage.com' 
          : `http://localhost:${env.PORT}`,
        description: env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['error'],
            },
            message: {
              type: 'string',
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
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to API docs
};

export const swaggerSpec = swaggerJsdoc(options);
typescript// src/index.ts - Add Swagger middleware
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

// Swagger documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Digital Signage API Docs',
}));

// Export OpenAPI spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ... rest of app setup
Swagger Documentation Standards
EVERY route MUST include:

Summary (brief description)
Description (detailed explanation)
Parameters (path, query, body)
Request body schema (if applicable)
Response schemas (success and error cases)
Security requirements
Tags for grouping

Example: Documented Route
typescript// routes/content.routes.ts
import { Router } from 'express';
import { ContentController } from '../controllers/content.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createContentSchema, updateContentSchema } from '../validators/content.validator';

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - contentId
 *         - customerId
 *         - name
 *         - contentType
 *         - status
 *       properties:
 *         contentId:
 *           type: integer
 *           description: Unique content identifier
 *         customerId:
 *           type: integer
 *           description: Customer ID that owns this content
 *         name:
 *           type: string
 *           description: Content name
 *         description:
 *           type: string
 *           description: Content description
 *         contentType:
 *           type: string
 *           enum: [Image, Video, HTML, URL, PDF]
 *           description: Type of content
 *         fileUrl:
 *           type: string
 *           format: uri
 *           description: Azure Blob Storage URL
 *         thumbnailUrl:
 *           type: string
 *           format: uri
 *           description: Thumbnail image URL
 *         fileSize:
 *           type: integer
 *           description: File size in bytes
 *         duration:
 *           type: integer
 *           description: Duration in seconds (for videos)
 *         status:
 *           type: string
 *           enum: [Processing, Ready, Failed]
 *           description: Content processing status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         contentId: 1
 *         customerId: 1
 *         name: "Holiday Promotion"
 *         contentType: "Video"
 *         fileUrl: "https://storage.blob.core.windows.net/content/video.mp4"
 *         status: "Ready"
 *         duration: 30
 *     
 *     CreateContentRequest:
 *       type: object
 *       required:
 *         - name
 *         - contentType
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         description:
 *           type: string
 *         contentType:
 *           type: string
 *           enum: [Image, Video, HTML, URL, PDF]
 *         duration:
 *           type: integer
 *           minimum: 1
 */

export const createContentRoutes = (controller: ContentController): Router => {
  const router = Router();

  router.use(authenticate);

  /**
   * @swagger
   * /api/content:
   *   get:
   *     summary: List all content
   *     description: Retrieve all content items for the authenticated customer
   *     tags: [Content]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Number of items per page
   *       - in: query
   *         name: contentType
   *         schema:
   *           type: string
   *           enum: [Image, Video, HTML, URL, PDF]
   *         description: Filter by content type
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [Processing, Ready, Failed]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of content items
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Content'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', controller.list.bind(controller));

  /**
   * @swagger
   * /api/content/{id}:
   *   get:
   *     summary: Get content by ID
   *     description: Retrieve a specific content item by its ID
   *     tags: [Content]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Content ID
   *     responses:
   *       200:
   *         description: Content details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Content'
   *       404:
   *         description: Content not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Content belongs to different customer
   */
  router.get('/:id', controller.get.bind(controller));

  /**
   * @swagger
   * /api/content:
   *   post:
   *     summary: Create new content
   *     description: Upload and create a new content item
   *     tags: [Content]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *               - name
   *               - contentType
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: Content file to upload
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 255
   *               description:
   *                 type: string
   *               contentType:
   *                 type: string
   *                 enum: [Image, Video, HTML, URL, PDF]
   *               duration:
   *                 type: integer
   *                 minimum: 1
   *     responses:
   *       201:
   *         description: Content created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Content'
   *       400:
   *         description: Bad request - Invalid input
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Insufficient permissions
   */
  router.post(
    '/',
    authorize('Admin', 'Editor'),
    validate(createContentSchema),
    controller.create.bind(controller)
  );

  /**
   * @swagger
   * /api/content/{id}:
   *   put:
   *     summary: Update content
   *     description: Update an existing content item
   *     tags: [Content]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Content ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 255
   *               description:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [Processing, Ready, Failed]
   *     responses:
   *       200:
   *         description: Content updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Content not found
   */
  router.put(
    '/:id',
    authorize('Admin', 'Editor'),
    validate(updateContentSchema),
    controller.update.bind(controller)
  );

  /**
   * @swagger
   * /api/content/{id}:
   *   delete:
   *     summary: Delete content
   *     description: Delete a content item and its associated file from storage
   *     tags: [Content]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Content ID
   *     responses:
   *       204:
   *         description: Content deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin role required
   *       404:
   *         description: Content not found
   */
  router.delete(
    '/:id',
    authorize('Admin'),
    controller.delete.bind(controller)
  );

  return router;
};
Swagger Documentation Rules:

ALWAYS document every endpoint before considering it complete
Include all possible response codes (200, 201, 204, 400, 401, 403, 404, 500)
Document request and response schemas using reusable components
Provide realistic examples for all schemas
Group related endpoints using tags
Document security requirements for each endpoint
Include query parameters with their validation rules
Document error responses with examples
Keep documentation in sync with code changes
Test documentation by accessing /api-docs endpoint


CLAUDE.md Maintenance (MANDATORY)
What is CLAUDE.md?
CLAUDE.md is a living document in the project root that tracks:

Architecture decisions
API changes and versioning
Database schema changes
Important implementation notes
Known issues and TODOs
Setup instructions
Deployment notes

CLAUDE.md Structure
markdown# Digital Signage Platform - Development Notes

## Project Overview
Brief description of the project and its purpose.

## Architecture Decisions

### [Date] - Decision Title
**Context:** Why this decision was needed
**Decision:** What was decided
**Consequences:** Impact of this decision
**Alternatives Considered:** What else was evaluated

Example:
### 2025-01-15 - Use Customer → Site → Player Hierarchy
**Context:** Need to support multi-location retail chains
**Decision:** Implemented three-tier hierarchy: Customer → Site → Player
**Consequences:** More flexible scheduling, better analytics per location
**Alternatives Considered:** Flat Organization → Player structure (rejected - too limiting)

## API Changes

### Version 1.0.0 (2025-01-15)
- Initial API release
- Endpoints: /auth, /content, /playlists, /schedules, /players, /sites
- Authentication: JWT Bearer tokens
- Swagger docs available at /api-docs

### Version 1.1.0 (TBD)
- [Planned changes]

## Database Schema Changes

### 2025-01-15 - Initial Schema
- Created all core tables
- Implemented Customer → Site → Player hierarchy
- See: `/database/schema.sql`

### 2025-01-20 - Added TimeZone to Sites
**Migration:** `migrations/002_add_timezone_to_sites.sql`
**Reason:** Support different time zones per site for scheduling
**Impact:** All existing sites default to 'UTC'

## Implementation Notes

### Authentication
- JWT tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Tokens include: userId, customerId, role

### File Storage
- All media files stored in Azure Blob Storage
- Database stores only URLs, not binary data
- Container: `content`
- Path structure: `{customerId}/{contentId}/{filename}`

### Caching Strategy
- In-memory cache for development
- Player configs cached for 5 minutes
- Schedules cached for 1 minute
- Redis will be added when scaling beyond 500 players

## Known Issues

### Issue #1 - [Date]
**Description:** [Problem description]
**Workaround:** [Temporary solution]
**Planned Fix:** [Long-term solution]

## Setup Instructions

### Prerequisites
- Node.js 20+
- Azure SQL Database
- Azure Blob Storage account

### Environment Variables
See `.env.example` for required variables

### First-Time Setup
```bash
npm install
npm run migrate
npm run dev
```

## Deployment Notes

### Azure App Service Configuration
- Node version: 20 LTS
- Startup command: `node dist/index.js`
- Always On: Enabled
- ARR Affinity: Disabled

### Environment Variables in Azure
All variables from `.env` must be configured in App Service Configuration

## Testing

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

### Test Coverage Goals
- Services: 90%+
- Repositories: 80%+
- Controllers: 70%+

## Performance Benchmarks

### Database Query Performance
- Content list: <50ms
- Player schedule lookup: <100ms
- Playlist with content: <75ms

### API Response Times (Target)
- GET requests: <200ms
- POST requests: <500ms
- File uploads: <2s for 100MB

## Security Checklist

- [x] JWT authentication implemented
- [x] Password hashing with bcrypt
- [x] Input validation with Zod
- [x] SQL injection prevention (parameterized queries)
- [x] CORS configured
- [ ] Rate limiting (TODO)
- [ ] API key for player authentication (TODO)

## TODO

### High Priority
- [ ] Implement rate limiting
- [ ] Add player authentication via API keys
- [ ] Set up CI/CD pipeline

### Medium Priority
- [ ] Add Redis caching
- [ ] Implement audit log triggers
- [ ] Add email notifications

### Low Priority
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Multi-language support

## Useful Commands
```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Run production build

# Database
npm run migrate          # Run migrations
npm run seed             # Seed with test data

# Code Quality
npm run lint             # Lint code
npm run format           # Format with Prettier
npm test                 # Run tests

# Documentation
# View API docs: http://localhost:3000/api-docs
```

## Contact & Resources

- API Documentation: http://localhost:3000/api-docs
- Azure Portal: [link]
- GitHub Repository: [link]
When to Update CLAUDE.md
ALWAYS update CLAUDE.md when:

Making architecture decisions

Choosing between approaches
Changing existing patterns
Adding new major features


Modifying the API

Adding new endpoints
Changing request/response formats
Deprecating endpoints
Version changes


Changing the database schema

Creating/modifying tables
Adding/removing columns
Changing indexes
Running migrations


Implementing workarounds

Temporary fixes
Known limitations
Performance issues


Adding new dependencies

Why the dependency was added
What problem it solves
Any configuration needed


Deployment changes

New environment variables
Configuration changes
Infrastructure updates


Discovering important implementation details

Edge cases
Gotchas
Important constraints



CLAUDE.md Update Rules

Update IMMEDIATELY when making significant changes
Be specific and concise - include enough detail to understand the change
Include dates for all entries
Link to relevant files (migrations, documentation, etc.)
Document the "why" not just the "what"
Keep it organized - use consistent formatting
Review before committing - ensure CLAUDE.md is updated with code changes
Never delete history - keep a record of all changes

Example CLAUDE.md Update Flow
typescript// Step 1: Make a code change
// Added timezone support to sites

// Step 2: Update CLAUDE.md IMMEDIATELY
// Add entry under "Database Schema Changes":
/*
### 2025-01-20 - Added TimeZone to Sites
**Migration:** `migrations/002_add_timezone_to_sites.sql`
**Reason:** Different sites operate in different time zones, needed for accurate scheduling
**Impact:** All existing sites will default to 'UTC', must be updated manually
**API Change:** GET /api/sites now includes 'timeZone' field
**Related:** Updated Site model, site.repository.ts, site.controller.ts
*/

// Step 3: Update "API Changes" section if applicable
// Step 4: Update "Known Issues" if introducing limitations
// Step 5: Commit code + CLAUDE.md together

Code Quality Standards
1. Error Handling (MANDATORY)
Always use custom error classes and centralized error handling:
typescript// utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: number | string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

// middleware/error.middleware.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
Error Handling Rules:

ALWAYS throw custom error classes, never throw strings
NEVER send raw error messages to clients (they may contain sensitive info)
ALWAYS use try-catch in async functions
ALWAYS validate input before processing

2. Input Validation with Zod
Use Zod for all input validation (NOT joi, NOT express-validator):
typescript// validators/content.validator.ts
import { z } from 'zod';

export const createContentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    contentType: z.enum(['Image', 'Video', 'HTML', 'URL', 'PDF']),
    duration: z.number().int().positive().optional(),
  }),
});

export const updateContentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: z.enum(['Processing', 'Ready', 'Failed']).optional(),
  }),
});

// middleware/validation.middleware.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};
Validation Rules:

ALWAYS validate request body, params, and query strings
Define validation schemas separately from routes
Use TypeScript inference from Zod schemas
NEVER trust user input

3. Database Access Patterns
Use the repository pattern with raw SQL (NO ORM):
typescript// repositories/base.repository.ts
import { ConnectionPool } from 'mssql';

export abstract class BaseRepository {
  constructor(protected readonly pool: ConnectionPool) {}

  protected async query<T>(sql: string, params?: Record<string, unknown>): Promise<T[]> {
    const request = this.pool.request();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(sql);
    return result.recordset as T[];
  }

  protected async queryOne<T>(sql: string, params?: Record<string, unknown>): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] || null;
  }

  protected async execute(sql: string, params?: Record<string, unknown>): Promise<number> {
    const request = this.pool.request();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(sql);
    return result.rowsAffected[0];
  }
}

// repositories/content.repository.ts
export class ContentRepository extends BaseRepository implements IContentRepository {
  async findById(id: number, customerId: number): Promise<Content | null> {
    const sql = `
      SELECT 
        ContentId as contentId,
        CustomerId as customerId,
        Name as name,
        ContentType as contentType,
        FileUrl as fileUrl,
        Status as status,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM Content
      WHERE ContentId = @id AND CustomerId = @customerId
    `;
    
    return this.queryOne<Content>(sql, { id, customerId });
  }

  async create(data: CreateContentDto): Promise<Content> {
    const sql = `
      INSERT INTO Content (CustomerId, Name, ContentType, FileUrl, Status, UploadedBy)
      OUTPUT 
        INSERTED.ContentId as contentId,
        INSERTED.CustomerId as customerId,
        INSERTED.Name as name,
        INSERTED.ContentType as contentType,
        INSERTED.FileUrl as fileUrl,
        INSERTED.Status as status,
        INSERTED.CreatedAt as createdAt,
        INSERTED.UpdatedAt as updatedAt
      VALUES (@customerId, @name, @contentType, @fileUrl, @status, @uploadedBy)
    `;
    
    const result = await this.query<Content>(sql, {
      customerId: data.customerId,
      name: data.name,
      contentType: data.contentType,
      fileUrl: data.fileUrl,
      status: 'Processing',
      uploadedBy: data.uploadedBy,
    });
    
    return result[0];
  }
}
Database Rules:

ALWAYS use parameterized queries (NEVER string concatenation)
ALWAYS map database columns to camelCase in TypeScript
ALWAYS use transactions for multi-step operations
NEVER expose database errors to clients
Use SQL naming conventions in queries (PascalCase for columns)
Use TypeScript naming conventions in code (camelCase for properties)


Security Best Practices
MANDATORY Security Rules

Input Validation

Validate ALL user input
Sanitize data before database insertion
Use parameterized queries ALWAYS


Authentication

Hash passwords with bcrypt (min 10 rounds)
Use JWT with appropriate expiration
Implement refresh token rotation
Validate tokens on every protected route


Authorization

Check customer ownership for ALL resources
Implement role-based access control (RBAC)
Verify user permissions before operations
Implement site-level access for SiteManager role


Data Protection

NEVER log sensitive data
Use HTTPS in production (TLS 1.2+)
Encrypt sensitive data at rest
Use Azure Key Vault for secrets


API Security

Implement rate limiting
Use CORS appropriately
Set security headers (helmet middleware)
Implement request size limits


Error Handling

NEVER expose stack traces to clients
Log errors server-side only
Return generic error messages




Documentation Standards
Code Comments
typescript/**
 * Service for managing digital signage content
 * Handles content CRUD operations and storage management
 */
export class ContentService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly storageService: StorageService
  ) {}

  /**
   * Retrieves content by ID for a specific customer
   * @param id - Content ID
   * @param customerId - Customer ID
   * @returns Content object or null if not found
   * @throws NotFoundError if content doesn't exist
   */
  async getById(id: number, customerId: number): Promise<Content | null> {
    return this.contentRepository.findById(id, customerId);
  }

  /**
   * Uploads a new content file to Azure Blob Storage
   * @param file - File buffer to upload
   * @param metadata - Content metadata
   * @returns Created content object with storage URL
   * @throws ValidationError if file type is invalid
   */
  async upload(file: Buffer, metadata: CreateContentDto): Promise<Content> {
    // Implementation
  }
}
```

**Documentation Rules:**
- **Use JSDoc comments** for all public methods
- **Document parameters** and return types
- **Document thrown errors**
- **Keep comments up to date** with code changes
- **Avoid obvious comments** (don't comment what the code already says)
- **Update Swagger docs** when API changes
- **Update CLAUDE.md** for architecture decisions

---

## **Git Commit Standards**

Follow conventional commits:
```
feat: add content upload endpoint
fix: resolve player heartbeat timeout issue
refactor: extract authentication logic to middleware
docs: update API documentation and CLAUDE.md
test: add unit tests for playlist service
chore: update dependencies
Commit Rules:

Write clear, descriptive commit messages
Use present tense ("add feature" not "added feature")
Keep commits atomic (one logical change per commit)
Reference issue numbers when applicable
ALWAYS include CLAUDE.md updates with related code changes


Deployment Checklist
Before deploying to Azure App Service:

 All environment variables configured in Azure
 Database migrations run successfully
 Connection strings secured in Azure Key Vault
 Application Insights configured for monitoring
 Logging configured to Azure Log Analytics
 CORS configured for CMS domain
 Rate limiting enabled
 Security headers configured
 Health check endpoint implemented (/health)
 Swagger documentation accessible at /api-docs
 Swagger JSON available at /api-docs.json
 All tests passing
 No console.log statements (use logger)
 No hardcoded secrets or credentials
 TypeScript compiled without errors
 ESLint passing without warnings
 CLAUDE.md is up to date


Summary of Key Rules
ALWAYS:
✅ Use TypeScript with strict mode
✅ Follow layered architecture (routes → controllers → services → repositories)
✅ Use dependency injection
✅ Validate all input with Zod
✅ Use parameterized SQL queries
✅ Throw custom error classes
✅ Log errors with context
✅ Write unit tests for services
✅ Document all APIs with Swagger
✅ Update CLAUDE.md for significant changes
✅ Document public APIs with JSDoc
✅ Use meaningful variable names
✅ Handle async operations properly
✅ Check customer/site ownership for multi-tenancy
NEVER:
❌ Skip layers in architecture
❌ Use any type in TypeScript
❌ String concatenation in SQL queries
❌ Hardcode secrets or credentials
❌ Expose raw error messages to clients
❌ Skip input validation
❌ Add dependencies without justification
❌ Use console.log in production code
❌ Commit .env files
❌ Allow circular dependencies
❌ Trust user input
❌ Skip authentication checks
❌ Deploy without updating Swagger docs
❌ Make architectural changes without updating CLAUDE.md

Critical Reminders

Swagger Documentation: Every endpoint MUST have complete Swagger documentation before it's considered production-ready
CLAUDE.md Updates: Update CLAUDE.md immediately when making architecture decisions, API changes, or database modifications
Multi-Tenancy: Always filter by CustomerId and verify ownership
Hierarchical Structure: Remember Customer → Site → Player relationships
Security First: Never compromise on authentication, validation, or error handling
Type Safety: Leverage TypeScript's full power - no any types
Testing: Write tests before considering a feature complete
Documentation: Code without documentation is incomplete

Following these instructions will ensure a maintainable, secure, scalable, and well-documented digital signage platform backend.