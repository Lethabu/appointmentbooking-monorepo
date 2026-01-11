# Production Environment Configuration

## Environment Overview

This document defines the production environment configuration for the Appointment Booking System, including security settings, performance optimization, monitoring, and operational procedures.

## Environment Variables and Secrets

### Application Configuration

```bash
# Core Application Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
APP_ENV=production
APP_VERSION=1.0.0
APP_NAME=Appointment Booking System

# Security Configuration
NEXTAUTH_SECRET=secure-random-secret-from-vault
NEXTAUTH_URL=https://appointmentbooking.co.za
JWT_SECRET=secure-jwt-secret-from-vault
ENCRYPTION_KEY=secure-encryption-key-from-vault

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/appointmentbooking_prod
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ZONE_ID=your-zone-id

# External Service Integrations
GOOGLE_CALENDAR_CLIENT_ID=your-google-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-google-client-secret
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret

# Email Configuration
SMTP_HOST=smtp.production.com
SMTP_PORT=587
SMTP_USER=noreply@appointmentbooking.co.za
SMTP_PASSWORD=secure-smtp-password
FROM_EMAIL=noreply@appointmentbooking.co.za
FROM_NAME=Appointment Booking System

# Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring and Analytics
SENTRY_DSN=https://your-sentry-dsn
ANALYTICS_ID=your-analytics-id
LOG_LEVEL=info

# Cache Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
CACHE_MAX_SIZE=1000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT=1000
```

### Production Security Settings

```javascript
// Security Configuration
const securityConfig = {
  // HTTPS Enforcement
  forceHTTPS: true,
  secureCookies: true,
  
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  
  // Rate Limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Session Security
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
  
  // API Security
  apiSecurity: {
    cors: {
      origin: ['https://appointmentbooking.co.za'],
      credentials: true,
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    },
  },
};
```

### Performance Configuration

```javascript
// Performance Optimization Settings
const performanceConfig = {
  // Caching Strategy
  caching: {
    staticAssets: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    apiResponses: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 60,
    },
    database: {
      queryCacheTTL: 600, // 10 minutes
      connectionPoolSize: 20,
    },
  },
  
  // Database Optimization
  database: {
    connectionPool: {
      min: 10,
      max: 50,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
    },
    queryOptimization: {
      slowQueryThreshold: 1000, // 1 second
      explainAnalyzeThreshold: 500, // 500ms
      indexHintThreshold: 100, // 100ms
    },
  },
  
  // Application Performance
  application: {
    // Memory Management
    memoryLimit: '512MB',
    maxOldSpaceSize: 512,
    
    // Request Timeout
    requestTimeout: 30000, // 30 seconds
    
    // Concurrency
    maxConcurrency: 100,
    
    // Compression
    gzipCompression: true,
    brotliCompression: true,
  },
};
```

### Production Monitoring Configuration

```javascript
// Monitoring and Observability Configuration
const monitoringConfig = {
  // Health Checks
  healthChecks: {
    endpoints: [
      {
        path: '/api/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
      },
      {
        path: '/api/health/database',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
      },
      {
        path: '/api/health/external',
        method: 'GET',
        timeout: 10000,
        expectedStatus: 200,
      },
    ],
  },
  
  // Metrics Collection
  metrics: {
    application: {
      enabled: true,
      interval: 60000, // 1 minute
    },
    database: {
      enabled: true,
      interval: 30000, // 30 seconds
    },
    externalServices: {
      enabled: true,
      interval: 60000, // 1 minute
    },
  },
  
  // Alerting Configuration
  alerting: {
    channels: {
      email: {
        enabled: true,
        recipients: ['admin@appointmentbooking.co.za', 'ops@appointmentbooking.co.za'],
      },
      slack: {
        enabled: true,
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: '#alerts',
      },
      pagerduty: {
        enabled: true,
        serviceKey: process.env.PAGERDUTY_SERVICE_KEY,
      },
    },
    
    thresholds: {
      cpu: {
        warning: 70,
        critical: 90,
      },
      memory: {
        warning: 80,
        critical: 95,
      },
      disk: {
        warning: 80,
        critical: 90,
      },
      responseTime: {
        warning: 1000, // 1 second
        critical: 5000, // 5 seconds
      },
      errorRate: {
        warning: 5, // 5%
        critical: 10, // 10%
      },
    },
  },
};
```

### Environment-Specific Configurations

#### Production Environment (`production.tfvars`)

