# Custom Domain Setup Guide

## Overview
This guide will help you configure custom domains for your deployment booking platform on Cloudflare.

## Target Domain Configuration

**Recommended Setup:**
- `api.appointmentbooking.co.za` → Worker API
- `booking.appointmentbooking.co.za` → Booking Pages  
- `dashboard.appointmentbooking.co.za` → Dashboard Pages
- `appointmentbooking.co.za` → Redirect to booking.appointmentbooking.co.za

## Prerequisites

✅ Domain registered (appointmentbooking.co.za)
✅ Cloudflare account (already set up: 9e96c83268cae3e0f27168ed50c92033)
✅ Domain added to Cloudflare (nameservers configured)

## Step-by-Step Configuration

### Step 1: Add Domain to Cloudflare (If Not Already Done)

1. Log in to Cloudflare Dashboard: https://dash.cloudflare.com
2. Click "Add a Site"
3. Enter `appointmentbooking.co.za`
4. Select Free plan
5. Update nameservers at your domain registrar to Cloudflare's nameservers
6. Wait for DNS propagation (15 minutes - 48 hours)

### Step 2: Configure DNS Records

Navigate to **DNS** > **Records** and add the following:

#### For Worker API (api.appointmentbooking.co.za)
```
Type: CNAME
Name: api
Content: appointmentbooking-worker.houseofgr8ness.workers.dev
Proxy status: Proxied (Orange cloud)
TTL: Auto
```

#### For Booking Pages (booking.appointmentbooking.co.za)
```
Type: CNAME
Name: booking  
Content: appointmentbooking-booking.pages.dev
Proxy status: Proxied (Orange cloud)
TTL: Auto
```

#### For Dashboard Pages (dashboard.appointmentbooking.co.za)
```
Type: CNAME
Name: dashboard
Content: appointmentbooking-dashboard.pages.dev
Proxy status: Proxied (Orange cloud)
TTL: Auto
```

#### For Root Domain (appointmentbooking.co.za)
```
Type: CNAME
Name: @
Content: appointmentbooking-booking.pages.dev
Proxy status: Proxied (Orange cloud)
TTL: Auto
```

### Step 3: Configure Custom Domain on Worker

Run this command to add custom domain to Worker:

```powershell
npx wrangler domains add api.appointmentbooking.co.za --worker appointmentbooking-worker
```

Or manually in Cloudflare Dashboard:
1. Go to **Workers & Pages** > **appointmentbooking-worker**
2. Click **Settings** > **Domains & Routes**
3. Click **Add Custom Domain**
4. Enter `api.appointmentbooking.co.za`
5. Click **Add Domain**

### Step 4: Configure Custom Domains on Pages Projects

#### For Booking Pages:
```powershell
npx wrangler pages deployment tail appointmentbooking-booking
# In Cloudflare Dashboard:
# Workers & Pages > appointmentbooking-booking > Custom domains > Add domain
# Enter: booking.appointmentbooking.co.za and appointmentbooking.co.za
```

Manual steps:
1. Go to **Workers & Pages** > **appointmentbooking-booking**
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter `booking.appointmentbooking.co.za`
5. Click **Continue** > **Activate domain**
6. Repeat for `appointmentbooking.co.za`

#### For Dashboard Pages:
1. Go to **Workers & Pages** > **appointmentbooking-dashboard**
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter `dashboard.appointmentbooking.co.za`
5. Click **Continue** > **Activate domain**

### Step 5: Update CORS Configuration

Update the Worker to allow requests from custom domains:

**File:** `packages/worker/src/index.ts`

