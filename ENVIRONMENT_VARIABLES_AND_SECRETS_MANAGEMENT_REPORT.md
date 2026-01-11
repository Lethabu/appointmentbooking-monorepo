# Environment Variables & Secrets Management Report

**Generated:** 2026-01-07  
**Monorepo:** appointmentbooking-monorepo  
**Scope:** Full audit of environment variables and secrets management

---

## 1. Environment Variables Summary

### Total Variables Identified: 95+

### By Environment

| Environment | Variables | Status |
|-------------|-----------|--------|
| Development | 45 | ✅ Template exists (.env.example) |
| Production | 50+ | ⚠️ Template exists, keys incomplete |

---

## 2. Complete Environment Variable Catalog

### 2.1 Application Configuration

| Variable | Environment | Required | Sensitive | Purpose | Location |
|----------|-------------|----------|-----------|---------|----------|
| `NODE_ENV` | All | ✅ Yes | ❌ No | Application mode (development/staging/production) | next.config.js |
| `NEXT_PUBLIC_APP_URL` | All | ✅ Yes | ❌ No | Public application URL | Layout, API routes |
| `NEXTAUTH_URL` | Production | ✅ Yes | ❌ No | NextAuth callback URL | Auth configuration |
| `NEXT_PUBLIC_TENANT_ID` | All | ✅ Yes | ❌ No | Multi-tenant identifier | Components, API |

### 2.2 Authentication & Security

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `NEXTAUTH_SECRET` | Production | ✅ Yes | ✅ Yes | NextAuth session encryption | lib/auth.ts |
| `JWT_SECRET` | Production | ✅ Yes | ✅ Yes | JWT token signing | enterprise-session-manager.ts |
| `CRON_SECRET` | All | ✅ Yes | ✅ Yes | Cron job authentication | API routes |
| `API_SECRET_KEY` | Production | ✅ Yes | ✅ Yes | API key validation | security-middleware.ts |
| `INTERNAL_SERVICE_KEY` | Production | ✅ Yes | ✅ Yes | Internal service communication | enterprise-api-auth.ts |
| `SESSION_TIMEOUT` | Production | ✅ Yes | ❌ No | Session duration (ms) | Auth configuration |
| `CSP_NONCE_SECRET` | Production | ⚠️ Yes | ✅ Yes | CSP nonce generation | Security headers |
| `SECURE_COOKIE_SECRET` | Production | ⚠️ Yes | ✅ Yes | Cookie encryption | Auth configuration |
| `CARD_TOKENIZATION_KEY` | Production | ⚠️ Yes | ✅ Yes | PCI tokenization | PCI compliance |
| `MASTER_ENCRYPTION_KEY` | Production | ⚠️ Yes | ✅ Yes | Data encryption at rest | Security utilities |

### 2.3 Database

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `DATABASE_URL` | All | ✅ Yes | ✅ Yes | PostgreSQL connection string | Database clients |
| `DATABASE_SSL` | Production | ✅ Yes | ❌ No | SSL requirement | Database config |
| `DATABASE_POOL_SIZE` | Production | ⚠️ Yes | ❌ No | Connection pool limit | drizzle.config.ts |
| `TEST_DATABASE_URL` | Test | ✅ Yes | ✅ Yes | Test database | Test setup |

### 2.4 Supabase

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | ✅ Yes | ❌ No | Supabase project URL | lib/supabase.ts |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | ✅ Yes | ❌ No | Supabase anonymous key | lib/supabase.ts |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | ✅ Yes | ✅ Yes | Supabase admin key | Server operations |

