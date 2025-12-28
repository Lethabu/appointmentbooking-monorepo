resource "cloudflare_worker_script" "main" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-worker"
  content    = file("${path.module}/scripts/worker.js")
  
  # Compatibility settings
  compatibility_date = "2024-01-15"
  compatibility_flags = ["nodejs_compat"]
  
  # Bindings
  bindings {
    type = "d1"
    name = "DB"
    database_id = var.d1_database_id
  }
  
  bindings {
    type = "kv_namespace"
    name = "CACHE"
    namespace_id = cloudflare_worker_kv_namespace.cache.id
  }
  
  # Environment variables
  vars = merge(var.worker_env_vars, {
    NODE_ENV     = var.environment
    DATABASE_URL = "cloudflare-d1://${var.d1_database_id}"
    PROJECT_NAME = var.project_name
    ENV = var.environment
  })
}

resource "cloudflare_worker_kv_namespace" "cache" {
  account_id = var.account_id
  title      = "${var.project_name}-${var.environment}-cache"
}

resource "cloudflare_worker_route" "api_routes" {
  zone_id = var.zone_id
  pattern = "${var.subdomain_prefixes["api"]}.${var.domain_name}/*"
  script_name = cloudflare_worker_script.main.name
}

resource "cloudflare_worker_route" "worker_routes" {
  zone_id = var.zone_id
  pattern = "${var.subdomain_prefixes["worker"]}.${var.domain_name}/*"
  script_name = cloudflare_worker_script.main.name
}

resource "cloudflare_worker_route" "tenant_routes" {
  zone_id = var.zone_id
  pattern = "*.${var.domain_name}/book/*"
  script_name = cloudflare_worker_script.main.name
}

# Cron triggers for scheduled tasks
resource "cloudflare_worker_cron_trigger" "maintenance" {
  script_name = cloudflare_worker_script.main.name
  schedule    = "0 */6 * * *"  # Every 6 hours
}

resource "cloudflare_worker_cron_trigger" "cleanup" {
  script_name = cloudflare_worker_script.main.name
  schedule    = "0 0 * * 0"   # Weekly on Sunday
}

variable "zone_id" {
  description = "Cloudflare Zone ID for the domain"
  type        = string
}

variable "d1_database_id" {
  description = "D1 Database ID"
  type        = string
}

variable "worker_env_vars" {
  description = "Environment variables for the worker"
  type        = map(string)
  default     = {}
  sensitive   = true
}

output "worker_script_id" {
  description = "Worker script ID"
  value       = cloudflare_worker_script.main.id
}

output "worker_kv_namespace_id" {
  description = "Worker KV namespace ID"
  value       = cloudflare_worker_kv_namespace.cache.id
}

output "worker_routes" {
  description = "Worker routes configuration"
  value = {
    api_routes   = cloudflare_worker_route.api_routes.pattern
    worker_routes = cloudflare_worker_route.worker_routes.pattern
    tenant_routes = cloudflare_worker_route.tenant_routes.pattern
  }
}