// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { getPaymentGateway, PaymentGateway } from '@repo/payments';
import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db'; // Assuming access to DB via alias defined in next.config or tsconfig

export async function POST(req: NextRequest) {
    // This is a unified webhook handler.
    // In a real scenario, providers might need distinct endpoints (e.g. /api/payments/webhook/stripe)
    // or we parse the provider from the URL query or body.

    // For now, let's assume the provider is passed as a query param ?provider=stripe
    const searchParams = req.nextUrl.searchParams;
    const provider = searchParams.get('provider') as PaymentGateway;

    if (!provider) {
        return NextResponse.json({ error: 'Provider required' }, { status: 400 });
    }

    // Mock tenant config for gateway retrieval - in real app, fetch from DB based on payload
    const mockTenantConfig = {
        currency: 'ZAR',
        country: 'ZA'
    };

    const gatewayType = getPaymentGateway(mockTenantConfig);
    // In reality, we'd initialize the specific gateway instance based on tenant secrets

    console.log(`Received webhook for ${provider}`);

    return NextResponse.json({ received: true });
}
