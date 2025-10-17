# Swagger/OpenAPI Documentation Summary

## ✅ Swagger Documentation Complete

All new player authentication APIs have full Swagger/OpenAPI 3.0 documentation.

---

## 📚 New Swagger Components Added

### Tags

Added two new tags to organize player-related endpoints:

1. **Player Authentication** - Authentication endpoints for player devices
2. **Player Devices** - Operational endpoints (schedule, heartbeat, proof-of-play)

### Security Schemes

Already present:
- ✅ `bearerAuth` - For CMS user JWT tokens
- ✅ `playerAuth` - For player device JWT tokens

### Schemas

Added three new response schemas:

#### 1. PlayerActivationResponse
Response from `POST /player-auth/activate`

```yaml
PlayerActivationResponse:
  type: object
  properties:
    playerId: integer
    customerId: integer
    siteId: integer
    accessToken: string (JWT)
    refreshToken: string (JWT)
    expiresIn: integer (3600 seconds)
```

#### 2. PlayerTokenRefreshResponse
Response from `POST /player-auth/refresh`

```yaml
PlayerTokenRefreshResponse:
  type: object
  properties:
    accessToken: string (JWT)
    expiresIn: integer (3600 seconds)
```

#### 3. ActivationCodeResponse
Response from `POST /players/{playerId}/activation-code`

```yaml
ActivationCodeResponse:
  type: object
  properties:
    activationCode: string (6 characters)
    expiresAt: datetime (ISO 8601)
```

### Existing Schema Used

- ✅ `ProofOfPlay` - Already existed in Swagger config

---

## 📝 Documented Endpoints

### Player Authentication Routes (`/api/v1/player-auth`)

| Endpoint | Method | Tag | Summary |
|----------|--------|-----|---------|
| `/activate` | POST | Player Authentication | Activate player device |
| `/refresh` | POST | Player Authentication | Refresh player access token |
| `/logout` | POST | Player Authentication | Logout player device |

### Player Device Routes (`/api/v1/player-devices`)

| Endpoint | Method | Tag | Summary |
|----------|--------|-----|---------|
| `/{playerId}/heartbeat` | POST | Player Devices | Update player heartbeat |
| `/{playerId}/schedule` | GET | Player Devices | Get current schedule |
| `/{playerId}/content` | GET | Player Devices | Get content list |
| `/{playerId}/logs` | POST | Player Devices | Submit player logs |
| `/{playerId}/proof-of-play` | POST | Player Devices | Submit proof of play ✨ NEW |

### Player Management Routes (`/api/v1/players`)

| Endpoint | Method | Tag | Summary |
|----------|--------|-----|---------|
| `/{playerId}/activation-code` | POST | Players | Generate activation code |

---

## 🔍 Swagger Documentation Details

### Example: Player Activation Endpoint

```yaml
/api/v1/player-auth/activate:
  post:
    summary: Activate player device
    description: Activate a player using activation code generated in CMS
    tags:
      - Player Authentication
    security: []  # No authentication required
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - playerCode
              - activationCode
            properties:
              playerCode:
                type: string
                example: NYC-001-ENT
              activationCode:
                type: string
                example: ABC123
    responses:
      200:
        description: Player activated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: success
                data:
                  $ref: '#/components/schemas/PlayerActivationResponse'
                message:
                  type: string
                  example: Player activated successfully
      400:
        $ref: '#/components/responses/BadRequest'
      401:
        description: Invalid or expired activation code
      404:
        description: Player not found
```

### Example: Proof of Play Endpoint

```yaml
/api/v1/player-devices/{playerId}/proof-of-play:
  post:
    summary: Submit proof of play
    description: Record that a content item was displayed on the player
    tags:
      - Player Devices
    security:
      - playerAuth: []  # Requires player JWT
    parameters:
      - in: path
        name: playerId
        required: true
        schema:
          type: integer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - contentId
              - playedAt
            properties:
              contentId: integer
              playlistId: integer (optional)
              scheduleId: integer (optional)
              playedAt: datetime (ISO 8601)
              duration: integer (seconds)
    responses:
      201:
        description: Proof of play recorded successfully
      400:
        $ref: '#/components/responses/BadRequest'
      401:
        $ref: '#/components/responses/Unauthorized'
```

