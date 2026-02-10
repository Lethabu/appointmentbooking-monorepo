# 🚀 VS Code Copilot App Modernization Playbook
# AppointmentBooking MonoRepo - Best Practice Guide

> **Purpose**: Guide AI assistants (GitHub Copilot, VS Code AI agents) through app modernization tasks with production-grade deployment strategies, retry mechanisms, and platform-wide consistency.

---

## 🎯 Core Modernization Principles

### 1. Architecture-First Approach

- **Monorepo Structure**: PNPM workspace with Turbo for build orchestration
- **Runtime Boundaries**: Next.js apps (booking, dashboard) + Cloudflare Workers (API)
- **Data Layer**: Cloudflare D1 (SQLite) with migration-based schema evolution
- **Deployment Target**: Cloudflare Pages (frontend) + Workers (backend)

### 2. Modernization Patterns to Follow
- **API-First Design**: OpenAPI contracts drive implementation
- **Type Safety**: TypeScript everywhere, Zod for runtime validation
- **Edge Computing**: Leverage Cloudflare's global network
- **Stateless Operations**: No server-side sessions, JWT-based auth
- **Idempotent Migrations**: All DB changes must be replayable

---

## 📋 Pre-Modernization Assessment

Before starting ANY modernization task, assess:

1. **Scope Identification**
   ```bash
   # Identify affected components
   pnpm turbo run build --filter='...[HEAD~1]' --dry-run
   ```

2. **Dependency Impact Analysis**
   ```bash
   # Check what depends on target module
   pnpm why <package-name>
   ```

3. **Breaking Change Detection**
   ```bash
   # Validate OpenAPI contract compatibility
   pnpm run validate:openapi
   ```

---

## 🔄 Deployment Strategy: 3x Retry Pattern

### Overview
Every deployment must implement a **3-attempt retry strategy** with progressive backoff to ensure platform reliability.

### Retry Configuration
```yaml
Attempt 1: Initial deployment (0s wait)
  ↓ Failure → Wait 30 seconds
Attempt 2: First retry (30s backoff)
  ↓ Failure → Wait 60 seconds  
Attempt 3: Final retry (90s total backoff)
  ↓ Failure → Manual intervention required
  ✅ Success → Proceed to validation
```

### Implementation Pattern

#### In GitHub Actions
```yaml
- name: Deploy with Retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 30
    command: |
      npx wrangler pages deploy apps/booking/.open-next/assets \
        --project-name=appointmentbooking-coza \
        --branch=main
```

#### In Scripts (Node.js)
```javascript
async function deployWithRetry(deployFn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🚀 Deployment attempt ${attempt}/${maxAttempts}`);
      const result = await deployFn();
      console.log(`✅ Deployment succeeded on attempt ${attempt}`);
      return result;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(`❌ Deployment failed after ${maxAttempts} attempts`);
        throw error;
      }
      const waitSeconds = attempt * 30; // Progressive backoff
      console.warn(`⚠️  Attempt ${attempt} failed. Retrying in ${waitSeconds}s...`);
      await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
    }
  }
}
```

---

## 🏗️ Platform-Wide Deployment Execution

### Phase 1: Pre-Deployment Validation (Must Pass)
```bash
# Validate ALL specifications and contracts
pnpm run validate:phase1

# Checklist:
# - OpenAPI contract valid and backward-compatible
# - Database schema matches migrations
# - Zod schemas align with TypeScript types
# - All migrations are idempotent
```

### Phase 2: Build & Deploy (3x Retry)
```bash
# Build with dependency graph awareness
pnpm run build

# Deploy Worker (Backend)
npx wrangler deploy --retry 3

# Deploy Pages (Frontend)  
npx wrangler pages deploy apps/booking/.open-next/assets \
  --project-name=appointmentbooking-coza \
  --branch=main
```

### Phase 3: Health Validation (3x Retry on Health Checks)
```bash
# Health endpoint validation with retry
pnpm run validate:health

# API endpoint availability
pnpm run validate:endpoints

# Expected results:
# - Health endpoint responds 200 within 3 attempts
# - All critical API routes return expected contracts
# - No 5xx errors in first 60 seconds
```

### Phase 4: E2E & Performance Validation
```bash
# Contract testing
pnpm run validate:e2e

# Zod runtime validation
pnpm run validate:zod-runtime

# Performance baseline
pnpm run validate:performance

# Success criteria:
# - All E2E tests pass
# - P95 latency < 500ms
# - No Zod validation failures
```

### Phase 5: Continuous Monitoring (15 min)
```bash
# Collect metrics in 3 rounds (5 min each)
pnpm run monitor:collect

# Generate deployment report
pnpm run monitor:report

