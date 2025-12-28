# Quick Start Guide

## 🚀 5-Minute Deployment

Get your appointment booking platform running on Cloudflare in minutes.

### Prerequisites Check

```bash
# Check if tools are installed
terraform --version    # Should be >= 1.5.0
wrangler --version     # Should be >= 3.0.0
node --version         # Should be >= 18.0.0
```

### 1. Setup (2 minutes)

```bash
# Clone and setup
git clone <your-repo>
cd appointmentbooking-monorepo
npm install -g wrangler pnpm
pnpm install
```

### 2. Configure (1 minute)

```bash
# Set your Cloudflare credentials
export CLOUDFLARE_API_TOKEN="your_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"

# Copy environment file
cp infrastructure/cloudflare/environments/staging.tfvars \
   infrastructure/cloudflare/terraform.tfvars

# Edit with your values
nano infrastructure/cloudflare/terraform.tfvars
```

### 3. Deploy (2 minutes)

```bash
cd infrastructure/cloudflare

# Initialize
terraform init

# Deploy everything
terraform apply -auto-approve

# Done! Your platform is live
echo "✅ Deployment complete!"
echo "Dashboard: https://dashboard.yourdomain.com"
echo "API: https://api.yourdomain.com"
```

## 🎯 What Gets Deployed

- ✅ **Workers**: API endpoints with AI features
- ✅ **Pages**: Marketing site, dashboard, booking engine
- ✅ **D1 Database**: Multi-tenant database with migrations
- ✅ **R2 Storage**: File uploads and static assets with CDN
- ✅ **Zero Trust**: Authentication and access control
- ✅ **Security**: WAF, DDoS protection, rate limiting
- ✅ **Monitoring**: Analytics, alerts, dashboards
- ✅ **CI/CD**: Automated deployment pipelines

## 🔧 Customization

### Change Domain

Edit `terraform.tfvars`:

```hcl
domain_name = "yourdomain.com"
subdomain_prefixes = {
  marketing = "www"
  dashboard = "admin"
  booking   = "app"
  api       = "api"
}
```

### Adjust Security

```hcl
# Production security
security_level = "high"
ssl_mode = "strict"

# Staging security (more relaxed)
security_level = "medium"
ssl_mode = "full"
```

### Configure Integrations

```hcl
# Add your API keys
worker_env_vars = {
  OPENAI_API_KEY = "sk-..."
  PAYSTACK_SECRET_KEY = "..."
  SUPERSAAS_API_KEY = "..."
}
```

## 🧪 Test Deployment

```bash
# Health checks
curl https://api.yourdomain.com/api/health
curl https://dashboard.yourdomain.com

# Database test
wrangler d1 execute your-db --command="SELECT COUNT(*) FROM tenants"

# Check logs
wrangler tail
```

## 🆘 Need Help?

- 📖 **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- 🔧 **Component Docs**: Check each `README.md`
- 🐛 **Troubleshooting**: Common issues in deployment guide
- 💬 **Support**: Cloudflare Discord/Support

## 🎉 Success

Your appointment booking platform is now live with:

- 🔐 Enterprise-grade security
- 📊 Real-time monitoring
- 🚀 Auto-scaling performance
- 🔄 CI/CD automation
- 📱 Multi-device support

**Next Steps:**

1. Configure your business settings in the dashboard
2. Set up payment gateways
3. Customize branding and content
4. Invite team members
5. Launch your booking platform!

---

**Pro Tip**: Use `terraform destroy` to clean up the environment if needed.
