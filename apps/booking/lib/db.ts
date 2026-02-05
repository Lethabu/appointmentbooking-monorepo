// ========================================
// MIND-BODY COMMERCE DATABASE CONNECTION
// ========================================

import { getRequestContext } from '@cloudflare/next-on-pages';

// Import schema from the db package
import * as schema from '@repo/db/schema';
import { drizzle } from 'drizzle-orm/d1';

// Get the database instance from Cloudflare context
export function getDb() {
    const { env } = getRequestContext();
    return drizzle((env as any).DB, { schema });
}

// Export the database instance for use in API routes
export const db = getDb();

// Re-export commonly used schema items for convenience
export * from '@repo/db/schema';
