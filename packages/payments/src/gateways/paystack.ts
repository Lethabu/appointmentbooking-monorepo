import { PaymentRouter, PaymentResult } from '../index';

export class PaystackGateway implements PaymentRouter {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async processDeposit(bookingId: string, amount: number, currency: string, bookingDetails: any): Promise<PaymentResult> {
        // Paystack initialize transaction
        // https://api.paystack.co/transaction/initialize
        try {
            const response = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: bookingDetails.customerEmail,
                    amount: amount * 100, // Paystack amount is in kobo (lowest currency unit)
                    currency: currency,
                    reference: `booking_${bookingId}_${Date.now()}`,
                    metadata: {
                        bookingId: bookingId
                    }
                })
            });

            const data = await response.json() as any;

            if (data.status) {
                return {
                    success: true,
                    redirectUrl: data.data.authorization_url,
                    transactionId: data.data.reference
                };
            }

            return {
                success: false,
                error: data.message || 'Paystack initialization failed'
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Network error initializing Paystack'
            };
        }
    }

    async handleWebhook(event: Request): Promise<void> {
        // Verify signature (x-paystack-signature)
        console.log("Paystack Webhook received");
    }
}
