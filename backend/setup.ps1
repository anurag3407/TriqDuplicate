#!/usr/bin/env pwsh
# AI Trading Platform - Backend Setup Script
# This script sets up the backend server with all dependencies

Write-Host "🚀 AI Trading Platform - Backend Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Make sure you're in the server directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "`n🔧 Setting up environment configuration..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Check MongoDB connection (optional)
Write-Host "`n🗄️  Database Setup:" -ForegroundColor Yellow
Write-Host "   • For local MongoDB: Ensure MongoDB is running on localhost:27017" -ForegroundColor Cyan
Write-Host "   • For MongoDB Atlas: Update MONGODB_URI in .env file" -ForegroundColor Cyan

Write-Host "`n🎯 Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your configuration" -ForegroundColor White
Write-Host "2. Ensure MongoDB is running" -ForegroundColor White
Write-Host "3. Start the server:" -ForegroundColor White
Write-Host "   npm run dev    (development)" -ForegroundColor Cyan
Write-Host "   npm start      (production)" -ForegroundColor Cyan
Write-Host "`n📡 Server will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "🔗 API Documentation: http://localhost:8000/api/health" -ForegroundColor Green

Write-Host "`n🎨 Happy coding! 🚀" -ForegroundColor Magenta