Update `corsHeaders` to include:
```javascript
const allowedOrigins = [
  'https://booking.appointmentbooking.co.za',
  'https://appointmentbooking.co.za',
  'https://dashboard.appointmentbooking.co.za',
  'https://appointmentbooking-booking.pages.dev',
  'https://appointmentbooking-dashboard.pages.dev',
  'http://localhost:3000',
  'http://localhost:5000',
];

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(request.headers.get('Origin')) ? request.headers.get('Origin') : allowedOrigins[0],
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### Step 6: Update Environment Variables

Update API base URLs in Pages projects:

#### Booking App:
```powershell
npx wrangler pages secret put API_BASE_URL --project-name=appointmentbooking-booking
# Enter: https://api.appointmentbooking.co.za
```

#### Dashboard App:
```powershell
npx wrangler pages secret put API_BASE_URL --project-name=appointmentbooking-dashboard
# Enter: https://api.appointmentbooking.co.za
```

### Step 7: SSL/TLS Configuration

Cloudflare automatically provisions SSL certificates for custom domains. Verify:

1. Go to **SSL/TLS** section in Cloudflare
2. Ensure **SSL/TLS encryption mode** is set to **Full (strict)**
3. Check **Edge Certificates** > Certificates should show "Active" for your domains
4. Enable **Always Use HTTPS** under **SSL/TLS** > **Edge Certificates**

### Step 8: Verify Custom Domains

Test each domain:

```powershell
# Test Worker API
curl https://api.appointmentbooking.co.za/api/health

# Test Booking Pages
curl -I https://booking.appointmentbooking.co.za

# Test Dashboard
curl -I https://dashboard.appointmentbooking.co.za

# Test root domain
curl -I https://appointmentbooking.co.za
```

## Automation Script

Create `scripts/configure-custom-domains.ps1`:

```powershell
Write-Host "Configuring Custom Domains..." -ForegroundColor Cyan

# Add DNS records (requires Cloudflare API token)
$headers = @{
    "Authorization" = "Bearer YOUR_CLOUDFLARE_API_TOKEN"
    "Content-Type" = "application/json"
}

$zoneId = "YOUR_ZONE_ID"

# Add CNAME records
$records = @(
    @{ type="CNAME"; name="api"; content="appointmentbooking-worker.houseofgr8ness.workers.dev" },
    @{ type="CNAME"; name="booking"; content="appointmentbooking-booking.pages.dev" },
    @{ type="CNAME"; name="dashboard"; content="appointmentbooking-dashboard.pages.dev" }
)

foreach ($record in $records) {
    $body = @{
        type = $record.type
        name = $record.name
        content = $record.content
        proxied = $true
    } | ConvertTo-Json

    Invoke-RestMethod -Method Post -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" -Headers $headers -Body $body
}

Write-Host "DNS records created. Now add custom domains to Worker and Pages in Cloudflare Dashboard." -ForegroundColor Green
```

## Troubleshooting

### Domain Not Resolving
- **Issue:** Custom domain shows "Domain not found" error
- **Solution:** Ensure DNS records are properly configured and proxied through Cloudflare (orange cloud)

### SSL Certificate Error  
- **Issue:** "Your connection is not private" error
- **Solution:** Wait 15-30 minutes for SSL certificate to provision automatically

### CORS Errors
- **Issue:** Browser console shows CORS errors
- **Solution:** Ensure Worker CORS configuration includes your custom domains

### 522 Error (Connection Timed Out)
- **Issue:** Cloudflare can't reach your origin
- **Solution:** Verify CNAME records point to correct `.workers.dev` or `.pages.dev` domains

## Next Steps After Custom Domains

1. ✅ Update hardcoded URLs in frontend code
2. ✅ Update API base URLs in environment variables
3. ✅ Test all functionality with new domains
4. ✅ Update documentation with new URLs
5. ✅ Notify users of domain change (if applicable)

## Estimated Time: 15-20 minutes
(Excluding DNS propagation time)

## Status Checklist

- [ ] Domain added to Cloudflare
- [ ] DNS records configured
- [ ] Worker custom domain added
- [ ] Booking Pages custom domain added
- [ ] Dashboard Pages custom domain added
- [ ] CORS configuration updated
- [ ] Environment variables updated
- [ ] SSL certificates active
- [ ] All endpoints tested and working
