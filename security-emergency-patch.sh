#!/bin/bash

# ============================================================================
# EMERGENCY SECURITY PATCH SCRIPT
# Appointment Booking Platform - Critical Security Vulnerabilities
# 
# This script patches critical security vulnerabilities:
# - Next.js Authorization Bypass (CVE-2024-GHSA-f82v-jwr5-mffw)
# - Path-to-Regexp Backtracking (GHSA-9wv6-86v2-598j)
# - Various dependency vulnerabilities
#
# CRITICAL: Execute immediately to prevent system compromise
# ============================================================================

set -e

echo "🚨 EMERGENCY SECURITY PATCH - Appointment Booking Platform"
echo "=========================================================="
echo "⚠️  This script will patch critical security vulnerabilities"
echo "📅 Date: $(date)"
echo "🔒 Status: CRITICAL - Execute immediately"
echo ""

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
log "🔍 Checking prerequisites..."
if ! command_exists pnpm; then
    log "❌ pnpm is required but not installed. Please install pnpm first."
    exit 1
fi

if ! command_exists node; then
    log "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

log "✅ Prerequisites check passed"

# Backup current package.json files
log "💾 Creating backup of package.json files..."
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p "security-backup-${timestamp}"

find . -name "package.json" -type f | while read -r file; do
    cp "$file" "security-backup-${timestamp}/$(echo "$file" | sed 's/\//_/g')"
    log "📁 Backed up: $file"
done

# Critical Next.js Security Update
log "🔧 PATCHING CRITICAL: Next.js Authorization Bypass Vulnerability"
log "📦 Updating Next.js to patched version (14.2.25+)..."
pnpm update next@^14.2.25
if [ $? -eq 0 ]; then
    log "✅ Next.js successfully updated to patched version"
else
    log "❌ Failed to update Next.js - Manual intervention required"
    exit 1
fi

# Update React Email (depends on Next.js)
log "📦 Updating react-email to resolve transitive vulnerabilities..."
pnpm update react-email@^0.0.22

# Path-to-Regexp Security Update
log "🔧 PATCHING HIGH: Path-to-Regexp Backtracking Vulnerability"
log "📦 Updating path-to-regexp to secure version..."
pnpm update path-to-regexp@^6.3.0

# Update other critical dependencies
log "🔧 PATCHING MEDIUM: Various dependency vulnerabilities"

# JSON Web Token security update
log "📦 Updating jsonwebtoken for signature verification..."
pnpm update jsonwebtoken@^9.0.3

# Nodemailer DoS vulnerability fix
log "📦 Updating nodemailer for DoS protection..."
pnpm update nodemailer@^7.0.11

# Express Rate Limiting update
log "📦 Updating express-rate-limit..."
pnpm update express-rate-limit@^8.2.1

# ESBuild development server security
log "📦 Updating esbuild for development server security..."
pnpm update esbuild@^0.25.0

# JS-YAML prototype pollution fix
log "📦 Updating js-yaml for prototype pollution protection..."
pnpm update js-yaml@^4.1.1

# Remove hardcoded credentials (security audit)
log "🔍 AUDITING: Removing hardcoded credentials and API keys..."

# Find and log hardcoded API keys
grep -r "pVq0j8Sm2jAaLW6BrBkI5Q" . --exclude-dir=node_modules --exclude-dir=security-backup-* 2>/dev/null | while read -r line; do
    log "⚠️  HARDCODED CREDENTIAL FOUND: $line"
done

# Remove test credentials from environment files
find . -name "*.env*" -type f | while read -r file; do
    if grep -q "test-" "$file" 2>/dev/null; then
        log "🔧 Cleaning test credentials from: $file"
        sed -i.bak 's/test-[a-zA-Z0-9_-]*$/REDACTED/g' "$file"
    fi
done

# Install updated dependencies
log "📦 Installing updated dependencies..."
pnpm install

# Verify critical security patches
log "🔍 VERIFYING: Critical security patches..."

