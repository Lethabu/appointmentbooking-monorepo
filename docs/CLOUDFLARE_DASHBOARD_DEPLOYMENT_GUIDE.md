# Cloudflare Dashboard Deployment Guide

## appointmentbooking.co.za - Step-by-Step Manual Deployment

---

## Prerequisites

Before you begin:

- ✅ Cloudflare account with access to Pages
- ✅ Domain `appointmentbooking.co.za` added to Cloudflare
- ✅ GitHub repository connected (or direct upload method)
- ✅ Production environment variables ready

---

## Part 1: Initial Project Setup (One-Time)

### Step 1: Access Cloudflare Dashboard

1. Open your browser and navigate to: **<https://dash.cloudflare.com>**
2. Log in with your Cloudflare credentials
3. If you have multiple accounts, select the correct account

### Step 2: Navigate to Pages

1. In the left sidebar, click **"Pages"**
2. You should see the Pages dashboard

### Step 3: Check if Project Exists

Look for a project named **`appointment-booking-coza`** or similar.

**If the project EXISTS:**

- Click on the project name
- Skip to **Part 2: Configure Build Settings**

**If the project DOES NOT exist:**

- Continue to Step 4 to create it

### Step 4: Create New Pages Project

1. Click the **"Create a project"** button
2. Choose one of two methods:

   **Method A: Connect to Git (Recommended for continuous deployment)**
   - Click **"Connect to Git"**
   - Select **GitHub** (or GitLab/Bitbucket if applicable)
   - Authorize Cloudflare to access your repository
   - Select your repository: `appointmentbooking-monorepo`
   - Click **"Begin setup"**

   **Method B: Direct Upload (For manual deployments)**
   - Click **"Direct Upload"**
   - You'll upload built files manually each time
   - Enter project name: `appointment-booking-coza`

For this guide, we'll use **Method A (Git)**.

---

## Part 2: Configure Build Settings

### Step 5: Set Framework Preset

On the "Set up builds and deployments" screen:

1. **Framework preset:** Select **"Next.js (Static HTML Export)"** from dropdown
   - If not available, select **"None"** and configure manually

### Step 6: Configure Build Settings

Enter the following exact values:

| Setting | Value |
|---------|-------|
| **Project name** | `appointment-booking-coza` |
| **Production branch** | `main` |
| **Build command** | `cd apps/booking && pnpm install && pnpm run pages:build` |
| **Build output directory** | `apps/booking/.open-next/assets` |
| **Root directory (optional)** | `/` (leave as root) |

**Important Notes:**

- The build command installs dependencies, builds Next.js, and converts to Cloudflare format
- The output directory points to where the Cloudflare Workers output is generated
- Make sure there are NO trailing slashes in the paths

### Step 7: Environment Variables (Critical!)

Scroll down to **"Environment variables (optional)"** section.

1. Click **"Add variable"**
2. Add the following variables **one by one**:

#### Core Application Variables

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://appointmentbooking.co.za` | Your production URL |
| `NEXTAUTH_URL` | `https://appointmentbooking.co.za` | Auth callback URL |
| `NODE_ENV` | `production` | Environment type |

#### Database Variables

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Your PostgreSQL connection string |

