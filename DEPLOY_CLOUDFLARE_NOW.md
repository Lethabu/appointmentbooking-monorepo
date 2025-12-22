# 🚀 Deploy to Cloudflare Now - Direct Commands

## Quick Deployment Guide

### Step 1: Authentication
```bash
# First, authenticate with Cloudflare
npx wrangler login

# Verify authentication
npx wrangler whoami
```

### Step 2: Build Applications
```bash
# Install dependencies
pnpm install

# Build all applications
pnpm run build
```

### Step 3: Deploy Worker
```bash
# Deploy the main Worker
npx wrangler deploy
```

### Step 4: Deploy Next.js Apps
```bash
# Deploy booking app
cd apps/booking && npm run pages:deploy

# Deploy dashboard app  
cd apps/dashboard && npm run pages:deploy
```

### Step 5: Apply Database Migrations
```bash
# Apply production migrations
npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/004-safe-instyle-sync.sql
npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/023-import-instyle-data.sql
```

### Step 6: Verify Deployment
```bash
# Test API endpoints
curl -I https://your-worker-domain.workers.dev/health

# Check deployment status
npx wrangler deployments list
```

## 🎯 One-Command Deployment

Execute this single command to deploy everything:

```bash
node scripts/direct-cloudflare-deploy.js
```

## 📋 Expected Results

After successful deployment:

1. **Worker API**: Available at your Cloudflare Workers domain
2. **Booking App**: Available at instylehairboutique.co.za
3. **Dashboard**: Available at dashboard subdomain
4. **Database**: Fully migrated with production data
5. **Domains**: SSL-enabled and accessible

## 🔧 Manual Steps Required

After automated deployment:

1. **Cloudflare Dashboard**:
   - Configure custom domains for each app
   - Set up DNS records
   - Enable SSL/TLS certificates

2. **Domain Configuration**:
   - Point instylehairboutique.co.za to booking app
   - Point dashboard subdomain to dashboard app

3. **Final Testing**:
   - Test booking flow end-to-end
   - Verify dashboard functionality
   - Check API endpoints

## 🆘 Troubleshooting

If deployment fails:

1. **Authentication Issues**:
   ```bash
   npx wrangler logout
   npx wrangler login
   ```

2. **Build Failures**:
   ```bash
   pnpm clean-install
   pnpm run build
   ```

3. **Database Issues**:
   ```bash
   npx wrangler d1 migrations list appointmentbooking-db
   ```

## 📞 Support

- Cloudflare Docs: https://developers.cloudflare.com/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Dashboard: https://dash.cloudflare.com/

---

**Ready to deploy? Start with authentication!**
