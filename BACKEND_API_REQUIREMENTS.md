# Backend API Requirements for Player Client

This document outlines the **missing API endpoints** that need to be added to your Azure backend server for the Digital Signage Player Client to function properly.

## Current Status

Your backend API ([api-endpoints.json](api-endpoints.json)) has most endpoints, but is **missing critical player activation and authentication** endpoints.

---

## Missing Endpoints (Critical)

### 1. Player Activation Endpoint

**Status:** ⚠️ **MISSING** - This is the most critical endpoint needed

#### `POST /players/activate`

**Purpose:** Allow player devices to activate themselves using a player code and activation code (generated in CMS).

**Authentication:** None (this is the initial activation, no token yet)

**Request Body:**
```json
{
  "playerCode": "string (required) - Unique player identifier (e.g., SITE-001-MAIN)",
  "activationCode": "string (required) - 6-character code generated in CMS"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "playerId": 123,
    "customerId": 1,
    "siteId": 5,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400`: Invalid activation code or player code
- `404`: Player not found
- `409`: Player already activated

**Backend Implementation Notes:**

1. **Validate activation code:**
   - Check if activation code matches the one generated in CMS for this player
   - Activation codes should expire after 24 hours
   - Activation codes should be single-use

2. **Lookup player by playerCode:**
   ```sql
   SELECT * FROM Players WHERE playerCode = ? AND customerId = ?
   ```

3. **Verify activation code:**
   ```sql
   SELECT * FROM Players
   WHERE playerId = ?
     AND activationCode = ?
     AND activationCodeExpiresAt > NOW()
     AND isActivated = false
   ```

4. **Generate player JWT tokens:**
   - Create JWT with payload: `{ playerId, customerId, siteId, type: 'player' }`
   - Access token expiry: 24 hours
   - Refresh token expiry: 30 days

5. **Mark player as activated:**
   ```sql
   UPDATE Players
   SET isActivated = true,
       activationCode = NULL,
       activationCodeExpiresAt = NULL,
       lastSeenAt = NOW()
   WHERE playerId = ?
   ```

6. **Return tokens and player info**

**Database Schema Addition:**

Add these columns to `Players` table if not present:
```sql
ALTER TABLE Players ADD COLUMN activationCode VARCHAR(10);
ALTER TABLE Players ADD COLUMN activationCodeExpiresAt DATETIME;
ALTER TABLE Players ADD COLUMN isActivated BOOLEAN DEFAULT false;
```

---

### 2. Player Token Refresh Endpoint

**Status:** ✅ **EXISTS** at `/auth/refresh` but needs player support

#### Modify `POST /auth/refresh`

**Current Issue:** Your existing `/auth/refresh` likely only handles user tokens, not player tokens.

**Required Changes:**

1. **Accept player refresh tokens:**
   - Decode the refresh token
   - Check if `type === 'player'` in JWT payload
   - If player token, generate new player access token

2. **Player-specific logic:**
   ```javascript
   const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

   if (decoded.type === 'player') {
     // Player refresh
     const player = await Player.findByPk(decoded.playerId);
     if (!player || !player.isActivated) {
       return res.status(401).json({ status: 'error', message: 'Invalid player' });
     }

     const newAccessToken = generatePlayerAccessToken(player);
     return res.json({ status: 'success', data: { accessToken: newAccessToken } });
   } else {
     // User refresh (existing logic)
     // ...
   }
   ```

---

## Missing Database Fields

### Players Table Updates

Add these fields to support player activation:

```sql
-- Add activation fields
ALTER TABLE Players ADD COLUMN activationCode VARCHAR(10);
ALTER TABLE Players ADD COLUMN activationCodeExpiresAt DATETIME;
ALTER TABLE Players ADD COLUMN isActivated BOOLEAN DEFAULT false;

-- Add refresh token storage (optional, for tracking)
ALTER TABLE Players ADD COLUMN refreshToken TEXT;
ALTER TABLE Players ADD COLUMN refreshTokenExpiresAt DATETIME;

-- Index for fast lookup
CREATE INDEX idx_players_player_code ON Players(playerCode);
CREATE INDEX idx_players_activation ON Players(activationCode, activationCodeExpiresAt);
```

---

## Required Backend Logic Changes

### 1. Update "Generate Activation Code" Endpoint

**Current Endpoint:** `POST /players/:playerId/activation-code` ✅ EXISTS

**Required Enhancement:**

