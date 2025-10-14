# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Signage Platform Backend API - A multi-tenant TypeScript backend for managing digital signage content across customers, sites, and players.

**Technology Stack:**
- TypeScript (strict mode, required)
- Express.js for HTTP server
- Azure SQL Database with raw SQL (NO ORM)
- Azure Blob Storage for media files
- JWT authentication with bcrypt
- Zod for validation

## Development Commands

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test
npm run test:watch

# Linting and formatting
npm run lint
npm run format

# Database migrations
npm run migrate
```

## Architecture Overview

### Mandatory Layered Architecture

The project follows strict separation of concerns with unidirectional dependencies:

```
Routes → Controllers → Services → Repositories → Database
```

**Critical Rules:**
- NEVER skip layers (e.g., routes cannot call services directly)
- NEVER have circular dependencies
- Each layer only knows about the layer directly below it
- Use constructor-based dependency injection throughout

### Directory Structure

```
src/
├── index.ts                    # Entry point
├── config/                     # Configuration (database, Azure, environment)
├── routes/                     # HTTP route definitions (thin layer)
├── controllers/                # Request/response handling only
├── services/                   # Business logic (core of application)
├── repositories/               # Database access layer (raw SQL)
├── middleware/                 # Express middleware (auth, validation, error)
├── models/                     # TypeScript interfaces/types
├── validators/                 # Zod validation schemas
├── utils/                      # Utilities (logger, errors, helpers)
├── database/                   # Connection, migrations, seeds
└── types/                      # Global TypeScript definitions
```

## Database Schema

### Three-Tier Hierarchy

The database implements a **Customer → Site → Player** hierarchy for multi-tenant digital signage:

- **Customers**: Top-level organizations (retail chains, corporations)
- **Sites**: Physical locations (stores, offices, venues)
- **Players**: Individual screens/devices at each site

### Key Tables

- `Customers` - Top-level tenants with subscription tiers
- `Sites` - Physical locations with timezone/geography
- `Players` - Individual display devices with status tracking
- `Users` - User accounts with role-based access
- `Content` - Media library (images, videos, HTML, URLs, PDFs)
- `Playlists` + `PlaylistItems` - Content collections
- `Schedules` + `ScheduleAssignments` - When/where to play content
- `ProofOfPlay` - Playback tracking for analytics
- `PlayerLogs` - System logs from devices

### Schedule Resolution Priority

When determining what plays on a device:
1. Player-specific schedule (highest priority)
2. Site-specific schedule
3. Customer-wide schedule (lowest priority)

### Security: Row-Level Filtering

**ALWAYS filter by CustomerId** to ensure complete data isolation between tenants:

```typescript
// Every query MUST include customer filtering
WHERE CustomerId = @customerId
```

## Code Quality Standards

### Error Handling (Mandatory)

Use custom error classes from `utils/errors.ts`:
- `AppError` - Base error class
- `NotFoundError` - 404 errors
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors

NEVER throw strings. NEVER expose raw error messages to clients.

### Input Validation

Use Zod for ALL input validation (defined in `validators/`):

```typescript
// ALWAYS validate body, params, and query
await schema.parseAsync({
  body: req.body,
  query: req.query,
  params: req.params,
});
```

### Database Access

Use the repository pattern with parameterized SQL:

```typescript
// ✅ GOOD - Parameterized
const sql = `SELECT * FROM Content WHERE ContentId = @id AND CustomerId = @customerId`;
return this.queryOne<Content>(sql, { id, customerId });

// ❌ BAD - String concatenation (SQL injection risk!)
const sql = `SELECT * FROM Content WHERE ContentId = ${id}`;
```

**Column Naming:**
- Database: PascalCase (`ContentId`, `OrganizationId`)
- TypeScript: camelCase (`contentId`, `organizationId`)

### Authentication

Two separate authentication flows:
1. **User authentication**: JWT tokens for CMS users
2. **Player authentication**: Separate tokens for display devices

All protected routes MUST use `authenticate` middleware. Use `authorize(...roles)` for role-based access.

### TypeScript Rules

- `strict: true` in tsconfig.json
- NEVER use `any` type (ESLint will error)
- Explicit return types on functions
- Interfaces for all models and repositories

## Dependencies

### Allowed Core Dependencies Only

DO NOT add dependencies without justification. The approved list includes:
- `express` - HTTP framework
- `mssql` - Azure SQL Database driver
- `@azure/storage-blob`, `@azure/identity` - Azure services
- `jsonwebtoken`, `bcrypt` - Authentication
- `zod` - Validation (NOT joi, NOT express-validator)
- `dotenv` - Environment variables
- `date-fns` - Date handling (NOT moment.js)

### Forbidden Libraries

- ❌ Lodash (use native JS)
- ❌ Moment.js (use date-fns or native Date)
- ❌ Heavy ORMs like TypeORM/Sequelize (use raw SQL)
- ❌ Express generators/boilerplates

## Security Checklist

- [ ] Validate ALL user input with Zod
- [ ] Use parameterized queries (NEVER string concatenation)
- [ ] Filter all queries by CustomerId for multi-tenancy
- [ ] Hash passwords with bcrypt (min 10 rounds)
- [ ] Validate JWT on all protected routes
- [ ] Check organization ownership for ALL resources
- [ ] NEVER log sensitive data (passwords, tokens)
- [ ] NEVER expose stack traces to clients
- [ ] Implement rate limiting
- [ ] Set security headers

## Environment Variables

Required environment variables (validated at startup with Zod):
- `NODE_ENV` - development, production, test
- `PORT` - Server port
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` - Auth
- `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER` - Storage

The application will **fail fast** on startup if any required variables are missing or invalid.

## Important Patterns

### Controllers

Controllers handle HTTP only, no business logic:

```typescript
async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await this.service.create(req.body);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
```

### Services

Services contain all business logic and orchestrate repositories:

```typescript
constructor(
  private readonly contentRepository: ContentRepository,
  private readonly storageService: StorageService
) {}

async create(data: CreateContentDto): Promise<Content> {
  // Business logic here
}
```

### Repositories

Repositories handle database access with raw SQL:

```typescript
class ContentRepository extends BaseRepository {
  async findById(id: number, customerId: number): Promise<Content | null> {
    const sql = `
      SELECT ContentId as contentId, Name as name, ...
      FROM Content
      WHERE ContentId = @id AND CustomerId = @customerId
    `;
    return this.queryOne<Content>(sql, { id, customerId });
  }
}
```

## Testing

Write unit tests for all services using Jest:
- Mock repositories with `jest.mock()`
- Test error cases, not just happy paths
- Aim for 80%+ code coverage

## API Design

- Use RESTful conventions: `/api/v1/content`, `/api/v1/players`
- Proper HTTP verbs: GET (read), POST (create), PUT (update), DELETE (delete)
- Consistent response format: `{ status: "success"|"error", data: {...}, message: "..." }`
- Proper status codes: 200, 201, 204, 400, 401, 403, 404, 500

## Common Gotchas

1. **Always filter by CustomerId** - Multi-tenancy depends on this
2. **Check AssignedSiteId for SiteManager role** - Site managers can only access their site
3. **Use UTC timestamps** - Sites have different timezones
4. **Validate file uploads** - Check MIME types and file sizes
5. **Handle player offline status** - Check `LastHeartbeat` for timeouts
6. **Schedule priority resolution** - Player > Site > Customer
