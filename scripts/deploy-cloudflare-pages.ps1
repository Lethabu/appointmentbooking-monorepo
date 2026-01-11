#!/usr/bin/env pwsh

# ============================================================================
# AppointmentBooking.co.za - Cloudflare Pages Deployment Script (PowerShell)
# Uses @cloudflare/next-on-pages for proper Next.js to Cloudflare conversion
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  AppointmentBooking.co.za - Cloudflare Pages Deployment             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Set working directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Host "📂 Working directory: $projectRoot" -ForegroundColor Green
Write-Host ""

# Check for pnpm
Write-Host "🔍 Checking for pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm is installed ($pnpmVersion)" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm is not installed. Please install pnpm first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Navigate to booking app directory
$bookingAppPath = Join-Path $projectRoot "apps\booking"
Set-Location $bookingAppPath
Write-Host "📂 Navigating to booking app directory..." -ForegroundColor Yellow
Write-Host "✅ Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Install booking app dependencies
Write-Host "📦 Installing booking app dependencies..." -ForegroundColor Yellow
pnpm install
Write-Host "✅ Booking app dependencies installed" -ForegroundColor Green
Write-Host ""

# Check if @cloudflare/next-on-pages is available
Write-Host "🔍 Checking for @cloudflare/next-on-pages..." -ForegroundColor Yellow
$nextOnPagesPath = Join-Path $bookingAppPath "node_modules\.bin\next-on-pages"
if (Test-Path $nextOnPagesPath) {
    $NEXT_ON_PAGES = $nextOnPagesPath
    Write-Host "✅ @cloudflare/next-on-pages is installed locally" -ForegroundColor Green
} else {
    Write-Host "⚠️  @cloudflare/next-on-pages not found, installing..." -ForegroundColor Yellow
    pnpm add -D @cloudflare/next-on-pages
    $NEXT_ON_PAGES = $nextOnPagesPath
    Write-Host "✅ @cloudflare/next-on-pages installed" -ForegroundColor Green
}
Write-Host ""

# Clean previous build artifacts
Write-Host "🧹 Cleaning previous build artifacts..." -ForegroundColor Yellow
Remove-Item ".next" -Recurse -ErrorAction SilentlyContinue | Out-Null
Remove-Item ".vercel" -Recurse -ErrorAction SilentlyContinue | Out-Null
Remove-Item "node_modules\.cache" -Recurse -ErrorAction SilentlyContinue | Out-Null
Write-Host "✅ Clean complete" -ForegroundColor Green
Write-Host ""

# Build Next.js application for CloudPages
Write-Host "🔨 Building Next.js application for Cloudflare Pages..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=8192"
pnpm exec next build
Write-Host "✅ Next.js build completed successfully" -ForegroundColor Green
Write-Host ""

# Check if .next directory exists
if (-not (Test-Path ".next")) {
    Write-Host "❌ Build failed - .next directory not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ .next directory exists" -ForegroundColor Green
Write-Host ""

# Convert Next.js build to Cloudflare Pages format
Write-Host "🔄 Converting Next.js build to Cloudflare Pages format..." -ForegroundColor Yellow
& $NEXT_ON_PAGES --yes
Write-Host "✅ Conversion complete" -ForegroundColor Green
Write-Host ""

# Check if .vercel/output directory was created
if (-not (Test-Path ".vercel\output")) {
    Write-Host "❌ Conversion failed - .vercel/output directory not found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ .vercel/output directory exists" -ForegroundColor Green
Write-Host ""

# Check if wrangler is available
Write-Host "🔍 Checking for wrangler..." -ForegroundColor Yellow
try {
    $wranglerVersion = wrangler --version 2>$null
    $WRANGLER_CMD = "wrangler"
    Write-Host "✅ wrangler is available" -ForegroundColor Green
} catch {
    Write-Host "⚠️  wrangler not found globally, using npx..." -ForegroundColor Yellow
    $WRANGLER_CMD = "npx wrangler"
    Write-Host "✅ Will use npx wrangler" -ForegroundColor Green
}
Write-Host ""

# Deploy to Cloudflare Pages
Write-Host "🚀 Deploying to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host "   Project: appointment-booking-coza" -ForegroundColor Cyan
Write-Host ""

# Deploy using wrangler pages deploy
$deployCmd = "$WRANGLER_CMD pages deploy .vercel/output --project-name=appointment-booking-coza --branch=main"
Invoke-Expression $deployCmd

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅ Deployment to Cloudflare Pages completed successfully!          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Check deployment status in Cloudflare Dashboard" -ForegroundColor White
Write-Host "   2. Update DNS records if needed" -ForegroundColor White
Write-Host "   3. Test the deployed application" -ForegroundColor White
Write-Host ""
