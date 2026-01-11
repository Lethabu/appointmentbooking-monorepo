# Comprehensive Environment Variables Report

**Generated:** 2026-01-07  
**Monorepo:** appointmentbooking-monorepo  
**Scope:** Complete audit of all environment configurations

---

## 1. Executive Summary

### Environment Files Identified

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| `.env` | apps/booking/ | ⚠️ Active | Production values (instylehairboutique.co.za) |
| `.env.local` | apps/booking/ | ⚠️ Active | Emergency deployment configuration |
| `.env.example` | apps/booking/ | ✅ Template | Development template documentation |
| `.env.production` | apps/booking/ | ⚠️ Template | Production template (placeholders) |

### Key Findings

- **Total unique variables across all files:** 75+
- **Variables with production values:** 28
- **Variables with placeholder values:** 35+
- **Discrepancies between files:** 12

---

## 2. Environment Files Comparison

### 2.1 apps/booking/.env (Active Production)

**Purpose:** Primary production configuration for Instyle Hair Boutique

| Variable | Value | Status | Notes |
|----------|-------|--------|-------|
| CLOUDFLARE_API_TOKEN | `gZmPM0oTIikfopiJap3aIWFZBZmNAKPAZ3N3jI-Q` | ⚠️ Exposed | Should be rotated |
| CLOUDFLARE_ACCOUNT_ID | `9e96c83268cae3e0f27168ed50c92033` | ✅ Active | Valid |
| CLOUDFLARE_ZONE_ID | `0b09c7a90690af517c0b09c7a90690af517c4667ab69e7478e` | ⚠️ Exposed | Should be rotated |
| NEXT_PUBLIC_API_BASE_URL | `https://www.instylehairboutique.co.za` | ✅ Active | Instyle URL |
| SUPERSAAS_API_KEY | `pVq0j8Sm2jAaLW6BrBkI5Q` | 🔴 Critical | Hardcoded in source |
| SUPERSAAS_ACCOUNT | `InStyle_Hair_Boutique` | ✅ Active | |
| SUPERSAAS_SCHEDULE_ID | `695384` | ✅ Active | |
| NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY | `pk_test_your_paystack_key` | 🔴 Placeholder | Test key in prod |
| PAYSTACK_SECRET_KEY | `sk_test_your_paystack_secret` | 🔴 Placeholder | Test key in prod |
| TELEGRAM_BOT_TOKEN | `your_telegram_bot_token_here` | 🔴 Placeholder | Not configured |
| TELEGRAM_WEBHOOK_SECRET | `your_webhook_secret_here` | 🔴 Placeholder | Not configured |
| NEXT_PUBLIC_TELEGRAM_BOT_USERNAME | `your_bot_username` | 🔴 Placeholder | Not configured |
| NEXT_PUBLIC_APP_NAME | `Instyle Hair Boutique` | ✅ Active | |
| NEXT_PUBLIC_APP_URL | `https://www.instylehairboutique.co.za` | ✅ Active | Instyle URL |
| NODE_ENV | `production` | ✅ Active | |
| NEXT_PUBLIC_SUPABASE_URL | `https://awrnkvjitzwzojaonrzo.supabase.co` | ✅ Active | |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | `eyJhbGci...` | ⚠️ Exposed | Anon key - public |
| SUPABASE_SERVICE_ROLE_KEY | `eyJhbGci...` | 🔴 Critical | Service role exposed |

### 2.2 apps/booking/.env.local (Emergency Deployment)

**Purpose:** Emergency deployment configuration for appointmentbooking.co.za

