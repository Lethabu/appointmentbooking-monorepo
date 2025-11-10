import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@repo/auth';
import { getDb } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { appointments, users } from '@repo/db';

// Cloudflare environment
const env = {
  DB: process.env.DB as any,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
};

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(getAuthOptions(env));

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant from headers (set by middleware)
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    const db = getDb({ DB: env.DB });

    // Get user from database to ensure they exist and belong to tenant
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, session.user.email!), eq(users.tenantId, tenantId)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found in tenant' }, { status: 404 });
    }

    // Get appointments for this user and tenant
    const userAppointments = await db
      .select()
      .from(appointments)
      .where(and(
        eq(appointments.userId, user[0].id),
        eq(appointments.tenantId, tenantId)
      ));

    return NextResponse.json({ appointments: userAppointments });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(getAuthOptions(env));

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant from headers
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    const body = await request.json();
    const { serviceId, scheduledTime, notes } = body;

    if (!serviceId || !scheduledTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb({ DB: env.DB });

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, session.user.email!), eq(users.tenantId, tenantId)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found in tenant' }, { status: 404 });
    }

    // Create appointment
    const newAppointment = await db
      .insert(appointments)
      .values({
        userId: user[0].id,
        serviceId,
        tenantId,
        scheduledTime: new Date(scheduledTime),
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ appointment: newAppointment[0] }, { status: 201 });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