```javascript
// Current endpoint at line 417-425 in api-endpoints.json
router.post('/players/:playerId/activation-code', async (req, res) => {
  const { playerId } = req.params;

  // Generate 6-character alphanumeric code
  const activationCode = generateActivationCode(); // ABC123

  // Set expiry (24 hours)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Update player
  await Player.update({
    activationCode,
    activationCodeExpiresAt: expiresAt,
    isActivated: false  // Reset if re-activating
  }, {
    where: { playerId }
  });

  return res.json({
    status: 'success',
    data: {
      activationCode,
      expiresAt,
      validFor: '24 hours'
    }
  });
});

function generateActivationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

**This endpoint already exists in your API, just ensure it:**
- Generates a 6-character code
- Sets 24-hour expiry
- Can be regenerated if expired

---

### 2. Player JWT Token Generation

**Create helper function for player tokens:**

```javascript
// utils/jwt.js

const jwt = require('jsonwebtoken');

/**
 * Generate access token for player device
 */
function generatePlayerAccessToken(player) {
  const payload = {
    playerId: player.playerId,
    customerId: player.customerId,
    siteId: player.siteId,
    type: 'player',  // Important: distinguishes from user tokens
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_PLAYER_EXPIRES_IN || '24h'
  });
}

/**
 * Generate refresh token for player device
 */
function generatePlayerRefreshToken(player) {
  const payload = {
    playerId: player.playerId,
    customerId: player.customerId,
    siteId: player.siteId,
    type: 'player',
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
}

module.exports = {
  generatePlayerAccessToken,
  generatePlayerRefreshToken
};
```

---

### 3. Authentication Middleware Update

**Modify JWT middleware to support player tokens:**

```javascript
// middleware/auth.js

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token type
    if (decoded.type === 'player') {
      // Player token
      req.player = {
        playerId: decoded.playerId,
        customerId: decoded.customerId,
        siteId: decoded.siteId
      };
      req.isPlayer = true;
    } else {
      // User token (existing logic)
      req.user = {
        userId: decoded.userId,
        customerId: decoded.customerId,
        role: decoded.role
      };
      req.isPlayer = false;
    }

    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

module.exports = verifyToken;
```

---

## Existing Endpoints That Need Player Support

These endpoints already exist but need to verify they accept **player JWT tokens**:

### 1. ✅ `POST /player-devices/:playerId/heartbeat`
- **Current Status:** EXISTS (line 434-447)
- **Action Needed:** Ensure it accepts player JWT tokens (not just user tokens)

### 2. ✅ `GET /player-devices/:playerId/schedule`
- **Current Status:** EXISTS (line 451-458)
- **Action Needed:** Ensure it accepts player JWT tokens

### 3. ✅ `GET /player-devices/:playerId/content`
- **Current Status:** EXISTS (line 462-469)
- **Action Needed:** Ensure it accepts player JWT tokens

### 4. ✅ `POST /player-devices/:playerId/logs`
- **Current Status:** EXISTS (line 473-486)
- **Action Needed:** Ensure it accepts player JWT tokens

### 5. ✅ `POST /analytics/proof-of-play`
- **Current Status:** EXISTS (line 873-883)
- **Action Needed:** Ensure it accepts player JWT tokens

### 6. ✅ `PATCH /analytics/proof-of-play/:proofOfPlayId`
- **Current Status:** EXISTS (line 886-898)
- **Action Needed:** Ensure it accepts player JWT tokens

---

## Implementation Checklist

### Phase 1: Database Updates
- [ ] Add `activationCode` column to Players table
- [ ] Add `activationCodeExpiresAt` column to Players table
- [ ] Add `isActivated` column to Players table
- [ ] Create indexes on `playerCode` and `activationCode`

### Phase 2: Authentication System
- [ ] Create `generatePlayerAccessToken()` function
- [ ] Create `generatePlayerRefreshToken()` function
- [ ] Update JWT middleware to support player tokens
- [ ] Update `/auth/refresh` to handle player refresh tokens

### Phase 3: Player Activation
- [ ] Create `POST /players/activate` endpoint
- [ ] Update `POST /players/:playerId/activation-code` to set expiry
- [ ] Test activation flow end-to-end

### Phase 4: Verify Existing Endpoints
- [ ] Test `/player-devices/:playerId/heartbeat` with player token
- [ ] Test `/player-devices/:playerId/schedule` with player token
- [ ] Test `/player-devices/:playerId/content` with player token
- [ ] Test `/player-devices/:playerId/logs` with player token
- [ ] Test proof-of-play endpoints with player token

---

## Example Player Activation Flow

### Step 1: Admin creates player in CMS

**Request:** `POST /players`
```json
{
  "siteId": 5,
  "name": "Main Lobby Display",
  "playerCode": "SITE-001-MAIN",
  "screenResolution": "1920x1080",
  "orientation": "Landscape"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "playerId": 123,
    "playerCode": "SITE-001-MAIN",
    "isActivated": false
  }
}
```

### Step 2: Admin generates activation code

**Request:** `POST /players/123/activation-code`

**Response:**
```json
{
  "status": "success",
  "data": {
    "activationCode": "ABC123",
    "expiresAt": "2025-10-18T14:30:00Z",
    "validFor": "24 hours"
  }
}
```

### Step 3: Player device activates itself

**Request:** `POST /players/activate`
```json
{
  "playerCode": "SITE-001-MAIN",
  "activationCode": "ABC123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "playerId": 123,
    "customerId": 1,
    "siteId": 5,
    "accessToken": "eyJhbGc...player-jwt-here",
    "refreshToken": "eyJhbGc...refresh-token"
  }
}
```

### Step 4: Player uses token for subsequent requests

**Request:** `GET /player-devices/123/schedule`
```
Authorization: Bearer eyJhbGc...player-jwt-here
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "schedule": { ... },
    "playlist": { ... },
    "content": [ ... ]
  }
}
```

---

## Environment Variables

Add these to your backend `.env`:

```env
# Player JWT Configuration
JWT_PLAYER_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d

