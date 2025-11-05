// Supabase server client stub
export const createServerClient = () => ({
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  }
});

export const getTenantContext = (req: any) => Promise.resolve({ tenant: 'default', user: null });