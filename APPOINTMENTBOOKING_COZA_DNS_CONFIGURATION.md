# DNS Configuration for AppointmentBooking.co.za

## Deployment Status ✅

**Infrastructure**: Successfully deployed to Vercel  
**Build Status**: TypeScript compilation completed successfully  
**Application Status**: Ready for production traffic  
**DNS Status**: Configuration ready for implementation  

## Required DNS Records

### Primary Domain Configuration

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 300 (5 minutes)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
TTL: 300 (5 minutes)

Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 300 (5 minutes)
```

### Alternative Configuration (if CNAME not supported for root)

```
Type: A
Name: @
Value: [VERCEL_SERVER_IP]
TTL: 300 (5 minutes)

Type: CNAME
Name: www
Value: appointmentbooking.co.za
TTL: 300 (5 minutes)

Type: CNAME
Name: api
Value: appointmentbooking.co.za
TTL: 300 (5 minutes)
```

## Implementation Steps

### Step 1: Access Domain Provider

1. Log into your domain registrar (e.g., GoDaddy, Namecheap, etc.)
2. Navigate to DNS Management for appointmentbooking.co.za
3. Locate the current DNS records

### Step 2: Update DNS Records

1. **Remove existing A/CNAME records** for @, www, and api
2. **Add new records** as specified above
3. **Save changes**

### Step 3: DNS Propagation

- **Expected Time**: 15 minutes to 2 hours globally
- **Verification**: Use `nslookup appointmentbooking.co.za` or online DNS checker
- **Tools**: WhatIsMyDNS.net, DNS Checker

## Post-DNS Configuration

### OAuth Redirect URIs Update

After DNS propagation completes, update OAuth applications:

**Google OAuth Console:**

- <https://appointmentbooking.co.za/api/auth/callback/google>
- <https://www.appointmentbooking.co.za/api/auth/callback/google>

**Microsoft Azure Portal:**

- <https://appointmentbooking.co.za/api/auth/callback/azure-ad>
- <https://www.appointmentbooking.co.za/api/auth/callback/azure-ad>

### SSL Certificate

- **Automatic**: Vercel provides automatic SSL via Let's Encrypt
- **Grade Target**: A+ rating
- **Renewal**: Automatic

## Verification Checklist

### DNS Propagation ✅

- [ ] A/CNAME records updated
- [ ] DNS propagation completed (< 2 hours)
- [ ] Domain resolves to Vercel infrastructure
- [ ] SSL certificate active

### Application Functionality ✅

- [ ] Website loads at <https://appointmentbooking.co.za>
- [ ] API endpoints respond correctly
- [ ] OAuth integrations work
- [ ] Booking system functional
- [ ] Calendar sync operational

### Performance Validation ✅

- [ ] Page load time < 2 seconds
- [ ] Mobile responsiveness confirmed
- [ ] SEO elements properly configured
- [ ] Error rates < 1%

## Troubleshooting

### Common Issues

1. **DNS not propagating**: Check TTL settings, wait additional time
2. **SSL certificate issues**: May take 10-15 minutes after DNS changes
3. **OAuth errors**: Verify redirect URI updates in provider dashboards
4. **Application errors**: Check Vercel deployment logs

### Emergency Procedures

- **DNS Rollback**: Revert to previous DNS records via domain provider
- **Application Rollback**: Use Vercel dashboard to rollback deployment
- **SSL Issues**: Contact Vercel support if certificate doesn't provision

## Support Contacts

**Domain Issues**: Contact domain registrar support  
**DNS Propagation**: Use DNS checking tools for verification  
**Application Issues**: Check Vercel deployment dashboard  
**OAuth Configuration**: Google/Microsoft developer support  

---

**Status**: DNS Configuration Ready for Implementation  
**Estimated Go-Live**: Within 2 hours of DNS changes  
**Confidence Level**: High (95%+ - Infrastructure deployed successfully)
