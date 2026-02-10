# 📋 VS Code Copilot App Modernization - Quick Reference

> **TL;DR**: This repo now has production-grade AI assistant prompts for app modernization with 3x retry deployment strategy. Everything is ready to use with GitHub Copilot or any AI assistant.
> **TL;DR**: This repo has production-grade AI assistant prompts for app modernization with 3x retry deployment strategy. Everything is ready to use with GitHub Copilot or any AI assistant.

---

## 🚀 What Was Created

### Core Files

| File | Purpose | Size |
|------|---------|------|
| `.github/copilot-app-modernization.md` | **Main playbook** with all patterns, retry logic, deployment phases | 586 lines |
| `.github/copilot-instructions.md` | Enhanced with modernization reference | 81 lines |
| `.github/README.md` | Documentation on using the prompts | 263 lines |
| `COPILOT_USAGE_GUIDE.md` | Complete usage guide with examples | 442 lines |
| `.vscode/settings.json` | Copilot integration settings | Updated |

### Total Documentation
- **1,372+ lines** of AI assistant guidance
- **38KB+** of comprehensive patterns and best practices
- **87 sections** covering every aspect of modernization
- **30+ code examples** with before/after patterns

---

## ⚡ Quick Start (3 Steps)

### Step 1: Open in VS Code
```bash
code /path/to/appointmentbooking-monorepo
```
✅ Copilot automatically loads `.github/copilot-instructions.md`

### Step 2: Reference Modernization Guide
```bash
# Open the playbook
code .github/copilot-app-modernization.md
```
✅ Contains all patterns, retry logic, and deployment strategies

### Step 3: Deploy with Retry
```bash
pnpm run deploy:retry
```
✅ Automatic 3x retry with progressive backoff (0s → 30s → 90s)

---

## 🔄 The 3x Retry Strategy

### How It Works
```
Attempt 1: Deploy (wait 0s)
  ↓ Fail → Wait 30s
Attempt 2: Retry (wait 30s) 
  ↓ Fail → Wait 60s
Attempt 3: Final (wait 90s total)
  ↓ Fail → Manual intervention
  ✅ Success → Continue
```

### Where It's Applied
- ✅ Cloudflare Worker deployment
- ✅ Cloudflare Pages deployment  
- ✅ Health endpoint checks
- ✅ API availability validation
- ✅ Database migrations (optional)

### Built-in Commands
```bash
pnpm run deploy:retry          # 3x retry with backoff
pnpm run deploy:until-success  # Unlimited retry
pnpm run deploy:continue       # Check status & continue
```

---

## 📊 5-Phase Deployment Process

### Phase 1: Validate (Pre-Deploy)
```bash
pnpm run validate:pre-deploy
```
Checks: OpenAPI, DB schema, Zod, migrations

### Phase 2: Build & Deploy (3x Retry)
```bash
pnpm run build
pnpm run deploy:retry
```
Deploys: Worker + Pages with automatic retry

### Phase 3: Health (3x Retry on Checks)
```bash
pnpm run validate:health
pnpm run validate:endpoints
```
Validates: Health endpoint, API routes (retry each)

### Phase 4: E2E & Performance
```bash
pnpm run validate:e2e
pnpm run validate:performance
```
Tests: Contracts, runtime validation, latency

### Phase 5: Monitor (3 Rounds)
```bash
pnpm run monitor:collect   # 1min, 5min, 15min
pnpm run monitor:report    # Generate score
```
Collects: Error rates, latency, deployment score

---

## 🎯 Success Criteria

✅ Deployment score ≥ 80/100  
✅ All phases pass  
✅ P95 latency < 500ms  
✅ Health checks pass in ≤3 attempts  
✅ No critical errors in 15min  

---

## 🛠️ Key Patterns Included

### 1. API Endpoint Modernization
- Before: Express-style routes
- After: Cloudflare Worker with Zod validation
- Location: Section "Pattern 1" in playbook

