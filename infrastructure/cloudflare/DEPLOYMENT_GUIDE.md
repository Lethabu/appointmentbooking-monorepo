# Cloudflare Infrastructure-as-Code Deployment Guide

This comprehensive guide provides step-by-step instructions for deploying the appointment booking platform infrastructure on Cloudflare using Terraform.

## 📋 Prerequisites

### Required Tools

- [Terraform](https://www.terraform.io/downloads) >= 1.5.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) >= 3.0.0
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/installation) (recommended package manager)

### Cloudflare Requirements

- Cloudflare account with appropriate plan
- Cloudflare API Token with the following permissions:
  - `Zone:Zone:Read`
  - `Zone:Zone Settings:Edit`
  - `Account:Cloudflare Tunnel:Edit`
  - `Account:Zero Trust:Edit`
  - `Account:D1:Edit`
  - `Account:R2:Edit`
  - `Account:Workers Scripts:Edit`
  - `Account:Pages:Edit`

### External Service Accounts

- **Supabase**: Project URL and API keys
- **Clerk**: Authentication service credentials
- **Paystack**: Payment gateway credentials
- **OpenAI**: API key for AI features
- **GitHub**: Repository access tokens

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-org/appointmentbooking-monorepo.git
cd appointmentbooking-monorepo

# Install dependencies
npm install -g pnpm
pnpm install

# Install Wrangler CLI
npm install -g wrangler
```

### 2. Configure Cloudflare Credentials

```bash
# Set environment variables
export CLOUDFLARE_API_TOKEN="your_api_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"

# Or create a .env file
echo "CLOUDFLARE_API_TOKEN=your_api_token" > .env
echo "CLOUDFLARE_ACCOUNT_ID=your_account_id" >> .env
```

### 3. Initialize Terraform

```bash
cd infrastructure/cloudflare

# Initialize Terraform with remote backend
terraform init

# Verify configuration
terraform validate
```

### 4. Plan Deployment

```bash
# Plan for staging environment
terraform plan -var-file="environments/staging.tfvars"

# Plan for production environment
terraform plan -var-file="environments/production.tfvars"
```

### 5. Deploy Infrastructure

```bash
# Deploy to staging
terraform apply -var-file="environments/staging.tfvars"

# Deploy to production (be careful!)
terraform apply -var-file="environments/production.tfvars"
```

## 🏗️ Architecture Overview

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Cloudflare    │    │   Cloudflare    │
│    Workers      │    │     Pages       │    │      D1         │
│                 │    │                 │    │   Database      │
│ • API Endpoints │    │ • Marketing     │    │                 │
│ • Authentication│    │ • Dashboard     │    │ • Multi-tenant  │
│ • AI Features   │    │ • Booking       │    │ • Auto-backup  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │       R2        │
                    │   Storage       │
                    │                 │
                    │ • File Uploads  │
                    │ • Static Assets │
                    │ • CDN           │
                    └─────────────────┘
```

### Security Layer

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Zero Trust    │    │      WAF        │    │   Rate Limits   │
│                 │    │                 │    │                 │
│ • Identity      │    │ • SQL Injection │    │ • API Throttle  │
│ • Access        │    │ • XSS Protection│    │ • Login Protect │
│ • Device Cert   │    │ • DDoS Shield   │    │ • Bot Defense   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Directory Structure

```
infrastructure/cloudflare/
├── main.tf                 # Main Terraform configuration
├── README.md              # This guide
├── workers/               # Cloudflare Workers
│   ├── main.tf           # Worker configuration
│   ├── scripts/          # Worker code templates
│   └── README.md         # Worker documentation
├── pages/                # Cloudflare Pages
│   ├── main.tf           # Pages configuration
│   └── README.md         # Pages documentation
├── d1/                   # D1 Database
│   ├── main.tf           # Database configuration
│   ├── schema/           # Database schema
│   ├── migrations/       # Migration scripts
│   └── README.md         # Database documentation
├── r2/                   # R2 Storage
│   ├── main.tf           # Storage configuration
│   └── README.md         # Storage documentation
├── zero-trust/           # Zero Trust Security
│   ├── main.tf           # Security configuration
│   └── README.md         # Security documentation
├── ci-cd/                # CI/CD Pipelines
│   ├── github-actions/   # GitHub Actions
│   └── README.md         # CI/CD documentation
├── monitoring/           # Monitoring & Analytics
│   ├── main.tf           # Monitoring configuration
│   └── README.md         # Monitoring documentation
├── security/             # Security & Compliance
│   ├── main.tf           # Security rules
│   └── README.md         # Security documentation
├── environments/         # Environment configurations
│   ├── staging.tfvars    # Staging settings
│   └── production.tfvars # Production settings
└── shared/              # Shared resources
    ├── variables.tf      # Common variables
    └── outputs.tf        # Common outputs
```

## 🔧 Configuration

### Environment Variables

#### Required Variables

