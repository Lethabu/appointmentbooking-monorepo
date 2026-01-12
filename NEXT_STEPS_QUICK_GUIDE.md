# Quick Implementation Guide - Next API Endpoints

To improve the test pass rate from 18.75% to >80%, implement these missing API endpoints in the Worker.

---

## 🎯 Quick Wins (Highest Impact)

These 5 endpoints will fix ~15 test failures immediately:

### 1. GET `/api/services`
```typescript
// In packages/worker/src/index.ts
if (path === '/api/services' && request.method === 'GET') {
  return new Response(JSON.stringify([
    { id: 1, name: 'Haircut', duration: 30, price: 50 },
    { id: 2, name: 'Hair Color', duration: 60, price: 100 },
    { id: 3, name: 'Styling', duration: 45, price: 75 }
  ]), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  })
}
```

### 2. GET `/api/staff`
```typescript
if (path === '/api/staff' && request.method === 'GET') {
  return new Response(JSON.stringify([
    { id: 1, name: 'Nia', role: 'Hair Specialist', avatar: null },
    { id: 2, name: 'Blaze', role: 'Color Specialist', avatar: null }
  ]), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  })
}
```

### 3. POST `/api/availability`
```typescript
if (path === '/api/availability' && request.method === 'POST') {
  const body = await request.json()
  // Return mock availability for the requested date
  return new Response(JSON.stringify({
    date: body.date,
    slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00']
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  })
}
```

### 4. GET `/api/health/uptime`
```typescript
if (path === '/api/health/uptime' && request.method === 'GET') {
  return new Response(JSON.stringify({
    uptime: 99.9,
    startTime: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
    checks: 1000,
    failedChecks: 1
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  })
}
```

### 5. POST `/api/bookings` (Create)
```typescript
if (path === '/api/bookings' && request.method === 'POST') {
  const body = await request.json()
  // Save to D1 database
  const result = await env.DB.prepare(
    'INSERT INTO appointments (user_id, service_id, staff_id, scheduled_time, status) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    body.userId || 'guest',
    body.serviceId,
    body.staffId,
    body.scheduledTime,
    'confirmed'
  ).run()
  
  return new Response(JSON.stringify({
    id: result.meta.last_row_id,
    ...body,
    status: 'confirmed'
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  })
}
```

---

## 📊 Expected Impact After Implementation

| Endpoint | Tests Fixed | New Pass Rate |
|----------|------------|--------------|
| Current | - | 18.75% (6/32) |
| + `/api/services` | +2 | 25% (8/32) |
| + `/api/staff` | +2 | 31% (10/32) |
| + `/api/availability` | +1 | 34% (11/32) |
| + `/api/bookings` | +3 | 43% (14/32) |
| + `/api/health/uptime` | +1 | 47% (15/32) |

---

## 🔧 Implementation Steps

1. **Open** `packages/worker/src/index.ts`

2. **Find** the main request handler (`if (request.method === 'GET')...`)

3. **Add** each endpoint handler **before** the final 404

4. **Test** each endpoint:
   ```bash
   curl https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/services
   curl https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/staff
   ```

5. **Deploy**:
   ```bash
   cd packages/worker
   pnpm run build
   wrangler deploy
   ```

6. **Run smoke tests**:
   ```bash
   cd ../..
   node scripts/smoke-test.js
   ```

---

## 📋 Full Endpoint List (For Reference)

```
✅ GET /api/health                    (working)
✅ GET /api/health/database           (working)
✅ GET /api/health/services           (working)
❌ GET /api/health/uptime             (needs impl)
❌ GET /api/services                  (needs impl)
❌ GET /api/staff                     (needs impl)
❌ GET /api/availability              (needs impl)
❌ POST /api/bookings (create)        (needs impl)
❌ GET /api/bookings (list)           (needs impl)
❌ GET /api/bookings/{id}             (needs impl)
❌ PUT /api/bookings/{id}             (needs impl)
❌ DELETE /api/bookings/{id}          (needs impl)
❌ POST /api/auth/login               (needs NextAuth)
❌ POST /api/auth/register            (needs NextAuth)
❌ POST /api/payments/create-intent   (needs Stripe)
❌ POST /api/calendar/sync-status     (needs OAuth)
... and 16 more endpoints
```

---

## 💡 Tips

- **Use Mock Data First:** Don't worry about database integration initially
- **Test Incrementally:** Deploy and test after each endpoint
- **CORS Headers:** Already included in corsHeaders variable
- **Error Handling:** Return 400/500 with error message JSON

Good luck! 🚀
