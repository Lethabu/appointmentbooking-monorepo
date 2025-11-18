import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Tenant slug is required' }, { status: 400 });
    }

    // Hardcoded Instyle tenant data for production
    if (slug === 'instylehairboutique') {
      return NextResponse.json({
        tenant: {
          id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
          slug: 'instylehairboutique',
          name: 'Instyle Hair Boutique',
          hostnames: ['www.instylehairboutique.co.za'],
          config: {
            supersaas: {
              account: 'InStyle_Hair_Boutique',
              scheduleId: '695384',
              apiKey: process.env.SUPERSAAS_API_KEY
            }
          },
          salonId: '695384',
          isActive: true,
        },
        services: [
          {
            id: '1',
            name: 'Middle & Side Installation',
            durationMinutes: 60,
            price: 30000,
            isActive: true,
          },
          {
            id: '2', 
            name: 'Maphondo & Lines Installation',
            durationMinutes: 60,
            price: 35000,
            isActive: true,
          },
          {
            id: '3',
            name: 'Soft Glam Makeup',
            durationMinutes: 120,
            price: 45000,
            isActive: true,
          },
          {
            id: '4',
            name: 'Gel Maphondo Styling',
            durationMinutes: 120,
            price: 35000,
            isActive: true,
          },
          {
            id: '5',
            name: 'Frontal Ponytail Installation',
            durationMinutes: 120,
            price: 95000,
            isActive: true,
          }
        ],
        products: []
      });
    }

    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  } catch (error) {
    console.error('Tenant API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
