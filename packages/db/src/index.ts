import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import * as competitiveIntelligence from './competitive-intelligence-schema';

// Merge schemas for database initialization
export const fullSchema = {
  ...schema,
  ...competitiveIntelligence
};

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema: fullSchema });
}

export type Database = ReturnType<typeof getDb>;
export * from './schema';
export * from './competitive-intelligence-schema';
