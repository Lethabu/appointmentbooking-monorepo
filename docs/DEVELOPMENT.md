# Development Guide

## Getting Started

### Prerequisites
- Node.js 20+
- PNPM (`npm install -g pnpm`)

### Installation
```bash
pnpm install
```

### Running the App
To start the booking app:
```bash
cd apps/booking
npm run dev
```
The app will be available at `http://localhost:3000`.

### Testing
We use Playwright for E2E testing.
```bash
cd apps/booking
npx playwright test
```

## Architecture
- **Framework**: Next.js 14 (App Router)
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Common Issues
- **Port 3000 in use**: The dev server will automatically try the next available port (e.g., 3001). Playwright is configured to use `PORT` env var or default to 3000.
- **Socials Missing**: If `config.socials` is missing in the tenant config, the UI handles it gracefully.
