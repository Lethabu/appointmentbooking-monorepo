# ⚡ QUICK START GUIDE - AppointmentBooking Deployment

**Status**: ✅ Live & Operational  
**Platform**: Cloudflare (Workers + Pages + D1)  
**Updated**: February 8, 2026

---

## 🚀 CURRENT STATUS

| Component | Status | URL |
|-----------|--------|-----|
| **API** | 🟢 LIVE | https://appointmentbooking-worker.houseofgr8ness.workers.dev |
| **Booking App** | 🟡 Deployed | https://appointmentbooking-booking.pages.dev |
| **Dashboard** | 🟡 Deployed | https://appointmentbooking-dashboard.pages.dev |
| **Database** | 🟢 Connected | D1 (appointmentbooking-db) |

---

## 🔑 KEY CREDENTIALS & IDs

```
Cloudflare Account ID: 9e96c83268cae3e0f27168ed50c92033
D1 Database ID: 59c06cd2-8bd2-45cf-ab62-84d7a4919e11
Worker Name: appointmentbooking-worker
Booking Project: appointmentbooking-booking
Dashboard Project: appointmentbooking-dashboard
```

---

## ⚡ ESSENTIAL COMMANDS

### Deploy Changes
```bash
# Worker (Backend API)
cd packages/worker
pnpm run deploy

# Booking App (Frontend)
cd apps/booking
pnpm run build
npx wrangler pages deploy ./.next/static --project-name=appointmentbooking-booking

# Dashboard (Admin)
cd apps/dashboard
pnpm run build
npx wrangler pages deploy ./.next/static --project-name=appointmentbooking-dashboard
```

### Check Status
```bash
# Health check
curl https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health

# View logs
npx wrangler tail appointmentbooking-worker

# List deployments
npx wrangler deployments list
```

### Rollback
```bash
# If something breaks, rollback Worker to previous version
npx wrangler rollback <deployment-id>
```

---

## 📁 PROJECT STRUCTURE

```
appointmentbooking-monorepo/
├── packages/
│   └── worker/              # Cloudflare Worker API
│       ├── src/index.ts     # Entry point (all routes)
│       ├── wrangler.toml    # Configuration
│       └── package.json
├── apps/
│   ├── booking/             # Main booking app (Next.js)
│   │   ├── app/             # Routes
│   │   ├── .env             # Environment variables
│   │   └── package.json
│   └── dashboard/           # Admin dashboard (Next.js)
│       ├── src/app/         # Routes
│       ├── .env             # Environment variables
│       └── package.json
├── scripts/
│   └── migrations/          # Database migrations
│       └── *.sql            # SQL migration files
└── Documentation files (this deployment)
```

---

## 🔧 COMMON TASKS

### Add a New API Endpoint
```typescript
// In packages/worker/src/index.ts
if (path === '/api/my-new-endpoint' && request.method === 'GET') {
  const result = env.DB.prepare('SELECT * FROM products').all();
  return new Response(JSON.stringify(result.results), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
```

### Add a Database Migration
```sql
-- Create file: scripts/migrations/005-my-new-table.sql
CREATE TABLE IF NOT EXISTS my_table (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);
```

Then run locally:
```bash
npx wrangler d1 execute appointmentbooking-db --local --file=scripts/migrations/005-my-new-table.sql
```

### Update Environment Variables
```bash
# Edit the .env file for the app
echo "MY_NEW_VAR=value" >> apps/booking/.env

# For Worker, add to wrangler.toml:
[env.production]
vars = { MY_NEW_VAR = "value" }

# Redeploy
npx wrangler deploy
```

---

## 🐛 TROUBLESHOOTING

### Issue: Worker returns 500 error
```bash
# 1. Check logs
npx wrangler tail --status error

# 2. Check database connection
curl https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health

# 3. Rollback if needed
npx wrangler rollback <version-id>
```

### Issue: Pages return 404
Pages currently only serve static files. To access static files directly:
```bash
curl https://appointmentbooking-booking.pages.dev/static/css/
```

### Issue: Build fails
```bash
# Clear cache and rebuild
rm -r .next
pnpm run build

# If TypeScript errors, check imports
npx tsc --noEmit
```

---

## 📊 MONITORING

### Quick Health Check (Run Regularly)
```bash
#!/bin/bash
echo "=== API Health ==="
curl https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health

echo -e "\n=== Database Check ==="
curl https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/products?limit=1

echo -e "\n=== Pages - Booking ==="
curl -I https://appointmentbooking-booking.pages.dev

echo -e "\n=== Pages - Dashboard ==="
curl -I https://appointmentbooking-dashboard.pages.dev
```

