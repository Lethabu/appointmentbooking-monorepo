# GitHub Actions Deployment Setup

## Overview
Automatically deploy to Cloudflare Pages with full Next.js routing support using GitHub Actions. This solves the Windows bash dependency issue.

## Benefits

✅ **Automatic deployments** on every push to main
✅ **Full Next.js routing** (dynamic routes, API routes, SSR)
✅ **No Windows limitations** (runs on Linux runners)
✅ **Free** (GitHub Actions free tier: 2,000 minutes/month)
✅ **CI/CD best practices** (automated testing, linting)
✅ **Deployment history** and rollback support

---

## Quick Setup (5 Minutes)

### Step 1: Create GitHub Repository (If Not Already Done)

```powershell
# Initialize git (if not done already)
cd C:\Users\Adrin\OneDrive\Documents\appointmentbooking-monorepo
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/appointmentbooking-monorepo.git
git branch -M main
git push -u origin main
```

### Step 2: Get Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Customize token:
   - **Permissions:**
     - Account | Cloudflare Pages | Edit
     - Account | Account Settings | Read
   - **Account Resources:**
     - Include | Your Account (9e96c83268cae3e0f27168ed50c92033)
5. Click **Continue to summary** > **Create Token**
6. **Copy the token** (you won't see it again!)

### Step 3: Add Secrets to GitHub Repository

1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add two secrets:

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [Paste your Cloudflare API token]

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: `9e96c83268cae3e0f27168ed50c92033`

### Step 4: Push Workflow File

The workflow file is already created at `.github/workflows/deploy-pages.yml`.

Push it to GitHub:
```powershell
git add .github/workflows/deploy-pages.yml
git commit -m "Add GitHub Actions deployment workflow"
git push
```

### Step 5: Verify Deployment

1. Go to your repository on GitHub
2. Click **Actions** tab
3. You should see a workflow run starting
4. Click on the run to see live progress
5. Wait 3-5 minutes for deployment to complete

---

## Workflow Details

### What It Does

The workflow automatically:
1. **Triggers** on push to `main` branch (when booking/dashboard files change)
2. **Builds** Next.js apps with proper environment
3. **Converts** to Cloudflare Pages format with `@cloudflare/next-on-pages`
4. **Deploys** to Cloudflare Pages
5. **Reports** deployment status

### Workflow Structure

```yaml
┌─────────────────────────────┐
│  Push to main branch       │
└──────────┬──────────────────┘
           │
           ├─────────────┬──────────────┐
           ▼             ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌─────────┐
    │ Booking  │  │Dashboard │  │ Worker  │
    │  Build   │  │  Build   │  │ (Manual)│
    └───┬──────┘  └────┬─────┘  └─────────┘
        │              │
        ▼              ▼
    ┌──────────┐  ┌──────────┐
    │ Convert  │  │ Convert  │
    │   to     │  │   to     │
    │  Pages   │  │  Pages   │
    └───┬──────┘  └────┬─────┘
        │              │
        ▼              ▼
    ┌──────────┐  ┌──────────┐
    │  Deploy  │  │  Deploy  │
    │ Booking  │  │Dashboard │
    └──────────┘  └──────────┘
```

---

## Manual Deployment

### Trigger Deployment from GitHub UI

1. Go to **Actions** tab
2. Select "Deploy to Cloudflare Pages" workflow
3. Click **Run workflow** button
4. Select branch: `main`
5. Click **Run workflow**

### Trigger Deployment from Command Line

```powershell
# Trigger workflow via GitHub CLI
gh workflow run deploy-pages.yml

# Or via API
curl -X POST `
  -H "Accept: application/vnd.github+json" `
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN" `
  https://api.github.com/repos/YOUR_USERNAME/appointmentbooking-monorepo/actions/workflows/deploy-pages.yml/dispatches `
  -d '{"ref":"main"}'
```

---

## Customizing the Workflow

### Change Trigger Conditions

**Deploy only when specific files change:**
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'apps/booking/**'
      # Don't deploy dashboard automatically
```

**Deploy on pull requests (for preview):**
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**Schedule automatic deployments:**
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### Add Testing Steps

Before deploying, run tests:
```yaml
- name: Run tests
  working-directory: ./apps/booking
  run: npm test

- name: Run linting
  working-directory: ./apps/booking
  run: npm run lint
```

### Add Build Caching

Speed up builds with caching:
```yaml
- name: Cache Next.js build
  uses: actions/cache@v3
  with:
    path: |
      apps/booking/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}
```

### Add Slack Notifications

Notify team on deployment:
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Advanced Configuration

### Deploy to Different Environments

**Create environment-specific workflows:**

`.github/workflows/deploy-staging.yml`:
```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    # ... same as production but:
    command: pages deploy ... --project-name=appointmentbooking-booking-staging --branch=staging
```

### Use Environment Secrets

Configure different secrets per environment:
1. Go to **Settings** > **Environments**
2. Create environment: `production`
3. Add environment-specific secrets
4. Reference in workflow:
```yaml
jobs:
  deploy:
    environment: production
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
```

### Add Deployment Protection

Require manual approval before production deployment:
1. Go to **Settings** > **Environments** > **production**
2. Enable **Required reviewers**
3. Add team members who can approve

---

## Monitoring Deployments

### GitHub Actions Dashboard

View deployment history and logs:
- Go to **Actions** tab
- Click on any workflow run
- Expand steps to see detailed logs

### Deployment Status Badge

Add to README.md:
```markdown
![Deployment Status](https://github.com/YOUR_USERNAME/appointmentbooking-monorepo/actions/workflows/deploy-pages.yml/badge.svg)
```

### Cloudflare Pages Dashboard

View live deployments:
```
https://dash.cloudflare.com/9e96c83268cae3e0f27168ed50c92033/pages/view/appointmentbooking-booking
```

---

## Troubleshooting

### "Resource not accessible by integration"
- **Issue:** API token doesn't have required permissions
- **Solution:** Recreate token with correct permissions (see Step 2)

### "Project not found"
- **Issue:** Project name doesn't match Cloudflare Pages project
- **Solution:** Verify project names in Cloudflare dashboard and update workflow

### Build Failures
- **Issue:** Dependencies or build errors
- **Solution:** 
  1. Check build logs in Actions tab
  2. Test build locally: `npm run build`
  3. Fix errors and push again

### Deployment Takes Too Long
- **Issue:** Large node_modules or slow builds
- **Solution:**
  1. Add build caching (see above)
  2. Use `npm ci` instead of `npm install`
  3. Remove unused dependencies

---

## Cost & Usage Limits

### GitHub Actions Free Tier
- **Minutes:** 2,000/month (Linux runners)
- **Storage:** 500 MB
- **Typical usage:** ~5-10 minutes per deployment
- **Estimated deployments/month:** 200-400

### Cloudflare Pages
- **Build minutes:** 500/month (free tier)
- **Requests:** Unlimited
- **Bandwidth:** Unlimited
- **Projects:** Unlimited

**Total Monthly Cost: $0** (for most use cases)

---

## Migration from Manual Deployments

### Before (Manual Windows Deployment)
```powershell
# Had to run manually on Windows
cd apps/booking
npm run build
# ❌ Windows bash issue with next-on-pages
```

### After (Automatic CI/CD)
```powershell
# Just push your code
git add .
git commit -m "Update booking flow"
git push
# ✅ Deployed automatically with full routing
```

---

## Next Steps

1. ✅ Push workflow file to GitHub
2. ✅ Add Cloudflare secrets
3. ✅ Test deployment
4. ⚡ Add testing steps
5. 🔔 Configure notifications
6. 📊 Monitor deployments

---

## Additional Workflows

### Workflow: Lint and Test (Pre-Merge)

`.github/workflows/test.yml`:
```yaml
name: Test

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
        working-directory: ./apps/booking
      - run: npm test
        working-directory: ./apps/booking
      - run: npm run lint
        working-directory: ./apps/booking
```

### Workflow: Deploy Worker on Tag

`.github/workflows/deploy-worker.yml`:
```yaml
name: Deploy Worker

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
          workingDirectory: packages/worker
```

---

## Summary

**Setup Time:** 5 minutes  
**Deployment Time:** 3-5 minutes  
**Cost:** $0/month  
**Benefit:** Automatic deployments with full Next.js routing support

This is the **recommended approach** for deploying Cloudflare Pages from Windows!
