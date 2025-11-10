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

export function getAuthOptions(env: AuthEnv): NextAuthOptions {
  const db = getDb({ DB: env.DB });

  return {
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        if (token.tenantId && session.user) {
          (session.user as any).tenantId = token.tenantId;
        }
        return session;
      },
      async jwt({ token, user, account, profile }) {
        if (user) {
          // Get tenant from request headers or subdomain
          const tenantId = getTenantFromRequest();

          if (tenantId) {
            // Verify tenant exists
            const tenant = await db
              .select()
              .from(tenants)
              .where(eq(tenants.id, tenantId))
              .limit(1);

            if (tenant.length > 0) {
              token.tenantId = tenantId;

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
                  tenantId: tenantId,
                });
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

// Helper function to extract tenant from request
// This will be called from middleware or API routes
function getTenantFromRequest(): string | null {
  // This is a placeholder - actual implementation will be in middleware
  // For now, we'll return null and handle tenant detection in middleware
  return null;
}
