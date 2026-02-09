// Note: Using standard Request/Response types instead of Next.js to avoid dependency
import { z } from 'zod';

// South
export interface PaymentGatewayConfig {
    name: string;
    id: string;
    description: string;
    supportedMethods: string[];
    currency: string;
    instantSettlement: boolean;
    mobileOptimized: boolean;
    integrationType: 'redirect' | 'embedded' | 'api';
    fees: Record<string, number>;
    features: {
        recurringPayments: boolean;
        refunds: boolean;
        partialRefunds: boolean;
        multiCurrency: boolean;
        webhookSupport: boolean;
        fraudDetection: boolean;
    };
    integration: Record<string, unknown>;
}

// Enhanced payment gateway configurations for South African market
export const SA_PAYMENT_GATEWAYS: Record<string, PaymentGatewayConfig> = {
    PAYFAST: {
        name: 'PayFast',
        id: 'payfast',
        description: 'South Africa\'s most trusted payment processor',
        supportedMethods: [
            'credit_card',
            'debit_card',
            'eft_instant',
            'ozow',
            'capitec_pay',
            'snapscan',
            'zapper',
            'qr_pay'
        ],
        currency: 'ZAR',
        instantSettlement: false,
        mobileOptimized: true,
        integrationType: 'redirect',
        fees: {
            creditCard: 0.025, // 2.5% + R2.50
            debitCard: 0.015, // 1.5% + R1.50
            eft: 0.008, // 0.8% + R2.50
            qr: 0.020 // 2.0% + R1.00
        },
        features: {
            recurringPayments: true,
            refunds: true,
            partialRefunds: true,
            multiCurrency: false,
            webhookSupport: true,
            fraudDetection: true
        },
        integration: {
            sandboxUrl: 'https://sandbox.payfast.co.za/eng/process',
            liveUrl: 'https://www.payfast.co.za/eng/process',
            merchantId: process.env.PAYFAST_MERCHANT_ID,
            merchantKey: process.env.PAYFAST_MERCHANT_KEY,
            passphrase: process.env.PAYFAST_PASSPHRASE
        }
    },

    SNAPSCAN: {
        name: 'SnapScan',
        id: 'snapscan',
        description: 'Mobile-first QR code payments for younger demographics',
        supportedMethods: ['qr_code', 'mobile_app'],
        currency: 'ZAR',
        instantSettlement: true,
        mobileOptimized: true,
        integrationType: 'embedded',
        fees: {
            qrPayment: 0.015 // 1.5% + R0.50
        },
        features: {
            recurringPayments: false,
            refunds: true,
            partialRefunds: true,
            multiCurrency: false,
            webhookSupport: true,
            fraudDetection: true
        },
        integration: {
            apiUrl: 'https://api.snapscan.io/merchants',
            merchantId: process.env.SNAPSCAN_MERCHANT_ID,
            apiKey: process.env.SNAPSCAN_API_KEY,
            qrCodeUrl: 'https://pos.snapscan.io/qr/'
        }
    },

    OZOW: {
        name: 'Ozow',
        id: 'ozow',
        description: 'Instant EFT payments with real-time confirmation',
        supportedMethods: ['eft_instant'],
        currency: 'ZAR',
        instantSettlement: true,
        mobileOptimized: true,
        integrationType: 'redirect',
        fees: {
            eft: 0.012 // 1.2% + R1.50
        },
        features: {
            recurringPayments: false,
            refunds: true,
            partialRefunds: true,
            multiCurrency: false,
            webhookSupport: true,
            fraudDetection: true
        },
        integration: {
            sandboxUrl: 'https://sandboxapi.ozow.com/',
            liveUrl: 'https://api.ozow.com/',
            siteCode: process.env.OZOW_SITE_CODE,
            privateKey: process.env.OZOW_PRIVATE_KEY,
            publicKey: process.env.OZOW_PUBLIC_KEY
        }
    },

    YOCO: {
        name: 'Yoco',
        id: 'yoco',
        description: 'Traditional card processing for established businesses',
        supportedMethods: ['credit_card', 'debit_card'],
        currency: 'ZAR',
        instantSettlement: false,
        mobileOptimized: true,
        integrationType: 'api',
        fees: {
            cardPayment: 0.029 // 2.9% + R1.00
        },
        features: {
            recurringPayments: true,
            refunds: true,
            partialRefunds: true,
            multiCurrency: false,
            webhookSupport: true,
            fraudDetection: true
        },
        integration: {
            apiUrl: 'https://api.yoco.com/v1',
            publicKey: process.env.YOCO_PUBLIC_KEY,
            secretKey: process.env.YOCO_SECRET_KEY
        }
    },

    TRADITIONAL: {
        name: 'Traditional Cards',
        id: 'traditional',
        description: 'Visa, Mastercard via international processors',
        supportedMethods: ['visa', 'mastercard', 'american_express'],
        currency: 'ZAR',
        instantSettlement: false,
        mobileOptimized: true,
        integrationType: 'redirect',
        fees: {
            international: 0.035 // 3.5% + R2.00
        },
        features: {
            recurringPayments: true,
            refunds: true,
            partialRefunds: true,
            multiCurrency: true,
            webhookSupport: true,
            fraudDetection: true
        },
        integration: {
            sandboxUrl: 'https://sandbox.stripe.com/',
            liveUrl: 'https://api.stripe.com/',
            apiKey: process.env.STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
        }
    }
};

