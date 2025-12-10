# InStyle Hair Boutique - Complete Platform Guide

## 🎉 Platform URLs

### Production Sites
- **Booking Site**: https://www.instylehairboutique.co.za
- **Dashboard**: https://dashboard.appointmentbooking.co.za/instylehairboutique
- **Marketing/Landing Page**: https://appointmentbooking.co.za

### Contact Information
- **Phone**: +27 69 917 1527
- **WhatsApp**: https://wa.me/27699171527
- **Email**: info@instylehairboutique.co.za
- **Location**: Cape Town, South Africa

### Social Media
- **Instagram**: https://instagram.com/instylehairboutique
- **Facebook**: https://facebook.com/instylehairboutique
- **TikTok**: https://tiktok.com/@instylehairboutique

---

## 📱 Complete Booking Flow

The booking system implements a 5-step flow with WhatsApp confirmation:

### Step 1: Select Service
- Display all available services (Dynamically fetched from DB)
- Service name, description, price, and duration
- Visual selection with checkmarks

### Step 2: Choose Date & Time
- Calendar date picker (min: today)
- Real-time availability checking
- Time slots displayed in 30-minute intervals
- Business hours enforcement:
  - **Monday-Friday**: 09:00 - 17:00
  - **Saturday**: 08:00 - 16:00
  - **Sunday**: Closed

### Step 3: Customer Details
- Full name (required)
- Email address (required)
- Phone number/WhatsApp (required)

### Step 4: Payment Summary & Booking Fee
- Display complete booking summary
- Show total service price
- Calculate booking fee (20% of service price, minimum R50)
- Explain payment structure:
  - **Booking fee**: Paid now via PayStack
  - **Remaining balance**: Paid at salon
- Secure PayStack payment integration

### Step 5: Confirmation
- Payment link generation
- WhatsApp confirmation button
- Automated message with booking details

---

## 💳 Payment Configuration

### PayStack Integration
- **Booking Fee**: 20% of service price (minimum R50)
- **Payment Gateway**: PayStack
- **Supported Methods**: Card, Bank Transfer, USSD
- **Currency**: ZAR (South African Rand)

---

## 🎨 Branding (Updated)

### Colors
- **Primary**: `#C0392B` (Crimson) - Used for buttons, highlights, and key actions.
- **Secondary**: `#1B1B1B` (Near-Black) - Used for text, footers, and secondary elements.
- **Accent**: `#F9F9F9` (Warm Gray) - Used for backgrounds.
- **Background**: White / Warm Gray

### Design System
- **Typography**: Sans-serif (Inter/Geist) with Serif headings for "Boutique" feel.
- **Vibe**: "Crimson Elegance" - Premium, minimal, high-contrast.
- **Mobile-First**: Optimized for touch interactions.

---

## 📊 Services Offered (Synced)

| Service | Price | Duration | Description |
|---------|-------|----------|-------------|
| Middle & Side Installation | R300 | 60 min | Professional hair installation service |
| Maphondo & Lines Installation | R350 | 60 min | Traditional African hairstyling with intricate patterns |
| Soft Glam Makeup | R450 | 120 min | Professional makeup application service |
| Gel Maphondo Styling | R350 | 120 min | Gel-based traditional styling service |
| Frontal Ponytail Installation | R950 | 120 min | Premium frontal ponytail installation service |

---

## 🔧 Technical Implementation

### Frontend Components
- **InStyleLandingPage.tsx**: Dynamic landing page.
  - Accepts `services` and `products` as props from Server Component.
  - Maps service names to static images (until DB has image support).
  - Uses Tailwind CSS with `instyle-*` config.
- **CompleteBookingFlow.tsx**: Main booking interface.
  - Embedded in the landing page.
  - Handles the multi-step wizard logic.

### API Endpoints
- `/api/public/services` - Fetch available services
- `/api/tenant` - Get tenant configuration
- `/api/availability` - Check available time slots
- `/api/payments/paystack/create` - Create payment
- `/api/book` - Create booking

### Database Tables
- `tenants` - Tenant configuration
- `services` - Service catalog
- `appointments` - Booking records
- `users` - Customer information

---

## 🚀 Deployment

### Current Status
- ✅ **Production Deployed**: Worker deployed to Cloudflare
- ✅ **Database Migrated**: All tables and data synced
- ✅ **DNS Configured**: instylehairboutique.co.za pointing to worker
- ✅ **SSL Enabled**: HTTPS enforced

### Version Information
- **Worker Version**: 09361b7f-b963-41c5-a8d1-d59132fc0a5d
- **Last Deployed**: 2025-11-28
- **Database**: Cloudflare D1 (appointmentbooking-db)

---

## 📞 Support

For technical support or questions:
- **Email**: info@instylehairboutique.co.za
- **WhatsApp**: +27 69 917 1527