# Expected: Deployment score ≥ 80/100
```

---

## 🛠️ Modernization Task Patterns

### Pattern 1: API Endpoint Modernization

#### Before: Legacy Express-style Route
```javascript
app.get('/api/bookings/:id', async (req, res) => {
  const booking = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
  res.json(booking);
});
```

#### After: Cloudflare Worker Pattern
```typescript
// packages/worker/src/index.ts
if (path.startsWith('/api/tenant/') && path.match(/\/bookings\/(\d+)$/)) {
  const bookingId = path.split('/').pop();
  
  // Type-safe query with Zod validation
  const result = await env.DB.prepare(
    'SELECT * FROM bookings WHERE id = ? AND tenant_id = ?'
  ).bind(bookingId, tenantId).first();
  
  // Runtime validation
  const booking = BookingSchema.parse(result);
  
  return new Response(JSON.stringify(booking), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
```

**Modernization Checklist:**
- [ ] Replace Express patterns with Worker request handlers
- [ ] Add Zod schema for runtime validation
- [ ] Update OpenAPI specification
- [ ] Add tenant isolation in queries
- [ ] Implement CORS headers
- [ ] Add error handling with proper status codes
- [ ] Create E2E test case

---

### Pattern 2: Database Migration Modernization

#### Migration Best Practices
```sql
-- scripts/migrations/005-modernize-bookings-table.sql
-- ✅ GOOD: Idempotent, backward-compatible

-- Add new column with default value (safe)
ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'pending';

-- Create index if not exists (idempotent)
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Backfill data in batches (safe for production)
UPDATE bookings SET status = 'confirmed' 
WHERE confirmation_sent = 1 AND status IS NULL;
```

#### ❌ AVOID: Breaking Changes
```sql
-- DON'T: Drop columns (breaks old code)
ALTER TABLE bookings DROP COLUMN old_field;

-- DON'T: Rename without migration strategy
ALTER TABLE bookings RENAME COLUMN name TO full_name;

-- DON'T: Add NOT NULL without default
ALTER TABLE bookings ADD COLUMN required_field TEXT NOT NULL;
```

**Migration Deployment:**
```bash
# Local testing
npx wrangler d1 execute appointmentbooking-db --local \
  --file=scripts/migrations/005-modernize-bookings-table.sql

# Production deployment (with 3x retry)
for i in {1..3}; do
  npx wrangler d1 execute appointmentbooking-db \
    --file=scripts/migrations/005-modernize-bookings-table.sql && break
  echo "Migration attempt $i failed, retrying..."
  sleep 30
done
```

---

### Pattern 3: Frontend Component Modernization

#### Before: Client-side only
```tsx
// apps/booking/app/shop/page.tsx
export default function ShopPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);
  
  return <div>{products.map(p => <ProductCard {...p} />)}</div>;
}
```

#### After: Edge-rendered with validation
```tsx
// apps/booking/app/shop/page.tsx
import { ProductSchema } from '@/lib/schemas';

async function getProducts() {
  const res = await fetch('https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/products', {
    next: { revalidate: 60 } // Edge caching
  });
  
  if (!res.ok) throw new Error('Failed to fetch products');
  
  const data = await res.json();
  return ProductSchema.array().parse(data); // Runtime validation
}

export default async function ShopPage() {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
```

**Modernization Benefits:**
- Server-side rendering at edge
- Built-in caching with revalidation
- Type-safe data fetching
- Runtime validation with Zod
- Better SEO and performance

---

## 🔒 Security Modernization Patterns

### 1. JWT Authentication
```typescript
// packages/worker/src/auth.ts
import { verify } from '@tsndr/cloudflare-worker-jwt';

async function validateAuth(request: Request, env: Env): Promise<TokenPayload> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }
  
  const token = authHeader.slice(7);
  const isValid = await verify(token, env.JWT_SECRET);
  
  if (!isValid) {
    throw new UnauthorizedError('Invalid token');
  }
  
  const payload = decode(token);
  return TokenPayloadSchema.parse(payload); // Validate structure
}
```

### 2. Input Sanitization
```typescript
// Always validate and sanitize user input
import { z } from 'zod';

const BookingRequestSchema = z.object({
  service_id: z.number().int().positive(),
  date: z.string().datetime(),
  notes: z.string().max(500).optional(),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9+\-\s()]+$/)
});

// In API handler
const data = BookingRequestSchema.parse(await request.json());
```

### 3. Rate Limiting
```typescript
// Implement in Worker
async function checkRateLimit(clientId: string, env: Env): Promise<void> {
  const key = `rate_limit:${clientId}`;
  const current = await env.RATE_LIMITER.get(key);
  
  if (current && parseInt(current) > 100) {
    throw new TooManyRequestsError('Rate limit exceeded');
  }
  
  await env.RATE_LIMITER.put(key, String((parseInt(current || '0')) + 1), {
    expirationTtl: 60 // 100 requests per minute
  });
}
```

---

## 📊 Monitoring & Observability

### Real-time Metrics Collection
```javascript
// scripts/collect-deployment-metrics.js - Run 3 times
const metricsRounds = [
  { round: 1, delay: 60 },   // 1 min after deploy
  { round: 2, delay: 300 },  // 5 min after deploy  
  { round: 3, delay: 900 }   // 15 min after deploy
];

for (const { round, delay } of metricsRounds) {
  await sleep(delay * 1000);
  const metrics = await collectMetrics();
  
  console.log(`📊 Metrics Round ${round}/3:`);
  console.log(`  - Health: ${metrics.health}`);
  console.log(`  - Latency P95: ${metrics.p95}ms`);
  console.log(`  - Error Rate: ${metrics.errorRate}%`);
  console.log(`  - Throughput: ${metrics.rps} req/s`);
}
```

### Success Criteria
```javascript
const deploymentScore = calculateScore({
  healthCheckPassed: true,      // +25 points
  allEndpointsAvailable: true,  // +20 points
  e2eTestsPassed: true,         // +20 points
  p95LatencyUnder500ms: true,   // +15 points
  errorRateBelow1Percent: true, // +10 points
  noZodValidationErrors: true   // +10 points
});

// Minimum passing score: 80/100
if (deploymentScore < 80) {
  console.error('❌ Deployment quality below threshold');
  process.exit(1);
}
```

---

## 🚨 Rollback Procedures

### Automatic Rollback Conditions
```yaml
# .github/workflows/cloudflare-deploy.yml
- name: Post-Deployment Validation
  run: |
    pnpm run validate:health || ROLLBACK=1
    pnpm run validate:endpoints || ROLLBACK=1
    
    if [ "$ROLLBACK" = "1" ]; then
      echo "🔄 Triggering automatic rollback..."
      npx wrangler pages deployment create \
        --project-name=appointmentbooking-coza \
        --branch=main \
        --commit-hash=${{ github.event.before }}
    fi
```

### Manual Rollback
```bash
# Get previous deployment ID
npx wrangler pages deployment list \
  --project-name=appointmentbooking-coza

# Rollback to specific deployment
npx wrangler pages deployment create \
  --project-name=appointmentbooking-coza \
  --branch=main \
  --commit-hash=<previous-commit-hash>
