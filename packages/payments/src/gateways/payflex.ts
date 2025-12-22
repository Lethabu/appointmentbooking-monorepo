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

    async processDeposit(bookingId: string, amount: number, currency: string, bookingDetails: any): Promise<PaymentResult> {
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
                    currency: currency,
                    customer: {
                        email: bookingDetails.customerEmail,
                        phone: bookingDetails.customerPhone,
                        name: bookingDetails.customerName
                    },
                    reference: `booking_${bookingId}`
                })
            });

            const data = await response.json() as any;

            if (response.ok) {
                return {
                    success: true,
                    redirectUrl: data.redirectUrl,
                    transactionId: data.id
                };
            }

            return {
                success: false,
                error: data.message || 'Payflex checkout failed'
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Network error initializing Payflex'
            };
        }
    }

    async handleWebhook(event: Request): Promise<void> {
        // Payflex webhook signature verification
        console.log("Payflex Webhook received");
    }
}
