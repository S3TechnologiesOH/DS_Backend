# Digital Signage Platform - API Guide

## Complete Data Flow: Database ’ API ’ Client

This guide explains how data flows through the system from Azure SQL Database through your API to clients.

---

## Architecture Overview

```
Client Request
    “
Express Routes (src/routes/)
    “
Controllers (src/controllers/) - HTTP handling
    “
Services (src/services/) - Business logic
    “
Repositories (src/repositories/) - Database queries
    “
Azure SQL Database

For file uploads, an additional flow:
    “
Storage Service (src/services/StorageService.ts)
    “
Azure Blob Storage
```

---

## Setup Steps

### 1. Configure Environment Variables

Create `.env` file:

```bash
# Copy the example
cp .env.example .env
```

Edit `.env` with your actual Azure credentials:

```env
# Application
NODE_ENV=development
PORT=3000

# Azure SQL Database
DB_HOST=your-server.database.windows.net
DB_PORT=1433
DB_NAME=digital_signage
DB_USER=your_username
DB_PASSWORD=your_password
DB_ENCRYPT=true

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=7d

# Player Authentication
PLAYER_JWT_SECRET=your-player-jwt-secret-min-32-characters
PLAYER_JWT_EXPIRES_IN=30d

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER=digital-signage-media

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

```bash
npm run migrate
```

This creates all 16 tables in your Azure SQL Database:
- Customers, Sites, Players
- Users, Content, Playlists, PlaylistItems
- Schedules, ScheduleAssignments
- ProofOfPlay, PlayerLogs, PlayerTokens
- UserSessions, AuditLog, SystemSettings, Notifications

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

---

## API Endpoints

All API endpoints are prefixed with `/api/v1`

### Authentication Endpoints

#### 1. Register New User (Creates Customer)

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "subdomain": "acmecorp"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "userId": 1,
      "customerId": 1,
      "email": "admin@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Admin",
      "isActive": true
    }
  }
}
```

**What happens:**
1. Creates new Customer in database with subdomain "acmecorp"
2. Creates first User for that customer with Admin role
3. Hashes password with bcrypt
4. Generates JWT access and refresh tokens
5. Returns tokens and user info

#### 2. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "subdomain": "acmecorp"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": { ... }
  }
}
```

**What happens:**
1. Finds Customer by subdomain in database
2. Finds User by email within that customer
3. Verifies password with bcrypt
4. Updates LastLoginAt timestamp
5. Generates new JWT tokens
6. Returns tokens and user info

#### 3. Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 1,
      "customerId": 1,
      "email": "admin@example.com",
      "role": "Admin"
    }
  }
}
```

#### 4. Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

---

### Content Management Endpoints

All content endpoints require authentication. Include the JWT token in the Authorization header.

#### 1. Upload Content (with File to Azure Blob Storage)

```http
POST /api/v1/content/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Form Data:
- file: (binary file)
- name: "My Product Image"
- description: "Product showcase image"
- contentType: "Image"
- tags: "product,showcase"
```

**Response:**
```json
{
  "status": "success",
  "message": "Content uploaded successfully",
  "data": {
    "contentId": 1,
    "customerId": 1,
    "name": "My Product Image",
    "contentType": "Image",
    "fileUrl": "https://youraccount.blob.core.windows.net/media/1/content/1234567890-my-product-image.jpg",
    "fileSize": 524288,
    "status": "Ready",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**What happens:**
1. **Multer middleware** parses multipart form and extracts file
2. **Content Controller** receives file and metadata
3. **Content Service**:
   - Validates file type and size
   - Calls Storage Service to upload to Azure Blob
4. **Storage Service**:
   - Generates unique filename: `{customerId}/content/{timestamp}-{sanitized-name}`
   - Uploads file buffer to Azure Blob Storage
   - Returns fileUrl
5. **Content Service**:
   - Saves content metadata to database via ContentRepository
   - Updates status to "Ready"
6. **Response** includes fileUrl pointing to Azure Blob Storage

#### 2. List Content (with Pagination and Filters)

```http
GET /api/v1/content?page=1&limit=20&contentType=Image&search=product
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "contentId": 1,
      "name": "My Product Image",
      "contentType": "Image",
      "fileUrl": "https://...",
      "fileSize": 524288,
      "status": "Ready",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**What happens:**