---

## 🌐 Accessing the Documentation

### Development
```
http://localhost:3000/api-docs
```

### Production
```
https://digital-signage-backend.azurewebsites.net/api-docs
```

---

## 📋 Swagger UI Features

When you access `/api-docs`, users can:

1. **Browse all endpoints** - Organized by tags
2. **Try API calls** - Interactive "Try it out" buttons
3. **View schemas** - See request/response structures
4. **Authenticate** - Test with JWT tokens
5. **See examples** - Sample requests and responses

---

## 🔐 Authentication in Swagger UI

### For CMS User Endpoints
1. Click "Authorize" button
2. Select `bearerAuth`
3. Enter: `Bearer {your-cms-jwt-token}`

### For Player Device Endpoints
1. Click "Authorize" button
2. Select `playerAuth`
3. Enter: `Bearer {your-player-jwt-token}`

---

## 🎯 Complete API Flow Documentation

The Swagger docs now document the complete player lifecycle:

### 1. CMS Admin Flow
```
POST /api/v1/players
  → Create player

POST /api/v1/players/{playerId}/activation-code
  → Generate activation code
  → Returns: { activationCode: "ABC123", expiresAt: "..." }
```

### 2. Player Device Flow
```
POST /api/v1/player-auth/activate
  → Activate with code
  → Returns: { accessToken, refreshToken }

GET /api/v1/player-devices/{playerId}/schedule
  → Get content to display
  → Uses: Bearer {accessToken}

POST /api/v1/player-devices/{playerId}/heartbeat
  → Send heartbeat (every 60s)
  → Uses: Bearer {accessToken}

POST /api/v1/player-devices/{playerId}/proof-of-play
  → Track content playback
  → Uses: Bearer {accessToken}

POST /api/v1/player-auth/refresh
  → Refresh token before expiry
  → Returns: { accessToken }
```

---

## ✅ Documentation Checklist

- [x] Tags for Player Authentication and Player Devices
- [x] Security schemes (bearerAuth, playerAuth)
- [x] Request/response schemas
- [x] All endpoint descriptions
- [x] Request body schemas
- [x] Response examples
- [x] Error responses (400, 401, 404)
- [x] Parameter descriptions
- [x] Authentication requirements
- [x] Example values for all fields

---

## 📦 Files Modified

### `src/config/swagger.ts`
Added:
- `PlayerActivationResponse` schema
- `PlayerTokenRefreshResponse` schema
- `ActivationCodeResponse` schema
- "Player Authentication" tag
- "Player Devices" tag (updated description)

### `src/routes/player-auth.routes.ts`
Complete Swagger documentation for:
- POST /activate
- POST /refresh
- POST /logout

### `src/routes/player-device.routes.ts`
Complete Swagger documentation for:
- POST /{playerId}/proof-of-play

---

## 🚀 Next Steps

1. **Start the server**: `npm run dev`
2. **Visit Swagger UI**: http://localhost:3000/api-docs
3. **Test the new endpoints** in the interactive documentation
4. **Export OpenAPI spec** if needed for client generation

---

## 📖 Additional Resources

- OpenAPI 3.0 Specification: https://swagger.io/specification/
- Swagger UI: https://swagger.io/tools/swagger-ui/
- API Documentation Best Practices: https://swagger.io/resources/articles/best-practices-in-api-documentation/

---

## ✨ Summary

**All player authentication endpoints are fully documented in Swagger/OpenAPI format!**

Users can now:
- ✅ Browse all player auth endpoints in `/api-docs`
- ✅ See request/response examples
- ✅ Test endpoints interactively
- ✅ Understand authentication requirements
- ✅ View all schemas and data types
- ✅ Export OpenAPI spec for code generation
