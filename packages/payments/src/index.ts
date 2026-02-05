export * from './gateways/payfast';
export * from './gateways/yoco';
export * from './gateways/paystack';
export * from './gateways/stripe';
export * from './gateways/netcash';
export * from './gateways/payflex';

export enum PaymentGateway {
    STRIPE = 'stripe',
    PAYFAST = 'payfast',
    YOCO = 'yoco',
    PAYSTACK = 'paystack',
    MOLLIE = 'mollie',
    NETCASH = 'netcash',
    PAYFLEX = 'payflex'
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    redirectUrl?: string; // For off-site payments (PayFast)
    error?: string;
}

export interface PaymentRouter {
    processDeposit(bookingId: string, amount: number): Promise<PaymentResult>;
    handleWebhook(): Promise<void>;
}

export interface TenantConfig {
    currency: string;
    country: string;
    paymentConfig?: Record<string, unknown>;
}

export const getPaymentGateway = (tenant: TenantConfig): PaymentGateway => {
    if (tenant.currency === 'ZAR') {
        // Prefer Yoco for credit cards if configured, else PayFast
        // This logic can be refined based on specific tenant preference flags
        return PaymentGateway.PAYFAST;
    }
    // Default to Stripe for international
    return PaymentGateway.STRIPE;
};
