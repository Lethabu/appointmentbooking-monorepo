# GitHub Configuration & AI Assistant Instructions

This directory contains configuration files for GitHub integrations and AI-powered development tools.

## 📁 Directory Contents

### Copilot Instructions

- **`copilot-instructions.md`**: Core repository instructions for AI assistants
  - Architecture overview
  - Development workflows
  - Code patterns and conventions
  - Integration points
  - Quick reference for repository-specific practices

- **`copilot-app-modernization.md`**: Comprehensive app modernization playbook
  - **3x Retry Deployment Strategy**: Progressive backoff with automatic retry
  - **Platform-Wide Deployment**: Multi-phase validation pipeline
  - **Best Practice Patterns**: API modernization, database migrations, security
  - **Monitoring & Rollback**: Real-time metrics and automated recovery

### Workflows

- **`.github/workflows/`**: CI/CD automation (not covered in this README)

---

## 🚀 How to Use These Instructions

### For GitHub Copilot Users

GitHub Copilot in VS Code **automatically loads** `copilot-instructions.md` when you open this repository. No manual action needed!

**To leverage the full playbook**:
1. Open `.github/copilot-app-modernization.md` in VS Code
2. Use `@workspace` in Copilot Chat to query the playbook
3. Reference specific sections when asking Copilot for help

**Example prompts**:
```
@workspace How do I deploy with 3x retry strategy?

@workspace Show me the pattern for adding a new API endpoint

@workspace What are the 5 phases of deployment validation?
```

### For Other AI Assistants (Claude, ChatGPT, etc.)

When working with this codebase using other AI tools:

1. **Provide context** by copying the relevant instructions:
   ```
   "Follow the patterns in .github/copilot-app-modernization.md"
   ```

2. **Reference specific sections**:
   ```
   "Use the API Modernization pattern from the playbook (Pattern 1)"
   ```

3. **Link to deployment strategy**:
   ```
   "Deploy using the 3x retry strategy described in the playbook"
   ```

---

## 📖 What's Included in the Playbook

### 🎯 Core Principles
- Architecture-first approach (monorepo, runtime boundaries, data layer)
- Modernization patterns (API-first, type safety, edge computing)
- Quality gates (TypeScript, Zod, OpenAPI, tests, CI)

### 📋 Pre-Modernization Checklist
- Technical context validation
- Dependencies & constraints assessment
- Database impact analysis
- API contract change planning

### 🔄 3x Retry Deployment Strategy

**Progressive backoff**:
- **Attempt 1**: Immediate (0s wait)
- **Attempt 2**: After 30s backoff
- **Attempt 3**: After 90s total backoff

**Applied to**:
- ✅ Cloudflare Worker deployment
- ✅ Cloudflare Pages deployment  
- ✅ Health endpoint checks
- ✅ API availability validation
- ✅ Database migrations (optional)

### 🚀 5-Phase Deployment Process

1. **Pre-Deployment Validation** (2-5 min)
   - OpenAPI contract validation
   - Database schema validation
   - TypeScript compilation
   - Unit tests
   - Migration idempotency checks

2. **Build & Deploy** (5-10 min, with 3x retry)
   - Monorepo build (Turbo)
   - Worker deployment
   - Pages deployment (booking + dashboard)

3. **Health Validation** (1-3 min, with 3x retry per check)
   - Worker health endpoint
   - Database connectivity
   - API availability
   - Pages availability
   - Security headers

4. **End-to-End Validation** (3-5 min)
   - Critical path testing
   - Contract compliance
   - Performance baseline (P95 < 500ms)

5. **Post-Deployment Monitoring** (15 min active + ongoing)
   - Request latency (P50, P95, P99)
   - Error rate monitoring
   - Request volume tracking
   - Database query performance

### 🛠️ Modernization Patterns

Ready-to-use patterns with before/after code examples:

- **Pattern 1**: API Modernization (new endpoint with Zod validation)
- **Pattern 2**: Database Migration (safe schema changes)
- **Pattern 3**: Frontend Feature (Next.js with TypeScript)
- **Pattern 4**: Performance Optimization (edge caching)

### 🔐 Security Best Practices
- Input validation (always use Zod)
- SQL injection prevention (parameterized queries)
- Authentication & authorization
- Security headers

### 📊 Monitoring & Observability
- Metrics to track (request, performance, error, business)
- Structured logging patterns
- Alert configuration (critical vs warning)

### 🔙 Rollback Procedures
- When to rollback (criteria & thresholds)
- 5-step rollback process
- Database rollback special cases

### 📈 Deployment Scoring
- Scoring formula (0-100 scale)
- Success criteria (score ≥ 80/100)
- Example deployments (pass/fail scenarios)

---

## 📚 Quick Commands Reference

```bash
# Development
pnpm install                    # Install dependencies
pnpm run build                  # Build all packages
pnpm run dev                    # Start dev servers

# Database
npx wrangler d1 execute DB_NAME --local --file=scripts/migrations/XXX.sql
npx wrangler d1 execute DB_NAME --file=scripts/migrations/XXX.sql  # Production

# Deployment (with 3x retry)
pnpm run deploy:worker --retry=3
pnpm run deploy:booking --retry=3
pnpm run deploy:dashboard --retry=3

# Validation
pnpm run validate:pre-deploy
pnpm run validate:health --retry=3
pnpm run test:e2e:prod

# Monitoring
pnpm run monitor:deployment
pnpm run logs:errors --since=15m

# Rollback
wrangler rollback <deployment-id>
npx wrangler pages deployment rollback --project-name=<project>
```

---

## 🎓 Training & Examples

The playbook includes detailed training examples:

- **Example 1**: Modernize Legacy API Route
  - Before: No validation, poor error handling
  - After: Zod validation, proper HTTP codes, error handling

- **Example 2**: Database Migration
  - Creating migration files
  - Testing locally
  - Rollback scripts
  - Production deployment

- **Example 3**: Frontend Feature
  - Type definitions
  - Server components
  - Client components
  - Deployment

---

## ✅ Modernization Checklist Template

The playbook provides a comprehensive checklist for every modernization task:

- Pre-Work (context gathering)
- Implementation (code changes)
- Testing (unit, integration, manual)
- Deployment (validation, deploy, monitoring)
- Documentation (README, comments, API docs)
- Sign-off (scoring, alerts, team notification)

---

## 🤝 Contributing to These Instructions

These instructions are designed to evolve with the codebase. When updating:

1. **Keep examples current**: Update code examples when patterns change
2. **Add new patterns**: Document new modernization patterns as they emerge
3. **Update commands**: Keep CLI commands in sync with package.json scripts
4. **Version updates**: Increment version number in playbook footer

---

## 📧 Support

For questions about these instructions:
- Open an issue in the repository
- Tag the team lead in Slack
- Review existing examples in the codebase

---

**Last Updated**: 2026-02-07  
**Version**: 1.0.0
