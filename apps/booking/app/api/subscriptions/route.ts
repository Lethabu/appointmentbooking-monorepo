// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Subscription tier definitions optimized for South African market
const SUBSCRIPTION_TIERS = {
    FREE: {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'ZAR',
        billing: 'monthly',
        features: [
            'Up to 20 bookings per month',
            'Basic booking management',
            'Email notifications',
            'Standard support',
            'Basic reporting'
        ],
        limitations: {
            maxBookings: 20,
            maxEmployees: 1,
            advancedFeatures: false,
            whiteLabel: false,
            customIntegrations: false,
            prioritySupport: false
        }
    },
    PROFESSIONAL: {
        id: 'professional',
        name: 'Professional',
        price: 199,
        currency: 'ZAR',
        billing: 'monthly',
        originalPrice: 249,
        discount: 20,
        features: [
            'Up to 200 bookings per month',
            'Advanced booking management',
            'Email & SMS notifications',
            'Basic analytics dashboard',
            'Customer management',
            'Calendar integration',
            'Standard support'
        ],
        limitations: {
            maxBookings: 200,
            maxEmployees: 3,
            advancedFeatures: true,
            whiteLabel: false,
            customIntegrations: false,
            prioritySupport: false
        }
    },
    BUSINESS: {
        id: 'business',
        name: 'Business',
        price: 499,
        currency: 'ZAR',
        billing: 'monthly',
        originalPrice: 699,
        discount: 29,
        features: [
            'Unlimited bookings',
            'Advanced booking management',
            'Email, SMS & WhatsApp notifications',
            'Advanced analytics & reporting',
            'Customer management & CRM',
            'Multi-calendar integration',
            'Custom booking forms',
            'Marketing tools',
            'Priority support',
            'API access (limited)'
        ],
        limitations: {
            maxBookings: -1, // unlimited
            maxEmployees: 10,
            advancedFeatures: true,
            whiteLabel: false,
            customIntegrations: true,
            prioritySupport: true
        }
    },
    ENTERPRISE: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 1499,
        currency: 'ZAR',
        billing: 'monthly',
        originalPrice: 1999,
        discount: 25,
        features: [
            'Everything in Business',
            'Unlimited bookings & employees',
            'White-label solution',
            'Custom domain & branding',
            'Advanced API access',
            'Custom integrations',
            'Dedicated account manager',
            'Phone support',
            'Custom reporting & analytics',
            'Multi-location support',
            'Enterprise security features'
        ],
        limitations: {
            maxBookings: -1, // unlimited
            maxEmployees: -1, // unlimited
            advancedFeatures: true,
            whiteLabel: true,
            customIntegrations: true,
            prioritySupport: true
        }
    }
};

// Annual pricing with 20% discount
const ANNUAL_DISCOUNT = 0.20;

const subscriptionSchema = z.object({
    tenantId: z.string(),
    tier: z.enum(['free', 'professional', 'business', 'enterprise']),
    billingCycle: z.enum(['monthly', 'quarterly', 'annually']),
    paymentMethodId: z.string().optional(),
    autoRenew: z.boolean().default(true),
    promotionalCode: z.string().optional(),
    customFeatures: z.array(z.string()).optional()
});

// Helper functions
function generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function validatePromotionalCode(code: string, tier: string): Promise<number> {
    // Validate promotional codes
    const promotions = {
        'WELCOME50': 0.50, // 50% off first month for new customers
        'FIRST50': 0.50,
        'EARLYBIRD': 0.30, // 30% off for early adopters
        'SPRING24': 0.25, // 25% off seasonal promotion
        'BLACKFRIDAY': 0.40, // 40% off Black Friday special
        'CYBERMONDAY': 0.35, // 35% off Cyber Monday special
    };

    return promotions[code.toUpperCase() as keyof typeof promotions] || 0;
}

function calculateNextBillingDate(billingCycle: string): Date {
    const now = new Date();
    switch (billingCycle) {
        case 'monthly':
            return new Date(now.setMonth(now.getMonth() + 1));
        case 'quarterly':
            return new Date(now.setMonth(now.getMonth() + 3));
        case 'annually':
            return new Date(now.setFullYear(now.getFullYear() + 1));
        default:
            return new Date(now.setMonth(now.getMonth() + 1));
    }
}

async function processSubscriptionPayment(subscription: any, paymentMethodId: string) {
    // This would integrate with your payment gateway
    // For now, return a mock successful payment
    return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        redirectUrl: null
    };
}

async function getSubscriptionByTenantId(tenantId: string) {
    // This would retrieve subscription from your database
    // For now, return mock data
    return {
        id: 'sub_mock_123',
        tenantId,
        tier: 'professional',
        billingCycle: 'monthly',
        price: 199,
        currency: 'ZAR',
        status: 'active',
        features: SUBSCRIPTION_TIERS.PROFESSIONAL.features,
        limitations: SUBSCRIPTION_TIERS.PROFESSIONAL.limitations,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = subscriptionSchema.parse(body);

        const tier = SUBSCRIPTION_TIERS[validatedData.tier.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS];

        // Calculate pricing with discounts
        const basePrice = tier.price;
        let discount = 0;

        // Apply promotional codes if provided
        if (validatedData.promotionalCode) {
            discount = await validatePromotionalCode(validatedData.promotionalCode, validatedData.tier);
        }

        // Apply annual/quarterly discounts
        let billingDiscount = 0;
        if (validatedData.billingCycle === 'annually') {
            billingDiscount = ANNUAL_DISCOUNT;
        } else if (validatedData.billingCycle === 'quarterly') {
            billingDiscount = 0.10; // 10% quarterly discount
        }

        const finalPrice = Math.round(basePrice * (1 - discount - billingDiscount));

        // Create subscription record
        const subscription: any = {
            id: generateSubscriptionId(),
            tenantId: validatedData.tenantId,
            tier: validatedData.tier,
            billingCycle: validatedData.billingCycle,
            price: finalPrice,
            originalPrice: basePrice,
            currency: tier.currency,
            status: 'pending_payment',
            autoRenew: validatedData.autoRenew,
            features: tier.features,
            limitations: tier.limitations,
            customFeatures: validatedData.customFeatures || [],
            nextBillingDate: calculateNextBillingDate(validatedData.billingCycle),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        let paymentResult: any = null;

        // Process payment if not free tier
        if (validatedData.tier !== 'free' && validatedData.paymentMethodId) {
            paymentResult = await processSubscriptionPayment(subscription, validatedData.paymentMethodId);

            if (!paymentResult.success) {
                return NextResponse.json(
                    { error: 'Payment failed' },
                    { status: 400 }
                );
            }

            subscription.status = 'active';
            subscription.paymentTransactionId = paymentResult.transactionId;
        }

        return NextResponse.json({
            success: true,
            subscription,
            paymentUrl: paymentResult?.redirectUrl,
            message: 'Subscription created successfully'
        });

    } catch (error) {
        console.error('Subscription creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json(
                { error: 'Tenant ID required' },
                { status: 400 }
            );
        }

        // Retrieve subscription from database
        // This would be implemented with your actual database logic
        const subscription = await getSubscriptionByTenantId(tenantId);

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            subscription
        });

    } catch (error) {
        console.error('Subscription retrieval error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve subscription', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}