### 2. Database Migrations
- Idempotent SQL with `IF NOT EXISTS`
- Progressive backfill patterns
- Location: Section "Pattern 2" in playbook

### 3. Frontend Components
- Server-side rendering at edge
- Built-in caching with revalidation
- Location: Section "Pattern 3" in playbook

### 4. Security Patterns
- JWT authentication
- Input sanitization with Zod
- Rate limiting
- Location: "Security Modernization" section

### 5. Monitoring & Observability
- Real-time metrics (3 rounds)
- Deployment scoring
- Location: "Monitoring & Observability" section

### 6. Rollback Procedures
- Automatic on validation failure
- Manual rollback commands
- Location: "Rollback Procedures" section

---

## 📚 Documentation Structure

```
.github/
├── copilot-instructions.md         ← Auto-loaded by Copilot
├── copilot-app-modernization.md    ← Main playbook (read this!)
└── README.md                        ← How to use the prompts

COPILOT_USAGE_GUIDE.md               ← Examples & workflows
QUICK_REFERENCE.md                   ← This file (quick lookup)
```

---

## 💡 Usage Examples

### Example 1: Ask Copilot About Deployment
```
@workspace How do I deploy with retry logic?
→ Copilot will reference .github/copilot-app-modernization.md
```

### Example 2: Modernize an API
1. Open `.github/copilot-app-modernization.md`
2. Find "Pattern 1: API Endpoint Modernization"
3. Copy the pattern
4. Apply to your code
5. Run: `pnpm run validate:pre-deploy`

### Example 3: Create a Migration
1. Find "Pattern 2: Database Migration"
2. Create: `scripts/migrations/XXX-name.sql`
3. Use: `CREATE TABLE IF NOT EXISTS`
4. Test: `npx wrangler d1 execute ... --local`
5. Deploy with retry loop

### Example 4: Full Deployment
```bash
# One command - does everything with retry
pnpm run deploy:retry && \
pnpm run monitor:collect && \
pnpm run monitor:report
```

---

## 🎓 For AI Assistants

### When Using GitHub Copilot
- Opens `.github/copilot-instructions.md` automatically
- Reference `.github/copilot-app-modernization.md` for patterns
- Use `@workspace` to query documentation

### When Using Other AI (Claude, ChatGPT, etc.)
Include in your prompt:
```
"Follow the patterns in .github/copilot-app-modernization.md 
for deployment with 3x retry strategy"
```

### Key Terms to Reference
- "3x retry deployment"
- "Platform-wide deployment execution"
- "API endpoint modernization pattern"
- "Database migration best practices"
- "5-phase deployment process"

---

## 🔍 Quick Validation

### Check Files Exist
```bash
ls -la .github/copilot-*.md
# Should show:
# copilot-app-modernization.md (586 lines)
# copilot-instructions.md (81 lines)
```

### Verify Retry Logic
```bash
grep -i "3x retry" .github/copilot-app-modernization.md
# Should return multiple matches
```

### Test Deployment
```bash
pnpm run deploy:retry
# Should execute with automatic retry logic
```

---

## 🎯 What Makes This Best Practice

1. **Production-Grade Retry**: 3 attempts with progressive backoff
2. **Comprehensive Coverage**: API, DB, frontend, security, monitoring
3. **Real Examples**: 30+ code snippets with before/after
4. **Automated Validation**: Pre-deploy checks prevent issues
5. **Observable**: 3 rounds of metrics collection
6. **Recoverable**: Automatic rollback on failure
7. **AI-Friendly**: Structured for Copilot and other assistants
8. **Maintainable**: Clear sections, version tracking
9. **Scalable**: Works for entire platform
10. **Documented**: 1,372+ lines of guidance

---

## 📈 Benefits

### For Developers
- ✅ Consistent patterns across codebase
- ✅ Reduced deployment failures
- ✅ Clear rollback procedures
- ✅ Automated best practices