```

---

## 🎓 AI Assistant Guidelines

### When Modernizing Code:

1. **Always Check Existing Patterns First**
   ```bash
   # Find similar implementations
   grep -r "similar_pattern" packages/worker/src/
   ```

2. **Validate Before Committing**
   ```bash
   pnpm run validate:phase1  # Contracts and schemas
   pnpm run lint             # Code quality
   pnpm run type-check       # Type safety
   ```

3. **Test Locally First**
   ```bash
   # Start local dev environment
   pnpm run dev
   
   # In another terminal, run migrations
   npx wrangler d1 execute appointmentbooking-db --local \
     --file=scripts/migrations/XXX-your-migration.sql
   ```

4. **Document Changes**
   - Update OpenAPI spec for API changes
   - Add JSDoc comments for public functions
   - Update relevant README.md sections

5. **Deploy with Confidence**
   ```bash
   # Full validation pipeline
   pnpm run validate:pre-deploy
   
   # If validation passes, deploy
   pnpm run deploy:retry  # Automatic 3x retry logic
   ```

---

## 📝 Quick Reference Commands

### Modernization Workflow
```bash
# 1. Setup and assessment
pnpm install
pnpm run validate:workflows

# 2. Local development
pnpm run dev

# 3. Pre-commit validation
pnpm run pre-commit

# 4. Pre-deployment validation  
pnpm run validate:pre-deploy

# 5. Deploy with retry
pnpm run deploy:retry

# 6. Monitor deployment
pnpm run monitor:collect

# 7. Generate report
pnpm run monitor:report
```

### Troubleshooting
```bash
# Check build output
pnpm run build:sequential

# Validate specific component
pnpm --filter booking run build

# Test Worker locally
npx wrangler dev packages/worker/src/index.ts

# Check database state
npx wrangler d1 execute appointmentbooking-db --local \
  --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🎯 Success Metrics

Every modernization task must achieve:

- ✅ **Build Success**: All packages compile without errors
- ✅ **Type Safety**: Zero TypeScript errors
- ✅ **Contract Compliance**: OpenAPI specs match implementation
- ✅ **Schema Validation**: Zod schemas validate all runtime data
- ✅ **Test Coverage**: E2E tests pass for changed endpoints
- ✅ **Performance**: P95 latency ≤ 500ms
- ✅ **Reliability**: Deployment succeeds within 3 attempts
- ✅ **Quality Score**: ≥ 80/100 on deployment scorecard

---

## 📚 Additional Resources

- **Architecture Docs**: `/docs/architecture.md`
- **API Documentation**: `/API_DOCUMENTATION.md`
- **Deployment Guides**: `/DEPLOYMENT_GUIDE.md`
- **Retry Strategy**: `/RETRY_GUIDE.md`
- **Security Guidelines**: `/SECURITY.md`

---

## 🔄 Continuous Improvement

After each modernization:

1. **Document Learnings**: Update this playbook with new patterns
2. **Refine Scripts**: Improve automation based on experience  
3. **Update Metrics**: Adjust success criteria as platform evolves
4. **Share Knowledge**: Add examples to help future AI assistants

---

**Last Updated**: 2026-02-07  
**Version**: 1.0.0  
**Maintained By**: AI Engineering Team  
**Review Frequency**: Monthly

- **API-First Design**: OpenAPI contracts drive implementation
- **Type Safety**: TypeScript everywhere, Zod for runtime validation
- **Edge Computing**: Leverage Cloudflare's global network
- **Progressive Enhancement**: Core functionality works without JS
- **Defensive Programming**: Graceful degradation and error boundaries

### 3. Quality Gates

Every modernization task must pass:
- ✅ TypeScript compilation with `strict: true`
- ✅ Zod schema validation for all external inputs
- ✅ OpenAPI contract compliance
- ✅ Unit tests (>80% coverage for new code)
- ✅ Build succeeds in CI pipeline
- ✅ No new security vulnerabilities introduced

---

## 📋 Pre-Modernization Assessment Checklist

Before starting any modernization task, validate:

### Technical Context
- [ ] Understand current runtime environment (Node.js version, Cloudflare Workers compatibility)
- [ ] Identify all affected packages in monorepo (`apps/*`, `packages/*`)
- [ ] Check for existing TypeScript/ESLint errors
- [ ] Review recent git history for context on recent changes

### Dependencies & Constraints
- [ ] List all npm dependencies affected by changes
- [ ] Identify breaking changes in dependency upgrades
- [ ] Check for deprecated APIs or patterns being used
- [ ] Verify Cloudflare Workers size limits (1MB compressed)

### Database Impact
- [ ] Determine if schema migration is needed
- [ ] Plan for data backfill or transformation
- [ ] Ensure migration is idempotent (can run multiple times safely)
- [ ] Test migration rollback procedure

### API Contract Changes
- [ ] Review OpenAPI spec for affected endpoints
- [ ] Check for breaking changes (removed properties, changed types)
- [ ] Plan versioning strategy if breaking changes required
- [ ] Update Zod schemas to match OpenAPI spec

---

## 🔄 3x Retry Deployment Strategy

**Philosophy**: Deployments can fail due to transient issues (network glitches, rate limits, temporary service unavailability). A robust retry strategy with progressive backoff ensures reliability.

### Retry Pattern

