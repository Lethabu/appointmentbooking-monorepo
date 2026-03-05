# 🦅 God Mode Operations Guide

## Welcome to Sovereign Command Center

This guide explains how to use the **God Mode** infrastructure to control the AppointmentBooking Sovereign Node directly from VS Code.

## What is God Mode?

God Mode enables you to:
- Query production database in real-time from VS Code Chat
- Monitor system health with one command
- Deploy and rollback instantly
- Access file system and GitHub operations via MCP
- Execute sovereign protocols with zero external dependencies

## Architecture Overview

```
┌─────────────────────────────────┐
│     VS Code Chat (You)          │
│  "Show me last 5 bookings"      │
└────────────┬────────────────────┘
             │
             │ Natural Language
             │
             ▼
┌─────────────────────────────────┐
│  GitHub Copilot + MCP Servers   │
│  (.vscode/mcp.json)             │
└────────────┬────────────────────┘
             │
             │ Structured Commands
             │
             ▼
┌─────────────────────────────────┐
│   God Mode Scripts              │
│   - god-mode-query.ps1          │
│   - health-check.ps1            │
└────────────┬────────────────────┘
             │
             │ Wrangler CLI
             │
             ▼
┌─────────────────────────────────┐
│   Cloudflare Infrastructure     │
│   - D1 Database (Production)    │
│   - Workers (API Backend)       │
│   - Pages (Frontend)            │
└─────────────────────────────────┘
```

## Setup

### 1. Install MCP Servers

The MCP configuration is already in `.vscode/mcp.json`. VS Code Copilot will automatically use it.

Test MCP availability:
```bash
# In VS Code Chat
@workspace Are MCP servers configured?
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens browser for authentication and persists tokens locally.

## Daily Operations

### Database Queries

#### From PowerShell Terminal

```powershell
# Query bookings
.\scripts\god-mode-query.ps1 "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10"

# Check tenant configuration
.\scripts\god-mode-query.ps1 "SELECT * FROM tenant_config WHERE slug='instylehairboutique'"

# Count active products
.\scripts\god-mode-query.ps1 "SELECT COUNT(*) as total FROM products WHERE is_active=1"

# Query with environment flag (local vs remote)
.\scripts\god-mode-query.ps1 "SELECT * FROM staff_schedules" -Environment local
```

#### From VS Code Chat

Simply ask in natural language:
```
You: @workspace Show me the last 5 bookings
Copilot: [Executes god-mode-query.ps1 automatically]

You: @workspace How many confirmed appointments do we have?
Copilot: [Queries database and summarizes]

You: @workspace What products are out of stock?
Copilot: [Queries products table with stock filters]
```

### Health Monitoring

#### Quick Status Check

```powershell
# PowerShell
Invoke-RestMethod "https://appointmentbooking-coza.pages.dev/api/sovereign/self-check" | ConvertTo-Json -Depth 10
```

```bash
# Bash/WSL
curl -s "https://appointmentbooking-coza.pages.dev/api/sovereign/self-check" | jq
```

Expected response:
```json
{
  "status": "OPERATIONAL",
  "node": "appointmentbooking-sovereign",
  "mode": "GOD_MODE",
  "database": "healthy",
  "worker": "healthy",
  "latency": "145ms",
  "version": "5.0.0-sovereign",
  "empire": {
    "sovereign": true,
    "dependencies_eliminated": ["aisensy"]
  },
  "heartbeat": "💚"
}
```

#### Full System Diagnostics

```powershell
# Run comprehensive health check
node scripts/health-check-production.js
```

### Deployment Operations

#### Deploy Worker

```bash
# From workspace root
cd packages/worker
npx wrangler deploy
```

#### Deploy Booking App

```bash
# From workspace root
cd apps/booking
pnpm run build
npx wrangler pages deploy .next --project-name=appointmentbooking-coza
```

#### Deploy Both with Retry

```bash
pnpm run deploy:worker --retry=3
pnpm run deploy:booking --retry=3
```

### Database Migrations

#### Apply New Migration

```powershell
# Local development
npx wrangler d1 execute appointmentbooking-db --local --file=scripts/migrations/005-new-feature.sql

