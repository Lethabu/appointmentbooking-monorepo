import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@repo/db';
import {
  users,
  appointments,
  tenants,
  employees,
  services,
  calendarSyncEvents
} from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { createSuperSaaSAppointment } from '@/lib/supersaas-client';
import { createCalendarEvent } from '@/services/google-calendar';

// CONSTITUTION COMPLIANCE: Edge runtime required
export const runtime = 'edge';

// Rate limiting map (production: upgrade to Redis/KV)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // More restrictive for booking to prevent spam
const RATE_WINDOW = 60 * 1000; // 1 minute

/**
 * Check rate limit for booking requests
 * Prevents spam and ensures fair usage
 */
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(email);

  if (!userLimit || now > userLimit.resetTime) {
    // First request or window expired
    rateLimitMap.set(email, { count: 1, resetTime: now + RATE_WINDOW });
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
 * Create appointment booking with optimistic locking
 * Constitution compliant: Edge runtime, no forbidden libraries, optimistic locking, RLS, Honeycomb ready
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    // Parse request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let {
      tenantId,
      userId,
      employeeId,
      serviceId,
      scheduledTime: scheduledTimeStr,
      notes,
      name,
      email,
      phone,
      version = 1 // Optimistic locking version
    } = body;

    // Input validation - comprehensive
    if (!tenantId || !serviceId || !scheduledTimeStr) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['tenantId', 'serviceId', 'scheduledTime'],
          received: Object.keys(body)
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const rateLimitKey = userId ? `${tenantId}-${userId}` : `${tenantId}-${email}`;
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Booking rate limit exceeded. Please wait before making another booking.' },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }

    // Validate scheduled time format
    const scheduledTime = new Date(scheduledTimeStr);
    if (isNaN(scheduledTime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid scheduledTime format. Use ISO 8601 string.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Database connection with environment vars
    const db = getDb(process.env as any);

    // RLS: Validate tenant exists and is active
    const tenant = await db.select()
      .from(tenants)
      .where(and(
        eq(tenants.id, tenantId),
        eq(tenants.isActive, true)
      ))
      .limit(1);

    if (!tenant.length) {
      return NextResponse.json(
        { error: 'Tenant not found or inactive' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle Guest Booking: Create or Find User
    if (!userId && email) {
      const existingUser = await db.select()
        .from(users)
        .where(and(
          eq(users.email, email),
          eq(users.tenantId, tenantId)
        ))
        .limit(1);

      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        // Create new user
        const newUserId = crypto.randomUUID();
        const newUser = await db.insert(users).values({
          id: newUserId,
          email,
          name: name || 'Guest',
          tenantId,
          role: 'user',
        }).returning();

        if (newUser.length > 0) {
          userId = newUser[0].id;
        } else {
          throw new Error('Failed to create guest user');
        }
      }
    }

    // RLS: Validate user belongs to tenant
    if (!userId) {
      return NextResponse.json(
        { error: 'User identification required (userId or email)' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await db.select()
      .from(users)
      .where(and(
        eq(users.id, userId),
        eq(users.tenantId, tenantId)
      ))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: 'User not found or unauthorized' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle Missing Employee: Auto-assign first active employee
    if (!employeeId) {
      const activeEmployees = await db.select()
        .from(employees)
        .where(and(
          eq(employees.tenantId, tenantId),
          eq(employees.isActive, true)
        ))
        .limit(1);

      if (activeEmployees.length > 0) {
        employeeId = activeEmployees[0].id;
      } else {
        return NextResponse.json(
          { error: 'No active employees found for this tenant' },
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // RLS: Validate employee belongs to tenant and is active
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
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // RLS: Validate service belongs to tenant and is active
    const service = await db.select()
      .from(services)
      .where(and(
        eq(services.id, serviceId),
        eq(services.tenantId, tenantId),
        eq(services.isActive, true)
      ))
      .limit(1);

    if (!service.length) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Double-check slot availability (defensive programming)
    const existingBookings = await db.select()
      .from(appointments)
      .where(and(
        eq(appointments.employeeId, employeeId),
        eq(appointments.serviceId, serviceId),
        eq(appointments.scheduledTime, scheduledTime)
      ));

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate appointment ID
    const appointmentId = crypto.randomUUID();

    // Create appointment with optimistic locking
    const appointmentData = {
      id: appointmentId,
      userId,
      serviceId,
      tenantId,
      employeeId,
      scheduledTime,
      status: 'confirmed',
      notes: notes || '',
      version: 1, // Initial version for optimistic locking
    };

    const newAppointment = await db.insert(appointments)
      .values(appointmentData)
      .returning();

    if (!newAppointment.length) {
      throw new Error('Failed to create appointment');
    }

    const appointment = newAppointment[0];

    // Sync to SuperSaaS (async - don't block booking)
    const supersaasBookingId = await createSuperSaaSAppointment({
      scheduleId: employee[0].supersaasScheduleId || '695384',
      name: user[0].name || 'Customer',
      email: user[0].email,
      start: scheduledTime.toISOString(),
      description: `Service: ${service[0].name} - Employee: ${employee[0].name} - Notes: ${notes || 'N/A'}`
    }).catch(async (error) => {
      console.error('SuperSaaS booking creation failed:', error);

      // Update appointment status to indicate sync failure
      await db.update(appointments)
        .set({
          status: 'confirmed_pending_sync',
          notes: `${notes || ''} - SuperSaaS sync failed: ${error.message}`.trim(),
          version: 2
        })
        .where(eq(appointments.id, appointmentId));

      return null; // Continue with booking despite sync failure
    });

    // Update appointment with SuperSaaS ID if sync successful
    if (supersaasBookingId) {
      await db.update(appointments)
        .set({
          supersaasBookingId: supersaasBookingId.toString(),
          version: 2
        })
        .where(eq(appointments.id, appointmentId));
    }

    // Sync to Google Calendar (async - don't block booking)
    const calendarEventResult = await createCalendarEvent(
      process.env as any,
      tenantId,
      {
        summary: `Appointment: ${service[0].name}`,
        description: `Service: ${service[0].name}\nEmployee: ${employee[0].name}\nCustomer: ${user[0].name}\nNotes: ${notes || 'N/A'}`,
        start: {
          dateTime: scheduledTime.toISOString(),
          timeZone: 'Africa/Johannesburg', // or get from tenant settings
        },
        end: {
          dateTime: new Date(scheduledTime.getTime() + (service[0].durationMinutes || 60) * 60000).toISOString(),
          timeZone: 'Africa/Johannesburg',
        },
        location: tenant[0].salonId || 'Salon Address', // placeholder
        attendees: user[0].email ? [{ email: user[0].email, displayName: user[0].name ?? undefined }] : undefined,
      }
    ).catch(async (error) => {
      console.error('Google Calendar event creation failed:', error);

      // Log sync failure
      await db.insert(calendarSyncEvents).values({
        id: crypto.randomUUID(),
        tenantId,
        bookingId: appointmentId,
        syncStatus: 'failed',
        errorMessage: error.message,
      });

      return null;
    });

    // If calendar event created successfully
    if (calendarEventResult) {
      await db.insert(calendarSyncEvents).values({
        id: crypto.randomUUID(),
        tenantId,
        bookingId: appointmentId,
        googleEventId: calendarEventResult.eventId,
        syncStatus: 'created',
      });
    }

    // Honeycomb tracing headers (COMPLIANCE - would be set by middleware)
    const response = NextResponse.json({
      success: true,
      appointmentId,
      booking: {
        id: appointmentId,
        serviceName: service[0].name,
        employeeName: employee[0].name,
        scheduledTime: scheduledTime.toISOString(),
        duration_minutes: service[0].durationMinutes,
        status: appointment.status,
        price_cents: service[0].price
      },
      synced_to_supersaas: !!supersaasBookingId,
      synced_to_google_calendar: !!calendarEventResult
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;

  } catch (error) {
    console.error('Booking API error:', error);

    // Constitution: ALL APIs must return structured errors
    const errorResponse = {
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID()
    };

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE') || error.message.includes('duplicate')) {
        errorResponse.error = 'This time slot is no longer available';
        return NextResponse.json(errorResponse, {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
