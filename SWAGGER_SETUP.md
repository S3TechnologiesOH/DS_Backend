# Swagger API Documentation Setup

## Overview

Your Digital Signage Platform API now has interactive REST API documentation powered by Swagger/OpenAPI 3.0.

## Accessing the Documentation

### Local Development
Once your server is running, visit:
```
http://localhost:3000/api-docs
```

### Production (Azure)
```
https://digital-signage-backend.azurewebsites.net/api-docs
```

## What's Been Set Up

### 1. Dependencies Added
- `swagger-jsdoc` - Generates OpenAPI spec from JSDoc comments
- `swagger-ui-express` - Serves interactive Swagger UI
- `@types/swagger-jsdoc` - TypeScript types
- `@types/swagger-ui-express` - TypeScript types

### 2. Configuration File
**Location**: `src/config/swagger.ts`

This file configures:
- API metadata (title, version, description)
- Server URLs (local and production)
- Authentication schemes (bearerAuth for users, playerAuth for players)
- Reusable schema components (Customer, Site, Player, Content, etc.)
- API tags for grouping endpoints

### 3. Integration
**Location**: `src/app.ts`

The Swagger UI is mounted at `/api-docs` with:
- Custom CSS to hide the top bar
- Custom site title: "Digital Signage API Docs"

### 4. Example Documentation
Added Swagger JSDoc comments to:
- `src/routes/auth.routes.ts`
  - POST `/auth/login` - User login with request/response examples
  - GET `/auth/me` - Get current user info

- `src/routes/content.routes.ts`
  - GET `/content` - List content with pagination parameters
  - POST `/content/upload` - File upload with multipart/form-data

## How to Document Your Endpoints

### Basic Template

Add JSDoc comments above your route handlers:

```typescript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Short description
 *     description: Detailed description
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 */
router.get('/your-endpoint', authenticate, handler);
```

### Common Patterns

#### 1. Authenticated Endpoint
```typescript
security:
  - bearerAuth: []
```

#### 2. Public Endpoint (no auth)
```typescript
security: []
```

#### 3. Path Parameters
```typescript
parameters:
  - in: path
    name: customerId
    required: true
    schema:
      type: integer
    description: Customer ID
```

#### 4. Query Parameters
```typescript
parameters:
  - in: query
    name: page
    schema:
      type: integer
      default: 1
```

#### 5. Request Body (JSON)
```typescript
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - name
          - email
        properties:
          name:
            type: string
            example: John Doe
          email:
            type: string
            format: email
```

#### 6. File Upload
```typescript
requestBody:
  required: true
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          file:
            type: string
            format: binary
```

#### 7. Reference Existing Schema
```typescript
schema:
  $ref: '#/components/schemas/Customer'
```

## Available Tags

Group your endpoints with these tags (defined in `swagger.ts`):
- `Auth` - Authentication endpoints
- `Customers` - Customer management
- `Sites` - Site management
- `Players` - Player device management
- `Content` - Media content management
- `Playlists` - Playlist management
- `Schedules` - Content scheduling
- `Users` - User management
- `Analytics` - Proof of play and analytics

## Testing Authentication in Swagger UI

1. Go to `/api-docs`
2. Click on `/auth/login` endpoint
3. Click "Try it out"
4. Enter credentials and execute
5. Copy the `accessToken` from the response
6. Click the "Authorize" button at the top of the page
7. Paste the token (without "Bearer" prefix)
8. Click "Authorize"
9. Now you can test authenticated endpoints

## Adding New Schemas

To add reusable schemas (like models), edit `src/config/swagger.ts`:

```typescript
components: {
  schemas: {
    YourNewModel: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1,
        },
        name: {
          type: 'string',
          example: 'Example Name',
        },
      },
    },
  },
}
```

Then reference it in your routes:
```typescript
schema:
  $ref: '#/components/schemas/YourNewModel'
```

## Next Steps

To fully document your API:

1. **Document remaining auth routes**:
   - POST `/auth/register`
   - POST `/auth/refresh`
   - POST `/auth/logout`

2. **Add documentation for other route files**:
   - Create route files for customers, sites, players, playlists, schedules
   - Add JSDoc comments to each endpoint

3. **Enhance schemas**:
   - Add more detailed schema definitions in `swagger.ts`
   - Include validation rules (min, max, pattern, etc.)

4. **Add examples**:
   - Include realistic example requests/responses
   - Show error response formats

## Troubleshooting

### Swagger UI not loading
- Check that `/api-docs` route is accessible
- Verify no errors in server logs
- Ensure `swagger-jsdoc` can find your route files

### Endpoints not showing up
- Check JSDoc syntax (must start with `@swagger`)
- Verify route file paths in `swagger.ts` `apis` array
- Rebuild TypeScript after changes: `npm run build`

### Authentication not working
- Ensure you're using the correct token format
- Token should be pasted without "Bearer" prefix
- Check token expiration

## Resources

- [Swagger/OpenAPI 3.0 Spec](https://swagger.io/specification/)
- [swagger-jsdoc documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
