# Production Infrastructure Management Guide

# Comprehensive guide for managing appointment booking system infrastructure

# Created: 2025-12-31

## Table of Contents

1. [Overview](#overview)
2. [Database Management](#database-management)
3. [SSL Certificate Management](#ssl-certificate-management)
4. [Environment & Secrets Management](#environment--secrets-management)
5. [Container Orchestration](#container-orchestration)
6. [Monitoring & Alerting](#monitoring--alerting)
7. [CI/CD Pipeline Management](#cicd-pipeline-management)
8. [Disaster Recovery](#disaster-recovery)
9. [Maintenance Procedures](#maintenance-procedures)
10. [Security Management](#security-management)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)
13. [Emergency Procedures](#emergency-procedures)

## Overview

### Infrastructure Architecture

The appointment booking system is deployed on a production-grade infrastructure with the following components:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Load Balancer (Nginx)                       │
│                   Port 80/443 with SSL                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌────▼────┐ ┌────▼────┐
│ Web App #1   │ │Web App #2│ │Web App #3│
│  Container   │ │ Container│ │ Container│
└──────┬───────┘ └────┬────┘ └────┬────┘
       │               │            │
       └───────┬───────┼────┬───────┘
               │       │    │
          ┌────▼─────┐  ▼    ▼   ┌─────────┐
          │ Database │  Worker   │ Monitoring│
          │ PostgreSQL│ Background│ Prometheus│
          └─────────┘  Jobs      │ Grafana  │
                                       └─────────┘
```

### Environment Structure

- **Development**: Local development with Docker Compose
- **Staging**: Pre-production testing environment
- **Production**: Live environment with high availability

### Key Components

- **Web Application**: Next.js application running in multiple containers
- **Database**: PostgreSQL with optimized schema and indexing
- **Cache**: Redis for session management and performance optimization
- **Load Balancer**: Nginx with SSL termination and health checks
- **Monitoring**: Prometheus, Grafana, and custom alerting
- **CI/CD**: GitHub Actions with blue-green deployment
- **Backup**: Automated backup system with encryption

## Database Management

### Database Schema Overview

The database uses a comprehensive schema with optimized indexing for high-performance appointment booking:

#### Core Tables

- `tenants` - Multi-tenancy support
- `users` - User management with RBAC
- `customers` - Customer profiles and history
- `services` - Service catalog with pricing
- `employees` - Staff management and scheduling
- `appointments` - Core booking entity with status tracking
- `availability` - Time slot management
- `blocked_slots` - Unavailable time tracking
- `calendar_connections` - External calendar integration
- `notifications` - Comprehensive notification system
- `audit_logs` - Complete audit trail
- `analytics_data` - Business intelligence metrics

### Database Operations

#### Running Migrations

```bash
# Apply new migrations
./scripts/database/migrate.sh production

# Check migration status
./scripts/database/status.sh

# Rollback migrations (if needed)
./scripts/database/rollback.sh <version>
```

#### Database Maintenance

```bash
# Analyze database performance
./scripts/database/analyze.sh

# Update statistics
./scripts/database/vacuum.sh

# Reindex tables
./scripts/database/reindex.sh

# Check database health
./scripts/database/health-check.sh
```

#### Query Optimization

The system includes optimized stored procedures for common operations:

```sql
-- Optimized availability checking
SELECT * FROM get_optimized_availability(
    'tenant-id', '2025-12-31', 'service-id', 'employee-id', 60, 15
);

-- Optimized appointment booking
SELECT * FROM book_appointment_optimized(
    'tenant-id', 'customer-id', 'service-id', 'employee-id',
    '2025-12-31', '10:00', 'customer-notes', 'special-requests'
);

-- Dashboard analytics
SELECT * FROM get_dashboard_analytics(
    'tenant-id', '2025-12-01', '2025-12-31'
);
```

#### Performance Monitoring

```bash
# View slow queries
./scripts/database/slow-queries.sh

# Check connection pool status
./scripts/database/connection-status.sh

# Monitor database metrics
./scripts/database/metrics.sh
```

### Database Backup and Recovery

#### Automated Backups

```bash
# Manual backup
./scripts/disaster-recovery.sh backup full

# Incremental backup
./scripts/disaster-recovery.sh backup incremental

# Quick backup (transaction logs only)
./scripts/disaster-recovery.sh backup quick
```

#### Recovery Procedures

```bash
# Database recovery
./scripts/disaster-recovery.sh recover database /path/to/backup.sql.enc

# Full system recovery
./scripts/disaster-recovery.sh recover full /path/to/backup.tar.gz.enc
```

## SSL Certificate Management

### Certificate Provisioning

#### Initial Setup

```bash
# Run SSL provisioning script
sudo ./scripts/ssl-provisioning.sh \
    --domain appointmentbooking.co.za \
    --email admin@appointmentbooking.co.za

# For staging environment
sudo ./scripts/ssl-provisioning.sh \
    --domain staging.appointmentbooking.co.za \
    --email admin@appointmentbooking.co.za \
    --staging
```

#### Certificate Renewal

Certificates are automatically renewed via cron job. Manual renewal:

```bash
# Check certificate status
sudo /usr/local/bin/check-ssl-cert.sh

# Manual renewal
sudo certbot renew --force-renewal

# Reload nginx after renewal
sudo systemctl reload nginx
```

#### Certificate Monitoring

```bash
# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/appointmentbooking.co.za/fullchain.pem -noout -enddate

# Monitor certificate health
sudo /usr/local/bin/monitor-ssl.sh
```

### SSL Configuration

The nginx configuration includes:

- TLS 1.2 and 1.3 support
- Strong cipher suites
- HSTS headers
- Perfect Forward Secrecy
- OCSP stapling
- Certificate transparency logging

## Environment & Secrets Management

### Environment Configuration

#### Environment Templates

- **Development**: `/etc/environment/appointmentbooking/development/.env.template`
- **Staging**: `/etc/environment/appointmentbooking/staging/.env.template`
- **Production**: `/etc/environment/appointmentbooking/production/.env.template`

#### Loading Environment

```bash
# Load environment for specific service
./usr/local/bin/load-environment.sh production api

# Validate environment configuration
./usr/local/bin/validate-environment.sh production
```

#### Environment Variables

Key environment variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://appointmentbooking.co.za
NEXT_PUBLIC_API_URL=https://appointmentbooking.co.za/api

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Cache
REDIS_URL=redis://:password@host:6379
REDIS_KEY_PREFIX=appointmentbooking:

# Authentication
JWT_SECRET=<secure-secret>
NEXTAUTH_SECRET=<secure-secret>
NEXTAUTH_URL=https://appointmentbooking.co.za

# External Services
STRIPE_SECRET_KEY=sk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
GOOGLE_CALENDAR_CLIENT_SECRET=...
```

### Secrets Management

#### Secrets Structure

```
/etc/secrets/appointmentbooking/
├── production/
│   ├── .secrets.template
│   ├── database.conf
│   ├── auth.conf
│   └── external.conf
├── staging/
└── development/
```

#### Secrets Rotation

```bash
# Rotate specific secret type
./usr/local/bin/rotate-secrets.sh production database

# Rotate all secrets
./usr/local/bin/rotate-secrets.sh production all

# Schedule automatic rotation (monthly)
# Already configured in crontab
```

#### Secrets Security

- All secrets stored with 600 permissions
- Encrypted in backups
- Regular rotation schedule
- Access logging and monitoring
- Integration with secret managers (Vault, AWS Secrets Manager)

## Container Orchestration

### Docker Compose Management

#### Starting Services

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Start with specific services
docker-compose -f docker-compose.prod.yml up -d web-app-1 database redis

# Scale web applications
docker-compose -f docker-compose.prod.yml up -d --scale web-app=5
```

#### Service Management

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f web-app-1

# Restart specific service
docker-compose -f docker-compose.prod.yml restart web-app-2

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

#### Health Checks

```bash
# Check all service health
./scripts/health-check.sh all

# Check specific service
./scripts/health-check.sh database

# Detailed health report
./scripts/health-check.sh detailed
```

### Load Balancer Management

#### Nginx Configuration

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View status
sudo systemctl status nginx

# Access logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### Load Balancer Health

```bash
# Check upstream servers
curl -I http://localhost/health

# Monitor load distribution
./scripts/load-balancer-stats.sh

# Check SSL configuration
./scripts/ssl-check.sh
```

### Auto-scaling

The system includes auto-scaling based on CPU and memory usage:

```bash
# Check current scaling status
kubectl get hpa

# Manual scaling
kubectl scale deployment web-app --replicas=5

# Update scaling configuration
kubectl apply -f kubernetes/hpa.yaml
```

## Monitoring & Alerting

### Monitoring Stack

#### Prometheus Configuration

```bash
# Reload Prometheus configuration
curl -X POST http://prometheus:9090/-/reload

# Check targets
curl http://prometheus:9090/api/v1/targets

# Query metrics
curl http://prometheus:9090/api/v1/query?query=up
```

#### Grafana Dashboard

Access Grafana at `http://grafana:3000` with admin credentials.

Key dashboards:

- System Overview
- Application Performance
- Database Metrics
- Business Metrics
- Security Dashboard

#### Alert Management

```bash
# Check active alerts
curl http://alertmanager:9093/api/v1/alerts

# Test alert routing
./scripts/test-alerts.sh

# Silence alerts
curl -X POST http://alertmanager:9093/api/v1/silences \
  -H "Content-Type: application/json" \
  -d '{"matchers":[{"name":"alertname","value":"HighCPUUsage"}],"createdBy":"admin","comment":"Planned maintenance","startsAt":"2025-12-31T15:00:00Z","endsAt":"2025-12-31T16:00:00Z"}'
```

### Key Metrics

#### Application Metrics

- Request rate and response times
- Error rates by endpoint
- Database query performance
- Cache hit ratios
- User session metrics

#### Infrastructure Metrics

- CPU, memory, and disk usage
- Network traffic and latency
- Container health and restart counts
- Load balancer performance

#### Business Metrics

- Appointment booking rates
- Revenue generation
- Customer acquisition
- Service utilization

### Alert Configuration

#### Critical Alerts

- Service downtime
- High error rates (>5%)
- Database connection failures
- Payment processing issues
- Security breaches

#### Warning Alerts

- High resource usage (>80%)
- Slow response times
- Cache performance issues
- Certificate expiration
- Unusual traffic patterns

## CI/CD Pipeline Management

### Pipeline Overview

The CI/CD pipeline includes:

1. Security scanning (Trivy, CodeQL)
2. Quality checks (linting, tests, coverage)
3. Docker image building and pushing
4. Database migrations
5. Infrastructure deployment
6. Blue-green deployment
7. Post-deployment verification
8. Automated rollback on failure

### Manual Deployment

```bash
# Trigger deployment via GitHub Actions
gh workflow run production-deploy.yml -f environment=production -f deploy_type=blue-green

# Check deployment status
gh run list --workflow=production-deploy.yml
```

### Deployment Rollback

```bash
# Emergency rollback
./scripts/emergency-rollback.sh

# Rollback to specific version
./scripts/rollback.sh <image-tag>

# Check rollback status
./scripts/rollback-status.sh
```

### Pipeline Monitoring

```bash
# Check pipeline health
./scripts/pipeline-health.sh

# Monitor deployment metrics
./scripts/deployment-metrics.sh

# Check deployment history
./scripts/deployment-history.sh
```

## Disaster Recovery

### Backup Strategy

#### Backup Types

- **Full backups**: Daily at 2:00 AM
- **Incremental backups**: Every 6 hours
- **Transaction log backups**: Every 15 minutes

#### Backup Storage

- Local storage: `/var/backups/appointmentbooking/`
- Cloud storage: S3/GCS with encryption
- Retention: 30 days (configurable)

### Recovery Procedures

#### Database Recovery

```bash
# Check available backups
./scripts/disaster-recovery.sh status

# Verify backup integrity
./scripts/disaster-recovery.sh verify /path/to/backup.sql.enc

# Recover database
./scripts/disaster-recovery.sh recover database /path/to/backup.sql.enc
```

#### Application Recovery

```bash
# Recover application
./scripts/disaster-recovery.sh recover application /path/to/backup.tar.gz.enc

# Verify application health
./scripts/health-check.sh application
```

#### Full System Recovery

```bash
# Complete system recovery
./scripts/disaster-recovery.sh recover full /path/to/full-backup.tar.gz.enc

# Post-recovery verification
./scripts/post-recovery-verification.sh
```

### Disaster Recovery Testing

```bash
# Monthly DR test
./scripts/disaster-recovery-test.sh

# Recovery time measurement
./scripts/measure-recovery-time.sh

# Document test results
./scripts/document-dr-test.sh
```

## Maintenance Procedures

### Regular Maintenance

#### Daily Tasks

- Check system health
- Review error logs
- Monitor resource usage
- Verify backup completion

#### Weekly Tasks

- Update system packages
- Review security alerts
- Performance analysis
- Capacity planning review

#### Monthly Tasks

- Security updates
- SSL certificate renewal check
- Disaster recovery testing
- Performance optimization
- Documentation updates

### Maintenance Windows

```bash
# Schedule maintenance
./scripts/schedule-maintenance.sh "2025-12-31 02:00" "System updates"

# Execute maintenance
./scripts/execute-maintenance.sh

# Verify system after maintenance
./scripts/post-maintenance-verification.sh
```

### Performance Maintenance

```bash
# Database maintenance
./scripts/database/maintenance.sh

# Cache cleanup
./scripts/cache-maintenance.sh

# Log rotation
./scripts/log-rotation.sh

# Disk space cleanup
./scripts/disk-cleanup.sh
```

## Security Management

### Security Monitoring

```bash
# Check security status
./scripts/security-status.sh

# Run security scan
./scripts/security-scan.sh

# Check SSL configuration
./scripts/ssl-security-check.sh

# Review access logs
./scripts/security-log-review.sh
```

### Access Control

#### User Management

- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- Regular access reviews
- Automated deprovisioning

#### System Access

- SSH key-based authentication
- VPN required for admin access
- IP whitelisting for critical systems
- Session timeout policies

### Vulnerability Management

```bash
# Vulnerability scan
./scripts/vulnerability-scan.sh

# Check for outdated packages
./scripts/outdated-packages.sh

# Security patch status
./scripts/patch-status.sh
```

### Compliance

- GDPR compliance for data handling
- PCI DSS compliance for payments
- SOC 2 Type II controls
- Regular security audits

## Performance Optimization

### Database Optimization

```bash
# Analyze query performance
./scripts/database/query-analysis.sh

# Optimize indexes
./scripts/database/index-optimization.sh

# Connection pool tuning
./scripts/database/pool-tuning.sh
```

### Application Optimization

```bash
# Performance profiling
./scripts/app-profiling.sh

# Cache optimization
./scripts/cache-optimization.sh

# CDN configuration
./scripts/cdn-optimization.sh
```

### Infrastructure Optimization

```bash
# Resource usage analysis
./scripts/resource-analysis.sh

# Auto-scaling optimization
./scripts/scaling-optimization.sh

# Load balancer tuning
./scripts/lb-optimization.sh
```

### Performance Monitoring

```bash
# Real-time performance dashboard
./scripts/performance-dashboard.sh

# Bottleneck identification
./scripts/bottleneck-identification.sh

# Capacity planning
./scripts/capacity-planning.sh
```

## Troubleshooting

### Common Issues

#### Application Issues

**High Response Times**

```bash
# Check application performance
./scripts/performance-check.sh

# Analyze slow queries
./scripts/database/slow-queries.sh

# Check resource usage
./scripts/resource-usage.sh
```

**Database Connection Issues**

```bash
# Check database connectivity
./scripts/database/connectivity-check.sh

# Review connection pool
./scripts/database/pool-status.sh

# Check database logs
./scripts/database/log-review.sh
```

**Cache Issues**

```bash
# Check cache health
./scripts/cache-health.sh

# Verify cache configuration
./scripts/cache-config-check.sh

# Clear cache if needed
./scripts/cache-clear.sh
```

#### Infrastructure Issues

**High CPU Usage**

```bash
# Identify CPU-intensive processes
./scripts/cpu-analysis.sh

# Check auto-scaling
./scripts/scaling-status.sh

# Optimize application
./scripts/app-optimization.sh
```

**Memory Issues**

```bash
# Analyze memory usage
./scripts/memory-analysis.sh

# Check for memory leaks
./scripts/memory-leak-detection.sh

# Optimize memory usage
./scripts/memory-optimization.sh
```

**Disk Space Issues**

```bash
# Check disk usage
./scripts/disk-usage.sh

# Clean up old files
./scripts/disk-cleanup.sh

# Expand disk if needed
./scripts/disk-expansion.sh
```

### Log Analysis

```bash
# Application logs
tail -f /var/log/appointmentbooking/app.log

# Error logs
tail -f /var/log/appointmentbooking/error.log

# Access logs
tail -f /var/log/nginx/access.log

# Database logs
tail -f /var/log/postgresql/postgresql.log

# System logs
journalctl -u appointmentbooking -f
```

### Health Checks

```bash
# Comprehensive health check
./scripts/health-check.sh comprehensive

# Service-specific health checks
./scripts/health-check.sh database
./scripts/health-check.sh application
./scripts/health-check.sh load-balancer
./scripts/health-check.sh cache
```

## Emergency Procedures

### Incident Response

#### Severity Levels

- **Critical**: System down, data loss, security breach
- **High**: Major functionality impaired, performance severely degraded
- **Medium**: Minor functionality issues, performance degradation
- **Low**: Non-critical issues, cosmetic problems

#### Response Procedures

**Critical Incident**

```bash
# Immediate response
./scripts/emergency-response.sh critical

# Activate incident response team
./scripts/activate-incident-team.sh

# Begin emergency procedures
./scripts/emergency-procedures.sh
```

**System Recovery**

```bash
# Assess damage
./scripts/incident-assessment.sh

# Initiate recovery
./scripts/initiate-recovery.sh

# Monitor recovery progress
./scripts/monitor-recovery.sh
```

### Emergency Contacts

- **Primary**: DevOps Team Lead
- **Secondary**: Database Administrator
- **Escalation**: CTO
- **Security**: Security Team
- **Business**: Operations Manager

### Communication

```bash
# Send incident notification
./scripts/incident-notification.sh critical "System outage detected"

# Update status page
./scripts/update-status-page.sh "Investigating performance issues"

# Coordinate with stakeholders
./scripts/stakeholder-communication.sh
```

### Post-Incident

```bash
# Generate incident report
./scripts/generate-incident-report.sh

# Conduct post-mortem
./scripts/post-mortem.sh

# Update runbooks
./scripts/update-runbooks.sh
```

## Appendices

### A. Configuration Files

- Nginx configuration: `/etc/nginx/nginx.conf`
- Docker Compose: `docker-compose.prod.yml`
- Prometheus config: `monitoring/prometheus.yml`
- Database config: `database/postgresql.conf`

### B. Scripts Reference

- Health checks: `scripts/health-check.sh`
- Backup/restore: `scripts/disaster-recovery.sh`
- SSL management: `scripts/ssl-provisioning.sh`
- Environment management: `scripts/environment-management.sh`

### C. Monitoring Dashboards

- System Overview: Grafana Dashboard ID 1
- Application Performance: Dashboard ID 2
- Business Metrics: Dashboard ID 3
- Security Dashboard: Dashboard ID 4

### D. API Endpoints

- Health check: `GET /health`
- Metrics: `GET /api/metrics`
- Business metrics: `GET /api/business-metrics`
- Security metrics: `GET /api/security-metrics`

### E. Contact Information

- **Email**: <devops@appointmentbooking.co.za>
- **Slack**: #devops-incidents
- **On-call**: +27-XXX-XXX-XXXX
- **Documentation**: <https://docs.appointmentbooking.co.za>

---

## Version History

- **v1.0.0** (2025-12-31): Initial production infrastructure setup
- Complete database schema with optimized indexing
- SSL certificate provisioning with Let's Encrypt
- Environment and secrets management system
- Container orchestration with Docker Compose
- Comprehensive monitoring and alerting
- CI/CD pipeline with blue-green deployment
- Disaster recovery and backup procedures

## Support

For infrastructure support and questions:

1. Check this documentation first
2. Review system logs
3. Check monitoring dashboards
4. Contact the DevOps team
5. Follow emergency procedures if needed

Remember: Always test changes in staging before applying to production!
