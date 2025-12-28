# Appointment Booking Monorepo

A comprehensive, production-ready appointment booking system built for multi-tenant businesses with seamless SuperSaaS integration. Features real-time dashboards, automated marketing, and enterprise-grade architecture.

## 🌟 Key Features

### 🏢 Multi-Tenant Architecture

- **Tenant Isolation**: Complete data separation between businesses
- **Custom Branding**: White-label solutions for each tenant
- **Scalable Design**: Support for thousands of concurrent users

### 📅 Advanced Booking System

- **Real-Time Availability**: Live calendar integration with SuperSaaS
- **Multi-Employee Support**: Parallel scheduling for multiple staff members
- **Service Management**: Dynamic pricing, duration, and categorization
- **Automated Reminders**: SMS, WhatsApp, and email notifications

### 📊 Business Intelligence Dashboard

- **Live Appointment View**: Real-time booking monitoring
- **Revenue Analytics**: Comprehensive financial reporting
- **Client Management**: Customer history and preferences
- **Performance Metrics**: Key business KPIs and trends

### 🤖 AI-Powered Features

- **Conversational Commerce**: Chatbot booking assistance
- **Smart Automation**: Automated marketing campaigns
- **Predictive Analytics**: Demand forecasting and optimization
- **Intelligent Routing**: Optimal staff assignment

### 🔗 Third-Party Integrations

- **SuperSaaS**: Complete calendar synchronization
- **WhatsApp Business**: Automated messaging
- **Payment Gateways**: Paystack, Yoco, PayFast integration
- **Firebase**: Real-time notifications and analytics

## 🛠 Technology Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library

### Backend

- **Cloudflare Workers**: Edge computing platform
- **D1 Database**: SQLite-compatible distributed database
- **Drizzle ORM**: Type-safe database operations
- **NextAuth.js**: Authentication framework

### Infrastructure

- **Cloudflare Pages**: Global CDN deployment
- **Wrangler CLI**: Development and deployment tool
- **Turbo**: Monorepo build system
- **pnpm**: Fast package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- Cloudflare account with Wrangler CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lethabu/appointmentbooking-monorepo.git
   cd appointmentbooking-monorepo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/booking/.env.example apps/booking/.env
   # Edit .env with your API keys
   ```

4. **Deploy database schema**

   ```bash
   pnpm run db:migrate
   ```

5. **Start development server**

   ```bash
   pnpm run dev
   ```

### Production Deployment

```bash
# Build all apps
pnpm run build

# Deploy to Cloudflare
pnpm run deploy
```

## 📁 Project Structure

```javascript
appointmentbooking-monorepo/
├── apps/
│   ├── booking/          # Main booking application
│   ├── dashboard/        # Admin dashboard
│   └── marketing/        # Marketing landing pages
├── packages/
│   ├── auth/            # Authentication package
│   ├── db/              # Database schema and utilities
│   └── ui/              # Shared UI components
├── scripts/             # Automation and migration scripts
└── docs/               # Documentation and audit reports
```

## 🔌 API Endpoints

### Core Booking APIs

- `POST /api/book` - Create new appointment
- `GET /api/appointments` - Retrieve appointments
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

### Tenant Management

- `GET /api/tenant?slug={slug}` - Get tenant configuration
- `POST /api/tenant` - Create new tenant
- `PUT /api/tenant/{id}` - Update tenant settings

### Dashboard & Analytics

- `GET /api/dashboard?tenantId={id}` - Business analytics
- `GET /api/analytics` - Detailed reporting data

### Integration APIs

- `POST /api/supersaas-migrate` - SuperSaaS synchronization
- `POST /api/webhooks/*` - Third-party webhooks
- `POST /api/whatsapp/*` - WhatsApp integration

## 🎨 Usage Examples

### Booking an Appointment

```typescript
const response = await fetch("/api/book", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tenantId: "tenant-uuid",
    serviceId: "service-uuid",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    appointmentDate: "2025-01-15T10:00:00Z"
  })
});
```

### Retrieving Tenant Services

```typescript
const tenant = await fetch(`/api/tenant?slug=instylehairboutique`);
const services = await tenant.json();
```

## 🔧 Development Commands

```bash
# Development
pnpm run dev              # Start all development servers
pnpm run build            # Build all applications
pnpm run lint             # Run ESLint
pnpm run format           # Format code with Prettier

# Database
pnpm run db:generate      # Generate database schema
pnpm run db:migrate       # Run database migrations
pnpm run db:studio        # Open Drizzle Studio

# Deployment
pnpm run deploy           # Deploy to Cloudflare
pnpm run go-live          # Run production checklist
pnpm run verify-api       # Verify production APIs
```

## 🔒 Security Features

- **End-to-end encryption** for sensitive data
- **Rate limiting** on all API endpoints
- **Input validation** and sanitization
- **CORS configuration** for cross-origin requests
- **Authentication guards** for protected routes

## 📈 Performance

- **Edge Computing**: Global low-latency responses
- **Database Optimization**: Indexed queries and caching
- **CDN Delivery**: Static assets served via Cloudflare
- **Lazy Loading**: Components loaded on demand

## 📚 Documentation

- [Development Guide](docs/DEVELOPMENT.md)
- [Architecture Report](.agent/audit/ARCHITECTURE_REPORT.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `pnpm run test`
5. Commit your changes following our commit conventions
6. Push to your branch: `git push origin feature-name`
7. Create a Pull Request with proper description

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:

- **Documentation**: Check `/docs` folder for detailed guides
- **Issues**: Create GitHub issues for bug reports
- **Discussions**: Use GitHub Discussions for questions

## 🏆 Success Stories

**Instyle Hair Boutique** - Successfully migrated from SuperSaaS with:

- 100% service alignment
- Zero data loss during migration
- 4x booking capacity with multi-employee support
- Modern web interface with mobile optimization

## Recent Updates

- Removed `@vercel/analytics` and Vercel-specific configurations
- Added Playwright E2E tests
- Fixed SSR issues with browser globals
- Improved error handling in `TenantHome` component
- Implemented comprehensive version control workflows
- Established branch protection and security policies

---

**Status**: 🟢 Production Ready | **Version**: 1.0.0 | **Last Updated**: December 2025
