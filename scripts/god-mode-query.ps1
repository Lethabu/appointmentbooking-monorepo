# 🦅 God Mode D1 Query Bridge (PowerShell)
# Sovereign Command Center - Direct Database Access
# 
# This script provides a safe bridge between VS Code Copilot and Cloudflare D1,
# enabling real-time production data queries without leaving the IDE.
# 
# Usage: .\scripts\god-mode-query.ps1 "SELECT * FROM bookings LIMIT 5"
# Usage: .\scripts\god-mode-query.ps1 "SELECT COUNT(*) as total FROM bookings WHERE status='confirmed'" -Environment local

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Query,
    
    [Parameter(Mandatory=$false, Position=1)]
    [ValidateSet("local", "remote")]
    [string]$Environment = "remote"
)

$DB_NAME = "appointmentbooking-db"

# Validation
if ([string]::IsNullOrWhiteSpace($Query)) {
    Write-Host "❌ Error: No query provided." -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage: .\god-mode-query.ps1 'SQL_QUERY' [-Environment local|remote]"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\god-mode-query.ps1 'SELECT * FROM bookings LIMIT 5'"
    Write-Host "  .\god-mode-query.ps1 'SELECT COUNT(*) FROM tenant_config' -Environment local"
    exit 1
}

# Safety check for destructive operations
if ($Query -match "^\s*(DROP|DELETE|TRUNCATE|ALTER)") {
    Write-Host "⚠️  WARNING: Destructive operation detected!" -ForegroundColor Red
    Write-Host "Query: $Query" -ForegroundColor Yellow
    $confirm = Read-Host "Are you sure you want to execute this? (type YES to confirm)"
    if ($confirm -ne "YES") {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Execute query
Write-Host "🦅 Executing Sovereign Command on $DB_NAME ($Environment)..." -ForegroundColor Blue
Write-Host "Query: $Query" -ForegroundColor Yellow
Write-Host ""

$wranglerArgs = @("d1", "execute", $DB_NAME, "--command", $Query)
if ($Environment -eq "local") {
    $wranglerArgs += "--local"
} else {
    $wranglerArgs += "--remote"
}

try {
    npx wrangler $wranglerArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Sovereign Command executed successfully" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Sovereign Command failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error executing Sovereign Command: $_" -ForegroundColor Red
    exit 1
}
