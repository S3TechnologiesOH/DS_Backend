# Quick Start: CMS Authentication

## ✅ Your Backend is Live!

**API URL:** `https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net`

**Swagger UI:** `https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api-docs`

---

## 🚀 Easiest Way: Use Swagger UI

### Step 1: Open Swagger UI
Visit: https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api-docs

### Step 2: Register First Admin User
1. Find the **Auth** section
2. Click on `POST /api/v1/auth/register`
3. Click **"Try it out"**
4. Fill in the request body:
   ```json
   {
     "subdomain": "mycompany",
     "email": "admin@mycompany.com",
     "password": "Admin123!",
     "firstName": "Your",
     "lastName": "Name"
   }
   ```
5. Click **Execute**
6. Copy the `accessToken` and `refreshToken` from the response

### Step 3: Test Authenticated Endpoint
1. Click the **Authorize** button (🔒 at top right)
2. Enter: `Bearer YOUR_ACCESS_TOKEN_HERE`
3. Click **Authorize**, then **Close**
4. Now try `GET /api/v1/auth/me` to see your user info

---

## 🔐 Authentication Details

### Login Requirements
You need **3 pieces of information**:
- **subdomain** - Your organization ID (e.g., "mycompany", "demo")
- **email** - Your email address
- **password** - Strong password (8+ chars, uppercase, lowercase, number)

### Password Requirements
✅ Minimum 8 characters
✅ At least one uppercase letter (A-Z)
✅ At least one lowercase letter (a-z)
✅ At least one number (0-9)

**Valid Examples:**
- `Admin123!`
- `SecurePass1`
- `MyPassword123`

**Invalid Examples:**
- `password` (no uppercase, no number)
- `Pass1` (too short)
- `PASSWORD123` (no lowercase)

---

## 📝 API Endpoints

### Register (First Time)
```
POST /api/v1/auth/register
```
**Body:**
```json
{
  "subdomain": "mycompany",
  "email": "admin@mycompany.com",
  "password": "Admin123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login (Returning Users)
```
POST /api/v1/auth/login
```
**Body:**
```json
{
  "subdomain": "mycompany",
  "email": "admin@mycompany.com",
  "password": "Admin123!"
}
```

### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer {accessToken}
```

### Refresh Token
```
POST /api/v1/auth/refresh
```
**Body:**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

---

## 🌐 Using from Your CMS Frontend

### JavaScript Example

```javascript
// 1. Register or Login
async function login(subdomain, email, password) {
  const response = await fetch(
    'https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subdomain, email, password })
    }
  );

  const data = await response.json();

  if (data.status === 'success') {
    // Store tokens
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
}

// 2. Make Authenticated Requests
async function getPlayers() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    'https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/players',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.json();
}

// 3. Refresh Token When Expired
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch(
    'https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/refresh',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    }
  );

  const data = await response.json();
  if (data.status === 'success') {
    localStorage.setItem('accessToken', data.data.accessToken);
  }
}
```

### React Example

```jsx
import { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api/v1/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Organization ID"
        value={formData.subdomain}
        onChange={(e) => setFormData({...formData, subdomain: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 🔍 Troubleshooting

### Issue: "An unexpected error occurred"
**Solution:** Use Swagger UI instead - it's more reliable for testing

### Issue: "Invalid credentials"
**Solution:** Check that:
- Subdomain is correct
- Email is correct
- Password matches exactly

### Issue: "Validation failed: Password must contain..."
**Solution:** Ensure password has:
- 8+ characters
- At least one uppercase
- At least one lowercase
- At least one number

### Issue: CORS errors from frontend
**Solution:** CORS is set to `*` (allow all). If you still get errors:
1. Check browser console for exact error
2. Ensure you're using `https://` URLs
3. Verify `Content-Type: application/json` header is set

---

## ✅ Testing Checklist

1. [ ] Open Swagger UI at `/api-docs`
2. [ ] Register first user via `POST /auth/register`
3. [ ] Copy access token from response
4. [ ] Click "Authorize" and paste token
5. [ ] Test `GET /auth/me` to verify authentication
6. [ ] Test other endpoints (players, sites, content)
7. [ ] Integrate with your CMS frontend

---

## 📊 User Roles

| Role | Can Do |
|------|--------|
| **Admin** | Everything - full system access |
| **Editor** | Create/edit content, playlists, schedules |
| **Viewer** | View-only access |
| **SiteManager** | Manage specific site only |

*First registered user is always Admin*

---

## 🎯 Next Steps

1. **Register your first admin user** (use Swagger UI)
2. **Save the access token**
3. **Build your CMS frontend** using the examples above
4. **Connect to the API** with authentication
5. **Start managing your digital signage!**

---

## 📚 Full Documentation

- **API Docs:** https://digital-signage-backend-fxeuazanh7cqd7d7.eastus-01.azurewebsites.net/api-docs
- **Auth Guide:** [CMS_AUTHENTICATION_GUIDE.md](./CMS_AUTHENTICATION_GUIDE.md)
- **Player Client:** [PLAYER_CLIENT_REFERENCE.md](./PLAYER_CLIENT_REFERENCE.md)

---

## 🆘 Need Help?

1. ✅ Use Swagger UI for all testing first
2. ✅ Check browser console for errors
3. ✅ Verify all required fields are provided
4. ✅ Ensure password meets requirements
5. ✅ Check API documentation at `/api-docs`

**Your backend is ready - start building your CMS! 🚀**
