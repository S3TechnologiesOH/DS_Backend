# Digital Signage Platform API Documentation

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## Overview

The Digital Signage Platform API is a RESTful API for managing multi-tenant digital signage content across customers, sites, and players. Built with TypeScript, Express.js, and Azure SQL Database.

**Base URL:** `http://localhost:3000/api/v1` (Development)
**Production URL:** `https://digital-signage-backend.azurewebsites.net/api/v1`

### Interactive Documentation

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **OpenAPI JSON:** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Azure SQL Database
- Azure Blob Storage account

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

## Authentication

### User Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "email": "user@example.com",
      "role": "Admin",
      "customerId": 1
    }
  }
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | System administrator | Full access to all resources |
| **Editor** | Content manager | Create/edit content, playlists |
| **Viewer** | Read-only user | View content and reports |
| **SiteManager** | Site administrator | Manage specific site and its players |

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

### Customers (Admin Only)
- `GET /customers` - List all customers
- `GET /customers/:customerId` - Get customer by ID
- `GET /customers/:customerId/limits` - Get resource limits
- `POST /customers` - Create new customer
- `PATCH /customers/:customerId` - Update customer

### Sites
- `GET /sites` - List all sites (with pagination)
- `GET /sites/:siteId` - Get site by ID
- `POST /sites` - Create new site (Admin only)
- `PATCH /sites/:siteId` - Update site
- `DELETE /sites/:siteId` - Delete site (Admin only)

### Players
- `GET /players` - List all players (with filters)
- `GET /players/:playerId` - Get player by ID
- `POST /players` - Create new player
- `PATCH /players/:playerId` - Update player
- `DELETE /players/:playerId` - Delete player
- `POST /players/:playerId/heartbeat` - Send heartbeat
- `POST /players/:playerId/activation-code` - Generate activation code

### Content
- `GET /content` - List all content (with pagination)
- `GET /content/:contentId` - Get content by ID
- `GET /content/storage/usage` - Get storage usage stats
- `POST /content/upload` - Upload new content (multipart/form-data)
- `PATCH /content/:contentId` - Update content metadata
- `DELETE /content/:contentId` - Delete content

### Playlists
- `GET /playlists` - List all playlists
- `GET /playlists/:playlistId` - Get playlist with items
- `POST /playlists` - Create new playlist
- `PATCH /playlists/:playlistId` - Update playlist
- `DELETE /playlists/:playlistId` - Delete playlist
- `POST /playlists/:playlistId/items` - Add item to playlist
- `PATCH /playlists/:playlistId/items/:itemId` - Update playlist item
- `DELETE /playlists/:playlistId/items/:itemId` - Remove item from playlist

### Schedules
- `GET /schedules` - List all schedules
- `GET /schedules/:scheduleId` - Get schedule with assignments
- `POST /schedules` - Create new schedule
- `PATCH /schedules/:scheduleId` - Update schedule
- `DELETE /schedules/:scheduleId` - Delete schedule
- `POST /schedules/:scheduleId/assignments` - Create assignment
- `DELETE /schedules/:scheduleId/assignments/:assignmentId` - Delete assignment

## Data Models

### Customer
```typescript
{
  customerId: number;
  name: string;
  subdomain: string;
  subscriptionTier: 'Free' | 'Pro' | 'Enterprise';
  maxSites: number;
  maxPlayers: number;
  maxStorageGB: number;
  isActive: boolean;
  contactEmail: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Site
```typescript
{
  siteId: number;
  customerId: number;
  name: string;
  siteCode: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
  openingHours?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Player
```typescript
{
  playerId: number;
  siteId: number;
  customerId: number;
  name: string;
  playerCode: string;
  macAddress?: string;
  serialNumber?: string;
  status: 'Online' | 'Offline' | 'Error';
  ipAddress?: string;
  location?: string;
  screenResolution?: string;
  orientation?: 'Landscape' | 'Portrait';
  playerVersion?: string;
  osVersion?: string;
  lastHeartbeat?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Content
```typescript
{
  contentId: number;
  customerId: number;
  name: string;
  contentType: 'Image' | 'Video' | 'HTML' | 'URL' | 'PDF';
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number; // seconds
  tags?: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Playlist
```typescript
{
  playlistId: number;
  customerId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Schedule
```typescript
{
  scheduleId: number;
  customerId: number;
  name: string;
  playlistId: number;
  priority: number; // 0-100, higher wins
  startDate?: Date;
  endDate?: Date;
  startTime?: string; // HH:mm:ss
  endTime?: string; // HH:mm:ss
  daysOfWeek?: string; // "Mon,Tue,Wed,Thu,Fri"
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 204 | No Content - Success with no response body |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `DATABASE_ERROR` - Database operation failed

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window:** 15 minutes
- **Max Requests:** 100 per window per IP
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

When rate limit is exceeded, the API returns HTTP 429 with:

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later"
}
```

## Examples

### Create a Playlist

```bash
curl -X POST http://localhost:3000/api/v1/playlists \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Holiday Campaign 2025",
    "description": "Content for holiday season"
  }'
```

### Add Content to Playlist

```bash
curl -X POST http://localhost:3000/api/v1/playlists/1/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": 5,
    "displayOrder": 0,
    "duration": 10,
    "transitionType": "Fade",
    "transitionDuration": 500
  }'
```

### Create a Schedule

```bash
curl -X POST http://localhost:3000/api/v1/schedules \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Schedule",
    "playlistId": 1,
    "priority": 50,
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "daysOfWeek": "Mon,Tue,Wed,Thu,Fri"
  }'
```

### Assign Schedule to Player

```bash
curl -X POST http://localhost:3000/api/v1/schedules/1/assignments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentType": "Player",
    "targetPlayerId": 1
  }'
```

### Upload Content

```bash
curl -X POST http://localhost:3000/api/v1/content/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "name=Spring Sale Banner" \
  -F "type=Image" \
  -F "duration=10" \
  -F "tags=promotion,seasonal"
```

### List Players with Filters

```bash
curl -X GET "http://localhost:3000/api/v1/players?siteId=1&status=Online&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Multi-Tenancy

The API enforces strict multi-tenancy isolation:

- All resources are filtered by `customerId`
- Users can only access resources within their customer
- Admin users can access all customers
- SiteManagers can only access their assigned site

## Schedule Resolution

Schedules follow a hierarchical priority system:

1. **Player-specific** (highest priority)
2. **Site-specific**
3. **Customer-wide** (lowest priority)

Within the same level, higher `priority` values win.

## Support

For API support, please contact:
- **Email:** support@digitalsignage.com
- **Documentation:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **GitHub Issues:** [Repository Issues](https://github.com/your-org/digital-signage-backend/issues)

## License

MIT License - See LICENSE file for details
