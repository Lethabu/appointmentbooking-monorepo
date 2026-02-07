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