| Variable | Value | Status | Notes |
|----------|-------|--------|-------|
| NEXT_PUBLIC_APP_URL | `https://appointmentbooking.co.za` | ✅ Active | Main platform |
| NEXT_PUBLIC_API_URL | `https://appointmentbooking.co.za/api` | ✅ Active | |
| NEXT_PUBLIC_APP_NAME | `Appointment Booking Platform` | ✅ Active | |
| NODE_ENV | `production` | ✅ Active | |
| DATABASE_URL | `file:./data.db` | 🔴 Dev | SQLite in production |
| NEXTAUTH_SECRET | `emergency-secret-for-immediate-deployment` | 🔴 Weak | Should be rotated |
| NEXTAUTH_URL | `https://appointmentbooking.co.za` | ✅ Active | |
| STRIPE_PUBLIC_KEY | `pk_test_emergency` | 🔴 Placeholder | |
| STRIPE_SECRET_KEY | `sk_test_emergency` | 🔴 Placeholder | |
| STRIPE_WEBHOOK_SECRET | `whsec_emergency` | 🔴 Placeholder | |
| GOOGLE_CLIENT_ID | `emergency-client-id` | 🔴 Placeholder | |
| GOOGLE_CLIENT_SECRET | `emergency-client-secret` | 🔴 Placeholder | |
| SUPABASE_URL | `https://emergency.supabase.co` | 🔴 Placeholder | |
| SUPABASE_ANON_KEY | `emergency-anon-key` | 🔴 Placeholder | |
| SUPABASE_SERVICE_ROLE_KEY | `emergency-service-key` | 🔴 Placeholder | |
| RATE_LIMIT_MAX | `100` | ⚠️ Low | |
| RATE_LIMIT_WINDOW | `900000` | ✅ Active | |
| SESSION_TIMEOUT | `3600` | ⚠️ Short | 1 hour |
| SENTRY_DSN | `https://emergency@sentry.io/project-id` | 🔴 Placeholder | |
| HEALTH_CHECK_INTERVAL | `30000` | ✅ Active | |
| **EMERGENCY_MODE** | `true` | 🔴 Critical | Security risk |
| **SKIP_AUTH** | `true` | 🔴 Critical | Security risk |
| DEBUG_MODE | `false` | ✅ Active | |

### 2.3 apps/booking/.env.example (Development Template)

**Purpose:** Template for local development

| Variable | Template Value | Required | Purpose |
|----------|----------------|----------|---------|
| NODE_ENV | `development` | Yes | Dev mode |
| NEXT_PUBLIC_APP_URL | `http://localhost:3000` | Yes | Local URL |
| NEXT_PUBLIC_TENANT_ID | `ccb12b4d-ade6-467d-a614-7c9d198ddc70` | Yes | Tenant ID |
| NEXT_PUBLIC_SUPABASE_URL | `https://your-project.supabase.co` | Yes | Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | `your-anon-key` | Yes | Anon key |
| SUPABASE_SERVICE_ROLE_KEY | `your-service-role-key` | Yes | Service role |
| GEMINI_API_KEY | `your-gemini-api-key` | Yes | AI |
| GOOGLE_API_KEY | `your-gemini-api-key` | Yes | AI alt |
| AISENSY_API_KEY | `your-aisensy-api-key` | Yes | WhatsApp |
| AISENSY_CAMPAIGN_NAME | `instyle-bookings` | Yes | Campaign |
| AISENSY_WEBHOOK_SECRET | `your-webhook-secret` | Yes | Webhook |
| AISENSY_VERIFY_TOKEN | `instyle-webhook-token` | Yes | Verification |
| NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY | `pk_test_your-public-key` | Yes | Payments |
| PAYSTACK_SECRET_KEY | `sk_test_your-secret-key` | Yes | Payments |
| NEXT_PUBLIC_SENTRY_DSN | `https://your-sentry-dsn@sentry.io/project-id` | No | Monitoring |
| SENTRY_AUTH_TOKEN | `your-sentry-auth-token` | No | Monitoring |
| SENTRY_ORG | `your-org` | No | Monitoring |
| SENTRY_PROJECT | `your-project` | No | Monitoring |
| CLOUDFLARE_ACCOUNT_ID | `9e96c83268cae3e0f27168ed50c92033` | Yes | Deployment |
| CLOUDFLARE_API_TOKEN | `your-api-token` | Yes | Deployment |
| CRON_SECRET | `your-secure-cron-secret` | Yes | Security |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | `G-XXXXXXXXXX` | No | Analytics |
| NEXT_PUBLIC_ENABLE_AI_AGENTS | `true` | No | Feature flag |
| NEXT_PUBLIC_ENABLE_WHATSAPP | `true` | No | Feature flag |
| NEXT_PUBLIC_ENABLE_PAYMENTS | `true` | No | Feature flag |

### 2.4 apps/booking/.env.production (Production Template)

**Purpose:** Template for production deployment (appointmentbooking.co.za)

