// ============================================================================
// Edge Runtime Configuration for Cloudflare Pages
// ============================================================================
// export const runtime = 'edge'; // Disabled for OpenNext compatibility

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
    DYNAMIC_PRICING_RULES,
    PROMOTIONAL_CODES,
    BOOKING_COMMISSIONS,
    type PricingRule,
    type PromotionalCode,
    type BookingCommission
} from '@/lib/pricing-config';

// Pricing request schema
const pricingRequestSchema = z.object({
    serviceId: z.string(),
    servicePrice: z.number().positive(),
    serviceCategory: z.string(),
    customerId: z.string().optional(),
    customerTier: z.enum(['free', 'professional', 'business', 'enterprise']).optional(),
    loyaltyTier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
    bookingDate: z.string(),
    bookingTime: z.string(),
    promotionalCode: z.string().optional(),
    isFirstTime: z.boolean().default(false),
    referredBy: z.string().optional(),
    bookingValue: z.number().positive()
});

// Calculate dynamic pricing
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = pricingRequestSchema.parse(body);

        const {
            serviceId,
            servicePrice,
            serviceCategory,
            customerId,
            customerTier = 'free',
            loyaltyTier,
            bookingDate,
            bookingTime,
            promotionalCode,
            isFirstTime,
            referredBy,
            bookingValue
        } = validatedData;

        // Get applicable pricing rules
        const applicableRules = getApplicablePricingRules({
            servicePrice,
            serviceCategory,
            customerTier,
            loyaltyTier,
            bookingDate,
            bookingTime,
            bookingValue
        });

        // Calculate total discount
        let totalDiscount = 0;
        const appliedRules = [];

        for (const rule of applicableRules) {
            let ruleDiscount = 0;

            if (rule.discount.percentage > 0) {
                ruleDiscount = (servicePrice * rule.discount.percentage) / 100;
                if (rule.discount.maxDiscount && ruleDiscount > rule.discount.maxDiscount) {
                    ruleDiscount = rule.discount.maxDiscount;
                }
            }

            if (rule.discount.fixedAmount) {
                ruleDiscount += rule.discount.fixedAmount;
            }

            totalDiscount += ruleDiscount;
            appliedRules.push({
                ruleId: rule.id,
                ruleName: rule.name,
                discount: ruleDiscount,
                type: rule.type
            });
        }

        // Apply promotional code
        let promotionalDiscount = 0;
        let promotionalDetails = null;

        if (promotionalCode) {
            const promoResult = calculatePromotionalDiscount(promotionalCode, {
                servicePrice,
                serviceCategory,
                customerTier,
                isFirstTime,
                referredBy,
                bookingValue
            });

            if (promoResult.valid) {
                promotionalDiscount = promoResult.discount;
                promotionalDetails = {
                    code: promotionalCode,
                    name: promoResult.name,
                    discount: promotionalDiscount
                };
            }
        }

        const finalPrice = Math.max(0, servicePrice - totalDiscount - promotionalDiscount);
        const totalSavings = servicePrice - finalPrice;

        // Calculate commission for the platform
        const commission = calculatePlatformCommission({
            serviceType: getServiceType(serviceCategory),
            servicePrice: finalPrice,
            customerTier,
            bookingDate
        });

        return NextResponse.json({
            success: true,
            pricing: {
                originalPrice: servicePrice,
                finalPrice,
                totalDiscount: totalSavings,
                breakdown: {
                    rulesDiscount: totalDiscount,
                    promotionalDiscount,
                    finalPrice
                },
                appliedRules,
                promotionalDetails,
                commission,
                currency: 'ZAR',
                validUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
            }
        });

    } catch (error) {
        console.error('Dynamic pricing calculation error:', error);
        return NextResponse.json(
            { error: 'Failed to calculate dynamic pricing', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Get applicable pricing rules
function getApplicablePricingRules(context: any): PricingRule[] {
    const applicableRules = DYNAMIC_PRICING_RULES.filter(rule => {
        if (!rule.active) return false;

        const { conditions } = rule;
        const now = new Date();

        // Check date range
        if (conditions.startDate && now < new Date(conditions.startDate)) return false;
        if (conditions.endDate && now > new Date(conditions.endDate)) return false;

        // Check booking value
        if (conditions.minBookingValue && context.bookingValue < conditions.minBookingValue) return false;
        if (conditions.maxBookingValue && context.bookingValue > conditions.maxBookingValue) return false;

        // Check service categories
        if (conditions.serviceCategories && !conditions.serviceCategories.includes(context.serviceCategory)) return false;

        // Check customer tiers
        if (conditions.customerTiers && !conditions.customerTiers.includes(context.customerTier)) return false;

        // Check time slots
        if (conditions.timeSlots && !conditions.timeSlots.includes(context.bookingTime)) return false;

        // Check days of week
        if (conditions.daysOfWeek) {
            const bookingDate = new Date(context.bookingDate);
            const dayOfWeek = bookingDate.getDay();
            if (!conditions.daysOfWeek.includes(dayOfWeek)) return false;
        }

        return true;
    });

    // Sort by priority (highest first)
    return applicableRules.sort((a, b) => b.priority - a.priority);
}

// Calculate promotional discount
function calculatePromotionalDiscount(code: string, context: any): {
    valid: boolean;
    discount: number;
    name: string;
} {
    const promo = PROMOTIONAL_CODES.find(p => p.code.toLowerCase() === code.toLowerCase());

    if (!promo) {
        return { valid: false, discount: 0, name: '' };
    }

    const now = new Date();
    const validFrom = new Date(promo.validFrom);
    const validTo = new Date(promo.validTo);

    if (now < validFrom || now > validTo) {
        return { valid: false, discount: 0, name: '' };
    }

    // Check usage limits
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
        return { valid: false, discount: 0, name: '' };
    }

    // Check applicable tiers
    if (promo.applicableTiers && !promo.applicableTiers.includes(context.customerTier)) {
        return { valid: false, discount: 0, name: '' };
    }

    // Check minimum booking value
    if (promo.minBookingValue && context.bookingValue < promo.minBookingValue) {
        return { valid: false, discount: 0, name: '' };
    }

    // Check first-time only
    if (promo.firstTimeOnly && !context.isFirstTime) {
        return { valid: false, discount: 0, name: '' };
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === 'percentage') {
        discount = (context.servicePrice * promo.value) / 100;
        if (promo.maxDiscount && discount > promo.maxDiscount) {
            discount = promo.maxDiscount;
        }
    } else if (promo.type === 'fixed_amount') {
        discount = promo.value;
    }

    return {
        valid: true,
        discount,
        name: promo.name
    };
}

// Calculate platform commission
function calculatePlatformCommission(context: {
    serviceType: 'standard' | 'premium' | 'luxury' | 'enterprise';
    servicePrice: number;
    customerTier: string;
    bookingDate: string;
}): {
    commissionRate: number;
    commissionAmount: number;
    netAmount: number;
} {
    const commissionStructure = BOOKING_COMMISSIONS.find(c => c.serviceType === context.serviceType);

    if (!commissionStructure) {
        return {
            commissionRate: 0.05,
            commissionAmount: context.servicePrice * 0.05,
            netAmount: context.servicePrice * 0.95
        };
    }

    let commissionRate = commissionStructure.baseRate;

    // Apply subscription tier discount
    const tierDiscount = commissionStructure.subscriptionTiers[context.customerTier as keyof typeof commissionStructure.subscriptionTiers];
    if (tierDiscount !== undefined) {
        commissionRate = tierDiscount;
    }

    // Apply seasonal adjustments
    const bookingDate = new Date(context.bookingDate);
    const month = bookingDate.getMonth() + 1;

    // Peak season: December-February (summer), May (mother's day), September (spring)
    if ([12, 1, 2, 5, 9].includes(month)) {
        commissionRate += commissionStructure.seasonalAdjustments.peak;
    } else {
        commissionRate += commissionStructure.seasonalAdjustments.offPeak;
    }

    const commissionAmount = Math.round(context.servicePrice * commissionRate * 100) / 100;
    const netAmount = context.servicePrice - commissionAmount;

    return {
        commissionRate: Math.round(commissionRate * 10000) / 100, // Convert to percentage with 2 decimals
        commissionAmount,
        netAmount
    };
}

// Helper function to determine service type
function getServiceType(category: string): 'standard' | 'premium' | 'luxury' | 'enterprise' {
    const categoryMap: { [key: string]: 'standard' | 'premium' | 'luxury' | 'enterprise' } = {
        'haircut': 'standard',
        'styling': 'standard',
        'color': 'premium',
        'highlights': 'premium',
        'treatment': 'premium',
        'facial': 'standard',
        'massage': 'premium',
        'manicure': 'standard',
        'makeup': 'luxury',
        'photo_session': 'luxury',
        'consultation': 'enterprise'
    };

    return categoryMap[category.toLowerCase()] || 'standard';
}