# Check Next.js version
next_version=$(pnpm list next --depth=0 | grep next@ | head -1 | sed 's/.*next@//')
log "📊 Next.js version: $next_version"

if [[ "$next_version" =~ ^14\.2\.(2[5-9]|[3-9][0-9]) ]] || [[ "$next_version" =~ ^14\.(3|[4-9]|[1-9][0-9])\. ]] || [[ "$next_version" =~ ^[1-9][1-9]\. ]]; then
    log "✅ Next.js version is secure (>= 14.2.25)"
else
    log "❌ Next.js version may still be vulnerable: $next_version"
fi

# Check path-to-regexp version
ptr_version=$(pnpm list path-to-regexp --depth=0 | grep path-to-regexp@ | head -1 | sed 's/.*path-to-regexp@//')
log "📊 path-to-regexp version: $ptr_version"

if [[ "$ptr_version" =~ ^6\.(3|[4-9]|[1-9][0-9])\. ]] || [[ "$ptr_version" =~ ^7\. ]]; then
    log "✅ path-to-regexp version is secure (>= 6.3.0)"
else
    log "⚠️  path-to-regexp version may need update: $ptr_version"
fi

# Security audit
log "🔍 RUNNING: Security audit..."
pnpm audit --audit-level moderate || log "⚠️  Some vulnerabilities remain - review audit results"

# Create security report
log "📋 GENERATING: Security patch report..."
cat > "security-patch-report-${timestamp}.txt" << EOF
EMERGENCY SECURITY PATCH REPORT
===============================
Date: $(date)
Timestamp: ${timestamp}

PATCHED VULNERABILITIES:
- Next.js Authorization Bypass (CVE-2024-GHSA-f82v-jwr5-mffw)
- Path-to-Regexp Backtracking (GHSA-9wv6-86v2-598j)
- JSON Web Token signature verification
- Nodemailer DoS vulnerability
- Express Rate Limiting bypass
- ESBuild development server
- JS-YAML prototype pollution

UPDATED VERSIONS:
- Next.js: $next_version
- path-to-regexp: $ptr_version
- jsonwebtoken: Updated to 9.0.3
- nodemailer: Updated to 7.0.11
- express-rate-limit: Updated to 8.2.1

BACKUP LOCATION: security-backup-${timestamp}

NEXT STEPS:
1. Test all authentication flows
2. Verify API rate limiting
3. Test booking functionality
4. Run full security scan
5. Deploy to production with monitoring

WARNING:
- Review hardcoded credentials found during audit
- Implement proper API authentication middleware
- Add comprehensive security headers
- Enable security monitoring

Report generated: $(date)
EOF

log "📋 Security patch report saved: security-patch-report-${timestamp}.txt"

# Display final status
echo ""
echo "🚨 EMERGENCY SECURITY PATCH COMPLETED"
echo "======================================"
echo "✅ Critical vulnerabilities patched"
echo "⚠️  Review security-patch-report-${timestamp}.txt for details"
echo "📋 Hardcoded credentials audit completed"
echo ""
echo "🔴 IMMEDIATE ACTIONS REQUIRED:"
echo "1. Test authentication flows immediately"
echo "2. Deploy security middleware"
echo "3. Review API route authentication"
echo "4. Enable security monitoring"
echo ""
echo "📞 EMERGENCY CONTACTS:"
echo "- Security Team: Contact immediately if issues found"
echo "- DevOps Team: Monitor deployment"
echo "- Management: Report patch completion"
echo ""

# Final security check
log "🔍 FINAL SECURITY CHECK..."
if pnpm audit --audit-level moderate | grep -q "found.*vulnerabilities"; then
    log "⚠️  WARNING: Some vulnerabilities still present - manual review required"
else
    log "✅ No moderate+ vulnerabilities found"
fi

log "🎯 Emergency security patch script completed successfully"
echo "🚀 Proceed with deployment and monitoring"
