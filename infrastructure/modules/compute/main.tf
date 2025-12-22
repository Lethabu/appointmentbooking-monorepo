terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

resource "cloudflare_pages_project" "app" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = "main"
}

variable "account_id" {
  type = string
}

variable "project_name" {
  type = string
}
