import { PaymentRouter, PaymentResult } from '../index';

export class PayFastGateway implements PaymentRouter {
    private merchantId: string;
    private merchantKey: string;
    private passphrase?: string;
    private sandbox: boolean;

    constructor(config: { merchantId: string, merchantKey: string, passphrase?: string, sandbox?: boolean }) {
        this.merchantId = config.merchantId;
        this.merchantKey = config.merchantKey;
        this.passphrase = config.passphrase;
        this.sandbox = config.sandbox ?? false;
    }

    async processDeposit(bookingId: string, amount: number): Promise<PaymentResult> {
        // PayFast is a redirect-based gateway
        // We need to generate the signature and return the redirect URL

        const baseUrl = this.sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

        // TODO: Implement full signature generation
        // For now, returning a mock URL to verify integration structure

        return {
            success: true,
            redirectUrl: `${baseUrl}?merchant_id=${this.merchantId}&merchant_key=${this.merchantKey}&amount=${amount}&item_name=Booking:${bookingId}`
        };
    }

    async handleWebhook(): Promise<void> {
        // Verify signature and update booking status
        // eslint-disable-next-line no-console
        console.log("PayFast Webhook received");
    }
}
