# Cloudflare Analytics Configuration

# Enable Cloudflare Analytics
resource "cloudflare_zone_settings_override" "analytics_settings" {
  zone_id = var.zone_id
  
  settings {
    # Enable Analytics
    analytics = var.enable_analytics ? "on" : "off"
    
    # Performance monitoring
    always_online = "on"
    security_level = var.security_level
    
    # Cache settings for performance
    cache_level = "cache_everything"
    edge_cache_ttl = 86400
    
    # Browser cache TTL
    browser_cache_ttl = 14400
    
    # Always Use HTTPS
    always_use_https = "on"
    
    # Automatic HTTPS rewrites
    automatic_https_rewrites = "on"
    
    # Brotli compression
    brotli = "on"
    
    # Minify CSS, JS, HTML
    minify {
      css  = "on"
      js   = "on"
      html = "on"
    }
  }
}

# Custom Analytics Configuration
resource "cloudflare_analytics_engine" "main" {
  count    = var.enable_analytics_engine ? 1 : 0
  zone_id  = var.zone_id
  
  # Dataset configuration
  dataset {
    name = "appointments"
    dimensions = ["tenant_id", "service_type", "status", "timestamp"]
    metrics = ["count", "duration", "revenue"]
  }
  
  dataset {
    name = "user_behavior"
    dimensions = ["page", "user_agent", "referrer", "timestamp"]
    metrics = ["page_views", "bounce_rate", "session_duration"]
  }
  
  dataset {
    name = "api_performance"
    dimensions = ["endpoint", "method", "status_code", "timestamp"]
    metrics = ["response_time", "error_rate", "throughput"]
  }
}

# Alert Rules

# API Health Alert
resource "cloudflare_alert_policy" "api_health" {
  count    = var.enable_alerts ? 1 : 0
  zone_id  = var.zone_id
  
  name     = "${var.project_name} API Health"
  enabled  = true
  
  alert_data_source {
    port = "api"
  }
  
  alert_check {
    filter {
      method     = "GET"
      port       = var.api_port
      host       = "${var.subdomain_prefixes["api"]}.${var.domain_name}"
      uri_path   = "/api/health"
    }
  }
  
  conditions {
    http_error_rate {
      operator = "greater_than"
      value    = 5.0  # 5% error rate
    }
    
    http_latency_p95 {
      operator = "greater_than"
      value    = 2000  # 2 seconds
    }
  }
  
  notifications {
    email = var.alert_email_addresses
    slack_webhook = var.slack_webhook_url
  }
  
  filters = {
    zone = var.domain_name
    service = "api"
  }
}

# Database Performance Alert
resource "cloudflare_alert_policy" "database_performance" {
  count    = var.enable_alerts ? 1 : 0
  zone_id  = var.zone_id
  
  name     = "${var.project_name} Database Performance"
  enabled  = true
  
  alert_data_source {
    port = "database"
  }
  
  alert_check {
    filter {
      method     = "POST"
      port       = var.database_port
      host       = "${var.subdomain_prefixes["api"]}.${var.domain_name}"
    }
  }
  
  conditions {
    response_time {
      operator = "greater_than"
      value    = 1000  # 1 second
    }
    
    connection_errors {
      operator = "greater_than"
      value    = 10    # 10 errors per minute
    }
  }
  
  notifications {
    email = var.alert_email_addresses
    pagerduty_integration_key = var.pagerduty_integration_key
  }
  
  filters = {
    zone = var.domain_name
    service = "database"
  }
}

# Security Alert
resource "cloudflare_alert_policy" "security_alerts" {
  count    = var.enable_security_alerts ? 1 : 0
  zone_id  = var.zone_id
  
  name     = "${var.project_name} Security Events"
  enabled  = true
  
  alert_data_source {
    service_type = "security_events"
  }
  
  alert_check {
    filter {
      service_type = "security_events"
    }
  }
  
  conditions {
    security_events {
      operator = "greater_than"
      value    = 0  # Any security event
    }
  }
  
  notifications {
    email = var.security_email_addresses
    slack_webhook = var.security_slack_webhook_url
  }
  
  filters = {
    zone = var.domain_name
    service = "security"
  }
}

