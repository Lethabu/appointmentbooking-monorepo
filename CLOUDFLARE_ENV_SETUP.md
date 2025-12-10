# ☁️ Cloudflare Environment Variables Setup

To ensure the Instyle Hair Boutique platform functions correctly in production, you must configure the following environment variables in your Cloudflare Pages project settings.

## 1. Navigate to Settings
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Go to **Workers & Pages**.
3.  Select your project: `appointmentbooking-monorepo` (or whatever you named it).
4.  Go to **Settings** > **Environment variables**.
5.  Click **Add variables** (Production).

## 2. Required Variables

Add the following variables. **Do not wrap values in quotes.**

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API calls | `https://www.instylehairboutique.co.za` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `https://www.instylehairboutique.co.za` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key | `eyJhbGciOiJIUzI1Ni...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role (Backend) | `eyJhbGciOiJIUzI1Ni...` |
| `OPENAI_API_KEY` | OpenAI API Key for AI Agent | `sk-proj-...` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | PayStack Public Key | `pk_live_...` |
| `PAYSTACK_SECRET_KEY` | PayStack Secret Key | `sk_live_...` |
| `SUPERSAAS_API_KEY` | SuperSaaS API Key | `pVq0j8Sm...` |
| `SUPERSAAS_ACCOUNT` | SuperSaaS Account Name | `InStyle_Hair_Boutique` |
| `SUPERSAAS_SCHEDULE_ID` | SuperSaaS Schedule ID | `695384` |

## 3. Verify Setup
After adding these variables, you must **redeploy** your application for them to take effect.
1.  Go to **Deployments**.
2.  Click the three dots `...` next to the latest deployment.
3.  Select **Retry deployment**.

## 4. Troubleshooting
If the AI Agent or Database connections fail:
- Check the **Real-time Logs** in the Cloudflare Dashboard.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (it's critical for backend operations).
- Ensure `OPENAI_API_KEY` starts with `sk-`.