```typescript
/**
 * 3x Retry with Progressive Backoff
 * 
 * Attempt 1: Immediate (0s wait)
 * Attempt 2: After 30s backoff
 * Attempt 3: After 90s total backoff (60s additional)
 * 
 * Total max time: ~3 minutes
 */

interface RetryConfig {
  maxAttempts: 3;
  backoffMs: [0, 30000, 90000]; // 0s, 30s, 90s
  retryableErrors: ['ETIMEDOUT', 'ECONNRESET', 'RATE_LIMIT', '5XX'];
}

async function deployWithRetry<T>(
  deployFn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      console.log(`[Attempt ${attempt}/${config.maxAttempts}] Starting deployment...`);
      
      const result = await deployFn();
      
      console.log(`✅ Deployment successful on attempt ${attempt}`);
      return result;
      
    } catch (error) {
      lastError = error;
      const isRetryable = config.retryableErrors.some(e => 
        error.message.includes(e) || error.code === e
      );
      
      if (!isRetryable || attempt === config.maxAttempts) {
        console.error(`❌ Deployment failed (attempt ${attempt}): ${error.message}`);
        if (attempt < config.maxAttempts) {
          console.log(`Non-retryable error, aborting remaining attempts.`);
        }
        throw error;
      }
      
      const backoff = config.backoffMs[attempt - 1];
      console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${backoff/1000}s...`);
      await sleep(backoff);
    }
  }
  
  throw lastError;
}
```

### Application Points

Apply 3x retry to:

1. **Cloudflare Worker Deployment**
   ```bash
   # With retry built into script
   pnpm run deploy:worker --retry=3
   ```

2. **Cloudflare Pages Deployment**
   ```bash
   pnpm run deploy:pages --retry=3
   ```

3. **Health Check Validation**
   ```typescript
   await validateHealthEndpoint('https://api.appointmentbooking.co.za/health', {
     maxAttempts: 3,
     backoffMs: [0, 30000, 90000]
   });
   ```

4. **Database Migrations** (optional, use with caution)
   ```bash
   # Only retry on network/connection errors, not schema errors
   pnpm run migrate:apply --retry=3 --retry-on=network-error
   ```

### Monitoring & Logging

Each retry attempt should log:
- Attempt number (1/3, 2/3, 3/3)
- Error type and message
- Backoff duration
- Timestamp
- Deployment context (commit SHA, branch, environment)

Example log output:
```
[2026-02-07 14:23:10] [Attempt 1/3] Deploying worker to production...
[2026-02-07 14:23:15] ❌ Attempt 1 failed: ETIMEDOUT connecting to Cloudflare API
[2026-02-07 14:23:15] ⏳ Retrying in 30s (backoff strategy)...
[2026-02-07 14:23:45] [Attempt 2/3] Deploying worker to production...
[2026-02-07 14:24:02] ✅ Deployment successful on attempt 2
```

---

## 🚀 Platform-Wide Deployment Process

**Goal**: Deploy all components (Worker, Pages, Database) with validation at each phase.

### Phase 1: Pre-Deployment Validation

**Duration**: 2-5 minutes  
**Can Skip**: No (always required)

```bash
# Run pre-deployment checks
pnpm run validate:pre-deploy
```

**Checks**:
1. ✅ OpenAPI contract validation (no breaking changes)
2. ✅ Database schema validation (migrations are valid SQL)
3. ✅ Zod schemas align with OpenAPI spec
4. ✅ TypeScript compilation (all packages)
5. ✅ Unit tests pass (all packages)
6. ✅ No uncommitted changes in working directory
7. ✅ Migration idempotency check (safe to re-run)

**Failure Handling**: Stop deployment, fix issues, re-run validation.

### Phase 2: Build & Deploy (with 3x Retry)

**Duration**: 5-10 minutes  
**Can Skip**: No

#### Step 2.1: Build Monorepo

```bash
# Turbo handles caching and parallel builds
pnpm run build
```

**Outputs**:
- `apps/booking/.next/` → Next.js production build
- `apps/dashboard/.next/` → Next.js production build
- `packages/worker/dist/` → Cloudflare Worker bundle
- `packages/shared/dist/` → Shared utilities (if published)

#### Step 2.2: Deploy Worker (3x Retry)

```bash
# Deploy with automatic retry
pnpm run deploy:worker --retry=3

# Manual retry if script doesn't support --retry flag
for i in {1..3}; do
  pnpm run deploy:worker && break || {
    echo "Attempt $i failed, retrying in 30s..."
    sleep 30
  }
done
```

**Validates**:
- Worker bundle size < 1MB (compressed)
- Env variables configured correctly
- Wrangler authenticated

#### Step 2.3: Deploy Pages (3x Retry)

```bash
# Deploy booking app
pnpm run deploy:booking --retry=3

# Deploy dashboard app
pnpm run deploy:dashboard --retry=3
```

**Validates**:
- Static assets uploaded
- Build output directory exists
- Cloudflare Pages project configured

### Phase 3: Health Validation (with 3x Retry on Checks)

**Duration**: 1-3 minutes  
**Can Skip**: No

```bash
# Run health checks with retry
pnpm run validate:health --retry=3
```

**Checks** (each with 3x retry):

1. **Worker Health Endpoint**
   ```bash
   curl -f https://api.appointmentbooking.co.za/health
   # Expected: 200 OK, {"status": "healthy", "timestamp": 1738936800}
   ```

2. **Database Connectivity**
   ```bash
   curl -f https://api.appointmentbooking.co.za/api/health/db
   # Expected: 200 OK, {"db": "connected", "migrations": "up-to-date"}
   ```

3. **API Availability**
   ```bash
   # Test a simple GET endpoint
   curl -f https://api.appointmentbooking.co.za/api/products
   # Expected: 200 OK, JSON array
   ```

4. **Pages Availability**
   ```bash
   curl -f https://appointmentbooking.co.za
   curl -f https://dashboard.appointmentbooking.co.za
   # Expected: 200 OK, HTML content
   ```

5. **Security Headers**
   ```bash
   curl -I https://api.appointmentbooking.co.za | grep -i "x-content-type-options\|x-frame-options\|strict-transport-security"
   # Expected: All security headers present
   ```

**Failure Handling**: 
- First failure → Wait 30s, retry
- Second failure → Wait 60s, retry
- Third failure → Alert on-call, consider rollback

### Phase 4: End-to-End Validation

**Duration**: 3-5 minutes  
**Can Skip**: For minor changes (e.g., docs updates)

```bash
# Run E2E tests against production
pnpm run test:e2e:prod
```

**Critical Paths to Test**:
1. ✅ User registration & login flow
2. ✅ Product browsing and search
3. ✅ Appointment booking flow
4. ✅ Admin dashboard access
5. ✅ Database operations (CRUD)
6. ✅ Zod validation on API inputs
7. ✅ OpenAPI contract compliance

**Test Strategy**:
- Use real (test) Cloudflare environment
- Use test database (separate D1 instance)
- Test with production-like data volumes
- Validate response times (P95 < 500ms for API calls)

**Failure Handling**:
- Any critical path failure → Immediate rollback
- Performance regression (P95 > 500ms) → Alert, investigate
- Non-critical failure (e.g., analytics) → Log, continue

### Phase 5: Post-Deployment Monitoring

**Duration**: 15 minutes active monitoring, then ongoing  
**Can Skip**: No

```bash
# Watch metrics in real-time
pnpm run monitor:deployment
```

**Metrics to Track** (first 15 minutes):
- ⏱️ **Request latency**: P50, P95, P99 from Cloudflare Analytics
- 📊 **Error rate**: 4xx and 5xx errors (target: <1% for 5xx)
- 🔄 **Request volume**: Compare to baseline (±20% acceptable)
- 💾 **Database query time**: Track slow queries (>100ms)
- 🌍 **Geographic distribution**: Ensure edge caching working

**Automated Alerts**:
- 🚨 5xx error rate > 1% for 5 consecutive minutes
- 🚨 P95 latency > 500ms for 5 consecutive minutes
- 🚨 Request volume drops > 50% compared to baseline
- 🚨 Database connection errors

**Success Criteria** (all must pass):
- ✅ Error rate < 1% (5xx errors)
- ✅ P95 latency < 500ms
- ✅ No critical alerts triggered
- ✅ Health checks passing consistently
- ✅ No user-reported issues

**Failure Response**:
- Minor issues → Log, schedule fix
- Major issues → Initiate rollback procedure (see next section)

---

## 🔙 Rollback Procedures

**When to Rollback**:
- Critical functionality broken (e.g., users can't book appointments)
- Security vulnerability introduced
- Data corruption detected
- Error rate > 5% sustained for 5+ minutes
- P95 latency > 1000ms sustained for 5+ minutes

### Rollback Steps

**1. Immediate Triage (1 minute)**
```bash
# Check current deployment status
pnpm run status:deployment

