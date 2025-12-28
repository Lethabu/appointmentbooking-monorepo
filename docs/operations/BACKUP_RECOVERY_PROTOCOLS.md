# Backup & Recovery Protocols

## Overview

This document establishes comprehensive backup and recovery procedures for the Appointment Booking Monorepo to ensure business continuity and prevent data loss during version control system failures.

## Backup Strategy

### Repository Backups

#### Primary Backup (Local)

```bash
# Full repository backup
git clone --mirror https://github.com/Lethabu/appointmentbooking-monorepo.git backup-repo.git

# Compressed backup
tar -czf appointmentbooking-monorepo-$(date +%Y%m%d).tar.gz backup-repo.git

# Upload to secure storage
aws s3 cp appointmentbooking-monorepo-$(date +%Y%m%d).tar.gz s3://company-backups/git-repos/
```

#### Secondary Backup (Remote)

- **GitHub Enterprise Backup**: Automatic via GitHub
- **GitLab Mirror**: Secondary repository mirror
- **Bitbucket Backup**: Tertiary backup location

#### Backup Schedule

- **Daily**: Incremental backup of repository changes
- **Weekly**: Full repository backup
- **Monthly**: Archive backup with documentation
- **Quarterly**: Complete disaster recovery test

### Database Backups

#### Application Database

```bash
# SQLite backup (D1/Cloudflare)
sqlite3 /path/to/database.db ".backup backup-$(date +%Y%m%d).db"

# Upload to secure storage
gcloud storage cp backup-$(date +%Y%m%d).db gs://company-backups/databases/
```

#### Authentication Data

```bash
# NextAuth session data backup
kubectl exec deployment/booking-app -- mongodump --db auth_db --out /backup/$(date +%Y%m%d)/
```

### Configuration Backups

#### Environment Variables

```bash
# Backup environment configurations
cp -r apps/booking/.env* backup/env-configs/$(date +%Y%m%d)/
cp -r apps/dashboard/.env* backup/env-configs/$(date +%Y%m%d)/
cp -r packages/*/.env* backup/env-configs/$(date +%Y%m%d)/
```

#### Infrastructure Configuration

```bash
# Backup infrastructure as code
cp -r infrastructure/ backup/infrastructure/$(date +%Y%m%d)/
cp -r .github/workflows/ backup/workflows/$(date +%Y%m%d)/
```

## Recovery Procedures

### Repository Recovery

#### Scenario 1: Corrupted Local Repository

```bash
# 1. Stop all development activities
# 2. Verify backup integrity
git fsck --full --no-progress

# 3. Clone fresh repository from remote
git clone https://github.com/Lethabu/appointmentbooking-monorepo.git fresh-repo

# 4. Restore from backup if needed
cd fresh-repo
git remote add backup file:///path/to/backup-repo.git
git fetch backup

# 5. Verify repository integrity
git gc --aggressive
git repack -a -d -f
```

#### Scenario 2: Accidental Force Push

```bash
# 1. Identify last known good commit
git reflog

# 2. Create recovery branch
git checkout -b recovery-branch <last-good-commit-hash>

# 3. Force push recovery branch
git push origin recovery-branch:main --force

# 4. Notify team of recovery
```

#### Scenario 3: Branch Protection Failure

```bash
# 1. Temporarily disable branch protection (admin only)
gh api repos/{owner}/{repo}/branches/main/protection \
  --method DELETE

# 2. Fix the issue
# ... make necessary changes ...

# 3. Re-enable branch protection
# ... use branch protection policy procedures ...

# 4. Document incident
```

### Database Recovery

#### Critical Data Recovery

```bash
# 1. Stop application services
kubectl scale deployment booking-app --replicas=0

# 2. Restore from latest backup
gcloud storage cp gs://company-backups/databases/latest.db /tmp/restored.db
sqlite3 /path/to/database.db ".restore /tmp/restored.db"

# 3. Verify data integrity
sqlite3 /path/to/database.db "PRAGMA integrity_check;"

# 4. Restart services
kubectl scale deployment booking-app --replicas=3
```

#### Point-in-Time Recovery

```bash
# 1. Identify target timestamp
# 2. Restore to temporary database
sqlite3 /tmp/temp.db ".backup backup-$(date +%Y%m%d_%H%M).db"

# 3. Apply transaction logs if available
sqlite3 /tmp/temp.db ".read recovery-log.sql"

# 4. Migrate data to production
```

## Emergency Response Procedures

### Level 1: Minor Issues (< 1 hour impact)

- **Examples**: Small merge conflicts, minor configuration changes
- **Response**: Standard Git workflow resolution
- **Recovery Time**: < 30 minutes

### Level 2: Moderate Issues (1-4 hours impact)

- **Examples**: Branch protection misconfiguration, CI/CD failures
- **Response**: Escalate to senior developers
- **Recovery Time**: 1-4 hours

### Level 3: Critical Issues (4+ hours impact)

- **Examples**: Data loss, security breach, complete repository corruption
- **Response**: Full incident response team activation
- **Recovery Time**: 4-24 hours

### Emergency Contacts

- **Technical Lead**: +27-XX-XXX-XXXX
- **DevOps Team**: <devops@company.com>
- **Security Team**: <security@company.com>
- **Management**: <management@company.com>

