# Marketing Site Pages Project
resource "cloudflare_pages_project" "marketing" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-marketing"
  
  # Source configuration
  source {
    type     = "github"
    config {
      owner              = var.github_owner
      repo_name          = var.marketing_repo_name
      production_branch  = "main"
      preview_branch     = "develop"
      preview_excludes   = []
      preview_includes   = []
    }
  }
  
  # Build configuration
  build_config {
    build_command   = var.marketing_build_command
    output_dir      = var.marketing_output_dir
    root_dir        = var.marketing_root_dir
  }
  
  # Deployment settings
  deployment_config {
    environment = "production"
    compatibility_date = "2024-01-15"
    compatibility_flags = ["nodejs_compat"]
    
    environment_variables = merge(var.global_env_vars, var.marketing_env_vars)
    
    secrets = {
      CLERK_SECRET_KEY     = var.clerk_secret_key
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key
    }
  }
  
  # Preview deployment settings
  preview_config {
    environment = "preview"
    compatibility_date = "2024-01-15"
    compatibility_flags = ["nodejs_compat"]
    
    environment_variables = merge(var.global_env_vars, var.marketing_preview_env_vars)
    
    secrets = {
      CLERK_SECRET_KEY     = var.clerk_secret_key_preview
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key_preview
    }
  }
}

# Dashboard Pages Project
resource "cloudflare_pages_project" "dashboard" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-dashboard"
  
  # Source configuration
  source {
    type     = "github"
    config {
      owner              = var.github_owner
      repo_name          = var.dashboard_repo_name
      production_branch  = "main"
      preview_branch     = "develop"
    }
  }
  
  # Build configuration
  build_config {
    build_command   = var.dashboard_build_command
    output_dir      = var.dashboard_output_dir
    root_dir        = var.dashboard_root_dir
  }
  
  # Deployment settings
  deployment_config {
    environment = "production"
    compatibility_date = "2024-01-15"
    compatibility_flags = ["nodejs_compat"]
    
    environment_variables = merge(var.global_env_vars, var.dashboard_env_vars)
    
    secrets = {
      CLERK_SECRET_KEY     = var.clerk_secret_key
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key
      NEXT_PUBLIC_API_BASE_URL = var.api_base_url
    }
  }
}

# Booking Engine Pages Project
resource "cloudflare_pages_project" "booking" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-booking"
  
  # Source configuration
  source {
    type     = "github"
    config {
      owner              = var.github_owner
      repo_name          = var.booking_repo_name
      production_branch  = "main"
      preview_branch     = "develop"
    }
  }
  
  # Build configuration
  build_config {
    build_command   = var.booking_build_command
    output_dir      = var.booking_output_dir
    root_dir        = var.booking_root_dir
  }
  
  # Deployment settings
  deployment_config {
    environment = "production"
    compatibility_date = "2024-01-15"
    compatibility_flags = ["nodejs_compat"]
    
    environment_variables = merge(var.global_env_vars, var.booking_env_vars)
    
    secrets = {
      NEXT_PUBLIC_SUPABASE_URL = var.supabase_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY = var.supabase_anon_key
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = var.paystack_public_key
      PAYSTACK_SECRET_KEY = var.paystack_secret_key
    }
  }
}

# Custom Domains
resource "cloudflare_pages_domain" "marketing_domain" {
  pages_project = cloudflare_pages_project.marketing.name
  domain        = "${var.subdomain_prefixes["marketing"]}.${var.domain_name}"
}

resource "cloudflare_pages_domain" "dashboard_domain" {
  pages_project = cloudflare_pages_project.dashboard.name
  domain        = "${var.subdomain_prefixes["dashboard"]}.${var.domain_name}"
}

resource "cloudflare_pages_domain" "booking_domain" {
  pages_project = cloudflare_pages_project.booking.name
  domain        = "${var.subdomain_prefixes["booking"]}.${var.domain_name}"
}

# Domain redirects
resource "cloudflare_zone_settings_override" "main_settings" {
  zone_id = var.zone_id
  
  settings {
    always_use_https = "on"
    ssl              = "full"
    automatic_https_rewrites = "on"
    security_level   = "medium"
    browser_check    = "on"
    challenge_ttl    = 1800
    security_header {
      enabled = true
    }
  }
}