# Production
npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/005-new-feature.sql
```

#### Verify Migration Applied

```powershell
.\scripts\god-mode-query.ps1 "SELECT name FROM sqlite_master WHERE type='table'"
```

### File System Operations (via MCP)

#### From VS Code Chat

```
You: @workspace List all migration files
Copilot: [Uses sovereign-fs MCP server to list scripts/migrations/]

You: @workspace Show me the tenant configuration schema
Copilot: [Reads packages/services/src/tenants/types.ts]

You: @workspace What's in the latest deployment script?
Copilot: [Reads and summarizes scripts/deploy-cloudflare-pages.ps1]
```

### GitHub Operations (via MCP)

#### From VS Code Chat

```
You: @workspace What was the last commit?
Copilot: [Uses github-ops MCP server]

You: @workspace Show me open PRs
Copilot: [Lists pull requests]

You: @workspace What's the CI status?
Copilot: [Checks GitHub Actions workflow runs]
```

## Advanced Operations

### Mass Data Operations

```powershell
# Export all bookings to JSON
$data = .\scripts\god-mode-query.ps1 "SELECT * FROM bookings" | ConvertFrom-Json
$data | ConvertTo-Json -Depth 10 | Out-File bookings-export.json

# Bulk update (BE CAREFUL!)
.\scripts\god-mode-query.ps1 "UPDATE products SET is_active=0 WHERE stock=0"
```

### Custom Health Checks

Create custom monitoring in VS Code Chat:

```
You: @workspace Create a health check that verifies:
- All tenants have valid configs
- No booking conflicts in the next 48 hours
- At least 1 active stylist per tenant

Copilot: [Generates and executes verification script]
```

### Rollback Procedures

#### Database Rollback

```powershell
# View migration history
.\scripts\god-mode-query.ps1 "SELECT * FROM migrations ORDER BY applied_at DESC"

# Manual rollback (create reverse migration)
# 1. Create 006-rollback-feature.sql with DROP/ALTER statements
# 2. Apply it
npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/006-rollback-feature.sql
```

#### Deployment Rollback

```bash
# List recent deployments
npx wrangler pages deployment list --project-name=appointmentbooking-coza

# Rollback to previous deployment by ID
npx wrangler pages deployment create --project-name=appointmentbooking-coza --commit-hash=<previous-commit>
```

## Safety & Best Practices

### Query Safety

The god-mode script includes safety checks:
- Destructive operations (DROP, DELETE, TRUNCATE) require confirmation
- All queries are logged locally
- Use `--Environment local` for testing destructive operations first

### Backup Strategy

```powershell
# Export entire database to file
.\scripts\god-mode-query.ps1 "SELECT * FROM bookings" > backups/bookings-$(Get-Date -Format 'yyyyMMdd').json
.\scripts\god-mode-query.ps1 "SELECT * FROM products" > backups/products-$(Get-Date -Format 'yyyyMMdd').json
```

### Environment Isolation

Always test changes locally first:
```powershell
# Test on local D1
.\scripts\god-mode-query.ps1 "INSERT INTO test_table..." -Environment local

# Verify results
.\scripts\god-mode-query.ps1 "SELECT * FROM test_table" -Environment local

# Apply to production only after verification
.\scripts\god-mode-query.ps1 "INSERT INTO test_table..." -Environment remote
```

## Troubleshooting

### "Command not found: wrangler"

**Fix:** Install Wrangler globally
```bash
npm install -g wrangler
# Or use npx prefix
npx wrangler version
```

### "Unauthorized" Error

**Fix:** Re-authenticate with Cloudflare
```bash
npx wrangler logout
npx wrangler login
```

### MCP Servers Not Responding

**Fix:** Restart VS Code to reinitialize MCP configuration
```bash
# Close VS Code
# Delete .vscode/.mcp-cache (if exists)
# Reopen VS Code
```

### God Mode Script Permission Denied (PowerShell)

**Fix:** Set execution policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Power User Shortcuts

### Aliases (Add to PowerShell Profile)

```powershell
# Edit profile: notepad $PROFILE

