// packages/worker/src/cloudflare-ai-gateway.ts
// Cloudflare Workers AI Integration
// Uses Cloudflare's free AI gateway before hitting paid API keys
// Supports: Text completions, embeddings, and reasoning tasks

export interface CloudflareAIRequest {
  model: string;
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface CloudflareAIResponse {
  result: {
    response?: string;
    finish_reason?: string;
  };
}

/**
 * Call Cloudflare Workers AI (free tier before paid keys)
 * Models: @cf/meta/llama-2-7b-chat-int8, @cf/mistral/mistral-7b-instruct-v0.1
 */
export async function callCloudflareAI(
  env: any,
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = 500,
  temperature: number = 0.7
): Promise<string | null> {
  try {
    const response = await env.AI.run(model, {
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    if (response?.result?.response) {
      return response.result.response;
    }
    return null;
  } catch (err: any) {
    console.error('Cloudflare AI Error:', err);
    // Fallback or error handling
    return null;
  }
}

/**
 * Generate Revenue Audit using AI (for lead magnet)
 * Analyzes booking patterns and identifies lost revenue opportunities
 */
export async function generateRevenueAudit(
  env: any,
  tenantId: string,
  bookingData: Record<string, any>
): Promise<string | null> {
  const prompt = `
Analyze this service business booking data and identify revenue leakage:
- Total bookings last 30 days: ${bookingData.totalBookings}
- No-show rate: ${bookingData.noShowRate}%
- Average booking value: $${bookingData.avgValue}
- Clients who booked once and never returned: ${bookingData.oneTimeClients}
- SMS reminders sent: ${bookingData.smsReminders}

Provide 3 actionable insights to recover revenue. Be specific about dollar amounts.
`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  return await callCloudflareAI(env, '@cf/meta/llama-2-7b-chat-int8', messages, 400, 0.6);
}

/**
 * AI Client Re-booker
 * Suggests the best time to re-contact lapsed clients
 */
export async function suggestClientReengagement(
  env: any,
  clientData: Record<string, any>
): Promise<string | null> {
  const prompt = `
A client last booked ${clientData.daysSinceLastBooking} days ago.
They typically book every ${clientData.averageBookingFrequency} days.
Their last service was: ${clientData.lastService}

Suggest the BEST TIME (day of week, time) and MESSAGE to re-engage them. Be concise.
`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  return await callCloudflareAI(env, '@cf/mistral/mistral-7b-instruct-v0.1', messages, 200, 0.5);
}

/**
 * AI Impact Scorer
 * Scores digital formalization opportunities
 */
export async function scoreFormalizationOpportunity(
  env: any,
  tenantData: Record<string, any>
): Promise<Record<string, any> | null> {
  const prompt = `
Score this business on digital formalization (0-100):
- Has online booking: ${tenantData.hasOnlineBooking ? 'Yes' : 'No'}
- Tracks payments digitally: ${tenantData.digitialPayments ? 'Yes' : 'No'}
- Maintains client database: ${tenantData.hasClientDB ? 'Yes' : 'No'}
- Uses scheduling automation: ${tenantData.hasScheduling ? 'Yes' : 'No'}
- Has SMS/email notifications: ${tenantData.hasNotifications ? 'Yes' : 'No'}

Respond in JSON: { "score": 0-100, "gaps": ["..."], "immediate_wins": ["..."] }
`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callCloudflareAI(
    env,
    '@cf/meta/llama-2-7b-chat-int8',
    messages,
    300,
    0.5
  );

  if (response) {
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Check if requests come from Workers AI in free-tier mode
 */
export function isWorkerAIFreeTierAvailable(env: any): boolean {
  return !!(env.AI && typeof env.AI.run === 'function');
}

/**
 * Fallback to external API if Workers AI unavailable
 */
export async function callExternalAI(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = 500
): Promise<string | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    const data = await response.json() as any;
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('External AI Error:', err);
    return null;
  }
}
