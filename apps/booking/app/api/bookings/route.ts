import { NextRequest, NextResponse } from 'next/server';
import { getPaymentGateway, PaymentGateway, PaymentRouter, StripeGateway, PayFastGateway, YocoGateway, PaystackGateway } from '@repo/payments';
// Note: In real implementation, we would import the DB client and schema
// import { db } from '@/lib/db'; 

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as { serviceId: string; time: string; tenantId: string; customerDetails: any };
        const { serviceId, time, tenantId, customerDetails } = body;

        // 1. Fetch Tenant Config (Mocked for now)
        const tenantConfig = {
            currency: 'ZAR',
            country: 'ZA',
            paymentConfig: {
                // In real app, these come from encrypted DB fields
                stripeSecret: process.env.STRIPE_SECRET_KEY,
                payfastMerchantId: process.env.PAYFAST_MERCHANT_ID,
                payfastMerchantKey: process.env.PAYFAST_MERCHANT_KEY,
                yocoSecret: process.env.YOCO_SECRET,
                paystackSecret: process.env.PAYSTACK_SECRET
            }
        };

        // 2. Calculate Price & Deposit (Mocked)
        const servicePrice = 500.00; // R500
        const depositAmount = 250.00; // 50% deposit

        // 3. Create Pending Booking (Mocked DB insert)
        const bookingId = `bk_${Date.now()}`;
        console.log(`Creating pending booking ${bookingId} for tint ${tenantId}`);

        // 4. Initialize Payment
        const gatewayType = getPaymentGateway({ currency: tenantConfig.currency, country: tenantConfig.country });
        let gateway: PaymentRouter;

        switch (gatewayType) {
            case PaymentGateway.STRIPE:
                gateway = new StripeGateway({ secretKey: tenantConfig.paymentConfig.stripeSecret! });
                break;
            case PaymentGateway.PAYFAST:
                gateway = new PayFastGateway({
                    merchantId: tenantConfig.paymentConfig.payfastMerchantId!,
                    merchantKey: tenantConfig.paymentConfig.payfastMerchantKey!
                });
                break;
            case PaymentGateway.YOCO:
                gateway = new YocoGateway({ secretKey: tenantConfig.paymentConfig.yocoSecret! });
                break;
            case PaymentGateway.PAYSTACK:
                gateway = new PaystackGateway({ secretKey: tenantConfig.paymentConfig.paystackSecret! });
                break;
            default:
                return NextResponse.json({ error: 'Unsupported gateway' }, { status: 500 });
        }

        const paymentResult = await gateway.processDeposit(
            bookingId,
            depositAmount,
            tenantConfig.currency,
            {
                customerEmail: customerDetails.email,
                baseUrl: req.nextUrl.origin,
                tenantId: tenantId
            }
        );

        if (!paymentResult.success) {
            return NextResponse.json({ error: paymentResult.error }, { status: 400 });
        }

        return NextResponse.json({
            bookingId,
            status: 'pending_payment',
            paymentUrl: paymentResult.redirectUrl,
            transactionId: paymentResult.transactionId
        });

    } catch (error: any) {
        console.error('Booking creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
