# Tenant Onboarding Guide

## Overview

Welcome to **AppointmentBooking.co.za** — an independent, cloud-native appointment booking platform built on Cloudflare Workers and D1.

This guide covers the complete onboarding process for new tenants (like Instyle Hair Boutique).

---

## Pre-Onboarding Checklist

**Requirements:**
- [ ] Business name and tenant identifier (e.g., `instylehairboutique`)
- [ ] Contact email for admin account
- [ ] Business hours and operating days
- [ ] List of services with pricing and duration
- [ ] Staff names and email addresses
- [ ] Optional: Historical appointment data from legacy system
- [ ] Optional: Product inventory data

**Best Practices:**
- Have all team members review the platform before go-live
- Set up DNS records pointing to Cloudflare (if using custom domain)
- Prepare customer communication (email, SMS templates) for booking confirmations

---

## Step 1: Tenant Registration

### 1.1 Create Tenant Record

**Via Dashboard** (when admin panel is ready):
1. Navigate to Admin Console → Tenants
2. Click "Add New Tenant"
3. Fill in details:
   - Business Name: `Instyle Hair Boutique`
   - Slug: `instylehairboutique`
   - Website: `https://www.instylehairboutique.co.za`
   - Contact Email: `admin@instylehairboutique.co.za`
   - Currency: `ZAR`
   - Timezone: `Africa/Johannesburg`
4. Click "Create Tenant"
5. **Note the Tenant ID** (e.g., `ccb12b4d-ade6-467d-a614-7c9d198ddc70`)

**Via SQL** (for development):
```sql
INSERT INTO tenants (id, name, slug, website, email, currency, timezone, config, created_at, updated_at)
VALUES (
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'Instyle Hair Boutique',
  'instylehairboutique',
  'https://www.instylehairboutique.co.za',
  'admin@instylehairboutique.co.za',
  'ZAR',
  'Africa/Johannesburg',
  '{"brand_color":"#C0392B","support_email":"support@instylehairboutique.co.za","payment_gateway":"payfast"}',
  (strftime('%s', 'now')),
  (strftime('%s', 'now'))
);
```

---

## Step 2: Configure Services

### 2.1 Add Services

Each tenant can offer multiple services. For Instyle:

**Via Dashboard** → Services → Add Service:

| Service | Duration | Price (ZAR) | Description |
|---------|----------|------------|-------------|
| Premium Installation | 60 min | R300 | Expert installation for middle & side parts |
| Traditional Styling | 60 min | R350 | Maphondo, lines, and intricate patterns |
| Soft Glam Makeup | 120 min | R450 | Professional makeup application |
| Quick Touch-Up | 30 min | R150 | Quick adjustments and styling |

**Via SQL**:
```sql
INSERT INTO services (id, tenant_id, name, description, duration_minutes, price_cents, category, created_at, updated_at)
VALUES 
  ('svc_001', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Premium Installation', 'Expert installation', 60, 30000, 'installation', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('svc_002', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Traditional Styling', 'Styling services', 60, 35000, 'styling', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('svc_003', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Soft Glam Makeup', 'Makeup application', 120, 45000, 'makeup', (strftime('%s', 'now')), (strftime('%s', 'now')));
```

### 2.2 Set Product Offerings (Optional)

Add products available for sale or upsell:

| Product | Price | Description |
|---------|-------|-------------|
| Luxury Hair Oil | R150 | Premium shine & health |
| Styling Gel | R85 | Strong hold formula |
| Deep Conditioner | R110 | Repair & hydrate |
| Edge Control | R75 | Sleek edges control |

---

## Step 3: Register Staff Members

### 3.1 Add Staff

**Via Dashboard** → Staff → Add Member:
- Name, Email, Phone
- Role (Stylist, Makeup Artist, etc.)
- Services they provide

