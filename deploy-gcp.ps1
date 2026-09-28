# ==============================================================================
# CoBuild PropTech - 1-Click Google Cloud Run Deployment Script (PowerShell)
# ==============================================================================

param(
    [string]$ProjectId = "",
    [string]$Region = "me-central1",
    [string]$ServiceName = "cobuild-proptech"
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " CoBuild PropTech Platform - Google Cloud Run Deployment" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Check if gcloud CLI is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Google Cloud CLI (gcloud) is not installed." -ForegroundColor Yellow
    Write-Host "    Install via winget: winget install Google.CloudSDK" -ForegroundColor White
    Write-Host "    Or deploy via Google Cloud Shell (in browser): https://shell.cloud.google.com" -ForegroundColor White
    exit 1
}

# 2. Get active project if not passed
if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    $ProjectId = (gcloud config get-value project 2>$null)
    if ([string]::IsNullOrWhiteSpace($ProjectId) -or $ProjectId -eq "(unset)") {
        Write-Host "[!] No active GCP Project ID found." -ForegroundColor Yellow
        $ProjectId = Read-Host "Please enter your Google Cloud Project ID"
        gcloud config set project $ProjectId
    }
}

Write-Host "[+] Using Google Cloud Project: $ProjectId" -ForegroundColor Green
Write-Host "[+] Target Region: $Region" -ForegroundColor Green
Write-Host "[+] Service Name: $ServiceName" -ForegroundColor Green

# 3. Enable necessary Google APIs
Write-Host "`n[*] Enabling required Google Cloud APIs (Cloud Run, Cloud Build, Artifact Registry)..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 4. Deploy directly from source using Google Cloud Build
Write-Host "`n[*] Building container and deploying to Google Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --allow-unauthenticated `
    --port 8080

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " Deployment Complete! Your CoBuild Platform is Live on Google Cloud." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
