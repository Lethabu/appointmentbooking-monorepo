import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reference, appointmentId } = await request.json();

    // Mock payment verification for now
    // TODO: Implement actual payment verification with PayStack API
    const result = {
      success: true,
      reference,
      appointmentId,
      status: 'verified'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 },
    );
  }
}