// Payment method selection based on customer preferences and business rules
export function selectOptimalPaymentGateway(
    customerProfile: {
        preferredMethod?: string;
        isReturning: boolean;
        orderValue: number;
        deviceType: 'mobile' | 'desktop';
        location: string;
    },
    businessRules: {
        preferLocal: boolean;
        prioritizeSpeed: boolean;
        minimizeFees: boolean;
    }
): PaymentGatewayConfig {
    const { customerProfile: customer, businessRules: business } = { customerProfile, businessRules };

    // High-value orders prioritize established gateways with good fraud protection
    if (customer.orderValue > 1000) {
        return business.minimizeFees ? SA_PAYMENT_GATEWAYS.PAYFAST : SA_PAYMENT_GATEWAYS.YOCO;
    }

    // Mobile-first customers prefer mobile-optimized solutions
    if (customer.deviceType === 'mobile') {
        if (customer.preferredMethod === 'qr') return SA_PAYMENT_GATEWAYS.SNAPSCAN;
        if (customer.preferredMethod === 'eft') return SA_PAYMENT_GATEWAYS.OZOW;
        return SA_PAYMENT_GATEWAYS.PAYFAST; // Most mobile-friendly
    }

    // Returning customers get their preferred method
    if (customer.isReturning && customer.preferredMethod) {
        switch (customer.preferredMethod) {
            case 'qr': return SA_PAYMENT_GATEWAYS.SNAPSCAN;
            case 'eft': return SA_PAYMENT_GATEWAYS.OZOW;
            case 'card': return SA_PAYMENT_GATEWAYS.YOCO;
        }
    }

    // Default to PayFast as most versatile South African gateway
    return SA_PAYMENT_GATEWAYS.PAYFAST;
}

// Dynamic fee calculation for booking commissions
export function calculateBookingCommission(
    servicePrice: number,
    serviceType: 'standard' | 'premium' | 'enterprise',
    paymentGateway: string,
    customerTier: 'free' | 'professional' | 'business' | 'enterprise'
): {
    platformFee: number;
    paymentGatewayFee: number;
    totalCommission: number;
    netAmount: number;
} {
    // Platform commission rates based on service type and customer tier
    const platformRates = {
        standard: { free: 0.05, professional: 0.03, business: 0.02, enterprise: 0.01 },
        premium: { free: 0.04, professional: 0.025, business: 0.015, enterprise: 0.008 },
        enterprise: { free: 0.03, professional: 0.02, business: 0.01, enterprise: 0.005 }
    };

    let platformRate = platformRates[serviceType][customerTier];

    // Apply volume discounts for high-value bookings
    if (servicePrice > 1000) platformRate *= 0.8; // 20% discount on platform fees
    if (servicePrice > 2000) platformRate *= 0.7; // 30% discount for premium bookings

    const platformFee = Math.round(servicePrice * platformRate * 100) / 100;

    // Payment gateway fees - handle different fee structures
    const gateway = SA_PAYMENT_GATEWAYS[paymentGateway.toUpperCase() as keyof typeof SA_PAYMENT_GATEWAYS];
    let gatewayFeeRate = 0.025; // default rate

    if (gateway) {
        // Try to find appropriate fee rate based on payment method
        const fees = gateway.fees;
        if ('creditCard' in fees && fees.creditCard) gatewayFeeRate = fees.creditCard;
        else if ('cardPayment' in fees && fees.cardPayment) gatewayFeeRate = fees.cardPayment;
        else if ('qrPayment' in fees && fees.qrPayment) gatewayFeeRate = fees.qrPayment;
        else if ('eft' in fees && fees.eft) gatewayFeeRate = fees.eft;
        else if ('international' in fees && fees.international) gatewayFeeRate = fees.international;
    }

    const gatewayFee = Math.round(servicePrice * gatewayFeeRate * 100) / 100;

    const totalCommission = platformFee + gatewayFee;
    const netAmount = servicePrice - totalCommission;

    return {
        platformFee,
        paymentGatewayFee: gatewayFee,
        totalCommission,
        netAmount
    };
}

