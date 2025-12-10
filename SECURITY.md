# 🔒 Security Guide

## 1. Authentication & Authorization

- **Supabase Auth**: Used for user authentication.
- **Row Level Security (RLS)**: Enabled on all database tables to restrict access.
  - Users can only see their own data.
  - Tenants can only see data belonging to their tenant ID.

## 2. API Security

- **CORS**: Configured to allow requests only from trusted domains (`www.instylehairboutique.co.za`).
- **Input Validation**: All API endpoints validate input using `zod` schemas.
- **Environment Variables**: Sensitive keys (OpenAI, PayStack, Supabase Service Role) are stored in environment variables and never exposed to the client.

## 3. Payment Security

- **PayStack**: Payments are processed via PayStack's secure checkout.
- **Webhooks**: Webhook signatures are verified to prevent spoofing.
- **No Card Data**: We never store credit card details on our servers.

## 4. Best Practices

- **Rotate Keys**: Regularly rotate API keys and database credentials.
- **Least Privilege**: Database roles have minimum necessary permissions.
- **Dependencies**: Keep dependencies updated to patch vulnerabilities (`pnpm audit`).

## 5. Incident Response

If a security breach is suspected:
1.  **Revoke Keys**: Immediately rotate all API keys (Supabase, OpenAI, PayStack).
2.  **Check Logs**: Analyze Cloudflare logs for suspicious activity.
3.  **Notify Users**: If user data is compromised, follow GDPR/POPIA notification requirements.