#### Authentication Variables

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `NEXTAUTH_SECRET` | Generate new! | Run: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | `123456789-abc.apps.googleusercontent.com` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-abc123...` | Google Cloud Console → Credentials |
| `MICROSOFT_CLIENT_ID` | `12345678-1234-1234-1234...` | Azure Portal → App Registrations |
| `MICROSOFT_CLIENT_SECRET` | `abc~123...` | Azure Portal → Certificates & Secrets |

#### Payment Gateway Variables

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe Dashboard → Developers → API Keys |
| `PAYSTACK_SECRET_KEY` | `sk_live_...` | Paystack Dashboard → Settings → API Keys |
| `PAYSTACK_PUBLIC_KEY` | `pk_live_...` | Paystack Dashboard → Settings → API Keys |

#### AI & Additional Services

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `OPENAI_API_KEY` | `sk-proj-...` | OpenAI Platform → API Keys |
| `NEXT_PUBLIC_TENANT_ID` | `appointmentbooking` | Your tenant identifier |

**Important Security Notes:**

- ⚠️ Use **LIVE/PRODUCTION** keys, not test keys
- ⚠️ Keep these values SECRET - never commit to Git
- ✅ Double-check each value for typos

### Step 8: Advanced Settings (Optional but Recommended)

Click **"Advanced"** to expand additional settings:

| Setting | Recommended Value |
|---------|-------------------|
| **Node.js version** | `20.x` (or latest LTS) |
| **Install command** | Leave default or: `pnpm install` |

### Step 9: Save and Deploy

1. Review all settings carefully
2. Click **"Save and Deploy"** button
3. You'll be redirected to the deployment page

---

## Part 3: Monitor First Deployment

### Step 10: Watch Build Progress

You'll see the deployment screen with:

1. **Build log** - Real-time output of the build process
2. **Build status** - Starting → Building → Deploying → Success/Failed

**What to expect:**

- Build typically takes 5-15 minutes
- You'll see dependency installation progress
- Next.js compilation messages
- Cloudflare Pages adapter conversion
- Asset upload progress

### Step 11: Check for Build Errors

**If build SUCCEEDS:**

- Status shows ✅ **"Success"**
- You'll see a deployment URL (e.g., `abc123.appointment-booking-coza.pages.dev`)
- Skip to Step 13

**If build FAILS:**

- Status shows ❌ **"Failed"**
- Click on the build log to see error details
- Common issues:
  - Missing environment variables
  - Syntax errors in code
  - Dependency conflicts
  - Memory limits exceeded

### Step 12: Troubleshoot Build Failures

**For missing environment variables:**

1. Go to **Settings** tab → **Environment variables**
2. Add any missing variables
3. Click **"Retry deployment"**

**For build timeout:**

1. Go to **Settings** tab → **Functions**
2. Increase timeout if available
3. Or optimize build by removing unnecessary dependencies

**For other errors:**

1. Check the build log for specific error messages
2. Google the error or check Cloudflare Docs
3. Fix the issue in your code
4. Push changes to trigger new deployment

---

## Part 4: Configure Custom Domain

### Step 13: Add Custom Domain

1. In your project dashboard, click **"Custom domains"** tab
2. Click **"Set up a custom domain"** button
3. Enter your domain: `appointmentbooking.co.za`
4. Click **"Continue"**

### Step 14: Verify Domain Ownership

Cloudflare will check if the domain is in your account:

**If domain is in your Cloudflare account:**

- ✅ Automatically verified
- DNS records will be created automatically
- Continue to Step 15

**If domain is NOT in your account:**

- You'll need to add the domain to Cloudflare first
- Go to main dashboard → **"Add a site"**
- Follow the wizard to add `appointmentbooking.co.za`
- Update your domain nameservers to Cloudflare's
- Return to Pages and retry adding custom domain

### Step 15: Activate Custom Domain

1. Click **"Activate domain"**
2. Cloudflare will create a `CNAME` record pointing to your Pages deployment
3. Wait 1-5 minutes for DNS propagation
4. You should see status change to ✅ **"Active"**

### Step 16: Configure Domain Redirects (Optional)

To redirect www to non-www (or vice versa):

1. Click **"Add a domain"** again
2. Add `www.appointmentbooking.co.za`
3. Cloudflare will automatically create redirect rules

---

## Part 5: Post-Deployment Verification

### Step 17: Test Deployment URL

1. On the project dashboard, find **"Deployment URL"**
2. Click the URL (e.g., `abc123.appointment-booking-coza.pages.dev`)
3. Or visit: `https://appointmentbooking.co.za`

