# 🚀 Onboarding Guide - Instyle Hair Boutique

Welcome to the Instyle Hair Boutique project! This guide will help you get started quickly.

## 📚 Key Documentation

- **[QUICK_START.md](./QUICK_START.md)**: The fastest way to get the app running locally.
- **[README.md](./README.md)**: General project overview.
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)**: Status of production deployment.
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**: Detailed deployment instructions.

## 🛠️ Prerequisites

- **Node.js**: v18 or later
- **pnpm**: v9 or later (`npm install -g pnpm`)
- **Wrangler**: for Cloudflare deployment (`npm install -g wrangler`)

## ⚡ Quick Start

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Run Development Server**:
    ```bash
    pnpm dev
    ```
    - Booking App: http://localhost:3000
    - Dashboard: http://localhost:3001
    - Marketing: http://localhost:3002

3.  **Run Tests**:
    ```bash
    pnpm test:e2e --filter booking
    ```

## 🏗️ Project Structure

- **`apps/booking`**: Main booking application (Next.js).
- **`apps/dashboard`**: Admin dashboard (Next.js).
- **`apps/marketing`**: Marketing website (Next.js).
- **`packages/worker`**: Cloudflare Worker for backend API.
- **`packages/db`**: Database schema and Drizzle ORM setup.

## 🚢 Deployment

The project is deployed to Cloudflare Pages and Workers.
See `scripts/go-live-checklist.js` for the automated deployment process.

## 🤝 Contributing

1.  Create a new branch for your feature.
2.  Ensure linting passes: `pnpm lint`.
3.  Ensure tests pass: `pnpm test`.
4.  Submit a Pull Request.
