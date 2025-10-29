import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Check if we're in build time by looking for required env vars
const isBuildTime = typeof window === 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = isBuildTime ? 'https://placeholder.supabase.co' : process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = isBuildTime ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjQ3NzYwMDAsImV4cCI6MTk0MDM1MjAwMH0.placeholder' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single, shared client instance for browser use ONLY
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Legacy aliases for backward compatibility
export const createClient = () => {
  const url = isBuildTime ? 'https://placeholder.supabase.co' : process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = isBuildTime ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjQ3NzYwMDAsImV4cCI6MTk0MDM1MjAwMH0.placeholder' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key);
};

export const createTenantClient = (tenantId: string) => {
  const url = isBuildTime ? 'https://placeholder.supabase.co' : process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = isBuildTime ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjQ3NzYwMDAsImV4cCI6MTk0MDM1MjAwMH0.placeholder' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key);
};

export async function setTenantContext(client: any, tenantId: string) {
  const { error } = await client.rpc('set_tenant_context', { p_tenant_id: tenantId });
  if (error) console.error('Error setting tenant context:', error);
  return !error;
}

// NOTE: createServerSupabaseClient is implemented locally in each API route