### For AI Assistants
- ✅ Context-aware suggestions
- ✅ Repository-specific patterns
- ✅ Production-ready code generation
- ✅ Retry logic built-in

### For Platform
- ✅ Reliable deployments (3x retry)
- ✅ Observable (metrics + scoring)
- ✅ Secure (validation + best practices)
- ✅ Scalable (monorepo-aware)

---

## 🚦 Status

| Component | Status |
|-----------|--------|
| Copilot Instructions | ✅ Created |
| Modernization Playbook | ✅ Created (586 lines) |
| Usage Guide | ✅ Created (442 lines) |
| Quick Reference | ✅ Created (this file) |
| VS Code Settings | ✅ Updated |
| Validation | ✅ Passed |
| Ready to Use | ✅ YES |

---

## 🔗 Quick Links

- **Main Playbook**: [.github/copilot-app-modernization.md](.github/copilot-app-modernization.md)
- **Usage Guide**: [COPILOT_USAGE_GUIDE.md](COPILOT_USAGE_GUIDE.md)
- **Basic Instructions**: [.github/copilot-instructions.md](.github/copilot-instructions.md)
- **Directory Guide**: [.github/README.md](.github/README.md)

---

## 📞 Need Help?

1. **Read the playbook**: `.github/copilot-app-modernization.md`
2. **Check examples**: `COPILOT_USAGE_GUIDE.md`
3. **Test deployment**: `pnpm run deploy:retry`
4. **Validate setup**: Run validation script (see usage guide)

---

**Status**: ✅ Production Ready  
**Created**: 2026-02-07  
**Version**: 1.0.0  
**Retry Strategy**: 3x with progressive backoff (0s→30s→90s)  
**Deployment Phases**: 5 (validate→build→health→e2e→monitor)  
**Success Criteria**: Score ≥80/100, P95<500ms, all phases pass
| `.github/copilot-app-modernization.md` | **Main playbook** with all patterns, retry logic, deployment phases | 586+ lines |
| `.github/copilot-instructions.md` | Enhanced with modernization reference | 80+ lines |
| `.github/README.md` | Documentation on using the prompts | 260+ lines |
| `COPILOT_USAGE_GUIDE.md` | Complete usage guide with examples | 440+ lines |
| `.vscode/settings.json` | Copilot integration settings | Updated |

### Total Documentation

**~1,700 lines** of comprehensive guidance for AI-assisted development.

---

## ⚡ Instant Commands

### Development

```bash
pnpm install                    # Install all dependencies
pnpm run build                  # Build entire monorepo (Turbo)
pnpm run dev                    # Start all dev servers
pnpm run test                   # Run all tests
pnpm run lint                   # Lint all packages
```

### Database Migrations

```bash
# Local (dev)
npx wrangler d1 execute <DB_NAME> --local --file=scripts/migrations/XXX.sql

# Production
npx wrangler d1 execute <DB_NAME> --file=scripts/migrations/XXX.sql

# Check migration status
npx wrangler d1 execute <DB_NAME> --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### Deployment (with 3x Retry)

```bash
# Worker deployment
pnpm run deploy:worker --retry=3

# Pages deployment (booking app)
pnpm run deploy:booking --retry=3

# Pages deployment (dashboard app)
pnpm run deploy:dashboard --retry=3

# Deploy all components
pnpm run deploy:all --retry=3
```

### Validation

```bash
# Pre-deployment checks
pnpm run validate:pre-deploy

# Health checks (with retry)
pnpm run validate:health --retry=3

# E2E tests (production)
pnpm run test:e2e:prod
```

### Monitoring

```bash
# Watch deployment metrics
pnpm run monitor:deployment

# View recent error logs
pnpm run logs:errors --since=15m

# List deployments
wrangler deployments list