1. Extracts customerId from JWT token (authenticated user)
2. Queries Content table **filtered by CustomerId** (multi-tenancy)
3. Applies optional filters (contentType, status, search)
4. Returns paginated results with total count

#### 3. Get Content by ID

```http
GET /api/v1/content/1
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "contentId": 1,
    "customerId": 1,
    "name": "My Product Image",
    "description": "Product showcase image",
    "contentType": "Image",
    "fileUrl": "https://...",
    "thumbnailUrl": null,
    "fileSize": 524288,
    "duration": null,
    "width": 1920,
    "height": 1080,
    "mimeType": "image/jpeg",
    "status": "Ready",
    "uploadedBy": 1,
    "tags": "product,showcase",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**What happens:**
1. Queries database: `SELECT * FROM Content WHERE ContentId = @id AND CustomerId = @customerId`
2. Returns content if found, 404 error if not found or belongs to different customer

#### 4. Update Content Metadata

```http
PATCH /api/v1/content/1
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Updated Product Image",
  "tags": "product,showcase,new"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Content updated successfully",
  "data": { ... }
}
```

#### 5. Delete Content (and File from Azure Blob)

```http
DELETE /api/v1/content/1
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "message": "Content deleted successfully"
}
```

**What happens:**
1. Finds content in database (ensures it belongs to user's customer)
2. Deletes record from Content table
3. Extracts blob name from fileUrl
4. Deletes file from Azure Blob Storage
5. Returns success message

#### 6. Get Storage Usage

```http
GET /api/v1/content/storage/usage
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "usedBytes": 5368709120,
    "usedGB": 5.0,
    "totalGB": 10,
    "percentUsed": 50
  }
}
```

---

## How to Test the API

### Option 1: Using cURL

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User",
    "subdomain": "testcorp"
  }'

# Save the accessToken from the response

# 2. Get current user
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Upload content
curl -X POST http://localhost:3000/api/v1/content/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "name=Test Image" \
  -F "contentType=Image"

# 4. List content
curl -X GET "http://localhost:3000/api/v1/content?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Option 2: Using Postman/Insomnia

1. Import the requests
2. Set up an environment variable for `accessToken`
3. After login, save the token
4. Use `{{accessToken}}` in Authorization headers

### Option 3: Using the Frontend Client

Your CMS frontend can make requests like:

```javascript
// Login
const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'SecurePass123',
    subdomain: 'testcorp'
  })
});

const { accessToken, user } = await response.json();

// Upload content
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', 'My Image');
formData.append('contentType', 'Image');

