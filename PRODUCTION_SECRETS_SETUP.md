# Production Secrets Configuration Guide

## Overview
This guide helps you replace placeholder/test API keys with production credentials for:
- Payment processing (Paystack)
- Error tracking (Sentry)
- WhatsApp Business API
- AI services (OpenAI, Gemini)
- Authentication services

## Current Secrets Status

### Worker Secrets (Currently Configured)
```
DATABASE_URL=         ✅ (D1 binding - no change needed)
PAYSTACK_SECRET_KEY=  ⚠️ (Test key - needs production key)
SENTRY_DSN=           ⚠️ (Placeholder - needs real DSN)
WHATSAPP_API_KEY=     ⚠️ (Test key - needs production key)
OPENAI_API_KEY=       ⚠️ (Test key - needs production key)
GEMINI_API_KEY=       ⚠️ (Test key - needs production key)
JWT_SECRET=           ✅ (Secure - no change needed)
```

### Pages Environment Variables (Per Project)
```
NEXT_PUBLIC_API_URL=  ⚠️ (Update to custom domain if configured)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY= ⚠️ (Test key - needs production)
SENTRY_DSN=           ⚠️ (Placeholder - needs real DSN)
```

## Step-by-Step Configuration

---

## 1. Paystack (Payment Gateway)

### Get Production Keys

1. Log in to Paystack Dashboard: https://dashboard.paystack.com
2. Navigate to **Settings** > **API Keys & Webhooks**
3. Find your **Live** keys (not Test keys):
   - **Public Key:** Starts with `pk_live_`
   - **Secret Key:** Starts with `sk_live_`
4. Copy both keys securely

### Configure Worker Secret Key

```powershell
# Set Paystack secret key for Worker
npx wrangler secret put PAYSTACK_SECRET_KEY --name appointmentbooking-worker

# When prompted, paste your sk_live_... key
```

### Configure Pages Public Key (Booking App)

```powershell
# Set Paystack public key for Booking Pages
npx wrangler pages secret put NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY --project-name=appointmentbooking-booking

# When prompted, paste your pk_live_... key
```

### Verify Configuration

```powershell
# Test payment endpoint
curl -X POST https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/payments/initialize `
  -H "Content-Type: application/json" `
  -d '{"amount":10000,"email":"test@example.com"}'
```

---

## 2. Sentry (Error Tracking)

### Create Sentry Projects

1. Log in to Sentry: https://sentry.io
2. Create three projects:
   - **appointmentbooking-worker** (Node.js)
   - **appointmentbooking-booking** (Next.js)
   - **appointmentbooking-dashboard** (Next.js)

### Get DSN URLs

For each project:
1. Navigate to **Settings** > **Projects** > **[Project Name]**
2. Click **Client Keys (DSN)**
3. Copy the **DSN** URL (format: `https://[key]@[org].ingest.sentry.io/[project]`)

### Configure Worker Sentry DSN

```powershell
npx wrangler secret put SENTRY_DSN --name appointmentbooking-worker
# Paste Worker DSN when prompted
```

### Configure Booking App Sentry DSN

```powershell
npx wrangler pages secret put SENTRY_DSN --project-name=appointmentbooking-booking
# Paste Booking DSN when prompted

npx wrangler pages secret put NEXT_PUBLIC_SENTRY_DSN --project-name=appointmentbooking-booking
# Paste same Booking DSN for client-side tracking
```

### Configure Dashboard Sentry DSN

```powershell
npx wrangler pages secret put SENTRY_DSN --project-name=appointmentbooking-dashboard
# Paste Dashboard DSN when prompted

npx wrangler pages secret put NEXT_PUBLIC_SENTRY_DSN --project-name=appointmentbooking-dashboard
# Paste same Dashboard DSN
```

### Initialize Sentry in Code

Worker already configured in `packages/worker/src/index.ts`.
Pages apps need `sentry.client.config.js` and `sentry.server.config.js` files.

---

## 3. WhatsApp Business API

### Get API Credentials

**Option A: Meta Business Account (Official)**
1. Go to https://business.facebook.com
2. Navigate to **WhatsApp** > **API Setup**
3. Get your:
   - **Phone Number ID**
   - **WhatsApp Business Account ID**
   - **Access Token**

**Option B: Third-Party Provider (e.g., Twilio, MessageBird)**
1. Sign up for WhatsApp Business API access
2. Get API key from provider dashboard

### Configure Worker

