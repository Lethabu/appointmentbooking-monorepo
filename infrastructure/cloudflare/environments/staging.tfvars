# Staging Environment Configuration
# Copy this file to .tfvars in your local directory or use terraform.tfvars.staging

# =============================================
# BASIC CONFIGURATION
# =============================================

environment     = "staging"
project_name    = "appointmentbooking"
domain_name     = "staging.appointmentbooking.co.za"
account_id      = "your_staging_account_id"

# =============================================
# WORKERS CONFIGURATION
# =============================================

worker_env_vars = {
  NODE_ENV               = "staging"
  DATABASE_URL           = "cloudflare-d1://appointmentbooking-staging-db"
  OPENAI_API_KEY         = "your_staging_openai_api_key"
  PAYSTACK_SECRET_KEY    = "your_staging_paystack_secret_key"
  SUPERSAAS_API_KEY      = "your_staging_supersaas_api_key"
  SUPERSAAS_ACCOUNT      = "your_staging_supersaas_account"
  SUPABASE_SERVICE_ROLE_KEY = "your_staging_supabase_service_role_key"
}

# =============================================
# PAGES CONFIGURATION
# =============================================

# Clerk Configuration (Staging)
clerk_secret_key          = "your_staging_clerk_secret_key"
clerk_publishable_key     = "your_staging_clerk_publishable_key"
clerk_secret_key_preview  = "your_staging_clerk_secret_key_preview"
clerk_publishable_key_preview = "your_staging_clerk_publishable_key_preview"

# Supabase Configuration (Staging)
supabase_url              = "your_staging_supabase_url"
supabase_anon_key         = "your_staging_supabase_anon_key"

# Payment Configuration (Staging)
paystack_public_key       = "your_staging_paystack_public_key"
paystack_secret_key       = "your_staging_paystack_secret_key"

# =============================================
# ZERO TRUST CONFIGURATION
# =============================================

# Identity Providers
enable_google_idp         = true
enable_github_idp         = true
enable_clerk_idp          = true

google_client_id          = "your_staging_google_client_id"
google_client_secret      = "your_staging_google_client_secret"

github_client_id          = "your_staging_github_client_id"
github_client_secret      = "your_staging_github_client_secret"

clerk_issuer_url          = "your_staging_clerk_issuer_url"
clerk_client_id           = "your_staging_clerk_client_id"
clerk_client_secret       = "your_staging_clerk_client_secret"

# Access Policies
admin_email_domain        = "staging.appointmentbooking.co.za"
staff_email_domain        = "staging.appointmentbooking.co.za"
api_service_tokens        = ["your_staging_service_token_1"]

# Security Settings (More relaxed for staging)
enable_admin_ip_allowlist = false
admin_allowed_ips         = []

api_rate_limit_threshold  = 2000  # Higher limits for testing
api_rate_limit_period     = 60
api_rate_limit_timeout    = 300

enable_device_certs       = false
enable_browser_isolation  = false
enable_gateway            = true

# =============================================
# R2 STORAGE CONFIGURATION
# =============================================

enable_uploads_bucket     = true
enable_backups_bucket     = true
enable_static_assets      = true
enable_product_images     = true

backup_retention_days     = 30  # Shorter retention for staging

# =============================================
# MONITORING CONFIGURATION
# =============================================

enable_analytics          = true
enable_analytics_engine   = false
security_level           = "medium"  # Lower security for testing

enable_alerts            = true
enable_security_alerts   = true
enable_traffic_alerts    = false    # Disable traffic alerts for staging
enable_ssl_alerts        = true

enable_logpush           = false    # Disabled for staging
enable_gdpr_compliance   = false    # Disabled for staging
enable_custom_dashboard  = false    # Disabled for staging

# Alert Configuration (Limited for staging)
alert_email_addresses    = ["dev@appointmentbooking.co.za"]
security_email_addresses = ["dev@appointmentbooking.co.za"]

