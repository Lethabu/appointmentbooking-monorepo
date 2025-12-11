interface AiLogRequest {
  agentName: string;
  userId?: string;
  sessionId: string;
  query: string;
  response: string;
  responseTimeMs: number;
  resolved?: boolean;
  escalated?: boolean;
  satisfactionScore?: number;
  errorMessage?: string;
}

export async function handleAiEndpoint(request: Request, env: any) {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get('tenantId');

  if (!tenantId) {
    return new Response(JSON.stringify({ error: 'tenantId required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    if (request.method === 'GET') {
      // Get AI conversation stats using raw SQL to avoid Drizzle issues
      const conversationsResult = await env.DB.prepare(`
        SELECT * FROM ai_agent_logs
        WHERE tenant_id = ?
        ORDER BY timestamp DESC
        LIMIT 100
      `).bind(tenantId).all();

      const conversations = conversationsResult.results || [];

      const stats = {
        totalConversations: conversations.length,
        resolvedIssues: conversations.filter((c: any) => c.resolved).length,
        escalatedToHuman: conversations.filter((c: any) => c.escalated).length,
        avgResponseTime: conversations.length > 0 ?
          conversations.reduce((acc: number, c: any) => acc + (c.response_time_ms || 0), 0) / conversations.length : 0,
        recentConversations: conversations.slice(0, 10)
      };

      return new Response(JSON.stringify({ stats }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST') {
      // Log new AI conversation using raw SQL
      const body: AiLogRequest = await request.json();
      const { agentName, userId, sessionId, query, response, responseTimeMs, resolved, escalated, satisfactionScore, errorMessage } = body;

      const logId = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);

      await env.DB.prepare(`
        INSERT INTO ai_agent_logs (
          id, tenant_id, agent_name, user_id, session_id, query, response,
          response_time_ms, resolved, escalated, satisfaction_score, error_message, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        logId,
        tenantId,
        agentName,
        userId || null,
        sessionId,
        query,
        response,
        responseTimeMs,
        resolved ? 1 : 0,
        escalated ? 1 : 0,
        satisfactionScore || null,
        errorMessage || null,
        timestamp
      ).run();

      return new Response(JSON.stringify({ success: true, id: logId }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
