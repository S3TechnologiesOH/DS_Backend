# CMS Authentication Guide

## Overview

The CMS uses a **multi-tenant authentication system** where each customer/organization has its own subdomain and users.

---

## 🔐 Authentication Flow

### Login Requirements
To login, you need **3 pieces of information**:
1. **subdomain** - Your organization's unique identifier
2. **email** - Your user email address
3. **password** - Your password

---

## 📝 Step-by-Step: First Time Setup

### Option 1: Register First Admin User (Recommended)

If you don't have any users yet, you need to **register** to create the first admin user:

**Endpoint:**
```
POST https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/register
```

**Request:**
```json
{
  "subdomain": "mycompany",
  "email": "admin@mycompany.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "customerId": 1,
      "email": "admin@mycompany.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Admin",
      "isActive": true
    }
  }
}
```

**What happens:**
1. Creates a new customer/organization with subdomain "mycompany"
2. Creates first admin user for that organization
3. Returns JWT tokens for immediate use

---

### Option 2: Login with Existing User

If you already have a user account:

**Endpoint:**
```
POST https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/login
```

**Request:**
```json
{
  "subdomain": "mycompany",
  "email": "admin@mycompany.com",
  "password": "SecurePass123"
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
      "customerId": 1,
      "email": "admin@mycompany.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Admin",
      "isActive": true
    }
  }
}
```

---

## 🧪 Testing with cURL

### Register First User
```bash
curl -X POST https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "demo",
    "email": "admin@demo.com",
    "password": "Admin123!",
    "firstName": "Demo",
    "lastName": "Admin"
  }'
```

### Login
```bash
curl -X POST https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "demo",
    "email": "admin@demo.com",
    "password": "Admin123!"
  }'
```

### Get Current User Info
```bash
curl -X GET https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 🔑 Using JWT Tokens

### Access Token
- **Lifetime:** 1 hour (configurable via `JWT_EXPIRES_IN`)
- **Used for:** All API requests requiring authentication
- **Format:** `Authorization: Bearer {accessToken}`

### Refresh Token
- **Lifetime:** 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`)
- **Used for:** Getting a new access token without re-login
- **Stored:** Securely on client-side (httpOnly cookie or secure storage)

### Example API Call with Token
```bash
curl -X GET https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/players \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 👥 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | Full system access | All operations |
| **Editor** | Content management | Create/edit content, playlists, schedules |
| **Viewer** | Read-only access | View content and analytics |
| **SiteManager** | Site-level admin | Manage assigned site only |

---

## 🌐 Multi-Tenant Architecture

### Subdomain Isolation
Each customer/organization is identified by a unique **subdomain**:

- Customer A: `subdomain: "acme"` → Users login with `"subdomain": "acme"`
- Customer B: `subdomain: "demo"` → Users login with `"subdomain": "demo"`

### Data Isolation
- Users can only access data within their customer/organization
- All database queries are filtered by `customerId`
- Complete data separation between customers

---

## 🛠️ CMS Frontend Integration

### 1. Login Form
```html
<form id="loginForm">
  <input type="text" name="subdomain" placeholder="Organization ID" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>
```

### 2. JavaScript Login Handler
```javascript
async function login(subdomain, email, password) {
  const response = await fetch('https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ subdomain, email, password })
  });

  const data = await response.json();

  if (data.status === 'success') {
    // Store tokens
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));

    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    alert(data.message || 'Login failed');
  }
}
```

### 3. Authenticated API Calls
```javascript
async function fetchData(endpoint) {
  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch(`https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    // Token expired, try to refresh
    await refreshToken();
    return fetchData(endpoint); // Retry
  }

  return response.json();
}
```

### 4. Token Refresh
```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch('https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();

  if (data.status === 'success') {
    localStorage.setItem('accessToken', data.data.accessToken);
  } else {
    // Refresh failed, redirect to login
    localStorage.clear();
    window.location.href = '/login';
  }
}
```

---

## 🔒 Security Best Practices

### For Frontend Developers

1. **Store Tokens Securely**
   - Use `httpOnly` cookies for refresh tokens (recommended)
   - Or use secure storage (localStorage with encryption)
   - Never expose tokens in URL parameters

2. **Handle Token Expiration**
   - Implement automatic token refresh
   - Redirect to login on 401 errors
   - Clear tokens on logout

3. **HTTPS Only**
   - Always use HTTPS in production
   - Never send credentials over HTTP

4. **Password Requirements**
   - Enforce strong passwords (8+ chars, uppercase, lowercase, number)
   - Use password strength indicators
   - Implement "forgot password" flow

---

## 📋 Common Error Responses

### Invalid Credentials
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```
**Causes:** Wrong email, password, or subdomain

### Validation Error
```json
{
  "status": "error",
  "message": "Validation failed: Password must contain at least one uppercase letter"
}
```
**Causes:** Password doesn't meet requirements

### Email Already Registered
```json
{
  "status": "error",
  "message": "Email already registered for this organization"
}
```
**Causes:** Trying to register with existing email

### Token Expired
```json
{
  "status": "error",
  "message": "Authentication token expired"
}
```
**Causes:** Access token expired (refresh needed)

---

## 🚀 Quick Start Checklist

### Backend Setup
- [x] Backend API is deployed and running
- [x] Database is configured
- [x] Environment variables are set

### Create First User
- [ ] Choose a subdomain (e.g., "demo", "mycompany")
- [ ] Choose admin email
- [ ] Create strong password (8+ chars, uppercase, lowercase, number)
- [ ] Call `POST /api/v1/auth/register`
- [ ] Save returned tokens

### Test Authentication
- [ ] Login with registered credentials
- [ ] Call `GET /api/v1/auth/me` to verify
- [ ] Test authenticated endpoints (e.g., `GET /api/v1/players`)

### Frontend Integration
- [ ] Create login form
- [ ] Implement token storage
- [ ] Handle authentication state
- [ ] Implement token refresh
- [ ] Add logout functionality

---

## 📖 API Documentation

View interactive API documentation at:
```
https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api-docs
```

Navigate to **Auth** section to test authentication endpoints.

---

## 🆘 Troubleshooting

### "Invalid credentials" error
- ✅ Check subdomain spelling
- ✅ Verify email is correct
- ✅ Ensure password is correct
- ✅ Check if user is active in database

### "Validation failed" error
- ✅ Ensure all required fields are provided
- ✅ Check password meets requirements
- ✅ Verify email format is valid

### "Token expired" error
- ✅ Implement token refresh
- ✅ Check token expiration time
- ✅ Ensure refresh token is valid

### Can't register new user
- ✅ Check if customer/subdomain exists
- ✅ Try different subdomain
- ✅ Ensure database is accessible

---

## 📞 Support

For additional help:
1. Check API documentation at `/api-docs`
2. Review backend logs
3. Test with cURL to isolate frontend issues
4. Check network tab in browser DevTools

---

## ✅ Success!

You should now be able to:
- Register the first admin user
- Login to the CMS
- Get JWT tokens
- Make authenticated API calls
- Build a complete CMS frontend

**Happy coding! 🎉**