# Traffic Anomaly Alert
resource "cloudflare_alert_policy" "traffic_anomaly" {
  count    = var.enable_traffic_alerts ? 1 : 0
  zone_id  = var.zone_id
  
  name     = "${var.project_name} Traffic Anomaly"
  enabled  = true
  
  alert_data_source {
    service_type = "traffic"
  }
  
  alert_check {
    filter {
      zone = var.domain_name
    }
  }
  
  conditions {
    requests {
      operator = "greater_than"
      value    = var.traffic_threshold_requests
    }
    
    bandwidth {
      operator = "greater_than"
      value    = var.traffic_threshold_bandwidth
    }
  }
  
  notifications {
    email = var.alert_email_addresses
  }
  
  filters = {
    zone = var.domain_name
    service = "traffic"
  }
}

# SSL/TLS Certificate Alert
resource "cloudflare_alert_policy" "ssl_certificate" {
  count    = var.enable_ssl_alerts ? 1 : 0
  zone_id  = var.zone_id
  
  name     = "${var.project_name} SSL Certificate"
  enabled  = true
  
  alert_data_source {
    service_type = "ssl"
  }
  
  conditions {
    ssl_certificate {
      operator = "less_than"
      value    = var.ssl_expiry_threshold_days  # Days before expiry
    }
  }
  
  notifications {
    email = var.alert_email_addresses
  }
  
  filters = {
    zone = var.domain_name
    service = "ssl"
  }
}

# Logpush Configuration

# Application logs to external system
resource "cloudflare_logpush_job" "application_logs" {
  count    = var.enable_logpush ? 1 : 0
  account_id = var.account_id
  
  name     = "${var.project_name}-${var.environment}-application-logs"
  enabled  = true
  
  # Log fields to capture
  log_pull_options {
    fields = jsonencode([
      "timestamp",
      "zone.name",
      "zone.id",
      "request.url",
      "request.method",
      "request.headers.user-agent",
      "response.status",
      "response.content-type",
      "edge.response-status",
      "edge.pathing-op",
      "client.ip",
      "client.country",
      "client.asn",
      "client.ipClass"
    ])
    
    # Sampling (10% of logs)
    sample_rate = 0.1
    
    # Buffer window
    buffer_window = 300  # 5 minutes
  }
  
  # Destination (e.g., S3, Google Cloud Storage, etc.)
  destination_conf = var.logpush_destination
  
  # Dataset filters
  dataset = "http_requests"
  
  output_options {
    output_format = "json"
    output_options {
      field_names = [
        "timestamp",
        "zone.name",
        "request.url",
        "request.method",
        "response.status",
        "client.ip",
        "client.country"
      ]
    }
  }
}

# Security logs
resource "cloudflare_logpush_job" "security_logs" {
  count    = var.enable_logpush ? 1 : 0
  account_id = var.account_id
  
  name     = "${var.project_name}-${var.environment}-security-logs"
  enabled  = true
  
  destination_conf = var.logpush_destination
  
  dataset = "security_events"
  
  output_options {
    output_format = "json"
    field_names = [
      "timestamp",
      "kind",
      "action",
      "source",
      "target"
    ]
  }
}

# Compliance Reporting

# GDPR compliance configuration
resource "cloudflare_logpush_job" "gdpr_logs" {
  count    = var.enable_gdpr_compliance ? 1 : 0
  account_id = var.account_id
  
  name     = "${var.project_name}-${var.environment}-gdpr-compliance"
  enabled  = true
  
  destination_conf = var.logpush_destination
  
  dataset = "gdpr_requests"
  
  output_options {
    output_format = "json"
    field_names = [
      "timestamp",
      "requestor",
      "subject",
      "request_type",
      "processing_time"
    ]
  }
}

# Dashboard Configuration

