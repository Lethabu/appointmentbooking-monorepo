# 🎯 How to Use the Copilot App Modernization Prompts

## Quick Start Guide

This repository now includes comprehensive prompts for VS Code Copilot and other AI assistants to help with app modernization, deployment, and best practices.

---

## 📁 Files Created

### 1. **`.github/copilot-app-modernization.md`** (Primary Playbook)
   - **Size**: 586 lines, 15KB
   - **Purpose**: Comprehensive app modernization guide with 3x retry deployment strategy
   - **Includes**:
     - Core modernization principles
     - Pre-modernization assessment checklist
     - 3x retry deployment pattern (progressive backoff: 0s → 30s → 90s)
     - Platform-wide deployment execution (5 phases)
     - Modernization task patterns with before/after examples
     - Security patterns (JWT, input sanitization, rate limiting)
     - Monitoring & observability with 3-round metrics collection
     - Rollback procedures (automatic and manual)
     - AI assistant guidelines
     - Quick reference commands
     - Success metrics (80/100 minimum score)

### 2. **`.github/copilot-instructions.md`** (Enhanced)
   - **Update**: Added reference to modernization playbook
   - **New Section**: Deployment strategy with quick commands
   - **Includes**: 5-phase deployment process with retry logic

### 3. **`.github/README.md`** (Usage Documentation)
   - **Size**: 262 lines, 7KB
   - **Purpose**: Complete guide on how to use the Copilot instructions
   - **Includes**:
     - Directory structure explanation
     - How to use with GitHub Copilot
     - How to use with custom AI agents
     - Quick start for app modernization
     - Deployment phases breakdown
     - Success criteria
     - Retry logic implementation examples
     - Maintenance guidelines

### 4. **`.vscode/settings.json`** (Updated)
   - **New Settings**: GitHub Copilot configuration
   - **Improvements**:
     - Enabled Copilot for all file types
     - TypeScript workspace configuration
     - Format on save
     - ESLint auto-fix
     - File associations for Copilot markdown files

---

## 🚀 Usage Instructions

### For GitHub Copilot Users

1. **Open Repository in VS Code**
   ```bash
   code /path/to/appointmentbooking-monorepo
   ```

2. **Copilot Automatically Loads Instructions**
   - GitHub Copilot reads `.github/copilot-instructions.md` automatically
   - Context-aware suggestions will follow repository patterns
   - Deployment strategies will align with 3x retry logic

3. **Reference Specific Patterns**
   - Open `.github/copilot-app-modernization.md` when working on:
     - API endpoint modernization
     - Database migrations
     - Frontend component updates
     - Security implementations
     - Deployment scripts

4. **Use Copilot Chat**
   ```
   @workspace How should I deploy this with retry logic?
   @workspace Show me the API modernization pattern
   @workspace What's the database migration best practice?
   ```

### For Other AI Assistants (Claude, ChatGPT, etc.)

1. **Reference Instructions Explicitly**
   ```
   "Follow the patterns in .github/copilot-instructions.md"
   "Use the deployment strategy from .github/copilot-app-modernization.md"
   ```

2. **For Specific Tasks**
   ```
   "Modernize this API endpoint following the 'API Endpoint Modernization' 
   section in .github/copilot-app-modernization.md"
   
   "Create a database migration following the patterns in 
   .github/copilot-app-modernization.md section 'Database Migration Modernization'"
   ```

3. **Copy Relevant Sections**
   - Copy the specific pattern section from the playbook
   - Paste it into your conversation with the AI assistant
   - Ask the assistant to apply that pattern to your code

---

## 🔄 3x Retry Deployment Strategy

### What It Means

Every deployment operation (Worker, Pages, health checks) follows this pattern:

```
Attempt 1: Initial operation (0s wait)
  ↓ Failure → Wait 30 seconds
  
Attempt 2: First retry (30s backoff)
  ↓ Failure → Wait 60 seconds
  
Attempt 3: Final retry (90s total backoff)
  ↓ Failure → Manual intervention required
  ✅ Success → Proceed to next phase
```

### Where It's Applied

1. **Cloudflare Worker Deployment**
   - Initial deploy
   - Retry 1 at 30s if failed
   - Retry 2 at 90s if failed

2. **Cloudflare Pages Deployment**
   - Same 3x retry pattern
   - Progressive backoff

3. **Health Checks**
   - Health endpoint validation
   - API availability checks
   - Each endpoint gets 3 attempts

4. **Metrics Collection**
   - 3 rounds of metrics (not retries, but iterations)
   - Round 1: 1 min after deployment
   - Round 2: 5 min after deployment
   - Round 3: 15 min after deployment

### Commands with Built-in Retry

```bash
# Deploy with automatic 3x retry
pnpm run deploy:retry

# Deploy and retry until success (no limit)
pnpm run deploy:until-success

# Check deployment status and continue
pnpm run deploy:continue
```

---

## 📊 5-Phase Deployment Process

### Phase 1: Pre-Deployment Validation
```bash
pnpm run validate:pre-deploy
# or individual checks:
pnpm run validate:openapi
pnpm run validate:schema
pnpm run validate:zod
```

**What it checks:**
- OpenAPI contracts are valid
- Database schema matches migrations
- Zod schemas align with TypeScript
- Migrations are idempotent

### Phase 2: Build & Deploy (3x Retry)
```bash
pnpm run build
pnpm run deploy:retry
```

**What happens:**
- Monorepo build with Turbo
- Worker deployment with retry
- Pages deployment with retry
- Automatic progressive backoff on failure

### Phase 3: Health Validation (3x Retry on Checks)
```bash
pnpm run validate:health
pnpm run validate:endpoints
```

**What it checks:**
- Health endpoint responds 200
- All critical API routes available
- Security headers present
- Each check retries up to 3 times

