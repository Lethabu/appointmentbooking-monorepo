# Sovereign Deployment Verification Script
# 
# This script verifies that all Sovereign components are properly implemented
# and configured in the AppointmentBooking monorepo.

Write-Host ""
Write-Host "SOVEREIGN DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: Verify Copilot Instructions
Write-Host "[1/8] Checking Copilot Instructions..." -ForegroundColor Yellow
$copilotInstructionsPath = ".github\copilot-instructions.md"
if (Test-Path $copilotInstructionsPath) {
    $content = Get-Content $copilotInstructionsPath -Raw
    if ($content -match "Sovereign Architect" -and $content -match "Repeat 3 Times") {
        Write-Host "  ✅ Copilot instructions updated with Sovereign Architect directives" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Copilot instructions missing Sovereign content" -ForegroundColor Red
        $allPassed = $false
    }
} else {
    Write-Host "  ❌ Copilot instructions file not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 2: Verify MCP Configuration
Write-Host "[2/8] Checking MCP Configuration..." -ForegroundColor Yellow
$mcpConfigPath = ".vscode\mcp.json"
if (Test-Path $mcpConfigPath) {
    $mcpConfig = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
    if ($mcpConfig.mcpServers.PSObject.Properties.Name -contains "sovereign-fs") {
        Write-Host "  ✅ MCP configuration includes sovereign-fs server" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MCP configuration missing sovereign-fs server" -ForegroundColor Red
        $allPassed = $false
    }
} else {
    Write-Host "  ❌ MCP configuration file not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 3: Verify WhatsApp Client
Write-Host "[3/8] Checking WhatsApp Client..." -ForegroundColor Yellow
$whatsappClientPath = "apps\booking\lib\whatsapp\client.ts"
if (Test-Path $whatsappClientPath) {
    $content = Get-Content $whatsappClientPath -Raw
    if ($content -match "SovereignWhatsApp" -and $content -match "META_SYSTEM_USER_TOKEN") {
        Write-Host "  ✅ Sovereign WhatsApp client implemented" -ForegroundColor Green
    } else {
        Write-Host "  ❌ WhatsApp client missing Sovereign implementation" -ForegroundColor Red
        $allPassed = $false
    }
} else {
    Write-Host "  ❌ WhatsApp client file not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 4: Verify Health Check Endpoint
Write-Host "[4/8] Checking Health Check Endpoint..." -ForegroundColor Yellow
$healthCheckPath = "apps\booking\app\api\sovereign\self-check\route.ts"
if (Test-Path $healthCheckPath) {
    $content = Get-Content $healthCheckPath -Raw
    if ($content -match "GOD_MODE" -and $content -match "appointmentbooking-sovereign") {
        Write-Host "  ✅ Sovereign health check endpoint created" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Health check endpoint missing Sovereign features" -ForegroundColor Red
        $allPassed = $false
    }
} else {
    Write-Host "  ❌ Health check endpoint file not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 5: Verify God Mode Query Scripts
Write-Host "[5/8] Checking God Mode Query Scripts..." -ForegroundColor Yellow
$scriptsPassed = $true
if (Test-Path "scripts\god-mode-query.ps1") {
    Write-Host "  ✅ PowerShell god-mode-query.ps1 exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ PowerShell god-mode-query.ps1 not found" -ForegroundColor Red
    $scriptsPassed = $false
}
if (Test-Path "scripts\god-mode-query.sh") {
    Write-Host "  ✅ Bash god-mode-query.sh exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ Bash god-mode-query.sh not found" -ForegroundColor Red
    $scriptsPassed = $false
}
if (-not $scriptsPassed) {
    $allPassed = $false
}

# Test 6: Verify Documentation
Write-Host "[6/8] Checking Documentation..." -ForegroundColor Yellow
$docsPassed = $true
if (Test-Path "docs\SOVEREIGN_WHATSAPP_INTEGRATION.md") {
    Write-Host "  ✅ WhatsApp integration guide exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ WhatsApp integration guide not found" -ForegroundColor Red
    $docsPassed = $false
}
if (Test-Path "docs\GOD_MODE_OPERATIONS_GUIDE.md") {
    Write-Host "  ✅ God Mode operations guide exists" -ForegroundColor Green
} else {
    Write-Host "  ❌ God Mode operations guide not found" -ForegroundColor Red
    $docsPassed = $false
}
if (-not $docsPassed) {
    $allPassed = $false
}

# Test 7: Check Environment Variable Requirements
Write-Host "[7/8] Checking Environment Variable Documentation..." -ForegroundColor Yellow
$copilotContent = Get-Content $copilotInstructionsPath -Raw
if ($copilotContent -match "META_SYSTEM_USER_TOKEN" -and $copilotContent -match "META_PHONE_NUMBER_ID") {
    Write-Host "  ✅ Required environment variables documented" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Environment variables not fully documented" -ForegroundColor Yellow
}

# Test 8: Verify File Structure
Write-Host "[8/8] Verifying File Structure..." -ForegroundColor Yellow
$requiredPaths = @(
    "apps\booking\lib\whatsapp\client.ts",
    "apps\booking\lib\whatsapp\index.ts",
    "apps\booking\app\api\sovereign\self-check\route.ts",
    ".vscode\mcp.json",
    "scripts\god-mode-query.ps1",
    "scripts\god-mode-query.sh",
    "docs\SOVEREIGN_WHATSAPP_INTEGRATION.md",
    "docs\GOD_MODE_OPERATIONS_GUIDE.md"
)

$structurePassed = $true
foreach ($path in $requiredPaths) {
    if (-not (Test-Path $path)) {
        Write-Host "  ❌ Missing: $path" -ForegroundColor Red
        $structurePassed = $false
    }
}
if ($structurePassed) {
    Write-Host "  ✅ All required files present" -ForegroundColor Green
} else {
    $allPassed = $false
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

if ($allPassed) {
    Write-Host "[VERIFICATION PASSED]" -ForegroundColor Green
    Write-Host "All Sovereign components are properly implemented!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Set environment variables in Cloudflare Pages:" -ForegroundColor White
    Write-Host "   - META_SYSTEM_USER_TOKEN" -ForegroundColor Gray
    Write-Host "   - META_PHONE_NUMBER_ID" -ForegroundColor Gray
    Write-Host "2. Deploy the updated apps:" -ForegroundColor White
    Write-Host "   pnpm run deploy:booking --retry=3" -ForegroundColor Gray
    Write-Host "3. Test the health endpoint:" -ForegroundColor White
    Write-Host "   Invoke-RestMethod https://appointmentbooking-coza.pages.dev/api/sovereign/self-check" -ForegroundColor Gray
    Write-Host "4. Try God Mode query:" -ForegroundColor White
    Write-Host "   .\scripts\god-mode-query.ps1 'SELECT * FROM tenant_config' -Environment local" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Documentation: See docs\GOD_MODE_OPERATIONS_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Status: GOD_MODE READY" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[VERIFICATION FAILED]" -ForegroundColor Red
    Write-Host "Some components are missing or incomplete." -ForegroundColor Red
    Write-Host "Review the errors above and fix the issues." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
