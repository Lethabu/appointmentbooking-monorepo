# 🚀 Complete Migration Guide: Vercel to Cloudflare Pages

**Target Domain:** appointmentbooking.co.za  
**Migration Date:** January 2, 2026  
**Application:** Next.js Appointment Booking System  

---

## 📋 EXECUTIVE SUMMARY

**Current Status:**

- ✅ Application successfully deployed on Vercel
- ❌ Domain authorization issues with appointmentbooking.co.za
- ✅ Domain appointmentbookings.co.za connected but not resolving

**Migration Benefits:**

- ✅ Full control over appointmentbooking.co.za domain
- ✅ Superior performance with Cloudflare's global CDN
- ✅ Better integration with Cloudflare DNS
- ✅ Cost-effective hosting with excellent uptime

---

## 🎯 MIGRATION STRATEGY

### Phase 1: Pre-Migration Preparation

1. **Backup Current Configuration**
2. **Prepare Build Configuration**
3. **Set Up Cloudflare Account**
4. **Configure Domain Management**

### Phase 2: Application Migration

1. **Deploy to Cloudflare Pages**
2. **Configure Build Settings**
3. **Migrate Environment Variables**
4. **Test Functionality**

### Phase 3: Domain Configuration

1. **Update DNS Records**
2. **Configure SSL/TLS**
3. **Verify Domain Resolution**
4. **Complete OAuth Updates**

---

## 🔧 PHASE 1: PRE-MIGRATION PREPARATION

### Step 1: Backup Current Configuration

```bash
# Create backup of current deployment
echo "Creating deployment backup..."

# Backup environment variables (without secrets)
echo "Environment variables to migrate:"
echo "- NEXT_PUBLIC_APP_URL"
echo "- NEXTAUTH_URL"
echo "- GOOGLE_REDIRECT_URI"
echo "- MICROSOFT_REDIRECT_URI"
echo "- DATABASE_URL"
echo "- NEXTAUTH_SECRET"
```

### Step 2: Prepare Build Configuration

**Current Vercel Settings:**

- Framework: Next.js 14.2.35
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install --legacy-peer-deps`

**Required for Cloudflare Pages:**

- Build Command: `npm run build`
- Build Output Directory: `.next`
- Node.js Version: 18 or higher

---

## ☁️ PHASE 2: CLOUDFLARE PAGES DEPLOYMENT

### Step 1: Create Cloudflare Pages Project

1. **Go to Cloudflare Dashboard**
   - Navigate to: <https://dash.cloudflare.com>
   - Select: "Pages" from left sidebar

2. **Create New Project**
   - Click: "Create a project"
   - Choose: "Upload assets" (for manual deployment)
   - Project name: `appointment-booking-coza`
   - Production branch: `main`

### Step 2: Configure Build Settings

**Build Configuration:**

```json
{
  "build_command": "npm run build",
  "build_output_directory": ".next",
  "install_command": "npm install --legacy-peer-deps",
  "node_version": "18"
}
```

**Cloudflare Pages Configuration:**

```toml
# wrangler.toml
name = "appointment-booking-coza"
compatibility_date = "2024-01-15"
pages_build_output_dir = ".next"

[env.production.vars]
NEXT_PUBLIC_APP_URL = "https://appointmentbooking.co.za"
NEXTAUTH_URL = "https://appointmentbooking.co.za"
```

### Step 3: Upload Application

**Option A: Direct Upload**

1. Run build locally: `npm run build`
2. Upload `.next` folder via Cloudflare dashboard
3. Deploy immediately

**Option B: Git Integration**

1. Connect GitHub repository
2. Set up automatic deployments
3. Configure branch protections

---

## 🌐 PHASE 3: DOMAIN CONFIGURATION

### Step 1: Add Custom Domain

1. **In Cloudflare Pages Dashboard**
   - Go to: Custom Domains
   - Click: "Set up a custom domain"
   - Enter: `appointmentbooking.co.za`
   - Enter: `www.appointmentbooking.co.za`

### Step 2: Configure DNS Records

**Cloudflare DNS Settings:**

```
Type: CNAME
Name: www
Content: appointment-booking-coza.pages.dev
Proxy status: Proxied (orange cloud)

Type: CNAME  
Name: @
Content: appointment-booking-coza.pages.dev
Proxy status: Proxied (orange cloud)
```

### Step 3: SSL/TLS Configuration

1. **Set SSL/TLS mode to "Full (strict)"**
2. **Enable "Always Use HTTPS"**
3. **Configure HSTS headers**
4. **Set minimum TLS version to 1.2**

---

## ⚙️ ENVIRONMENT VARIABLES MIGRATION

### Required Environment Variables

```bash
# Core Application
NEXT_PUBLIC_APP_URL=https://appointmentbooking.co.za
NEXTAUTH_URL=https://appointmentbooking.co.za

