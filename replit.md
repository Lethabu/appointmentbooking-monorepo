# AppointmentBooking.co.za - Replit Configuration

## Overview

This is a multi-tenant SaaS appointment booking platform built for the South African beauty and wellness industry. The monorepo architecture supports customer-facing booking interfaces, admin dashboards, and marketing sites with integrated payment processing, AI-powered features, and calendar synchronization.

The platform targets a R2.8B market opportunity with enterprise-grade infrastructure designed for 99.9% uptime and global edge deployment via Cloudflare.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure

The project uses pnpm workspaces with three main applications and six shared packages:

**Applications (apps/):**
- `booking` - Next.js 14 customer-facing booking interface
- `dashboard` - Next.js admin analytics and management portal
- `marketing` - Next.js landing pages and marketing site

**Shared Packages (packages/):**
- `auth` - Authentication with RBAC (Role-Based Access Control)
- `db` - Database schema using Drizzle ORM
- `payments` - Multi-gateway payment processing (Paystack focus)
- `ai` - AI-powered features and predictions
- `ui` - Shared React components
- `worker` - Cloudflare Workers for edge computing

### Technology Stack

- **Frontend Framework:** Next.js 14 with App Router and TypeScript
- **Styling:** Tailwind CSS with shadcn/ui component library
- **Database:** Drizzle ORM (designed for Cloudflare D1 and Supabase)
- **Authentication:** Custom enterprise auth with session management
- **Hosting Target:** Cloudflare Pages with Workers for API routes
- **Package Manager:** pnpm with workspace configuration

### Key Design Decisions

1. **Multi-tenant Architecture:** Single codebase serves multiple business tenants with isolated data and customizable branding

2. **Edge-First Deployment:** Cloudflare Workers and Pages provide global distribution with sub-200ms response times

3. **Modular Package Structure:** Shared packages enable code reuse across applications while maintaining clear boundaries

4. **South African Market Focus:** Paystack payment integration, POPIA compliance, and ZAR currency support

## External Dependencies

### Payment Processing
- **Paystack:** Primary payment gateway for South African market
- **Multi-gateway support:** Architecture supports additional providers

### Calendar Integration
- **Google Calendar:** OAuth-based calendar synchronization
- **Outlook/iCal:** Additional calendar provider support

### AI Services
- **Google Generative AI:** Powers NiaChatAgent conversational interface
- **OpenAI API:** Alternative AI provider support

### Infrastructure
- **Cloudflare:** Pages hosting, Workers, D1 database, CDN, DNS management
- **Supabase:** PostgreSQL database with real-time capabilities (alternative to D1)
- **SuperSaaS:** Legacy booking system integration for migration

### Third-Party Integrations
- **Telegram:** Bot integration for notifications
- **Email Services:** Notification and confirmation emails

### Development Tools
- **Wrangler CLI:** Cloudflare deployment and local development
- **Drizzle Kit:** Database migration management
- **TypeScript:** Strict type checking across all packages