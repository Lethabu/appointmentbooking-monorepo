// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';

import { DEFAULT_TENANT_CONFIG, resolveTenantBySlug } from '@repo/services';

import InStyleLandingPage from '../../components/landing/InStyleLandingPage';

export default function InstyleHairBoutiquePage() {
  const staticTenantConfig = resolveTenantBySlug('instylehairboutique') ?? DEFAULT_TENANT_CONFIG;
  const [tenantData, setTenantData] = useState<{
    tenant: any | null;
    services: any[];
    products: any[];
  }>({ tenant: staticTenantConfig, services: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const apiUrl = staticTenantConfig.apiBaseUrl;
        const response = await fetch(`${apiUrl}/api/tenant?slug=${staticTenantConfig.slug}`);

        if (!response.ok) {
          setTenantData({ tenant: staticTenantConfig, services: [], products: [] });
          return;
        }

        const data = await response.json();
        setTenantData({
          tenant: data.tenant ?? staticTenantConfig,
          services: data.services ?? [],
          products: data.products ?? [],
        });
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setTenantData({ tenant: staticTenantConfig, services: [], products: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [staticTenantConfig]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!tenantData.tenant) {
    return <div className="p-8">Tenant not found.</div>;
  }

  return <InStyleLandingPage services={tenantData.services} products={tenantData.products} config={tenantData.tenant} />;
}