// ZAR currency formatting
export function formatZAR(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Payment validation schema
const paymentRequestSchema = z.object({
    amount: z.number().min(1),
    currency: z.literal('ZAR'),
    bookingId: z.string(),
    customerId: z.string(),
    paymentMethod: z.enum(['payfast', 'snapscan', 'ozow', 'yoco', 'traditional']),
    customerDetails: z.object({
        email: z.string().email(),
        phone: z.string(),
        firstName: z.string(),
        lastName: z.string()
    }),
    returnUrl: z.string().url(),
    cancelUrl: z.string().url(),
    notifyUrl: z.string().url(),
    customFields: z.record(z.unknown()).optional()
});

// Main payment processing endpoint
export async function processPaymentRequest(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const validatedData = paymentRequestSchema.parse(body);

        const gateway = SA_PAYMENT_GATEWAYS[validatedData.paymentMethod.toUpperCase() as keyof typeof SA_PAYMENT_GATEWAYS];

        if (!gateway) {
            return new Response(
                JSON.stringify({ error: 'Unsupported payment gateway' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Calculate fees and commissions
        const commission = calculateBookingCommission(
            validatedData.amount,
            'standard', // This would be determined by the service type
            validatedData.paymentMethod,
            'professional' // This would be determined by the customer's subscription tier
        );

        // Generate payment request based on gateway type
        let paymentRequest: {
            amount: number;
            currency: string;
            bookingId: string;
            customerId: string;
            commission: any;
            gateway: string;
            [key: string]: any;
        } = {
            amount: validatedData.amount,
            currency: validatedData.currency,
            bookingId: validatedData.bookingId,
            customerId: validatedData.customerId,
            commission,
            gateway: validatedData.paymentMethod
        };

        // Process based on gateway integration type
        switch (gateway.integrationType) {
            case 'redirect':
                paymentRequest = await createRedirectPayment(gateway, validatedData, commission);
                break;
            case 'embedded':
                paymentRequest = await createEmbeddedPayment(gateway, validatedData, commission);
                break;
            case 'api':
                paymentRequest = await createApiPayment(gateway, validatedData, commission);
                break;
        }

        return new Response(
            JSON.stringify({
                success: true,
                payment: paymentRequest,
                gateway: gateway.name,
                commission
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Payment processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({ error: 'Payment processing failed', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Gateway-specific payment creation functions
async function createRedirectPayment(gateway: PaymentGatewayConfig, data: z.infer<typeof paymentRequestSchema>, commission: any) {
    // PayFast, Ozow, Traditional Cards redirect flow
    return {
        amount: data.amount,
        currency: data.currency,
        bookingId: data.bookingId,
        customerId: data.customerId,
        commission,
        gateway: data.paymentMethod,
        redirectUrl: `${gateway.integration.sandboxUrl || gateway.integration.liveUrl}`,
        method: 'POST',
        formData: {
            merchant_id: gateway.integration.merchantId || gateway.integration.siteCode,
            merchant_key: gateway.integration.merchantKey,
            amount: data.amount,
            item_name: `Booking ${data.bookingId}`,
            email_address: data.customerDetails.email,
            cell_number: data.customerDetails.phone,
            name_first: data.customerDetails.firstName,
            name_last: data.customerDetails.lastName,
            return_url: data.returnUrl,
            cancel_url: data.cancelUrl,
            notify_url: data.notifyUrl,
            custom_str1: data.bookingId,
            custom_str2: data.customerId,
            custom_str3: commission.totalCommission.toString()
        }
    };
}

async function createEmbeddedPayment(gateway: PaymentGatewayConfig, data: z.infer<typeof paymentRequestSchema>, commission: any) {
    // SnapScan embedded flow
    return {
        amount: data.amount,
        currency: data.currency,
        bookingId: data.bookingId,
        customerId: data.customerId,
        commission,
        gateway: data.paymentMethod,
        qrCode: `${gateway.integration.qrCodeUrl}${gateway.integration.merchantId}`,
        reference: data.bookingId,
        callbackUrl: data.notifyUrl,
        embedded: true
    };
}

async function createApiPayment(gateway: PaymentGatewayConfig, data: z.infer<typeof paymentRequestSchema>, commission: any) {
    // Yoco API direct charge
    return {
        amount: data.amount,
        currency: data.currency,
        bookingId: data.bookingId,
        customerId: data.customerId,
        commission,
        gateway: data.paymentMethod,
        apiEndpoint: gateway.integration.apiUrl,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${gateway.integration.secretKey}`,
            'Content-Type': 'application/json'
        },
        body: {
            amount: Math.round(data.amount * 100), // Convert to cents
            currency: data.currency,
            description: `Booking ${data.bookingId}`,
            customer: {
                email: data.customerDetails.email,
                name: `${data.customerDetails.firstName} ${data.customerDetails.lastName}`,
                phone: data.customerDetails.phone
            },
            metadata: {
                booking_id: data.bookingId,
                customer_id: data.customerId,
                commission_amount: commission.totalCommission
            }
        }
    };
}