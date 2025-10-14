# Azure Deployment Guide

This guide shows you how to deploy your Digital Signage Backend to Azure Web App.

---

## Prerequisites

 **Azure SQL Database** - Already created
 **Azure Blob Storage** - Already created
 **Azure Web App** - Create for Node.js

---

## Step 1: Create Azure Web App

### Option A: Azure Portal (Web Interface)

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** ’ **"Web App"**
3. Configure:
   - **Resource Group**: Use existing or create new
   - **Name**: `digital-signage-api` (or your choice)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: Same as your SQL Database
   - **Pricing Plan**: Choose based on needs (B1 Basic or higher recommended)
4. Click **"Review + Create"** ’ **"Create"**

### Option B: Azure CLI

```bash
# Login to Azure
az login

# Create Web App
az webapp create \
  --resource-group YourResourceGroup \
  --plan YourAppServicePlan \
  --name digital-signage-api \
  --runtime "NODE:18-lts"
```

---

## Step 2: Configure Environment Variables

You have **two options** to set environment variables:

### Option A: Import JSON via Azure CLI (Fastest)

1. **Edit [azure-app-settings.json](azure-app-settings.json)** with your actual values:

```json
[
  {
    "name": "DB_HOST",
    "value": "your-actual-server.database.windows.net"
  },
  {
    "name": "DB_PASSWORD",
    "value": "your-actual-password"
  },
  {
    "name": "JWT_SECRET",
    "value": "generate-a-secure-random-32-character-string"
  },
  {
    "name": "AZURE_STORAGE_CONNECTION_STRING",
    "value": "DefaultEndpointsProtocol=https;AccountName=..."
  }
  // ... update all other values
]
```

2. **Import to Azure:**

```bash
# Set your Web App name
$webAppName = "digital-signage-api"
$resourceGroup = "YourResourceGroup"

# Import settings from JSON
az webapp config appsettings set \
  --name $webAppName \
  --resource-group $resourceGroup \
  --settings @azure-app-settings.json
```

### Option B: Azure Portal (Manual Entry)

1. Go to your Web App in Azure Portal
2. Navigate to **"Configuration"** ’ **"Application settings"**
3. Click **"+ New application setting"** for each variable
4. Copy values from [azure-app-settings.json](azure-app-settings.json)
5. Click **"Save"** when done

---

## Step 3: Generate Secure JWT Secrets

**IMPORTANT:** Generate secure random strings for JWT secrets (minimum 32 characters).

### Using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this **three times** and use the outputs for:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `PLAYER_JWT_SECRET`

Example output:
```
f8d9a7b2c4e6f1a3d5b7c9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1
```

### Using PowerShell:

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## Step 4: Get Your Azure Credentials

### Azure SQL Connection String

1. Go to your **Azure SQL Database** in the portal
2. Navigate to **"Settings"** ’ **"Connection strings"**
3. Copy the **ADO.NET** connection string
4. Extract values:
   - `DB_HOST`: `Server=` value
   - `DB_NAME`: `Initial Catalog=` value
   - `DB_USER`: `User ID=` value
   - `DB_PASSWORD`: Your password (not shown, you set this)

Example connection string:
```
Server=tcp:myserver.database.windows.net,1433;Initial Catalog=digital_signage;User ID=dbadmin;Password={your_password}
```

### Azure Blob Storage Connection String

1. Go to your **Storage Account** in the portal
2. Navigate to **"Security + networking"** ’ **"Access keys"**
3. Click **"Show keys"**
4. Copy **"Connection string"** for key1 or key2

Example:
```
DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=abc123...;EndpointSuffix=core.windows.net
```

---

## Step 5: Run Database Migrations

**IMPORTANT:** Run migrations from your local machine BEFORE deploying:

```bash
# Make sure your .env has Azure SQL credentials
npm run migrate
```

This creates all 16 tables in your Azure SQL Database.

**Alternative:** Run migrations from Azure:

1. Deploy your app first (Step 6)
2. Use Azure App Service SSH or console:
   - Go to Web App ’ **"Development Tools"** ’ **"Console"** or **"SSH"**
   - Run: `npm run migrate`

---

## Step 6: Deploy Your Application

### Option A: GitHub Actions (Recommended for Production)

1. **Create a GitHub repository** for your code
2. **Push your code:**
   ```bash
   git add .
   git commit -m "Initial backend deployment"
   git push origin main
   ```

3. **Set up deployment:**
   - In Azure Portal, go to your Web App
   - Navigate to **"Deployment Center"**
   - Select **"GitHub"** as source
   - Authorize and select your repository
   - Azure will create a `.github/workflows/` file automatically

4. **Trigger deployment:**
   - Push changes to GitHub
   - GitHub Actions will automatically build and deploy

### Option B: Azure CLI (Direct Deployment)

```bash
# Build your application
npm run build

# Create a deployment ZIP (excluding node_modules and .env)
# On Windows:
Compress-Archive -Path dist,package.json,package-lock.json -DestinationPath deploy.zip

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group YourResourceGroup \
  --name digital-signage-api \
  --src deploy.zip
```

### Option C: VS Code Azure Extension

1. Install **Azure App Service** extension in VS Code
2. Sign in to Azure
3. Right-click your Web App
4. Select **"Deploy to Web App"**
5. Select your project folder

### Option D: Azure Web App Deployment via ZIP

1. Build your application:
   ```bash
   npm run build
   ```

2. Create a `.deployment` file in project root:
   ```
   [config]
   SCM_DO_BUILD_DURING_DEPLOYMENT=true
   ```

