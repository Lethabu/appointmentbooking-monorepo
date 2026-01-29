// packages/worker/src/pricing-middleware.ts
// Geo-Based Pricing Middleware
// Conditional pricing based on Cloudflare geolocation headers
// US: "$297/mo - Revenue Automation" | ZA: "R150/mo - Community Commerce Tool"
// With caching layer for performance optimization

import { cachedQuery, pricingCacheKey } from './cache-layer';

export interface PricingTier {
  tier_name: string;
  region: string;
  country_codes: string[];
  base_monthly_fee: number;
  currency: string;
  outcome_fee_structure: {
    event_type: string;
    fee_per_event: number;
  }[];
  description: string;
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    tier_name: 'Revenue Automation (US)',
    region: 'US',
    country_codes: ['US', 'CA', 'MX'],
    base_monthly_fee: 297,
    currency: 'USD',
    outcome_fee_structure: [
      {
        event_type: 'client_reactivated',
        fee_per_event: 10,
      },
      {
        event_type: 'revenue_milestone',
        fee_per_event: 0.02, // 2% of revenue milestone
      },
    ],
    description: 'Revenue Automation for Service Franchises',
    features: [
      'Unlimited bookings',
      'AI Revenue Recon Bot',
      'Client re-engagement automation',
      'Real-time revenue tracking',
      'Performance dashboard',
    ],
  },
  {
    tier_name: 'Community Commerce (ZA/Africa)',
    region: 'SOUTHERN_AFRICA',
    country_codes: ['ZA', 'BW', 'NA', 'SZ', 'LS', 'MW', 'ZM', 'ZW'],
    base_monthly_fee: 150,
    currency: 'ZAR',
    outcome_fee_structure: [
      {
        event_type: 'client_reactivated',
        fee_per_event: 15, // R15 per reactivated client
      },
    ],
    description: 'Digital Commerce Tool for Local Traders',
    features: [
      'Simple booking & payment tracking',
      'Stock alerts',
      'Client database',
      'SMS notifications',
      'Mobile-first dashboard (Spaza Mode)',
    ],
  },
  {
    tier_name: 'Global Enterprise',
    region: 'GLOBAL',
    country_codes: ['*'],
    base_monthly_fee: 497,
    currency: 'USD',
    outcome_fee_structure: [
      {
        event_type: 'client_reactivated',
        fee_per_event: 15,
      },
      {
        event_type: 'revenue_milestone',
        fee_per_event: 0.02,
      },
      {
        event_type: 'job_created',
        fee_per_event: 50, // Impact-based pricing
      },
    ],
    description: 'Full suite with Impact & FundForge integration',
    features: [
      'All base features',
      'Multi-location support',
      'Advanced impact metrics',
      'FundForge funding eligibility',
      'Dedicated support',
    ],
  },
];

/**
 * Determine pricing tier based on geolocation (with caching)
 * Reads from Cloudflare request headers (CF-IPCountry)
 * Results cached for 5 minutes per country
 */
export async function getPricingTierByCountry(
  countryCode: string | null
): Promise<PricingTier> {
  if (!countryCode) {
    // Default to US pricing if unknown
    return PRICING_TIERS[0];
  }

  // Try cache first (5 minute TTL)
  const cacheKey = pricingCacheKey(countryCode);
  return cachedQuery(cacheKey, 5 * 60 * 1000, async () => {
    const countryUpper = countryCode.toUpperCase();

    // Check Southern Africa tier
    if (PRICING_TIERS[1].country_codes.includes(countryUpper)) {
      return PRICING_TIERS[1];
    }

    // Check US/North America tier
    if (PRICING_TIERS[0].country_codes.includes(countryUpper)) {
      return PRICING_TIERS[0];
    }

    // Default to Global Enterprise
    return PRICING_TIERS[2];
  });
}

/**
 * Extract country from Cloudflare headers
 */
export function getCountryFromRequest(request: Request): string | null {
  // Cloudflare injects CF-IPCountry header
  const cfCountry = request.headers.get('CF-IPCountry');
  return cfCountry || null;
}

/**
 * Calculate pricing with outcome fees
 */
export function calculateMonthlyBill(
  baseTier: PricingTier,
  outcomeEvents: Array<{ event_type: string; count: number; revenue?: number }>
): {
  base_fee: number;
  outcome_fees: Record<string, number>;
  total: number;
  currency: string;
} {
  let outcomeTotal = 0;
  const outcomeBreakdown: Record<string, number> = {};

  for (const event of outcomeEvents) {
    const feeStructure = baseTier.outcome_fee_structure.find(
      (f) => f.event_type === event.event_type
    );

    if (feeStructure) {
      let eventCost = 0;

      if (feeStructure.fee_per_event < 1) {
        // Percentage-based (e.g., 2% of revenue)
        eventCost = (event.revenue || 0) * feeStructure.fee_per_event;
      } else {
        // Fixed per-event
        eventCost = event.count * feeStructure.fee_per_event;
      }

      outcomeBreakdown[event.event_type] = eventCost;
      outcomeTotal += eventCost;
    }
  }

  return {
    base_fee: baseTier.base_monthly_fee,
    outcome_fees: outcomeBreakdown,
    total: baseTier.base_monthly_fee + outcomeTotal,
    currency: baseTier.currency,
  };
}

/**
 * Middleware to add pricing context to request (synchronous version)
 * Uses default tier if caching not available
 */
export function addPricingContext(
  request: Request,
  env: any
): {
  country: string | null;
  tier: PricingTier;
  currency: string;
} {
  const country = getCountryFromRequest(request);
  const countryUpper = (country || 'US').toUpperCase();

  // Quick lookup without async - for middleware use
  let tier = PRICING_TIERS[0]; // Default US
  
  if (PRICING_TIERS[1].country_codes.includes(countryUpper)) {
    tier = PRICING_TIERS[1]; // Southern Africa
  } else if (PRICING_TIERS[0].country_codes.includes(countryUpper)) {
    tier = PRICING_TIERS[0]; // US/North America
  }

  return {
    country,
    tier,
    currency: tier.currency,
  };
}

/**
 * Generate pricing page JSON (async due to caching layer)
 */
export async function generatePricingResponse(
  countryCode: string | null
): Promise<Record<string, any>> {
  const tier = await getPricingTierByCountry(countryCode);

  return {
    country_code: countryCode,
    selected_tier: {
      name: tier.tier_name,
      region: tier.region,
      base_fee: tier.base_monthly_fee,
      currency: tier.currency,
      description: tier.description,
      features: tier.features,
    },
    outcome_pricing: tier.outcome_fee_structure,
    available_tiers: PRICING_TIERS.map((t) => ({
      name: t.tier_name,
      base_fee: t.base_monthly_fee,
      currency: t.currency,
      description: t.description,
    })),
  };
}
