# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. cloudflare-deploy.yml
**Purpose**: Deploy the booking application to Cloudflare Pages and Workers

**Triggers**:
- Push to `main` branch (production deployment)
- Pull requests to `main` (preview deployment)
- Manual workflow dispatch

**Required Secrets**:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages and Workers permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `NEXT_PUBLIC_APP_URL` - Public URL for the application
- `NEXTAUTH_URL` - NextAuth authentication URL
- `NEXTAUTH_SECRET` - NextAuth secret key

### 2. quality-gates.yml
**Purpose**: Run code quality checks on pull requests and pushes

**Triggers**:
- Pull requests to `main` or `develop`
- Push to `main` or `develop`

**Required Secrets**: None (optional)

**Features**:
- ESLint analysis
- Prettier format checking
- TypeScript type checking
- Unit, integration, and E2E tests (if configured)
- Security audit
- Quality metrics reporting

### 3. enterprise-ci-cd.yml
**Purpose**: Comprehensive enterprise-grade CI/CD pipeline

**Triggers**:
- Push to `main`, `develop`, or `staging`
- Pull requests to `main` or `develop`
- Scheduled daily security scans at 2 AM UTC

**Required Secrets**:
- `CLOUDFLARE_API_TOKEN` - For deployment (optional, will skip if not set)
- `CLOUDFLARE_ACCOUNT_ID` - For deployment (optional, will skip if not set)

**Optional Secrets**:
- `SNYK_TOKEN` - For Snyk security scanning (will skip if not set)
- `LHCI_GITHUB_APP_TOKEN` - For Lighthouse CI performance monitoring
- `SLACK_WEBHOOK` - For Slack notifications (will skip if not set)

**Features**:
- Code quality and linting
- Security scanning (npm audit, Snyk, CodeQL)
- Unit and integration tests (per app in matrix)
- Build verification
- Deployment to production (main branch only)
- Post-deployment validation

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

## Workflow Status

You can check workflow status at:
- `https://github.com/<owner>/<repo>/actions`

## Validating Workflows

Before committing workflow changes, run the validation script:

```bash
pnpm run validate:workflows
```

This will check:
- All referenced scripts exist in package.json
- All referenced script files exist in the scripts directory
- Workflow files are properly formatted
- Required secrets are documented

## Troubleshooting

### Common Issues

1. **"CLOUDFLARE_API_TOKEN environment variable not set"**
   - Ensure the secret is added in GitHub repository settings
   - Verify the secret name matches exactly (case-sensitive)

2. **Tests failing**
   - Check that test scripts exist in package.json
   - Tests are configured to continue on error if not implemented

3. **Build failures**
   - Review build logs in the Actions tab
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

### Disabling Optional Features

Some features are optional and will be skipped if not configured:

- **Snyk scanning**: Requires `SNYK_TOKEN` secret
- **Slack notifications**: Requires `SLACK_WEBHOOK` secret
- **Accessibility tests**: Currently disabled (can be enabled by removing `if: false`)
- **Performance tests**: Currently disabled (can be enabled by removing `if: false`)
- **E2E tests**: Currently disabled (can be enabled by removing `if: false`)

To enable these features:
1. Remove the `if: false` condition from the job
2. Add the necessary test infrastructure to your codebase
3. Configure any required secrets

## Maintenance

### Updating Workflows

When updating workflows:
1. Test changes in a feature branch first
2. Review workflow runs to ensure they pass
3. Update this README if adding new secrets or features

### Action Versions

Current action versions:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `pnpm/action-setup@v4`
- `actions/cache@v4`
- `cloudflare/wrangler-action@v3`
- `github/codeql-action/analyze@v3`
- `actions/github-script@v7`

Update these regularly to get bug fixes and new features.
