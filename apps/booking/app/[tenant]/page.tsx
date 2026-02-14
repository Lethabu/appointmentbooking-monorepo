// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';

import InStyleLandingPage from '../../components/landing/InStyleLandingPage';
import TenantHome from '../../components/tenant/TenantHome';

type Props = {
  params: { tenant: string };
};

export default function TenantPage({ params }: Props) {
  const { tenant: slug } = params;
  const [tenantData, setTenantData] = useState<{
    tenant: any | null;
    services: any[];
    products: any[];
  }>({ tenant: null, services: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://appointmentbooking-worker.houseofgr8ness.workers.dev';
        const response = await fetch(`${apiUrl}/api/tenant?slug=${slug}`);

        if (!response.ok) {
          setTenantData({ tenant: null, services: [], products: [] });
          return;
        }

        const data = await response.json();
        setTenantData(data);
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setTenantData({ tenant: null, services: [], products: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [slug]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!tenantData.tenant) {
    return <div className="p-8">Tenant not found.</div>;
  }

  // Use InStyleLandingPage for instylehairboutique, TenantHome for others
  if (slug === 'instylehairboutique') {
    return <InStyleLandingPage services={tenantData.services} products={tenantData.products} config={tenantData.tenant} />;
  }

  return <TenantHome config={tenantData.tenant} services={tenantData.services} products={tenantData.products} />;
}