# View recent error logs
pnpm run logs:errors --since=15m
```

**2. Identify Rollback Point**
```bash
# List recent deployments
wrangler deployments list

# Typical output:
# 2026-02-07 14:30:00 - abc123def (current, failing)
# 2026-02-07 12:00:00 - xyz789ghi (previous, stable)
```

**3. Execute Rollback**

```bash
# Rollback Worker to previous deployment
wrangler rollback xyz789ghi

# Rollback Pages (booking app)
npx wrangler pages deployment rollback --project-name=appointmentbooking-booking

# Rollback Pages (dashboard app)
npx wrangler pages deployment rollback --project-name=appointmentbooking-dashboard
```

**4. Verify Rollback**
```bash
# Re-run health checks
pnpm run validate:health --retry=3

# Check error rate dropped
pnpm run monitor:deployment --duration=5m
```

**5. Post-Rollback**
- Update incident log
- Notify team
- Schedule post-mortem
- Document root cause and prevention

### Database Rollback (Special Case)

**⚠️ WARNING**: Database rollbacks are risky. Only rollback if:
- Migration has a revert script
- No production data written since migration
- Rollback tested in staging

```bash
# Revert last migration
pnpm run migrate:revert --steps=1

# Verify database state
pnpm run migrate:status
```

**Alternative**: Forward fix (apply new migration to fix issue) is often safer than rolling back.

---

## 🛠️ Modernization Task Patterns

### Pattern 1: API Modernization (New Endpoint)

**Goal**: Add a new API endpoint following best practices.

**Steps**:

1. **Define OpenAPI Contract** (always start here)
   ```yaml
   # packages/worker/openapi.yaml
   /api/appointments:
     post:
       summary: Create a new appointment
       requestBody:
         required: true
         content:
           application/json:
             schema:
               type: object
               required: [tenantId, serviceId, staffId, startTime]
               properties:
                 tenantId:
                   type: string
                   format: uuid
                 serviceId:
                   type: string
                   format: uuid
                 staffId:
                   type: string
                   format: uuid
                 startTime:
                   type: string
                   format: date-time
       responses:
         201:
           description: Appointment created
           content:
             application/json:
               schema:
                 $ref: '#/components/schemas/Appointment'
         400:
           description: Invalid input
         409:
           description: Time slot unavailable
   ```

2. **Create Zod Schema** (mirrors OpenAPI contract)
   ```typescript
   // packages/worker/src/schemas/appointment.ts
   import { z } from 'zod';
   
   export const CreateAppointmentSchema = z.object({
     tenantId: z.string().uuid(),
     serviceId: z.string().uuid(),
     staffId: z.string().uuid(),
     startTime: z.string().datetime(),
     customerName: z.string().min(1).max(100).optional(),
     customerEmail: z.string().email().optional(),
     customerPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
     notes: z.string().max(500).optional(),
   });
   
   export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
   ```

3. **Implement Route Handler**
   ```typescript
   // packages/worker/src/index.ts (add to existing handlers)
   
   if (path === '/api/appointments' && request.method === 'POST') {
     try {
       // 1. Parse and validate input
       const body = await request.json();
       const input = CreateAppointmentSchema.parse(body);
       
       // 2. Business logic check (time slot availability)
       const conflicts = await env.DB.prepare(
         `SELECT id FROM appointments 
          WHERE staff_id = ? AND start_time = ? AND status != 'cancelled'`
       ).bind(input.staffId, input.startTime).all();
       
       if (conflicts.results.length > 0) {
         return new Response(
           JSON.stringify({ error: 'Time slot unavailable' }), 
           { status: 409, headers: corsHeaders }
         );
       }
       
       // 3. Insert appointment
       const appointmentId = crypto.randomUUID();
       await env.DB.prepare(
         `INSERT INTO appointments (id, tenant_id, service_id, staff_id, start_time, customer_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`
       ).bind(
         appointmentId,
         input.tenantId,
         input.serviceId,
         input.staffId,
         input.startTime,
         input.customerName || null,
         Math.floor(Date.now() / 1000)
       ).run();
       
       // 4. Fetch and return created appointment
       const appointment = await env.DB.prepare(
         `SELECT * FROM appointments WHERE id = ?`
       ).bind(appointmentId).first();
       
       return new Response(
         JSON.stringify(appointment), 
         { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
       
     } catch (error) {
       // Zod validation error
       if (error instanceof z.ZodError) {
         return new Response(
           JSON.stringify({ error: 'Invalid input', details: error.errors }), 
           { status: 400, headers: corsHeaders }
         );
       }
       // Other errors
       console.error('Error creating appointment:', error);
       return new Response(
         JSON.stringify({ error: 'Internal server error' }), 
         { status: 500, headers: corsHeaders }
       );
     }
   }
   ```

4. **Write Unit Tests**
   ```typescript
   // packages/worker/src/__tests__/appointments.test.ts
   import { describe, it, expect, beforeEach } from 'vitest';
   import { CreateAppointmentSchema } from '../schemas/appointment';
   
   describe('CreateAppointmentSchema', () => {
     it('validates valid appointment data', () => {
       const validData = {
         tenantId: '123e4567-e89b-12d3-a456-426614174000',
         serviceId: '123e4567-e89b-12d3-a456-426614174001',
         staffId: '123e4567-e89b-12d3-a456-426614174002',
         startTime: '2026-02-07T14:00:00Z',
       };
       
       expect(() => CreateAppointmentSchema.parse(validData)).not.toThrow();
     });
     
     it('rejects invalid UUID', () => {
       const invalidData = {
         tenantId: 'not-a-uuid',
         serviceId: '123e4567-e89b-12d3-a456-426614174001',
         staffId: '123e4567-e89b-12d3-a456-426614174002',
         startTime: '2026-02-07T14:00:00Z',
       };
       
       expect(() => CreateAppointmentSchema.parse(invalidData)).toThrow();
     });
   });
   ```

5. **Deploy with 3x Retry**
   ```bash
   pnpm run deploy:worker --retry=3
   ```

6. **Validate Deployment**
   ```bash
   # Test endpoint
   curl -X POST https://api.appointmentbooking.co.za/api/appointments \
     -H "Content-Type: application/json" \
     -d '{"tenantId":"123e4567-e89b-12d3-a456-426614174000","serviceId":"123e4567-e89b-12d3-a456-426614174001","staffId":"123e4567-e89b-12d3-a456-426614174002","startTime":"2026-02-07T14:00:00Z"}'
   ```

---

### Pattern 2: Database Migration

**Goal**: Add a new table or modify existing schema safely.

**Steps**:

1. **Create Migration File**
   ```sql
   -- scripts/migrations/005-create-appointments.sql
   -- Purpose: Add appointments table for booking system
   -- Author: AI Assistant
   -- Date: 2026-02-07
   
   CREATE TABLE IF NOT EXISTS appointments (
     id TEXT PRIMARY KEY,
     tenant_id TEXT NOT NULL,
     service_id TEXT NOT NULL,
     staff_id TEXT NOT NULL,
     customer_name TEXT,
     customer_email TEXT,
     customer_phone TEXT,
     start_time INTEGER NOT NULL, -- Unix timestamp
     duration_minutes INTEGER NOT NULL DEFAULT 60,
     status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, confirmed, cancelled, completed
     notes TEXT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER,
     FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
     FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
     FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE RESTRICT
   );
   
   -- Index for common queries
   CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);
   CREATE INDEX IF NOT EXISTS idx_appointments_staff_time ON appointments(staff_id, start_time);
   CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
   ```

2. **Test Migration Locally**
   ```bash
   # Apply migration to local D1
   npx wrangler d1 execute appointmentbooking --local \
     --file=scripts/migrations/005-create-appointments.sql
   
   # Verify table created
   npx wrangler d1 execute appointmentbooking --local \
     --command="SELECT name FROM sqlite_master WHERE type='table' AND name='appointments';"
   ```

3. **Create Rollback Script** (if needed)
   ```sql
   -- scripts/migrations/005-create-appointments.rollback.sql
   DROP TABLE IF EXISTS appointments;
   DROP INDEX IF EXISTS idx_appointments_tenant;
   DROP INDEX IF EXISTS idx_appointments_staff_time;
   DROP INDEX IF EXISTS idx_appointments_status;
   ```

4. **Apply to Production**
   ```bash
   # With retry (manual loop, wrangler doesn't support --retry)
   for i in {1..3}; do
     npx wrangler d1 execute appointmentbooking \
       --file=scripts/migrations/005-create-appointments.sql && break || {
       echo "Migration attempt $i failed, retrying in 30s..."
       sleep 30
     }
   done
   ```

5. **Verify Migration**
   ```bash
   # Check table exists and has correct schema
   npx wrangler d1 execute appointmentbooking \
     --command="PRAGMA table_info(appointments);"
   
   # Check indexes created
   npx wrangler d1 execute appointmentbooking \
     --command="SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='appointments';"
   ```

---

### Pattern 3: Frontend Feature (Next.js)

**Goal**: Add a new page or component with proper TypeScript typing.

**Steps**:

1. **Create Type Definitions** (if fetching from API)
   ```typescript
   // apps/booking/types/appointment.ts
   export interface Appointment {
     id: string;
     tenantId: string;
     serviceId: string;
     staffId: string;
     customerName?: string;
     customerEmail?: string;
     customerPhone?: string;
     startTime: string; // ISO 8601
     durationMinutes: number;
     status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
     notes?: string;
     createdAt: number;
     updatedAt?: number;
   }
   ```

2. **Create Server Component** (for data fetching)
   ```typescript
   // apps/booking/app/appointments/page.tsx
   import { Suspense } from 'react';
   
   async function getAppointments(): Promise<Appointment[]> {
     // Fetch from API (server-side)
     const res = await fetch(
       'https://api.appointmentbooking.co.za/api/appointments',
       { next: { revalidate: 60 } } // Cache for 60 seconds
     );
     
     if (!res.ok) {
       throw new Error('Failed to fetch appointments');
     }
     
     return res.json();
   }
   
   export default async function AppointmentsPage() {
     return (
       <div className="container mx-auto p-6">
         <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
         
         <Suspense fallback={<div>Loading appointments...</div>}>
           <AppointmentsList />
         </Suspense>
       </div>
     );
   }
   
   async function AppointmentsList() {
     const appointments = await getAppointments();
     
     if (appointments.length === 0) {
       return (
         <div className="text-center text-gray-500 py-12">
           <p>No appointments found.</p>
         </div>
       );
     }
     
     return (
       <div className="grid gap-4">
         {appointments.map(apt => (
           <AppointmentCard key={apt.id} appointment={apt} />
         ))}
       </div>
     );
   }
   ```

3. **Create Client Component** (for interactivity)
   ```typescript
   // apps/booking/components/AppointmentCard.tsx
   'use client';
   
   import { useState } from 'react';
   import { Appointment } from '@/types/appointment';
   
   interface Props {
     appointment: Appointment;
   }
   
   export function AppointmentCard({ appointment }: Props) {
     const [status, setStatus] = useState(appointment.status);
     const [loading, setLoading] = useState(false);
     
     const handleCancel = async () => {
       setLoading(true);
       try {
         const res = await fetch(
           `https://api.appointmentbooking.co.za/api/appointments/${appointment.id}`,
           {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status: 'cancelled' }),
           }
         );
         
         if (!res.ok) throw new Error('Failed to cancel');
         
         setStatus('cancelled');
       } catch (error) {
         alert('Failed to cancel appointment');
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <div className="bg-white rounded-lg shadow p-6">
         <div className="flex justify-between items-start">
           <div>
             <h3 className="text-lg font-semibold">
               {new Date(appointment.startTime).toLocaleDateString()}
             </h3>
             <p className="text-gray-600">
               {new Date(appointment.startTime).toLocaleTimeString()} 
               ({appointment.durationMinutes} min)
             </p>
             {appointment.customerName && (
               <p className="mt-2">{appointment.customerName}</p>
             )}
           </div>
           
           <div>
             <span className={`px-3 py-1 rounded-full text-sm ${
               status === 'confirmed' ? 'bg-green-100 text-green-800' :
               status === 'cancelled' ? 'bg-red-100 text-red-800' :
               'bg-blue-100 text-blue-800'
             }`}>
               {status}
             </span>
           </div>
         </div>
         
         {status === 'scheduled' && (
           <button
             onClick={handleCancel}
             disabled={loading}
             className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
           >
             {loading ? 'Cancelling...' : 'Cancel Appointment'}
           </button>
         )}
       </div>
     );
   }
   ```

4. **Deploy with Turbo** (builds all changed packages)
   ```bash
   pnpm run build
   pnpm run deploy:booking --retry=3
   ```

---

### Pattern 4: Worker Performance Optimization

**Goal**: Optimize API response time by leveraging edge caching.

**Before**:
```typescript
// No caching, every request hits database
if (path === '/api/products' && request.method === 'GET') {
  const products = await env.DB.prepare(
    'SELECT * FROM products WHERE tenant_id = ?'
  ).bind(tenantId).all();
  
  return new Response(JSON.stringify(products.results), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
```

**After** (with edge caching):
```typescript
if (path === '/api/products' && request.method === 'GET') {
  // Check cache first
  const cacheKey = `products:${tenantId}`;
  const cache = caches.default;
  const cacheUrl = new URL(request.url);
  cacheUrl.searchParams.set('cache-key', cacheKey);
  
  let response = await cache.match(cacheUrl);
  
  if (!response) {
    // Cache miss, fetch from database
    const products = await env.DB.prepare(
      'SELECT * FROM products WHERE tenant_id = ?'
    ).bind(tenantId).all();
    
    response = new Response(JSON.stringify(products.results), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 min cache
        ...corsHeaders
      }
    });
    
    // Store in cache
    await cache.put(cacheUrl, response.clone());
  }
  
  return response;
}
```

**Performance Impact**:
- Before: ~50-100ms (database query)
- After: ~5-10ms (edge cache hit)
- Cache hit rate: ~95% for product listings

---

## 🔐 Security Best Practices

### Input Validation

**Always validate with Zod before using input**:
```typescript
// ❌ BAD: No validation
const { email } = await request.json();
await sendEmail(email); // Vulnerable to injection