```hcl
# Production Infrastructure Configuration
project_name = "appointmentbooking"
environment  = "production"

# Cloudflare Settings
cloudflare_zone_name = "appointmentbooking.co.za"
cloudflare_pages_production_branch = "main"

# Database Configuration
database_name     = "appointmentbooking_prod"
database_version  = "15"
database_instance_class = "db.r6g.xlarge"
database_allocated_storage = 100
database_max_allocated_storage = 1000
database_backup_retention_period = 30
database_multi_az = true
database_deletion_protection = true

# Compute Resources
instance_type = "t3.large"
min_capacity = 2
max_capacity = 10
target_cpu_utilization = 70
health_check_path = "/api/health"

# Security Settings
ssl_minimum_protocol_version = "TLSv1.2"
ssl_policy = "ELBSecurityPolicy-TLS-1-2-2017-01"
enable_waf = true
enable_ddos_protection = true

# Monitoring and Logging
log_retention_days = 90
metrics_retention_days = 455
enable_detailed_monitoring = true
enable_cloudwatch_agent = true
```

#### Staging Environment (`staging.tfvars`)

```hcl
# Staging Infrastructure Configuration
project_name = "appointmentbooking"
environment  = "staging"

# Cloudflare Settings
cloudflare_zone_name = "staging.appointmentbooking.co.za"
cloudflare_pages_production_branch = "develop"

# Database Configuration
database_name     = "appointmentbooking_staging"
database_version  = "15"
database_instance_class = "db.t3.medium"
database_allocated_storage = 20
database_backup_retention_period = 7
database_multi_az = false
database_deletion_protection = false

# Compute Resources
instance_type = "t3.small"
min_capacity = 1
max_capacity = 5
target_cpu_utilization = 80
health_check_path = "/api/health"

# Security Settings
ssl_minimum_protocol_version = "TLSv1.2"
ssl_policy = "ELBSecurityPolicy-TLS-1-2-2017-01"
enable_waf = true
enable_ddos_protection = false

# Monitoring and Logging
log_retention_days = 30
metrics_retention_days = 30
enable_detailed_monitoring = false
enable_cloudwatch_agent = false
```

### Production Readiness Checklist

#### Security Checklist

- [ ] SSL/TLS certificates configured and validated
- [ ] WAF rules implemented and tested
- [ ] DDoS protection enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Authentication and authorization tested
- [ ] Secrets management implemented
- [ ] Security scanning automated
- [ ] Penetration testing completed

#### Performance Checklist

- [ ] Load testing completed
- [ ] Performance benchmarks established
- [ ] Caching strategy implemented
- [ ] Database optimization completed
- [ ] CDN configuration verified
- [ ] Compression enabled
- [ ] Image optimization implemented
- [ ] Bundle size optimization
- [ ] Memory leak testing completed
- [ ] Auto-scaling configured

#### Monitoring Checklist

- [ ] Application monitoring implemented
- [ ] Infrastructure monitoring configured
- [ ] Database monitoring setup
- [ ] Alerting rules configured
- [ ] Log aggregation implemented
- [ ] Health checks implemented
- [ ] Synthetic monitoring setup
- [ ] Performance metrics collection
- [ ] Error tracking configured
- [ ] Uptime monitoring implemented

#### Backup and Recovery Checklist

- [ ] Automated backups configured
- [ ] Backup restoration tested
- [ ] Recovery procedures documented
- [ ] Disaster recovery plan created
- [ ] Cross-region replication setup
- [ ] Backup monitoring implemented
- [ ] Recovery time objectives defined
- [ ] Recovery point objectives defined
- [ ] Failover procedures tested
- [ ] Business continuity plan created

#### Compliance Checklist

- [ ] GDPR compliance verified
- [ ] POPIA compliance implemented
- [ ] Data retention policies configured
- [ ] Audit logging enabled
- [ ] Privacy policies updated
- [ ] Consent management implemented
- [ ] Data encryption at rest and in transit
- [ ] Access controls implemented
- [ ] Security policies documented
- [ ] Compliance monitoring enabled

### Operational Procedures

#### Deployment Procedures

1. **Pre-deployment Checklist**
   - Code review completed
   - All tests passing
   - Security scan passed
   - Performance benchmarks met
   - Rollback plan prepared

2. **Deployment Process**
   - Blue-green deployment strategy
   - Health checks after deployment
   - Performance monitoring during deployment
   - Automated rollback on failure
   - Post-deployment verification

3. **Post-deployment Tasks**
   - Monitoring validation
   - Performance testing
   - User acceptance testing
   - Documentation updates
   - Team notification

#### Incident Response Procedures

1. **Detection and Alerting**
   - Automated monitoring alerts
   - Synthetic monitoring checks
   - User-reported issues
   - Third-party service failures

2. **Response Process**
   - Immediate assessment
   - Incident classification
   - Response team activation
   - Communication plan
   - Resolution and recovery

3. **Post-Incident Review**
   - Root cause analysis
   - Lessons learned
   - Process improvements
   - Documentation updates

This production environment configuration provides a comprehensive foundation for deploying and operating the Appointment Booking System in a production environment with enterprise-grade security, performance, monitoring, and operational procedures.
