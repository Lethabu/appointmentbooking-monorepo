import { PaymentRouter, PaymentResult } from '../index';

export class StripeGateway implements PaymentRouter {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async processDeposit(bookingId: string, amount: number, currency: string, bookingDetails: any): Promise<PaymentResult> {
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
                    'line_items[0][price_data][currency]': currency,
                    'line_items[0][price_data][product_data][name]': `Booking Deposit: ${bookingId}`,
                    'line_items[0][price_data][unit_amount]': Math.round(amount * 100).toString(), // cents
                    'line_items[0][quantity]': '1',
                    'mode': 'payment',
                    'success_url': `${bookingDetails.baseUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
                    'cancel_url': `${bookingDetails.baseUrl}/booking/cancel`,
                    'client_reference_id': bookingId,
                    'metadata[bookingId]': bookingId,
                    'metadata[tenantId]': bookingDetails.tenantId
                }).toString()
            });

            const data = await response.json() as any;

            if (data.error) {
                return {
                    success: false,
                    error: data.error.message
                };
            }

            return {
                success: true,
                redirectUrl: data.url,
                transactionId: data.id
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Network error initializing Stripe'
            };
        }
    }

    async handleWebhook(event: Request): Promise<void> {
        // Handled via Stripe library signature verification usually
        console.log("Stripe Webhook received");
    }
}