| Variable | Template Value | Required | Purpose |
|----------|----------------|----------|---------|
| NODE_ENV | `production` | Yes | Production mode |
| NEXT_PUBLIC_APP_URL | `https://appointmentbooking.co.za` | Yes | Main platform |
| NEXTAUTH_URL | `https://appointmentbooking.co.za` | Yes | Auth callback |
| NEXT_PUBLIC_TENANT_ID | `appointmentbooking-coza-tenant-id` | Yes | Tenant ID |
| NEXT_PUBLIC_SUPABASE_URL | `https://your-project.supabase.co` | Yes | Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | `your-anon-key` | Yes | Anon key |
| SUPABASE_SERVICE_ROLE_KEY | `your-service-role-key` | Yes | Service role |
| GEMINI_API_KEY | `your-production-gemini-api-key` | Yes | AI |
| GOOGLE_API_KEY | `your-production-gemini-api-key` | Yes | AI alt |
| AISENSY_API_KEY | `your-production-aisensy-api-key` | Yes | WhatsApp |
| AISENSY_CAMPAIGN_NAME | `appointmentbooking-coza` | Yes | Campaign |
| AISENSY_WEBHOOK_SECRET | `your-production-webhook-secret` | Yes | Webhook |
| AISENSY_VERIFY_TOKEN | `appointmentbooking-coza-webhook-token` | Yes | Verification |
| NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY | `pk_live_your-production-public-key` | Yes | Payments |
| PAYSTACK_SECRET_KEY | `sk_live_your-production-secret-key` | Yes | Payments |
| NEXT_PUBLIC_SENTRY_DSN | `https://your-production-sentry-dsn@sentry.io/project-id` | No | Monitoring |
| SENTRY_AUTH_TOKEN | `your-production-sentry-auth-token` | No | Monitoring |
| SENTRY_ORG | `your-production-org` | No | Monitoring |
| SENTRY_PROJECT | `appointmentbooking-coza` | No | Monitoring |
| CLOUDFLARE_ACCOUNT_ID | `9e96c83268cae3e0f27168ed50c92033` | Yes | Deployment |
| CLOUDFLARE_API_TOKEN | `your-production-cloudflare-token` | Yes | Deployment |
| CRON_SECRET | `your-secure-production-cron-secret-256-bits` | Yes | Security |
| GOOGLE_CLIENT_ID | `your-production-google-client-id` | No | OAuth |
| GOOGLE_CLIENT_SECRET | `your-production-google-client-secret` | No | OAuth |
| GOOGLE_REDIRECT_URI | `https://appointmentbooking.co.za/api/auth/callback/google` | No | OAuth |
| MICROSOFT_CLIENT_ID | `your-production-microsoft-client-id` | No | OAuth |
| MICROSOFT_CLIENT_SECRET | `your-production-microsoft-client-secret` | No | OAuth |
| MICROSOFT_REDIRECT_URI | `https://appointmentbooking.co.za/api/auth/callback/microsoft` | No | OAuth |
| DATABASE_URL | `postgresql://username:password@host:port/database` | Yes | Database |
| DATABASE_SSL | `true` | Yes | Database |
| DATABASE_POOL_SIZE | `20` | Yes | Database |
| JWT_SECRET | `your-production-jwt-secret-256-bits-minimum` | Yes | Security |
| NEXTAUTH_SECRET | `your-production-nextauth-secret-256-bits` | Yes | Security |
| SESSION_TIMEOUT | `1800000` | Yes | Security |
| RATE_LIMIT_ENABLED | `true` | Yes | Security |
| RATE_LIMIT_MAX | `1000` | Yes | Security |
| RATE_LIMIT_WINDOW_MS | `900000` | Yes | Security |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | `G-XXXXXXXXXX` | No | Analytics |
| NEXT_PUBLIC_ENABLE_AI_AGENTS | `true` | No | Feature flag |
| NEXT_PUBLIC_ENABLE_WHATSAPP | `true` | No | Feature flag |
| NEXT_PUBLIC_ENABLE_PAYMENTS | `true` | No | Feature flag |
| NEXT_PUBLIC_ENABLE_OAUTH | `true` | No | Feature flag |
| PCI_COMPLIANCE_ENABLED | `true` | Yes | Compliance |
| GDPR_COMPLIANCE_ENABLED | `true` | Yes | Compliance |
| POPIA_COMPLIANCE_ENABLED | `true` | Yes | Compliance |
| COMPLIANCE_MODE | `enterprise` | Yes | Compliance |
| SMTP_HOST | `smtp.your-email-provider.com` | No | Email |
| SMTP_PORT | `587` | No | Email |
| SMTP_USER | `your-production-email@appointmentbooking.co.za` | No | Email |
| SMTP_PASS | `your-production-email-password` | No | Email |
| EMAIL_FROM | `noreply@appointmentbooking.co.za` | No | Email |
| PAYSTACK_WEBHOOK_SECRET | `your-production-paystack-webhook-secret` | Yes | Webhooks |
| CALENDAR_WEBHOOK_SECRET | `your-production-calendar-webhook-secret` | No | Webhooks |
| AISENSY_WEBHOOK_URL | `https://appointmentbooking.co.za/api/webhooks/aisensy` | No | Webhooks |
| HEALTH_CHECK_SECRET | `your-production-health-check-secret` | No | Monitoring |
| MONITORING_WEBHOOK_URL | `https://hooks.slack.com/your-production-webhook` | No | Monitoring |
| ALERT_EMAIL | `alerts@appointmentbooking.co.za` | No | Monitoring |
| CSP_NONCE_SECRET | `your-production-csp-nonce-secret` | No | Security |
| SECURE_COOKIE_SECRET | `your-production-secure-cookie-secret` | No | Security |

