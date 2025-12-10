// packages/worker/src/availability.ts
// Availability engine: calculates available time slots for a tenant on a given date

import type { D1Database } from '@cloudflare/workers-types'

export interface TimeSlot {
  start: string // ISO datetime
  end: string
  staffId?: string | null
}

/**
 * Get availability for a tenant on a specific date.
 * - Uses `staff_schedules` to determine resource capacity
 * - Uses `appointments` + `services` to determine occupied time ranges
 * - Returns a list of TimeSlot objects (ISO strings)
 */
export async function getAvailability(
  db: D1Database,
  tenantId: string,
  date: string, // YYYY-MM-DD
  serviceDurationMin: number,
  intervalMin = 30 // step increment for candidate slots
): Promise<TimeSlot[]> {
  // Normalize date and compute unix range for that date (local time assumed)
  const dayStartISO = `${date}T00:00:00`;
  const dayEndISO = `${date}T23:59:59`;
  const dayStartUnix = Math.floor(new Date(dayStartISO).getTime() / 1000);
  const dayEndUnix = Math.floor(new Date(dayEndISO).getTime() / 1000);

  // 1) Fetch schedules for the tenant for the dayOfWeek
  const dayOfWeek = new Date(date).getDay();
  const schedulesStmt = await db.prepare(`
    SELECT * FROM staff_schedules WHERE tenant_id = ? AND day_of_week = ? AND is_available = 1
  `).bind(tenantId, dayOfWeek).all();

  const schedules = (schedulesStmt.results || []) as any[];
  if (schedules.length === 0) return []

  // Determine the pool capacity for that day (number of resources working)
  const resourceCount = schedules.length

  // Determine the min start and max end across all schedules so we can generate candidate slots
  let earliest = '23:59'
  let latest = '00:00'
  for (const s of schedules) {
    if (s.start_time && s.start_time < earliest) earliest = s.start_time
    if (s.end_time && s.end_time > latest) latest = s.end_time
  }

  // 2) Fetch appointments for that tenant on that date and join to services to get duration
  const apptStmt = await db.prepare(`
    SELECT a.scheduled_time as scheduled_time, s.duration_minutes as duration_minutes
    FROM appointments a
    LEFT JOIN services s ON a.service_id = s.id
    WHERE a.tenant_id = ? AND a.status != 'cancelled' AND a.scheduled_time BETWEEN ? AND ?
  `).bind(tenantId, dayStartUnix, dayEndUnix).all();

  const appointments = (apptStmt.results || []) as Array<{ scheduled_time: number; duration_minutes: number | null }>;

  // Helper to check overlap
  const overlaps = (slotStartUnix: number, slotEndUnix: number) => {
    let count = 0
    for (const appt of appointments) {
      const apptStart = appt.scheduled_time
      const apptDur = appt.duration_minutes || 60
      const apptEnd = apptStart + apptDur * 60
      if (slotStartUnix < apptEnd && slotEndUnix > apptStart) count++
    }
    return count
  }

  // 3) Generate candidate slots from earliest to latest using intervalMin stepping
  const available: TimeSlot[] = []
  const startBase = new Date(`${date}T${earliest}:00`)
  const endBase = new Date(`${date}T${latest}:00`)

  let cursor = startBase.getTime()
  const serviceMs = serviceDurationMin * 60 * 1000
  const stepMs = intervalMin * 60 * 1000

  while (cursor + serviceMs <= endBase.getTime()) {
    const slotStartUnix = Math.floor(cursor / 1000)
    const slotEndUnix = Math.floor((cursor + serviceMs) / 1000)

    const concurrent = overlaps(slotStartUnix, slotEndUnix)
    if (concurrent < resourceCount) {
      available.push({
        start: new Date(cursor).toISOString(),
        end: new Date(cursor + serviceMs).toISOString(),
        staffId: null
      })
    }

    cursor += stepMs
  }

  return available
}
