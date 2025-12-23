# 📄 Cloudflare Pages Setup Guide

This guide details the specific configuration required for each Next.js application in the monorepo when deploying to Cloudflare Pages.

## 🛠️ General Build Settings

For all apps, use the following build settings in the Cloudflare Dashboard:

- **Framework preset**: `Next.js`
- **Build command**: `npx @cloudflare/next-on-pages` (or `pnpm run pages:build`)
- **Build output directory**: `.vercel/output/static`
- **Compatibility date**: `2024-01-15`
- **Compatibility flags**: `nodejs_compat`

---

## 🚀 Application Specifics

### 1. Marketing Site (`apps/marketing`)

- **Git Branch**: `main`
- **Build Command**: `pnpm run pages:build`
- **Root Directory**: `apps/marketing`
- **Environment Variables**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: `pk_...`
  - `CLERK_SECRET_KEY`: `sk_...`

### 2. Admin Dashboard (`apps/dashboard`)

- **Git Branch**: `main`
- **Build Command**: `pnpm run pages:build`
- **Root Directory**: `apps/dashboard`
- **Environment Variables**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: `pk_...`
  - `CLERK_SECRET_KEY`: `sk_...`
  - `NEXT_PUBLIC_API_BASE_URL`: `https://api.appointmentbooking.co.za`

### 3. Booking Engine (`apps/booking`)

- **Git Branch**: `main`
- **Build Command**: `pnpm run pages:build`
- **Root Directory**: `apps/booking`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_BASE_URL`: `https://api.appointmentbooking.co.za`
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1Ni...`

---

## 🌐 Domain Mapping

| App | Production Domain | Preview Domain |
| :--- | :--- | :--- |
| **Marketing** | `appointmentbooking.co.za` | `marketing.pages.dev` |
| **Dashboard** | `dashboard.appointmentbooking.co.za` | `dashboard.pages.dev` |
| **Booking** | `*.appointmentbooking.co.za` | `booking.pages.dev` |

---

## 🔒 Advanced Configuration

### Middleware Routing

The `apps/booking` app uses `middleware.ts` to handle multi-tenant routing. Ensure that the **Custom Domains** for each tenant are also added to the Cloudflare Pages project settings to allow the middleware to intercept the requests correctly.
