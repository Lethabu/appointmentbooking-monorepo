import { getDb } from '@repo/db';
import { appointments, users, services } from '@repo/db';
import { eq, gte, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return Response.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const db = getDb((request as any).env as { DB: any });

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Math.floor(today.getTime() / 1000);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);

    const todaysAppointments = await db
      .select({
        id: appointments.id,
        scheduledTime: appointments.scheduledTime,
        status: appointments.status,
        notes: appointments.notes,
        userName: users.name,
        userEmail: users.email,
        serviceName: services.name,
        servicePrice: services.price,
        serviceDuration: services.durationMinutes,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.tenantId, tenantId))
      .orderBy(desc(appointments.scheduledTime))
      .limit(20);

    // Calculate stats
    const totalAppointments = todaysAppointments.length;
    const confirmedAppointments = todaysAppointments.filter((apt: any) => apt.status === 'confirmed').length;
    const pendingAppointments = todaysAppointments.filter((apt: any) => apt.status === 'pending').length;

    // Calculate revenue
    const totalRevenue = todaysAppointments
      .filter((apt: any) => apt.status === 'confirmed')
      .reduce((sum: number, apt: any) => sum + (apt.servicePrice || 0), 0);

    return Response.json({
      stats: {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        totalRevenue: totalRevenue / 100, // Convert cents to rand
      },
      appointments: todaysAppointments.map((apt: any) => ({
        id: apt.id,
        clientName: apt.userName,
        service: apt.serviceName,
        time: new Date(apt.scheduledTime * 1000).toLocaleTimeString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        duration: `${apt.serviceDuration}min`,
        status: apt.status,
        phone: 'N/A', // TODO: Add phone to user schema
        price: (apt.servicePrice || 0) / 100,
      })),
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

