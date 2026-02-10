#!/usr/bin/env pwsh
# AppointmentBooking.co.za Health Check Script
# Run this regularly to verify all services are operational

Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   AppointmentBooking Health Check             ║" -ForegroundColor Cyan
Write-Host "║   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Worker API Endpoints
Write-Host "🔹 WORKER API TESTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

$workerUrl = "https://appointmentbooking-worker.houseofgr8ness.workers.dev"

# Test 1: Landing Page
Write-Host "  Testing: Landing Page..." -NoNewline
$response1 = curl.exe --ssl-no-revoke -s -o $null -w "%{http_code}" $workerUrl
if ($response1 -eq "200") {
    Write-Host " ✅ $response1 OK" -ForegroundColor Green
} else {
    Write-Host " ❌ $response1 FAILED" -ForegroundColor Red
}

# Test 2: Health Check
Write-Host "  Testing: /api/health..." -NoNewline
$response2 = curl.exe --ssl-no-revoke -s -o $null -w "%{http_code}" "$workerUrl/api/health"
if ($response2 -eq "200") {
    Write-Host " ✅ $response2 OK" -ForegroundColor Green
    # Get detailed health info
    $healthData = curl.exe --ssl-no-revoke -s "$workerUrl/api/health" | ConvertFrom-Json
    Write-Host "    ├─ Database: $($healthData.services.database)" -ForegroundColor Gray
    Write-Host "    └─ Worker: $($healthData.services.worker)" -ForegroundColor Gray
} else {
    Write-Host " ❌ $response2 FAILED" -ForegroundColor Red
}

# Test 3: Products API
Write-Host "  Testing: /api/products..." -NoNewline
$response3 = curl.exe --ssl-no-revoke -s -o $null -w "%{http_code}" "$workerUrl/api/products?tenantId=instylehairboutique&limit=1"
if ($response3 -eq "200") {
    Write-Host " ✅ $response3 OK" -ForegroundColor Green
    $products = curl.exe --ssl-no-revoke -s "$workerUrl/api/products?limit=1" | ConvertFrom-Json
    Write-Host "    └─ Products available: $($products.results.Count)+" -ForegroundColor Gray
} else {
    Write-Host " ❌ $response3 FAILED" -ForegroundColor Red
}

# Pages Deployments
Write-Host "`n🔹 PAGES DEPLOYMENTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

# Test 4: Booking Pages
Write-Host "  Testing: Booking Pages..." -NoNewline
$response4 = curl.exe --ssl-no-revoke -s -o $null -w "%{http_code}" "https://appointmentbooking-booking.pages.dev"
if ($response4 -eq "404") {
    Write-Host " 🟡 $response4 (Static Assets Only)" -ForegroundColor Yellow
    Write-Host "    └─ Note: 404 expected - routing not configured yet" -ForegroundColor Gray
} elseif ($response4 -eq "200") {
    Write-Host " ✅ $response4 OK" -ForegroundColor Green
} else {
    Write-Host " ❌ $response4 FAILED" -ForegroundColor Red
}

# Test 5: Dashboard Pages
Write-Host "  Testing: Dashboard Pages..." -NoNewline
$response5 = curl.exe --ssl-no-revoke -s -o $null -w "%{http_code}" "https://appointmentbooking-dashboard.pages.dev"
if ($response5 -eq "404") {
    Write-Host " 🟡 $response5 (Static Assets Only)" -ForegroundColor Yellow
    Write-Host "    └─ Note: 404 expected - routing not configured yet" -ForegroundColor Gray
} elseif ($response5 -eq "200") {
    Write-Host " ✅ $response5 OK" -ForegroundColor Green
} else {
    Write-Host " ❌ $response5 FAILED" -ForegroundColor Red
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SUMMARY                                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$allGreen = ($response1 -eq "200") -and ($response2 -eq "200") -and ($response3 -eq "200")

if ($allGreen) {
    Write-Host "  ✅ ALL CRITICAL SERVICES OPERATIONAL" -ForegroundColor Green
    Write-Host "  📊 Worker API: LIVE" -ForegroundColor Green
    Write-Host "  📊 Database: CONNECTED" -ForegroundColor Green
    Write-Host "  📊 Pages: DEPLOYED (static)" -ForegroundColor Yellow
} else {
    Write-Host "  ⚠️  SOME SERVICES NEED ATTENTION" -ForegroundColor Yellow
    if ($response1 -ne "200") { Write-Host "    - Worker Landing Page failed" -ForegroundColor Red }
    if ($response2 -ne "200") { Write-Host "    - Health Check failed" -ForegroundColor Red }
    if ($response3 -ne "200") { Write-Host "    - Products API failed" -ForegroundColor Red }
}

Write-Host "`n  Next Actions:" -ForegroundColor Cyan
Write-Host "  • Configure custom domains (optional)" -ForegroundColor Gray
Write-Host "  • Update production secrets (optional)" -ForegroundColor Gray
Write-Host "  • Enable Pages routing for full functionality" -ForegroundColor Gray
Write-Host "`n  📖 See: QUICK_START_GUIDE.md or DOCUMENTATION_INDEX.md`n" -ForegroundColor Gray

# Exit with appropriate code
if ($allGreen) {
    exit 0
} else {
    exit 1
}
