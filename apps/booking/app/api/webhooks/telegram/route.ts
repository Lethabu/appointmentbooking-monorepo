import { NextRequest, NextResponse } from 'next/server';
import { telegramBot } from '../../../../lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    
    // Verify webhook (optional but recommended)
    const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secretToken) {
      const providedToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (providedToken !== secretToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Process the update
    await telegramBot.processUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Telegram webhook active',
    timestamp: new Date().toISOString()
  });
}