### 2.5 OAuth Providers

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `GOOGLE_CLIENT_ID` | Production | ⚠️ Yes | ✅ Yes | Google OAuth client | google-calendar.ts |
| `GOOGLE_CLIENT_SECRET` | Production | ⚠️ Yes | ✅ Yes | Google OAuth secret | google-calendar.ts |
| `GOOGLE_REDIRECT_URI` | Production | ⚠️ Yes | ❌ No | Google OAuth callback | google-calendar/oauth |
| `MICROSOFT_CLIENT_ID` | Production | ⚠️ Yes | ✅ Yes | Microsoft OAuth client | outlook-calendar.ts |
| `MICROSOFT_CLIENT_SECRET` | Production | ⚠️ Yes | ✅ Yes | Microsoft OAuth secret | outlook-calendar.ts |
| `MICROSOFT_REDIRECT_URI` | Production | ⚠️ Yes | ❌ No | Microsoft OAuth callback | outlook-calendar/oauth |
| `ENTERPRISE_OAUTH_DOMAIN` | Enterprise | ⚠️ No | ✅ Yes | Enterprise SSO domain | enterprise-oauth |
| `ENTERPRISE_OAUTH_CLIENT_ID` | Enterprise | ⚠️ No | ✅ Yes | Enterprise SSO client | enterprise-oauth |
| `ENTERPRISE_OAUTH_CLIENT_SECRET` | Enterprise | ⚠️ No | ✅ Yes | Enterprise SSO secret | enterprise-oauth |

### 2.6 AI & Analytics

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `GEMINI_API_KEY` | Production | ⚠️ Yes | ✅ Yes | Google Gemini Pro API | AI agents |
| `GOOGLE_API_KEY` | All | ⚠️ Yes | ✅ Yes | Alternative Gemini key | BaseAgent.ts |
| `OPENAI_API_KEY` | Development | ⚠️ No | ✅ Yes | OpenAI (fallback) | Chat service |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production | ⚠️ No | ❌ No | Google Analytics ID | Analytics |

### 2.7 Payment Processing

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Production | ⚠️ Yes | ❌ No | Paystack public key | Payment components |
| `PAYSTACK_SECRET_KEY` | Production | ✅ Yes | ✅ Yes | Paystack secret key | lib/security/payment |
| `PAYSTACK_WEBHOOK_SECRET` | Production | ⚠️ Yes | ✅ Yes | Paystack webhook verification | Payment webhooks |
| `STRIPE_SECRET_KEY` | Development | ⚠️ No | ✅ Yes | Stripe (if used) | lib/security/payment |
| `STRIPE_PUBLISHABLE_KEY` | Development | ⚠️ No | ❌ No | Stripe public key | Payment components |
| `STRIPE_WEBHOOK_SECRET` | Development | ⚠️ No | ✅ Yes | Stripe webhook verification | Payment webhooks |
| `PAYFAST_MERCHANT_ID` | Development | ⚠️ No | ✅ Yes | Payfast merchant ID | lib/security/payment |
| `PAYFAST_MERCHANT_KEY` | Development | ⚠️ No | ✅ Yes | Payfast merchant key | lib/security/payment |
| `PAYFAST_PASSPHRASE` | Development | ⚠️ No | ✅ Yes | Payfast passphrase | lib/security/payment |

### 2.8 Calendar Integrations

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `GOOGLE_CLIENT_ID` | Production | ⚠️ Yes | ✅ Yes | Google Calendar OAuth | google-calendar.ts |
| `GOOGLE_CLIENT_SECRET` | Production | ⚠️ Yes | ✅ Yes | Google Calendar secret | google-calendar.ts |
| `MICROSOFT_CLIENT_ID` | Production | ⚠️ Yes | ✅ Yes | Outlook Calendar OAuth | outlook-calendar.ts |
| `MICROSOFT_CLIENT_SECRET` | Production | ⚠️ Yes | ✅ Yes | Outlook Calendar secret | outlook-calendar.ts |

