# Main R2 Storage Buckets

# Primary application storage bucket
resource "cloudflare_r2_bucket" "app_storage" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-storage"
}

# User uploads bucket (images, documents)
resource "cloudflare_r2_bucket" "uploads" {
  count     = var.enable_uploads_bucket ? 1 : 0
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-uploads"
}

# Backup storage bucket
resource "cloudflare_r2_bucket" "backups" {
  count     = var.enable_backups_bucket ? 1 : 0
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-backups"
}

# Static assets bucket (CDN)
resource "cloudflare_r2_bucket" "static_assets" {
  count     = var.enable_static_assets ? 1 : 0
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-assets"
}

# Product images bucket
resource "cloudflare_r2_bucket" "product_images" {
  count     = var.enable_product_images ? 1 : 0
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}-products"
}

# CDN Domain Configuration
resource "cloudflare_r2_bucket_domain" "app_storage_cdn" {
  bucket_id = cloudflare_r2_bucket.app_storage.id
  domain    = "${var.subdomain_prefixes["storage"]}.${var.domain_name}"
  
  # SSL/TLS settings
  ssl_settings {
    tls_version = "1.2"
    min_tls_version = "1.2"
  }
}

resource "cloudflare_r2_bucket_domain" "static_assets_cdn" {
  count     = var.enable_static_assets ? 1 : 0
  bucket_id = cloudflare_r2_bucket.static_assets.id
  domain    = "${var.subdomain_prefixes["assets"]}.${var.domain_name}"
  
  ssl_settings {
    tls_version = "1.2"
    min_tls_version = "1.2"
  }
}

resource "cloudflare_r2_bucket_domain" "product_images_cdn" {
  count     = var.enable_product_images ? 1 : 0
  bucket_id = cloudflare_r2_bucket.product_images.id
  domain    = "${var.subdomain_prefixes["images"]}.${var.domain_name}"
  
  ssl_settings {
    tls_version = "1.2"
    min_tls_version = "1.2"
  }
}

# Access Control Policies

# Public read access for static assets
resource "cloudflare_r2_bucket_policy" "public_static_assets" {
  count     = var.enable_static_assets ? 1 : 0
  bucket_id = cloudflare_r2_bucket.static_assets.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = ["r2:ListBucket", "r2:GetObject"]
        Resource = [
          "arn:aws:s3:::${cloudflare_r2_bucket.static_assets.name}",
          "arn:aws:s3:::${cloudflare_r2_bucket.static_assets.name}/*"
        ]
        Condition = {
          StringEquals = {
            "r2:ListBucket/v1" = cloudflare_r2_bucket.static_assets.name
          }
        }
      }
    ]
  })
}

# Public read access for product images
resource "cloudflare_r2_bucket_policy" "public_product_images" {
  count     = var.enable_product_images ? 1 : 0
  bucket_id = cloudflare_r2_bucket.product_images.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = ["r2:ListBucket", "r2:GetObject"]
        Resource = [
          "arn:aws:s3:::${cloudflare_r2_bucket.product_images.name}",
          "arn:aws:s3:::${cloudflare_r2_bucket.product_images.name}/*"
        ]
        Condition = {
          StringEquals = {
            "r2:ListBucket/v1" = cloudflare_r2_bucket.product_images.name
          }
        }
      }
    ]
  })
}

# Restricted access for uploads bucket
resource "cloudflare_r2_bucket_policy" "restricted_uploads" {
  count     = var.enable_uploads_bucket ? 1 : 0
  bucket_id = cloudflare_r2_bucket.uploads[0].id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowAppAccess"
        Effect    = "Allow"
        Principal = {
          Service = "cloudflare.workers"
        }
        Action   = ["r2:PutObject", "r2:GetObject", "r2:DeleteObject"]
        Resource = "arn:aws:s3:::${cloudflare_r2_bucket.uploads[0].name}/*"
      },
      {
        Sid       = "AllowWorkerAccess"
        Effect    = "Allow"
        Principal = {
          Service = "cloudflare.workers"
        }
        Action   = ["r2:ListBucket"]
        Resource = "arn:aws:s3:::${cloudflare_r2_bucket.uploads[0].name}"
      }
    ]
  })
}