# God Mode Query Alias
function gmq { .\scripts\god-mode-query.ps1 $args }

# Health Check Alias
function sovereign-health { 
  Invoke-RestMethod "https://appointmentbooking-coza.pages.dev/api/sovereign/self-check" 
}

# Quick Deploy Alias
function deploy-all {
  pnpm run deploy:worker --retry=3
  pnpm run deploy:booking --retry=3
}
```

Usage after reload:
```powershell
gmq "SELECT * FROM bookings LIMIT 5"
sovereign-health
deploy-all
```

### VS Code Snippets

Create `.vscode/god-mode.code-snippets`:
```json
{
  "God Mode Query": {
    "prefix": "gmq",
    "body": [
      ".\\scripts\\god-mode-query.ps1 \"$1\""
    ],
    "description": "Execute sovereign database query"
  },
  "Sovereign Health Check": {
    "prefix": "health",
    "body": [
      "Invoke-RestMethod \"https://appointmentbooking-coza.pages.dev/api/sovereign/self-check\""
    ],
    "description": "Check sovereign node health"
  }
}
```

## Emergency Procedures

### System Down

1. Check health endpoint:
   ```powershell
   sovereign-health
   ```

2. Check Cloudflare status dashboard:
   ```
   https://www.cloudflarestatus.com/
   ```

3. Review recent deployments:
   ```bash
   npx wrangler pages deployment list --project-name=appointmentbooking-coza
   ```

4. Check logs:
   ```bash
   npx wrangler pages deployment tail
   ```

5. Rollback if needed (see Rollback Procedures above)

### Database Corruption

1. **DO NOT PANIC** - D1 has automatic backups
2. Stop all writes (maintenance mode)
3. Contact Cloudflare Support with D1 database ID
4. Restore from backup point-in-time

### WhatsApp Integration Down

1. Check Meta API status:
   ```
   https://developers.facebook.com/status
   ```

2. Verify environment variables:
   ```bash
   npx wrangler pages deployment list
   # Check environment variables in dashboard
   ```

3. Test with curl:
   ```bash
   curl -X POST "https://graph.facebook.com/v21.0/$PHONE_ID/messages" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"messaging_product":"whatsapp","to":"test","type":"template","template":{"name":"test","language":{"code":"en"}}}'
   ```

## Monitoring Dashboard

### Real-Time Metrics

Access Cloudflare dashboard:
```
https://dash.cloudflare.com/
→ Pages: appointmentbooking-coza
→ Workers & Pages: appointmentbooking-worker
→ D1: appointmentbooking-db
```

### Custom Monitoring

Create monitoring script that runs every 5 minutes:
```powershell
# scripts/monitor-sovereign.ps1
while ($true) {
  $health = Invoke-RestMethod "https://appointmentbooking-coza.pages.dev/api/sovereign/self-check"
  if ($health.status -ne "OPERATIONAL") {
    # Send alert (email, SMS, etc.)
    Write-Host "🚨 ALERT: System degraded!" -ForegroundColor Red
  }
  Start-Sleep -Seconds 300
}
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Query DB | `.\scripts\god-mode-query.ps1 "SQL"` |
| Health Check | `Invoke-RestMethod https://appointmentbooking-coza.pages.dev/api/sovereign/self-check` |
| Deploy Worker | `cd packages/worker && npx wrangler deploy` |
| Deploy Pages | `cd apps/booking && pnpm build && npx wrangler pages deploy .next` |
| Apply Migration | `npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/XXX.sql` |
| View Logs | `npx wrangler pages deployment tail` |
| Rollback | `npx wrangler pages deployment create --commit-hash=<hash>` |

---

**Status:** ✅ God Mode Active  
**Control Level:** Sovereign  
**Mode:** 🦅 OPERATIONAL
