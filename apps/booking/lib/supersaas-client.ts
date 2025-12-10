/**
 * SuperSaaS API Client - Edge Runtime Compatible
 * Complies with Constitution: No forbidden libraries (axios), native fetch only
 */

// Configuration constants
const SUPERSAAS_BASE_URL = 'https://www.supersaas.com/api';
const SCHEDULE_ID = '695384'; // Instyle Hair Boutique schedule

// Types for SuperSaaS responses
export interface SuperSaaSAppointment {
  id: string;
  name: string;
  email: string;
  start: string;
  finish: string;
  created_on: string;
  description?: string;
}

export interface SuperSaaSAvailabilitySlot {
  start: string;
  finish: string;
  available: boolean;
  booked_by?: string;
}

export interface AvailabilityResponse {
  slots: SuperSaaSAvailabilitySlot[];
  next_available: string | null;
  last_updated: number;
}

/**
 * Get authentication headers for SuperSaaS API
 */
function getAuthHeaders(): HeadersInit {
  const auth = {
    username: process.env.SUPERSAAS_API_KEY || 'pVq0j8Sm2jAaLW6BrBkI5Q',
    password: 'x' // Always 'x' for SuperSaaS
  };

  const credentials = btoa(`${auth.username}:${auth.password}`);
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AppointmentBooking/1.0'
  };
}

/**
 * Fetch appointments from SuperSaaS for a specific schedule
 * @param scheduleId SuperSaaS schedule ID
 * @param from Start date (YYYY-MM-DD)
 * @param to End date (YYYY-MM-DD)
 */
export async function getSuperSaaSAppointments(
  scheduleId: string = SCHEDULE_ID,
  from: string,
  to: string
): Promise<SuperSaaSAppointment[]> {
  const url = `${SUPERSAAS_BASE_URL}/bookings.json`;

  const params = new URLSearchParams({
    'from': from,
    'to': to,
    'schedule_id': scheduleId
  });

  const response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    // Edge runtime doesn't support AbortController yet
  });

  if (!response.ok) {
    console.error(`SuperSaaS API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch appointments: ${response.status}`);
  }

  const appointments: SuperSaaSAppointment[] = await response.json();
  return appointments || [];
}

/**
 * Get availability slots from SuperSaaS
 * @param scheduleId SuperSaaS schedule ID
 * @param from Start date (YYYY-MM-DD)
 * @param to End date (YYYY-MM-DD)
 */
export async function getSuperSaaSAvailability(
  scheduleId: string = SCHEDULE_ID,
  from: string,
  to: string
): Promise<SuperSaaSAvailabilitySlot[]> {
  const url = `${SUPERSAAS_BASE_URL}/free.json`;

  const params = new URLSearchParams({
    'from': from,
    'to': to,
    'schedule_id': scheduleId
  });

  const response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    console.error(`SuperSaaS availability error: ${response.status} ${response.statusText}`);
    // Return empty slots on failure (graceful degradation)
    return [];
  }

  const slots: SuperSaaSAvailabilitySlot[] = await response.json();
  return slots || [];
}

/**
 * Check if a specific time slot is available
 * @param scheduleId SuperSaaS schedule ID
 * @param start Start time (ISO 8601)
 * @param end End time (ISO 8601)
 */
export async function checkSlotAvailability(
  scheduleId: string = SCHEDULE_ID,
  start: string,
  end: string
): Promise<boolean> {
  const from = new Date(start).toISOString().split('T')[0];
  const to = new Date(end).toISOString().split('T')[0];

  try {
    const availability = await getSuperSaaSAvailability(scheduleId, from, to);
    const requestedSlot = availability.find(
      slot => slot.start === start && slot.finish === end
    );

    return requestedSlot?.available ?? false;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    // Assume available on error (defensive programming)
    return true;
  }
}

/**
 * Create appointment in SuperSaaS
 * @param appointment Appointment details
 */
export async function createSuperSaaSAppointment(appointment: {
  scheduleId?: string;
  name: string;
  email: string;
  start: string;
  description?: string;
}): Promise<string | number> {
  const url = `${SUPERSAAS_BASE_URL}/bookings.json`;

  const bookingData = {
    schedule_id: appointment.scheduleId || SCHEDULE_ID,
    name: appointment.name,
    email: appointment.email,
    start: appointment.start,
    description: appointment.description || 'Appointment booked via online booking system'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SuperSaaS booking error: ${response.status} ${response.statusText} - ${errorText}`);
    throw new Error(`Failed to create SuperSaaS appointment: ${response.status}`);
  }

  const result: SuperSaaSAppointment = await response.json();
  return result.id;
}

/**
 * Cancel appointment in SuperSaaS
 * @param appointmentId SuperSaaS appointment ID
 * @param scheduleId Schedule ID
 */
export async function cancelSuperSaaSAppointment(
  appointmentId: string | number,
  scheduleId: string = SCHEDULE_ID
): Promise<boolean> {
  const url = `${SUPERSAAS_BASE_URL}/bookings.json`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id: appointmentId,
      schedule_id: scheduleId
    }),
  });

  if (!response.ok) {
    console.error(`SuperSaaS cancellation error: ${response.status} ${response.statusText}`);
    return false;
  }

  return true;
}

/**
 * Validate SuperSaaS API connectivity
 */
export async function validateSuperSaaSConnection(): Promise<boolean> {
  try {
    const appointments = await getSuperSaaSAppointments(
      SCHEDULE_ID,
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 86400000).toISOString().split('T')[0] // Next day
    );
    return Array.isArray(appointments);
  } catch (error) {
    console.error('SuperSaaS connection validation failed:', error);
    return false;
  }
}
