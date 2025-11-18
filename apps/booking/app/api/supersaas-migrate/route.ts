import { getDb } from '@repo/db';
import { users, appointments } from '@repo/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Fetch existing bookings from SuperSaaS
    const response = await fetch(
      `https://www.supersaas.com/api/bookings.json?api_key=5ciPW7IzfQRQy1wqdTsH6g&from=2024-01-01`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
      return Response.json({ error: 'SuperSaaS API error' }, { status: 500 });
    }

    const { bookings } = await response.json();
    const db = getDb((request as any).env as { DB: any });

    // Migrate bookings to our D1 system
    const migratedBookings = [];
    const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'; // Instyle Hair Boutique

    for (const booking of bookings || []) {
      try {
        // Find or create user
        let user = await db.select().from(users).where(eq(users.email, booking.email)).limit(1);

        if (user.length === 0) {
          // Create new user
          const newUser = await db.insert(users).values({
            id: crypto.randomUUID(),
            email: booking.email,
            name: booking.full_name || booking.name,
            tenantId: tenantId,
          }).returning();
          user = newUser;
        }

        // Create appointment
        const scheduledTime = new Date(booking.start);
        const appointmentData = {
          id: crypto.randomUUID(),
          userId: user[0].id,
          serviceId: 'service_hair_treatment', // Default service, can be mapped better
          tenantId: tenantId,
          scheduledTime: scheduledTime,
          status: booking.status === 'confirmed' ? 'confirmed' : 'pending',
          notes: `Migrated from SuperSaaS - ${booking.description || ''}`,
        };

        const newAppointment = await db.insert(appointments).values(appointmentData).returning();
        migratedBookings.push(newAppointment[0]);

      } catch (bookingError) {
        console.error(`Error migrating booking ${booking.id}:`, bookingError);
        // Continue with other bookings
      }
    }

    return Response.json({
      message: `Migrated ${migratedBookings.length} bookings from SuperSaaS`,
      bookings: migratedBookings
    });

  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : 'Migration failed'
    }, { status: 500 });
  }
}

