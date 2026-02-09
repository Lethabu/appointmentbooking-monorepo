// Monetization configuration
export interface MonetizationConfig {
  commission: number;
  processingFee: number;
  minimumBookingAmount: number;
}

export interface PremiumAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface MarketplaceIntegration {
  id: string;
  name: string;
  category: string;
  status: string;
}

export interface EnterpriseSolution {
  id: string;
  name: string;
  description: string;
  status: string;
}

export const DEFAULT_MONETIZATION_CONFIG: MonetizationConfig = {
  commission: 0.15, // 15%
  processingFee: 2.5, // $2.50
  minimumBookingAmount: 10, // $10
};

export const PREMIUM_ADDONS: PremiumAddOn[] = [
  {
    id: 'sms-reminders',
    name: 'SMS Reminders',
    description: 'Automated SMS appointment reminders',
    price: 9.99,
    features: ['Automated reminders', '24h before appointment', 'Reduce no-shows'],
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed business insights and reporting',
    price: 19.99,
    features: ['Revenue reports', 'Customer insights', 'Performance metrics'],
  },
];

export const MARKETPLACE_INTEGRATIONS: MarketplaceIntegration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'calendar',
    status: 'active',
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    category: 'payments',
    status: 'active',
  },
];

export const ENTERPRISE_SOLUTIONS: EnterpriseSolution[] = [
  {
    id: 'white-label',
    name: 'White Label Solution',
    description: 'Fully branded booking platform',
    status: 'active',
  },
  {
    id: 'multi-location',
    name: 'Multi-Location Management',
    description: 'Manage multiple locations from one dashboard',
    status: 'active',
  },
];

export function getMonetizationConfig(tenantId?: string): MonetizationConfig {
  // TODO: Implement tenant-specific monetization config
  return DEFAULT_MONETIZATION_CONFIG;
}
