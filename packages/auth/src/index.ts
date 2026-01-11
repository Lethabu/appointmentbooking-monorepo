import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getDb } from "@repo/db";
import { eq } from "drizzle-orm";
import { users, tenants } from "@repo/db";

export interface AuthEnv {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
}

// Export RBAC functionality
export * from './rbac';

export function getAuthOptions(env: AuthEnv): NextAuthOptions {
  const db = getDb({ DB: env.DB });

  // Helper function to extract tenant from request with proper validation
  function getTenantFromRequest(): string | null {
    // Get tenant from various sources in order of priority

    // 1. Check subdomain (e.g., tenant.app.com)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'appointmentbooking') {
        return subdomain;
      }
    }

    // 2. Check URL path pattern (/tenant/page)
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1 && pathParts[1]) {
        const potentialTenant = pathParts[1];
        if (potentialTenant !== 'api' && potentialTenant !== 'auth') {
          return potentialTenant;
        }
      }
    }

    // 3. Check query parameter (?tenant=tenant-slug)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tenantParam = urlParams.get('tenant');
      if (tenantParam) {
        return tenantParam;
      }
    }

    // Default to instylehairboutique for backward compatibility
    return 'instylehairboutique';
  }

  return {
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid https://www.googleapis.com/auth/calendar",
          },
        },
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        if (token.tenantId && session.user) {
          (session.user as any).tenantId = token.tenantId;
        }
        (session as any).accessToken = token.accessToken;
        return session;
      },
      async jwt({ token, user, account, profile }) {
        if (user && account) {
          // This is the first sign-in
          token.accessToken = account.access_token;

          // Get tenant from request headers or subdomain
          const tenantId = getTenantFromRequest();

          if (tenantId) {
            // Verify tenant exists
            const tenant = await db
              .select()
              .from(tenants)
              .where(eq(tenants.slug, tenantId)) // Match by slug
              .limit(1);

            if (tenant.length > 0) {
              const tenantRecord = tenant[0];
              token.tenantId = tenantRecord.id;

              // Ensure user exists in our database with tenant association
              const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, user.email!))
                .limit(1);

              if (existingUser.length === 0) {
                // Create user with tenant association
                await db.insert(users).values({
                  id: user.id,
                  email: user.email!,
                  name: user.name,
                  tenantId: tenantRecord.id,
                  google_access_token: account.access_token,
                  google_refresh_token: account.refresh_token,
                  google_token_expires_at: new Date(account.expires_at as number * 1000),
                });
              } else {
                // Update user with new tokens
                await db
                  .update(users)
                  .set({
                    google_access_token: account.access_token,
                    google_refresh_token: account.refresh_token,
                    google_token_expires_at: new Date(account.expires_at as number * 1000),
                  })
                  .where(eq(users.id, existingUser[0].id));
              }
            }
          }
        }
        return token;
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    session: {
      strategy: "jwt",
    },
  };
}
