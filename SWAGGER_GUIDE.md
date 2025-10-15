# Swagger/OpenAPI Implementation Guide

## Overview

The Digital Signage Platform API uses **Swagger/OpenAPI 3.0** for comprehensive API documentation. The implementation uses:
- `swagger-jsdoc` - Generate OpenAPI spec from JSDoc comments
- `swagger-ui-express` - Serve interactive Swagger UI

## Accessing Documentation

### Interactive UI
```
http://localhost:3000/api-docs
```
Features:
- Browse all endpoints organized by tags
- Try out API calls directly from the browser
- View request/response schemas
- Authentication token persistence

### OpenAPI JSON
```
http://localhost:3000/api-docs.json
```
Use this endpoint to:
- Import into Postman, Insomnia, or other API clients
- Generate client SDKs
- Integrate with CI/CD pipelines
- Share with external developers

## Configuration

The Swagger configuration is located in [src/config/swagger.ts](src/config/swagger.ts):

```typescript
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { /* API metadata */ },
    servers: [ /* API servers */ ],
    components: {
      securitySchemes: { /* Auth config */ },
      schemas: { /* Data models */ },
    },
    security: [ /* Default security */ ],
    tags: [ /* Endpoint categories */ ],
  },
  apis: ['./src/routes/*.ts'], // Files with JSDoc comments
};
```

## Available Schemas

All data models are defined in `components.schemas`:

- **Error** - Standard error response
- **SuccessResponse** - Generic success response
- **User** - User account
- **Customer** - Customer organization
- **Site** - Physical location
- **Player** - Display device
- **Content** - Media content
- **Playlist** - Content collection
- **PlaylistItem** - Item in playlist
- **Schedule** - Content schedule
- **ScheduleAssignment** - Schedule assignment
- **Pagination** - Pagination metadata

## Adding Documentation to Routes

### Basic Endpoint Documentation

Add JSDoc comments above route handlers:

```typescript
/**
 * @swagger
 * /customers:
 *   get:
 *     summary: List all customers
 *     description: Get all customers (Admin can see all, others see only their own)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Customer list retrieved successfully
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
 *                     $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', asyncHandler(controller.list));
```

### Request Body with Schema

```typescript
/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create new playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Holiday Campaign
 *               description:
 *                 type: string
 *                 example: Content for holiday season
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 */
router.post('/', asyncHandler(controller.create));
```

### File Upload Endpoint

```typescript
/**
 * @swagger
 * /content/upload:
 *   post:
 *     summary: Upload new content
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
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file to upload (max 100MB)
 *               name:
 *                 type: string
 *                 example: Spring Sale Banner
 *               type:
 *                 type: string
 *                 enum: [Image, Video, HTML, URL, PDF]
 */
router.post('/upload', upload.single('file'), asyncHandler(controller.upload));
```

### Path Parameters

```typescript
/**
 * @swagger
 * /sites/{siteId}:
 *   get:
 *     summary: Get site by ID
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site retrieved successfully
 *       404:
 *         description: Site not found
 */
router.get('/:siteId', asyncHandler(controller.getById));
```

## Tags

Endpoints are organized into the following tags:

| Tag | Description |
|-----|-------------|
| **Auth** | Authentication endpoints |
| **Customers** | Customer management (Admin only) |
| **Sites** | Site management |
| **Players** | Player device management |
| **Content** | Media content management |
| **Playlists** | Playlist management |
| **Schedules** | Content scheduling |
| **Users** | User management |
| **Analytics** | Proof of play and analytics |

## Security Schemes

### Bearer Authentication (Users)
```typescript
securitySchemes: {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your JWT token from /auth/login endpoint',
  },
}
```

Usage in Swagger UI:
1. Click the **Authorize** button at the top
2. Enter your JWT token (without "Bearer" prefix)
3. Click **Authorize**
4. Try any protected endpoint

### Player Authentication
```typescript
playerAuth: {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your player JWT token',
}
```

## Best Practices

### ✅ DO

1. **Document all endpoints** - Include at least summary and description
2. **Use proper HTTP status codes** - Be consistent with response codes
3. **Reference schemas** - Use `$ref: '#/components/schemas/ModelName'`
4. **Include examples** - Provide realistic example values
5. **Document errors** - Include common error responses
6. **Tag endpoints** - Group related endpoints with tags
7. **Mark required fields** - Use `required: true` where appropriate
8. **Add descriptions** - Explain complex parameters

### ❌ DON'T

1. **Don't duplicate schemas** - Reuse existing schema definitions
2. **Don't skip security** - Always add `security` if auth required
3. **Don't forget status codes** - Document all possible responses
4. **Don't use vague descriptions** - Be specific and clear
5. **Don't leave TODO comments** - Complete all documentation

## Adding New Schemas

To add a new schema, edit [src/config/swagger.ts](src/config/swagger.ts):

```typescript
components: {
  schemas: {
    // ... existing schemas
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
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
}
```

Then reference it in route documentation:
```typescript
$ref: '#/components/schemas/YourNewModel'
```

## Testing Documentation

### 1. Start the Server
```bash
npm run dev
```

### 2. Open Swagger UI
Navigate to: http://localhost:3000/api-docs

### 3. Verify
- [ ] All endpoints are listed
- [ ] Schemas render correctly
- [ ] Examples are realistic
- [ ] Try It Out works
- [ ] Authorization persists
- [ ] Error responses documented

### 4. Export Specification
Download from: http://localhost:3000/api-docs.json

### 5. Import to API Client
- **Postman:** File → Import → Paste URL
- **Insomnia:** Create → From URL

## Troubleshooting

### Swagger UI Not Loading

1. Check console for errors
2. Verify swagger-ui-express is installed
3. Check that routes are being scanned: `apis: ['./src/routes/*.ts']`

### Schema Not Found

1. Ensure schema is defined in `swagger.ts`
2. Use correct reference: `$ref: '#/components/schemas/SchemaName'`
3. Restart server after schema changes

### Endpoints Not Showing

1. Verify JSDoc comment syntax
2. Check file is in scanned directory
3. Ensure proper indentation
4. Restart server

### Authentication Not Working

1. Get token from `/auth/login`
2. Click "Authorize" button
3. Paste token (without "Bearer")
4. Don't include quotes

## Production Deployment

When deploying to production:

1. **Update server URL** in `swagger.ts`:
   ```typescript
   servers: [
     {
       url: 'https://your-production-domain.com/api/v1',
       description: 'Production server',
     },
   ],
   ```

2. **Consider security**:
   - Protect `/api-docs` with authentication if needed
   - Rate limit documentation endpoints
   - Consider disabling in production if not needed

3. **Generate static docs** (optional):
   ```bash
   npm install -g swagger-ui-cli
   swagger-ui-cli -s http://localhost:3000/api-docs.json -d ./docs
   ```

## Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

## Support

For questions about the Swagger implementation:
1. Check this guide
2. Review existing route documentation
3. Consult OpenAPI 3.0 specification
4. Open an issue on GitHub
