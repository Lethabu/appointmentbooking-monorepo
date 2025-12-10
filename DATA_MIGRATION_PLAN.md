# Instyle Data Migration Plan

## Migration Workflow

### Phase 1: Pre-Migration Validation (Now)

**Checklist:**
- [ ] Access SuperSaaS account admin panel
- [ ] Export services list and verify service IDs
- [ ] Export staff roster with schedules
- [ ] Export last 90 days of appointments
- [ ] Document any custom fields or metadata
- [ ] Identify staff → services assignments
- [ ] Review customer contact data for GDPR compliance

**Expected Data Points:**
```
Services: Hair installations, styling, makeup, products
Staff: 2-5 stylists with individual schedules
Appointments: ~50-150 historical bookings
Operating Hours: Mon-Sat 9AM-5PM (with possible variations)
```

---

### Phase 2: Data Extraction & Mapping

**Step 1: Run Migration Script**
```bash
export SUPERSAAS_API_KEY="your_api_key_here"
export SUPERSAAS_ACCOUNT_ID="instyle"
export TENANT_ID="ccb12b4d-ade6-467d-a614-7c9d198ddc70"

node scripts/migrate-supersaas-data.js
```

**Output**: JSON files in `migration-data/` directory
- `services.json` - All services with pricing and duration
- `staff.json` - Staff members and contact info
- `schedules.json` - Weekly schedules for each staff member
- `appointments.json` - Historical appointments
- `MIGRATION_REPORT.json` - Validation summary

**Step 2: Manual Validation**

Review generated JSON files:
```bash
# Check services
cat migration-data/*_services.json | jq '.[] | {id, name, duration_minutes, price_cents}'

# Check staff
cat migration-data/*_staff.json | jq '.[] | {id, name, email, phone}'

# Check sample appointments
cat migration-data/*_appointments.json | jq '.[0:3]'
```

**Common Issues to Check:**
- Services have unique IDs and pricing
- Staff names are readable (not encoded strangely)
- Schedules have valid start/end times
- Appointments have customer contact info
- Date formats are consistent

---

### Phase 3: D1 Database Import

**Step 1: Prepare Import SQL**

```sql
-- Insert services
INSERT INTO services (id, tenant_id, name, description, duration_minutes, price_cents, category, created_at, updated_at)
SELECT id, tenant_id, name, description, duration_minutes, price_cents, category, created_at, updated_at
FROM json_each(?)
WHERE id NOT NULL;

-- Insert staff
INSERT INTO staff (id, name, email, phone, created_at, updated_at)
SELECT id, name, email, phone, created_at, updated_at
FROM json_each(?)
WHERE id NOT NULL;

-- Insert schedules
INSERT INTO staff_schedules (id, tenant_id, staff_name, service_id, day_of_week, start_time, end_time, is_available, created_at, updated_at)
SELECT id, tenant_id, staff_name, service_id, day_of_week, start_time, end_time, is_available, created_at, updated_at
FROM json_each(?)
WHERE id NOT NULL;

-- Insert historical appointments
INSERT INTO appointments (id, tenant_id, customer_name, customer_email, customer_phone, service_id, staff_id, start_time, end_time, status, created_at, updated_at)
SELECT id, tenant_id, customer_name, customer_email, customer_phone, service_id, staff_id, start_time, end_time, status, created_at, updated_at
FROM json_each(?)
WHERE id NOT NULL;
```

**Step 2: Execute Import**

