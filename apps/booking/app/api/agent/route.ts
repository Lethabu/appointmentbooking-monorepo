import OpenAI from 'openai'
import { createClient } from '@/lib/supabase-server'

// Define the structure of the request body for type safety
interface AgentRequestBody {
  agent: 'Nia' | 'Blaze' | 'Nova';
  input: string;
  userId?: string;
  tenantId?: string;
}

// Initialize OpenAI with better error handling
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'missing-key'
})

// Initialize Supabase
const supabase = createClient()

// Agent personality profiles (enhanced from provided schema)
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

export async function POST(request: Request) {
  try {
    const { agent, input, userId, tenantId }: AgentRequestBody = await request.json()

    // Validate required fields
    if (!agent || !input) {
      return Response.json({
        error: 'Missing required fields: agent and input are required'
      }, { status: 400 })
    }

    // Validate agent exists
    if (!AGENT_PROFILES[agent]) {
      return Response.json({
        error: 'Invalid agent. Must be: Nia, Blaze, or Nova'
      }, { status: 400 })
    }

    // Fetch user context (memory) for personalized responses
    let memoryContext = await buildMemoryContext(userId, tenantId, agent)

    // Construct the AI prompt
    const systemPrompt = AGENT_PROFILES[agent] + memoryContext
    const userPrompt = `Client: "${input}"\n\nRespond helpfully and professionally.`

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'missing-key') {
      console.error('OpenAI API key not configured')
      return Response.json({
        error: 'AI service temporarily unavailable. Please contact support.'
      }, { status: 503 })
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // More cost-effective than gpt-4
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'

    // Log conversation to database (async, don't block response)
    if (userId && tenantId) {
      logConversation(userId, tenantId, agent, input, reply).catch(error => {
        console.error('[Agent API] Failed to log conversation:', error)
      })
    }

    // Trigger WhatsApp notification for booking-related conversations
    if (agent === 'Nia' && userId && tenantId) {
      triggerWhatsAppNotification(input, reply, userId).catch(error => {
        console.error('[Agent API] WhatsApp notification failed:', error)
      })
    }

    // Return response
    return Response.json({
      reply,
      agent,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Agent API] Error:', error)

    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    if (errorMessage.includes('API key')) {
      return Response.json({
        error: 'AI service configuration error. Please contact support.'
      }, { status: 500 })
    }

    if (errorMessage.includes('rate limit')) {
      return Response.json({
        error: 'Too many requests. Please try again in a moment.'
      }, { status: 429 })
    }

    return Response.json({
      error: 'Failed to process request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : null
    }, { status: 500 })
  }
}

/**
 * Build context string from user history and recent conversations
 */
async function buildMemoryContext(userId?: string, tenantId?: string, agent?: string): Promise<string> {
  if (!userId || !tenantId) return ''

  let memoryContext = ''

  try {
    // Get user's last appointment for context
    const { data: lastAppointment } = await supabase
      .from('appointments')
      .select('services(name), scheduled_time')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId || 'instyle')
      .order('scheduled_time', { ascending: false })
      .limit(1)
      .single()

    if (lastAppointment && lastAppointment.services && Array.isArray(lastAppointment.services) && lastAppointment.services.length > 0) {
      const serviceName = lastAppointment.services[0]?.name
      if (serviceName) {
        const lastVisit = new Date(lastAppointment.scheduled_time).toLocaleDateString()
        memoryContext += `\n\nIMPORTANT CONTEXT: This client's last service was "${serviceName}" on ${lastVisit}.`
      }
    }

    // Get recent chat history for conversation continuity
    if (agent) {
      const { data: recentChats } = await supabase
        .from('chat_logs')
        .select('message, role, created_at')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId || 'instyle')
        .eq('agent_name', agent)
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentChats && recentChats.length > 0) {
        const chatSummary = recentChats
          .reverse()
          .map(chat => `${chat.role}: ${chat.message.slice(0, 100)}${chat.message.length > 100 ? '...' : ''}`)
          .join('\n')
        memoryContext += `\n\nRECENT CONVERSATION CONTEXT (last 5 messages):\n${chatSummary}`
      }
    }
  } catch (error) {
    console.error('[Agent API] Error building memory context:', error)
    // Continue without context if database fails
  }

  return memoryContext
}

/**
 * Log conversation to database
 */
async function logConversation(userId: string, tenantId: string, agent: string, userMessage: string, agentReply: string) {
  try {
    // Log user message
    await supabase.from('chat_logs').insert({
      user_id: userId,
      tenant_id: tenantId,
      agent_name: agent,
      message: userMessage,
      role: 'user'
    })

    // Log agent reply
    await supabase.from('chat_logs').insert({
      user_id: userId,
      tenant_id: tenantId,
      agent_name: agent,
      message: agentReply,
      role: 'agent'
    })
  } catch (error) {
    console.error('[Agent API] Error logging conversation:', error)
    throw error
  }
}

/**
 * Trigger WhatsApp notification for booking-related conversations
 */
async function triggerWhatsAppNotification(userMessage: string, agentReply: string, userId: string) {
  try {
    // Check if conversation is booking-related
    const bookingKeywords = ['book', 'appointment', 'schedule', 'confirm', 'reserve']
    const isBookingRelated = bookingKeywords.some(keyword =>
      userMessage.toLowerCase().includes(keyword) ||
      agentReply.toLowerCase().includes(keyword)
    )

    if (!isBookingRelated) return

    // Get user's phone number
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single()

    if (!profile?.phone) return

    // Send WhatsApp notification
    await supabase.functions.invoke('send-whatsapp', {
      body: {
        to: profile.phone,
        message: `Hi! Your appointment request has been received. We'll confirm the details shortly. ✨💇‍♀️`
      }
    })

  } catch (error) {
    console.error('[Agent API] WhatsApp trigger error:', error)
    // Don't throw - notification failures shouldn't break the main flow
  }
}

  