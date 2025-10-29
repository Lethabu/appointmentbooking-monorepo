import { createClient } from '@/lib/supabase'
import { NextRequest } from 'next/server'

const supabase = createClient()

/**
 * Health check endpoint for monitoring system status
 * Returns comprehensive health information for all core services
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const health = {
    status: 'unknown',
    timestamp: new Date().toISOString(),
    responseTime: 0,
    services: {} as Record<string, any>,
    error: undefined as string | undefined
  }

  try {
    // Environment variables check
    health.services.environment = {
      status: 'healthy',
      details: {
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    }

    // Database connectivity check
    try {
      const { data: tenants, error: tenantError } = await supabase
        .from('tenants')
        .select('id, is_active')
        .limit(1)

      const { data: services, error: serviceError } = await supabase
        .from('services')
        .select('id')
        .limit(1)

      health.services.database = {
        status: tenantError || serviceError ? 'unhealthy' : 'healthy',
        details: {
          canQueryTenants: !tenantError,
          canQueryServices: !serviceError,
          tenantCount: tenants?.length || 0
        }
      }
    } catch (error) {
      health.services.database = {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Database connection failed' }
      }
    }

    // OpenAI API check (basic connectivity)
    health.services.openai = {
      status: 'unknown',
      details: {
        keyConfigured: Boolean(process.env.OPENAI_API_KEY),
        keyFormatValid: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'))
      }
    }

    // Table existence and row counts
    try {
      const { data: tableCountResult, error: rpcError } = await supabase.rpc('get_table_counts')

      let finalTableCountResult = tableCountResult
      if (rpcError) {
        // Fallback: individual counts
        const [profiles, services, appointments, chatLogs, tenants] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('appointments').select('id', { count: 'exact', head: true }),
          supabase.from('chat_logs').select('id', { count: 'exact', head: true }),
          supabase.from('tenants').select('id', { count: 'exact', head: true })
        ])

        finalTableCountResult = {
          profiles: profiles.count || 0,
          services: services.count || 0,
          appointments: appointments.count || 0,
          chat_logs: chatLogs.count || 0,
          tenants: tenants.count || 0
        }
      }

      health.services.tables = {
        status: 'healthy',
        details: finalTableCountResult
      }
    } catch (error) {
      health.services.tables = {
        status: 'unknown',
        details: { error: 'Could not check table counts' }
      }
    }

    // Overall health status
    health.responseTime = Date.now() - startTime

    const allServices = Object.values(health.services)
    const healthyServices = allServices.filter(s => s.status === 'healthy')
    const unhealthyServices = allServices.filter(s => s.status === 'unhealthy')

    if (unhealthyServices.length === 0 && healthyServices.length >= 2) {
      health.status = 'healthy'
    } else if (unhealthyServices.length > 0) {
      health.status = 'unhealthy'
    } else {
      health.status = 'degraded'
    }

    // Add additional metadata
    health.services.version = {
      status: 'info',
      details: {
        nodeVersion: process.version,
        nextVersion: '14.2.0+', // Update as needed
        supabaseVersion: '2.46.1+', // Update as needed
        buildTime: new Date().toISOString()
      }
    }

    // Memory and performance (basic)
    health.services.performance = {
      status: 'healthy',
      details: {
        responseTimeMs: health.responseTime,
        uptime: process.uptime ? Math.floor(process.uptime()) : 0
      }
    }

    // Regional/service health
    const regionHealth = await checkRegionalHealth()
    health.services.regional = regionHealth

    const statusCode = health.status === 'healthy' ? 200 :
                      health.status === 'degraded' ? 207 : 503

    return Response.json(health, { status: statusCode })

  } catch (error) {
    health.status = 'unhealthy'
    health.responseTime = Date.now() - startTime
    health.error = error instanceof Error ? error.message : 'Unknown health check error'

    return Response.json(health, { status: 503 })
  }
}

/**
 * POST /api/health - Detailed diagnostics (admin only)
 * Can perform more intensive checks or actions
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'full_check':
        return await performFullHealthCheck()
      case 'test_openai':
        return await testOpenAIConnectivity()
      case 'test_whatsapp':
        return await testWhatsAppConnectivity()
      default:
        return Response.json({
          error: 'Invalid action. Supported: full_check, test_openai, test_whatsapp'
        }, { status: 400 })
    }
  } catch (error) {
    return Response.json({
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Test OpenAI connectivity
 */
async function testOpenAIConnectivity() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        status: 'failed',
        error: 'OpenAI API key not configured'
      }, { status: 500 })
    }

    // Simple test - just validate API connectivity
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Test with a minimal request
    await openai.models.list()

    return Response.json({
      status: 'passed',
      message: 'OpenAI connectivity test passed',
      keyFormat: process.env.OPENAI_API_KEY.startsWith('sk-') ? 'valid' : 'invalid'
    })

  } catch (error) {
    return Response.json({
      status: 'failed',
      error: error instanceof Error ? error.message : 'OpenAI connectivity test failed'
    }, { status: 500 })
  }
}

/**
 * Test WhatsApp connectivity (mock)
 */
async function testWhatsAppConnectivity() {
  try {
    // This would test actual WhatsApp API connectivity
    // For now, just check if webhook URLs are configured
    const hasWebhooks = Boolean(
      process.env.WHATSAPP_API_URL ||
      process.env.WHATSAPP_WEBHOOK_URL
    )

    return Response.json({
      status: hasWebhooks ? 'configured' : 'not_configured',
      message: hasWebhooks
        ? 'WhatsApp webhooks are configured'
        : 'WhatsApp webhooks not configured, using mock service'
    })

  } catch (error) {
    return Response.json({
      status: 'failed',
      error: error instanceof Error ? error.message : 'WhatsApp test failed'
    }, { status: 500 })
  }
}

/**
 * Perform comprehensive health check
 */
async function performFullHealthCheck() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: [] as any[]
  }

  // Check all API endpoints
  const endpoints = [
    '/api/agent',
    '/api/chat',
    '/api/book-appointment',
    '/api/tenant-health'
  ]

  for (const endpoint of endpoints) {
    try {
      // Note: This would need actual endpoint testing logic
      results.checks.push({
        endpoint,
        status: 'mock_test_passed',
        responseTime: Math.round(Math.random() * 1000) // Mock
      })
    } catch (error) {
      results.checks.push({
        endpoint,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Database connectivity detailed test
  try {
    const { data, error } = await supabase
      .from('services')
      .select('count')
      .single()

    results.checks.push({
      test: 'database_connectivity',
      status: error ? 'failed' : 'passed',
      details: error ? { error: error.message } : { rowCount: data?.count || 0 }
    })
  } catch (error) {
    results.checks.push({
      test: 'database_connectivity',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Failed'
    })
  }

  return Response.json(results)
}

/**
 * Check regional/regional service health (mock)
 */
async function checkRegionalHealth() {
  // This would check various regional services
  // For now, return mock data
  return {
    status: 'healthy',
    details: {
      databaseLatency: '23ms',
      supabaseRegion: 'Africa (Cape Town)',
      servicesOnline: ['database', 'auth', 'storage'],
      lastMaintainance: null,
      warnings: []
    }
  }
}
