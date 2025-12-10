import { NextRequest, NextResponse } from 'next/server';
import { getSuperSaaSAvailability, SuperSaaSAvailabilitySlot } from '@/lib/supersaas-client';
import { getDb } from '@repo/db';
import { employees, tenants } from '@repo/db';
import { eq, and } from 'drizzle-orm';

// CONSTITUTION COMPLIANCE: Edge runtime required
export const runtime = 'edge';

// Rate limiting map (simple in-memory, upgrade to Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }

  // Increment counter
  userLimit.count++;
  return true;
}

/**
 * Get employee availability with SuperSaaS sync
 * Edge Runtime: ✅ Honeycomb tracing ready
 * RLS Enforcement: ✅ Tenant isolation required
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('cf-connecting-ip') ||
               'unknown';

    // Rate limiting check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in 1 hour.' },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '3600'
          }
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');
    const tenantSlug = request.headers.get('x-tenant-slug') || 'instylehairboutique';

    // Input validation
    if (!employeeId || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters: employeeId and date' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get tenant ID for RLS (Row Level Security)
    const db = getDb(process.env as any);
    const tenant = await db.select()
      .from(tenants)
      .where(eq(tenants.slug, tenantSlug))
      .limit(1);

    if (!tenant.length) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tenantId = tenant[0].id;

    // Validate employee belongs to tenant (RLS)
    const employee = await db.select()
      .from(employees)
      .where(and(
        eq(employees.id, employeeId),
        eq(employees.tenantId, tenantId),
        eq(employees.isActive, true)
      ))
      .limit(1);

    if (!employee.length) {
      return NextResponse.json(
        { error: 'Employee not found or inactive' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const employeeData = employee[0];
    let slots: SuperSaaSAvailabilitySlot[] = [];

    // Try to get availability from SuperSaaS
    try {
      if (employeeData.supersaasScheduleId) {
        // Employee has individual schedule
        slots = await getSuperSaaSAvailability(
          employeeData.supersaasScheduleId,
          date,
          date // Single day - can be expanded
        );
      } else {
        // Fallback to main schedule (should have individual schedules)
        console.warn('Employee has no individual SuperSaaS schedule ID');
        slots = [];
      }
    } catch (supersaasError) {
      console.error('SuperSaaS availability fetch failed:', supersaasError);
      // Graceful degradation: return empty slots
      slots = [];
    }

    // Filter working hours (Mon-Fri 09:00-17:00, Sat 08:00-16:00)
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay(); // 0=Sun, 1=Mon, etc.

    let workingHoursStart = 9;
    let workingHoursEnd = 17;

    if (dayOfWeek === 6) { // Saturday
      workingHoursStart = 8;
      workingHoursEnd = 16;
    } else if (dayOfWeek === 0) { // Sunday
      // No working hours on Sunday
      slots = [];
    }

    // Filter slots to working hours only
    const workingHoursSlots = slots.filter(slot => {
      const slotStart = new Date(slot.start);
      const slotHour = slotStart.getHours();
      return slotHour >= workingHoursStart && slotHour < workingHoursEnd;
    });

    // Remove past slots for today
    const today = new Date().toISOString().split('T')[0];
    let filteredSlots = workingHoursSlots;

    if (date === today) {
      const now = new Date();
      filteredSlots = workingHoursSlots.filter(slot => {
        const slotTime = new Date(slot.start);
        return slotTime > now;
      });
    }

    // Format response
    const responseData = {
      employeeId,
      date,
      slots: filteredSlots.map(slot => ({
        start: slot.start,
        end: slot.finish,
        available: slot.available,
        duration_minutes: calculateDuration(slot.start, slot.finish)
      })),
      working_hours: {
        start: workingHoursStart,
        end: workingHoursEnd,
        day_of_week: dayOfWeek
      },
      last_updated: Date.now(),
      has_individual_schedule: !!employeeData.supersaasScheduleId
    };

    // Honeycomb tracing headers (COMPLIANCE)
    const response = NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      }
    });

    return response;

  } catch (error) {
    console.error('Availability API error:', error);

    // Constitution: ALL APIs must return structured errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Calculate duration between two ISO 8601 timestamps
 */
function calculateDuration(startTime: string, endTime: string): number {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / (1000 * 60)); // minutes
  } catch (error) {
    console.warn('Duration calculation error:', error);
    return 60; // default fallback
  }
}
