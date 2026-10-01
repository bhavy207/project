# DevPilot: Local Setup Script for Windows PowerShell
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "🤖 DevPilot: Local Setup Script (`$0 Development Budget)" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

if (-not (Test-Path .env)) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

node scripts/check-env.js

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "`nDocker detected! Launching Docker Compose stack..." -ForegroundColor Green
    docker compose up -d
} else {
    Write-Host "`nDocker CLI not found in PATH. DevPilot can run with process sandbox fallback." -ForegroundColor Yellow
}

Write-Host "`nDevPilot Setup Complete!" -ForegroundColor Green
Write-Host "Web UI:      http://localhost:3000"
Write-Host "API Gateway: http://localhost:4000"
Write-Host "AI Engine:   http://localhost:8000"
Write-Host "Grafana:     http://localhost:3001"
Write-Host "Mailpit:     http://localhost:8025`n"
