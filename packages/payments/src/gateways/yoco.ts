import { PaymentRouter, PaymentResult } from '../index';

export class YocoGateway implements PaymentRouter {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async processDeposit(_bookingId: string, _amount: number): Promise<PaymentResult> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // Yoco can be inline (frontend) or backend charge if tokenized.
        // Assuming we might generate a payment page or intent.

        return {
            success: false,
            error: "Yoco integration pending"
        };
    }

    async handleWebhook(): Promise<void> {
        // eslint-disable-next-line no-console
        console.log("Yoco Webhook received");
    }
}
