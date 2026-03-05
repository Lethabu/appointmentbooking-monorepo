# 🦅 Sovereign WhatsApp Integration Guide

## Overview

The AppointmentBooking platform has migrated from AISensy to **Direct Meta Cloud API** integration, eliminating the monthly subscription fee and achieving true Sovereign architecture.

## Cost Comparison

| Service | Monthly Cost | Integration Complexity | Sovereign Status |
|---------|--------------|------------------------|------------------|
| AISensy | ~$49-199/mo | Low (managed) | ❌ Dependency |
| Direct Meta API | **$0/mo** | Medium (direct) | ✅ **Sovereign** |

## Architecture

```
┌─────────────────────┐
│  Next.js Booking    │
│  (Cloudflare Pages) │
└──────────┬──────────┘
           │
           │ Import: @/lib/whatsapp/client
           │
           ▼
┌─────────────────────┐
│ SovereignWhatsApp   │
│      Client         │
└──────────┬──────────┘
           │
           │ HTTPS POST
           │
           ▼
┌─────────────────────┐
│ Meta Graph API      │
│   v21.0/messages    │
└─────────────────────┘
```

## Setup Instructions

### 1. Meta Business Manager Configuration

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Navigate to **System Users** > **Create System User**
3. Grant permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
4. Generate **Permanent Token** (does not expire)
5. Copy:
   - System User Token → `META_SYSTEM_USER_TOKEN`
   - Phone Number ID → `META_PHONE_NUMBER_ID`

### 2. Environment Variables

Add to Cloudflare Pages environment:

```bash
# Via Cloudflare Dashboard
# Settings > Environment Variables > Production & Preview

META_SYSTEM_USER_TOKEN=EAA...permanent_token
META_PHONE_NUMBER_ID=123456789012345
```

Or via Wrangler CLI:

```bash
npx wrangler pages secret put META_SYSTEM_USER_TOKEN
npx wrangler pages secret put META_PHONE_NUMBER_ID
```

### 3. WhatsApp Message Templates

Before sending messages, you **must** create and get approval for message templates in Meta Business Manager.

**Required Templates:**

1. **booking_confirmation**
   ```
   Hello {{1}}, your booking for {{2}} on {{3}} with {{4}} at {{5}} is confirmed! 
   ```

2. **appointment_reminder**
   ```
   Hi {{1}}, this is a reminder for your {{2}} appointment on {{3}} at {{4}}.
   ```

**Approval Process:**
- Go to Meta Business Manager > WhatsApp Manager > Message Templates
- Create template with exact name (e.g., `booking_confirmation`)
- Wait for Meta approval (usually 24-72 hours)
- Once approved, templates can be sent via API

### 4. Code Usage

#### Basic Message Send

```typescript
import { sovereignWhatsApp } from '@/lib/whatsapp';

// Send booking confirmation
await sovereignWhatsApp.sendBookingConfirmation('+27821234567', {
  customerName: 'John Doe',
  serviceName: 'Haircut',
  dateTime: '2026-02-20 at 10:00 AM',
  stylistName: 'Jane Smith',
  businessName: 'InStyle Hair Boutique'
});
```

#### Custom Template

```typescript
import { sovereignWhatsApp } from '@/lib/whatsapp';

// Send custom template
await sovereignWhatsApp.sendMessage(
  '+27821234567',
  'your_template_name',
  'en',
  [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'Parameter 1' },
        { type: 'text', text: 'Parameter 2' }
      ]
    }
  ]
);
```

#### Check Configuration

```typescript
import { sovereignWhatsApp } from '@/lib/whatsapp';

if (!sovereignWhatsApp.isConfigured()) {
  console.error('WhatsApp client not configured!');
}
```

## Testing

### Test Phone Number Registration

During development, you can only send to phone numbers registered as test numbers:

1. Meta Business Manager > WhatsApp Manager > Settings
2. Add test phone numbers
3. Each number must verify via 6-digit code

### Send Test Message

```bash
# Using Node.js script
node -e "
const { sovereignWhatsApp } = require('./apps/booking/lib/whatsapp');
sovereignWhatsApp.sendMessage('+27821234567', 'booking_confirmation', 'en')
  .then(res => console.log('Success:', res))
  .catch(err => console.error('Error:', err));
"
```

## Monitoring

### Health Check

The sovereign self-check endpoint reports WhatsApp integration status:

```bash
curl https://appointmentbooking-coza.pages.dev/api/sovereign/self-check
```

Expected response includes:
```json
{
  "empire": {
    "direct_integrations": ["meta_cloud_api"],
    "dependencies_eliminated": ["aisensy"]
  }
}
```

### Error Handling

All errors are logged with prefix `🦅 Sovereign WhatsApp Error:` for easy tracking in Cloudflare logs.

## Migration from AISensy

The old AISensy functions are still exported for backwards compatibility but will log deprecation warnings:

```typescript
// ❌ Old (deprecated)
import { aisensy } from '@/lib/aisensy';
await aisensy.sendWhatsAppMessage('+27821234567', 'message');

// ✅ New (Sovereign)
import { sovereignWhatsApp } from '@/lib/whatsapp';
await sovereignWhatsApp.sendBookingConfirmation('+27821234567', details);
```

## Troubleshooting

### "Missing credentials" Warning

**Cause:** Environment variables not set  
**Fix:** Add `META_SYSTEM_USER_TOKEN` and `META_PHONE_NUMBER_ID` to Cloudflare Pages

### "Template not found" Error

**Cause:** Template not created or not approved in Meta Business Manager  
**Fix:** Create template and wait for approval (24-72 hours)

### "Recipient not registered" Error

**Cause:** Sending to non-test number in development  
**Fix:** Register phone as test number in Meta Business Manager

### API Error 403

**Cause:** Token expired or insufficient permissions  
**Fix:** Regenerate permanent token with correct permissions

## Security Considerations

- **Never commit tokens:** Use environment variables only
- **Permanent tokens:** Rotate every 90 days for security
- **Phone number format:** Always use E.164 format (+27821234567)
- **Rate limits:** Meta allows ~1000 messages/day for test accounts
- **Production limits:** Contact Meta for higher limits

## Support

For Meta Cloud API issues:
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)

For Sovereign integration issues:
- Check Cloudflare logs: `npx wrangler pages deployment tail`
- Verify environment variables: `npx wrangler pages deployment list`
- God Mode query: `.\scripts\god-mode-query.ps1 "SELECT * FROM bookings WHERE id=123"`

---

**Status:** ✅ Sovereign Integration Active  
**Cost Savings:** $49-199/month eliminated  
**Mode:** GOD_MODE 🦅
