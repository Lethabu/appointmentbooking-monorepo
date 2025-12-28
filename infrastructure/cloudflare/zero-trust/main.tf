# Zero Trust Access Application Configuration

# Dashboard Application (Admin Access)
resource "cloudflare_zero_trust_access_application" "dashboard_app" {
  zone_id           = var.zone_id
  name              = "${var.project_name}-${var.environment}-dashboard"
  domain            = "${var.subdomain_prefixes["dashboard"]}.${var.domain_name}"
  type              = "self_hosted"
  session_duration  = "8h"
  cors_headers {
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_origins = [
      "https://${var.subdomain_prefixes["dashboard"]}.${var.domain_name}",
      "https://${var.domain_name}"
    ]
    allow_credentials = true
    allowed_headers   = ["*"]
  }
}

# API Application (Authenticated Access)
resource "cloudflare_zero_trust_access_application" "api_app" {
  zone_id           = var.zone_id
  name              = "${var.project_name}-${var.environment}-api"
  domain            = "${var.subdomain_prefixes["api"]}.${var.domain_name}"
  type              = "self_hosted"
  session_duration  = "24h"
  cors_headers {
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_origins = ["*"]
    allow_credentials = true
    allowed_headers   = ["*"]
  }
}

# Worker Application (Internal Access)
resource "cloudflare_zero_trust_access_application" "worker_app" {
  zone_id           = var.zone_id
  name              = "${var.project_name}-${var.environment}-worker"
  domain            = "${var.subdomain_prefixes["worker"]}.${var.domain_name}"
  type              = "self_hosted"
  session_duration  = "24h"
  cors_headers {
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_origins = ["*"]
    allow_credentials = true
    allowed_headers   = ["*"]
  }
}

# Identity Provider Configuration

# Google Identity Provider (for admin users)
resource "cloudflare_zero_trust_access_identity_provider" "google_idp" {
  count    = var.enable_google_idp ? 1 : 0
  name     = "Google SSO"
  type     = "google"
  
  google_config {
    client_id     = var.google_client_id
    client_secret = var.google_client_secret
    redirect_url  = "https://${var.zone_name}/cdn-cgi/access/callback"
  }
}

# GitHub Identity Provider (for developers)
resource "cloudflare_zero_trust_access_identity_provider" "github_idp" {
  count    = var.enable_github_idp ? 1 : 0
  name     = "GitHub SSO"
  type     = "github"
  
  github_config {
    client_id     = var.github_client_id
    client_secret = var.github_client_secret
    redirect_url  = "https://${var.zone_name}/cdn-cgi/access/callback"
    
    # Restrict to organization members
    allow_org_members = true
    organizations     = [var.github_organization]
  }
}

# Custom Identity Provider (Clerk integration)
resource "cloudflare_zero_trust_access_identity_provider" "clerk_idp" {
  count    = var.enable_clerk_idp ? 1 : 0
  name     = "Clerk Auth"
  type     = "oidc"
  
  oidc_config {
    issuer_url     = var.clerk_issuer_url
    client_id      = var.clerk_client_id
    client_secret  = var.clerk_client_secret
    redirect_url   = "https://${var.zone_name}/cdn-cgi/access/callback"
    claims         = ["email", "name", "picture"]
  }
}

# Access Policies

# Dashboard Admin Policy
resource "cloudflare_zero_trust_access_policy" "dashboard_admin_policy" {
  zone_id            = cloudflare_zero_trust_access_application.dashboard_app.id
  application_id     = cloudflare_zero_trust_access_application.dashboard_app.id
  name               = "Admin Access"
  precedence         = 1
  decision           = "allow"
  session_duration   = "8h"
  
  include {
    email_domain = [var.admin_email_domain]
  }
  
  require {
    email_domain = [var.admin_email_domain]
  }
}

# Dashboard Staff Policy
resource "cloudflare_zero_trust_access_policy" "dashboard_staff_policy" {
  zone_id            = cloudflare_zero_trust_access_application.dashboard_app.id
  application_id     = cloudflare_zero_trust_access_application.dashboard_app.id
  name               = "Staff Access"
  precedence         = 2
  decision           = "allow"
  session_duration   = "8h"
  
  include {
    email_domain = [var.staff_email_domain]
  }
  
  require {
    email_domain = [var.staff_email_domain]
  }
  
  exclude {
    login_method = ["google"]
  }
}

