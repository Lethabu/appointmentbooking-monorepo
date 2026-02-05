import { PaymentRouter, PaymentResult } from '../index';

export class PaystackGateway implements PaymentRouter {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async processDeposit(bookingId: string, amount: number): Promise<PaymentResult> {
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
                    email: 'customer@example.com',
                    amount: amount * 100, // Paystack amount is in kobo (lowest currency unit)
                    currency: 'ZAR',
                    reference: `booking_${bookingId}_${Date.now()}`,
                    metadata: {
                        bookingId
                    }
                })
            });

            const data = await response.json() as Record<string, unknown>;

            if (data.status as boolean) {
                const dataObj = data.data as Record<string, unknown>;
                return {
                    success: true,
                    redirectUrl: dataObj.authorization_url as string,
                    transactionId: dataObj.reference as string
                };
            }

            return {
                success: false,
                error: data.message as string || 'Paystack initialization failed'
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Network error initializing Paystack';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async handleWebhook(): Promise<void> {
        // Verify signature (x-paystack-signature)
        // eslint-disable-next-line no-console
        console.log("Paystack Webhook received");
    }
}