# OAuth Configuration  
GOOGLE_REDIRECT_URI=https://appointmentbooking.co.za/api/auth/callback/google
MICROSOFT_REDIRECT_URI=https://appointmentbooking.co.za/api/auth/callback/microsoft

# Database & Authentication
DATABASE_URL=your_supabase_database_url
NEXTAUTH_SECRET=your_nextauth_secret

# API Keys (if applicable)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

### Add to Cloudflare Pages

1. **Go to Project Settings**
2. **Navigate to Environment Variables**
3. **Add variables for Production**
4. **Save and redeploy**

---

## 🔍 FUNCTIONALITY DIFFERENCES & SOLUTIONS

### Cloudflare Pages vs Vercel Differences

| Feature | Vercel | Cloudflare Pages | Solution |
|---------|--------|------------------|----------|
| **Serverless Functions** | Native | Workers Pages Functions | Configure `functions/` directory |
| **API Routes** | Built-in | Pages Functions | Use `/functions/api/` structure |
| **Static Assets** | Automatic | Manual upload | Configure `_next/static/` |
| **Environment Variables** | Project Settings | Environment Variables | Migrate all variables |
| **Custom Headers** | vercel.json | `_headers` file | Create `_headers` configuration |

### Pages Functions Configuration

**Create `functions/api/[...slug].ts` for Next.js API routes:**

```typescript
// functions/api/bookings/route.ts
import { NextRequest, NextResponse } from '@cloudflare/nextjs/types/next';
import { handleBookingRequest } from '../../../apps/booking/app/api/bookings/route';

export const onRequest = async (context: any) => {
  return handleBookingRequest(context.request);
};
```

### Headers Configuration

**Create `_headers` file in project root:**

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/api/*
  Cache-Control: public, max-age=300
```

---

## ✅ VERIFICATION CHECKLIST

### Pre-DNS Update Verification

- [ ] Cloudflare Pages deployment successful
- [ ] Application loads at `https://appointment-booking-coza.pages.dev`
- [ ] API endpoints responding correctly
- [ ] Environment variables configured
- [ ] SSL certificate auto-provisioned
- [ ] Basic booking flow functional

### Post-DNS Update Verification

- [ ] `https://appointmentbooking.co.za` resolves correctly
- [ ] `https://www.appointmentbooking.co.za` redirects properly
- [ ] SSL grade A+ achieved
- [ ] All API routes functional
- [ ] OAuth flows working with new redirect URIs
- [ ] Mobile responsiveness confirmed
- [ ] Performance metrics acceptable

### End-to-End Testing

- [ ] User registration/login
- [ ] Service selection
- [ ] Date/time booking
- [ ] Calendar integration (Google/Outlook)
- [ ] Payment processing
- [ ] Email notifications
- [ ] Admin dashboard access

---

## 🚨 ROLLBACK PLAN

### Emergency Rollback Procedure

If migration issues occur:

1. **Immediate DNS Revert**
   - Update DNS to point back to Vercel
   - Restore Vercel deployment

2. **Cloudflare Pages Cleanup**
   - Pause Cloudflare Pages deployment
   - Remove custom domain configuration

3. **OAuth URI Updates**
   - Revert Google/Microsoft redirect URIs
   - Update to previous Vercel URLs

---

## 📞 SUPPORT RESOURCES

### Cloudflare Documentation

- **Pages Documentation:** <https://developers.cloudflare.com/pages/>
- **Functions Guide:** <https://developers.cloudflare.com/pages/functions/>
- **Custom Domains:** <https://developers.cloudflare.com/pages/custom-domains/>

### Migration Tools

- **Wrangler CLI:** `npm install -g wrangler`
- **Cloudflare CLI:** `npm install -g @cloudflare/wrangler`

---

## 🎯 SUCCESS METRICS

**Deployment Success Criteria:**

- ✅ Application fully functional on Cloudflare Pages
- ✅ Custom domain appointmentbooking.co.za working
- ✅ SSL certificate A+ grade
- ✅ Page load time < 2 seconds
- ✅ All API endpoints operational
- ✅ OAuth integrations functional

**Migration Timeline:**

- **Phase 1:** 30 minutes (Preparation)
- **Phase 2:** 45 minutes (Deployment)
- **Phase 3:** 60 minutes (Domain Configuration)
- **Total:** ~2 hours for complete migration

---

*This comprehensive guide ensures a smooth migration from Vercel to Cloudflare Pages with full domain control and improved performance.*