# API Service Policy (for applications)
resource "cloudflare_zero_trust_access_policy" "api_service_policy" {
  zone_id            = cloudflare_zero_trust_access_application.api_app.id
  application_id     = cloudflare_zero_trust_access_application.api_app.id
  name               = "Service Access"
  precedence         = 1
  decision           = "allow"
  session_duration   = "24h"
  
  include {
    service_token = var.api_service_tokens
  }
}

# Worker Internal Policy
resource "cloudflare_zero_trust_access_policy" "worker_internal_policy" {
  zone_id            = cloudflare_zero_trust_access_application.worker_app.id
  application_id     = cloudflare_zero_trust_access_application.worker_app.id
  name               = "Internal Access"
  precedence         = 1
  decision           = "allow"
  session_duration   = "24h"
  
  include {
    certificate     = [var.worker_certificate_cn]
  }
  
  require {
    certificate     = [var.worker_certificate_cn]
  }
}

# Security Rules and Filters

# Rate Limiting Rules
resource "cloudflare_rate_limit" "api_rate_limit" {
  zone_id = var.zone_id
  threshold = var.api_rate_limit_threshold
  period    = var.api_rate_limit_period
  match {
    request {
      schemes = ["HTTP", "HTTPS"]
      methods = ["GET", "POST", "PUT", "DELETE"]
      url     = "${var.subdomain_prefixes["api"]}.${var.domain_name}/*"
    }
  }
  
  action {
    mode    = "block"
    timeout = var.api_rate_limit_timeout
    response {
      content_type = "application/json"
      body         = jsonencode({
        error = "Rate limit exceeded"
        code  = "RATE_LIMIT_EXCEEDED"
      })
    }
  }
  
  disabled = var.disable_rate_limiting
}

# IP Allowlist for Admin Functions
resource "cloudflare_ip_list" "admin_ip_allowlist" {
  count    = var.enable_admin_ip_allowlist ? 1 : 0
  name     = "${var.project_name}-admin-allowlist"
  kind     = "ip"
  description = "Admin IP allowlist"
  
  item {
    ip = var.admin_allowed_ips
  }
}

# Custom Security Rules
resource "cloudflare_ruleset" "security_ruleset" {
  zone_id = var.zone_id
  name    = "${var.project_name}-security-rules"
  kind    = "zone"
  phase   = "http_request_firewall_custom"
  
  rules {
    action = "block"
    description = "Block suspicious user agents"
    
    expression = "(http.user_agent contains \"sqlmap\" or http.user_agent contains \"nikto\" or http.user_agent contains \"nmap\")"
    
    ref = "${var.project_name}-security-001"
  }
  
  rules {
    action = "challenge"
    description = "Challenge suspicious requests"
    
    expression = "(http.request.uri.path contains \"/wp-\" and http.request.uri.path contains \"admin\")"
    
    ref = "${var.project_name}-security-002"
  }
  
  rules {
    action = "block"
    description = "Block access to sensitive files"
    
    expression = "(http.request.uri.path matches \"\\\\.(env|log|sql|bak|backup)$\")"
    
    ref = "${var.project_name}-security-003"
  }
}

# Device Certification

# Device certificates for internal access
resource "cloudflare_zero_trust_device_certificates" "worker_certs" {
  count    = var.enable_device_certs ? 1 : 0
  name     = "${var.project_name}-worker-certs"
  description = "Worker device certificates"
  
  certificate {
    certificate_pem = var.worker_cert_pem
    private_key_pem = var.worker_cert_key
    not_after      = var.worker_cert_expiry
  }
}

# Browser Isolation
resource "cloudflare_zero_trust_gateway_browser_isolation" "enabled" {
  count    = var.enable_browser_isolation ? 1 : 0
  policy_id = cloudflare_zero_trust_gateway_policy.gateway_policy.id
}

# Gateway Policies

# DNS filtering policy
resource "cloudflare_zero_trust_gateway_policy" "dns_policy" {
  count    = var.enable_gateway ? 1 : 0
  name     = "${var.project_name}-dns-policy"
  action   = "block"
  precedence = 1
  enabled  = true
  
  selectors {
    dns_txt = ["security.txt"]
  }
  
  description = "Block malicious DNS requests"
}