// ✅ GOOD: Zod validation
const EmailSchema = z.object({ email: z.string().email() });
const { email } = EmailSchema.parse(await request.json());
await sendEmail(email);
```

### SQL Injection Prevention

**Always use parameterized queries**:
```typescript
// ❌ BAD: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;
await env.DB.prepare(query).all(); // SQL injection risk

// ✅ GOOD: Parameterized query
await env.DB.prepare('SELECT * FROM users WHERE email = ?')
  .bind(email)
  .all();
```

### Authentication & Authorization

**Check permissions before database operations**:
```typescript
// Example: Tenant isolation
const tenantId = request.headers.get('X-Tenant-ID');

if (!tenantId) {
  return new Response('Unauthorized', { status: 401 });
}

// Always filter by tenant in queries
const products = await env.DB.prepare(
  'SELECT * FROM products WHERE tenant_id = ?'
).bind(tenantId).all();
```

### Security Headers

**Apply to all responses**:
```typescript
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
};

return new Response(body, {
  headers: { ...corsHeaders, ...securityHeaders }
});
```

---

## 📊 Monitoring & Observability

### Metrics to Track

**1. Request Metrics**
- Total requests per minute
- Requests per endpoint
- HTTP status code distribution (2xx, 4xx, 5xx)

**2. Performance Metrics**
- P50, P95, P99 latency
- Time to first byte (TTFB)
- Database query duration

**3. Error Metrics**
- Error rate (% of 5xx responses)
- Error types (timeout, syntax, runtime)
- Error frequency by endpoint

**4. Business Metrics**
- Appointments created per hour
- User registrations per day
- Conversion rate (visits → bookings)

### Logging Best Practices

**Structured logging**:
```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
}