**Via SQL**:
```sql
INSERT INTO staff (id, tenant_id, name, email, phone, role, created_at, updated_at)
VALUES 
  ('staff_001', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'zindzi@instylehairboutique.co.za', '+27 21 123 4567', 'Stylist', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('staff_002', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'noma@instylehairboutique.co.za', '+27 21 234 5678', 'Makeup Artist', (strftime('%s', 'now')), (strftime('%s', 'now')));
```

---

## Step 4: Configure Working Schedules

### 4.1 Set Weekly Schedules

**Via Dashboard** → Schedules → Create:

For each staff member, define:
- Days available (Mon-Sat)
- Working hours (e.g., 9:00 AM - 5:00 PM)
- Break times (if applicable)

**Example: Zindzi**
```
Monday-Friday: 9:00 AM - 5:00 PM
Saturday: 8:00 AM - 4:00 PM
Closed: Sunday
```

**Via SQL** (using dashboard is easier, but here's SQL for reference):
```sql
INSERT INTO staff_schedules (id, tenant_id, staff_id, staff_name, day_of_week, start_time, end_time, is_available, created_at, updated_at)
VALUES 
  ('sch_001', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_001', 'Zindzi', 1, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_002', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_001', 'Zindzi', 2, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  -- ... repeat for all days
  ('sch_007', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_001', 'Zindzi', 6, '08:00', '16:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now')));
```

### 4.2 Test Availability

Test that the availability engine works:

```bash
# Test availability for tomorrow
curl -X GET "https://www.instylehairboutique.co.za/api/tenant/ccb12b4d-ade6-467d-a614-7c9d198ddc70/availability?date=2025-12-11&serviceId=svc_001" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "slots": [
    { "start": "2025-12-11T09:00:00Z", "end": "2025-12-11T10:00:00Z" },
    { "start": "2025-12-11T09:30:00Z", "end": "2025-12-11T10:30:00Z" },
    ...
  ]
}
```

---

## Step 5: Customize Booking Page

### 5.1 Update Branding

Configure colors, logos, and messaging:

**Via Dashboard** → Settings → Branding:
- Primary Color: `#C0392B` (Crimson)
- Logo: Upload `instyle-logo.png`
- Business Description: "Premium hair services in Cape Town"
- Thank You Message: "Thank you for booking with Instyle!"

**Via Config JSON**:
```json
{
  "brand_color": "#C0392B",
  "logo_url": "https://cdn.instylehairboutique.co.za/logo.png",
  "description": "Premium hair installations, styling, and makeup services",
  "support_email": "support@instylehairboutique.co.za",
  "support_phone": "+27 21 123 4567",
  "social_links": {
    "instagram": "https://instagram.com/instylehairboutique",
    "facebook": "https://facebook.com/instylehairboutique",
    "tiktok": "https://tiktok.com/@instylehairboutique"
  }
}
```

### 5.2 Set Booking Rules

**Via Dashboard** → Settings → Booking Rules:
- Minimum notice: 24 hours
- Maximum advance booking: 90 days
- Cancellation policy: Free up to 24 hours
- Deposit required: Yes (for premium services)

---

## Step 6: Payment Integration

### 6.1 Configure Payment Gateway

Choose payment processor:

**Option 1: PayFast (South African)**
1. Sign up at https://www.payfast.co.za
2. Get Merchant ID and Passphrase
3. Update tenant config:
```json
{
  "payment_gateway": "payfast",
  "payfast_merchant_id": "123456",
  "payfast_passphrase": "secret_phrase"
}
```

**Option 2: Stripe**
1. Create Stripe account
2. Get API keys
3. Update tenant config:
```json
{
  "payment_gateway": "stripe",
  "stripe_public_key": "pk_live_...",
  "stripe_secret_key": "sk_live_..."
}
```

### 6.2 Test Payment Flow

1. Create test booking
2. Proceed to payment
3. Use test card: `4242 4242 4242 4242` (Stripe) or test account (PayFast)
4. Verify transaction appears in payment gateway dashboard
5. Confirm appointment created in database

---

## Step 7: Communication Setup

### 7.1 Email Notifications

Configure automated emails:

**Booking Confirmation Template**:
```
Dear {customer_name},

Thank you for booking with Instyle Hair Boutique!

Service: {service_name}
Date: {booking_date}
Time: {booking_time}
Staff: {staff_name}
Price: R{service_price}

Location: Instyle Hair Boutique, Cape Town
Phone: +27 21 123 4567

We look forward to seeing you!

Best regards,
The Instyle Team
```

**Via Dashboard** → Settings → Email Templates:
- Booking Confirmation
- Reminder (24 hours before)
- Cancellation Confirmation
- Payment Receipt

### 7.2 SMS Reminders (Optional)

Integrate SMS provider (e.g., Twilio) for appointment reminders:
```
Hi {customer_name}, reminder: Your appointment at Instyle is tomorrow at {booking_time}. Reply CONFIRM or CANCEL.
```

---

## Step 8: Launch Checklist

Before going live:

**Platform Testing:**
- [ ] Service catalog complete and pricing correct
- [ ] Staff schedules set for 2 weeks ahead
- [ ] Availability endpoint returns correct slots
- [ ] Booking flow works end-to-end
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] Booking confirmation appears in database

