
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
json


json


json


json


Core Architecture Principles
1. Layered Architecture (MANDATORY)

The application MUST follow a strict layered architecture with clear separation of concerns:




Layer Communication Rules:

Routes → Controllers → Services → Repositories → Database
NEVER skip layers (e.g., Routes should NEVER call Services directly)
NEVER have circular dependencies between layers
Each layer should only know about the layer directly below it
Repositories return domain models, NOT raw database rows
2. Dependency Injection Pattern

Use constructor-based dependency injection for all services and repositories:

typescript


3. Interface-Based Design

Define interfaces for all repositories and services:

typescript


Dependency Management Rules
Allowed Core Dependencies ONLY:
json


Dependency Rules:
NEVER install a dependency without justification
Document WHY each dependency is needed in comments
Prefer native Node.js features over external libraries when possible
Avoid "convenience" libraries that add unnecessary bloat
Do NOT use:
Lodash (use native JS array methods)
Moment.js (use date-fns or native Date)
Request (deprecated, use native fetch or axios)
Heavy ORMs like TypeORM or Sequelize (write raw SQL with mssql)
Express generators or boilerplates
Unnecessary middleware packages
Before adding ANY new dependency:
Check if native JavaScript/TypeScript can solve it
Check the package size and weekly downloads
Check when it was last updated
Verify it has TypeScript definitions
Document the reason in code comments
Code Quality Standards
1. Error Handling (MANDATORY)

Always use custom error classes and centralized error handling:

typescript



Error Handling Rules:

ALWAYS throw custom error classes, never throw strings
NEVER send raw error messages to clients (they may contain sensitive info)
ALWAYS use try-catch in async functions
ALWAYS validate input before processing
2. Input Validation with Zod

Use Zod for all input validation (NOT joi, NOT express-validator):

typescript



Validation Rules:

ALWAYS validate request body, params, and query strings
Define validation schemas separately from routes
Use TypeScript inference from Zod schemas
NEVER trust user input
3. Database Access Patterns

Use the repository pattern with raw SQL (NO ORM):

typescript



Database Rules:

ALWAYS use parameterized queries (NEVER string concatenation)
ALWAYS map database columns to camelCase in TypeScript
ALWAYS use transactions for multi-step operations
NEVER expose database errors to clients
Use SQL naming conventions in queries (PascalCase for columns)
Use TypeScript naming conventions in code (camelCase for properties)
4. Authentication and Authorization
typescript



Security Rules:

ALWAYS hash passwords with bcrypt (min 10 rounds)
ALWAYS use JWT for authentication
NEVER store passwords in plain text
ALWAYS validate JWT on protected routes
Use separate tokens for users and players
Implement refresh tokens for long-lived sessions
5. Logging Standards
typescript



Logging Rules:

ALWAYS log errors with full context
NEVER log sensitive data (passwords, tokens, personal info)
Use structured logging (JSON format for production)
Log at appropriate levels (DEBUG, INFO, WARN, ERROR)
Include request IDs for tracing
API Design Standards
RESTful API Conventions
typescript



API Rules:

Use plural nouns for resource names (/content, /players, /playlists)
Use HTTP verbs correctly: GET (read), POST (create), PUT (update), DELETE (delete)
Use proper status codes:
200: Success
201: Created
204: No Content (for DELETE)
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
500: Internal Server Error
Return consistent response format:
typescript


Use query parameters for filtering, sorting, pagination
Version your API (/api/v1/...)
Controller Pattern
typescript



Controller Rules:

Controllers handle HTTP, nothing else
NEVER put business logic in controllers
ALWAYS delegate to services
ALWAYS use try-catch and pass errors to next()
Extract user context from req.user
Return consistent response format
Testing Requirements
typescript



Testing Rules:

Write unit tests for all services
Write integration tests for critical paths
Mock external dependencies (database, Azure services)
Test error cases, not just happy paths
Aim for 80%+ code coverage
Use descriptive test names
Environment Configuration
typescript



Environment Rules:

VALIDATE environment variables at startup
NEVER commit .env files to git
Document all required variables
Use strong types for configuration
Fail fast if configuration is invalid
Performance Optimization
Database Optimization
Use connection pooling (built into mssql)
Create indexes on frequently queried columns
Use stored procedures for complex queries
Implement pagination for large result sets
Use database transactions for data integrity
Caching Strategy
typescript



Caching Rules:

Cache frequently accessed data (player configs, schedules)
Invalidate cache on updates
Use appropriate TTL values
Consider Redis for production (add to allowed dependencies if needed)
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
Check organization ownership for ALL resources
Implement role-based access control (RBAC)
Verify user permissions before operations
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
typescript


Documentation Standards
Code Comments
typescript



Documentation Rules:

Use JSDoc comments for all public methods
Document parameters and return types
Document thrown errors
Keep comments up to date with code changes
Avoid obvious comments (don't comment what the code already says)
Git Commit Standards

Follow conventional commits:




Commit Rules:

Write clear, descriptive commit messages
Use present tense ("add feature" not "added feature")
Keep commits atomic (one logical change per commit)
Reference issue numbers when applicable
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
All tests passing
No console.log statements (use logger)
No hardcoded secrets or credentials
TypeScript compiled without errors
ESLint passing without warnings
Summary of Key Rules
ALWAYS:

✅ Use TypeScript with strict mode ✅ Follow layered architecture (routes → controllers → services → repositories) ✅ Use dependency injection ✅ Validate all input with Zod ✅ Use parameterized SQL queries ✅ Throw custom error classes ✅ Log errors with context ✅ Write unit tests for services ✅ Document public APIs with JSDoc ✅ Use meaningful variable names ✅ Handle async operations properly ✅ Check organization ownership for multi-tenancy

NEVER:

❌ Skip layers in architecture ❌ Use any type in TypeScript ❌ String concatenation in SQL queries ❌ Hardcode secrets or credentials ❌ Expose raw error messages to clients ❌ Skip input validation ❌ Add dependencies without justification ❌ Use console.log in production code ❌ Commit .env files ❌ Allow circular dependencies ❌ Trust user input ❌ Skip authentication checks