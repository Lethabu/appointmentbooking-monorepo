const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = 'pVq0j8Sm2jAaLW6BrBkI5Q';
const ACCOUNT = 'InStyle_Hair_Boutique';
const SCHEDULE_ID = '695384';
const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
const BASE_URL = 'https://www.supersaas.com/api';

function generateId(input) {
    return crypto.createHash('md5').update(input).digest('hex').substring(0, 32);
}

async function syncAppointments() {
    console.log('🔄 STARTING SUPERSAAS APPOINTMENT SYNC (RELATIONAL)');
    console.log('=================================================\n');

    try {
        const fromTime = new Date();
        fromTime.setFullYear(fromTime.getFullYear() - 1);
        const fromDateStr = fromTime.toISOString().split('T')[0];

        console.log(`📡 Fetching bookings from SuperSaaS since ${fromDateStr}...`);

        // Fetch bookings
        const bookingsResponse = await fetch(`${BASE_URL}/bookings.json?schedule_id=${SCHEDULE_ID}&account=${ACCOUNT}&api_key=${API_KEY}&video=true&limit=1000&from=${fromDateStr} 00:00:00`);
        if (!bookingsResponse.ok) throw new Error(`Booking API Error: ${bookingsResponse.status}`);
        const bookings = await bookingsResponse.json();

        // Fetch users (to get email/phone for historical consistency if needed, but bookings usually have it)
        // We'll rely on booking data.

        console.log(`✅ Retrieved ${bookings.length} bookings.\n`);

        const sqlStatements = [];
        const timestamp = Math.floor(Date.now() / 1000);

        sqlStatements.push(`-- SuperSaaS Relational Sync (${new Date().toISOString()})`);

        // We need to track created users to avoid duplicates in the same script (INSERT OR IGNORE handles DB, but optimization)
        const processedUsers = new Set();

        bookings.forEach(booking => {
            // Data Cleaning
            const fullName = (booking.full_name || 'Unknown Client').replace(/'/g, "''");
            const email = (booking.email || '').toLowerCase().replace(/'/g, "''");
            const phone = (booking.mobile || booking.phone || '').replace(/'/g, "''");
            const start = booking.start; // ISO
            const notes = (booking.description || '').replace(/'/g, "''");
            const status = booking.status ? 'confirmed' : 'pending';
            const bookingId = generateId(`booking-${booking.id}`); // Stable ID
            const supersaasId = booking.id;

            // Identify Service
            const serviceName = (booking.res_name || 'General Appt').replace(/'/g, "''");

            // Identify User
            // Use email as unique key if present, else phone, else name
            const userKey = email || phone || fullName;
            const userId = generateId(`user-${userKey}`);

            // 1. Create User SQL (if not already added to batch)
            if (!processedUsers.has(userId)) {
                sqlStatements.push(`
INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('${userId}', '${TENANT_ID}', '${fullName}', '${email}', '${phone}', ${timestamp}, ${timestamp});`);
                processedUsers.add(userId);
            }

            // 2. Create Appointment SQL
            // We look up service_id via subquery (best effort)

            sqlStatements.push(`
INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '${bookingId}',
  '${TENANT_ID}',
  '${userId}',
  COALESCE((SELECT id FROM services WHERE name = '${serviceName}' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '${start}'),
  '${status}',
  '${notes}',
  '${supersaasId}',
  ${timestamp},
  ${timestamp},
  'paid' -- Assumption for historical
);`);
        });

        const outputPath = path.join(__dirname, 'migrations', '020-sync-supersaas-appointments.sql');
        fs.writeFileSync(outputPath, sqlStatements.join('\n'));

        console.log(`💾 Generated SQL migration for ${sqlStatements.length} operations.`);
        console.log(`📂 Saved to: ${outputPath}`);

    } catch (error) {
        console.error('❌ Sync Failed:', error.message);
    }
}

syncAppointments();
