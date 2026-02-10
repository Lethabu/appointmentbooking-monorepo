# GitHub Actions Workflows Documentation

This directory contains automated CI/CD workflows for the AppointmentBooking monorepo.

## 📋 Workflows Overview

### 1. `cloudflare-deploy.yml` - Production Deployment (Primary)

**Purpose**: Consolidated deployment workflow for all applications to Cloudflare Pages and Workers.

**Triggers**:
- Push to `main` branch (when files in `apps/*/` or `packages/` change)
- Pull requests to `main` (preview deployments)
- Manual workflow dispatch with environment selection

**What it deploys**:
- ✅ **Booking App** → `appointmentbooking-coza` (https://appointmentbooking.co.za)
- ✅ **Dashboard App** → `appointmentbooking-dashboard` (https://appointmentbooking-dashboard.pages.dev)
- ✅ **Marketing App** → `appointmentbooking-marketing` (https://appointmentbooking-marketing.pages.dev)
- ✅ **Worker API** → `appointmentbooking-worker` (https://appointmentbooking-coza.houseofgr8ness.workers.dev)

**Pipeline Stages**:

1. **Quality Gate**
   - Type checking (booking app)
   - Linting (booking app)
   - Runs first, blocks deployment on critical failures

2. **Build & Deploy (Parallel)**
   - **Booking**: Full Next.js build → next-on-pages conversion → Cloudflare Pages
   - **Dashboard**: Next.js build → next-on-pages conversion → Cloudflare Pages
   - **Marketing**: Next.js build → next-on-pages conversion → Cloudflare Pages
   - **Worker**: Direct Wrangler deployment

3. **Phase 1 Validation** (Build Artifacts & Spec Validation)
   - Build artifact existence and size checks
   - OpenAPI contract compliance
   - Database schema validation
   - Zod schema alignment
   - Bundle size limits

4. **Phase 2 Validation** (Health & API Availability)
   - Comprehensive health checks
   - API endpoint availability tests
   - Database connectivity verification
   - Security headers validation

5. **Phase 3 Validation** (E2E & Contract Tests)
   - E2E contract tests
   - Zod runtime validation
   - Critical path smoke tests
   - Performance baseline checks

6. **PR Comment** (Pull Requests only)
   - Posts deployment URLs to the PR
   - Shows which apps were deployed

**Configuration**:
```yaml
PNPM_VERSION: '10.14.0'
NODE_VERSION: '20'
```

**Required Secrets**:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages and Workers permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `NEXT_PUBLIC_APP_URL` - Public URL for the booking app
- `NEXTAUTH_URL` - NextAuth authentication URL
- `NEXTAUTH_SECRET` - NextAuth secret key

**Build Strategy**:
- Uses `@cloudflare/next-on-pages` to convert Next.js apps to Cloudflare Pages format
- Builds workspace packages (`@repo/db`, `@repo/auth`, etc.) before app builds
- Parallel deployment of all apps for faster CI/CD
- Smart caching of pnpm store and Next.js builds

---

### 2. `enterprise-ci-cd.yml` - Comprehensive Quality Pipeline

**Purpose**: Enterprise-grade CI/CD with security scanning and compliance checks.

**Triggers**:
- Push to `main` or `staging` branches
- Pull requests to `main`
- Daily scheduled security scans (2 AM UTC)

**Pipeline Stages**:
- Code quality & standards
- Matrix testing (Node 18, 20)
- Security scanning
- Performance testing
- Compliance checks

**When to use**: For comprehensive validation before major releases or for scheduled security audits.

---

### 3. `quality-gates.yml` - Fast PR Checks

**Purpose**: Quick quality checks for pull requests.

**Triggers**:
- Pull requests to `main`, `staging`, or `development`

**Checks**:
- Linting
- Type checking
- Unit tests
- Build validation

**When to use**: Automatically runs on all PRs for fast feedback.

---

### 4. `deploy-pages.yml.bak` - Archived Workflow

**Status**: ⚠️ **ARCHIVED - DO NOT USE**

This workflow has been replaced by `cloudflare-deploy.yml` to prevent duplicate deployments and ensure consistency.

**Why archived**:
- Had inconsistent pnpm versions across jobs
- Only deployed booking and dashboard (missing marketing)
- Less comprehensive validation than the new consolidated workflow
- Could conflict with `cloudflare-deploy.yml` deployments

---

## 🚀 Deployment Guide

### Automatic Deployments

1. **Production Deployment** (to main project):
   ```bash
   # Merge to main branch
   git checkout main
   git merge your-feature-branch
   git push origin main
   ```
   
   This triggers `cloudflare-deploy.yml` which deploys all apps.

2. **Preview Deployment** (for testing):
   - Create a PR to `main`
   - Workflow automatically creates preview deployments
   - Check PR comments for deployment URLs

### Manual Deployment

Use the GitHub UI:
1. Go to Actions → "Deploy to Cloudflare"
2. Click "Run workflow"
3. Select environment: `staging` or `production`
4. Click "Run workflow"

Or use GitHub CLI:
```bash
gh workflow run cloudflare-deploy.yml -f environment=staging
```

### Local Testing Before Deployment

```bash
# Install dependencies
pnpm install

# Build all apps locally
pnpm run build

# Test individual app builds
cd apps/booking && pnpm run build
cd apps/dashboard && pnpm run build
cd apps/marketing && pnpm run build

# Test next-on-pages conversion
cd apps/booking && npx @cloudflare/next-on-pages
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Deployment fails with "No .vercel/output/static directory"
- **Cause**: next-on-pages conversion failed
- **Fix**: Check Next.js build logs, ensure app builds successfully locally

**Issue**: Worker deployment fails with "Invalid target es2024"
- **Cause**: esbuild version too old (< 0.19) doesn't support ES2024
- **Fix**: Update esbuild to 0.19+ in package.json overrides
- **Example**: `"esbuild": "0.19.12"` in pnpm.overrides

**Issue**: Dashboard build fails with "ReferenceError: self is not defined"
- **Cause**: Using `export const runtime = 'edge'` with static export
- **Fix**: Remove edge runtime declaration from layout.tsx when using `output: 'export'`
- **Note**: next-on-pages handles Cloudflare Workers adapter automatically

**Issue**: Worker deployment fails (authentication)
- **Cause**: Wrangler authentication or missing secrets
- **Fix**: Verify `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets

**Issue**: Validation scripts fail
- **Cause**: Scripts expect certain environment state
- **Fix**: Most validation failures are set to `continue-on-error: true`, they won't block deployment

**Issue**: pnpm install fails
- **Cause**: Lock file out of sync
- **Fix**: Workflow tries `--frozen-lockfile` first, then falls back to `--no-frozen-lockfile`

### Debugging Workflow Runs

1. Go to Actions tab in GitHub
2. Click on the failed workflow run
3. Expand the failed job
4. Review logs for error messages
5. Common areas to check:
   - Build step outputs
   - Deployment command outputs
   - Validation script results

### Viewing Cloudflare Deployments

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Find your project:
   - `appointmentbooking-coza` (booking)
   - `appointmentbooking-dashboard` (dashboard)
   - `appointmentbooking-marketing` (marketing)
4. View deployment history and logs

---

## 📊 Monitoring

### Deployment Metrics

The workflow automatically collects metrics:
- Build time per app
- Deployment success rate
- Bundle sizes
- Performance baselines

### Health Checks

Post-deployment validation includes:
- HTTP response codes
- API endpoint availability
- Database connectivity
- Security headers presence

---

## 🔐 Security

### Secrets Management

All sensitive data is stored in GitHub Secrets:
- Never commit secrets to the repository
- Rotate secrets regularly
- Use least-privilege access for API tokens

### Cloudflare API Token Permissions

Required scopes:
- Account: Workers Scripts (Edit)
- Account: Workers KV Storage (Edit)
- Account: Cloudflare Pages (Edit)
- Account: D1 (Edit)

### Security Scanning

- CodeQL analysis (in enterprise-ci-cd.yml)
- Dependency scanning
- Security headers validation

---

## 📝 Adding a New App

To add a new app to the deployment pipeline:

1. Create the app directory structure:
   ```
   apps/new-app/
   ├── package.json (with build script)
   ├── next.config.js
   └── app/ or pages/
   ```

2. Add `@cloudflare/next-on-pages` to devDependencies:
   ```json
   {
     "devDependencies": {
       "@cloudflare/next-on-pages": "^1.13.16"
     }
   }
   ```

3. Update `cloudflare-deploy.yml`:
   - Add app path to triggers
   - Add new deployment job (copy existing pattern)
   - Update `needs` in `verify` and `comment` jobs

4. Create Cloudflare Pages project:
   - Go to Cloudflare Dashboard
   - Create new Pages project
   - Name it consistently (e.g., `appointmentbooking-newapp`)

5. Test locally before pushing:
   ```bash
   cd apps/new-app
   pnpm run build
   npx @cloudflare/next-on-pages
   ```

---

## 🎯 Best Practices

1. **Always test locally first** before pushing to main
2. **Use PR previews** to validate changes before merging
3. **Monitor workflow runs** for any failures or warnings
4. **Keep dependencies updated** (especially @cloudflare/next-on-pages)
5. **Review deployment logs** after each production deploy
6. **Use semantic commit messages** for better changelog generation
7. **Keep pnpm version consistent** across all jobs (currently 10.14.0)

---

## 📞 Support

For issues with:
- **Workflows**: Check this documentation and workflow logs
- **Cloudflare deployments**: Review Cloudflare Pages dashboard
- **Build failures**: Check app build logs locally first
- **Secrets**: Verify secrets are set correctly in GitHub Settings

---

---

## Setting Up Secrets

To configure the required secrets for these workflows:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each required secret with its corresponding value

### How to Get Secret Values

#### Cloudflare Secrets
1. **CLOUDFLARE_API_TOKEN**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to My Profile → API Tokens
   - Create a token with "Edit Cloudflare Workers" and "Cloudflare Pages - Edit" permissions
   
2. **CLOUDFLARE_ACCOUNT_ID**:
   - Found in your Cloudflare Dashboard URL: `dash.cloudflare.com/<ACCOUNT_ID>`
   - Or in Workers & Pages → Overview

#### Application Secrets
1. **NEXTAUTH_SECRET**:
   - Generate with: `openssl rand -base64 32`
   
2. **NEXT_PUBLIC_APP_URL** and **NEXTAUTH_URL**:
   - Your production URL (e.g., `https://appointmentbooking.co.za`)

---

## Setting Up Secrets

To configure the required secrets for these workflows:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each required secret with its corresponding value

### How to Get Secret Values

#### Cloudflare Secrets
1. **CLOUDFLARE_API_TOKEN**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to My Profile → API Tokens
   - Create a token with "Edit Cloudflare Workers" and "Cloudflare Pages - Edit" permissions
   
2. **CLOUDFLARE_ACCOUNT_ID**:
   - Found in your Cloudflare Dashboard URL: `dash.cloudflare.com/<ACCOUNT_ID>`
   - Or in Workers & Pages → Overview

#### Application Secrets
1. **NEXTAUTH_SECRET**:
   - Generate with: `openssl rand -base64 32`
   
2. **NEXT_PUBLIC_APP_URL** and **NEXTAUTH_URL**:
   - Your production URL (e.g., `https://appointmentbooking.co.za`)

---

## 🔄 Workflow Maintenance

### Regular Tasks

- [ ] Monthly: Review and update dependencies
- [ ] Monthly: Check for new Cloudflare features/changes
- [ ] Quarterly: Audit secrets and rotate if needed
- [ ] As needed: Update Node.js version
- [ ] As needed: Update pnpm version

### Version History

- **v2.0** (Current): Consolidated workflow with all three apps
- **v1.0** (Archived): Separate deploy-pages.yml workflow
