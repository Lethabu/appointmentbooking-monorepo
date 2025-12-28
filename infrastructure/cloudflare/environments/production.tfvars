# Production Environment Configuration
# Copy this file to .tfvars in your local directory or use terraform.tfvars.production

# =============================================
# BASIC CONFIGURATION
# =============================================

environment     = "production"
project_name    = "appointmentbooking"
domain_name     = "appointmentbooking.co.za"
account_id      = "your_production_account_id"

# =============================================
# WORKERS CONFIGURATION
# =============================================

worker_env_vars = {
  NODE_ENV               = "production"
  DATABASE_URL           = "cloudflare-d1://appointmentbooking-production-db"
  OPENAI_API_KEY         = "your_openai_api_key"
  PAYSTACK_SECRET_KEY    = "your_paystack_secret_key"
  SUPERSAAS_API_KEY      = "your_supersaas_api_key"
  SUPERSAAS_ACCOUNT      = "your_supersaas_account"
  SUPABASE_SERVICE_ROLE_KEY = "your_supabase_service_role_key"
}

# =============================================
# PAGES CONFIGURATION
# =============================================

# Clerk Configuration
clerk_secret_key          = "your_clerk_secret_key"
clerk_publishable_key     = "your_clerk_publishable_key"
clerk_secret_key_preview  = "your_clerk_secret_key_preview"
clerk_publishable_key_preview = "your_clerk_publishable_key_preview"

# Supabase Configuration
supabase_url              = "your_supabase_url"
supabase_anon_key         = "your_supabase_anon_key"

# Payment Configuration
paystack_public_key       = "your_paystack_public_key"
paystack_secret_key       = "your_paystack_secret_key"

# =============================================
# ZERO TRUST CONFIGURATION
# =============================================

# Identity Providers
enable_google_idp         = true
enable_github_idp         = false
enable_clerk_idp          = true

google_client_id          = "your_google_client_id"
google_client_secret      = "your_google_client_secret"

github_client_id          = "your_github_client_id"
github_client_secret      = "your_github_client_secret"

clerk_issuer_url          = "your_clerk_issuer_url"
clerk_client_id           = "your_clerk_client_id"
clerk_client_secret       = "your_clerk_client_secret"

# Access Policies
admin_email_domain        = "appointmentbooking.co.za"
staff_email_domain        = "appointmentbooking.co.za"
api_service_tokens        = ["your_service_token_1", "your_service_token_2"]

# Security Settings
enable_admin_ip_allowlist = false
admin_allowed_ips         = []

api_rate_limit_threshold  = 1000
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

backup_retention_days     = 90

# =============================================
# MONITORING CONFIGURATION
# =============================================

enable_analytics          = true
enable_analytics_engine   = false
security_level           = "high"

enable_alerts            = true
enable_security_alerts   = true
enable_traffic_alerts    = true
enable_ssl_alerts        = true

enable_logpush           = false
enable_gdpr_compliance   = true
enable_custom_dashboard  = true

# Alert Configuration
alert_email_addresses    = ["admin@appointmentbooking.co.za", "tech@appointmentbooking.co.za"]
security_email_addresses = ["security@appointmentbooking.co.za"]

# Optional integrations
slack_webhook_url        = "your_slack_webhook_url"
security_slack_webhook_url = "your_security_slack_webhook_url"
pagerduty_integration_key = "your_pagerduty_key"

# Traffic thresholds
traffic_threshold_requests    = 100000
traffic_threshold_bandwidth   = 1000
ssl_expiry_threshold_days     = 30

# Logpush destination (if enabled)
logpush_destination     = "your_s3_bucket_or_gcs_endpoint"

# =============================================
# SECURITY CONFIGURATION
# =============================================

# SSL/TLS Settings
ssl_mode               = "strict"
enable_hsts           = true
hsts_max_age          = 31536000  # 1 year
hsts_include_subdomains = true
hsts_preload          = false

# Rate Limiting
disable_rate_limiting          = false
disable_login_rate_limiting    = false

login_rate_limit_threshold  = 5
login_rate_limit_period     = 300
login_rate_limit_timeout    = 1800

# DDoS Protection
ddos_threat_score_threshold = 30
ddos_block_threshold        = 60

# Bot Management
enable_bot_management   = true
bot_fight_mode         = "dynamic"

# IP and Geo Blocking
enable_ip_blocklist     = false
blocked_ips            = []

enable_geo_blocking     = false
restricted_countries   = []

# Compliance
enable_security_audit   = true
security_audit_destination = "your_security_audit_destination"

# =============================================
# DATABASE CONFIGURATION
# =============================================

# D1 Database Settings
enable_replicas         = true
query_timeout          = 30000
max_query_duration     = 60000
memory_limit          = "2GiB"

create_analytics_db    = false
enable_monitoring      = true

# Backup Settings
enable_daily_backups   = true
enable_weekly_backups  = true
backup_retention_days  = 30
backup_retention_weeks = 52

# =============================================
# CI/CD CONFIGURATION
# =============================================

# GitHub Configuration
github_owner           = "your_github_username_or_org"
marketing_repo_name    = "appointmentbooking-monorepo"
dashboard_repo_name    = "appointmentbooking-monorepo"
booking_repo_name      = "appointmentbooking-monorepo"

# Build Commands
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
api_base_url            = "https://api.appointmentbooking.co.za"

# =============================================
# ADVANCED FEATURES
# =============================================

# Zone ID (for existing domain)
zone_id                = "your_cloudflare_zone_id"

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