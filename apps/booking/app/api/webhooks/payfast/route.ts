import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData.entries());
    
    // Mock PayFast webhook processing
    // TODO: Implement actual PayFast signature verification
    const orderId = payload.m_payment_id as string;

    if (payload.payment_status === 'COMPLETE') {
      // Mock order update
      console.log(`PayFast payment completed for order: ${orderId}`);
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('PayFast webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}