# Environment-specific variables
variable "github_owner" {
  description = "GitHub organization/owner name"
  type        = string
  default     = "appointment-booking"
}

variable "marketing_repo_name" {
  description = "Marketing site repository name"
  type        = string
  default     = "appointmentbooking-monorepo"
}

variable "dashboard_repo_name" {
  description = "Dashboard repository name"
  type        = string
  default     = "appointmentbooking-monorepo"
}

variable "booking_repo_name" {
  description = "Booking engine repository name"
  type        = string
  default     = "appointmentbooking-monorepo"
}

variable "marketing_build_command" {
  description = "Marketing site build command"
  type        = string
  default     = "pnpm run pages:build"
}

variable "marketing_output_dir" {
  description = "Marketing site output directory"
  type        = string
  default     = ".vercel/output/static"
}

variable "marketing_root_dir" {
  description = "Marketing site root directory"
  type        = string
  default     = "apps/marketing"
}

variable "dashboard_build_command" {
  description = "Dashboard build command"
  type        = string
  default     = "pnpm run pages:build"
}

variable "dashboard_output_dir" {
  description = "Dashboard output directory"
  type        = string
  default     = ".vercel/output/static"
}

variable "dashboard_root_dir" {
  description = "Dashboard root directory"
  type        = string
  default     = "apps/dashboard"
}

variable "booking_build_command" {
  description = "Booking engine build command"
  type        = string
  default     = "pnpm run pages:build"
}

variable "booking_output_dir" {
  description = "Booking engine output directory"
  type        = string
  default     = ".vercel/output/static"
}

variable "booking_root_dir" {
  description = "Booking engine root directory"
  type        = string
  default     = "apps/booking"
}

variable "global_env_vars" {
  description = "Global environment variables for all pages"
  type        = map(string)
  default = {
    NODE_ENV     = "production"
    NEXT_PUBLIC_APP_URL = "https://appointmentbooking.co.za"
  }
}

variable "marketing_env_vars" {
  description = "Marketing site environment variables"
  type        = map(string)
  default     = {}
}

variable "marketing_preview_env_vars" {
  description = "Marketing site preview environment variables"
  type        = map(string)
  default = {
    NODE_ENV = "preview"
  }
}

variable "dashboard_env_vars" {
  description = "Dashboard environment variables"
  type        = map(string)
  default     = {}
}

variable "dashboard_preview_env_vars" {
  description = "Dashboard preview environment variables"
  type        = map(string)
  default = {
    NODE_ENV = "preview"
  }
}

variable "booking_env_vars" {
  description = "Booking engine environment variables"
  type        = map(string)
  default     = {}
}

variable "booking_preview_env_vars" {
  description = "Booking engine preview environment variables"
  type        = map(string)
  default = {
    NODE_ENV = "preview"
  }
}

# Sensitive variables (to be set via environment or tfvars)
variable "clerk_secret_key" {
  description = "Clerk secret key for production"
  type        = string
  sensitive   = true
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key for production"
  type        = string
  sensitive   = true
}

variable "clerk_secret_key_preview" {
  description = "Clerk secret key for preview"
  type        = string
  sensitive   = true
}

variable "clerk_publishable_key_preview" {
  description = "Clerk publishable key for preview"
  type        = string
  sensitive   = true
}

variable "api_base_url" {
  description = "API base URL for dashboard"
  type        = string
  default     = "https://api.appointmentbooking.co.za"
}

variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "paystack_public_key" {
  description = "Paystack public key"
  type        = string
  sensitive   = true
}

variable "paystack_secret_key" {
  description = "Paystack secret key"
  type        = string
  sensitive   = true
}

output "marketing_project_id" {
  description = "Marketing site project ID"
  value       = cloudflare_pages_project.marketing.id
}

output "dashboard_project_id" {
  description = "Dashboard project ID"
  value       = cloudflare_pages_project.dashboard.id
}

output "booking_project_id" {
  description = "Booking engine project ID"
  value       = cloudflare_pages_project.booking.id
}

output "marketing_domain" {
  description = "Marketing site domain"
  value       = cloudflare_pages_domain.marketing_domain.domain
}

output "dashboard_domain" {
  description = "Dashboard domain"
  value       = cloudflare_pages_domain.dashboard_domain.domain
}

output "booking_domain" {
  description = "Booking engine domain"
  value       = cloudflare_pages_domain.booking_domain.domain
}