# Create custom dashboard
resource "cloudflare_dashboard" "main" {
  count    = var.enable_custom_dashboard ? 1 : 0
  zone_id  = var.zone_id
  
  name     = "${var.project_name} ${var.environment} Dashboard"
  layout = jsonencode({
    widgets = [
      {
        type = "chart"
        title = "API Performance"
        query = {
          dataset = "api_performance"
          metrics = ["response_time", "error_rate"]
          time_range = "24h"
        }
      },
      {
        type = "chart"
        title = "Booking Metrics"
        query = {
          dataset = "appointments"
          metrics = ["count", "revenue"]
          time_range = "7d"
        }
      },
      {
        type = "table"
        title = "Security Events"
        query = {
          dataset = "security_events"
          filters = {
            severity = ["high", "critical"]
          }
        }
      }
    ]
  })
}

# Variables for monitoring configuration
variable "enable_analytics" {
  description = "Enable Cloudflare Analytics"
  type        = bool
  default     = true
}

variable "enable_analytics_engine" {
  description = "Enable Analytics Engine"
  type        = bool
  default     = false
}

variable "security_level" {
  description = "Security level setting"
  type        = string
  default     = "medium"
}

variable "enable_alerts" {
  description = "Enable alert policies"
  type        = bool
  default     = true
}

variable "enable_security_alerts" {
  description = "Enable security alerts"
  type        = bool
  default     = true
}

variable "enable_traffic_alerts" {
  description = "Enable traffic anomaly alerts"
  type        = bool
  default     = true
}

variable "enable_ssl_alerts" {
  description = "Enable SSL certificate alerts"
  type        = bool
  default     = true
}

variable "enable_logpush" {
  description = "Enable Logpush"
  type        = bool
  default     = false
}

variable "enable_gdpr_compliance" {
  description = "Enable GDPR compliance logging"
  type        = bool
  default     = true
}

variable "enable_custom_dashboard" {
  description = "Enable custom dashboard"
  type        = bool
  default     = false
}

variable "api_port" {
  description = "API port for monitoring"
  type        = number
  default     = 443
}

variable "database_port" {
  description = "Database port for monitoring"
  type        = number
  default     = 5432
}

variable "alert_email_addresses" {
  description = "Email addresses for alerts"
  type        = list(string)
  default     = ["admin@appointmentbooking.co.za"]
}

variable "security_email_addresses" {
  description = "Email addresses for security alerts"
  type        = list(string)
  default     = ["security@appointmentbooking.co.za"]
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  sensitive   = true
  default     = ""
}

variable "security_slack_webhook_url" {
  description = "Slack webhook URL for security alerts"
  type        = string
  sensitive   = true
  default     = ""
}

variable "pagerduty_integration_key" {
  description = "PagerDuty integration key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "traffic_threshold_requests" {
  description = "Traffic threshold for requests per minute"
  type        = number
  default     = 10000
}

variable "traffic_threshold_bandwidth" {
  description = "Traffic threshold for bandwidth in MB"
  type        = number
  default     = 100
}

variable "ssl_expiry_threshold_days" {
  description = "SSL certificate expiry threshold in days"
  type        = number
  default     = 30
}

variable "logpush_destination" {
  description = "Logpush destination (S3, GCS, etc.)"
  type        = string
  sensitive   = true
  default     = ""
}

# Outputs
output "analytics_enabled" {
  description = "Analytics enabled status"
  value       = var.enable_analytics
}

output "alert_policies" {
  description = "Enabled alert policies"
  value = {
    api_health          = var.enable_alerts
    database_performance = var.enable_alerts
    security_events     = var.enable_security_alerts
    traffic_anomaly     = var.enable_traffic_alerts
    ssl_certificate     = var.enable_ssl_alerts
  }
}

output "compliance_features" {
  description = "Compliance features enabled"
  value = {
    gdpr_logging = var.enable_gdpr_compliance
    logpush      = var.enable_logpush
    security_monitoring = var.enable_security_alerts
  }
}

output "monitoring_dashboard_config" {
  description = "Monitoring dashboard configuration"
  value = {
    analytics_engine = var.enable_analytics_engine
    custom_dashboard = var.enable_custom_dashboard
    security_level   = var.security_level
  }
}