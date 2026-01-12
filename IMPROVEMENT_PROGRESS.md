# Smoke Test Improvement Progress

## Session Summary
Successfully improved test pass rate from **18.75% (6/32)** to **31.25% (10/32)** - a **+50% improvement**!

## Tests Fixed
✅ **GET /api/services** - Now returns correct format: `{ data: { services: [...] } }`
✅ **GET /api/staff** - Now returns correct format: `{ data: { staff: [...] } }`  
✅ **GET /api/bookings** - Now returns correct format: `{ success: true, data: { items: [...] } }`

## Current Issue: POST /api/bookings
**Status:** Still failing with foreign key constraint

**Root Cause Identified:**
- The appointments table requires valid references to users and services tables
- When creating a booking, we need to ensure:
  1. User exists in users table (FK constraint on user_id)
  2. Service exists in services table (FK constraint on service_id)
  3. The referencing tenant has these entities

**Error Message:**
```
D1_ERROR: FOREIGN KEY constraint failed: SQLITE_CONSTRAINT
```

**Current Implementation:**
- Attempting to auto-create users with booking data
- Attempting to create placeholder services if none provided
- Both approaches currently failing

## Database Schema Constraints
From `scripts/migrations/001-create-d1-schema.sql`:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  ...
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  ...
  FOREIGN KEY (tenant_id) REFERENCES services(id)
);

CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,        -- FK to users(id)
  service_id TEXT NOT NULL,     -- FK to services(id)
  ...
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);
```

## Recommended Solutions

### Option 1: Seed Database with Test Data
Create a migration that adds sample users and services for testing:
```sql
INSERT INTO users (id, tenant_id, name, email) VALUES 
  ('test_user_1', '<default_tenant_id>', 'Test User', 'test@test.com');

INSERT INTO services (id, tenant_id, name, duration_minutes) VALUES 
  ('test_service_1', '<default_tenant_id>', 'Test Service', 60);
```

**Pros:** Matches real-world scenario, all tests work as designed  
**Cons:** Need to identify correct default tenant ID

### Option 2: Modify Smoke Test
Update `scripts/smoke-test.js` to:
1. First create test user and service
2. Then use those IDs in booking creation test
3. Or mock the backend responses for booking tests

**Pros:** Tests become self-contained  
**Cons:** Defeats purpose of testing actual endpoint behavior

### Option 3: Modify Worker Response
For POST /api/bookings, return success without actually inserting into DB (mock response):
```typescript
return new Response(JSON.stringify({
  success: true,
  data: {
    appointment: {
      id: appointmentId,
      status: 'pending',
      created_at: Math.floor(Date.now() / 1000)
    }
  }
}), { status: 201, headers: corsHeaders });
```

**Pros:** Test passes immediately  
**Cons:** Not testing actual database integration

### Option 4: Make Foreign Keys Optional
Modify the appointments table schema to allow NULL for user_id and service_id (for public bookings):
```sql
ALTER TABLE appointments MODIFY COLUMN user_id TEXT,
ALTER TABLE appointments MODIFY COLUMN service_id TEXT;
```

**Pros:** Allows true public bookings without user accounts  
**Cons:** Requires database migration, might break other code assumptions

## Next Steps

**To reach 50%+ pass rate:** Implement Option 1 (seed test data)

1. Run one of the existing migrations that populates test data
2. OR create new migration: `030-add-test-data-for-smoke-tests.sql`
3. Execute migration locally/in D1
4. Re-run smoke tests

**Code Location to Check:**
- [scripts/migrations](scripts/migrations/) - Check for existing test data
- [packages/worker/src/index.ts](packages/worker/src/index.ts#L273) - Booking POST handler

## Test Results Timeline

| Iteration | Pass Rate | Notes |
|-----------|-----------|-------|
| Initial   | 18.75% (6/32) | Infrastructure working, endpoints had wrong response format |
| After format fix | 28.13% (9/32) | Services + Staff endpoints now passing |
| After GET /api/bookings fix | 31.25% (10/32) | Booking listing working, POST still blocked by FK constraints |

## Files Modified This Session

- `packages/worker/src/index.ts` - Updated response formats and booking handlers
- All changes focus on `/api/services`, `/api/staff`, `/api/bookings` handlers

## Commands to Continue

```bash
# To seed test data:
npx wrangler d1 execute appointmentbooking-db --local --file=scripts/migrations/030-add-test-data-for-smoke-tests.sql

# To run smoke tests:
cd c:\Users\Adrin\Documents\MyProjects\appointmentbooking-monorepo
node scripts/smoke-test.js

# To deploy Worker after changes:
cd packages/worker
pnpm run build && npx wrangler deploy
```

## Current Worker Version
**Version ID:** `6c1d03eb-a0a9-4c9a-a013-8a773983290d`
**Deployed:** 2026-01-11 22:00 UTC
**Status:** Live and responding to health checks ✅

