import NextAuth from 'next-auth';
import { getAuthOptions, type AuthEnv } from '@repo/auth';

// Cloudflare environment variables
const env: AuthEnv = {
  DB: process.env.DB as any, // D1Database binding
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
};

const handler = NextAuth(getAuthOptions(env));

export { handler as GET, handler as POST };