# Activation Code Settings
ACTIVATION_CODE_LENGTH=6
ACTIVATION_CODE_EXPIRY_HOURS=24
```

---

## Testing the Implementation

### Test 1: Generate Activation Code

```bash
curl -X POST https://your-backend.azurewebsites.net/api/v1/players/123/activation-code \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json"
```

Expected: Returns activation code and expiry

### Test 2: Activate Player

```bash
curl -X POST https://your-backend.azurewebsites.net/api/v1/players/activate \
  -H "Content-Type: application/json" \
  -d '{
    "playerCode": "SITE-001-MAIN",
    "activationCode": "ABC123"
  }'
```

Expected: Returns playerId, customerId, siteId, accessToken, refreshToken

### Test 3: Use Player Token

```bash
curl -X GET https://your-backend.azurewebsites.net/api/v1/player-devices/123/schedule \
  -H "Authorization: Bearer <player-access-token>"
```

Expected: Returns schedule data

### Test 4: Refresh Player Token

```bash
curl -X POST https://your-backend.azurewebsites.net/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<player-refresh-token>"
  }'
```

Expected: Returns new accessToken

---

## Security Considerations

1. **Activation Code Security:**
   - Use cryptographically secure random generator
   - Exclude confusing characters (0, O, 1, I, etc.)
   - Single-use codes
   - 24-hour expiry
   - Rate limit generation endpoint

2. **Player Token Security:**
   - Separate JWT secret for players (optional but recommended)
   - Shorter expiry than user tokens (24h vs 7 days)
   - Include `type: 'player'` in payload to prevent token confusion
   - Validate playerId exists and is activated on each request

3. **Endpoint Protection:**
   - Player tokens should ONLY access `/player-devices/*` and `/analytics/proof-of-play`
   - Player tokens should NOT access admin/CMS endpoints
   - Add middleware to enforce this separation

**Example enforcement middleware:**

```javascript
const requirePlayerToken = (req, res, next) => {
  if (!req.isPlayer) {
    return res.status(403).json({
      status: 'error',
      message: 'This endpoint requires a player token'
    });
  }
  next();
};

// Use it on player-only endpoints
router.get('/player-devices/:playerId/schedule', verifyToken, requirePlayerToken, getSchedule);
```

---

## Summary

### What You Need to Add:

1. ✅ **One New Endpoint:** `POST /players/activate`
2. ✅ **Database Changes:** 3 new columns to Players table
3. ✅ **JWT Logic:** Support player tokens in auth middleware
4. ✅ **Token Generation:** Two helper functions for player tokens
5. ✅ **Refresh Logic:** Update `/auth/refresh` to handle player tokens

### What Already Exists:

✅ All player-devices endpoints
✅ Activation code generation endpoint
✅ Heartbeat endpoint
✅ Schedule fetching endpoint
✅ Proof of Play endpoints

**Estimated Implementation Time:** 4-6 hours

---

## Questions?

If you need clarification on any endpoint or implementation detail, refer to:
- [api-endpoints.json](api-endpoints.json) - Your current API documentation
- [PLAYER_CLIENT_REFERENCE.md](PLAYER_CLIENT_REFERENCE.md) - Player client technical reference
- [src/api/auth.ts](src/api/auth.ts) - Player client activation code

**Client Code Location:**
- Player activation: [src/api/auth.ts:26-52](src/api/auth.ts#L26-L52)
- Token refresh: [src/api/client.ts:50-82](src/api/client.ts#L50-L82)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-17
**Status:** Ready for backend implementation