function log(entry: LogEntry) {
  console.log(JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString(),
  }));
}

// Usage
log({
  level: 'info',
  message: 'Appointment created',
  context: {
    appointmentId: 'abc-123',
    tenantId: 'xyz-789',
    durationMs: 45,
  }
});
```

### Alert Configuration

**Critical alerts** (page on-call):
- 5xx error rate > 5% for 5 minutes
- P99 latency > 2000ms for 5 minutes
- Database connection failures

**Warning alerts** (notify Slack):
- 5xx error rate > 1% for 10 minutes
- P95 latency > 500ms for 10 minutes
- Cache hit rate < 80%

---

## 📈 Deployment Scoring & Success Criteria

**Deployment Score Formula** (out of 100):

```
Deployment Score = (
  Phase1_Validation * 20 +
  Phase2_Deploy * 20 +
  Phase3_Health * 20 +
  Phase4_E2E * 20 +
  Phase5_Monitoring * 20
)

Each phase scored 0-5:
5 = All checks passed
4 = Minor issues (non-blocking)
3 = Some issues (investigate)
2 = Major issues (consider rollback)
1 = Critical issues (immediate rollback)
0 = Phase failed completely
```

**Example Successful Deployment**:
```
Phase 1 (Validation): 5/5 ✅
  - OpenAPI valid
  - Migrations valid
  - TypeScript compiled
  - Tests passed
  