**Admin Access:**
- [ ] Dashboard access working
- [ ] Can view all bookings
- [ ] Can add/edit schedules
- [ ] Can manage staff

**Customer Facing:**
- [ ] Public booking page displays correctly
- [ ] Services and pricing visible
- [ ] Date picker works
- [ ] Availability updates in real-time
- [ ] Mobile responsive

**Data & Security:**
- [ ] Historical data migrated (if applicable)
- [ ] Backup of SuperSaaS data
- [ ] GDPR-compliant data handling
- [ ] Payment data never stored locally

---

## Step 9: Go Live

### 9.1 Traffic Cutover

**Option 1: Gradual Cutover**
1. Run parallel booking systems for 1 week
2. 50% traffic to new platform
3. Monitor for issues
4. Move to 100%

**Option 2: Hard Cutover**
1. Set SuperSaaS to read-only
2. Direct all traffic to new platform
3. Have support team on standby
4. Keep SuperSaaS backup available

### 9.2 Post-Launch Monitoring

**Monitor for 24 hours:**
- Availability endpoint response times
- Booking success rate
- Payment processing
- Error logs
- Customer feedback

**Alert Thresholds:**
- Response time > 500ms → investigate
- Error rate > 1% → escalate
- Zero bookings > 2 hours → check if booking page is down

---

## Troubleshooting

### Problem: No availability slots showing
**Steps:**
1. Check services exist in database
2. Verify staff schedules are configured
3. Test availability endpoint directly
4. Review error logs

### Problem: Payments not processing
**Steps:**
1. Verify payment gateway credentials
2. Check payment gateway dashboard for errors
3. Test with test card
4. Review transaction logs

### Problem: Bookings not saving
**Steps:**
1. Check database connectivity
2. Verify appointments table exists
3. Review database error logs
4. Check for constraint violations (e.g., invalid service_id)

---

## Tenant Success Metrics

Track these KPIs post-launch:

| Metric | Target | Frequency |
|--------|--------|-----------|
| Bookings per day | 5+ | Daily |
| Cancellation rate | < 10% | Weekly |
| No-show rate | < 5% | Weekly |
| Payment success | > 95% | Daily |
| Customer satisfaction | > 4.5/5 | Monthly |
| Page load time | < 2s | Continuous |

---

## Next Steps for Tenant

After onboarding:

1. **Train Staff**: Walkthrough of dashboard
2. **Customer Communication**: Send announcement email
3. **Social Media**: Update links to new booking page
4. **Website**: Update booking CTA to new platform
5. **Monitor**: Weekly check-ins on metrics and feedback

---

## Support

For issues or questions:
- Email: support@appointmentbooking.co.za
- Phone: +27 (0)21 999 8888
- Documentation: https://docs.appointmentbooking.co.za
- Status Page: https://status.appointmentbooking.co.za

---

**Welcome to the platform! 🎉**
