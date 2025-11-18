'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tenant } from '@/types';

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  loading: boolean;
  error?: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock tenant data for now
    setTenant({
      id: 'instyle',
      name: 'InStyle Hair Boutique',
      slug: 'instylehairboutique',
      is_active: true,
      branding: {
        primary_color: '#8B5CF6',
        theme: 'purple'
      }
    });
    setLoading(false);
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, setTenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
}