**Expected Result:**

- ✅ Homepage loads correctly
- ✅ No 404 errors
- ✅ Page looks correct with proper styling

**If you see 404:**

- Build may have failed silently
- Check build logs
- Verify build output directory is correct
- Try manual deployment (Part 6)

### Step 18: Verify Environment Variables Loaded

Test that environment variables are working:

1. Visit: `https://appointmentbooking.co.za/api/health`
   - Should return `200 OK` or health status JSON

2. Open browser Developer Tools (F12)
3. Go to **Console** tab
4. Check for any errors related to:
   - Missing environment variables
   - Database connection errors
   - API configuration issues

### Step 19: Run Comprehensive Smoke Tests

On your **local Windows machine**, run:

```powershell
cd C:\Users\Adrin\Documents\MyProjects\appointmentbooking-monorepo
node scripts\smoke-test-appointmentbooking.js
```

**Expected results:**

- 40+ tests should PASS
- Homepage, API endpoints, auth flows should work
- Only expected failures: endpoints requiring authentication

---

## Part 6: Alternative - Direct Upload Method

If Git-based deployment doesn't work, use direct upload:

### Step 20: Build Locally in WSL

In WSL terminal:

```bash
cd /mnt/c/Users/Adrin/Documents/MyProjects/appointmentbooking-monorepo/apps/booking
pnpm install
pnpm run build
npx @cloudflare/next-on-pages --skip-build
```

This creates: `.vercel/output/static` directory

### Step 21: Create Deployment Package

Create a ZIP file of the build output:

```bash
cd .vercel/output/static
zip -r ../../../cloudflare-deployment.zip ./*
```

### Step 22: Upload to Cloudflare Pages

1. Go to Cloudflare Dashboard → **Pages**
2. Click your project: `appointment-booking-coza`
3. Click **"Create new deployment"**
4. Click **"Direct Upload"** tab
5. Drag and drop `cloudflare-deployment.zip`
6. Or click **"Select from computer"** and choose the ZIP file
7. Click **"Deploy"**

---

## Part 7: Configure Production Settings

### Step 23: Review Security Settings

1. Go to **Settings** tab
2. Click **"Functions"** section
3. Verify:
   - ✅ Compatibility date is set (e.g., `2024-01-15`)
   - ✅ Node.js compatibility enabled if needed

### Step 24: Set Up Preview Deployments

1. In **Settings** → **Builds & deployments**
2. Enable **"Preview deployments"** for non-production branches
3. This creates preview URLs for testing before going live

### Step 25: Configure Redirects & Headers (Optional)

If you need custom redirects or security headers:

1. Create a `_headers` file in your build output
2. Or use Cloudflare Rules in the main dashboard
3. Example for security headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-XSS-Protection: 1; mode=block
```

---

## Part 8: Monitoring & Maintenance

### Step 26: Enable Analytics

1. Go to **Analytics** tab in your Pages project
2. View:
   - Request counts
   - Bandwidth usage
   - Error rates
   - Geographic distribution

### Step 27: Set Up Alerts (Optional)

1. In Cloudflare main dashboard → **Notifications**
2. Create alerts for:
   - Deployment failures
   - High error rates
   - Traffic spikes

### Step 28: Review Deployment History

1. Go to **Deployments** tab
2. You can see:
   - All previous deployments
   - Rollback to earlier versions if needed
   - View logs for each deployment

---

## Rollback Procedure

If something goes wrong after deployment:

### Quick Rollback via Dashboard

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click the **"..."** menu next to it
4. Select **"Rollback to this deployment"**
5. Confirm the rollback
6. Wait 1-2 minutes for rollback to complete

**Alternative: Redeploy from Git**

1. Revert your Git commits to last working state
2. Push to GitHub
3. Cloudflare will automatically deploy the reverted code

---

## Troubleshooting Common Issues

### Issue: "Build Failed" with no clear error

**Solution:**

1. Check build logs thoroughly
2. Verify all environment variables are set
3. Test build locally: `pnpm run build && npx @cloudflare/next-on-pages`
4. Check for syntax errors in code

### Issue: "404 on all pages after deployment"

**Solution:**

1. Verify **Build output directory** is: `apps/booking/.vercel/output/static`
2. Check build logs - ensure `_worker.js` was created
3. Try manual deployment (Part 6)
4. Verify Next.js is configured correctly for Cloudflare Pages

### Issue: "Environment variables not working"

**Solution:**

1. Go to Settings → Environment variables
2. Ensure variables are set for **Production** environment
3. After adding/changing variables, you MUST **redeploy**
4. Click "Retry deployment" or push a new commit

### Issue: "SSL/HTTPS not working"

**Solution:**

1. Wait 5-10 minutes for SSL provisioning
2. Check DNS settings - CNAME should point to Pages
3. Verify domain is active in Custom domains tab
4. Check Cloudflare SSL/TLS settings (should be "Full" or "Full (strict)")

### Issue: "Database connection errors"

**Solution:**

1. Verify `DATABASE_URL` environment variable is correct
2. Check database allows connections from Cloudflare IPs
3. Test database connection from another tool
4. Ensure connection string format is correct

---

## Success Checklist

After deployment, verify:

- [ ] ✅ Homepage loads at `https://appointmentbooking.co.za`
- [ ] ✅ Health check responds: `/api/health`
- [ ] ✅ No console errors in browser (F12)
- [ ] ✅ All API endpoints return appropriate responses
- [ ] ✅ Authentication redirects work (Google/Microsoft OAuth)
- [ ] ✅ SSL certificate is valid (green padlock in browser)
- [ ] ✅ Security headers present (check with browser dev tools)
- [ ] ✅ Smoke tests pass (40+ tests)
- [ ] ✅ Performance is acceptable (pages load < 2 seconds)
- [ ] ✅ No 404 errors on main routes

---

## Next Steps After Successful Deployment

1. **Monitor for 30 minutes**
   - Watch Cloudflare Analytics for traffic
   - Check for error spikes
   - Monitor user reports

2. **Run comprehensive tests**

   ```powershell
   node scripts\production-deployment-testing.js
   ```

3. **Set up continuous deployment**
   - Any push to `main` branch auto-deploys
   - Preview deployments for feature branches
   - Automated testing in CI/CD pipeline

4. **Configure monitoring**
   - Set up Sentry for error tracking
   - Enable Cloudflare Web Analytics
   - Configure uptime monitoring (e.g., UptimeRobot)

5. **Document deployment**
   - Note deployment date/time
   - Record any issues encountered
   - Update runbook with lessons learned

---

## Quick Reference - Key URLs

| Resource | URL |
|----------|-----|
| **Cloudflare Dashboard** | <https://dash.cloudflare.com> |
| **Pages Project** | <https://dash.cloudflare.com> → Pages → appointment-booking-coza |
| **Production Site** | <https://appointmentbooking.co.za> |
| **Deployment Logs** | Project → Deployments → Click deployment → View logs |
| **Environment Variables** | Project → Settings → Environment variables |
| **Custom Domains** | Project → Custom domains |
| **Cloudflare Docs** | <https://developers.cloudflare.com/pages/> |

---

## Support & Resources

- **Cloudflare Community:** <https://community.cloudflare.com/>
- **Next.js on Cloudflare Pages:** <https://developers.cloudflare.com/pages/framework-guides/nextjs/>
- **@cloudflare/next-on-pages:** <https://github.com/cloudflare/next-on-pages>
- **Status Page:** <https://www.cloudflarestatus.com/>

---

**Last Updated:** 2026-01-07  
**Version:** 1.0  
**Target Platform:** Cloudflare Pages  
**Application:** appointmentbooking.co.za
