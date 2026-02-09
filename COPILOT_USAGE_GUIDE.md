# 🎯 How to Use the Copilot App Modernization Prompts

## Quick Start Guide

This repository now includes comprehensive prompts for VS Code Copilot and other AI assistants to help with app modernization, deployment, and best practices.

---

## 📁 Files Created

### 1. **`.github/copilot-app-modernization.md`** (Primary Playbook)
   - **Purpose**: Comprehensive app modernization guide with 3x retry deployment strategy
   - **Includes**:
     - Core modernization principles
     - Pre-modernization assessment checklist
     - 3x retry deployment pattern (progressive backoff: 0s → 30s → 90s)
     - Platform-wide deployment execution (5 phases)
     - Modernization task patterns with before/after examples
     - Security best practices
     - Monitoring & observability
     - Rollback procedures
     - Deployment scoring (target: ≥80/100)

### 2. **`.github/copilot-instructions.md`** (Enhanced)
   - **Purpose**: Core repository instructions auto-loaded by GitHub Copilot
   - **Added**: Deployment strategy reference and quick commands

### 3. **`.github/README.md`** (Documentation)
   - **Purpose**: Guide on how to use these prompts with different AI assistants
   - **Includes**: Command reference, deployment phases breakdown, examples

---

## 🚀 Usage Scenarios

### Scenario 1: Using with GitHub Copilot (VS Code)

**Step 1: Open Repository** ✅ **Auto-loads instructions**

```bash
code /path/to/appointmentbooking-monorepo
```

GitHub Copilot automatically loads `.github/copilot-instructions.md` and has access to all instructions.

**Step 2: Reference Playbook in Chat**

Open Copilot Chat (`Ctrl+Shift+I` or `Cmd+Shift+I`) and use `@workspace`:

```
@workspace How do I add a new API endpoint with Zod validation?
```

Copilot will reference the playbook and provide step-by-step guidance based on Pattern 1.

**Step 3: Get Deployment Guidance**

```
@workspace I need to deploy the worker with retry strategy
```

Copilot will guide you through:
- Pre-deployment validation
- 3x retry deployment pattern
- Health check validation
- Monitoring

**Step 4: Ask About Specific Patterns**

```
@workspace Show me how to create a database migration

@workspace What are the 5 phases of deployment?

@workspace How do I roll back a failed deployment?
```

### Scenario 2: Using with Other AI Assistants (Claude, ChatGPT, etc.)

**Step 1: Provide Context**

When starting a conversation with another AI assistant, reference the playbook:

```
I'm working on the appointmentbooking-monorepo codebase. 
Please follow the patterns and best practices from:
.github/copilot-app-modernization.md

The repository uses:
- PNPM monorepo with Turbo
- Next.js (booking + dashboard apps)
- Cloudflare Workers (API)
- Cloudflare D1 (database)
- TypeScript with Zod validation
```

**Step 2: Reference Specific Sections**

```
I need to add a new API endpoint. 
Follow "Pattern 1: API Modernization" from the playbook.
Use the 3x retry deployment strategy when deploying.
```

**Step 3: Ask for Deployment Guidance**

```
I'm ready to deploy. Walk me through the 5-phase deployment process 
with health validation and monitoring as described in the playbook.
```

---

## 🔄 3x Retry Strategy - How to Use

### For Developers (Manual Deployment)

If your deployment scripts don't support `--retry` flag yet, use this pattern:

```bash
# Pattern: Try 3 times with increasing backoff
for attempt in 1 2 3; do
  echo "Attempt $attempt of 3..."
  
  if pnpm run deploy:worker; then
    echo "✅ Deployment successful on attempt $attempt"
    break
  else
    if [ $attempt -lt 3 ]; then
      backoff=$((attempt * 30))  # 30s, 60s
      echo "⚠️ Attempt $attempt failed, retrying in ${backoff}s..."
      sleep $backoff
    else
      echo "❌ All 3 attempts failed"
      exit 1
    fi
  fi
done
```

### For CI/CD (Automated Deployment)

Add retry logic to your workflow:

```yaml
# .github/workflows/deploy.yml
- name: Deploy Worker with Retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 30
    command: pnpm run deploy:worker
```

---

## 📋 Deployment Workflow Example

### Complete Deployment Process

