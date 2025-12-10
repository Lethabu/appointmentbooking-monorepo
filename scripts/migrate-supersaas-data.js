#!/usr/bin/env node
/**
 * SuperSaaS → Cloudflare D1 Data Migration Script
 * Migrates Instyle Hair Boutique data
 * 
 * Usage: node scripts/migrate-supersaas-data.js --tenant-id ccb12b4d-ade6-467d-a614-7c9d198ddc70 --api-key YOUR_SUPERSAAS_API_KEY
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  superSaasApiUrl: 'https://www.supersaas.com/api/appointment',
  superSaasMembersUrl: 'https://www.supersaas.com/api/users',
  tenantId: process.env.TENANT_ID || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  superSaasApiKey: process.env.SUPERSAAS_API_KEY || '',
  superSaasAccountId: process.env.SUPERSAAS_ACCOUNT_ID || 'instyle', // From SuperSaaS account
  workerUrl: 'https://www.instylehairboutique.co.za',
  dataOutputDir: './migration-data',
};

// Logging utilities
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  success: (msg) => console.log(`[✓] ${msg}`),
};

// Make HTTPS request to SuperSaaS API
function makeHttpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CONFIG.superSaasAccountId}:${CONFIG.superSaasApiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            reject(new Error(`API Error ${res.statusCode}: ${data}`));
          } else {
            resolve(JSON.parse(data));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Step 1: Fetch services from SuperSaaS
async function fetchServices() {
  log.info('Fetching services from SuperSaaS...');
  try {
    // SuperSaaS stores services under schedule resources
    const data = await makeHttpsRequest(`${CONFIG.superSaasMembersUrl}?account=${CONFIG.superSaasAccountId}`);
    
    // Parse SuperSaaS response - typically returns list of resources/services
    const services = (data.user || data || []).map(item => ({
      id: `svc_${item.id}`,
      name: item.name || 'Unnamed Service',
      description: item.description || '',
      duration_minutes: parseInt(item.duration) || 60,
      price_cents: parseInt(item.price * 100) || 0,
      category: item.category || 'service',
      metadata: JSON.stringify({
        supersaas_id: item.id,
        migrated_at: new Date().toISOString(),
        original_data: item,
      }),
    }));

    log.success(`Fetched ${services.length} services`);
    return services;
  } catch (error) {
    log.error(`Failed to fetch services: ${error.message}`);
    throw error;
  }
}

// Step 2: Fetch staff members from SuperSaaS
async function fetchStaff() {
  log.info('Fetching staff members from SuperSaaS...');
  try {
    const data = await makeHttpsRequest(`${CONFIG.superSaasMembersUrl}?account=${CONFIG.superSaasAccountId}`);
    
    const staff = (data.staff || []).map(member => ({
      id: `staff_${member.id}`,
      name: member.name || member.full_name || 'Unknown Staff',
      email: member.email || '',
      phone: member.phone || '',
      metadata: JSON.stringify({
        supersaas_id: member.id,
        migrated_at: new Date().toISOString(),
      }),
    }));

    log.success(`Fetched ${staff.length} staff members`);
    return staff;
  } catch (error) {
    log.error(`Failed to fetch staff: ${error.message}`);
    throw error;
  }
}

// Step 3: Fetch schedules/availability from SuperSaaS
async function fetchSchedules(staff) {
  log.info('Fetching schedules from SuperSaaS...');
  try {
    const schedules = [];
    
    for (const member of staff) {
      log.info(`  Fetching schedule for ${member.name}...`);
      
      try {
        const data = await makeHttpsRequest(
          `${CONFIG.superSaasMembersUrl}/${member.id}/schedule?account=${CONFIG.superSaasAccountId}`
        );
        
        // Parse schedule data (typically week-based with working hours per day)
        const memberSchedules = parseScheduleData(data, member);
        schedules.push(...memberSchedules);
      } catch (err) {
        log.warn(`  Could not fetch schedule for ${member.name}: ${err.message}`);
      }
    }

    log.success(`Fetched schedules for ${staff.length} staff members`);
    return schedules;
  } catch (error) {
    log.error(`Failed to fetch schedules: ${error.message}`);
    throw error;
  }
}

// Parse SuperSaaS schedule format to our staff_schedules table format
function parseScheduleData(superSaasData, staff) {
  const schedules = [];
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // SuperSaaS typically returns schedule as hours per day
  // Example: { "monday": { "start": "09:00", "end": "17:00", "lunch": "12:00-13:00" }, ... }
  
  try {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayName = daysOfWeek[dayIndex];
      const dayData = superSaasData[dayName] || superSaasData[dayIndex] || {};
      
      if (dayData.start && dayData.end) {
        schedules.push({
          id: `sch_${staff.id}_${dayIndex}`,
          tenant_id: CONFIG.tenantId,
          staff_id: staff.id,
          staff_name: staff.name,
          service_id: null, // Will be populated per-service if needed
          day_of_week: dayIndex,
          start_time: dayData.start,
          end_time: dayData.end,
          is_available: true,
          resource_id: null,
          created_at: Math.floor(Date.now() / 1000),
          updated_at: Math.floor(Date.now() / 1000),
          metadata: JSON.stringify({
            supersaas_schedule: dayData,
            migrated_at: new Date().toISOString(),
          }),
        });
      }
    }
  } catch (err) {
    log.warn(`Error parsing schedule: ${err.message}`);
  }
  
  return schedules;
}

// Step 4: Fetch recent appointments from SuperSaaS (last 90 days)
async function fetchAppointments() {
  log.info('Fetching recent appointments from SuperSaaS (last 90 days)...');
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const fromDate = ninetyDaysAgo.toISOString().split('T')[0];
    
    const data = await makeHttpsRequest(
      `${CONFIG.superSaasApiUrl}?account=${CONFIG.superSaasAccountId}&from=${fromDate}`
    );
    
    const appointments = (data.appointments || []).map(apt => ({
      id: `apt_${apt.id}`,
      tenant_id: CONFIG.tenantId,
      customer_name: apt.customer_name || 'Unknown',
      customer_email: apt.customer_email || '',
      customer_phone: apt.customer_phone || '',
      service_id: apt.service_id ? `svc_${apt.service_id}` : null,
      staff_id: apt.user_id ? `staff_${apt.user_id}` : null,
      start_time: apt.start_time || apt.from,
      end_time: apt.end_time || apt.to,
      status: apt.status || 'confirmed', // 'pending', 'confirmed', 'cancelled'
      notes: apt.notes || '',
      resource_id: null,
      created_at: Math.floor(new Date(apt.created_on || Date.now()).getTime() / 1000),
      updated_at: Math.floor(new Date(apt.updated_on || Date.now()).getTime() / 1000),
      metadata: JSON.stringify({
        supersaas_id: apt.id,
        migrated_at: new Date().toISOString(),
        original_data: apt,
      }),
    }));

    log.success(`Fetched ${appointments.length} appointments`);
    return appointments;
  } catch (error) {
    log.error(`Failed to fetch appointments: ${error.message}`);
    throw error;
  }
}

// Step 5: Save migration data to JSON files
async function saveData(services, staff, schedules, appointments) {
  log.info('Saving migration data to files...');
  
  try {
    if (!fs.existsSync(CONFIG.dataOutputDir)) {
      fs.mkdirSync(CONFIG.dataOutputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const files = {
      'services.json': services,
      'staff.json': staff,
      'schedules.json': schedules,
      'appointments.json': appointments,
    };

    for (const [filename, data] of Object.entries(files)) {
      const filepath = path.join(CONFIG.dataOutputDir, `${timestamp}_${filename}`);
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      log.success(`Saved ${data.length} records to ${filepath}`);
    }

    // Also create a summary report
    const report = {
      migration_timestamp: new Date().toISOString(),
      tenant_id: CONFIG.tenantId,
      statistics: {
        services_count: services.length,
        staff_count: staff.length,
        schedules_count: schedules.length,
        appointments_count: appointments.length,
      },
      validation: {
        all_services_have_ids: services.every(s => s.id),
        all_staff_have_emails: staff.every(s => s.email), // Warning if not all have emails
        all_appointments_have_times: appointments.every(a => a.start_time && a.end_time),
      },
    };

    const reportPath = path.join(CONFIG.dataOutputDir, `${timestamp}_MIGRATION_REPORT.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log.success(`Migration report saved to ${reportPath}`);

  } catch (error) {
    log.error(`Failed to save migration data: ${error.message}`);
    throw error;
  }
}

// Step 6: Validate data integrity
function validateData(services, staff, schedules, appointments) {
  log.info('Validating migrated data...');
  
  let validationErrors = 0;

  // Check services
  if (services.length === 0) {
    log.warn('No services found!');
    validationErrors++;
  }
  services.forEach(s => {
    if (!s.id || !s.name || !s.duration_minutes) {
      log.warn(`Invalid service: ${JSON.stringify(s)}`);
      validationErrors++;
    }
  });

  // Check staff
  if (staff.length === 0) {
    log.warn('No staff members found!');
    validationErrors++;
  }

  // Check schedules
  if (schedules.length === 0) {
    log.warn('No schedules found!');
    validationErrors++;
  }
  schedules.forEach(s => {
    if (!s.start_time || !s.end_time || s.day_of_week === undefined) {
      log.warn(`Invalid schedule: ${JSON.stringify(s)}`);
      validationErrors++;
    }
  });

  // Check appointments
  appointments.forEach(a => {
    if (!a.start_time || !a.end_time) {
      log.warn(`Invalid appointment: ${JSON.stringify(a)}`);
      validationErrors++;
    }
    if (!a.customer_name || !a.service_id) {
      log.warn(`Missing critical appointment data: ${JSON.stringify(a)}`);
      validationErrors++;
    }
  });

  if (validationErrors === 0) {
    log.success('All data validation checks passed!');
  } else {
    log.warn(`Found ${validationErrors} validation issues`);
  }

  return validationErrors === 0;
}

// Main execution
async function main() {
  log.info('Starting SuperSaaS → D1 migration...');
  
  if (!CONFIG.superSaasApiKey) {
    log.error('SUPERSAAS_API_KEY environment variable not set!');
    process.exit(1);
  }

  try {
    // Fetch all data
    const services = await fetchServices();
    const staff = await fetchStaff();
    const schedules = await fetchSchedules(staff);
    const appointments = await fetchAppointments();

    // Validate data
    const isValid = validateData(services, staff, schedules, appointments);

    // Save to files for review
    await saveData(services, staff, schedules, appointments);

    // Print summary
    log.success('=== Migration Complete ===');
    console.log(`
Services: ${services.length}
Staff: ${staff.length}
Schedules: ${schedules.length}
Appointments: ${appointments.length}

Data saved to: ${CONFIG.dataOutputDir}/
Next step: Review data and run D1 INSERT statements

To import to D1:
1. Review the generated JSON files
2. Use wrangler d1 execute to run import SQL
3. Test availability endpoint with real data
4. Verify booking flow end-to-end
    `);

    if (!isValid) {
      log.warn('Some data validation issues detected. Please review before importing.');
    }

  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

main();
