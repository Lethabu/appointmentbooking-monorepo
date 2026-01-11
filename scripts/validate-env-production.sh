#!/bin/bash
# Environment Variables Validation Script for Cloudflare Pages Deployment
# Validates that all required production environment variables are set

set -e

echo "=========================================="
echo "Production Environment Variables Validation"
echo "=========================================="
echo ""

# Source the production environment file
ENV_FILE="${1:-apps/booking/.env.production}"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: Environment file not found: $ENV_FILE${NC}"
    exit 1
fi

echo "Validating: $ENV_FILE"
echo ""

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to validate a variable
validate_var() {
    local var_name=$1
    local var_value=$2
    local required=$3
    local sensitive=$4
    local description=$5
    
    if [ -z "$var_value" ]; then
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗ $var_name${NC} - Required: $description"
            FAILED=$((FAILED + 1))
        else
            echo -e "${YELLOW}⚠ $var_name${NC} - Optional: $description"
            WARNINGS=$((WARNINGS + 1))
        fi
    elif [[ "$var_value" == *"your-"* ]] || [[ "$var_value" == *"placeholder"* ]] || [[ "$var_value" == *"example"* ]]; then
        echo -e "${RED}✗ $var_name${NC} - Placeholder value detected"
        FAILED=$((FAILED + 1))
    elif [ "$sensitive" = "true" ]; then
        echo -e "${GREEN}✓ $var_name${NC} - [HIDDEN] $description"
        PASSED=$((PASSED + 1))
    else
        echo -e "${GREEN}✓ $var_name${NC} - $description (value: $var_value)"
        PASSED=$((PASSED + 1))
    fi
}

# Load environment variables
set -a
source "$ENV_FILE"
set +a

echo "--- Critical Security Variables ---"
echo ""

# Critical security variables
validate_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "true" "true" "NextAuth session encryption"
validate_var "JWT_SECRET" "$JWT_SECRET" "true" "true" "JWT token signing"
validate_var "DATABASE_URL" "$DATABASE_URL" "true" "true" "Production database connection"
validate_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY" "true" "true" "Supabase admin access"

echo ""
echo "--- Authentication Variables ---"
echo ""

validate_var "NEXTAUTH_URL" "$NEXTAUTH_URL" "true" "false" "NextAuth callback URL"
validate_var "CRON_SECRET" "$CRON_SECRET" "true" "true" "Cron job authentication"

echo ""
echo "--- OAuth Providers ---"
echo ""

validate_var "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID" "false" "false" "Google OAuth client"
validate_var "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET" "false" "true" "Google OAuth secret"
validate_var "MICROSOFT_CLIENT_ID" "$MICROSOFT_CLIENT_ID" "false" "false" "Microsoft OAuth client"
validate_var "MICROSOFT_CLIENT_SECRET" "$MICROSOFT_CLIENT_SECRET" "false" "true" "Microsoft OAuth secret"

echo ""
echo "--- External API Keys ---"
echo ""

validate_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "false" "true" "Google Gemini API key"
validate_var "AISENSY_API_KEY" "$AISENSY_API_KEY" "false" "true" "WhatsApp API key"
validate_var "AISENSY_WEBHOOK_SECRET" "$AISENSY_WEBHOOK_SECRET" "false" "true" "WhatsApp webhook secret"

echo ""
echo "--- Payment Processing ---"
echo ""

validate_var "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY" "$NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY" "false" "false" "Paystack public key"
validate_var "PAYSTACK_SECRET_KEY" "$PAYSTACK_SECRET_KEY" "false" "true" "Paystack secret key"
validate_var "PAYSTACK_WEBHOOK_SECRET" "$PAYSTACK_WEBHOOK_SECRET" "false" "true" "Paystack webhook secret"

echo ""
echo "--- Supabase Configuration ---"
echo ""

validate_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL" "true" "false" "Supabase project URL"
validate_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" "true" "false" "Supabase anonymous key"

echo ""
echo "--- Application Configuration ---"
echo ""

validate_var "NODE_ENV" "$NODE_ENV" "true" "false" "Environment mode"
validate_var "NEXT_PUBLIC_APP_URL" "$NEXT_PUBLIC_APP_URL" "true" "false" "Public application URL"
validate_var "NEXT_PUBLIC_TENANT_ID" "$NEXT_PUBLIC_TENANT_ID" "true" "false" "Multi-tenant identifier"

echo ""
echo "--- Monitoring & Alerting ---"
echo ""

validate_var "NEXT_PUBLIC_SENTRY_DSN" "$NEXT_PUBLIC_SENTRY_DSN" "false" "false" "Sentry error tracking"
validate_var "SENTRY_AUTH_TOKEN" "$SENTRY_AUTH_TOKEN" "false" "true" "Sentry authentication"
validate_var "HEALTH_CHECK_SECRET" "$HEALTH_CHECK_SECRET" "false" "true" "Health check authentication"
validate_var "MONITORING_WEBHOOK_URL" "$MONITORING_WEBHOOK_URL" "false" "false" "Monitoring alerts webhook"

echo ""
echo "--- Email Configuration ---"
echo ""

validate_var "SMTP_HOST" "$SMTP_HOST" "false" "false" "SMTP server"
validate_var "SMTP_USER" "$SMTP_USER" "false" "true" "SMTP authentication"
validate_var "SMTP_PASS" "$SMTP_PASS" "false" "true" "SMTP password"
validate_var "EMAIL_FROM" "$EMAIL_FROM" "false" "false" "From email address"

echo ""
echo "--- Compliance & Security ---"
echo ""

validate_var "PCI_COMPLIANCE_ENABLED" "$PCI_COMPLIANCE_ENABLED" "true" "false" "PCI DSS mode"
validate_var "GDPR_COMPLIANCE_ENABLED" "$GDPR_COMPLIANCE_ENABLED" "true" "false" "GDPR mode"
validate_var "POPIA_COMPLIANCE_ENABLED" "$POPIA_COMPLIANCE_ENABLED" "true" "false" "POPIA mode"
validate_var "RATE_LIMIT_ENABLED" "$RATE_LIMIT_ENABLED" "true" "false" "Rate limiting"
validate_var "CSP_NONCE_SECRET" "$CSP_NONCE_SECRET" "false" "true" "CSP nonce generation"
validate_var "SECURE_COOKIE_SECRET" "$SECURE_COOKIE_SECRET" "false" "true" "Cookie encryption"

echo ""
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Validation FAILED${NC}"
    echo ""
    echo "Missing or placeholder values must be resolved before deployment."
    echo ""
    echo "To retrieve secrets from HashiCorp Vault:"
    echo "  ./scripts/vault-secrets-retrieval.sh"
    echo ""
    echo "To set secrets in Cloudflare Pages:"
    echo "  npx wrangler pages secret put VARIABLE_NAME --project-name=appointment-booking-coza"
    exit 1
else
    echo -e "${GREEN}✅ Validation PASSED${NC}"
    echo ""
    echo "All required environment variables are properly configured."
    echo "Ready for Cloudflare Pages deployment."
    exit 0
fi