**Step 1: Pre-Deployment** (2-5 minutes)

```bash
# Run checks
pnpm install
pnpm run build
pnpm run test
pnpm run lint

# Validate OpenAPI specs (if available)
# pnpm run validate:openapi

# Check migrations are valid
ls -la scripts/migrations/
```

**Step 2: Deploy with Retry** (5-10 minutes)

```bash
# Worker deployment (3x retry)
for i in {1..3}; do
  pnpm run deploy:worker && break || {
    echo "Attempt $i failed, retrying in 30s..."
    sleep 30
  }
done

# Pages deployment - Booking app (3x retry)
for i in {1..3}; do
  pnpm run deploy:booking && break || {
    echo "Attempt $i failed, retrying in 30s..."
    sleep 30
  }
done

# Pages deployment - Dashboard app (3x retry)
for i in {1..3}; do
  pnpm run deploy:dashboard && break || {
    echo "Attempt $i failed, retrying in 30s..."
    sleep 30
  }
done
```

**Step 3: Health Validation** (1-3 minutes, with 3x retry per check)

```bash
# Check Worker health (with retry)
for i in {1..3}; do
  curl -f https://api.appointmentbooking.co.za/health && break || {
    echo "Health check $i failed, retrying in 10s..."
    sleep 10
  }
done

# Check API availability
curl -f https://api.appointmentbooking.co.za/api/products

# Check Pages availability
curl -f https://appointmentbooking.co.za
curl -f https://dashboard.appointmentbooking.co.za
```

**Step 4: E2E Testing** (3-5 minutes, optional for minor changes)

```bash
# Run E2E tests against production
pnpm run test:e2e:prod
```

**Step 5: Monitor** (15 minutes active)

```bash
# Watch logs and metrics
# Option 1: Cloudflare dashboard
# Option 2: CLI (if available)
# pnpm run monitor:deployment

# Check for errors
# pnpm run logs:errors --since=15m
```

---

## 🛠️ Common Tasks with Copilot Guidance

### Task 1: Add a New API Endpoint

**Prompt for Copilot**:
```
@workspace I need to add a new API endpoint for creating appointments.
Follow Pattern 1 from the modernization playbook. The endpoint should:
- Accept POST requests at /api/appointments
- Validate input with Zod (tenantId, serviceId, staffId, startTime)
- Check for time slot conflicts
- Insert into database
- Return 201 with created appointment
```

**Expected Guidance**:
1. Create Zod schema
2. Implement route handler with validation
3. Add database query with parameterized binding
4. Write unit tests
5. Deploy with 3x retry
6. Validate deployment

### Task 2: Create Database Migration

**Prompt for Copilot**:
```
@workspace I need to add a new table for appointments.
Follow Pattern 2 from the modernization playbook. The table should:
- Have columns: id, tenant_id, service_id, staff_id, start_time, status
- Include foreign keys to tenants, services, and staff tables
- Add indexes for common queries (tenant_id, staff_id + start_time)
```

**Expected Guidance**:
1. Create migration file with proper naming (e.g., 005-create-appointments.sql)
2. Write CREATE TABLE statement with IF NOT EXISTS
3. Add indexes with IF NOT EXISTS
4. Test locally with wrangler
5. Create rollback script
6. Apply to production with retry

### Task 3: Optimize API Performance

**Prompt for Copilot**:
```
@workspace The /api/products endpoint is slow (200ms P95). 
Follow Pattern 4 from the playbook to add edge caching.
Cache for 5 minutes (300 seconds).
```

**Expected Guidance**:
1. Check Cloudflare cache first
2. Return cached response if available
3. Query database on cache miss
4. Add Cache-Control headers
5. Store in cache
6. Deploy and measure performance improvement

### Task 4: Handle Deployment Failure

**Prompt for Copilot**:
```
@workspace My deployment failed. Guide me through the rollback process
from the playbook. Current errors: 5xx rate at 6%, P95 latency 1200ms.
```

**Expected Guidance**:
1. Check deployment status
2. View recent error logs
3. Identify rollback point (previous stable deployment)
4. Execute rollback (worker + pages)
5. Verify rollback with health checks
6. Document incident

---

## 📊 Deployment Scoring - How to Calculate

After each deployment, calculate the deployment score:

```
Phase 1 (Validation): ___ / 5
Phase 2 (Deploy):     ___ / 5
Phase 3 (Health):     ___ / 5
Phase 4 (E2E):        ___ / 5
Phase 5 (Monitoring): ___ / 5

Total Score: ___ / 25 × 4 = ___ / 100
```

**Scoring Guide**:
- **5/5**: All checks passed, no issues
- **4/5**: Minor issues, non-blocking
- **3/5**: Some issues, investigate
- **2/5**: Major issues, consider rollback
- **1/5**: Critical issues, immediate rollback
- **0/5**: Phase failed completely

**Pass Criteria**: Total score ≥ 80/100

**Example Calculation**:
```
Phase 1: 5/5 ✅ (all validation passed)
Phase 2: 5/5 ✅ (deployed on 1st attempt)
Phase 3: 5/5 ✅ (health checks passed on 1st attempt)
Phase 4: 4/5 ⚠️ (1 non-critical test flaky)
Phase 5: 5/5 ✅ (no alerts, metrics normal)

Total: 24/25 × 4 = 96/100 ✅ PASS
```

---

## ⚠️ Troubleshooting

### Copilot Not Seeing Instructions

**Problem**: Copilot doesn't seem to reference the playbook.

**Solution**:
1. Ensure you're in the workspace root
2. Restart VS Code
3. Use `@workspace` prefix in Copilot Chat
4. Explicitly mention: "Follow patterns from .github/copilot-app-modernization.md"

### Deployment Keeps Failing (All 3 Attempts)

**Problem**: All retry attempts fail with same error.

**Solution**:
1. Check if error is retryable (network vs. code error)
2. Review error logs for root cause
3. Fix code issue if it's not a transient error
4. Retry logic only helps with transient failures (timeouts, rate limits)
5. For code errors, fix and redeploy

### Health Checks Failing After Deployment

**Problem**: Deployment succeeded but health checks fail.

**Solution**:
1. Check if Worker actually deployed: `wrangler deployments list`
2. Verify environment variables configured
3. Check database connection
4. Review Worker logs: `wrangler tail`
5. Test endpoint manually with curl
6. Consider rollback if critical

### E2E Tests Passing Locally But Failing in Production

**Problem**: Tests work in dev but fail in prod.

**Solution**:
1. Check environment differences (API URLs, DB connections)
2. Verify production data exists for test scenarios
3. Check for rate limiting or CORS issues
4. Review production logs for errors
5. Run tests against staging first

---

## 📝 Best Practices Summary

✅ **DO**:
- Always run pre-deployment validation
- Use 3x retry for all deployments
- Monitor for 15 minutes after deployment
- Calculate deployment score
- Document rollback procedures
- Use Zod validation for all inputs
- Write tests before deploying
- Check health endpoints after deploy

❌ **DON'T**:
- Skip pre-deployment checks
- Deploy without tests passing
- Ignore health check failures
- Deploy on Friday afternoon (classic mistake!)
- Skip monitoring phase
- Forget to update OpenAPI specs
- Use string concatenation for SQL queries
- Deploy without rollback plan

---

## 🎓 Learning Resources

### For GitHub Copilot
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Copilot Chat Guide](https://code.visualstudio.com/docs/copilot/copilot-chat)
- [@workspace Usage](https://code.visualstudio.com/docs/copilot/workspace-context)

### For Cloudflare
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Database](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

### For This Repository
- `.github/copilot-app-modernization.md` (main playbook)
- `.github/copilot-instructions.md` (quick reference)
- `API_DOCUMENTATION.md` (API specs, if available)

---

## ✅ Checklist: Am I Using This Correctly?

- [ ] I've read the main playbook (`.github/copilot-app-modernization.md`)
- [ ] I understand the 3x retry strategy (0s → 30s → 90s backoff)
- [ ] I know the 5 phases of deployment
- [ ] I can calculate deployment score
- [ ] I know when to rollback (score < 60 or critical issues)
- [ ] I'm using `@workspace` with Copilot
- [ ] I'm following the modernization patterns (API, DB, frontend)
- [ ] I'm running all validation phases
- [ ] I'm monitoring deployments for 15 minutes
- [ ] I'm documenting issues and resolutions

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-07  
**Feedback**: Open an issue or contact the team lead