- `cloudflare_api_token`: Cloudflare API token
- `account_id`: Cloudflare account ID
- `zone_id`: Cloudflare zone ID (for existing domain)
- `domain_name`: Primary domain name

#### Sensitive Variables

- `clerk_secret_key`: Clerk authentication secret
- `paystack_secret_key`: PayStack payment secret
- `supabase_url`: Supabase project URL
- `openai_api_key`: OpenAI API key

### Customization

#### 1. Domain Configuration

Edit `environments/{environment}.tfvars`:

```hcl
domain_name = "yourdomain.com"
subdomain_prefixes = {
  marketing = "www"
  dashboard = "admin"
  booking   = "app"
  api       = "api"
}
```

#### 2. Security Settings

Adjust security levels in `environments/{environment}.tfvars`:

```hcl
# Security level: essentially_off, low, medium, high
security_level = "high"

# SSL mode: off, flexible, full, strict
ssl_mode = "strict"
```

#### 3. Rate Limiting

Configure rate limits:

```hcl
api_rate_limit_threshold = 1000
api_rate_limit_period = 60
login_rate_limit_threshold = 5
```

## 🚦 Deployment Workflow

### Development Environment

```bash
# 1. Plan changes
terraform plan -var-file="environments/staging.tfvars"

# 2. Apply changes
terraform apply -var-file="environments/staging.tfvars"

# 3. Deploy applications
./scripts/deploy-apps.sh staging

# 4. Run tests
./scripts/test-deployment.sh staging
```

### Production Deployment

```bash
# 1. Create PR for infrastructure changes
git checkout -b feature/infrastructure-update
git add infrastructure/
git commit -m "Update infrastructure"
git push origin feature/infrastructure-update

# 2. Review and merge PR
# GitHub Actions will automatically deploy to staging

# 3. Manual production deployment
terraform apply -var-file="environments/production.tfvars"

# 4. Deploy applications
./scripts/deploy-apps.sh production
```

## 🔍 Monitoring & Troubleshooting

### Health Checks

```bash
# Check Workers health
curl https://worker.yourdomain.com/api/health

# Check Pages deployment
curl https://dashboard.yourdomain.com

# Check database connectivity
wrangler d1 execute your-db --command="SELECT 1"
```

### Common Issues

#### 1. Authentication Failures

```bash
# Verify API token permissions
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     https://api.cloudflare.com/client/v4/user/tokens/verify
```

#### 2. DNS Propagation

```bash
# Check DNS propagation
dig yourdomain.com

# Verify CNAME records
dig dashboard.yourdomain.com
```

#### 3. Database Connection Issues

```bash
# Test D1 database connection
wrangler d1 execute your-db --command="PRAGMA database_list"

# Check migrations
wrangler d1 migrations list your-db
```

### Monitoring Dashboards

- **Cloudflare Analytics**: `https://dash.cloudflare.com`
- **Zero Trust**: `https://dash.cloudflare.com/zero-trust`
- **Workers Analytics**: Worker-specific metrics
- **Pages Analytics**: Deployment and traffic metrics

## 🔒 Security Best Practices

### 1. API Token Security

- Use least privilege access
- Rotate tokens regularly
- Store in secure secret management

### 2. Environment Isolation

- Separate staging and production accounts
- Use different API tokens per environment
- Implement proper access controls

### 3. Regular Security Audits

```bash
# Run security scan
checkov -d infrastructure/cloudflare/

# Check Terraform security
terraform plan -detailed-exitcode
```

### 4. Backup Strategy

- Enable automated backups
- Test restoration procedures
- Monitor backup health

## 📊 Cost Optimization

### Resource Optimization

- Monitor D1 database usage
- Optimize R2 storage with lifecycle rules
- Use appropriate cache TTLs

### Monitoring Costs

```bash
# Check Cloudflare usage
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     https://api.cloudflare.com/client/v4/zones/$ZONE_ID/analytics/dashboard
```

## 🆘 Support & Troubleshooting

### Getting Help

1. **Documentation**: Check component-specific READMEs
2. **Logs**: Use Cloudflare dashboard logs
3. **Community**: Cloudflare Discord/Slack
4. **Support**: Cloudflare Enterprise support

### Emergency Procedures

1. **Rollback**: Use `terraform destroy` for emergency rollback
2. **Incident Response**: Follow security incident procedures
3. **Contact**: Maintain emergency contact list

## 📝 Maintenance

### Regular Tasks

- [ ] Review and update dependencies
- [ ] Monitor security advisories
- [ ] Update Terraform providers
- [ ] Review access logs
- [ ] Test backup restoration

### Scheduled Maintenance

- **Weekly**: Security patch review
- **Monthly**: Cost optimization review
- **Quarterly**: Infrastructure review
- **Annually**: Full security audit

## 🎯 Next Steps

1. **Customization**: Adapt configurations for your specific needs
2. **Integration**: Connect with your existing systems
3. **Monitoring**: Set up additional monitoring as needed
4. **Scaling**: Plan for future growth and scaling

---

For detailed information about specific components, refer to the README files in each subdirectory.
