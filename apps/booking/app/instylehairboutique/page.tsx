// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';

import InStyleLandingPage from '../components/landing/InStyleLandingPage';

export default function InstyleHairBoutiquePage() {
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
        const response = await fetch(`${apiUrl}/api/tenant?slug=instylehairboutique`);

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
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!tenantData.tenant) {
    return <div className="p-8">Tenant not found.</div>;
  }

  return <InStyleLandingPage services={tenantData.services} products={tenantData.products} config={tenantData.tenant} />;
}
