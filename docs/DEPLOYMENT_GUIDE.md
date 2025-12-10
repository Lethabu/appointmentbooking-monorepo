# 🚀 Deployment Guide - Instyle Hair Boutique

**Version:** 1.0  
**Date:** 2024-12-02  
**Status:** Production Deployment Guide

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [Build & Deploy](#build--deploy)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring Setup](#monitoring-setup)
7. [Rollback Procedure](#rollback-procedure)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Automated Checks
Run the pre-deployment checklist script:

```bash
node scripts/pre-deployment-checklist.js
```

This will verify:
- ✅ Environment variables configured
- ✅ Required files exist
- ✅ Documentation complete
- ✅ No console.log in production code
- ✅ No TODO/FIXME comments

### Manual Verification

- [ ] **Code Review:** All code reviewed and approved
- [ ] **Testing:** E2E tests passing (`pnpm test:e2e`)
- [ ] **Performance:** Lighthouse score >90
- [ ] **Security:** No vulnerabilities (`pnpm audit`)
- [ ] **Content:** All text/images finalized
- [ ] **Stakeholder Approval:** Client sign-off received

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production` file:

```bash
# Tenant Configuration
NEXT_PUBLIC_TENANT_ID=ccb12b4d-ade6-467d-a614-7c9d198ddc70

# Supabase (for AI agent memory)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (for AI agents)
OPENAI_API_KEY=sk-your-openai-key

# Paystack (payment processing)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your-public-key
PAYSTACK_SECRET_KEY=sk_live_your-secret-key

# AISensy (WhatsApp)
AISENSY_API_KEY=your-aisensy-key
AISENSY_CAMPAIGN_NAME=instyle-bookings

# Sentry (error tracking)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=9e96c83268cae3e0f27168ed50c92033
CLOUDFLARE_API_TOKEN=your-api-token

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://www.instylehairboutique.co.za
```

### 2. Cloudflare Configuration

#### Pages Project Settings
```bash
# Build command
pnpm build

# Build output directory
.vercel/output/static

# Root directory
apps/booking

# Environment variables
# Add all variables from .env.production
```

#### Workers Configuration
```bash
# Deploy worker
cd packages/worker
wrangler deploy --env production
```

---

## Database Migration

### 1. Backup Current Database

```bash
# Backup D1 database
wrangler d1 backup create appointmentbooking-db --env production
```

### 2. Run Migrations

```bash
# Apply pending migrations
wrangler d1 execute appointmentbooking-db \
  --file=scripts/migrations/007-sync-services.sql \
  --env production
```

### 3. Verify Data

```bash
# Check tenant exists
wrangler d1 execute appointmentbooking-db \
  --command="SELECT * FROM tenants WHERE slug='instylehairboutique'" \
  --env production

# Check services count
wrangler d1 execute appointmentbooking-db \
  --command="SELECT COUNT(*) FROM services WHERE tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'" \
  --env production
```

---

## Build & Deploy

### 1. Build Application

```bash
cd apps/booking

# Install dependencies
pnpm install

# Run build
pnpm build

# Verify build succeeded
ls -la .next
```

### 2. Deploy to Cloudflare Pages

#### Option A: Automatic (via Git)
```bash
# Push to main branch
git add .
git commit -m "Deploy: Phase 2 booking wizard"
git push origin main

# Cloudflare Pages will auto-deploy
```

#### Option B: Manual (via Wrangler)
```bash
# Deploy directly
pnpm wrangler pages deploy .next --project-name=appointmentbooking
```

### 3. Deploy Worker

```bash
cd packages/worker

# Deploy to production
wrangler deploy --env production

# Verify deployment
wrangler tail --env production
```

### 4. Update DNS (if needed)

```bash
# Verify DNS records
nslookup www.instylehairboutique.co.za

# Expected:
# www.instylehairboutique.co.za -> Cloudflare Pages
# instylehairboutique.co.za -> Cloudflare Pages (redirect)
```

---

## Post-Deployment Verification

### 1. Smoke Tests

```bash
# Run smoke tests
pnpm test:e2e:smoke

# Or manually verify:
# 1. Homepage loads
# 2. Services display
# 3. Booking flow works
# 4. Payment integration works
# 5. WhatsApp link works
```

### 2. Critical User Flows

**Test Booking Flow:**
1. Navigate to https://www.instylehairboutique.co.za
2. Click "Book Appointment"
3. Select service
4. Choose date/time
5. Fill customer details
6. Review summary
7. Confirm booking
8. Verify confirmation page

**Test Dashboard:**
1. Navigate to https://dashboard.appointmentbooking.co.za/instylehairboutique
2. Login with owner credentials
3. View appointments
4. Verify data displays correctly

### 3. Performance Checks

```bash
# Run Lighthouse audit
pnpm lhci autorun --url=https://www.instylehairboutique.co.za

# Expected scores:
# Performance: >90
# Accessibility: >90
# Best Practices: >90
# SEO: >90
```

### 4. Security Checks

```bash
# Verify HTTPS
curl -I https://www.instylehairboutique.co.za | grep "HTTP/2 200"

# Verify security headers
curl -I https://www.instylehairboutique.co.za | grep "Strict-Transport-Security"

# Verify rate limiting
# (Make 100+ requests rapidly and verify 429 response)
```

---

## Monitoring Setup

### 1. Enable Cloudflare Analytics

1. Go to Cloudflare Dashboard
2. Navigate to Analytics & Logs
3. Enable Web Analytics
4. Copy beacon token
5. Add to website (already in layout.tsx)

### 2. Configure Sentry

```bash
# Initialize Sentry
pnpm add @sentry/nextjs

# Configure in sentry.client.config.ts and sentry.server.config.ts
# (Already created in components)
```

### 3. Set Up Alerts

**Cloudflare Notifications:**
- High error rate (>1%)
- Traffic spike (>1000 req/min)
- Worker CPU exceeded

**Sentry Alerts:**
- New error types
- Error spike (>10/min)
- Performance degradation

**Slack Webhook:**
```bash
# Add to environment
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

## Rollback Procedure

### If Deployment Fails

#### 1. Immediate Rollback (Cloudflare Pages)
```bash
# Via Dashboard:
# 1. Go to Cloudflare Pages
# 2. Select "appointmentbooking" project
# 3. Go to "Deployments"
# 4. Find last working deployment
# 5. Click "Rollback to this deployment"
```

#### 2. Worker Rollback
```bash
# Deploy previous version
wrangler rollback --env production
```

#### 3. Database Rollback
```bash
# Restore from backup
wrangler d1 backup restore appointmentbooking-db \
  --backup-id=<backup-id> \
  --env production
```

### Rollback Checklist
- [ ] Notify team of rollback
- [ ] Document reason for rollback
- [ ] Verify rolled-back version works
- [ ] Update status page
- [ ] Schedule post-mortem

---

## Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 2. Environment Variables Not Working
```bash
# Verify in Cloudflare Pages settings
# Ensure NEXT_PUBLIC_ prefix for client-side vars
# Redeploy after adding vars
```

#### 3. Database Connection Issues
```bash
# Verify D1 binding in wrangler.toml
# Check database exists
wrangler d1 list

# Test connection
wrangler d1 execute appointmentbooking-db --command="SELECT 1"
```

#### 4. API Endpoints Return 404
```bash
# Verify routes in worker
# Check _routes.json configuration
# Verify worker is deployed
wrangler deployments list
```

#### 5. Slow Performance
```bash
# Check Cloudflare Analytics
# Review Worker CPU time
# Optimize database queries
# Enable caching
```

---

## Deployment Timeline

### Phase 2 Deployment (Week 1-2)

**Day 1: Pre-Deployment**
- [ ] Run pre-deployment checklist
- [ ] Final code review
- [ ] Stakeholder approval

**Day 2: Staging Deployment**
- [ ] Deploy to staging environment
- [ ] Run full E2E test suite
- [ ] Performance testing
- [ ] Security audit

**Day 3: Production Deployment**
- [ ] Deploy to production (off-peak hours)
- [ ] Smoke tests
- [ ] Monitor for 2 hours
- [ ] Enable monitoring alerts

**Day 4-7: Monitoring**
- [ ] Daily performance checks
- [ ] Error rate monitoring
- [ ] User feedback collection
- [ ] Bug fixes as needed

---

## Success Criteria

### Technical
- [ ] Uptime >99.9%
- [ ] API response time <200ms (p95)
- [ ] Page load time <2.5s
- [ ] Error rate <0.1%
- [ ] Lighthouse score >90

### Business
- [ ] Booking conversion >15%
- [ ] Zero payment failures
- [ ] Customer satisfaction >4.5/5

### User Experience
- [ ] Booking completion time <3min
- [ ] Mobile bounce rate <40%
- [ ] Zero critical bugs

---

## Post-Deployment Tasks

### Week 1
- [ ] Monitor error rates daily
- [ ] Review user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance

### Week 2
- [ ] Analyze booking conversion
- [ ] Review analytics data
- [ ] Plan Phase 3 (AI Agents)
- [ ] Client training session

---

## Emergency Contacts

**Technical Issues:**
- DevOps Lead: [Contact]
- Technical Lead: [Contact]

**Business Issues:**
- Product Owner: [Contact]
- Client (Zanele): +27 69 917 1527

**Service Providers:**
- Cloudflare Support: https://dash.cloudflare.com/support
- Sentry Support: https://sentry.io/support
- Paystack Support: https://paystack.com/support

---

## Appendix

### Useful Commands

```bash
# View logs
wrangler tail --env production

# Check deployment status
wrangler deployments list

# Run database query
wrangler d1 execute appointmentbooking-db --command="YOUR_QUERY"

# View analytics
# Go to: https://dash.cloudflare.com/9e96c83268cae3e0f27168ed50c92033

# Run E2E tests
pnpm test:e2e

# Run Lighthouse
pnpm lhci autorun
```

### Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

**Deployment Guide Version:** 1.0  
**Last Updated:** 2024-12-02  
**Next Review:** After Phase 2 deployment
