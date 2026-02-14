'use client';

import { useEffect, useState } from 'react';
import InStyleLandingPage from '@/components/landing/InStyleLandingPage';

export default function BookInStylePage() {
  const [tenantData, setTenantData] = useState<{
    services?: any[];
    products?: any[];
    config?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://appointmentbooking-worker.houseofgr8ness.workers.dev';
        const response = await fetch(`${apiUrl}/api/tenant?slug=instylehairboutique`);

        if (!response.ok) {
          console.error('Failed to fetch tenant data:', response.status);
          setTenantData(null);
          return;
        }

        const data = await response.json();
        const config = typeof data.tenant?.config === 'string'
          ? JSON.parse(data.tenant.config)
          : data.tenant?.config;

        setTenantData({
          services: data.services || [],
          products: data.products || [],
          config
        });
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        setTenantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <InStyleLandingPage
      services={tenantData?.services || []}
      products={tenantData?.products || []}
      config={tenantData?.config}
    />
  );
}


