# Deploy Pages with Full Next.js Routing Support
# This script rebuilds and redeploys both booking and dashboard apps with next-on-pages

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Cloudflare Pages - Full Routing Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$root = "C:\Users\Adrin\OneDrive\Documents\appointmentbooking-monorepo"

# Add common Node.js paths to PATH
$nodePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:APPDATA\npm",
    "$env:LOCALAPPDATA\pnpm"
)

foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        $env:PATH = "$path;$env:PATH"
    }
}

# Function to check command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Ensure we have required tools
if (-not (Test-Command "node")) {
    Write-Host " ERROR: Node.js not found in PATH" -ForegroundColor Red
    Write-Host " Please install Node.js or add it to your PATH" -ForegroundColor Yellow
    Write-Host " Searched in: $($nodePaths -join ', ')" -ForegroundColor Yellow
    exit 1
}

Write-Host "[Step 1/6] Building Booking App..." -ForegroundColor Green
Set-Location "$root\apps\booking"
$env:NODE_ENV="production"
$env:NODE_OPTIONS="--max-old-space-size=4096"
& npx next build
if ($LASTEXITCODE -ne 0) {
    Write-Host " Build failed for booking app" -ForegroundColor Red
    exit 1
}

Write-Host "`n[Step 2/6] Converting Booking to Cloudflare Pages..." -ForegroundColor Green
& npx @cloudflare/next-on-pages
if ($LASTEXITCODE -ne 0) {
    Write-Host " Pages conversion failed for booking" -ForegroundColor Red
    exit 1
}

Write-Host "`n[Step 3/6] Deploying Booking App..." -ForegroundColor Green
& npx wrangler pages deploy .vercel/output/static --project-name=appointmentbooking-booking --commit-dirty=true
if ($LASTEXITCODE -ne 0) {
    Write-Host " Deployment failed for booking" -ForegroundColor Red
    exit 1
}

Write-Host "`n[Step 4/6] Building Dashboard App..." -ForegroundColor Green
Set-Location "$root\apps\dashboard"
$env:NODE_OPTIONS="--max-old-space-size=8192"
& npx next build --no-lint
if ($LASTEXITCODE -ne 0) {
    Write-Host " Build failed for dashboard app" -ForegroundColor Red
    exit 1
}

Write-Host "`n[Step 5/6] Converting Dashboard to Cloudflare Pages..." -ForegroundColor Green
& npx @cloudflare/next-on-pages
if ($LASTEXITCODE -ne 0) {
    Write-Host " Pages conversion failed for dashboard" -ForegroundColor Red
    exit 1
}

Write-Host "`n[Step 6/6] Deploying Dashboard App..." -ForegroundColor Green
& npx wrangler pages deploy .vercel/output/static --project-name=appointmentbooking-dashboard --commit-dirty=true
if ($LASTEXITCODE -ne 0) {
    Write-Host " Deployment failed for dashboard" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Booking App:   https://appointmentbooking-booking.pages.dev" -ForegroundColor Cyan
Write-Host "Dashboard App: https://appointmentbooking-dashboard.pages.dev`n" -ForegroundColor Cyan

Write-Host "Note: It may take 1-2 minutes for changes to propagate globally.`n" -ForegroundColor Yellow

Set-Location $root
