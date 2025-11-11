import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/packages/db/src';
import { users, appointments } from '@/packages/db/src/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const {
      serviceId,
      bookingDate,
      customerName,
      customerEmail,
      payment_reference,
      tenantId
    } = await request.json();

    if (!serviceId || !bookingDate || !customerName || !customerEmail || !payment_reference || !tenantId) {
      return NextResponse.json({ error: 'Missing required booking information.' }, { status: 400 });
    }

    // Get D1 database from environment
    const db = getDb(request.env as { DB: D1Database });

    // Find or create user
    let user = await db.select().from(users).where(eq(users.email, customerEmail)).limit(1);

    if (user.length === 0) {
      // Create new user
      const newUser = await db.insert(users).values({
        email: customerEmail,
        name: customerName,
        tenantId: tenantId,
      }).returning();

      user = newUser;
    }

    // Create appointment
    const scheduledTime = new Date(bookingDate);
    const appointmentData = {
      userId: user[0].id,
      serviceId: serviceId,
      tenantId: tenantId,
      scheduledTime: Math.floor(scheduledTime.getTime() / 1000), // Unix timestamp
      status: 'confirmed',
      notes: `Payment Reference: ${payment_reference}`,
    };

    const newAppointment = await db.insert(appointments).values(appointmentData).returning();

    // Sync to SuperSaaS
    try {
      await axios.post('https://www.supersaas.com/api/bookings.json', {
        schedule_id: 'Instyle Hair Boutique',
        full_name: customerName,
        email: customerEmail,
        start: scheduledTime.toISOString(),
        description: `Service ID: ${serviceId} - Payment: ${payment_reference}`
      }, {
        auth: {
          username: '5ciPW7IzfQRQy1wqdTsH6g',
          password: 'x'
        }
      });
    } catch (syncError) {
      console.error('SuperSaaS sync error:', syncError);
      // Don't fail the booking if SuperSaaS sync fails
    }

    return NextResponse.json({ success: true, booking: newAppointment[0] });

  } catch (error) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