```powershell
npx wrangler secret put WHATSAPP_API_KEY --name appointmentbooking-worker
# Paste your access token or API key

npx wrangler secret put WHATSAPP_PHONE_NUMBER_ID --name appointmentbooking-worker
# Paste your phone number ID (if using Meta)

npx wrangler secret put WHATSAPP_BUSINESS_ACCOUNT_ID --name appointmentbooking-worker
# Paste your business account ID (if using Meta)
```

### Test WhatsApp Integration

```powershell
curl -X POST https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/notifications/whatsapp `
  -H "Content-Type: application/json" `
  -d '{"to":"+27821234567","message":"Test message"}'
```

---

## 4. OpenAI API (AI Features)

### Get Production API Key

1. Log in to OpenAI Platform: https://platform.openai.com
2. Navigate to **API Keys**
3. Create a new key: **Create new secret key**
4. Name it "AppointmentBooking Production"
5. Copy the key (starts with `sk-proj-...` or `sk-...`)

### Configure Worker

```powershell
npx wrangler secret put OPENAI_API_KEY --name appointmentbooking-worker
# Paste your OpenAI key
```

### Set Usage Limits (Recommended)

1. In OpenAI Dashboard, go to **Settings** > **Limits**
2. Set monthly budget limit (e.g., $50)
3. Enable email notifications for 75% and 100% usage

---

## 5. Google Gemini API (Alternative AI)

### Get API Key

1. Go to Google AI Studio: https://makersuite.google.com/app/apikey
2. Click **Create API Key**
3. Select or create a Google Cloud project
4. Copy the generated API key

### Configure Worker

```powershell
npx wrangler secret put GEMINI_API_KEY --name appointmentbooking-worker
# Paste your Gemini API key
```

---

## 6. Update API Base URLs (If Using Custom Domains)

### Booking App

```powershell
npx wrangler pages secret put NEXT_PUBLIC_API_URL --project-name=appointmentbooking-booking
# Enter: https://api.appointmentbooking.co.za
# Or use: https://appointmentbooking-worker.houseofgr8ness.workers.dev
```

### Dashboard App

```powershell
npx wrangler pages secret put NEXT_PUBLIC_API_URL --project-name=appointmentbooking-dashboard
# Enter: https://api.appointmentbooking.co.za
# Or use: https://appointmentbooking-worker.houseofgr8ness.workers.dev
```

---

## 7. Verification Script

Create `scripts/verify-secrets.ps1`:

```powershell
Write-Host "`nVerifying Production Secrets Configuration...`n" -ForegroundColor Cyan

$errors = @()

# Test Paystack
Write-Host "Testing Paystack..." -NoNewline
$response = curl -s https://appointmentbooking-worker.houseofgr8ness.workers.dev/api/health
if ($response -match "operational") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ❌" -ForegroundColor Red
    $errors += "Paystack configuration may be invalid"
}

# Test Sentry (check if errors are being tracked)
Write-Host "Testing Sentry..." -NoNewline
Write-Host " ⚠️  Manual verification required" -ForegroundColor Yellow

# Test OpenAI
Write-Host "Testing OpenAI API..." -NoNewline
Write-Host " ⚠️  Manual verification required" -ForegroundColor Yellow

# Test WhatsApp
Write-Host "Testing WhatsApp API..." -NoNewline
Write-Host " ⚠️  Manual verification required" -ForegroundColor Yellow

if ($errors.Count -eq 0) {
    Write-Host "`n✅ All automatic checks passed!`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some checks failed:`n" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "   - $error" -ForegroundColor Red
    }
}

Write-Host "Manual verification steps:" -ForegroundColor Cyan
Write-Host "1. Make a test payment to verify Paystack" -ForegroundColor White
Write-Host "2. Trigger an error to verify Sentry tracking" -ForegroundColor White
Write-Host "3. Send a test WhatsApp message" -ForegroundColor White
Write-Host "4. Test AI features (if enabled)`n" -ForegroundColor White
```

---

## All-in-One Configuration Script

Create `scripts/configure-production-secrets.ps1`:

```powershell
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Production Secrets Configuration" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "This script will guide you through configuring production secrets.`n"  -ForegroundColor Yellow

# Paystack
Write-Host "[1/5] Paystack Configuration" -ForegroundColor Green
Write-Host "Get your keys from: https://dashboard.paystack.com/settings/api-keys-webhooks`n"
$paystackSecret = Read-Host "Enter Paystack SECRET key (sk_live_...)"
$paystackPublic = Read-Host "Enter Paystack PUBLIC key (pk_live_...)"

Set-Content -Path ".env.paystack" -Value $paystackSecret
npx wrangler secret put PAYSTACK_SECRET_KEY --name appointmentbooking-worker < .env.paystack

