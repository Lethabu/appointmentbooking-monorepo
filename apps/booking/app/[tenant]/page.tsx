// @ts-nocheck
import React from 'react';
import TenantHome from '../../components/tenant/TenantHome';
import InStyleLandingPage from '../../components/landing/InStyleLandingPage';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

type Props = {
  params: { tenant: string };
};

async function fetchTenantData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tenant?slug=${slug}`, {
      cache: 'no-store' // Ensure fresh data for ISR
    });

    if (!response.ok) {
      return { tenant: null, services: [], products: [] };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching tenant data:', err);
    return { tenant: null, services: [], products: [] };
  }
}

export default async function TenantPage({ params }: Props) {
  const { tenant: slug } = params;
  const { tenant, services, products } = await fetchTenantData(slug);

  if (!tenant) return <div className="p-8">Tenant not found.</div>;

  // Use InStyleLandingPage for instylehairboutique, TenantHome for others
  if (slug === 'instylehairboutique') {
    return <InStyleLandingPage />;
  }

  return <TenantHome config={tenant} services={services} products={products} />;
}
