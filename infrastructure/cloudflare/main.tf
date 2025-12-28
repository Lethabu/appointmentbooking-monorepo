terraform {
  required_version = ">= 1.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  backend "remote" {
    organization = "appointment-booking"
    workspaces {
      name = "instyle-infrastructure"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "project_name" {
  description = "Base project name"
  type        = string
  default     = "appointmentbooking"
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "appointmentbooking.co.za"
}

variable "subdomain_prefixes" {
  description = "Subdomain prefixes for different services"
  type = map(string)
  default = {
    marketing   = "www"
    dashboard   = "dashboard"
    booking     = "app"
    api         = "api"
    worker      = "worker"
  }
}

variable "enable_zero_trust" {
  description = "Enable Zero Trust security"
  type        = bool
  default     = true
}

variable "enable_analytics" {
  description = "Enable Cloudflare Analytics"
  type        = bool
  default     = true
}