---

## 3. Legacy and Deprecated Configurations

### 3.1 Files with Deprecated Variables

| Source File | Deprecated Variables | Migration Action |
|-------------|---------------------|------------------|
| `apps/booking/lib/supersaas-client.ts:113` | `SUPERSAAS_API_KEY` fallback | Remove hardcoded key |
| `apps/booking/app/api/auth/[...nextauth]/route.ts` | NextAuth v4 config | Migrate to v5 or Edge |
| `apps/booking/wrangler.toml` | Legacy D1 config | Update to Pages config |

### 3.2 Legacy Environment References

| Variable Pattern | Found In | Status |
|------------------|----------|--------|
| `STRIPE_*` | .env.local | ⚠️ Unused in production |
| `TELEGRAM_*` | .env | 🔴 Not configured |
| `SUPERSAAS_*` | .env | 🔴 Deprecated (hardcoded) |

---

## 4. Discrepancies Analysis

### 4.1 URL Discrepancies

| File | APP_URL | Target |
|------|---------|--------|
| `.env` | `https://www.instylehairboutique.co.za` | Instyle Hair Boutique |
| `.env.local` | `https://appointmentbooking.co.za` | Main platform |
| `.env.production` | `https://appointmentbooking.co.za` | Main platform |

**Issue:** Multiple deployment targets in same codebase

### 4.2 Database Configuration Discrepancies

| File | DATABASE_URL | Status |
|------|--------------|--------|
| `.env` | Not set | Uses default |
| `.env.local` | `file:./data.db` | SQLite (dev only) |
| `.env.production` | `postgresql://...` | PostgreSQL template |

**Issue:** `.env.local` uses SQLite which is not suitable for production

### 4.3 Security Configuration Discrepancies

| File | EMERGENCY_MODE | SKIP_AUTH | Risk Level |
|------|----------------|-----------|------------|
| `.env` | Not set | Not set | Low |
| `.env.local` | `true` | `true` | 🔴 Critical |

**Issue:** `.env.local` has security bypass enabled

### 4.4 Payment Configuration Discrepancies

| File | PAYSTACK Mode | Status |
|------|---------------|--------|
| `.env` | Test keys | Should be live |
| `.env.local` | Test keys | Placeholder |
| `.env.production` | Template | Not configured |

---

## 5. Security Audit Findings

### 5.1 Critical Issues

| Issue | Location | Severity |
|-------|----------|----------|
| Hardcoded API key in source | `lib/supersaas-client.ts:113` | 🔴 Critical |
| Service role key in `.env` | `.env` | 🔴 Critical |
| Emergency mode enabled | `.env.local` | 🔴 Critical |
| Auth bypass enabled | `.env.local` | 🔴 Critical |
| Test keys in production | `.env` | 🟠 High |
| Weak NEXTAUTH_SECRET | `.env.local` | 🟠 High |

