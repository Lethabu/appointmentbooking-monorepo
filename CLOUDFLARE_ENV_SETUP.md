# ☁️ Cloudflare Environment Variables Setup

To ensure the Instyle Hair Boutique platform functions correctly in production, you must configure the following environment variables in your Cloudflare Pages project settings.

## 1. Navigate to Settings

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages**.
3. Select your project: `appointmentbooking-monorepo` (or whatever you named it).
4. Go to **Settings** > **Environment variables**.
5. Click **Add variables** (Production).

### Global SaaS Variables (Shared)

| Variable Name | Description | Used By |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`production`) | All |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API calls | Dashboard, Booking |
| `NEXT_PUBLIC_APP_URL` | Application URL | All |

### Authentication (Clerk - SaaS Platform)

| Variable Name | Description | Used By |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | Marketing, Dashboard |
| `CLERK_SECRET_KEY` | Clerk Secret Key | Marketing, Dashboard |

### Database & Backend (Cloudflare/Supabase)

| Variable Name | Description | Used By |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Booking, Worker |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Booking, Worker |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role | Worker |
| `OPENAI_API_KEY` | OpenAI API Key | Worker |

### Integrations (Payments/Sync)

| Variable Name | Description | Used By |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | PayStack Public Key | Booking |
| `PAYSTACK_SECRET_KEY` | PayStack Secret Key | Worker |
| `SUPERSAAS_API_KEY` | SuperSaaS API Key | Worker |
| `SUPERSAAS_ACCOUNT` | SuperSaaS Account Name | Worker |

## 3. Verify Setup

After adding these variables, you must **redeploy** your application for them to take effect.

1. Go to **Deployments**.
2. Click the three dots `...` next to the latest deployment.
3. Select **Retry deployment**.

## 4. Troubleshooting

If the AI Agent or Database connections fail:

- Check the **Real-time Logs** in the Cloudflare Dashboard.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (it's critical for backend operations).
- Ensure `OPENAI_API_KEY` starts with `sk-`.
