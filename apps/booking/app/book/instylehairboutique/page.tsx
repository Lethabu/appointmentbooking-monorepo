import { Metadata } from 'next';

import InStyleLandingPage from '@/components/landing/InStyleLandingPage';

export const metadata: Metadata = {
  title: 'InStyle Hair Boutique | Premium Hair Services',
  description: 'Book your appointment at InStyle Hair Boutique. Premium hair installations, styling, and products in Cape Town.',
};

// Helper to get base URL
function getBaseUrl() {
  // For production, use the canonical domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.instylehairboutique.co.za';
  }
  // For development, use localhost
  return 'http://localhost:3000';
}

export default async function BookInStylePage() {
  // Fetch tenant data including services, products, and config
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/tenant?slug=instylehairboutique`, {
      cache: 'no-store', // Always fetch fresh data for now
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch tenant data:', response.status, response.statusText);
      // Fallback to component defaults if API fails
      return <InStyleLandingPage />;
    }

    const data = await response.json() as { tenant?: { config?: any }; services?: any[]; products?: any[] };

    // Parse config if it's a string
    const config = typeof data.tenant?.config === 'string'
      ? JSON.parse(data.tenant.config)
      : data.tenant?.config;

    return (
      <InStyleLandingPage
        services={data.services || []}
        products={data.products || []}
        config={config}
      />
    );
  } catch (error) {
    console.error('Error fetching tenant data:', error);
    // Fallback to component defaults if fetch fails
    return <InStyleLandingPage />;
  }
}
