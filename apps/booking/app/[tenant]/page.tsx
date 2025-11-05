// @ts-nocheck
import React from 'react';
import TenantHome from '../../components/tenant/TenantHome';
import { createTenantClient } from '../../lib/supabase';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

type Props = {
  params: { tenant: string };
};

async function fetchTenantData(slug: string) {
  try {
    const client = createTenantClient(slug);
    // Fetch tenant config
    const { data: tenantData, error: tenantError } = await client
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single();

    if (tenantError) return { tenant: null, services: [], products: [] };

    const tenantId = tenantData?.id;

    // Fetch services and products for the tenant
    const { data: services = [] } = await client
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId);

    const { data: products = [] } = await client
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId);

    return { tenant: tenantData, services, products };
  } catch (err) {
    return { tenant: null, services: [], products: [] };
  }
}

export default async function TenantPage({ params }: Props) {
  const { tenant: slug } = params;
  const { tenant, services, products } = await fetchTenantData(slug);

  if (!tenant) return <div className="p-8">Tenant not found.</div>;

  return <TenantHome config={tenant} services={services} products={products} />;
}
