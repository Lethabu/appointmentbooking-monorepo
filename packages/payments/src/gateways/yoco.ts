import { PaymentRouter, PaymentResult } from '../index';

export class YocoGateway implements PaymentRouter {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async processDeposit(bookingId: string, amount: number, currency: string, bookingDetails: any): Promise<PaymentResult> {
        // Yoco can be inline (frontend) or backend charge if tokenized.
        // Assuming we might generate a payment page or intent.

        return {
            success: false,
            error: "Yoco integration pending"
        };
    }

    async handleWebhook(event: Request): Promise<void> {
        console.log("Yoco Webhook received");
    }
}
