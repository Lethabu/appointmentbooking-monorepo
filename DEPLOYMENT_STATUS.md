# 🚀 Deployment Status Report

## 1. Cloudflare Worker (Main Website)

- **URL:** [https://instylehairboutique.co.za](https://instylehairboutique.co.za)
- **Status:** ✅ **Live**
- **Content:** Landing Page, Trust Signals, API Routes (`/api/tenant`, `/api/book`, `/api/products`).

## 2. Dashboard (Admin)

- **URL:** [https://instyle-dashboard.pages.dev](https://instyle-dashboard.pages.dev)
- **Status:** ✅ **Live**
- **Custom Domain:** `dashboard.instylehairboutique.co.za` (Requires mapping via Cloudflare Dashboard).
- **Features:** synced Appointment Data, Revenue Stats.

## 3. Shop / Booking App

- **Project Name:** `instyle-shop`
- **Build Status:** ⏳ **Building...** (Using Static Export)
- **Target URL:** `https://instyle-shop.pages.dev`
- **Custom Domain:** `shop.instylehairboutique.co.za` (To be mapped).

## 4. Next Steps

1. **Wait for Booking Build** to complete.
2. **Deploy Shop** to Cloudflare Pages.
3. **Restore API Routes** in local codebase.
4. **Map Custom Domains** in Cloudflare Dashboard:
    - Go to **Pages** > **instyle-dashboard** > **Custom Domains** > Add `dashboard.instylehairboutique.co.za`.
    - Go to **Pages** > **instyle-shop** > **Custom Domains** > Add `shop.instylehairboutique.co.za`.

*Note: CLI domain mapping is currently unavailable in this environment, so manual mapping in the dashboard is required.*