Phase 2 (Deploy): 5/5 ✅
  - Build successful (1 attempt)
  - Worker deployed (1 attempt)
  - Pages deployed (1 attempt)
  
Phase 3 (Health): 5/5 ✅
  - Health endpoints OK (1 attempt)
  - Database connected
  - APIs responding
  
Phase 4 (E2E): 4/5 ⚠️
  - Critical paths passed
  - 1 non-critical test flaky (analytics)
  
Phase 5 (Monitoring): 5/5 ✅
  - Error rate: 0.1%
  - P95 latency: 120ms
  - No alerts triggered

Total Score: 96/100 ✅ PASS (threshold: 80)
```

**Rollback Trigger**: Score < 60/100 or any phase scores 1 or 0.

---

## 🎓 Training Examples

### Example 1: Modernize Legacy API Route

**Task**: Convert a legacy API route to use Zod validation and proper error handling.

**Before**:
```typescript
// Legacy: No validation, poor error handling
if (path === '/api/bookings' && request.method === 'POST') {
  const body = await request.json();
  
  const result = await env.DB.prepare(
    'INSERT INTO bookings (tenant_id, service_id, date) VALUES (?, ?, ?)'
  ).bind(body.tenantId, body.serviceId, body.date).run();
  
  return new Response('OK');
}
```

**After** (modernized):
```typescript
// Modern: Zod validation, proper HTTP status codes, error handling
import { z } from 'zod';

const CreateBookingSchema = z.object({
  tenantId: z.string().uuid(),
  serviceId: z.string().uuid(),
  date: z.string().datetime(),
  customerEmail: z.string().email().optional(),
});

if (path === '/api/bookings' && request.method === 'POST') {
  try {
    const body = await request.json();
    const validated = CreateBookingSchema.parse(body);
    
    const bookingId = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO bookings (id, tenant_id, service_id, date, customer_email, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      bookingId,
      validated.tenantId,
      validated.serviceId,
      validated.date,
      validated.customerEmail || null,
      Math.floor(Date.now() / 1000)
    ).run();
    
    // Fetch and return created booking
    const booking = await env.DB.prepare(
      'SELECT * FROM bookings WHERE id = ?'
    ).bind(bookingId).first();
    
    return new Response(JSON.stringify(booking), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: error.errors }), 
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.error('Error creating booking:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: corsHeaders }
    );
  }
}
```

**Improvements**:
- ✅ Input validation with Zod
- ✅ UUID generation for IDs
- ✅ Proper HTTP status codes (201, 400, 500)
- ✅ Error handling and logging
- ✅ Returns created resource
- ✅ CORS headers

---

## 📚 Quick Reference Commands

```bash
# Development
pnpm install                    # Install dependencies
pnpm run build                  # Build all packages
pnpm run dev                    # Start dev servers (all apps)
pnpm run test                   # Run all tests
pnpm run lint                   # Lint all packages

# Database Migrations
npx wrangler d1 execute DB_NAME --local --file=scripts/migrations/XXX.sql
npx wrangler d1 execute DB_NAME --file=scripts/migrations/XXX.sql  # Production

# Deployment (with retry)
pnpm run deploy:worker --retry=3
pnpm run deploy:booking --retry=3
pnpm run deploy:dashboard --retry=3
pnpm run deploy:all --retry=3   # Deploy everything

# Validation
pnpm run validate:pre-deploy    # Pre-deployment checks
pnpm run validate:health --retry=3  # Health checks
pnpm run test:e2e:prod          # E2E tests against production

# Monitoring
pnpm run monitor:deployment     # Watch deployment metrics
pnpm run logs:errors --since=15m  # View recent errors
wrangler deployments list       # List recent deployments

# Rollback
wrangler rollback <deployment-id>
npx wrangler pages deployment rollback --project-name=<project>
```

---

## ✅ Modernization Checklist Template

Copy this checklist for each modernization task:

```markdown
## Modernization Task: [Task Name]

### Pre-Work
- [ ] Read relevant OpenAPI contract sections
- [ ] Check for existing TypeScript definitions
- [ ] Review recent changes in affected files
- [ ] Identify breaking changes

### Implementation
- [ ] Create/update Zod schemas
- [ ] Implement business logic
- [ ] Add error handling
- [ ] Write unit tests (>80% coverage)
- [ ] Update OpenAPI spec if needed

### Testing
- [ ] Unit tests pass locally
- [ ] Integration tests pass locally
- [ ] Manual testing of happy path
- [ ] Manual testing of error cases
- [ ] Performance check (P95 < 500ms)

### Deployment
- [ ] Pre-deployment validation passed
- [ ] Build successful
- [ ] Deployed with 3x retry strategy
- [ ] Health checks passed
- [ ] E2E tests passed
- [ ] Monitoring confirms success (15 min)

### Documentation
- [ ] Update README if needed
- [ ] Add code comments for complex logic
- [ ] Update API documentation
- [ ] Add migration notes if schema changed

### Sign-off
- [ ] Deployment score ≥ 80/100
- [ ] No critical alerts triggered
- [ ] Team notified of changes
- [ ] Rollback plan documented
```

---

**End of Playbook**

*Version: 1.0.0*  
*Last Updated: 2026-02-07*  
*Maintained by: AI Assistants (GitHub Copilot, VS Code AI)*
