#!/usr/bin/env pwsh
# NoteXchangE Local Development Startup Script

Write-Host "================================" -ForegroundColor Cyan
Write-Host "NoteXchangE - Local Startup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
Write-Host "✓ npm $npmVersion" -ForegroundColor Green
Write-Host ""

# Backend Setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Push-Location "backend"
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install --legacy-peer-deps
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Pop-Location
Write-Host ""

# Frontend Setup
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Push-Location "frontend"
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install --legacy-peer-deps
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Pop-Location
Write-Host ""

Write-Host "================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Backend (Port 5000):" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend (Port 5173):" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
