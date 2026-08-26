# PowerShell Quick Deployment & Local Runner Script for CoBuild PropTech

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " CoBuild PropTech - مركز شفافية البناء" -ForegroundColor Green
Write-Host " Starting Dashboard Application..." -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$IndexPath = Join-Path $CurrentDir "index.html"

if (Test-Path $IndexPath) {
    Write-Host "Opening Dashboard in default browser: $IndexPath" -ForegroundColor Green
    Start-Process $IndexPath
} else {
    Write-Host "Error: index.html not found in $CurrentDir" -ForegroundColor Red
}