# Tail Worker logs
wrangler tail
```

### Rollback

```bash
# Rollback Worker
wrangler rollback <deployment-id>

# Rollback Pages (booking)
npx wrangler pages deployment rollback --project-name=appointmentbooking-booking

# Rollback Pages (dashboard)
npx wrangler pages deployment rollback --project-name=appointmentbooking-dashboard
```

---

## 🔄 3x Retry Strategy (Quick Summary)

### Pattern

```
Attempt 1: Deploy immediately (0s wait)
  ↓ Fail? → Wait 30 seconds
  
Attempt 2: Retry deployment (30s backoff)
  ↓ Fail? → Wait 60 seconds
  
Attempt 3: Final retry (90s total backoff)
  ↓ Fail? → Manual intervention required
  ✅ Success? → Continue to next phase
```

### Application Points

- ✅ Cloudflare Worker deployment
- ✅ Cloudflare Pages deployment (booking + dashboard)
- ✅ Health endpoint checks
- ✅ API availability validation
- ✅ Database migrations (optional, use with caution)

### Manual Retry Script

```bash
# Use this if your deployment script doesn't support --retry
for i in {1..3}; do
  pnpm run deploy:worker && break || {
    echo "Attempt $i failed, retrying in 30s..."
    sleep 30
  }
done
```

---

## 📋 5-Phase Deployment Process (Quick Summary)

### Phase 1: Pre-Deployment Validation (2-5 min)
**Cannot skip** | **Must pass 100%**

- ✅ OpenAPI contract validation
- ✅ Database schema validation
- ✅ TypeScript compilation
- ✅ Unit tests pass
- ✅ Migration idempotency check

**Fail → Stop deployment, fix issues**

### Phase 2: Build & Deploy (5-10 min, with 3x retry)
**Cannot skip**

- ✅ Monorepo build (Turbo)
- ✅ Deploy Worker (3x retry)
- ✅ Deploy Pages - Booking (3x retry)
- ✅ Deploy Pages - Dashboard (3x retry)

**Fail after 3 attempts → Manual intervention**

### Phase 3: Health Validation (1-3 min, 3x retry per check)
**Cannot skip**

- ✅ Worker health endpoint
- ✅ Database connectivity
- ✅ API availability
- ✅ Pages availability
- ✅ Security headers

**Fail after 3 attempts → Consider rollback**

### Phase 4: E2E Validation (3-5 min)
**Can skip for minor changes (docs only)**

- ✅ Critical path testing
- ✅ Contract compliance
- ✅ Performance baseline (P95 < 500ms)

**Fail on critical path → Immediate rollback**

### Phase 5: Post-Deployment Monitoring (15 min active + ongoing)
**Cannot skip**

- ⏱️ Request latency (P50, P95, P99)
- 📊 Error rate (target: <1% for 5xx)
- 🔄 Request volume (±20% acceptable)
- 💾 Database query time (<100ms)

**Sustained issues → Rollback**

---

## 🎯 Success Criteria (At a Glance)

### Deployment Score Formula

```
Total Score = (Phase1 + Phase2 + Phase3 + Phase4 + Phase5) × 4

Each phase scored 0-5:
5 = Perfect (all checks passed)
4 = Minor issues (non-blocking)
3 = Some issues (investigate)
2 = Major issues (consider rollback)
1 = Critical issues (immediate rollback)
0 = Phase failed completely

Pass Threshold: ≥ 80/100
Rollback Trigger: < 60/100 or any phase scores ≤1
```

### Example Passing Deployment

```
Phase 1: 5/5 ✅
Phase 2: 5/5 ✅
Phase 3: 5/5 ✅
Phase 4: 4/5 ⚠️ (1 non-critical test flaky)
Phase 5: 5/5 ✅

