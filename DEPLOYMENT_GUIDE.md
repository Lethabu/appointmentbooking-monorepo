# 🚀 Instyle Hair Boutique - Complete Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy and configure the Instyle Hair Boutique booking system on Cloudflare infrastructure.

## 📋 Prerequisites
- Cloudflare account with API access
- Domain ownership (instylehairboutique.co.za)
- SuperSaaS account credentials
- Node.js and npm installed

---

## 🔧 Phase 1: Infrastructure Setup

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
```

### Step 2: Set Environment Variables
```bash
# Windows
set CLOUDFLARE_API_TOKEN=gZmPM0oTIikfopiJap3aIWFZBZmNAKPAZ3N3jI-Q

# Linux/Mac
export CLOUDFLARE_API_TOKEN=gZmPM0oTIikfopiJap3aIWFZBZmNAKPAZ3N3jI-Q
```

### Step 3: Create D1 Database
```bash
wrangler d1 create appointmentbooking-db
```
**Expected Output:**
```
✅ Successfully created DB 'appointmentbooking-db' in region WEUR
database_id = "59c06cd2-8bd2-45cf-ab62-84d7a4919e11"
```

### Step 4: Update wrangler.toml
Update the database ID in `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "appointmentbooking-db"
database_id = "59c06cd2-8bd2-45cf-ab62-84d7a4919e11"  # Use your actual ID
```

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

## 🚀 Phase 3: Worker Deployment

### Step 7: Deploy Cloudflare Worker
```bash
wrangler deploy
```

**Expected Output:**
```
✅ Deployed appointmentbooking-monorepo
https://appointmentbooking-monorepo.houseofgr8ness.workers.dev
```

### Step 8: Test API Endpoints
```bash
# Test tenant API
curl "https://appointmentbooking-monorepo.houseofgr8ness.workers.dev/api/tenant?slug=instylehairboutique"

# Test dashboard API
curl "https://appointmentbooking-monorepo.houseofgr8ness.workers.dev/api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70"
```

---

## 🌐 Phase 4: Domain Configuration

### Step 9: Add Custom Domain
1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker: `appointmentbooking-monorepo`
3. Go to **Settings** → **Triggers**
4. Click **Add Custom Domain**
5. Enter: `www.instylehairboutique.co.za`
6. Click **Add Custom Domain**

### Step 10: Configure DNS Records
In Cloudflare DNS settings:
```
Type: CNAME
Name: www
Target: appointmentbooking-monorepo.houseofgr8ness.workers.dev
Proxy: ✅ Proxied
```

### Step 11: Enable SSL
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**

---

## 🧪 Phase 5: Testing & Validation

### Step 12: Test Booking Flow
```bash
# Create test booking
curl -X POST "https://www.instylehairboutique.co.za/api/book" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "+27123456789",
    "serviceId": "deab9cc75a72cec17158fe6fdbe0b860",
    "scheduledTime": "2025-11-15T10:00:00Z",
    "notes": "Test booking"
  }'
```

### Step 13: Verify SuperSaaS Sync
1. Log into SuperSaaS dashboard
2. Check "Instyle Hair Boutique" schedule
3. Confirm test booking appears

### Step 14: Test Dashboard
Visit: `https://www.instylehairboutique.co.za/api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70`

---

## 📱 Phase 6: Frontend Integration

### Step 15: Update Frontend URLs
In your Next.js app, update API calls to use the new domain:
```javascript
// Before
const response = await fetch('/api/book', {...});

// After  
const response = await fetch('https://www.instylehairboutique.co.za/api/book', {...});
```

### Step 16: Deploy Frontend
Deploy your Next.js frontend to Vercel or Cloudflare Pages pointing to the custom domain.

---

## 🔒 Phase 7: Security & Monitoring

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

### Common Issues:

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
- Cloudflare Support: https://support.cloudflare.com
- SuperSaaS Support: https://www.supersaas.com/support

**System URLs:**
- Worker: https://appointmentbooking-monorepo.houseofgr8ness.workers.dev
- Production: https://www.instylehairboutique.co.za
- Dashboard: https://dash.cloudflare.com

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