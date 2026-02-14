// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// Temporarily disabled due to TypeScript path alias resolution issues during OpenNext build
// // export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
    PREMIUM_ADDONS,
    MARKETPLACE_INTEGRATIONS,
    ENTERPRISE_SOLUTIONS,
    type PremiumAddOn
} from '@/lib/monetization-config';

// Monetization request schema
const monetizationRequestSchema = z.object({
    action: z.enum(['purchase_addon', 'get_addons', 'get_integrations', 'get_enterprise_solutions', 'calculate_revenue']),
    tenantId: z.string(),
    userId: z.string().optional(),
    addOnId: z.string().optional(),
    integrationId: z.string().optional(),
    solutionId: z.string().optional(),
    billingCycle: z.enum(['monthly', 'annually']).optional(),
    customRequirements: z.record(z.any()).optional()
});

// Main monetization endpoint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = monetizationRequestSchema.parse(body);

        const { action, tenantId, userId, addOnId, integrationId, solutionId, billingCycle, customRequirements } = validatedData;

        switch (action) {
            case 'get_addons':
                return handleGetAddons(tenantId);

            case 'get_integrations':
                return handleGetIntegrations();

            case 'get_enterprise_solutions':
                return handleGetEnterpriseSolutions();

            case 'purchase_addon':
                if (!addOnId) {
                    throw new Error('Add-on ID is required for purchase');
                }
                return handlePurchaseAddon(tenantId, addOnId, billingCycle || 'monthly');

            case 'calculate_revenue':
                return handleRevenueCalculation(tenantId, customRequirements);

            default:
                throw new Error(`Unknown action: ${action}`);
        }

    } catch (error) {
        console.error('Monetization error:', error);
        return NextResponse.json(
            { error: 'Monetization operation failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Handle get add-ons request
function handleGetAddons(tenantId: string) {
    // Filter add-ons based on tenant's current subscription tier
    // This would normally check the tenant's subscription from database

    const availableAddons = PREMIUM_ADDONS.filter((addon: PremiumAddOn) => {
        // Business logic to determine available add-ons
        return addon.active;
    });

    return NextResponse.json({
        success: true,
        addons: availableAddons,
        categories: Array.from(new Set(availableAddons.map((a: PremiumAddOn) => a.category))),
        popular: availableAddons.filter((a: PremiumAddOn) => a.popularity === 'high')
    });
}

// Handle get integrations request
function handleGetIntegrations() {
    const availableIntegrations = MARKETPLACE_INTEGRATIONS.filter(integration =>
        integration.status === 'active'
    );

    return NextResponse.json({
        success: true,
        integrations: availableIntegrations,
        categories: Array.from(new Set(availableIntegrations.map(i => i.category))),
        featured: availableIntegrations.filter(i => i.certification === 'official')
    });
}

// Handle get enterprise solutions request
function handleGetEnterpriseSolutions() {
    const solutions = ENTERPRISE_SOLUTIONS.filter(solution => solution.status === 'active');

    return NextResponse.json({
        success: true,
        solutions,
        categories: Array.from(new Set(solutions.map(s => s.category)))
    });
}

// Handle add-on purchase
function handlePurchaseAddon(tenantId: string, addOnId: string, billingCycle: 'monthly' | 'annually') {
    const addon = PREMIUM_ADDONS.find((a: PremiumAddOn) => a.id === addOnId);

    if (!addon) {
        return NextResponse.json(
            { error: 'Add-on not found' },
            { status: 404 }
        );
    }

    const price = billingCycle === 'annually' ? addon.pricing.annual : addon.pricing.monthly;

    // Calculate total with setup fee if applicable
    const setupFee = addon.setupFee || 0;
    const total = price + setupFee;

    // Create purchase record (this would integrate with your billing system)
    const purchase = {
        id: `purchase_${Date.now()}`,
        tenantId,
        addOnId,
        billingCycle,
        price,
        setupFee,
        total,
        currency: 'ZAR',
        status: 'pending_payment',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (billingCycle === 'annually' ? 365 : 30) * 24 * 60 * 60 * 1000)
    };

    return NextResponse.json({
        success: true,
        purchase,
        message: 'Add-on purchase initiated'
    });
}

// Handle revenue calculation for enterprise clients
function handleRevenueCalculation(tenantId: string, requirements: any) {
    // Calculate potential revenue based on tenant's current usage and selected features
    const baseMetrics = {
        monthlyBookings: requirements?.monthlyBookings || 1000,
        averageBookingValue: requirements?.averageBookingValue || 250,
        customerGrowth: requirements?.customerGrowth || 0.15,
        currentTier: requirements?.currentTier || 'professional'
    };

    // Calculate subscription revenue
    const subscriptionRevenue = calculateSubscriptionRevenue(baseMetrics);

    // Calculate commission revenue
    const commissionRevenue = calculateCommissionRevenue(baseMetrics);

    // Calculate add-on revenue potential
    const addOnRevenue = calculateAddOnRevenue(baseMetrics);

    // Calculate integration revenue
    const integrationRevenue = calculateIntegrationRevenue(baseMetrics);

    const totalRevenue = subscriptionRevenue + commissionRevenue + addOnRevenue + integrationRevenue;

    return NextResponse.json({
        success: true,
        revenueProjection: {
            monthly: {
                subscription: subscriptionRevenue,
                commission: commissionRevenue,
                addons: addOnRevenue,
                integrations: integrationRevenue,
                total: totalRevenue
            },
            annually: {
                subscription: subscriptionRevenue * 12 * 0.85, // 15% annual discount
                commission: commissionRevenue * 12,
                addons: addOnRevenue * 12 * 0.85,
                integrations: integrationRevenue * 12 * 0.85,
                total: totalRevenue * 12 * 0.85
            },
            metrics: baseMetrics,
            assumptions: {
                annualDiscount: 0.15,
                growthRate: 0.15,
                churnRate: 0.05
            }
        }
    });
}

// Helper functions for revenue calculations
function calculateSubscriptionRevenue(metrics: any): number {
    const tierPrices = {
        free: 0,
        professional: 199,
        business: 499,
        enterprise: 1499
    };

    return tierPrices[metrics.currentTier as keyof typeof tierPrices] || 0;
}

function calculateCommissionRevenue(metrics: any): number {
    const commissionRate = metrics.currentTier === 'enterprise' ? 0.01 :
        metrics.currentTier === 'business' ? 0.02 :
            metrics.currentTier === 'professional' ? 0.03 : 0.05;

    return metrics.monthlyBookings * metrics.averageBookingValue * commissionRate;
}

function calculateAddOnRevenue(metrics: any): number {
    // Average revenue per user for add-ons based on tier
    const addonRevenue = {
        free: 0,
        professional: 79, // Average of 2 add-ons
        business: 199, // Average of 3-4 add-ons
        enterprise: 399 // Average of 5-6 add-ons
    };

    return addonRevenue[metrics.currentTier as keyof typeof addonRevenue] || 0;
}

function calculateIntegrationRevenue(metrics: any): number {
    // Revenue from marketplace integrations
    const integrationRevenue = {
        free: 0,
        professional: 19, // 1 integration
        business: 59, // 2-3 integrations
        enterprise: 149 // 4+ integrations
    };

    return integrationRevenue[metrics.currentTier as keyof typeof integrationRevenue] || 0;
}