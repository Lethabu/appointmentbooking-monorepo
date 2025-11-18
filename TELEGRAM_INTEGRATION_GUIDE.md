# 🤖 Telegram Bot Integration Guide

## Overview

This guide walks you through setting up Telegram Bot integration for your appointment booking system. The integration provides:

- **Automated booking confirmations** with interactive buttons
- **Appointment reminders** with reschedule/cancel options
- **Customer support chatbot** for common queries
- **Multi-channel messaging** (WhatsApp + Telegram)

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start conversation** with `/start`
3. **Create new bot** with `/newbot`
4. **Choose bot name**: `Instyle Hair Boutique Bot`
5. **Choose username**: `instyle_booking_bot` (must end with 'bot')
6. **Save the token** - you'll need it for configuration

### Step 2: Configure Environment Variables

Add these to your `.env` file:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBHOOK_SECRET=your_secure_random_string_here
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=instyle_booking_bot
```

### Step 3: Set Webhook URL

Replace `YOUR_BOT_TOKEN` and `YOUR_DOMAIN` in this URL and visit it in your browser:

```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://YOUR_DOMAIN/api/webhooks/telegram&secret_token=your_secure_random_string_here
```

Example:
```
https://api.telegram.org/bot1234567890:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://www.instylehairboutique.co.za/api/webhooks/telegram&secret_token=my_secret_123
```

### Step 4: Test Your Bot

1. **Find your bot** on Telegram by searching `@instyle_booking_bot`
2. **Start conversation** with `/start`
3. **Test commands**: `/book`, `/help`

## 🎯 Features & Commands

### Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message with quick actions |
| `/book` | Start booking process |
| `/help` | Show help and contact info |

### Interactive Features

- **Booking confirmations** with reschedule/cancel buttons
- **Appointment reminders** with confirmation buttons
- **Service selection** with inline keyboards
- **Location sharing** and contact information
- **Fallback to WhatsApp** if Telegram fails

## 📱 Customer Experience

### 1. Booking Confirmation
```
🎉 Booking Confirmed!

📋 Service: Middle & Side Installation
📅 Date: 15 Dec 2024
⏰ Time: 2:00 PM
💰 Price: R300.00

Thank you for choosing Instyle Hair Boutique!
We look forward to seeing you.

[📅 Reschedule] [❌ Cancel]
[📍 Get Directions] [📞 Contact Us]
```

### 2. Appointment Reminder
```
⏰ Appointment Reminder

Your appointment is coming up tomorrow!

📋 Service: Middle & Side Installation
📅 Date: 15 Dec 2024
⏰ Time: 2:00 PM
📍 Location: 123 Main St, Cape Town

Please arrive 10 minutes early.
- Instyle Hair Boutique

[✅ Confirm Attendance] [📅 Reschedule]
[📍 Get Directions]
```

## 🔧 Technical Implementation

### Multi-Channel Messaging

The system automatically:

1. **Tries Telegram first** (if customer has Telegram)
2. **Falls back to WhatsApp** if Telegram fails
3. **Tracks delivery status** across channels
4. **Provides unified API** for all messaging

### Usage in Code

```typescript
import { messaging } from '@/lib/messaging';

// Send booking confirmation
await messaging.sendBookingConfirmation(
  {
    phone: '+27123456789',
    telegramChatId: '123456789', // Optional
    preferredChannel: 'telegram'
  },
  {
    service: 'Middle & Side Installation',
    date: '15 Dec 2024',
    time: '2:00 PM',
    price: 30000, // in cents
    businessName: 'Instyle Hair Boutique',
    bookingId: 'booking_123',
    customerName: 'Jane Doe'
  }
);
```

## 🛠 Advanced Configuration

### Custom Bot Commands

Add new commands in `lib/telegram.ts`:

```typescript
private async handleMessage(message: any): Promise<void> {
  const text = message.text;
  
  if (text === '/prices') {
    await this.sendPriceList(message.chat.id);
  } else if (text === '/location') {
    await this.sendLocation(message.chat.id);
  }
}
```

### Webhook Security

The webhook verifies requests using a secret token:

```typescript
const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
const providedToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
```

### Database Integration

To link customers with Telegram:

```sql
-- Add telegram_chat_id to customers table
ALTER TABLE customers ADD COLUMN telegram_chat_id VARCHAR(50);

-- Index for faster lookups
CREATE INDEX idx_customers_telegram_chat_id ON customers(telegram_chat_id);
```

## 📊 Analytics & Monitoring

### Message Delivery Tracking

```typescript
// Track successful deliveries
const result = await messaging.sendBookingConfirmation(contact, booking);
console.log(`Delivered via: ${result.channels.join(', ')}`);
```

### Bot Analytics

Monitor bot usage:
- Message volume per day
- Command usage statistics
- Customer engagement rates
- Channel preference trends

## 🚨 Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check webhook URL is correct
   - Verify bot token in environment variables
   - Check webhook secret matches

2. **Messages not sending**
   - Verify customer has started conversation with bot
   - Check Telegram API rate limits
   - Ensure proper error handling

3. **Webhook errors**
   - Check server logs for detailed errors
   - Verify SSL certificate is valid
   - Test webhook endpoint manually

### Debug Commands

```bash
# Check webhook status
curl https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo

# Test webhook endpoint
curl -X GET https://your-domain.com/api/webhooks/telegram

# Send test message
curl -X POST https://api.telegram.org/botYOUR_TOKEN/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"CHAT_ID","text":"Test message"}'
```

## 🎯 Business Benefits

### Cost Savings
- **Free messaging**: No per-message costs
- **Reduced support**: Automated responses
- **Higher engagement**: Interactive buttons

### Customer Experience
- **Instant notifications**: Real-time updates
- **Easy rescheduling**: One-click actions
- **Multi-platform**: Choose preferred channel

### Operational Efficiency
- **Automated reminders**: Reduce no-shows
- **Self-service options**: Less manual work
- **Unified messaging**: Single API for all channels

## 🔮 Future Enhancements

### Planned Features
- **Payment integration**: Pay via Telegram
- **Photo sharing**: Send service photos
- **Group bookings**: Family/group appointments
- **Loyalty program**: Points and rewards
- **AI chatbot**: Advanced customer support

### Integration Opportunities
- **Calendar sync**: Google/Outlook integration
- **CRM integration**: Customer data sync
- **Analytics dashboard**: Real-time metrics
- **Multi-language**: Support multiple languages

## 📞 Support

Need help with Telegram integration?

- **Documentation**: This guide covers most scenarios
- **Code examples**: Check `lib/telegram.ts` for implementation details
- **Testing**: Use the webhook health check endpoint
- **Monitoring**: Check server logs for detailed error messages

---

**Ready to go live?** Follow the Quick Setup steps above and your customers will start receiving Telegram notifications within minutes! 🚀