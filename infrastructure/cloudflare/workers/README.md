# Cloudflare Workers Infrastructure Configuration

This directory contains Terraform templates for Cloudflare Workers deployment.

## Components

- `main.tf` - Main Worker configuration
- `variables.tf` - Worker-specific variables
- `outputs.tf` - Worker outputs
- `environments/` - Environment-specific configurations
- `scripts/` - Deployment and management scripts

## Worker Endpoints

- `/api/ai` - AI conversation and analytics
- `/api/dashboard/*` - Dashboard endpoints
- `/api/book` - Booking creation
- `/api/tenant/*` - Tenant management
- `/api/health` - Health check
- `/api/public/services` - Public services
- `/api/products` - Product catalog
- `/api/*` - Additional API endpoints

## Environment Variables

- Database connections
- API keys for external services
- Authentication tokens
- Configuration settings
