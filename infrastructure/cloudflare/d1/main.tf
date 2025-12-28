# Main D1 Database
resource "cloudflare_d1_database" "main" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-db"
  
  # Enable point-in-time recovery
  enable_recovery = true
  
  # Enable read replicas for performance
  enable_replicas = var.enable_replicas
  
  # Database configuration
  configuration {
    enable_writes = true
    enable_reads  = true
    
    # Query performance settings
    query_timeout = var.query_timeout
    max_query_duration = var.max_query_duration
    
    # Memory limits
    memory_limit = var.memory_limit
  }
}

# Analytics Database (optional)
resource "cloudflare_d1_database" "analytics" {
  count  = var.create_analytics_db ? 1 : 0
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-analytics"
  
  configuration {
    enable_writes = true
    enable_reads  = true
    memory_limit  = "512MiB"
  }
}

# Database Migrations using Wrangler
resource "null_resource" "apply_migrations" {
  depends_on = [cloudflare_d1_database.main]
  
  triggers = {
    database_id = cloudflare_d1_database.main.id
    schema_hash = filesha256("${path.module}/schema/*.sql")
    migration_hash = filesha256("${path.module}/migrations/*.sql")
  }
  
  provisioner "local-exec" {
    command = <<EOF
      cd ${path.module}
      
      # Apply core schema migrations
      echo "Applying D1 database migrations..."
      
      # Initialize wrangler with environment variables
      export CLOUDFLARE_API_TOKEN="${var.cloudflare_api_token}"
      export CLOUDFLARE_ACCOUNT_ID="${var.account_id}"
      
      # Apply migrations in order
      for migration in $(ls migrations/*.sql | sort); do
        echo "Applying migration: $migration"
        wrangler d1 execute "${cloudflare_d1_database.main.name}" --file="$migration" --remote
      done
      
      # Apply seed data
      if [ -d "seeds" ] && [ "$(ls -A seeds/*.sql 2>/dev/null)" ]; then
        echo "Applying seed data..."
        for seed in $(ls seeds/*.sql | sort); do
          echo "Applying seed: $seed"
          wrangler d1 execute "${cloudflare_d1_database.main.name}" --file="$seed" --remote
        done
      fi
      
      echo "Database migrations completed successfully"
    EOF
  }
}

# Database Backup Configuration
resource "cloudflare_d1_backup" "daily_backup" {
  count      = var.enable_daily_backups ? 1 : 0
  database_id = cloudflare_d1_database.main.id
  name       = "${var.project_name}-${var.environment}-daily-backup"
  
  schedule = "0 2 * * *"  # Daily at 2 AM UTC
  retention_days = var.backup_retention_days
}

resource "cloudflare_d1_backup" "weekly_backup" {
  count      = var.enable_weekly_backups ? 1 : 0
  database_id = cloudflare_d1_database.main.id
  name       = "${var.project_name}-${var.environment}-weekly-backup"
  
  schedule = "0 3 * * 0"  # Weekly on Sunday at 3 AM UTC
  retention_days = var.backup_retention_weeks * 7
}

# Database Monitoring
resource "cloudflare_d1_database" "monitoring" {
  count  = var.enable_monitoring ? 1 : 0
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-monitoring"
  
  configuration {
    enable_writes = false
    enable_reads  = true
    memory_limit  = "256MiB"
  }
}

# Performance Indexes (via migration)
resource "null_resource" "create_indexes" {
  depends_on = [null_resource.apply_migrations]
  
  triggers = {
    database_id = cloudflare_d1_database.main.id
    index_hash  = sha256(join(",", fileset("${path.module}/indexes", "*.sql")))
  }
  
  provisioner "local-exec" {
    command = <<EOF
      cd ${path.module}
      export CLOUDFLARE_API_TOKEN="${var.cloudflare_api_token}"
      export CLOUDFLARE_ACCOUNT_ID="${var.account_id}"
      
      # Create performance indexes
      for index in $(ls indexes/*.sql 2>/dev/null || echo ""); do
        echo "Creating index: $index"
        wrangler d1 execute "${cloudflare_d1_database.main.name}" --file="$index" --remote
      done
    EOF
  }
}

# Variables for D1 configuration
variable "enable_replicas" {
  description = "Enable read replicas for better performance"
  type        = bool
  default     = false
}

variable "query_timeout" {
  description = "Query timeout in milliseconds"
  type        = number
  default     = 30000
}

variable "max_query_duration" {
  description = "Maximum query duration in milliseconds"
  type        = number
  default     = 60000
}

variable "memory_limit" {
  description = "Database memory limit"
  type        = string
  default     = "1GiB"
}

variable "create_analytics_db" {
  description = "Create separate analytics database"
  type        = bool
  default     = false
}

variable "enable_daily_backups" {
  description = "Enable daily automated backups"
  type        = bool
  default     = true
}

variable "enable_weekly_backups" {
  description = "Enable weekly automated backups"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Daily backup retention in days"
  type        = number
  default     = 30
}

variable "backup_retention_weeks" {
  description = "Weekly backup retention in weeks"
  type        = number
  default     = 12
}

variable "enable_monitoring" {
  description = "Enable database monitoring"
  type        = bool
  default     = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token for wrangler operations"
  type        = string
  sensitive   = true
}

# Outputs
output "database_id" {
  description = "Main D1 database ID"
  value       = cloudflare_d1_database.main.id
}

output "database_name" {
  description = "Main D1 database name"
  value       = cloudflare_d1_database.main.name
}

output "analytics_database_id" {
  description = "Analytics D1 database ID"
  value       = cloudflare_d1_database.analytics[*].id
  count       = var.create_analytics_db ? 1 : 0
}

output "database_connection_string" {
  description = "Database connection string for applications"
  value       = "cloudflare-d1://${cloudflare_d1_database.main.name}"
  sensitive   = true
}

output "backup_configurations" {
  description = "Database backup configurations"
  value = {
    daily_backup_enabled  = var.enable_daily_backups
    weekly_backup_enabled = var.enable_weekly_backups
    daily_retention_days  = var.backup_retention_days
    weekly_retention_days = var.backup_retention_weeks * 7
  }
}