```bash
# Create migration file
cat > scripts/migrations/023-import-instyle-data.sql << 'EOF'
-- Import Instyle Hair Boutique data from SuperSaaS
-- This is a one-time migration for tenant ccb12b4d-ade6-467d-a614-7c9d198ddc70

-- Insert services
INSERT OR IGNORE INTO services (id, tenant_id, name, description, duration_minutes, price_cents, category, created_at, updated_at)
VALUES 
  ('svc_instyle_install', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Premium Installation', 'Expert installation for middle & side parts', 60, 30000, 'installation', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('svc_instyle_styling', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Traditional Styling', 'Maphondo, lines, and intricate patterns', 60, 35000, 'styling', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('svc_instyle_makeup', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Soft Glam Makeup', 'Professional makeup application', 120, 45000, 'makeup', (strftime('%s', 'now')), (strftime('%s', 'now')));

-- Insert staff members
INSERT OR IGNORE INTO staff (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES
  ('staff_zindzi', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'zindzi@instylehairboutique.co.za', '+27 (0)21 123 4567', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('staff_noma', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'noma@instylehairboutique.co.za', '+27 (0)21 234 5678', (strftime('%s', 'now')), (strftime('%s', 'now')));

-- Insert weekly schedules (Mon-Sat, 9AM-5PM)
INSERT OR IGNORE INTO staff_schedules (id, tenant_id, staff_id, staff_name, day_of_week, start_time, end_time, is_available, created_at, updated_at)
VALUES
  -- Zindzi: Mon-Sat, 9AM-5PM
  ('sch_zindzi_1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_zindzi', 'Zindzi', 1, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_zindzi', 'Zindzi', 2, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_zindzi', 'Zindzi', 3, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_zindzi', 'Zindzi', 4, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_zindzi', 'Zindzi', 5, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_zindzi', 'Zindzi', 6, '08:00', '16:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  -- Noma: Tue-Sat, 10AM-6PM
  ('sch_noma_2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_noma', 'Noma', 2, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_noma', 'Noma', 3, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_noma', 'Noma', 4, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_noma', 'Noma', 5, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'staff_noma', 'Noma', 6, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now')));
EOF

# Execute migration
npx wrangler d1 execute appointmentbooking-db --local --file=scripts/migrations/023-import-instyle-data.sql
```

---

### Phase 4: Data Verification

**Test 1: Query Services**
```sql
SELECT * FROM services WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
```
Expected: 3 services (installation, styling, makeup)

**Test 2: Query Staff Schedules**
```sql
SELECT day_of_week, start_time, end_time, staff_name 
FROM staff_schedules 
WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
ORDER BY day_of_week;
```
Expected: 11 schedules (Zindzi 6 days + Noma 5 days)

**Test 3: Query Appointments**
```sql
SELECT COUNT(*) FROM appointments WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
```
Expected: Count of historical appointments from SuperSaaS

**Test 4: Availability Endpoint (Manual)**
```bash
curl -X GET "https://www.instylehairboutique.co.za/api/tenant/ccb12b4d-ade6-467d-a614-7c9d198ddc70/availability?date=2025-12-11&serviceId=svc_instyle_install" \
  -H "Content-Type: application/json"
```
Expected: Array of available time slots (9:00-17:00 in 30-min intervals)

---

### Phase 5: End-to-End Testing

**Test Scenario 1: View Available Slots**
1. Go to: https://www.instylehairboutique.co.za/book/instylehairboutique
2. Select service "Premium Installation"
3. Select a future date (e.g., Dec 12)
4. Verify slots appear (should see 9:00, 9:30, 10:00, etc. based on availability)

**Test Scenario 2: Complete Booking**
1. Continue from above
2. Select a time slot
3. Enter customer name, email, phone
4. Proceed to payment
5. Verify appointment created in database

**Test Scenario 3: Admin Scheduling**
1. Go to: https://dashboard.instylehairboutique.co.za/schedules
2. Add new schedule or modify existing
3. Verify changes reflect in availability endpoint

---

## Issues & Troubleshooting

### Issue: "Service not found" after import
**Cause**: Service ID in availability query doesn't match imported service ID
**Fix**: Verify service IDs match in both services table and appointments table

### Issue: No time slots showing
**Cause**: Staff schedules not imported or day_of_week mismatch
**Fix**: 
- Check day_of_week values (0=Sunday, 1=Monday, etc.)
- Verify start_time and end_time formats are HH:MM

### Issue: Appointments not appearing in history
**Cause**: Date filtering in availability engine
**Fix**: Verify appointment dates are in D1 and after migration timestamp

---

## Rollback Plan

If migration causes issues:

```sql
-- Backup current state
-- Delete migrated data
DELETE FROM services WHERE id LIKE 'svc_instyle_%';
DELETE FROM staff_schedules WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
DELETE FROM appointments WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Revert to previous Worker version if needed
```

---

## Next Steps

1. Extract Instyle data from SuperSaaS
2. Review and validate migration data
3. Execute D1 import
4. Run end-to-end tests
5. Go live (switch traffic to Cloudflare Worker)
