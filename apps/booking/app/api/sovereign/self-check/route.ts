/**
 * 🦅 Sovereign Self-Check Endpoint
 * 
 * This endpoint provides real-time health and status information for the
 * AppointmentBooking Sovereign Node, enabling "God Mode" monitoring and
 * automated keep-alive protocols (Zombie Keeper).
 * 
 * Architecture: Reports on database connectivity, system latency, and operational mode
 * Frequency: Pinged every 6 hours by GitHub Actions to prevent cold starts
 * Caching: 30-second cache to prevent redundant Worker health checks
 */

import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Cloudflare Workers runtime

// Cache for health check results (30 second TTL)
let healthCache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 30000; // 30 seconds

export async function GET() {
  const start = Date.now();
  
  // Check if we have valid cached health data
  if (healthCache && (Date.now() - healthCache.timestamp) < CACHE_TTL_MS) {
    return NextResponse.json({
      ...healthCache.data,
      cached: true,
      latency: `${Date.now() - start}ms (cached)`
    }, {
      status: healthCache.data.status === 'OPERATIONAL' ? 200 : 503,
      headers: {
        'Cache-Control': 'public, max-age=30',
        'X-Sovereign-Node': 'appointmentbooking',
        'X-Lethabu-Mode': 'GOD_MODE',
        'X-Cache': 'HIT'
      }
    });
  }
  
  let dbStatus = 'unknown';
  let workerStatus = 'unknown';
  
  // Check Worker backend health
  try {
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'https://appointmentbooking-worker.houseofgr8ness.workers.dev';
    const healthResponse = await fetch(`${workerUrl}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5s timeout
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      workerStatus = healthData.status || 'healthy';
      dbStatus = healthData.database || 'healthy';
    } else {
      workerStatus = 'degraded';
      dbStatus = 'degraded';
    }
  } catch (e) {
    workerStatus = 'offline';
    dbStatus = 'offline';
    console.error('🦅 Sovereign Health Check: Worker unreachable', e);
  }

  const latency = Date.now() - start;
  const operational = dbStatus === 'healthy' && workerStatus === 'healthy';

  const healthData = {
    // Sovereign Node Identity
    status: operational ? 'OPERATIONAL' : 'DEGRADED',
    node: 'appointmentbooking-sovereign',
    mode: 'GOD_MODE',
    
    // System Health Metrics
    database: dbStatus,
    worker: workerStatus,
    latency: `${latency}ms`,
    
    // Version & Deployment Info
    version: '5.0.0-sovereign',
    runtime: 'cloudflare-workers',
    region: 'edge',
    
    // Lethabu Empire Integration Status
    empire: {
      node_type: 'booking_engine',
      engine: 'legacy', // ZAR-focused, Ubuntu mode
      sovereign: true,
      dependencies_eliminated: ['aisensy'],
      direct_integrations: ['meta_cloud_api']
    },
    
    // Timestamp
    timestamp: new Date().toISOString(),
    heartbeat: operational ? '💚' : '⚠️'
  };
  
  // Update cache with fresh data
  healthCache = {
    data: healthData,
    timestamp: Date.now()
  };

  return NextResponse.json({
    ...healthData,
    cached: false
  }, {
    status: operational ? 200 : 503,
    headers: {
      'Cache-Control': 'public, max-age=30',
      'X-Sovereign-Node': 'appointmentbooking',
      'X-Lethabu-Mode': 'GOD_MODE',
      'X-Cache': 'MISS'
    }
  });
}

// HEAD request for lightweight keep-alive checks
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Sovereign-Status': 'OPERATIONAL',
      'X-Node': 'appointmentbooking'
    }
  });
}
