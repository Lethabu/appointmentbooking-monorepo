# 🚀 AppointmentBooking.co.za Production Deployment Plan

**Deployment Target:** appointmentbooking.co.za  
**Current Status:** Placeholder site detected  
**Deployment Date:** January 1, 2026  
**Deployment Team:** DevOps Engineering  

---

## 📋 DEPLOYMENT OVERVIEW

### Current Situation Analysis

- **Live Domain:** appointmentbooking.co.za currently shows "Welcome to AppointmentBooking SaaS"
- **Production System:** Deployed to instylehairboutique.co.za
- **Required Action:** Migrate/redeploy booking system to appointmentbooking.co.za

### Deployment Strategy

**Option A: Direct Deployment to appointmentbooking.co.za**

- Deploy the existing booking system directly to the target domain
- Configure DNS and SSL for appointmentbooking.co.za
- Zero downtime migration

**Option B: Redirect and Brand Update**

- Keep current deployment infrastructure
- Update branding and content for appointmentbooking.co.za
- Configure domain redirect from instylehairboutique.co.za

---

## 🏗️ DEPLOYMENT ARCHITECTURE

### Target Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                   Load Balancer (Cloudflare)                │
├─────────────────────────────────────────────────────────────┤
│                 Next.js Application                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │  Auth API   │  OAuth API  │  Calendar   │  Booking    │  │
│  │  Endpoints  │  Endpoints  │  API        │  API        │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                Database Layer (Supabase)                    │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   Tenants   │   Users     │Appointments │  Calendar   │  │
│  │   Tables    │   Tables    │   Tables    │  Sync       │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 DEPLOYMENT STEPS

### Phase 1: Pre-Deployment Setup

#### 1.1 Environment Configuration

```bash
# Update environment variables for appointmentbooking.co.za
NEXT_PUBLIC_APP_URL=https://appointmentbooking.co.za
NEXT_PUBLIC_TENANT_ID=appointmentbooking-tenant-id
DATABASE_URL=postgresql://production-url
```

#### 1.2 SSL Certificate Setup

```bash
# Run SSL provisioning script
./scripts/ssl-provisioning.sh \
  --domain appointmentbooking.co.za \
  --email admin@appointmentbooking.co.za
```

#### 1.3 DNS Configuration

```dns
# DNS Records needed:
A     @     [SERVER_IP]
A     www   [SERVER_IP]
CNAME api   appointmentbooking.co.za
```

### Phase 2: Application Deployment

#### 2.1 Build Application

```bash
cd apps/booking
npm install
npm run build
```

#### 2.2 Deploy to Production

```bash
# Option A: Vercel Deployment
vercel --prod --alias appointmentbooking.co.za

# Option B: Cloudflare Pages
npm run pages:deploy

# Option C: Traditional Server
npm run start
```

#### 2.3 Configure Environment Variables

```bash
# Production environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://appointmentbooking.co.za
DATABASE_URL=[production_database_url]
NEXTAUTH_URL=https://appointmentbooking.co.za
```

### Phase 3: Integration Setup

#### 3.1 OAuth Providers Configuration

- Update Google OAuth redirect URIs
- Update Microsoft OAuth redirect URIs
- Update PayStack webhook URLs

#### 3.2 Database Migration

```sql
-- Update tenant configuration
UPDATE tenants SET domain = 'appointmentbooking.co.za' 
WHERE id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Update service configurations
UPDATE services SET tenant_config = jsonb_set(
  tenant_config, 
  '{app_url}', 
  '"https://appointmentbooking.co.za"'
);
```

#### 3.3 Calendar Integration Updates

- Google Calendar: Update authorized domains
- Outlook Calendar: Update application registration
- Webhook endpoints: Update to appointmentbooking.co.za

---

## 🛡️ SECURITY CONFIGURATION

### SSL/TLS Security Headers

```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### OAuth Security

- Update OAuth redirect URIs for new domain
- Update CORS policies
- Update JWT secrets for production
- Configure rate limiting

---

## 📊 DEPLOYMENT VALIDATION

### Health Checks

```bash
# Test homepage
curl -I https://appointmentbooking.co.za

# Test API endpoints
curl https://appointmentbooking.co.za/api/health

# Test booking flow
curl -X POST https://appointmentbooking.co.za/api/book \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Performance Validation

- Load time < 2 seconds
- API response time < 500ms
- Database query time < 100ms
- SSL grade A+ rating

---

## 🔄 ROLLBACK PLAN

### Rollback Triggers

- SSL certificate issues
- DNS propagation failures
- Application errors
- Performance degradation

### Rollback Steps

1. Revert DNS to previous configuration
2. Restore previous SSL certificates
3. Restore previous application version
4. Update OAuth redirect URIs
5. Validate rollback success

---

## 📈 MONITORING SETUP

### Application Monitoring

- Uptime monitoring (99.9% target)
- Response time monitoring
- Error rate monitoring
- Database performance monitoring

### SSL Certificate Monitoring

- Certificate expiration alerts (30 days before)
- Automatic renewal verification
- SSL grade monitoring

### Business Metrics

- Booking conversion rates
- User engagement metrics
- Revenue tracking
- API usage analytics

---

## 📞 DEPLOYMENT CONTACTS

### Technical Team

- **DevOps Lead:** <devops@appointmentbooking.co.za>
- **Security Lead:** <security@appointmentbooking.co.za>
- **Database Admin:** <dba@appointmentbooking.co.za>

### Business Team

- **Project Manager:** <pm@appointmentbooking.co.za>
- **Product Owner:** <product@appointmentbooking.co.za>
- **Business Owner:** <business@appointmentbooking.co.za>

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] Environment variables configured
- [ ] SSL certificates provisioned
- [ ] DNS configuration prepared
- [ ] Database backup completed
- [ ] OAuth redirect URIs updated
- [ ] Monitoring systems configured

### Deployment

- [ ] Application built successfully
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] Environment variables set
- [ ] OAuth configurations updated
- [ ] Database migrations applied

### Post-Deployment

- [ ] Health checks passing
- [ ] SSL grade A+ achieved
- [ ] Performance benchmarks met
- [ ] Booking flow tested
- [ ] Calendar integrations working
- [ ] Monitoring alerts configured
- [ ] Team notifications sent

---

## 🎯 SUCCESS CRITERIA

### Technical Success

- ✅ SSL certificate active and valid
- ✅ DNS propagated globally (< 48 hours)
- ✅ Application responding with 200 status
- ✅ API endpoints functional
- ✅ Database connections established
- ✅ OAuth integrations working

### Business Success

- ✅ Booking system operational
- ✅ Payment processing functional
- ✅ Calendar sync active
- ✅ User registration working
- ✅ Email notifications sending
- ✅ Mobile responsiveness confirmed

---

**Deployment Status:** 🟡 READY FOR EXECUTION  
**Estimated Deployment Time:** 2-4 hours  
**Risk Level:** LOW  
**Rollback Time:** < 30 minutes  

---

*This deployment plan ensures a smooth transition of the appointment booking system to appointmentbooking.co.za with minimal downtime and maximum reliability.*
