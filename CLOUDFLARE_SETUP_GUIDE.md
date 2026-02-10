# 🚀 Cloudflare Production Setup Guide

**Status**: Deployment automation is ready. Just need Cloudflare authentication.

---

## Quick Start (60 seconds to production)

```powershell
# 1. Authenticate with Cloudflare
npx wrangler login

# 2. Deploy to production
pnpm run deploy:auto
```

That's it! Your deployment will be live on Cloudflare.

---

## Step-by-Step Setup

### **Step 1: Authenticate with Cloudflare**

```powershell
npx wrangler login
```

**What happens**:
1. Opens your browser automatically
2. Takes you to Cloudflare login page
3. Sign in with your Cloudflare account (or create one)
4. Click "Allow" to grant wrangler access
5. Returns to terminal with: ✅ "Successfully logged in"

**Verify authentication**:
```powershell
npx wrangler whoami
```

Should show:
```
👋 You are logged in with an OAuth Token, associated with the email '<your-email>'.
```

---

### **Step 2: Configure Deployment Targets** (Optional)

If this is your first time deploying, you may need to specify your Cloudflare Account ID.

**Get your Account ID**:
1. Visit https://dash.cloudflare.com
2. Click any domain or "Workers & Pages" in the sidebar
3. Look for "Account ID" in the right sidebar
4. Copy the ID

**Set Account ID** (if needed):

**Option A**: Environment variable:
```powershell
$env:CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
```

**Option B**: Update wrangler.toml files:

Edit `packages/worker/wrangler.toml`:
```toml
account_id = "your-account-id-here"
```

Edit `apps/booking/wrangler.toml` and `apps/dashboard/wrangler.toml` similarly.

---

### **Step 3: Deploy to Production**

**Full deployment with E2E tests** (recommended):
```powershell
pnpm run deploy:auto
```

**Fast deployment (skip E2E)**:
```powershell
pnpm run deploy:auto:skip-e2e
```

**Staging environment**:
```powershell
pnpm run deploy:auto:staging
```

**Watch real-time deployment**:
- Phase 1: Validation (TypeScript, tests, builds)
- Phase 2: Deploy to Cloudflare (3x retry strategy)
- Phase 3: Health checks
- Phase 4: E2E validation
- Phase 5: Monitoring

Expected time: **~1.5 minutes**

---

### **Step 4: Verify Live Deployment**

After deployment completes (Score: 100/100):

**Check Cloudflare Dashboard**:
```powershell
npx wrangler deployments list --name appointmentbooking-worker
```

**Test live endpoints**:

Worker API:
```powershell
curl https://api.appointmentbooking.co.za/health
```

Booking Pages:
```powershell
curl https://appointmentbooking.co.za
```

Dashboard:
```powershell
curl https://dashboard.appointmentbooking.co.za
```

---

## Custom Domain Setup (if needed)

If you own `appointmentbooking.co.za`:

### **For Worker (API subdomain)**

```powershell
# Add custom domain
npx wrangler deployments tail appointmentbooking-worker

# In Cloudflare Dashboard:
# 1. Go to Workers & Pages > appointmentbooking-worker
# 2. Click "Settings" > "Domains & Routes"
# 3. Add custom domain: api.appointmentbooking.co.za
```

### **For Pages (Booking & Dashboard)**

```powershell
# Booking app
npx wrangler pages deployment list --project-name=appointmentbooking-booking

# In Cloudflare Dashboard:
# 1. Go to Workers & Pages > appointmentbooking-booking
# 2. Click "Custom domains"
# 3. Add: appointmentbooking.co.za
```

Repeat for dashboard with `dashboard.appointmentbooking.co.za`.

---

## DNS Verification

After adding custom domains, verify DNS resolution:

```powershell
nslookup api.appointmentbooking.co.za
nslookup appointmentbooking.co.za
nslookup dashboard.appointmentbooking.co.za
```

**DNS Propagation**: Takes 5 minutes - 24 hours (usually < 30 minutes)

---

## Troubleshooting

### **Issue**: "No account ID found"

**Solution**: Set `CLOUDFLARE_ACCOUNT_ID`:
```powershell
$env:CLOUDFLARE_ACCOUNT_ID="your-account-id"
pnpm run deploy:auto
```

### **Issue**: "Build failed"

**Solution**: The deployment script has automatic retry (3x). Check logs:
```powershell
# View detailed logs
pnpm run deploy:auto 2>&1 | Tee-Object -FilePath deployment.log
```

### **Issue**: "Health checks failing"

**Solution**: Wait 2-3 minutes for Cloudflare DNS propagation, then re-run health checks.

### **Issue**: DNS not resolving

**Solution**: 
1. Check if custom domains are configured in Cloudflare Dashboard
2. If using Cloudflare-assigned URLs, check:
   ```powershell
   npx wrangler deployments list --name appointmentbooking-worker
   ```
   Look for the `.workers.dev` URL

---

## Rollback Strategy

If something goes wrong:

**View deployment history**:
```powershell
npx wrangler deployments list --name appointmentbooking-worker
```

**Rollback to previous deployment**:
```powershell
npx wrangler rollback --deployment-id <deployment-id>
```

---

## Monitoring Production

**Real-time logs**:
```powershell
# Worker logs
npx wrangler tail appointmentbooking-worker

# Pages logs
npx wrangler pages deployment tail
```

**View metrics**:
- Visit https://dash.cloudflare.com
- Navigate to Workers & Pages
- Click your deployed service
- View "Metrics & Analytics"

---

## Production Checklist

Before going live, verify:

- [ ] Cloudflare authentication successful (`npx wrangler whoami`)
- [ ] Account ID configured (if needed)
- [ ] Environment variables set (check `.env` files)
- [ ] Database migrations run (if using D1)
- [ ] API keys configured (payment gateways, etc.)
- [ ] Custom domains added (optional)
- [ ] DNS verified (if using custom domains)
- [ ] Deployment completed (100/100 score)
- [ ] Health checks passing
- [ ] Live endpoints responding

---

## Environment Variables for Production

**Critical variables to set**:

```bash
# apps/booking/.env
NEXTAUTH_SECRET=<generate-strong-secret>
NEXT_PUBLIC_API_URL=https://api.appointmentbooking.co.za

# Payment Gateways (if using)
PAYFAST_MERCHANT_ID=<your-merchant-id>
PAYFAST_MERCHANT_KEY=<your-merchant-key>
YOCO_SECRET_KEY=<your-yoco-key>

# Database (if using Cloudflare D1)
DATABASE_URL=<cloudflare-d1-connection-string>
```

**Generate secure secret**:
```powershell
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## Support & Resources

**Cloudflare Docs**:
- Workers: https://developers.cloudflare.com/workers/
- Pages: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

**Project Resources**:
- API Documentation: See `API_DOCUMENTATION.md`
- Deployment Scripts: See `scripts/production-deploy-auto.js`
- Operations Runbook: See `APPOINTMENTBOOKING_COZA_OPERATIONAL_RUNBOOK.md`

**Need Help?**
- Check `LIVE_DEPLOYMENT_TEST_REPORT.md` for deployment status
- Review deployment logs in console output
- Use `npx wrangler --help` for CLI reference

---

**Ready to deploy?** Run:

```powershell
npx wrangler login && pnpm run deploy:auto
```

🚀 **Good luck with your production launch!**