### 5.2 Recommendations

1. **Immediate Actions:**
   - Remove hardcoded `SUPERSAAS_API_KEY` from source code
   - Rotate exposed `SUPABASE_SERVICE_ROLE_KEY`
   - Delete `.env.local` or remove security bypass flags
   - Rotate `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID`

2. **Short-term Actions:**
   - Move all secrets to HashiCorp Vault
   - Configure production payment keys
   - Set up proper OAuth credentials

3. **Long-term Actions:**
   - Implement secrets rotation policy
   - Set up automated secret scanning
   - Create staging environment

---

## 6. Migration Plan

### Phase 1: Security Hardening (Immediate)

```bash
# 1. Rotate exposed credentials
./scripts/generate-production-secrets.sh

# 2. Remove hardcoded secrets from source
# Edit apps/booking/lib/supersaas-client.ts
# Remove fallback: || 'pVq0j8Sm2jAaLW6BrBkI5Q'

# 3. Delete or clean .env.local
# Option A: Delete if not needed
rm apps/booking/.env.local

# Option B: Remove security bypass
sed -i 's/EMERGENCY_MODE=true/EMERGENCY_MODE=false/' apps/booking/.env.local
sed -i 's/SKIP_AUTH=true/SKIP_AUTH=false/' apps/booking/.env.local
```

### Phase 2: Environment Consolidation

```bash
# 1. Choose deployment target
# Option A: appointmentbooking.co.za (main platform)
# Option B: instylehairboutique.co.za (tenant-specific)

# 2. Create unified .env.production based on target
# Copy appropriate values from .env or .env.local

# 3. Set secrets in Cloudflare Pages
npx wrangler pages secret put NEXTAUTH_SECRET --project-name=appointment-booking-coza
npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name=appointment-booking-coza
# ... repeat for all secrets
```

### Phase 3: Validation

```bash
# Validate production configuration
bash scripts/validate-env-production.sh apps/booking/.env.production

# Test deployment
cd apps/booking && npx wrangler pages deploy .vercel/output/static --project-name=appointment-booking-coza
```

---

## 7. Environment Variable Matrix

| Variable | .env | .env.local | .env.example | .env.production | Status |
|----------|------|------------|--------------|-----------------|--------|
| NODE_ENV | prod | prod | dev | prod | ✅ Consistent |
| NEXT_PUBLIC_APP_URL | instyle* | main | local | main | ⚠️ Mixed |
| DATABASE_URL | - | sqlite | - | template | ❌ Inconsistent |
| NEXTAUTH_SECRET | - | weak | - | template | ❌ Inconsistent |
| SUPABASE_URL | real | fake | template | template | ⚠️ Mixed |
| PAYSTACK_KEYS | test | test | test | template | ❌ Not configured |
| CLOUDFLARE_TOKEN | real | - | template | template | ⚠️ Exposed |
| EMERGENCY_MODE | - | true | - | - | 🔴 Security risk |

*instylehairboutique.co.za vs appointmentbooking.co.za

---

## 8. Action Items Summary

| Priority | Action | Status |
|----------|--------|--------|
| 🔴 Critical | Remove hardcoded SUPERSAAS_API_KEY | Pending |
| 🔴 Critical | Rotate exposed Supabase service role key | Pending |
| 🔴 Critical | Disable EMERGENCY_MODE and SKIP_AUTH | Pending |
| 🔴 Critical | Rotate Cloudflare API tokens | Pending |
| 🟠 High | Configure production PayStack keys | Pending |
| 🟠 High | Set up production NEXTAUTH_SECRET | Pending |
| 🟠 High | Configure production DATABASE_URL | Pending |
| 🟡 Medium | Set up OAuth credentials | Pending |
| 🟡 Medium | Configure email service | Pending |
| 🟡 Medium | Set up monitoring webhooks | Pending |
| 🟢 Low | Document all environment variables | In Progress |
| 🟢 Low | Create staging environment | Pending |

---

**Report Generated:** 2026-01-07  
**Next Review:** 2026-02-07  
**Owner:** DevOps Team
