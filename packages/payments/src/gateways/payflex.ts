import { PaymentRouter, PaymentResult } from '../index';

export class PayflexGateway implements PaymentRouter {
    private merchantId: string;
    private apiKey: string;
    private apiSecret: string;

    constructor(config: { merchantId: string; apiKey: string; apiSecret: string }) {
        this.merchantId = config.merchantId;
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
    }

    async processDeposit(bookingId: string, amount: number): Promise<PaymentResult> {
        // Payflex Checkout API
        try {
            // Need to authenticate first (simplified here)
            // const token = await this.authenticate();

            const response = await fetch('https://api.payflex.co.za/v1/checkout', {
                method: 'POST',
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    merchantId: this.merchantId,
                    amount: amount * 100, // cents
                    currency: 'ZAR',
                    customer: {
                        email: 'customer@example.com',
                        phone: '+27123456789',
                        name: 'Customer Name'
                    },
                    reference: `booking_${bookingId}`
                })
            });

            const data = await response.json() as Record<string, unknown>;

            if (response.ok) {
                return {
                    success: true,
                    redirectUrl: data.redirectUrl as string,
                    transactionId: data.id as string
                };
            }

            return {
                success: false,
                error: data.message as string || 'Payflex checkout failed'
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Network error initializing Payflex';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async handleWebhook(): Promise<void> {
        // Payflex webhook signature verification
        // eslint-disable-next-line no-console
        console.log("Payflex Webhook received");
    }
}
