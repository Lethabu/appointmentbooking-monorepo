# Cloudflare Infrastructure-as-Code Templates

This directory contains comprehensive Terraform templates for deploying the appointment booking platform on Cloudflare.

## Directory Structure

```
cloudflare/
├── workers/          # Cloudflare Workers configuration
├── pages/           # Cloudflare Pages configuration
├── d1/              # D1 database management
├── r2/              # R2 storage configuration
├── zero-trust/      # Zero Trust security
├── ci-cd/           # CI/CD pipeline templates
├── monitoring/      # Monitoring and alerting
├── security/        # Security and compliance
└── shared/          # Shared variables and outputs
```

## Prerequisites

- Terraform >= 1.0
- Cloudflare API Token with appropriate permissions
- Wrangler CLI (for Workers deployment)

## Quick Start

1. Configure your Cloudflare credentials:

   ```bash
   export CLOUDFLARE_API_TOKEN="your_api_token"
   export CLOUDFLARE_ACCOUNT_ID="your_account_id"
   ```

2. Initialize Terraform:

   ```bash
   cd infrastructure/cloudflare
   terraform init
   ```

3. Apply the configuration:

   ```bash
   terraform plan -var-file="environments/production.tfvars"
   terraform apply -var-file="environments/production.tfvars"
   ```

## Deployment Environments

- `dev` - Development environment
- `staging` - Staging environment
- `production` - Production environment

## Components

### 1. Workers

- API endpoints for booking system
- Authentication and authorization
- Real-time dashboard updates

### 2. Pages

- Marketing site
- Admin dashboard
- Booking engine

### 3. D1 Database

- Schema definitions
- Migration scripts
- Backup procedures

### 4. R2 Storage

- File uploads
- Static assets
- Backup storage

### 5. Zero Trust

- Access policies
- Device certification
- Identity integration

### 6. CI/CD

- GitHub Actions workflows
- Automated deployment
- Environment promotion

### 7. Monitoring

- Analytics configuration
- Alert rules
- Dashboard templates

### 8. Security

- WAF rules
- SSL/TLS settings
- DDoS protection