3. Use Kudu to deploy:
   - Go to: `https://digital-signage-api.scm.azurewebsites.net/ZipDeployUI`
   - Drag and drop your ZIP file

---

## Step 7: Configure Startup Command

Azure needs to know how to start your app:

1. Go to your Web App in Azure Portal
2. Navigate to **"Configuration"** ’ **"General settings"**
3. Set **"Startup Command"**:
   ```
   npm start
   ```
4. Click **"Save"**

**Alternative:** If using PM2 for process management:
```
pm2 start dist/index.js --name digital-signage-api
```

---

## Step 8: Enable Application Logs

1. Go to **"Monitoring"** ’ **"App Service logs"**
2. Enable:
   - **Application Logging (Filesystem)**: On
   - **Level**: Information
   - **Web server logging**: On
3. Click **"Save"**

View logs:
- Go to **"Monitoring"** ’ **"Log stream"**
- Or use Azure CLI:
  ```bash
  az webapp log tail --name digital-signage-api --resource-group YourResourceGroup
  ```

---

## Step 9: Test Your Deployment

### Check Health Endpoint

```bash
curl https://digital-signage-api.azurewebsites.net/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "environment": "production"
}
```

### Test Authentication

```bash
curl -X POST https://digital-signage-api.azurewebsites.net/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User",
    "subdomain": "testcorp"
  }'
```

---

## Step 10: Configure Custom Domain (Optional)

1. Go to **"Settings"** ’ **"Custom domains"**
2. Click **"+ Add custom domain"**
3. Enter your domain (e.g., `api.yourcompany.com`)
4. Add DNS records as shown
5. Validate and add domain
6. Enable **"HTTPS Only"**

Update `CORS_ORIGIN` in Application Settings:
```
https://api.yourcompany.com,https://your-frontend.com
```

---

## Security Checklist for Production

Before going live, ensure:

-  All JWT secrets are secure random strings (32+ characters)
-  `NODE_ENV` is set to `production`
-  `CORS_ORIGIN` includes only your actual frontend URLs
-  Database credentials are correct
-  Azure Blob Storage connection string is correct
-  HTTPS is enabled (Azure does this by default)
-  Database migrations have been run
-  Application logs are enabled
-  Health endpoint responds successfully

---

## Troubleshooting

### Issue: App won't start

**Check logs:**
```bash
az webapp log tail --name digital-signage-api --resource-group YourResourceGroup
```

**Common causes:**
- Missing environment variables (check Configuration)
- Wrong Node.js version (ensure Node 18 LTS)
- Database connection issues (verify DB_HOST, DB_PASSWORD)
- Startup command not set (should be `npm start`)

### Issue: "Database pool not initialized"

**Solution:**
1. Verify all `DB_*` environment variables are set correctly
2. Check Azure SQL firewall allows Azure services
3. Run migrations: `npm run migrate`

### Issue: "Failed to upload to Azure Blob Storage"

**Solution:**
1. Verify `AZURE_STORAGE_CONNECTION_STRING` is correct
2. Ensure container exists: `digital-signage-media`
3. Check Storage Account firewall settings

### Issue: CORS errors from frontend

**Solution:**
Update `CORS_ORIGIN` in Application Settings to include your frontend URL:
```
https://your-frontend.azurewebsites.net,https://your-custom-domain.com
```

### Issue: High memory usage

**Solution:**
- Scale up to higher tier (B2 or S1)
- Check for memory leaks in logs
- Optimize database connection pool settings

---

## Monitoring & Maintenance

### View Application Insights

1. Enable Application Insights in your Web App
2. View metrics: requests, response times, failures
3. Set up alerts for errors or high response times

### Scaling

**Vertical Scaling (More Power):**
- Go to **"Scale up (App Service plan)"**
- Choose higher tier (B2, S1, P1V2)

**Horizontal Scaling (More Instances):**
- Go to **"Scale out (App Service plan)"**
- Increase instance count or enable auto-scaling

---

## Deployment Checklist

- [ ] Azure Web App created
- [ ] Environment variables configured ([azure-app-settings.json](azure-app-settings.json))
- [ ] Secure JWT secrets generated and set
- [ ] Database connection tested
- [ ] Blob Storage connection tested
- [ ] Database migrations run
- [ ] Application deployed
- [ ] Health endpoint responds
- [ ] Auth endpoints tested
- [ ] Content upload tested
- [ ] Application logs enabled
- [ ] CORS configured correctly
- [ ] Custom domain configured (if needed)

---

## Quick Reference: Azure CLI Commands

```bash
# View app settings
az webapp config appsettings list --name digital-signage-api --resource-group YourResourceGroup

# Set a single setting
az webapp config appsettings set --name digital-signage-api --resource-group YourResourceGroup --settings KEY=value

# Restart app
az webapp restart --name digital-signage-api --resource-group YourResourceGroup

# View logs
az webapp log tail --name digital-signage-api --resource-group YourResourceGroup

# Check app status
az webapp show --name digital-signage-api --resource-group YourResourceGroup --query state
```

---

## Next Steps

1.  Deploy backend to Azure Web App
2.  Test all endpoints
3. =( Deploy frontend (CMS) to Azure Static Web Apps or Web App
4. =( Update frontend to use production API URL
5. =( Set up CI/CD with GitHub Actions
6. =( Configure monitoring and alerts
7. =( Set up backup strategy for database

---

## Support

- **Azure Documentation**: https://docs.microsoft.com/azure/app-service/
- **Project API Guide**: [API_GUIDE.md](API_GUIDE.md)
- **Development Guide**: [CLAUDE.md](CLAUDE.md)
