# Deploy to Azure App Service using ZipDeploy API
# This script uses the Kudu API to deploy the application

$appName = "digital-signage-backend-fxeuazanh7cqd7d7"
$zipFile = "deploy.zip"
$apiUrl = "https://$appName.scm.azurewebsites.net/api/zipdeploy"

Write-Host "Deploying $zipFile to $appName..." -ForegroundColor Cyan

# Check if zip file exists
if (-not (Test-Path $zipFile)) {
    Write-Host "Error: $zipFile not found!" -ForegroundColor Red
    exit 1
}

# Prompt for publish credentials
Write-Host "`nYou need deployment credentials from Azure Portal:" -ForegroundColor Yellow
Write-Host "  1. Go to App Service -> Deployment Center" -ForegroundColor Yellow
Write-Host "  2. Click 'FTPS credentials' or 'Local Git/FTPS credentials'" -ForegroundColor Yellow
Write-Host "  3. Copy the 'Username' and 'Password' (under Application scope)`n" -ForegroundColor Yellow

$username = Read-Host "Enter deployment username (e.g., digital-signage-backend-fxeuazanh7cqd7d7\username)"
$password = Read-Host "Enter deployment password" -AsSecureString

# Convert SecureString to plain text for Basic Auth
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Create Basic Auth header
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $plainPassword)))

# Deploy via ZipDeploy API
try {
    Write-Host "Uploading and deploying... (this may take 30-60 seconds)" -ForegroundColor Cyan

    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -InFile $zipFile -Headers @{
        Authorization = "Basic $base64AuthInfo"
    } -ContentType "application/zip"

    Write-Host "`nDeployment successful!" -ForegroundColor Green
    Write-Host "Restarting app service..." -ForegroundColor Cyan

    # Note: Restart requires Azure CLI or portal - instruct user
    Write-Host "`nPlease restart the App Service in Azure Portal:" -ForegroundColor Yellow
    Write-Host "  App Service -> Overview -> Restart" -ForegroundColor Yellow

} catch {
    Write-Host "`nDeployment failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "`nAuthentication failed. Please check your credentials." -ForegroundColor Yellow
    }
}
