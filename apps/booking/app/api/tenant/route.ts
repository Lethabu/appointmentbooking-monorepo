import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/packages/db/src';
import { tenants, services } from '@/packages/db/src/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Tenant slug is required' }, { status: 400 });
    }

    const db = getDb(request.env as { DB: D1Database });

    // Fetch tenant config
    const tenantData = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);

    if (tenantData.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const tenant = tenantData[0];
    const tenantId = tenant.id;

    // Fetch services for the tenant
    const servicesData = await db.select().from(services).where(eq(services.tenantId, tenantId));

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        hostnames: tenant.hostnames,
        config: tenant.config,
        salonId: tenant.salonId,
        isActive: tenant.isActive,
      },
      services: servicesData.map(service => ({
        id: service.id,
        name: service.name,
        durationMinutes: service.durationMinutes,
        price: service.price,
        isActive: service.isActive,
      })),
      products: [] // TODO: Add products table and fetching
    });

  } catch (error) {
    console.error('Tenant API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
