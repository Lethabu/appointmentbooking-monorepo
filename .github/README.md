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

---

**Last Updated**: 2026-02-07  
**Maintained By**: AI Engineering Team