Total: 24/25 × 4 = 96/100 ✅ PASS
```

### Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| 5xx Error Rate | <0.5% | >1% for 5min |
| P95 Latency | <300ms | >500ms for 5min |
| P99 Latency | <500ms | >1000ms for 5min |
| Request Volume | ±20% of baseline | Drop >50% |
| Database Query Time | <100ms | >200ms sustained |

---

## 🛠️ Modernization Patterns (Quick Reference)

### Pattern 1: API Modernization

**Steps**:
1. Define OpenAPI contract
2. Create Zod schema (mirrors OpenAPI)
3. Implement route handler with validation
4. Write unit tests (>80% coverage)
5. Deploy with 3x retry
6. Validate deployment

**Key Code**:
```typescript
const CreateSchema = z.object({ field: z.string().uuid() });
const input = CreateSchema.parse(await request.json());
```

### Pattern 2: Database Migration

**Steps**:
1. Create migration file (`scripts/migrations/XXX.sql`)
2. Test locally (`npx wrangler d1 execute ... --local`)
3. Create rollback script (if needed)
4. Apply to production (with retry)
5. Verify migration

**Key Code**:
```sql
CREATE TABLE IF NOT EXISTS table_name (...);
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column);
```

### Pattern 3: Frontend Feature (Next.js)

**Steps**:
1. Create type definitions
2. Create Server Component (data fetching)
3. Create Client Component (interactivity)
4. Deploy with Turbo
5. Validate deployment

**Key Code**:
```typescript
'use client';  // For client components
export default async function ServerComponent() { }  // For server
```

### Pattern 4: Performance Optimization

**Steps**:
1. Check cache first
2. Return cached response if available
3. Query database on cache miss
4. Add Cache-Control headers
5. Store in cache
6. Deploy and measure

**Key Code**:
```typescript
const cache = caches.default;
let response = await cache.match(cacheUrl);
if (!response) { /* fetch and cache */ }
```

---

## 🔐 Security Checklist (Quick)

- [ ] All inputs validated with Zod
- [ ] All SQL queries parameterized (no string concatenation)
- [ ] Authentication checked before operations
- [ ] Tenant isolation enforced (filter by tenant_id)
- [ ] Security headers applied to all responses
- [ ] No sensitive data in logs
- [ ] CORS configured properly

---

## 🔙 Rollback Quick Guide

### When to Rollback

- ❌ Critical functionality broken
- ❌ Security vulnerability introduced
- ❌ Data corruption detected
- ❌ Error rate > 5% sustained for 5+ min
- ❌ P95 latency > 1000ms sustained for 5+ min

### Rollback Steps (5 minutes)

```bash
# 1. Check current status
pnpm run status:deployment
pnpm run logs:errors --since=15m

# 2. Identify rollback point
wrangler deployments list

# 3. Execute rollback
wrangler rollback <previous-deployment-id>

npx wrangler pages deployment rollback --project-name=appointmentbooking-booking
npx wrangler pages deployment rollback --project-name=appointmentbooking-dashboard

# 4. Verify rollback
pnpm run validate:health --retry=3
pnpm run monitor:deployment --duration=5m

# 5. Document incident
# (Update incident log, notify team, schedule post-mortem)
```

---

## 🤖 Using with GitHub Copilot

### Auto-Loaded

GitHub Copilot in VS Code **automatically loads** `.github/copilot-instructions.md` when you open this repo.

### Query the Playbook

```
@workspace How do I deploy with 3x retry?

@workspace Show me the API modernization pattern

@workspace What are the 5 deployment phases?

@workspace How do I rollback a deployment?
```

### Request Step-by-Step Guidance

```
@workspace I need to add a POST /api/appointments endpoint
with Zod validation. Follow Pattern 1 from the playbook.

@workspace Guide me through creating a database migration
for a new 'appointments' table. Follow Pattern 2.