# Lifecycle Management Rules

# Static assets lifecycle (long-term storage)
resource "cloudflare_r2_lifecycle_rule" "static_assets_lifecycle" {
  count     = var.enable_static_assets ? 1 : 0
  bucket_id = cloudflare_r2_bucket.static_assets.id
  
  rule_id   = "static-assets-lifecycle"
  status    = "Enabled"
  
  filter {
    prefix = ""
  }
  
  expiration {
    days = 3650  # 10 years
  }
  
  transitions {
    storage_class = "GLACIER"
    days          = 90
  }
}

# Product images lifecycle (medium-term storage)
resource "cloudflare_r2_lifecycle_rule" "product_images_lifecycle" {
  count     = var.enable_product_images ? 1 : 0
  bucket_id = cloudflare_r2_bucket.product_images.id
  
  rule_id   = "product-images-lifecycle"
  status    = "Enabled"
  
  filter {
    prefix = "deprecated/"
  }
  
  expiration {
    days = 1095  # 3 years for deprecated images
  }
  
  transitions {
    storage_class = "GLACIER"
    days          = 30
  }
}

# Backup lifecycle (archive after 30 days)
resource "cloudflare_r2_lifecycle_rule" "backups_lifecycle" {
  count     = var.enable_backups_bucket ? 1 : 0
  bucket_id = cloudflare_r2_bucket.backups[0].id
  
  rule_id   = "backups-lifecycle"
  status    = "Enabled"
  
  filter {
    prefix = ""
  }
  
  expiration {
    days = var.backup_retention_days
  }
  
  transitions {
    storage_class = "DEEP_ARCHIVE"
    days          = 7
  }
}

# Upload cleanup lifecycle (remove temp files)
resource "cloudflare_r2_lifecycle_rule" "upload_cleanup" {
  count     = var.enable_uploads_bucket ? 1 : 0
  bucket_id = cloudflare_r2_bucket.uploads[0].id
  
  rule_id   = "upload-cleanup"
  status    = "Enabled"
  
  filter {
    prefix = "temp/"
  }
  
  expiration {
    days = 7  # Remove temp files after 7 days
  }
}

# CDN Cache Rules

# Static assets cache rule
resource "cloudflare_cache_rule" "static_assets_cache" {
  count     = var.enable_static_assets ? 1 : 0
  zone_id   = var.zone_id
  
  action {
    cache_key_fields {
      header {
        exclude = ["cookie", "authorization"]
      }
      query_string {
        exclude = ["utm_*", "fbclid", "gclid"]
      }
    }
    edge_ttl = 86400  # 24 hours
    browser_ttl = 3600  # 1 hour
    cache_level = "cache_everything"
  }
  
  action_parameters {
    cache = true
    edge_ttl = 86400
    browser_ttl = 3600
  }
  
  depends_on = [cloudflare_r2_bucket_domain.static_assets_cdn]
  
  expression = "(http.host eq \"${var.subdomain_prefixes["assets"]}.${var.domain_name}\") and (http.request.method eq \"GET\")"
  priority   = 100
  status     = "active"
}

# Product images cache rule
resource "cloudflare_cache_rule" "product_images_cache" {
  count     = var.enable_product_images ? 1 : 0
  zone_id   = var.zone_id
  
  action_parameters {
    cache = true
    edge_ttl = 604800  # 7 days
    browser_ttl = 86400  # 1 day
  }
  
  depends_on = [cloudflare_r2_bucket_domain.product_images_cdn]
  
  expression = "(http.host eq \"${var.subdomain_prefixes["images"]}.${var.domain_name}\") and (http.request.method eq \"GET\")"
  priority   = 101
  status     = "active"
}