### 2.9 Communications

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `AISENSY_API_KEY` | Production | ⚠️ Yes | ✅ Yes | WhatsApp API key | AISensyClient.ts |
| `AISENSY_CAMPAIGN_NAME` | Production | ⚠️ Yes | ❌ No | WhatsApp campaign | AISensyClient.ts |
| `AISENSY_WEBHOOK_SECRET` | Production | ⚠️ Yes | ✅ Yes | WhatsApp webhook verification | WhatsApp route |
| `AISENSY_VERIFY_TOKEN` | Production | ⚠️ Yes | ✅ Yes | WhatsApp verification | WhatsApp route |
| `TELEGRAM_BOT_TOKEN` | Development | ⚠️ No | ✅ Yes | Telegram bot token | lib/telegram.ts |
| `WHATSAPP_BUSINESS_PHONE_NUMBER_ID` | Production | ⚠️ Yes | ✅ Yes | WhatsApp Business ID | WhatsApp route |
| `WHATSAPP_ACCESS_TOKEN` | Production | ⚠️ Yes | ✅ Yes | WhatsApp API token | WhatsApp route |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Production | ⚠️ Yes | ✅ Yes | WhatsApp verification | WhatsApp route |
| `RESEND_API_KEY` | Production | ⚠️ Yes | ✅ Yes | Email service API | email-service.ts |
| `SMTP_HOST` | Production | ⚠️ Yes | ❌ No | SMTP server | Email configuration |
| `SMTP_PORT` | Production | ⚠️ Yes | ❌ No | SMTP port | Email configuration |
| `SMTP_USER` | Production | ⚠️ Yes | ✅ Yes | SMTP authentication | Email configuration |
| `SMTP_PASS` | Production | ⚠️ Yes | ✅ Yes | SMTP password | Email configuration |
| `EMAIL_FROM` | Production | ⚠️ Yes | ❌ No | From email address | Email configuration |

### 2.10 Cloudflare Infrastructure

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `CLOUDFLARE_ACCOUNT_ID` | Deployment | ✅ Yes | ❌ No | Cloudflare account ID | wrangler.toml, deploy scripts |
| `CLOUDFLARE_API_TOKEN` | Deployment | ✅ Yes | ✅ Yes | Cloudflare API token | wrangler, deploy scripts |
| `R2_ENDPOINT` | Production | ⚠️ Yes | ✅ Yes | Cloudflare R2 endpoint | Infrastructure |
| `R2_ACCESS_KEY` | Production | ⚠️ Yes | ✅ Yes | R2 access key | Infrastructure |
| `R2_SECRET_KEY` | Production | ⚠️ Yes | ✅ Yes | R2 secret key | Infrastructure |

### 2.11 Monitoring & Alerting

| Variable | Environment | Required | Sensitive | Purpose | Used In |
|----------|-------------|----------|-----------|---------|----------|
| `NEXT_PUBLIC_SENTRY_DSN` | All | ⚠️ Yes | ❌ No | Sentry error tracking | sentry configs |
| `SENTRY_AUTH_TOKEN` | Production | ⚠️ Yes | ✅ Yes | Sentry authentication | CI/CD |
| `SENTRY_ORG` | Production | ⚠️ Yes | ❌ No | Sentry organization | CI/CD |
| `SENTRY_PROJECT` | Production | ⚠️ Yes | ❌ No | Sentry project name | CI/CD |
| `HEALTH_CHECK_SECRET` | Production | ⚠️ Yes | ✅ Yes | Health check authentication | Health routes |
| `MONITORING_WEBHOOK_URL` | Production | ⚠️ Yes | ✅ Yes | Monitoring alerts webhook | Alert configuration |
| `ALERT_EMAIL` | Production | ⚠️ Yes | ❌ No | Alert email recipient | Alert configuration |
| `ALERT_SLACK_WEBHOOK` | Production | ⚠️ No | ✅ Yes | Slack alerts webhook | Monitoring dashboard |
| `PAGERDUTY_SERVICE_KEY` | Production | ⚠️ No | ✅ Yes | PagerDuty integration | Alert configuration |

### 2.12 Feature Flags

