import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

// Agent personality profiles
const AGENT_PROFILES = {
  Nia: `You are Nia, the ultra-efficient and friendly AI Salon Assistant for InStyle Hair Boutique. 

Your role:
- Help clients book appointments with warmth and professionalism
- Answer questions about salon services, pricing, and availability
- Make clients feel welcome and valued
- Use emojis appropriately (💇‍♀️, ✨, 💅) to create a friendly atmosphere

Your personality:
- Warm, professional, and approachable
- Efficient but never rushed
- Detail-oriented and organized
- Empathetic and understanding

When booking appointments:
1. Ask for preferred date and time
2. Confirm the service they want
3. Get their contact information
4. Provide confirmation details

Keep responses concise but friendly. Always end with a question or call-to-action.`,

  Blaze: `You are Blaze, a data-driven Digital Marketing Agent specializing in salon businesses.

Your role:
- Provide actionable marketing strategies
- Create engaging social media content
- Suggest promotional campaigns
- Analyze customer engagement tactics
- Help with brand positioning

Your personality:
- Bold, confident, and results-focused
- Data-driven but creative
- Direct and to-the-point
- Trend-aware and innovative

Provide marketing advice in bullet points when appropriate. Focus on ROI and measurable results. Use fire emoji 🔥 strategically.`,

  Nova: `You are Nova, a sharp Business Growth Strategist for salon owners.

Your role:
- Advise on business growth strategies
- Analyze pricing strategies
- Suggest service bundling opportunities
- Recommend client retention tactics
- Provide long-term business planning insights

Your personality:
- Analytical and strategic
- Professional and insightful
- Forward-thinking
- Data-informed but pragmatic

Provide structured advice with clear action steps. Focus on sustainable growth and profitability. Use chart emoji 📈 to emphasize growth opportunities.`
}

export async function POST(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    // Initialize OpenAI lazily inside the handler
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { agent, input, userId, tenantId } = await req.json();

    // Validate required fields
    if (!agent || !input) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: agent and input are required'
      }), { status: 400 });
    }

    // Validate agent exists
    if (!AGENT_PROFILES[agent]) {
      return new Response(JSON.stringify({
        error: 'Invalid agent. Must be: Nia, Blaze, or Nova'
      }), { status: 400 });
    }

    // --- STEP 1: Fetch user context (memory) ---
    let memoryContext = ''

    if (userId && tenantId) {
      try {
        // Get user's last appointment for context
        const { data: lastAppointment } = await supabase
          .from('appointments')
          .select('services(name), scheduled_time')
          .eq('user_id', userId)
          .eq('tenant_id', tenantId)
          .order('scheduled_time', { ascending: false })
          .limit(1)
          .single()

        if (lastAppointment && lastAppointment.services) {
          const serviceName = lastAppointment.services.name
          const lastVisit = new Date(lastAppointment.scheduled_time).toLocaleDateString()
          memoryContext = `\n\nIMPORTANT CONTEXT: This client's last service was "${serviceName}" on ${lastVisit}.`
        }

        // Get recent chat history for continuity
        const { data: recentChats } = await supabase
          .from('chat_logs')
          .select('message, role')
          .eq('user_id', userId)
          .eq('tenant_id', tenantId)
          .eq('agent_name', agent)
          .order('created_at', { ascending: false })
          .limit(3)

        if (recentChats && recentChats.length > 0) {
          const chatSummary = recentChats
            .reverse()
            .map(chat => `${chat.role}: ${chat.message}`)
            .join('\n')
          memoryContext += `\n\nRECENT CONVERSATION:\n${chatSummary}`
        }
      } catch (error) {
        console.error('[Agent API] Error fetching context:', error)
        // Continue without context if database fails
      }
    }

    // --- STEP 2: Construct the prompt ---
    const systemPrompt = AGENT_PROFILES[agent] + memoryContext
    const userPrompt = `Client: "${input}"\n\nRespond helpfully and professionally.`

    // --- STEP 3: Call OpenAI ---
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0].message.content

    // --- STEP 4: Log conversation to database ---
    if (userId && tenantId) {
      try {
        // Insert user message
        await supabase.from('chat_logs').insert({
          user_id: userId,
          tenant_id: tenantId,
          agent_name: agent,
          message: input,
          role: 'user',
          created_at: new Date().toISOString()
        })

        // Insert agent reply
        await supabase.from('chat_logs').insert({
          user_id: userId,
          tenant_id: tenantId,
          agent_name: agent,
          message: reply,
          role: 'agent',
          created_at: new Date().toISOString()
        })
      } catch (error) {
        console.error('[Agent API] Error logging conversation:', error)
        // Continue even if logging fails
      }
    }

    // --- STEP 5: Trigger WhatsApp notification (if applicable) ---
    if (agent === 'Nia' && userId && tenantId) {
      // Check if message is booking-related
      const bookingKeywords = ['book', 'appointment', 'schedule', 'confirm', 'reserve']
      const isBookingRelated = bookingKeywords.some(keyword =>
        input.toLowerCase().includes(keyword) || reply.toLowerCase().includes(keyword)
      )

      if (isBookingRelated) {
        try {
          // Get user's phone number
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', userId)
            .single()

          if (profile && profile.phone) {
            // Send WhatsApp notification via Edge Function
            await supabase.functions.invoke('send-whatsapp', {
              body: {
                to: profile.phone,
                message: `Hi! Your appointment request has been received. We'll confirm the details shortly. ✨💇‍♀️`
              }
            })
          }
        } catch (error) {
          console.error('[Agent API] WhatsApp notification failed:', error)
          // Don't fail the request if WhatsApp fails
        }
      }
    }

    // --- STEP 6: Return response ---
    return new Response(JSON.stringify({
      reply,
      agent,
      timestamp: new Date().toISOString()
    }), { status: 200 });

  } catch (error) {
    console.error('[Agent API] Error:', error)

    // Return appropriate error message
    if (error.message?.includes('API key')) {
      return new Response(JSON.stringify({
        error: 'OpenAI API configuration error. Please contact support.'
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      error: 'Failed to process request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), { status: 500 });
  }
}