@workspace My deployment failed with 6% 5xx error rate.
Walk me through the rollback procedure.
```

---

## 📊 Status Dashboard (Checklist)

Use this to track deployment status:

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] Tests pass locally
- [ ] OpenAPI contract valid
- [ ] Migrations tested locally
- [ ] No uncommitted changes

### Deployment
- [ ] Worker deployed (attempts: ___ / 3)
- [ ] Booking app deployed (attempts: ___ / 3)
- [ ] Dashboard app deployed (attempts: ___ / 3)

### Validation
- [ ] Health checks pass (attempts: ___ / 3)
- [ ] API endpoints responding
- [ ] Pages loading correctly
- [ ] Security headers present

### Monitoring (First 15 min)
- [ ] No critical alerts triggered
- [ ] Error rate < 1%
- [ ] P95 latency < 500ms
- [ ] Request volume normal
- [ ] Database queries fast (<100ms)

### Post-Deployment
- [ ] Deployment score calculated: ___ / 100
- [ ] ✅ Pass (≥80) or ❌ Rollback (<60)
- [ ] Team notified
- [ ] Documentation updated

---

## 📚 File Locations (Quick Navigation)

```
.github/
├── copilot-instructions.md         ← Auto-loaded by Copilot
├── copilot-app-modernization.md    ← Main playbook (START HERE!)
└── README.md                        ← Usage documentation

Root/
├── COPILOT_USAGE_GUIDE.md          ← Complete guide + examples
├── QUICK_REFERENCE.md               ← This file (instant lookup)
└── .vscode/settings.json            ← Copilot configuration
```

---

## ❓ Quick FAQ

### Q: Do I need to manually reference the playbook with Copilot?

**A**: No, Copilot auto-loads `.github/copilot-instructions.md`. Use `@workspace` to query the full playbook.

### Q: What if a deployment fails all 3 retry attempts?

**A**: Check if the error is retryable (network issue) or code-related. Fix code issues first, then redeploy. Retry logic only helps with transient failures.

### Q: Can I skip the E2E tests (Phase 4)?

**A**: Yes, but only for minor changes like documentation updates. For code changes, always run E2E tests.

### Q: When should I roll back vs. fix forward?

**A**: Rollback if critical functionality is broken or error rate >5%. Fix forward for minor issues that don't impact users.

### Q: What's a "good" deployment score?

**A**: ≥80/100 is passing. ≥90/100 is excellent. <60/100 triggers rollback.

### Q: How do I know if my 3x retry is working?

**A**: Check logs for "Attempt X of 3" messages. Successful deployments typically show attempt 1 or 2, not 3.

---

## 🎯 Next Steps

1. ✅ **Read the main playbook**: [.github/copilot-app-modernization.md](.github/copilot-app-modernization.md)
2. ✅ **Try with Copilot**: Open VS Code, use `@workspace` to query patterns
3. ✅ **Run a test deployment**: Use retry strategy on a non-critical change
4. ✅ **Calculate a deployment score**: Use the formula to assess a recent deployment
5. ✅ **Bookmark this reference**: Keep it open during deployments

---

## 🏆 Success Checklist

You're using this correctly if you can answer "Yes" to all:

- [ ] I know where the main playbook is (`.github/copilot-app-modernization.md`)
- [ ] I understand the 3x retry pattern (0s → 30s → 90s)
- [ ] I can name all 5 deployment phases
- [ ] I know how to calculate deployment score
- [ ] I know when to rollback (score <60 or critical issues)
- [ ] I'm using `@workspace` with Copilot
- [ ] I'm following the modernization patterns
- [ ] I'm running all validation phases
- [ ] I'm monitoring deployments for 15 minutes
- [ ] I have a rollback plan for every deployment

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-07  
**Status**: ✅ Production Ready

---

**Quick Links**:
- [Main Playbook](.github/copilot-app-modernization.md)
- [Usage Guide](COPILOT_USAGE_GUIDE.md)
- [Core Instructions](.github/copilot-instructions.md)
- [GitHub Documentation](.github/README.md)
