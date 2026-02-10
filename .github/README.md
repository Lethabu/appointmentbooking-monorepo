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

### Templates
- **`pull_request_template.md`**: Standardized PR template with quality gates

### Workflows
- **`workflows/`**: CI/CD pipeline definitions
  - `cloudflare-deploy.yml`: Production deployment with 3-phase validation
  - `enterprise-ci-cd.yml`: Enterprise-grade CI/CD pipeline
  - `quality-gates.yml`: Code quality and security checks

---

## 🤖 Using Copilot Instructions

### For GitHub Copilot in VS Code

GitHub Copilot automatically reads the `.github/copilot-instructions.md` file when you have the repository open. This provides context-aware suggestions.

**To get the best results:**

1. **Open the repository in VS Code**
   ```bash
   code /path/to/appointmentbooking-monorepo
   ```

2. **Enable Copilot**
   - Ensure GitHub Copilot extension is installed
   - Settings are configured in `.vscode/settings.json`

3. **Reference modernization guide when needed**
   - Open `.github/copilot-app-modernization.md` for detailed patterns
   - Use `Ctrl+Space` to trigger Copilot suggestions
   - Use `Ctrl+Enter` to see multiple suggestions

### For Custom AI Agents

When using other AI assistants (Claude, ChatGPT, etc.):

1. **Provide context by referencing instructions**
   ```
   "Please follow the patterns in .github/copilot-instructions.md"
   "Use the deployment strategy from .github/copilot-app-modernization.md"
   ```

2. **For app modernization tasks**
   ```
   "Modernize this API endpoint following the patterns in 
   .github/copilot-app-modernization.md section 'API Endpoint Modernization'"
   ```

---

## 🚀 Quick Start for App Modernization

### 1. Read the Playbook
```bash
cat .github/copilot-app-modernization.md
```

### 2. Understand the 3x Retry Strategy

Every deployment follows this pattern:
```
Attempt 1: Initial deployment (0s)
  ↓ Failure → Wait 30s
Attempt 2: First retry (30s backoff)
  ↓ Failure → Wait 60s
Attempt 3: Final retry (90s total)
  ↓ Failure → Manual intervention
  ✅ Success → Validation
```

### 3. Use Pre-Built Commands

```bash
# Validate before deployment
pnpm run validate:pre-deploy

# Deploy with automatic retry
pnpm run deploy:retry

# Monitor deployment
pnpm run monitor:collect

# Generate report
pnpm run monitor:report
```

---

## 📊 Deployment Phases

### Phase 1: Pre-Deployment Validation
- OpenAPI contract validation
- Database schema validation
- Zod schema alignment
- Migration idempotency check

### Phase 2: Build & Deploy (3x Retry)
- Monorepo build with Turbo
- Cloudflare Worker deployment
- Cloudflare Pages deployment
- Automatic retry on failure

### Phase 3: Health Validation (3x Retry)
- Health endpoint checks
- API availability tests
- Security headers validation
- Retry logic for transient failures

### Phase 4: E2E & Performance
- Contract tests
- Zod runtime validation
- Performance baselines
- Critical path smoke tests

### Phase 5: Continuous Monitoring
- Metrics collection (3 rounds)
- Error rate monitoring
- Latency tracking
- Deployment scoring

---

## 🎯 Success Criteria

Deployment is considered successful when:

- ✅ All pre-deployment validations pass
- ✅ Deployment completes within 3 attempts
- ✅ Health checks pass within 3 retries
- ✅ All API endpoints respond correctly
- ✅ E2E tests pass
- ✅ P95 latency < 500ms
- ✅ Deployment score ≥ 80/100
- ✅ No critical errors in first 15 minutes

---

## 🔄 Retry Logic Implementation

### Automatic Retry (GitHub Actions)
```yaml
- name: Deploy with Retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 30
    command: |
      npx wrangler pages deploy apps/booking/.open-next/assets
```

### Script-Based Retry (Node.js)
```javascript
// Available via: pnpm run deploy:retry
async function deployWithRetry() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await deploy();
      console.log(`✅ Succeeded on attempt ${attempt}/3`);
      return;
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(attempt * 30000); // Progressive backoff
    }
  }
}
```

---

## 📚 Additional Resources

### Documentation
- [Main README](../README.md): Project overview
- [Deployment Guide](../DEPLOYMENT_GUIDE.md): Detailed deployment instructions
- [Retry Guide](../RETRY_GUIDE.md): Retry strategy documentation
- [API Documentation](../API_DOCUMENTATION.md): API reference

### Scripts
- [`scripts/deploy-with-retry.js`](../scripts/deploy-with-retry.js): Automated retry deployment
- [`scripts/pre-deployment-validation.js`](../scripts/pre-deployment-validation.js): Pre-flight checks
- [`scripts/collect-deployment-metrics.js`](../scripts/collect-deployment-metrics.js): Metrics collection
- [`scripts/generate-deployment-report.js`](../scripts/generate-deployment-report.js): Reporting

---

## 🛠️ Maintenance

### Updating Instructions

When updating Copilot instructions:

1. **Edit the appropriate file**
   - `copilot-instructions.md` for general repo info
   - `copilot-app-modernization.md` for modernization patterns

2. **Test with Copilot**
   - Make code changes and verify suggestions align
   - Check that Copilot references new patterns

3. **Document changes**
   - Update version number
   - Add entry to "Last Updated" section

4. **Validate**
   ```bash
   # Ensure markdown is valid
   npx markdownlint .github/copilot-*.md
   ```

### Review Schedule
- **Monthly**: Review and update based on learnings
- **After major releases**: Document new patterns
- **When onboarding**: Gather feedback from new developers

---

## 🤝 Contributing

When contributing new patterns or updates:

1. Follow existing structure and formatting
2. Add concrete examples with code snippets
3. Include success criteria and validation steps
4. Test instructions with AI assistants before committing
5. Update the "Last Updated" timestamp

---

## 📞 Support

For questions about:
- **Copilot Usage**: Check VS Code Copilot documentation
- **Deployment Strategy**: See `copilot-app-modernization.md`
- **Repository Patterns**: See `copilot-instructions.md`
- **CI/CD Issues**: Check `workflows/` directory
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
**Maintained By**: AI Engineering Team
**Version**: 1.0.0