# Optional integrations (staging/test values)
slack_webhook_url        = ""
security_slack_webhook_url = ""
pagerduty_integration_key = ""

# Traffic thresholds (higher for testing)
traffic_threshold_requests    = 50000
traffic_threshold_bandwidth   = 500
ssl_expiry_threshold_days     = 7   # Shorter warning for staging

# Logpush destination (if enabled)
logpush_destination     = ""

# =============================================
# SECURITY CONFIGURATION
# =============================================

# SSL/TLS Settings (Less strict for staging)
ssl_mode               = "full"
enable_hsts           = false
hsts_max_age          = 86400   # 1 day for staging
hsts_include_subdomains = false
hsts_preload          = false

# Rate Limiting (More permissive for testing)
disable_rate_limiting          = false
disable_login_rate_limiting    = false

login_rate_limit_threshold  = 10  # Higher limits for testing
login_rate_limit_period     = 300
login_rate_limit_timeout    = 600  # Longer timeout for testing

# DDoS Protection (Lower thresholds)
ddos_threat_score_threshold = 50  # Higher threshold for staging
ddos_block_threshold        = 80  # Higher threshold for staging

# Bot Management (Less strict)
enable_bot_management   = true
bot_fight_mode         = "static"  # Less strict mode

# IP and Geo Blocking (Disabled for staging)
enable_ip_blocklist     = false
blocked_ips            = []

enable_geo_blocking     = false
restricted_countries   = []

# Compliance (Disabled for staging)
enable_security_audit   = false
security_audit_destination = ""

# =============================================
# DATABASE CONFIGURATION
# =============================================

# D1 Database Settings (Lower resources for staging)
enable_replicas         = false  # No replicas for staging
query_timeout          = 60000   # Longer timeout for testing
max_query_duration     = 120000
memory_limit          = "512MiB"  # Lower memory limit

create_analytics_db    = false
enable_monitoring      = true

# Backup Settings (More frequent for staging)
enable_daily_backups   = true
enable_weekly_backups  = true
backup_retention_days  = 7   # Shorter retention
backup_retention_weeks = 4   # Shorter retention

# =============================================
# CI/CD CONFIGURATION
# =============================================

# GitHub Configuration
github_owner           = "your_github_username_or_org"
marketing_repo_name    = "appointmentbooking-monorepo"
dashboard_repo_name    = "appointmentbooking-monorepo"
booking_repo_name      = "appointmentbooking-monorepo"

# Build Commands (Same as production)
marketing_build_command   = "pnpm run pages:build"
marketing_output_dir     = ".vercel/output/static"
marketing_root_dir       = "apps/marketing"

dashboard_build_command  = "pnpm run pages:build"
dashboard_output_dir     = ".vercel/output/static"
dashboard_root_dir       = "apps/dashboard"

booking_build_command    = "pnpm run pages:build"
booking_output_dir       = ".vercel/output/static"
booking_root_dir         = "apps/booking"

# API Configuration
api_base_url            = "https://api.staging.appointmentbooking.co.za"

# =============================================
# ADVANCED FEATURES
# =============================================

# Zone ID (for existing domain)
zone_id                = "your_staging_cloudflare_zone_id"

# Additional subdomain prefixes
subdomain_prefixes = {
  marketing   = "www"
  dashboard   = "dashboard"
  booking     = "app"
  api         = "api"
  worker      = "worker"
}

# CDN subdomain prefixes
cdn_subdomain_prefixes = {
  storage  = "storage"
  assets   = "assets"
  images   = "images"
  cdn      = "cdn"
}

# =============================================
# DEVELOPMENT SPECIFIC SETTINGS
# =============================================

# Enable debug features for staging
enable_debug_mode      = true
enable_test_mode       = true

# Extended logging for debugging
enable_verbose_logging = true
log_level             = "debug"

# Test data settings
enable_test_data       = true
seed_test_data        = true