# Upload bucket cache rule (no cache for uploads)
resource "cloudflare_cache_rule" "uploads_no_cache" {
  count     = var.enable_uploads_bucket ? 1 : 0
  zone_id   = var.zone_id
  
  action_parameters {
    cache = false
    edge_ttl = 0
    browser_ttl = 0
  }
  
  depends_on = [cloudflare_r2_bucket_domain.app_storage_cdn]
  
  expression = "(http.host eq \"${var.subdomain_prefixes["storage"]}.${var.domain_name}\") and (http.request.uri.path matches \"/uploads/\")"
  priority   = 200
  status     = "active"
}

# Compression and Optimization

# Image optimization rule
resource "cloudflare_cache_rule" "image_optimization" {
  count     = var.enable_product_images ? 1 : 0
  zone_id   = var.zone_id
  
  action_parameters {
    cache = true
    edge_ttl = 2592000  # 30 days
    browser_ttl = 86400  # 1 day
    
    # Image optimization settings
    image_resizing = true
    webp_support   = "auto"
  }
  
  depends_on = [cloudflare_cache_rule.product_images_cache]
  
  expression = "(http.host eq \"${var.subdomain_prefixes["images"]}.${var.domain_name}\") and (http.request.uri.path matches \"\\\\.(jpg|jpeg|png|gif|webp|avif)$\")"
  priority   = 110
  status     = "active"
}

# Variables for R2 configuration
variable "enable_uploads_bucket" {
  description = "Enable user uploads bucket"
  type        = bool
  default     = true
}

variable "enable_backups_bucket" {
  description = "Enable backup storage bucket"
  type        = bool
  default     = true
}

variable "enable_static_assets" {
  description = "Enable static assets bucket with CDN"
  type        = bool
  default     = true
}

variable "enable_product_images" {
  description = "Enable product images bucket with CDN"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Backup retention in days"
  type        = number
  default     = 90
}

# CDN subdomain prefixes
variable "cdn_subdomain_prefixes" {
  description = "CDN subdomain prefixes"
  type = map(string)
  default = {
    storage  = "storage"
    assets   = "assets"
    images   = "images"
    cdn      = "cdn"
  }
}

# Outputs
output "app_storage_bucket_id" {
  description = "Main application storage bucket ID"
  value       = cloudflare_r2_bucket.app_storage.id
}

output "app_storage_bucket_name" {
  description = "Main application storage bucket name"
  value       = cloudflare_r2_bucket.app_storage.name
}

output "app_storage_cdn_domain" {
  description = "Application storage CDN domain"
  value       = cloudflare_r2_bucket_domain.app_storage_cdn.domain
}

output "static_assets_bucket_name" {
  description = "Static assets bucket name"
  value       = cloudflare_r2_bucket.static_assets[*].name
  count       = var.enable_static_assets ? 1 : 0
}

output "static_assets_cdn_domain" {
  description = "Static assets CDN domain"
  value       = cloudflare_r2_bucket_domain.static_assets_cdn.domain
  count       = var.enable_static_assets ? 1 : 0
}

output "product_images_bucket_name" {
  description = "Product images bucket name"
  value       = cloudflare_r2_bucket.product_images[*].name
  count       = var.enable_product_images ? 1 : 0
}

output "product_images_cdn_domain" {
  description = "Product images CDN domain"
  value       = cloudflare_r2_bucket_domain.product_images_cdn.domain
  count       = var.enable_product_images ? 1 : 0
}

output "cdn_configurations" {
  description = "CDN configurations"
  value = {
    static_assets_cache_ttl = "86400"
    product_images_cache_ttl = "604800"
    image_optimization_enabled = var.enable_product_images
    compression_enabled = true
  }
}

output "lifecycle_rules" {
  description = "Storage lifecycle rules"
  value = {
    static_assets_expiration = "3650 days"
    product_images_expiration = "1095 days"
    backup_expiration = "${var.backup_retention_days} days"
    upload_cleanup = "7 days"
  }
}