// Pricing configuration
export interface DynamicPricingRule {
  id: string;
  name: string;
  condition: string;
  adjustment: number;
}

export interface PromotionalCode {
  code: string;
  discount: number;
  validUntil: Date;
}

export interface BookingCommission {
  tenantId: string;
  commissionRate: number;
}

export const DYNAMIC_PRICING_RULES: DynamicPricingRule[] = [
  {
    id: 'peak-hours',
    name: 'Peak Hours Premium',
    condition: 'time >= 9:00 && time <= 17:00',
    adjustment: 1.2, // 20% increase
  },
];

export const PROMOTIONAL_CODES: PromotionalCode[] = [
  {
    code: 'WELCOME10',
    discount: 0.1, // 10% off
    validUntil: new Date('2026-12-31'),
  },
];

export const BOOKING_COMMISSIONS: BookingCommission[] = [
  {
    tenantId: 'default',
    commissionRate: 0.15, // 15%
  },
];

export function getPricingConfig(tenantId?: string) {
  return {
    dynamicPricingRules: DYNAMIC_PRICING_RULES,
    promotionalCodes: PROMOTIONAL_CODES,
    bookingCommissions: BOOKING_COMMISSIONS,
  };
}