# HTTP filtering policy
resource "cloudflare_zero_trust_gateway_policy" "http_policy" {
  count    = var.enable_gateway ? 1 : 0
  name     = "${var.project_name}-http-policy"
  action   = "allow"
  precedence = 2
  enabled  = true
  
  selectors {
    app = ["${var.subdomain_prefixes["dashboard"]}.${var.domain_name}", "${var.subdomain_prefixes["api"]}.${var.domain_name}"]
  }
  
  selectors {
    identity = ["${var.project_name}-${var.environment}-dashboard"]
  }
  
  description = "Allow access to approved applications"
}

# Variables for Zero Trust configuration
variable "enable_google_idp" {
  description = "Enable Google SSO identity provider"
  type        = bool
  default     = true
}

variable "enable_github_idp" {
  description = "Enable GitHub SSO identity provider"
  type        = bool
  default     = false
}

variable "enable_clerk_idp" {
  description = "Enable Clerk identity provider"
  type        = bool
  default     = true
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
}

variable "github_client_id" {
  description = "GitHub OAuth client ID"
  type        = string
  sensitive   = true
}

variable "github_client_secret" {
  description = "GitHub OAuth client secret"
  type        = string
  sensitive   = true
}

variable "github_organization" {
  description = "GitHub organization name"
  type        = string
  default     = ""
}

variable "clerk_issuer_url" {
  description = "Clerk OIDC issuer URL"
  type        = string
  sensitive   = true
}

variable "clerk_client_id" {
  description = "Clerk OIDC client ID"
  type        = string
  sensitive   = true
}

variable "clerk_client_secret" {
  description = "Clerk OIDC client secret"
  type        = string
  sensitive   = true
}

variable "admin_email_domain" {
  description = "Admin email domain"
  type        = string
  default     = "appointmentbooking.co.za"
}

variable "staff_email_domain" {
  description = "Staff email domain"
  type        = string
  default     = "appointmentbooking.co.za"
}

variable "api_service_tokens" {
  description = "API service tokens for access"
  type        = list(string)
  default     = []
  sensitive   = true
}

variable "worker_certificate_cn" {
  description = "Worker certificate common name"
  type        = string
  default     = "worker.appointmentbooking.co.za"
}

variable "enable_admin_ip_allowlist" {
  description = "Enable admin IP allowlist"
  type        = bool
  default     = false
}

variable "admin_allowed_ips" {
  description = "Admin allowed IP addresses"
  type        = list(string)
  default     = []
}

variable "api_rate_limit_threshold" {
  description = "API rate limit threshold"
  type        = number
  default     = 100
}

variable "api_rate_limit_period" {
  description = "API rate limit period in seconds"
  type        = number
  default     = 60
}

variable "api_rate_limit_timeout" {
  description = "API rate limit timeout in seconds"
  type        = number
  default     = 300
}

variable "disable_rate_limiting" {
  description = "Disable rate limiting (for testing)"
  type        = bool
  default     = false
}

variable "enable_device_certs" {
  description = "Enable device certificates"
  type        = bool
  default     = false
}

variable "worker_cert_pem" {
  description = "Worker certificate PEM"
  type        = string
  sensitive   = true
}

variable "worker_cert_key" {
  description = "Worker certificate private key"
  type        = string
  sensitive   = true
}

variable "worker_cert_expiry" {
  description = "Worker certificate expiry date"
  type        = string
  default     = "2025-12-31"
}

variable "enable_browser_isolation" {
  description = "Enable browser isolation"
  type        = bool
  default     = false
}

variable "enable_gateway" {
  description = "Enable Zero Trust Gateway"
  type        = bool
  default     = true
}

# Outputs
output "dashboard_app_id" {
  description = "Dashboard application ID"
  value       = cloudflare_zero_trust_access_application.dashboard_app.id
}

output "api_app_id" {
  description = "API application ID"
  value       = cloudflare_zero_trust_access_application.api_app.id
}

output "worker_app_id" {
  description = "Worker application ID"
  value       = cloudflare_zero_trust_access_application.worker_app.id
}

output "google_idp_id" {
  description = "Google identity provider ID"
  value       = cloudflare_zero_trust_access_identity_provider.google_idp[*].id
  count       = var.enable_google_idp ? 1 : 0
}

output "security_policies" {
  description = "Security policy configurations"
  value = {
    rate_limiting_enabled = !var.disable_rate_limiting
    admin_ip_allowlist    = var.enable_admin_ip_allowlist
    device_certificates   = var.enable_device_certs
    browser_isolation     = var.enable_browser_isolation
    gateway_enabled       = var.enable_gateway
  }
}