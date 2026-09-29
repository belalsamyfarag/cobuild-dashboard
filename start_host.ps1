# ==============================================================================
# CoBuild PropTech — Local Host Server Launcher & Health Checker
# Starts the high-performance Python full-stack server (REST API + SQLite + UI)
# ==============================================================================

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " CoBuild PropTech — مركز شفافية البناء" -ForegroundColor Green
Write-Host " Initializing Local Host Server on Port 8080..." -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $CurrentDir

# 1. Check if port 8080 is already active
$PortCheck = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($PortCheck) {
    Write-Host "[!] Port 8080 is already in use by PID $($PortCheck.OwningProcess[0])." -ForegroundColor Yellow
    Write-Host "[*] Testing health of existing server..." -ForegroundColor Cyan
} else {
    Write-Host "[+] Launching Python backend server process..." -ForegroundColor Green
    Start-Process -FilePath "python" -ArgumentList "backend/app.py" -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

# 2. Probe /healthz endpoint
$HealthUrl = "http://127.0.0.1:8080/healthz"
$MaxAttempts = 5
$Attempt = 0
$Healthy = $false

while ($Attempt -lt $MaxAttempts -and -not $Healthy) {
    $Attempt++
    try {
        $Response = Invoke-RestMethod -Uri $HealthUrl -Method Get -TimeoutSec 3 -ErrorAction Stop
        if ($Response.status -eq "healthy") {
            $Healthy = $true
        }
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($Healthy) {
    Write-Host "`n[✓] CoBuild Local Host Server is LIVE and HEALTHY!" -ForegroundColor Green
    Write-Host "    - Transparency Dashboard: http://localhost:8080" -ForegroundColor White
    Write-Host "    - PropTech Marketplace:   http://localhost:8080/marketplace" -ForegroundColor White
    Write-Host "    - Google Stitch Gallery:  http://localhost:8080/stitch-screens/index.html" -ForegroundColor White
    Write-Host "    - REST API Health Probe:  http://localhost:8080/healthz`n" -ForegroundColor White
    
    Start-Process "http://localhost:8080"
} else {
    Write-Host "`n[!] Server started but health check did not respond in time." -ForegroundColor Yellow
    Write-Host "    Try visiting http://localhost:8080 manually." -ForegroundColor White
}
