# 🦅 Sovereign Deployment Checklist

## Pre-Deployment (Preparation Phase)

### 1. Meta Cloud API Setup
- [ ] Access [Meta Business Manager](https://business.facebook.com/)
- [ ] Create System User with permanent token
- [ ] Grant permissions: `whatsapp_business_messaging`, `whatsapp_business_management`
- [ ] Copy System User Token → Save as `META_SYSTEM_USER_TOKEN`
- [ ] Navigate to WhatsApp Manager → Get Phone Number ID → Save as `META_PHONE_NUMBER_ID`
- [ ] Create message templates:
  - [ ] `booking_confirmation` template
  - [ ] `appointment_reminder` template
  - [ ] Wait for Meta approval (24-72 hours)

### 2. Environment Variables Preparation
Create `.env.local` file with:
```env
META_SYSTEM_USER_TOKEN=EAA...your_permanent_token
META_PHONE_NUMBER_ID=123456789012345
NEXT_PUBLIC_WORKER_URL=https://appointmentbooking-worker.houseofgr8ness.workers.dev
```

### 3. Local Verification
- [ ] Run verification script: `.\scripts\verify-sovereign-deployment.ps1`
- [ ] Verify all files present: ✅ 8/8 checks passed
- [ ] Test god-mode query locally: `.\scripts\god-mode-query.ps1 "SELECT 1" -Environment local`

---

## Deployment Phase

### Phase 1: Worker Backend Deployment

```powershell
# Navigate to worker package
cd packages/worker

# Verify wrangler authentication
npx wrangler whoami

# Deploy Worker
npx wrangler deploy

# Verify deployment
curl https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "healthy",
  "timestamp": "..."
}
```

- [ ] Worker deployed successfully
- [ ] Health endpoint returns 200 OK
- [ ] Database status: `healthy`

### Phase 2: Set Environment Variables

```powershell
# Set secrets in Cloudflare Pages
npx wrangler pages secret put META_SYSTEM_USER_TOKEN --project-name=appointmentbooking-coza
# Paste token when prompted

npx wrangler pages secret put META_PHONE_NUMBER_ID --project-name=appointmentbooking-coza
# Paste phone ID when prompted
```

Or via Cloudflare Dashboard:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pages → `appointmentbooking-coza` → Settings → Environment Variables
3. Add production variables:
   - `META_SYSTEM_USER_TOKEN` = `<your_token>`
   - `META_PHONE_NUMBER_ID` = `<your_phone_id>`

- [ ] `META_SYSTEM_USER_TOKEN` set in production
- [ ] `META_PHONE_NUMBER_ID` set in production
- [ ] Secrets visible in Cloudflare Dashboard

### Phase 3: Booking App Deployment

```powershell
# Navigate to booking app
cd apps/booking

# Build for production
pnpm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name=appointmentbooking-coza
```

Alternative (using CI/CD):
```powershell
# Push to main branch triggers auto-deployment
git add .
git commit -m "feat: Sovereign deployment with Direct Meta API"
git push origin main

# Monitor deployment
npx wrangler pages deployment list --project-name=appointmentbooking-coza
```

- [ ] Build completed without errors
- [ ] Deployment successful
- [ ] Deployment URL accessible

### Phase 4: Verify Sovereign Health

```powershell
# Test sovereign health endpoint
Invoke-RestMethod "https://appointmentbooking-coza.pages.dev/api/sovereign/self-check" | ConvertTo-Json -Depth 10
```

**Expected Response:**
```json
{
  "status": "OPERATIONAL",
  "mode": "GOD_MODE",
  "database": "healthy",
  "worker": "healthy",
  "heartbeat": "💚",
  "empire": {
    "sovereign": true,
    "dependencies_eliminated": ["aisensy"],
    "direct_integrations": ["meta_cloud_api"]
  }
}
```

- [ ] Health check returns 200 OK
- [ ] Status: `OPERATIONAL`
- [ ] Mode: `GOD_MODE`
- [ ] Heartbeat: `💚`
- [ ] Database: `healthy`
- [ ] Worker: `healthy`

---

## Post-Deployment Verification

### 1. WhatsApp Integration Test

**Test with approved template:**
```powershell
# Create test script: scripts/test-whatsapp.js
node scripts/test-whatsapp.js
```

Example test script:
```javascript
import { sovereignWhatsApp } from '../apps/booking/lib/whatsapp/index.js';

async function testWhatsApp() {
  try {
    const result = await sovereignWhatsApp.sendBookingConfirmation('+27821234567', {
      customerName: 'Test User',
      serviceName: 'Test Service',
      dateTime: '2026-02-20 at 10:00 AM',
      stylistName: 'Test Stylist',
      businessName: 'InStyle Hair Boutique'
    });
    
    console.log('✅ WhatsApp message sent:', result);
  } catch (error) {
    console.error('❌ WhatsApp test failed:', error);
  }
}

testWhatsApp();
```

- [ ] Message sent successfully
- [ ] Message ID received
- [ ] Test phone number received message
- [ ] No rate limiting errors

### 2. God Mode Operations Test

```powershell
# Query production database
.\scripts\god-mode-query.ps1 "SELECT * FROM tenant_config LIMIT 1"

# Check booking count
.\scripts\god-mode-query.ps1 "SELECT COUNT(*) as total FROM bookings"

# Verify products
.\scripts\god-mode-query.ps1 "SELECT COUNT(*) as active_products FROM products WHERE is_active=1"
```

- [ ] God mode queries execute successfully
- [ ] Data returned correctly
- [ ] No authentication errors

### 3. End-to-End Booking Flow Test

1. Visit: `https://appointmentbooking-coza.pages.dev/instylehairboutique`
2. Browse products/services
3. Create test booking
4. Verify WhatsApp confirmation sent
5. Check database for booking record

- [ ] Booking page loads correctly
- [ ] Booking submission successful
- [ ] WhatsApp confirmation received
- [ ] Database record created
- [ ] Health check still `OPERATIONAL`

### 4. Zombie Keeper Protocol Activation

```powershell
# Trigger manual keep-alive
gh workflow run zombie-keeper.yml

# Check workflow status
gh run list --workflow=zombie-keeper.yml

# View latest run
gh run view --log
```

Or via GitHub UI:
1. Go to [Actions](https://github.com/Lethabu/appointmentbooking-monorepo/actions)
2. Select "Zombie Keeper Protocol"
3. Click "Run workflow"
4. Verify successful execution

- [ ] Zombie Keeper workflow exists
- [ ] Manual trigger successful
- [ ] Health check passed
- [ ] Next scheduled run: 6 hours

---

## Monitoring & Maintenance

### Daily Checks

```powershell
# Morning health check
Invoke-RestMethod "https://appointmentbooking-coza.pages.dev/api/sovereign/self-check"

# Review logs
npx wrangler pages deployment tail --project-name=appointmentbooking-coza
```

### Weekly Reviews

- [ ] Review WhatsApp message logs
- [ ] Check for Meta API errors
- [ ] Monitor rate limiting (should be <1000 msgs/day for test accounts)
- [ ] Review booking confirmation success rate
- [ ] Check god-mode query logs

### Monthly Maintenance

- [ ] Rotate Meta System User Token (every 90 days recommended)
- [ ] Review and optimize WhatsApp templates
- [ ] Check database size and performance
- [ ] Update dependencies: `pnpm update`
- [ ] Review Cloudflare billing (should be $0 for sovereign stack)

---

## Rollback Procedure

If deployment fails or issues arise:

### Option 1: Rollback to Previous Deployment

```powershell
# List recent deployments
npx wrangler pages deployment list --project-name=appointmentbooking-coza

# Note the deployment ID of last working version
# Rollback via Cloudflare Dashboard:
# Pages → appointmentbooking-coza → Deployments → Previous working deployment → Rollback
```

### Option 2: Revert Git Changes

```powershell
# Find last working commit
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Push revert
git push origin main

# Monitor auto-deployment
gh run watch
```

### Option 3: Emergency Hotfix

```powershell
# Create hotfix branch
git checkout -b hotfix/sovereign-fix

# Make fixes
# ...

# Deploy directly from branch
npx wrangler pages deploy .next --project-name=appointmentbooking-coza --branch=hotfix
```

- [ ] Rollback procedure tested in staging
- [ ] Team aware of rollback process
- [ ] Emergency contacts documented

---

## Success Criteria

✅ **Deployment is successful when:**

1. Health endpoint returns `OPERATIONAL` with `GOD_MODE`
2. WhatsApp messages send successfully via Direct Meta API
3. God Mode queries execute without errors
4. Zombie Keeper workflow runs every 6 hours
5. No AISensy dependencies remain
6. Zero monthly messaging costs (vs previous $49-199/mo)
7. All bookings trigger WhatsApp confirmations
8. Database queries respond within <200ms
9. Cloudflare costs remain $0/month
10. Empire Dashboard shows node as `sovereign: true`

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Invalid phone number format"  
**Solution:** Ensure E.164 format (+27821234567), use god-mode query to check customer phone numbers

**Issue:** "Template not found"  
**Solution:** Verify templates approved in Meta Business Manager, check exact template name

**Issue:** "Rate limit exceeded"  
**Solution:** Review message frequency, implement queue for high-volume periods

**Issue:** Health check shows `DEGRADED`  
**Solution:** Check Worker status, verify D1 database connectivity, review recent deployments

### Emergency Contacts

- **Cloudflare Status:** https://www.cloudflarestatus.com/
- **Meta API Status:** https://developers.facebook.com/status
- **Documentation:** See `docs/GOD_MODE_OPERATIONS_GUIDE.md`

---

**Deployment Status:**
- [ ] Pre-Deployment Complete
- [ ] Phase 1: Worker Deployed
- [ ] Phase 2: Environment Variables Set
- [ ] Phase 3: Booking App Deployed
- [ ] Phase 4: Health Verified
- [ ] Post-Deployment Tests Passed
- [ ] Monitoring Active

**🦅 Sovereign Mode:** READY  
**Cost Savings:** $49-199/month eliminated  
**Status:** GOD_MODE OPERATIONAL