const uploadResponse = await fetch('http://localhost:3000/api/v1/content/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const content = await uploadResponse.json();
console.log('Uploaded:', content.data.fileUrl);
```

---

## Database Queries Behind the Scenes

### Multi-Tenancy: Always Filter by CustomerId

**Every query includes CustomerId:**

```sql
-- Example: Finding content
SELECT * FROM Content
WHERE ContentId = @contentId
  AND CustomerId = @customerId  -- CRITICAL for multi-tenancy!
```

This ensures complete data isolation between customers.

### Parameterized Queries (NO SQL Injection)

```typescript
//  GOOD - Parameterized (what we use)
const sql = `SELECT * FROM Content WHERE ContentId = @id AND CustomerId = @customerId`;
return this.queryOne<Content>(sql, { id: contentId, customerId });

// L BAD - String concatenation (NEVER DO THIS!)
const sql = `SELECT * FROM Content WHERE ContentId = ${contentId}`;
```

### Example Repository Method

```typescript
// ContentRepository.findById()
async findById(contentId: number, customerId: number): Promise<Content | null> {
  const sql = `
    SELECT
      ContentId as contentId,
      CustomerId as customerId,
      Name as name,
      -- ... all columns
    FROM Content
    WHERE ContentId = @contentId AND CustomerId = @customerId
  `;

  // BaseRepository.queryOne() handles parameter binding
  return this.queryOne<Content>(sql, { contentId, customerId });
}
```

---

## Adding More Endpoints

To add new functionality (e.g., Playlists, Sites, Players):

### 1. Create Repository

```typescript
// src/repositories/PlaylistRepository.ts
export class PlaylistRepository extends BaseRepository {
  async findById(playlistId: number, customerId: number): Promise<Playlist | null> {
    const sql = `SELECT * FROM Playlists WHERE PlaylistId = @playlistId AND CustomerId = @customerId`;
    return this.queryOne<Playlist>(sql, { playlistId, customerId });
  }

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const sql = `INSERT INTO Playlists (...) OUTPUT INSERTED.* VALUES (...)`;
    return this.insert<Playlist>(sql, data);
  }
}
```

### 2. Create Service

```typescript
// src/services/PlaylistService.ts
export class PlaylistService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async getById(playlistId: number, customerId: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(playlistId, customerId);
    if (!playlist) throw new NotFoundError('Playlist not found');
    return playlist;
  }
}
```

### 3. Create Controller

```typescript
// src/controllers/PlaylistController.ts
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const playlist = await this.playlistService.getById(
        parseInt(req.params.playlistId),
        req.user.customerId
      );
      res.json({ status: 'success', data: playlist });
    } catch (error) {
      next(error);
    }
  }
}
```

### 4. Create Routes

```typescript
// src/routes/playlist.routes.ts
const router = Router();
const playlistRepository = new PlaylistRepository();
const playlistService = new PlaylistService(playlistRepository);
const playlistController = new PlaylistController(playlistService);

router.get('/:playlistId', authenticate, asyncHandler(playlistController.getById.bind(playlistController)));

export default router;
```

### 5. Mount in index.ts

```typescript
// src/routes/index.ts
import playlistRoutes from './playlist.routes';
router.use('/playlists', playlistRoutes);
```

---

## Security Checklist

 **Implemented:**
- JWT authentication on all protected routes
- Password hashing with bcrypt (10 rounds)
- Parameterized SQL queries (no SQL injection)
- Multi-tenancy with CustomerId filtering
- Role-based authorization (Admin, Editor, Viewer, SiteManager)
- Input validation with Zod schemas
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS configuration
- Error sanitization (no stack traces in production)

---

## Common Issues & Solutions

### Issue: "Database pool not initialized"
**Solution:** Ensure migrations ran successfully: `npm run migrate`

### Issue: "Invalid authentication token"
**Solution:** Token expired or invalid. Get new token via `/auth/login` or `/auth/refresh`

### Issue: "Content not found" (but it exists)
**Solution:** Content belongs to a different customer. Check that you're logged in as the correct user.

### Issue: File upload fails
**Solution:**
1. Check Azure Blob Storage connection string in `.env`
2. Ensure container exists
3. Check file size limits (max 100MB)
4. Verify MIME type is allowed

### Issue: "CORS error"
**Solution:** Add your frontend URL to `CORS_ORIGIN` in `.env`:
```
CORS_ORIGIN=http://localhost:3001,http://localhost:3000,https://your-frontend.com
```

---

## Next Steps

1.  **Database is set up** - Migrations create all tables
2.  **Auth works** - Register, login, JWT tokens
3.  **Content management works** - Upload to Azure Blob, save to database
4. =( **Add more endpoints** - Sites, Players, Playlists, Schedules
5. =( **Add player authentication** - Separate JWT flow for display devices
6. =( **Add schedule resolution** - Logic to determine what plays on each player
7. =( **Add analytics** - Proof-of-play tracking

---

## Support

For questions or issues:
1. Check [CLAUDE.md](CLAUDE.md) for development guidelines
2. Review [README.md](README.md) for project overview
3. Check database schema in [.claude/schema.md](.claude/schema.md)