## Monitoring & Alerts

### Repository Health Monitoring

```bash
#!/bin/bash
# repository-health-check.sh

# Check repository integrity
git fsck --full --no-progress > /tmp/git-fsck.log
if [ $? -ne 0 ]; then
    echo "CRITICAL: Repository integrity check failed"
    send-alert "Repository corruption detected"
fi

# Check branch protection status
gh api repos/{owner}/{repo}/branches/main/protection > /tmp/protection-status.json
if [ $? -ne 0 ]; then
    echo "WARNING: Branch protection may be disabled"
    send-alert "Branch protection status unknown"
fi

# Check recent commit activity
recent_commits=$(git log --since="1 day ago" --oneline | wc -l)
if [ $recent_commits -eq 0 ]; then
    echo "INFO: No commits in last 24 hours"
fi
```

### Automated Backup Verification

```bash
#!/bin/bash
# backup-verification.sh

backup_file="appointmentbooking-monorepo-$(date +%Y%m%d).tar.gz"

# Verify backup exists and is not corrupted
if [ ! -f "$backup_file" ]; then
    send-alert "Daily backup not found"
    exit 1
fi

# Test backup integrity
tar -tzf "$backup_file" > /dev/null
if [ $? -ne 0 ]; then
    send-alert "Backup file is corrupted"
    exit 1
fi

# Upload verification
gcloud storage cp "$backup_file" gs://company-backups/git-repos/
if [ $? -ne 0 ]; then
    send-alert "Backup upload failed"
    exit 1
fi

echo "Backup verification completed successfully"
```

## Disaster Recovery Testing

### Monthly DR Tests

```bash
#!/bin/bash
# disaster-recovery-test.sh

echo "Starting disaster recovery test..."

# 1. Simulate complete repository loss
rm -rf /tmp/test-recovery-repo

# 2. Restore from backup
git clone https://github.com/Lethabu/appointmentbooking-monorepo.git /tmp/test-recovery-repo

# 3. Verify critical files exist
critical_files=(
    "README.md"
    "package.json"
    "pnpm-lock.yaml"
    "apps/booking/package.json"
    "apps/dashboard/package.json"
    "packages/auth/package.json"
)

for file in "${critical_files[@]}"; do
    if [ ! -f "/tmp/test-recovery-repo/$file" ]; then
        echo "CRITICAL: Missing file $file"
        send-alert "DR test failed: missing $file"
        exit 1
    fi
done

# 4. Test build process
cd /tmp/test-recovery-repo
pnpm install --frozen-lockfile
pnpm run build

if [ $? -ne 0 ]; then
    echo "WARNING: Build failed in recovery test"
    send-alert "DR test warning: build failed"
else
    echo "SUCCESS: Disaster recovery test completed"
fi

# 5. Cleanup
rm -rf /tmp/test-recovery-repo
```

### Quarterly Full DR Simulation

- Complete repository reconstruction
- Database recovery from backups
- Infrastructure rebuild from IaC
- Full team coordination test
- Documentation update

## Security Considerations

### Backup Encryption

```bash
# Encrypt sensitive backups
gpg --symmetric --cipher-algo AES256 appointmentbooking-monorepo-backup.tar.gz

# Secure key storage
aws kms encrypt --key-id alias/backup-encryption \
  --plaintext fileb://appointmentbooking-monorepo-backup.tar.gz \
  --output text --query CiphertextBlob | base64 --decode > encrypted-backup.tar.gz.enc
```

### Access Control

- Backup encryption keys restricted to authorized personnel
- Multi-factor authentication required for backup access
- Regular access audit and key rotation
- Immutable backup storage for critical data

### Compliance Requirements

- GDPR compliance for customer data backups
- SOC 2 Type II compliance for audit trails
- ISO 27001 alignment for security controls
- Regular penetration testing of backup systems

## Recovery Time Objectives (RTO) & Recovery Point Objectives (RPO)

### Critical Systems

- **RTO**: 1 hour (Maximum acceptable downtime)
- **RPO**: 15 minutes (Maximum acceptable data loss)

### Standard Systems

- **RTO**: 4 hours
- **RPO**: 1 hour

### Non-Critical Systems

- **RTO**: 24 hours
- **RPO**: 24 hours

## Documentation & Training

### Required Documentation

- [ ] Recovery procedures updated monthly
- [ ] Contact information verified quarterly
- [ ] Backup verification logs maintained
- [ ] DR test results documented
- [ ] Security protocols reviewed annually

### Team Training

- Monthly DR drill participation
- Annual security awareness training
- Version control best practices certification
- Incident response procedure familiarization

## Continuous Improvement

### Metrics Tracking

- Recovery time actual vs. target
- Backup success/failure rates
- DR test pass/fail rates
- Data loss incidents
- Security incident frequency

### Process Optimization

- Quarterly review of procedures
- Technology stack evaluation
- Cost-benefit analysis of backup solutions
- Industry best practices adoption

---

**Document Owner:** DevOps Team Lead  
**Last Updated:** December 2025  
**Next Review:** March 2026  
**Emergency Contact:** <devops@company.com>