| Variable | Environment | Required | Sensitive | Purpose | Default |
|----------|-------------|----------|-----------|---------|----------|
| `NEXT_PUBLIC_ENABLE_AI_AGENTS` | All | ⚠️ No | ❌ No | Enable AI features | true |
| `NEXT_PUBLIC_ENABLE_WHATSAPP` | All | ⚠️ No | ❌ No | Enable WhatsApp | true |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | All | ⚠️ No | ❌ No | Enable payments | true |
| `NEXT_PUBLIC_ENABLE_OAUTH` | All | ⚠️ No | ❌ No | Enable OAuth | true |
| `NEXT_PUBLIC_IS_BETA` | Development | ⚠️ No | ❌ No | Beta features | false |
| `NEXT_PUBLIC_IS_INTERNAL` | Development | ⚠️ No | ❌ No | Internal build | false |

### 2.13 Compliance & Security

| Variable | Environment | Required | Sensitive | Purpose | Default |
|----------|-------------|----------|-----------|---------|----------|
| `PCI_COMPLIANCE_ENABLED` | Production | ⚠️ Yes | ❌ No | PCI DSS mode | true |
| `GDPR_COMPLIANCE_ENABLED` | Production | ⚠️ Yes | ❌ No | GDPR mode | true |
| `POPIA_COMPLIANCE_ENABLED` | Production | ⚠️ Yes | ❌ No | POPA mode | true |
| `COMPLIANCE_MODE` | Production | ⚠️ Yes | ❌ No | Compliance level | enterprise |
| `RATE_LIMIT_ENABLED` | Production | ⚠️ Yes | ❌ No | Rate limiting | true |
| `RATE_LIMIT_MAX` | Production | ⚠️ Yes | ❌ No | Requests per window | 1000 |
| `RATE_LIMIT_WINDOW_MS` | Production | ⚠️ Yes | ❌ No | Rate limit window | 900000 |

### 2.14 Backup & Recovery

| Variable | Environment | Required | Sensitive | Purpose | Default |
|----------|-------------|----------|-----------|---------|----------|
| `BACKUP_BUCKET` | Production | ⚠️ Yes | ❌ No | Backup storage bucket | appointment-booking-backups |
| `BACKUP_REGION` | Production | ⚠️ Yes | ❌ No | Backup region | us-east-1 |
| `BACKUP_DATABASE_URL` | Production | ⚠️ No | ✅ Yes | Backup DB connection | - |

---

## 3. Secrets Management Solutions

### 3.1 Current Implementation

| Tool | Status | Usage |
|------|--------|-------|
| **HashiCorp Terraform** | ✅ Active | Infrastructure provisioning, cloud resources |
| **GitHub Secrets** | ✅ Active | CI/CD pipeline secrets (CLOUDFLARE_API_TOKEN, etc.) |
| **Supabase Vault** | ⚠️ Configured | Database secrets (not fully utilized) |
| **Environment Files** | ✅ Active | `.env.production`, `.env.local` |
| **Cloudflare Dashboard** | ✅ Active | Environment variables for Pages deployments |

### 3.2 Recommendations for Improvement

| Priority | Recommendation | Benefit |
|----------|----------------|---------|
| 🔴 High | **Implement Doppler** or **1Password Secrets Automation** | Centralized secret rotation, audit trails |
| 🟡 Medium | **HashiCorp Vault** for production secrets | Enterprise-grade secrets management |
| 🟢 Low | **GitHub Actions OpenID Connect** | Replace long-lived tokens with short-lived credentials |

### 3.3 Secret Injection Methods

| Method | Environment | Status |
|--------|-------------|--------|
| `.env` files | Development | ✅ Standard |
| GitHub Secrets | CI/CD | ✅ In use |
| Cloudflare Dashboard | Production | ✅ In use |
| wrangler secrets | Workers/Pages | ⚠️ Partially configured |
| Supabase Vault | Database | ⚠️ Configured, unused |

---

## 4. Missing/Undefined Variables

### 4.1 Variables Causing Deployment Failures

| Variable | Impact | Solution |
|----------|--------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | 503 errors on API calls | Set in Cloudflare Dashboard |
| `NEXTAUTH_SECRET` | Auth failures | Generate secure random value |
| `JWT_SECRET` | Session issues | Generate 256-bit secret |
| `CRON_SECRET` | Cron job failures | Set secure value |

