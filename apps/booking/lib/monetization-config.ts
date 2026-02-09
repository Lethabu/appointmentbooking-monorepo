// Monetization configuration
export interface MonetizationConfig {
  commission: number;
  processingFee: number;
  minimumBookingAmount: number;
}

export const DEFAULT_MONETIZATION_CONFIG: MonetizationConfig = {
  commission: 0.15, // 15%
  processingFee: 2.5, // $2.50
  minimumBookingAmount: 10, // $10
};

export function getMonetizationConfig(tenantId?: string): MonetizationConfig {
  // TODO: Implement tenant-specific monetization config
  return DEFAULT_MONETIZATION_CONFIG;
}
