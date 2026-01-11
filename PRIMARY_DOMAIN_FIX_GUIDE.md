# 🏗️ PRIMARY DOMAIN CONFIGURATION FIX

# Phase 7.1: Critical Infrastructure Gap Resolution

## Issue Analysis

- **Problem**: appointmentbooking.co.za returns 404 Not Found
- **Root Cause**: Domain not properly configured in Cloudflare Pages
- **Impact**: Complete platform unavailability

## Resolution Strategy

1. Create primary domain routing configuration
2. Deploy domain configuration via CI/CD
3. Validate domain accessibility and SSL
4. Test multi-tenant routing functionality

## Implementation Steps

### Step 1: Domain Configuration Template

```typescript
// pages/domain-routing.tsx
import { NextRequest, NextResponse } from 'next/server';

// Multi-tenant domain router
export async function middleware(req: NextRequest) {
    const hostname = req.headers.get('host');
    const url = new URL(req.url);
    
    // Primary domain routing logic
    if (hostname === 'appointmentbooking.co.za') {
        // Route to main landing page or tenant selection
        if (url.pathname === '/' || url.pathname === '/index') {
            return NextResponse.redirect('https://instylehairboutique.co.za');
        }
        // Route to specific tenant or main platform
        return NextResponse.rewrite(new URL('/platform', req.url));
    }
    
    // Tenant-specific domains
    if (hostname.includes('.appointmentbooking.co.za')) {
        // Route to tenant-specific application
        const tenant = hostname.split('.')[0];
        return NextResponse.rewrite(new URL(`/${tenant}`, req.url));
    }
    
    // Default routing
    return NextResponse.next();
}
```

### Step 2: Cloudflare Pages Configuration Update

```json
{
  "build_config": {
    "build_command": "pnpm run build",
    "output_dir": "out",
    "root_dir": "."
  },
  "domains": [
    "appointmentbooking.co.za",
    "www.appointmentbooking.co.za"
  ],
  "redirect_rules": [
    {
      "from": "https://appointmentbooking.co.za",
      "to": "https://instylehairboutique.co.za",
      "permanent": true
    }
  ]
}
```

### Step 3: DNS Configuration

```
Type: CNAME
Name: @
Content: instylehairboutique.co.za
Proxy: Enabled (Orange cloud)

Type: CNAME  
Name: www
Content: instylehairboutique.co.za
Proxy: Enabled (Orange cloud)
```

## Deployment Commands

```bash
# Deploy domain configuration
wrangler pages deploy --project-name=appointmentbooking-primary --branch=main

# Verify domain configuration
curl -I https://appointmentbooking.co.za

# Test multi-tenant routing
curl -H "Host: tenant1.appointmentbooking.co.za" https://appointmentbooking.co.za
```

## Validation Checklist

- [ ] Domain resolves correctly
- [ ] SSL certificate is valid
- [ ] Multi-tenant routing works
- [ ] Response time < 200ms
- [ ] No 404 errors

## Next Steps

1. Deploy this configuration via CI/CD
2. Test domain accessibility globally
3. Validate tenant routing functionality
4. Monitor for any routing issues