### 4.2 Variables with Hardcoded Fallbacks (Security Risk)

| File | Line | Fallback | Risk Level |
|------|------|----------|------------|
| `lib/supersaas-client.ts` | 39 | `pVq0j8Sm2jAaLW6BrBkI5Q` | 🔴 Critical |
| `lib/auth.ts` | 40 | `development-secret-key` | 🟠 High |
| `lib/security/payment.ts` | 21 | Empty string | 🟡 Medium |
| `utils/security/pci-compliance.ts` | 78 | `default-key-change-in-production` | 🟠 High |

---

## 5. Cross-Reference with Configuration Files

### 5.1 wrangler.toml

```toml
[vars]
# Variables consumed by wrangler:
# - NODE_ENV (auto-set)
# - CLOUDFLARE_ACCOUNT_ID
# - CLOUDFLARE_API_TOKEN (via secrets)

[secrets]
# Should add:
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXTAUTH_SECRET
# - JWT_SECRET
# - DATABASE_URL
```

### 5.2 next.config.js

```javascript
// Variables used:
process.env.ANALYZE
process.env.NODE_ENV
```

### 5.3 GitHub Actions Workflows

| Workflow | Secrets Used |
|----------|-------------|
| `.github/workflows/production-deploy.yml` | CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID |
| `infrastructure/cloudflare/ci-cd/github-actions/*` | AWS credentials, TF_VAR_* |

---

## 6. Recommendations

### 6.1 Immediate Actions (Critical)

1. **Remove hardcoded secrets** from source code
2. **Set production secrets** in Cloudflare Dashboard:

   ```bash
   npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY
   npx wrangler pages secret put NEXTAUTH_SECRET
   npx wrangler pages secret put JWT_SECRET
   npx wrangler pages secret put DATABASE_URL
   ```

3. **Enable Supabase Vault** for database credentials

### 6.2 Short-term Improvements (1-2 weeks)

1. **Implement secrets rotation policy**
2. **Add secret scanning** to CI/CD pipeline
3. **Document all required variables** in runbook
4. **Set up monitoring** for secret expiration

### 6.3 Long-term Architecture (1-3 months)

1. **Deploy HashiCorp Vault** for production
2. **Implement Doppler** for developer secrets
3. **Add OpenID Connect** to GitHub Actions
4. **Create secrets audit automation**

---

## 7. Environment Matrix

| Variable | Dev | Staging | Prod | Cloudflare |
|----------|-----|---------|------|------------|
| NODE_ENV | ✅ | ✅ | ✅ | ✅ |
| NEXTAUTH_SECRET | ✅ | ✅ | ⚠️ | ❌ |
| JWT_SECRET | ✅ | ✅ | ⚠️ | ❌ |
| DATABASE_URL | ✅ | ✅ | ⚠️ | ❌ |
| SUPABASE_* | ✅ | ✅ | ⚠️ | ❌ |
| GOOGLE_CLIENT_* | ✅ | ✅ | ⚠️ | ❌ |
| PAYSTACK_* | ⚠️ | ⚠️ | ⚠️ | ❌ |
| CLOUDFLARE_* | ✅ | ✅ | ✅ | ✅ |
| AISENSY_* | ✅ | ✅ | ⚠️ | ❌ |

**Legend:** ✅ Complete | ⚠️ Incomplete | ❌ Not configured

---

## 8. Security Sensitivity Levels

| Level | Variables | Handling |
|-------|-----------|----------|
| 🔴 Critical | API keys, DB credentials, JWT secrets | Vault + rotation |
| 🟠 High | OAuth secrets, Payment keys | Encrypted storage |
| 🟡 Medium | Service tokens, Webhook secrets | GitHub Secrets |
| 🟢 Low | Public keys, Configuration | Environment files |

---

**Report Generated:** 2026-01-07  
**Next Review:** 2026-02-07  
**Owner:** DevOps Team
