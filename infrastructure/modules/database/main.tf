terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

resource "cloudflare_d1_database" "main" {
  account_id = var.account_id
  name       = var.database_name
}

variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "database_name" {
  description = "Name of the D1 database"
  type        = string
}

output "id" {
  value = cloudflare_d1_database.main.id
}