### Phase 4: E2E & Performance
```bash
pnpm run validate:e2e
pnpm run validate:zod-runtime
pnpm run validate:performance
```

**What it tests:**
- End-to-end contract tests
- Runtime Zod validation
- Performance baselines (P95 < 500ms)

### Phase 5: Continuous Monitoring
```bash
pnpm run monitor:collect
pnpm run monitor:report
```

**What it collects:**
- 3 rounds of metrics (1min, 5min, 15min)
- Error rates
- Latency percentiles
- Deployment score (target: ≥80/100)

---

## 🎯 Success Criteria

Deployment succeeds when **ALL** criteria are met:

- ✅ Pre-deployment validation passes
- ✅ Deployment completes within 3 attempts
- ✅ Health checks pass within 3 retries
- ✅ All API endpoints respond correctly
- ✅ E2E tests pass
- ✅ P95 latency < 500ms
- ✅ Deployment score ≥ 80/100
- ✅ No critical errors in first 15 minutes

---

## 🛠️ Example Workflows

### Example 1: Modernize an API Endpoint

1. **Read the pattern**
   ```bash
   # Open in VS Code
   code .github/copilot-app-modernization.md
   # Search for: "API Endpoint Modernization"
   ```

2. **Apply the pattern**
   - Convert Express-style to Worker pattern
   - Add Zod validation
   - Update OpenAPI spec
   - Add CORS headers
   - Implement error handling

3. **Validate locally**
   ```bash
   pnpm run dev
   # Test endpoint manually
   ```

4. **Deploy with retry**
   ```bash
   pnpm run validate:pre-deploy
   pnpm run deploy:retry
   pnpm run validate:health
   ```

### Example 2: Create a Database Migration

1. **Read the pattern**
   - See "Database Migration Modernization" section
   - Follow idempotent pattern

2. **Create migration file**
   ```bash
   # Create: scripts/migrations/XXX-your-migration.sql
   # Use: CREATE TABLE IF NOT EXISTS
   # Use: CREATE INDEX IF NOT EXISTS
   ```

3. **Test locally**
   ```bash
   npx wrangler d1 execute appointmentbooking-db --local \
     --file=scripts/migrations/XXX-your-migration.sql
   ```

4. **Deploy with retry**
   ```bash
   for i in {1..3}; do
     npx wrangler d1 execute appointmentbooking-db \
       --file=scripts/migrations/XXX-your-migration.sql && break
     sleep 30
   done
   ```

### Example 3: Full Platform Deployment

```bash
# 1. Validate everything
pnpm run validate:pre-deploy

# 2. Deploy with automatic retry
pnpm run deploy:retry

# 3. Monitor deployment
pnpm run monitor:collect

# 4. Generate report
pnpm run monitor:report

# Expected output: "Deployment Score: 85/100 ✅"
```

---

## 📚 Key Patterns to Remember

### 1. Always Validate First
```bash
pnpm run validate:pre-deploy
```

### 2. Use Built-in Retry Commands
```bash
pnpm run deploy:retry  # Better than manual retry
```

### 3. Monitor After Deploy
```bash
pnpm run monitor:collect  # 3 rounds of metrics
```

### 4. Check Deployment Score
```bash
pnpm run monitor:report   # Must be ≥80/100
```

### 5. Rollback if Needed
```bash
# Automatic rollback on failure in CI/CD
# Manual: npx wrangler pages deployment create --commit-hash=<prev>
```

---

## 🔍 Testing the Prompts

### Validate Copilot Integration

1. **Open VS Code**
2. **Create a new file** in the repository
3. **Start typing** a function related to API, deployment, or database
4. **Observe Copilot suggestions** - they should follow patterns from the playbook
5. **Use Copilot Chat** to ask about deployment strategy

### Test with Commands

```bash
# Validate all documentation exists
ls -la .github/copilot-*.md

# Check file sizes
wc -l .github/copilot-*.md

# Search for key terms
grep -i "retry" .github/copilot-app-modernization.md
grep -i "deployment" .github/copilot-app-modernization.md
```

---

## 📈 Benefits of This Setup

1. **Consistency**: All AI assistants follow the same patterns
2. **Best Practices**: Built-in retry, validation, and monitoring
3. **Production-Ready**: 3x retry ensures reliability
4. **Complete Coverage**: From code to deployment to monitoring
5. **Self-Documenting**: Patterns include working examples
6. **Maintainable**: Clear structure for updates
7. **Scalable**: Works for entire platform, not just one app

---

## 🔄 Next Steps

1. **Try it with Copilot**
   - Open VS Code with the repo
   - Start coding
   - Observe context-aware suggestions

2. **Run a test deployment**
   ```bash
   pnpm run deploy:retry
   ```

3. **Review generated report**
   ```bash
   pnpm run monitor:report
   cat deployment-report-*.json
   ```

4. **Iterate and improve**
   - Document learnings in the playbook
   - Update patterns based on experience
   - Share knowledge with team

---

## 🤝 Contributing

To improve these prompts:

1. **Test patterns** with real modernization tasks
2. **Document learnings** in appropriate sections
3. **Add concrete examples** with code snippets
4. **Update success criteria** as platform evolves
5. **Maintain version numbers** and update timestamps

---

## 📞 Getting Help

- **Copilot Instructions**: `.github/copilot-instructions.md`
- **Modernization Playbook**: `.github/copilot-app-modernization.md`
- **Usage Guide**: `.github/README.md` (this document)
- **Deployment Scripts**: `scripts/deploy-*.js`
- **Validation Scripts**: `scripts/validate-*.js`

---

**Created**: 2026-02-07  
**Purpose**: Guide AI assistants through production-grade app modernization  
**Status**: Ready for use ✅
