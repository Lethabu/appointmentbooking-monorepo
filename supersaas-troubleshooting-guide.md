# SuperSaaS API Access Troubleshooting Guide

## Current Issue
The API key `5ciPW7IzfQRQy1wqdTsH6g` is returning **401 "Access denied"** errors, indicating authentication problems.

## Steps to Resolve

### 1. Verify API Key in SuperSaaS Dashboard
1. Log into your SuperSaaS account at https://www.supersaas.com
2. Go to **Account Settings** → **API Settings**
3. Check if the API key `5ciPW7IzfQRQy1wqdTsH6g` is:
   - Still active/valid
   - Has the correct permissions (read access to schedules, appointments, users)
   - Not expired or revoked

### 2. Find Your Account Name
The SuperSaaS API requires your **account name** (subdomain). To find it:
1. Look at your SuperSaaS URL when logged in
2. It should be: `https://[ACCOUNT_NAME].supersaas.com`
3. The account name is the subdomain part

### 3. Get Schedule ID
Your schedule name "Instyle Hair Boutique" might not be the actual ID:
1. In SuperSaaS dashboard, go to your schedule
2. Look at the URL: `https://[account].supersaas.com/schedule/[SCHEDULE_ID]`
3. The SCHEDULE_ID is usually a number (e.g., 123456)

### 4. Alternative Data Access Methods

#### Option A: Export Data from Dashboard
1. Go to SuperSaaS dashboard
2. Navigate to **Reports** → **Export**
3. Export:
   - Appointments (CSV/Excel)
   - Users/Clients (CSV/Excel)
   - Schedule configuration

#### Option B: Use SuperSaaS Webhooks
1. Set up webhooks in SuperSaaS to capture real-time data
2. Store data in your own database
3. Access via your own API

#### Option C: Screen Scraping (Last Resort)
If API access fails, we can create a web scraper to extract data from the SuperSaaS web interface.

## Next Steps

### Immediate Actions:
1. **Check API Key Status**: Log into SuperSaaS and verify the API key
2. **Get Account Name**: Find your exact account subdomain
3. **Get Schedule ID**: Find the numeric schedule ID
4. **Update Environment Variables**: Update `.env` with correct values

### Updated .env Format:
```env
# SuperSaaS Configuration
SUPERSAAS_API_KEY=your_verified_api_key
SUPERSAAS_ACCOUNT_NAME=your_account_subdomain
SUPERSAAS_SCHEDULE_ID=123456  # Numeric ID, not name
```

## Test Script
Once you have the correct credentials, use this test:

```javascript
const client = new SuperSaaSClient('your_account_name', 'your_api_key');
const schedules = await client.getSchedules();
console.log(schedules);
```

## Data We Need to Extract

### 1. Schedule Configuration
- Services list with names, durations, prices
- Available time slots
- Booking rules and restrictions
- Staff/resource assignments

### 2. Client Database
- Client names, emails, phone numbers
- Booking history per client
- Preferences and notes

### 3. Appointments/Bookings
- Past appointments with details
- Upcoming bookings
- Service types and durations
- Payment status

### 4. Pricing Structure
- Service prices
- Package deals
- Discounts and promotions

## Alternative Integration Strategies

If API access remains problematic:

1. **Manual Data Export**: Export CSV files and import into your system
2. **Webhook Integration**: Set up real-time data sync
3. **Hybrid Approach**: Use API for new bookings, manual export for historical data
4. **Migration Strategy**: Gradually move to your own booking system

## Contact SuperSaaS Support
If API issues persist:
- Email: support@supersaas.com
- Mention: API key authentication issues
- Request: API key verification and account name confirmation