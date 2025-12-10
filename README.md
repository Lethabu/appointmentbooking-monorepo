# Appointment Booking Monorepo

## Overview
This is a monorepo for the Appointment Booking system, containing:
- `apps/booking`: The main customer-facing booking application.
- `apps/dashboard`: Admin dashboard.
- `packages/*`: Shared libraries (auth, db, ui).

## Quick Start
1.  Install dependencies:
    ```bash
    pnpm install
    ```
2.  Run the booking app:
    ```bash
    cd apps/booking
    npm run dev
    ```

## Documentation
- [Development Guide](docs/DEVELOPMENT.md)
- [Architecture Report](.agent/audit/ARCHITECTURE_REPORT.md)

## Recent Updates
- Removed `@vercel/analytics` and Vercel-specific configurations.
- Added Playwright E2E tests.
- Fixed SSR issues with browser globals.
- Improved error handling in `TenantHome` component.
