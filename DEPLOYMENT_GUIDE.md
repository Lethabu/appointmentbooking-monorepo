# 🚀 AppointmentBooking SaaS - Complete Deployment Guide

## Overview

This guide provides step-by-step instructions to deploy the complete AppointmentBooking SaaS ecosystem—including the main marketing platform, admin dashboard, and tenant booking sites—on Cloudflare's global infrastructure.

## 📋 Prerequisites

- Cloudflare account with a Paid Plan (for D1 and multiple Pages projects)
- Domain ownership:
  - Primary: `appointmentbooking.co.za`
  - Tenant: `instylehairboutique.co.za` (example)
- Authentication providers:
  - [Clerk](https://clerk.com) for Dashboard/Management
  - [Supabase](https://supabase.com) for App data/Auth
- SuperSaaS account credentials
- Node.js, pnpm, and Wrangler CLI installed

---

## 🔧 Phase 1: Infrastructure Setup

### Step 1: Initialize Cloudflare Account

Ensure you have your Cloudflare Account ID ready.

```bash
wrangler whoami
```

### Step 2: Set Environment Variables (Local)

```bash
# Windows
set CLOUDFLARE_API_TOKEN=your_token_here

# Linux/Mac
export CLOUDFLARE_API_TOKEN=your_token_here
```

### Step 3: Create D1 Database

The monorepo uses a single D1 database with multi-tenant schema.

```bash
wrangler d1 create appointmentbooking-db
```

**database_id**: `59c06cd2-8bd2-45cf-ab62-84d7a4919e11`

### Step 4: Configure wrangler.toml

Update the `database_id` and domain routes in the root `wrangler.toml`.

---

## 📊 Phase 2: Database Migration

### Step 5: Run Database Migration

```bash
wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/001-create-d1-schema.sql
```

**Expected Output:**

```
🚣 Executed 14 queries in 0.00 seconds (20 rows read, 43 rows written)
```

### Step 6: Verify Database Setup

```bash
wrangler d1 execute appointmentbooking-db --remote --command="SELECT COUNT(*) FROM tenants"
```

---

## 🚀 Phase 3: SaaS Platform Deployment (Cloudflare Pages)

The platform consists of three main Next.js applications deployed to Cloudflare Pages.

### Step 7: Deploy Marketing Site (Root Domain)

```bash
cd apps/marketing
npm run pages:deploy
```

- **Domain**: `appointmentbooking.co.za`
- **Purpose**: SaaS Landing page, pricing, and registration.

### Step 8: Deploy Admin Dashboard (Subdomain)

```bash
cd apps/dashboard
npm run pages:deploy
```

- **Domain**: `dashboard.appointmentbooking.co.za`
- **Purpose**: Tenant management and global analytics.

### Step 9: Deploy Booking Engine (Multi-Tenant)

```bash
cd apps/booking
npm run pages:deploy
```

- **Domain**: `*.appointmentbooking.co.za` or Custom Tenant Domains.
- **Purpose**: Customer-facing booking interface.

---

## 🌐 Phase 4: Domain & API Integration

### Step 10: Configure Router Worker

The API Worker (`packages/worker`) acts as the central router and API gateway.

```bash
wrangler deploy
```

### Step 11: Set up Custom Domains in Cloudflare

1. **Pages Projects**: Connect custom domains for `marketing` and `dashboard`.
2. **Worker Custom Domains**: Add `instylehairboutique.co.za` and others to the Worker via the Cloudflare Dashboard (**Settings** > **Triggers** > **Custom Domains**).

### Step 12: Configure DNS for SaaS Platform

| Record Type | Name | Content | Proxy |
| :--- | :--- | :--- | :--- |
| A/AAAA | @ | Point to Cloudflare Pages | ✅ |
| CNAME | dashboard | Point to Cloudflare Pages | ✅ |
| CNAME | api | Point to Worker Subdomain | ✅ |

---

## 🔒 Phase 5: Authentication & Security

### Step 13: Configure Clerk (SaaS Admin)

1. Set up a Clerk project for the `dashboard` and `marketing` apps.
2. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to Pages environment variables.

### Step 14: Configure Supabase (Data/Tenant Auth)

1. Initialize a Supabase project.
2. Configure the Worker with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

---

## 🧪 Phase 6: Testing & Go Live

### Step 17: Configure Rate Limiting

In Cloudflare Dashboard:

1. Go to **Security** → **WAF**
2. Create rate limiting rules for `/api/book` endpoint
3. Set limit: 10 requests per minute per IP

### Step 18: Enable Analytics

1. Go to **Analytics & Logs** → **Web Analytics**
2. Enable analytics for your domain
3. Set up alerts for high error rates

---

## 📊 Phase 8: Production Checklist

### Step 19: Final Verification

- [ ] Domain resolves to Cloudflare Worker
- [ ] SSL certificate is active
- [ ] Booking API creates appointments
- [ ] SuperSaaS sync is working
- [ ] Dashboard shows live data
- [ ] All 6 services are loaded
- [ ] Payment integration is ready

### Step 20: Go Live

1. Update DNS to point production domain
2. Test all booking flows
3. Monitor error logs for 24 hours
4. Notify Instyle Hair Boutique of completion

---

## 🛠️ Troubleshooting

### Common Issues

**Database Connection Errors:**

```bash
# Check database status
wrangler d1 info appointmentbooking-db
```

**API Not Responding:**

```bash
# Check worker logs
wrangler tail
```

**SuperSaaS Sync Failing:**

- Verify API key in environment variables
- Check SuperSaaS schedule ID is correct
- Ensure API permissions are set

---

## 📞 Support Information

**Technical Contacts:**

- Cloudflare Support: <https://support.cloudflare.com>
- SuperSaaS Support: <https://www.supersaas.com/support>

**System URLs:**

- Worker: <https://appointmentbooking-monorepo.houseofgr8ness.workers.dev>
- Production: <https://www.instylehairboutique.co.za>
- Dashboard: <https://dash.cloudflare.com>

---

## 🎯 Success Metrics

**Performance Targets:**

- API Response Time: < 200ms
- Uptime: 99.9%
- Booking Success Rate: > 99%
- SuperSaaS Sync Rate: > 95%

**Business Metrics:**

- Zero booking loss during migration
- Improved page load speeds
- Reduced hosting costs
- Enhanced scalability

---

## 🔄 Maintenance

**Monthly Tasks:**

- Review error logs
- Check database performance
- Verify SuperSaaS sync accuracy
- Update SSL certificates (auto-renewed)

**Quarterly Tasks:**

- Performance optimization review
- Security audit
- Backup verification
- Cost analysis

---

**🎉 Deployment Complete!**

Instyle Hair Boutique now has a fully operational, scalable booking system powered by Cloudflare's global infrastructure.
