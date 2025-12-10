# Production Monitoring & Availability Endpoint

## Deployed Worker Details
- **Worker Name**: appointmentbooking-monorepo
- **Version ID**: aa1014b6-fa52-44bc-a106-6303ed602896
- **Custom Domains**: www.instylehairboutique.co.za, instylehairboutique.co.za
- **D1 Database**: appointmentbooking-db (59c06cd2-8bd2-45cf-ab62-84d7a4919e11)

## Monitoring Setup

### 1. Availability Endpoint Performance Metrics

**Endpoint**: `GET /api/tenant/:tenantId/availability?date=YYYY-MM-DD&serviceId=SERVICE_ID`

**Key Metrics to Track**:
- Response time (target: <200ms)
- Error rate (target: <0.1%)
- P95/P99 latency percentiles
- Cache hit ratio
- Database query performance

**Cloudflare Analytics**:
- Access Cloudflare Dashboard → Workers Analytics
- Monitor: Request Rate, Error Rates, CPU Time

### 2. Database Performance

**D1 Monitoring**:
- Query execution times
- Available/scheduled staff members per tenant
- Appointment load patterns
- Resource utilization

**Key Queries to Monitor**:
```sql
-- Query 1: Staff schedule load
SELECT COUNT(*) as schedule_count FROM staff_schedules WHERE tenant_id = ?;

-- Query 2: Appointment concurrency
SELECT DATE(start_time) as date, COUNT(*) as appointment_count 
FROM appointments 
WHERE tenant_id = ? AND DATE(start_time) = ?
GROUP BY DATE(start_time);

-- Query 3: Service availability
SELECT s.id, s.name, s.duration_minutes, COUNT(ss.id) as assigned_staff
FROM services s
LEFT JOIN staff_schedules ss ON s.id = ss.service_id
WHERE s.tenant_id = ?
GROUP BY s.id;
```

### 3. Alert Thresholds

**Set up alerts** in Cloudflare for:
- Response time > 500ms (trigger)
- Error rate > 1% (trigger)
- Database response time > 300ms (warning)
- CPU time > 50ms per request (warning)

### 4. Health Check Script

Run periodic health checks:
```bash
#!/bin/bash
# Test availability endpoint
curl -X GET "https://www.instylehairboutique.co.za/api/tenant/ccb12b4d-ade6-467d-a614-7c9d198ddc70/availability?date=$(date -d '+1 day' +%Y-%m-%d)&serviceId=svc_instyle_install" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n"
```

### 5. Error Tracking

**Monitor for**:
- "Service not found" (404 on serviceId lookup)
- "Staff not available" (no schedules for date)
- "Database error" (D1 query failures)
- "Invalid date format" (malformed date parameter)

### 6. Performance Optimization Checklist

- [ ] Cache availability results (30-60 minute TTL for identical queries)
- [ ] Add database indexes on (tenant_id, date_of_week) for staff_schedules
- [ ] Implement rate limiting per tenant/IP
- [ ] Add request deduplication for burst queries
- [ ] Monitor D1 query plans for N+1 issues

---

## Data Migration Status

**Source System**: SuperSaaS (Legacy)
**Target System**: Cloudflare D1 (Current)

### Migration Scope

- Instyle Hair Boutique tenant data
- All services (installations, styling, makeup, etc.)
- Staff schedules and availability patterns
- Historical appointments (last 90 days)
- Product inventory and pricing
- Customer contact data (with GDPR compliance)

### Next Steps

See `DATA_MIGRATION_PLAN.md` for detailed migration workflow.

---

## Incidents & Troubleshooting

### Issue: "Service not found" errors
**Cause**: Service ID mismatch or data not migrated yet
**Action**: Verify services exist in D1, check service ID format

### Issue: High response times
**Cause**: Large appointment dataset or inefficient query
**Action**: Check D1 slow query logs, add indexes, optimize availability algorithm

### Issue: Database connection errors
**Cause**: D1 binding not properly configured or downtime
**Action**: Verify wrangler.toml D1 binding, check Cloudflare status page