### Key Metrics to Monitor
- API Response Time: Target <300ms
- Error Rate: Target <0.1%
- Database Query Time: Target <250ms
- Uptime: Target 99.9%

---

## 🔐 SECURITY CHECKLIST

### Before Production Update
- [ ] Run tests locally: `pnpm run test`
- [ ] Verify no secrets in code: `grep -r "password\|token\|key" src/`
- [ ] Check environment variables: `cat .env | grep -v "^#"`
- [ ] Review changes: `git diff`
- [ ] Test in staging first (if available)

### Regular Maintenance
- [ ] Rotate API keys quarterly
- [ ] Review access logs monthly
- [ ] Update dependencies regularly
- [ ] Monitor security alerts daily

---

## 📈 SCALING TIPS

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_product_tenant ON products(tenant_id);
CREATE INDEX idx_booking_date ON bookings(booking_date);
```

### API Performance
- Use caching headers (already set to 300s)
- Add database query logging
- Monitor response times
- Consider pagination for large results

### Cost Management
- Monitor request volume: https://dash.cloudflare.com
- Set alerts for high usage
- Review monthly costs
- Current: ~$1-3/month

---

## 🎓 USEFUL RESOURCES

### Documentation
- **Operational Runbook**: `OPERATIONAL_RUNBOOK.md`
- **Deployment Report**: `PRODUCTION_READY_REPORT.md`
- **Verification Report**: `DEPLOYMENT_VERIFICATION_FINAL.md`

### External Links
- Cloudflare Docs: https://developers.cloudflare.com/
- Workers: https://developers.cloudflare.com/workers/
- D1 Database: https://developers.cloudflare.com/d1/
- Pages: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

---

## ✅ DAILY CHECKLIST

**Morning (Before Users Access)**
- [ ] Check API health: `curl .../api/health`
- [ ] Review error logs: `npx wrangler tail --status error`
- [ ] Verify database: `curl .../api/products?limit=1`

**Afternoon (Mid-Day)**
- [ ] Monitor performance metrics
- [ ] Check Pages deployments accessible
- [ ] Review any alerts

**Evening (End of Day)**
- [ ] Document any issues encountered
- [ ] Plan any needed fixes
- [ ] Prepare for next day

---

## 🚀 DEPLOYMENT WORKFLOW

### Typical Deployment (e.g., Bug Fix)

```
1. Make code changes and test locally
   git commit -m "Fix: [brief description]"

2. Build production versions
   pnpm run build

3. Verify builds
   ls -la .next/     # Check for .next directory

4. Deploy in order: Database → Worker → Pages
   
   # Only if database schema changed:
   npx wrangler d1 execute appointmentbooking-db --file=scripts/migrations/NNN-*.sql
   
   # Deploy Worker
   cd packages/worker && pnpm run deploy
   
   # Verify API
   curl .../api/health
   
   # Deploy Pages
   cd apps/booking && npx wrangler pages deploy ...
   cd apps/dashboard && npx wrangler pages deploy ...

5. Verify live deployment
   curl https://appointmentbooking-worker...houseofgr8ness.workers.dev/api/health

6. If issues, rollback
   npx wrangler rollback <deployment-id>
```

---

## 💾 BACKUP & RECOVERY

### Database Backup
```bash
# Export D1 data
npx wrangler d1 export appointmentbooking-db > backup.sql

# D1 is automatically backed up daily by Cloudflare
# Retention: Check Cloudflare Dashboard
```

### Restore from Backup
```bash
# If needed, restore via Cloudflare Dashboard
# D1 → appointmentbooking-db → Backups → Restore
```

---

## 📞 QUICK CONTACTS

### If Issues Occur
1. **Check Logs**: `npx wrangler tail`
2. **Check Status**: `curl .../api/health`
3. **Review Recent Changes**: `git log --oneline -5`
4. **Rollback if Critical**: `npx wrangler rollback <id>`
5. **Check Cloudflare Status**: https://www.cloudflarestatus.com/

---

## 🎯 NEXT STEPS (If Needed)

### To Complete Full Production Setup (Optional)
1. **Configure Custom Domains** (15 min)
2. **Update Production Secrets** (20 min)
3. **Enable Advanced Monitoring** (20 min)
4. **Set Up Alerting** (15 min)

See `OPERATIONAL_RUNBOOK.md` for detailed steps.

---

**Your platform is LIVE and ready! 🚀**

For detailed procedures, see the complete documentation files.  
For emergencies, reference this quick guide.