Set-Content -Path ".env.paystack.public" -Value $paystackPublic  
npx wrangler pages secret put NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY --project-name=appointmentbooking-booking < .env.paystack.public

Remove-Item .env.paystack, .env.paystack.public

# Sentry
Write-Host "`n[2/5] Sentry Configuration" -ForegroundColor Green
Write-Host "Get DSN from: https://sentry.io/settings/projects/`n"
$sentryWorker = Read-Host "Enter Worker Sentry DSN"
$sentryBooking = Read-Host "Enter Booking App Sentry DSN"
$sentryDashboard = Read-Host "Enter Dashboard Sentry DSN"

Set-Content -Path ".env.sentry.worker" -Value $sentryWorker
npx wrangler secret put SENTRY_DSN --name appointmentbooking-worker < .env.sentry.worker

Set-Content -Path ".env.sentry.booking" -Value $sentryBooking
npx wrangler pages secret put SENTRY_DSN --project-name=appointmentbooking-booking < .env.sentry.booking
npx wrangler pages secret put NEXT_PUBLIC_SENTRY_DSN --project-name=appointmentbooking-booking < .env.sentry.booking

Set-Content -Path ".env.sentry.dashboard" -Value $sentryDashboard
npx wrangler pages secret put SENTRY_DSN --project-name=appointmentbooking-dashboard < .env.sentry.dashboard

Remove-Item .env.sentry.*

# WhatsApp
Write-Host "`n[3/5] WhatsApp Business API Configuration" -ForegroundColor Green
$whatsappKey = Read-Host "Enter WhatsApp API Key or Access Token"
Set-Content -Path ".env.whatsapp" -Value $whatsappKey
npx wrangler secret put WHATSAPP_API_KEY --name appointmentbooking-worker < .env.whatsapp
Remove-Item .env.whatsapp

# OpenAI
Write-Host "`n[4/5] OpenAI Configuration" -ForegroundColor Green
$openaiKey = Read-Host "Enter OpenAI API Key (sk-...)"
Set-Content -Path ".env.openai" -Value $openaiKey
npx wrangler secret put OPENAI_API_KEY --name appointmentbooking-worker < .env.openai
Remove-Item .env.openai

# Gemini
Write-Host "`n[5/5] Google Gemini Configuration" -ForegroundColor Green
$geminiKey = Read-Host "Enter Gemini API Key"
Set-Content -Path ".env.gemini" -Value $geminiKey
npx wrangler secret put GEMINI_API_KEY --name appointmentbooking-worker < .env.gemini
Remove-Item .env.gemini

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " Configuration Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "All production secrets have been configured." -ForegroundColor Cyan
Write-Host "Run './scripts/verify-secrets.ps1' to verify the configuration.`n" -ForegroundColor Yellow
```

---

## Security Best Practices

### ✅ DO:
- Use separate API keys for development and production
- Set usage limits and budget alerts on all paid APIs
- Rotate secrets regularly (every 90 days)
- Use Cloudflare Access or VPN for dashboard access
- Enable 2FA on all service accounts
- Monitor API usage and costs regularly

### ❌ DON'T:
- Commit secrets to version control
- Share secrets via email or chat
- Use test keys in production
- Keep unused API keys active
- Grant overly broad API permissions

---

## Monitoring & Alerts

### Set Up Budget Alerts

**Paystack:**
- Dashboard > Settings > Webhooks
- Enable transaction alerts and daily summaries

**OpenAI:**
- Platform > Settings > Limits
- Set monthly budget and email alerts

**Sentry:**
- Settings > Quota & Usage Alerts
- Set error count thresholds

---

## Troubleshooting

### "Invalid API Key" Errors
- Verify you're using production keys (not test keys)
- Check for extra whitespace when pasting keys
- Ensure keys haven't been rotated or revoked

### Payment Failures
- Verify Paystack account is verified and activated
- Check webhook configuration
- Review transaction logs in Paystack dashboard

### Sentry Not Tracking Errors
- Verify DSN is correct
- Check Sentry project is not paused
- Ensure error sampling rate is not 0%

---

## Estimated Time: 20 Minutes

## Status Checklist

- [ ] Paystack production keys configured
- [ ] Sentry DSNs for all projects configured
- [ ] WhatsApp Business API configured
- [ ] OpenAI production key configured
- [ ] Gemini API key configured (if using)
- [ ] API base URLs updated (if using custom domains)
- [ ] All secrets tested and verified
- [ ] Budget alerts configured
- [ ] Security best practices implemented
