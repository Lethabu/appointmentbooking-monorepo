import { PaymentRouter, PaymentResult } from '../index';

export class StripeGateway implements PaymentRouter {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async processDeposit(bookingId: string, amount: number): Promise<PaymentResult> {
        // Stripe Connect: We typically create a Checkout Session
        // https://stripe.com/docs/api/checkout/sessions/create

        try {
            const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'payment_method_types[]': 'card',
                    'line_items[0][price_data][currency]': 'ZAR',
                    'line_items[0][price_data][product_data][name]': `Booking Deposit: ${bookingId}`,
                    'line_items[0][price_data][unit_amount]': Math.round(amount * 100).toString(), // cents
                    'line_items[0][quantity]': '1',
                    'mode': 'payment',
                    'success_url': `https://example.com/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
                    'cancel_url': `https://example.com/booking/cancel`,
                    'client_reference_id': bookingId,
                    'metadata[bookingId]': bookingId,
                    'metadata[tenantId]': 'default-tenant'
                }).toString()
            });

            const data = await response.json() as Record<string, unknown>;

            if (data.error) {
                const errorObj = data.error as Record<string, unknown>;
                return {
                    success: false,
                    error: errorObj.message as string || 'Stripe error occurred'
                };
            }

            return {
                success: true,
                redirectUrl: data.url as string,
                transactionId: data.id as string
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Network error initializing Stripe';
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async handleWebhook(): Promise<void> {
        // Handled via Stripe library signature verification usually
        // eslint-disable-next-line no-console
        console.log("Stripe Webhook received");
    }
}
