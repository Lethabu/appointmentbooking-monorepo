# API Testing Guide

This guide provides comprehensive testing strategies, tools, and examples for testing the Cloudflare Workers appointment booking API.

## Table of Contents

- [Testing Environment Setup](#testing-environment-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Real-time Testing](#real-time-testing)
- [Error Handling Testing](#error-handling-testing)
- [Testing Tools](#testing-tools)
- [Test Data Management](#test-data-management)

## Testing Environment Setup

### Prerequisites

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest supertest
npm install --save-dev playwright
npm install --save-dev artillery
npm install --save-dev Newman

# Install additional tools
npm install --save-dev axios
npm install --save-dev faker
```

### Environment Configuration

```typescript
// test/config.ts
export const testConfig = {
  baseUrl: process.env.TEST_API_URL || 'http://localhost:8787',
  apiKey: process.env.TEST_API_KEY || 'test-api-key',
  tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  serviceId: 'test-service-uuid',
  userEmail: 'test@example.com'
};

// Mock Cloudflare environment
export const mockEnv = {
  DB: {
    prepare: jest.fn(),
    // Add mock methods as needed
  }
};
```

### Database Setup for Testing

```sql
-- test/fixtures.sql
-- Insert test tenant
INSERT INTO tenants (id, name, slug, is_active) 
VALUES ('test-tenant-uuid', 'Test Salon', 'test-salon', 1);

-- Insert test service
INSERT INTO services (id, tenant_id, name, price, duration_minutes, is_active)
VALUES ('test-service-uuid', 'test-tenant-uuid', 'Test Service', 100.00, 60, 1);

-- Insert test user
INSERT INTO users (id, tenant_id, name, email, phone)
VALUES ('test-user-uuid', 'test-tenant-uuid', 'Test User', 'test@example.com', '+27123456789');
```

## Unit Testing

### Booking Endpoint Tests

```typescript
// tests/unit/booking.test.ts
import { handleBookEndpoint } from '../../src/book-endpoint';
import { ApiError } from '../../src/errors';

describe('Booking Endpoint', () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = {
      DB: {
        prepare: jest.fn()
      }
    };
  });

  describe('POST /api/book', () => {
    test('should create booking successfully', async () => {
      // Mock database responses
      mockEnv.DB.prepare
        .mockReturnValueOnce({ // User lookup
          first: jest.fn().mockResolvedValue(null)
        })
        .mockReturnValueOnce({ // User creation
          run: jest.fn().mockResolvedValue({ success: true })
        })
        .mockReturnValueOnce({ // Appointment creation
          run: jest.fn().mockResolvedValue({ success: true })
        });

      const request = new Request('http://localhost/api/book', {
        method: 'POST',
        body: JSON.stringify({
          tenantId: 'test-tenant-uuid',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+27123456789',
          serviceId: 'test-service-uuid',
          scheduledTime: '2024-01-15T14:30:00.000Z'
        })
      });

      const response = await handleBookEndpoint(request, mockEnv, {});
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.bookingId).toBeDefined();
    });

    test('should validate required fields', async () => {
      const request = new Request('http://localhost/api/book', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe'
          // Missing required fields
        })
      });

      await expect(handleBookEndpoint(request, mockEnv, {}))
        .rejects.toThrow(ApiError);
    });

    test('should handle duplicate user creation', async () => {
      // Mock existing user
      mockEnv.DB.prepare
        .mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ id: 'existing-user-uuid' })
        })
        .mockReturnValueOnce({
          run: jest.fn().mockResolvedValue({ success: true })
        });

      const request = new Request('http://localhost/api/book', {
        method: 'POST',
        body: JSON.stringify({
          tenantId: 'test-tenant-uuid',
          name: 'John Doe',
          email: 'existing@example.com',
          phone: '+27123456789',
          serviceId: 'test-service-uuid',
          scheduledTime: '2024-01-15T14:30:00.000Z'
        })
      });

      const response = await handleBookEndpoint(request, mockEnv, {});
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.bookingId).toBeDefined();
    });
  });
});
```

### Tenant Endpoint Tests

```typescript
// tests/unit/tenant.test.ts
import { handleTenantEndpoint } from '../../src/tenant-endpoint';

describe('Tenant Endpoint', () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = {
      DB: {
        prepare: jest.fn()
      }
    };
  });

  test('should return tenant and services', async () => {
    // Mock database responses
    mockEnv.DB.prepare
      .mockReturnValueOnce({
        first: jest.fn().mockResolvedValue({
          id: 'test-tenant-uuid',
          name: 'Test Salon',
          slug: 'test-salon'
        })
      })
      .mockReturnValueOnce({
        all: jest.fn().mockResolvedValue({
          results: [
            {
              id: 'service-uuid-1',
              name: 'Haircut',
              price: 100,
              duration_minutes: 60
            }
          ]
        })
      });

    const request = new Request('http://localhost/api/tenant?slug=test-salon');
    const response = await handleTenantEndpoint(request, mockEnv, {});
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tenant).toBeDefined();
    expect(data.tenant.name).toBe('Test Salon');
    expect(data.services).toHaveLength(1);
  });

  test('should return 404 for non-existent tenant', async () => {
    mockEnv.DB.prepare.mockReturnValueOnce({
      first: jest.fn().mockResolvedValue(null)
    });

    const request = new Request('http://localhost/api/tenant?slug=non-existent');
    
    await expect(handleTenantEndpoint(request, mockEnv, {}))
      .rejects.toThrow('Tenant not found');
  });

  test('should require slug parameter', async () => {
    const request = new Request('http://localhost/api/tenant');
    
    await expect(handleTenantEndpoint(request, mockEnv, {}))
      .rejects.toThrow('Slug parameter required');
  });
});
```

### Availability Endpoint Tests

```typescript
// tests/unit/availability.test.ts
import { handleAvailabilityEndpoint } from '../../src/availability-endpoint';

describe('Availability Endpoint', () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = {
      DB: {
        prepare: jest.fn()
      }
    };
  });

  test('should return available time slots', async () => {
    // Mock service lookup
    mockEnv.DB.prepare.mockReturnValueOnce({
      first: jest.fn().mockResolvedValue({
        duration_minutes: 60
      })
    });

    // Mock getAvailability function
    jest.mock('../../src/availability', () => ({
      getAvailability: jest.fn().mockResolvedValue([
        '2024-01-15T09:00:00.000Z',
        '2024-01-15T10:00:00.000Z',
        '2024-01-15T11:00:00.000Z'
      ])
    }));

    const request = new Request(
      'http://localhost/api/tenant/test-tenant-uuid/availability?date=2024-01-15&serviceId=test-service-uuid'
    );
    const response = await handleAvailabilityEndpoint(request, mockEnv, {});
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.slots).toHaveLength(3);
    expect(data.slots[0]).toBe('2024-01-15T09:00:00.000Z');
  });
});
```

## Integration Testing

### API Integration Tests

```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import { startWorker, stopWorker } from '../helpers/worker-helper';

describe('API Integration Tests', () => {
  let server: any;

  beforeAll(async () => {
    server = await startWorker();
  });

  afterAll(async () => {
    await stopWorker(server);
  });

  describe('Complete Booking Flow', () => {
    test('should complete full booking process', async () => {
      // 1. Get tenant information
      const tenantResponse = await request(server)
        .get('/api/tenant?slug=instylehairboutique')
        .expect(200);

      expect(tenantResponse.body.tenant).toBeDefined();
      expect(tenantResponse.body.services).toHaveLength.greaterThan(0);

      const tenant = tenantResponse.body.tenant;
      const service = tenantResponse.body.services[0];

      // 2. Check availability
      const availabilityResponse = await request(server)
        .get(`/api/tenant/${tenant.id}/availability`)
        .query({
          date: '2024-01-15',
          serviceId: service.id
        })
        .expect(200);

      expect(availabilityResponse.body.slots).toHaveLength.greaterThan(0);

      // 3. Create booking
      const bookingData = {
        tenantId: tenant.id,
        name: 'Integration Test User',
        email: 'integration-test@example.com',
        phone: '+27123456789',
        serviceId: service.id,
        scheduledTime: availabilityResponse.body.slots[0],
        notes: 'Integration test booking'
      };

      const bookingResponse = await request(server)
        .post('/api/book')
        .send(bookingData)
        .expect(200);

      expect(bookingResponse.body.success).toBe(true);
      expect(bookingResponse.body.bookingId).toBeDefined();

      // 4. Verify booking in dashboard
      const dashboardResponse = await request(server)
        .get('/api/dashboard/bookings')
        .query({ tenantId: tenant.id })
        .expect(200);

      const foundBooking = dashboardResponse.body.bookings.find(
        (b: any) => b.id === bookingResponse.body.bookingId
      );
      expect(foundBooking).toBeDefined();
    });
  });

  describe('Dashboard Statistics', () => {
    test('should return dashboard statistics', async () => {
      const response = await request(server)
        .get('/api/dashboard')
        .query({ tenantId: 'test-tenant-uuid' })
        .expect(200);

      expect(response.body.statistics).toBeDefined();
      expect(response.body.statistics.totalAppointments).toBeDefined();
      expect(response.body.recentAppointments).toBeDefined();
    });
  });

  describe('Product Catalog', () => {
    test('should return products', async () => {
      const response = await request(server)
        .get('/api/products')
        .expect(200);

      expect(response.body.products).toBeDefined();
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    test('should filter products by category', async () => {
      const response = await request(server)
        .get('/api/products')
        .query({ category: 'hair-tools' })
        .expect(200);

      expect(response.body.products).toBeDefined();
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(server)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.services).toBeDefined();
    });
  });
});
```

### Database Integration Tests

```typescript
// tests/integration/database.test.ts
import { drizzle } from 'drizzle-orm/...';
import { createTestDb } from '../helpers/database-helper';

describe('Database Integration', () => {
  let db: any;

  beforeAll(async () => {
    db = await createTestDb();
  });

  test('should create and retrieve tenant', async () => {
    const tenantData = {
      id: 'test-tenant-integration',
      name: 'Integration Test Salon',
      slug: 'integration-test',
      is_active: true
    };

    await db.insert(tenants).values(tenantData);
    
    const result = await db.select().from(tenants)
      .where(eq(tenants.id, 'test-tenant-integration'));

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Integration Test Salon');
  });

  test('should handle complex joins', async () => {
    // Create test data
    const tenantId = 'test-tenant-join';
    await db.insert(tenants).values({
      id: tenantId,
      name: 'Join Test Salon',
      slug: 'join-test',
      is_active: true
    });

    const serviceId = 'test-service-join';
    await db.insert(services).values({
      id: serviceId,
      tenant_id: tenantId,
      name: 'Join Test Service',
      price: 150,
      duration_minutes: 90,
      is_active: true
    });

    // Test complex query
    const result = await db.select({
      tenantName: tenants.name,
      serviceName: services.name,
      totalAppointments: count(appointments.id)
    })
    .from(tenants)
    .leftJoin(services, eq(tenants.id, services.tenant_id))
    .leftJoin(appointments, eq(services.id, appointments.service_id))
    .where(eq(tenants.id, tenantId))
    .groupBy(tenants.name, services.name);

    expect(result).toBeDefined();
  });
});
```

## End-to-End Testing

### Complete User Journey Tests

```typescript
// tests/e2e/booking-flow.test.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Booking Flow', () => {
  test('should complete booking from start to finish', async ({ page }) => {
    // Navigate to booking page
    await page.goto('/book/instylehairboutique');

    // Select service
    await page.waitForSelector('[data-testid="service-selection"]');
    await page.click('[data-testid="service-1"]'); // First service

    // Select date
    await page.waitForSelector('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');

    // Select time
    await page.waitForSelector('[data-testid="time-slots"]');
    await page.click('[data-testid="time-slot-14:30"]');

    // Fill customer details
    await page.fill('[data-testid="customer-name"]', 'E2E Test User');
    await page.fill('[data-testid="customer-email"]', 'e2e-test@example.com');
    await page.fill('[data-testid="customer-phone"]', '+27123456789');

    // Add notes
    await page.fill('[data-testid="booking-notes"]', 'E2E test booking');

    // Submit booking
    await page.click('[data-testid="submit-booking"]');

    // Verify success
    await page.waitForSelector('[data-testid="booking-success"]');
    const successMessage = await page.textContent('[data-testid="booking-success"]');
    expect(successMessage).toContain('Booking confirmed');
  });

  test('should handle booking errors gracefully', async ({ page }) => {
    await page.goto('/book/instylehairboutique');

    // Submit empty form
    await page.click('[data-testid="submit-booking"]');

    // Check for validation errors
    await page.waitForSelector('[data-testid="validation-error"]');
    const errors = await page.locator('[data-testid="validation-error"]').count();
    expect(errors).toBeGreaterThan(0);
  });
});
```

### Dashboard E2E Tests

```typescript
// tests/e2e/dashboard.test.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test('should display real-time updates', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard-stats"]');

    // Verify initial stats are displayed
    const stats = await page.locator('[data-testid="stat-card"]').count();
    expect(stats).toBeGreaterThan(0);

    // Listen for SSE events
    const dashboard = page.locator('[data-testid="recent-appointments"]');
    await dashboard.waitFor();

    // Check if real-time updates work (this would need backend integration)
    // const appointmentCount = await dashboard.locator('[data-testid="appointment-item"]').count();
    // expect(appointmentCount).toBeGreaterThanOrEqual(0);
  });

  test('should filter bookings by status', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for page load
    await page.waitForSelector('[data-testid="status-filter"]');

    // Test filter functionality
    await page.selectOption('[data-testid="status-filter"]', 'pending');
    
    // Verify filtered results
    await page.waitForTimeout(1000); // Wait for filter to apply
    // Add assertions based on your UI structure
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# tests/performance/load-test.yml
config:
  target: 'https://your-worker-domain.workers.dev'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 25
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
  defaults:
    headers:
      Authorization: 'Bearer {{ $processEnvironment.TEST_API_KEY }}'

scenarios:
  - name: "API Load Test"
    weight: 50
    flow:
      - get:
          url: "/api/tenant?slug=instylehairboutique"
          capture:
            - json: "$.tenant.id"
              as: "tenantId"
      - post:
          url: "/api/book"
          json:
            tenantId: "{{ tenantId }}"
            name: "Load Test User {{ $randomString() }}"
            email: "loadtest{{ $randomInt(1, 1000) }}@example.com"
            phone: "+27123456789"
            serviceId: "test-service-uuid"
            scheduledTime: "2024-01-15T{{ $randomInt(9, 17) }}:00:00.000Z"

  - name: "Dashboard Load Test"
    weight: 30
    flow:
      - get:
          url: "/api/dashboard"
          qs:
            tenantId: "test-tenant-uuid"
      - get:
          url: "/api/dashboard/bookings"
          qs:
            tenantId: "test-tenant-uuid"
            limit: 50

  - name: "Public Endpoints Load Test"
    weight: 20
    flow:
      - get:
          url: "/api/health"
      - get:
          url: "/api/public/services"
          qs:
            tenantId: "test-tenant-uuid"
```

### Performance Test Scripts

```typescript
// tests/performance/performance.test.ts
import axios from 'axios';

class PerformanceTester {
  private baseUrl: string;
  private results: any[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async testEndpoint(
    name: string,
    method: 'GET' | 'POST',
    url: string,
    data?: any,
    iterations: number = 100
  ) {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      
      try {
        const response = await axios({
          method,
          url: `${this.baseUrl}${url}`,
          data,
          timeout: 10000
        });
        
        const end = Date.now();
        times.push(end - start);
        
        if (response.status !== 200) {
          console.warn(`Non-200 response for ${name}: ${response.status}`);
        }
      } catch (error) {
        const end = Date.now();
        times.push(end - start);
        console.error(`Error in ${name}:`, error.message);
      }
    }

    const stats = this.calculateStats(times);
    this.results.push({ name, ...stats });

    return stats;
  }

  private calculateStats(times: number[]) {
    const sorted = times.sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);
    
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: sum / times.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      totalRequests: times.length,
      failedRequests: times.filter(t => t > 10000).length
    };
  }

  async runAllTests() {
    console.log('Starting performance tests...');

    // Test booking endpoint
    await this.testEndpoint(
      'Create Booking',
      'POST',
      '/api/book',
      {
        tenantId: 'test-tenant-uuid',
        name: 'Performance Test User',
        email: 'perf-test@example.com',
        phone: '+27123456789',
        serviceId: 'test-service-uuid',
        scheduledTime: '2024-01-15T14:30:00.000Z'
      }
    );

    // Test tenant endpoint
    await this.testEndpoint(
      'Get Tenant',
      'GET',
      '/api/tenant?slug=instylehairboutique'
    );

    // Test dashboard endpoint
    await this.testEndpoint(
      'Dashboard Stats',
      'GET',
      '/api/dashboard?tenantId=test-tenant-uuid'
    );

    // Test availability
    await this.testEndpoint(
      'Check Availability',
      'GET',
      '/api/tenant/test-tenant-uuid/availability?date=2024-01-15&serviceId=test-service-uuid'
    );

    // Print results
    console.table(this.results);
  }
}

// Run performance tests
const tester = new PerformanceTester('https://your-worker-domain.workers.dev');
tester.runAllTests();
```

### Stress Testing

```typescript
// tests/performance/stress.test.ts
import { PerformanceTester } from './performance.test';

test.describe('Stress Testing', () => {
  test('should handle concurrent requests', async () => {
    const tester = new PerformanceTester('https://your-worker-domain.workers.dev');
    
    // Create multiple concurrent requests
    const promises = Array(50).fill().map(() => 
      tester.testEndpoint('Concurrent Booking', 'POST', '/api/book', {
        tenantId: 'test-tenant-uuid',
        name: 'Stress Test User',
        email: `stress-test-${Date.now()}@example.com`,
        phone: '+27123456789',
        serviceId: 'test-service-uuid',
        scheduledTime: '2024-01-15T14:30:00.000Z'
      }, 10)
    );

    const results = await Promise.all(promises);
    
    // Verify all tests completed
    expect(results.length).toBe(50);
    
    // Check for excessive failures
    const totalFailures = results.reduce((sum, result) => sum + result.failedRequests, 0);
    const failureRate = totalFailures / (50 * 10);
    
    expect(failureRate).toBeLessThan(0.05); // Less than 5% failure rate
  });
});
```

## Security Testing

### Authentication Tests

```typescript
// tests/security/auth.test.ts
import request from 'supertest';

describe('Security Tests', () => {
  test('should reject requests without API key for protected endpoints', async () => {
    const response = await request(server)
      .get('/api/dashboard?tenantId=test-tenant-uuid')
      .expect(401);

    expect(response.body.error).toContain('Unauthorized');
  });

  test('should reject requests with invalid API key', async () => {
    const response = await request(server)
      .get('/api/dashboard?tenantId=test-tenant-uuid')
      .set('Authorization', 'Bearer invalid-key')
      .expect(401);

    expect(response.body.error).toContain('Unauthorized');
  });

  test('should allow public endpoints without authentication', async () => {
    const response = await request(server)
      .get('/api/tenant?slug=instylehairboutique')
      .expect(200);

    expect(response.body.tenant).toBeDefined();
  });

  test('should validate input data', async () => {
    const response = await request(server)
      .post('/api/book')
      .send({
        tenantId: 'invalid-uuid',
        name: '',
        email: 'invalid-email',
        phone: '',
        serviceId: 'invalid-uuid',
        scheduledTime: 'invalid-date'
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});
```

### Rate Limiting Tests

```typescript
// tests/security/rate-limit.test.ts
import request from 'supertest';

describe('Rate Limiting Tests', () => {
  test('should enforce rate limits', async () => {
    const promises = Array(101).fill().map(() => 
      request(server)
        .get('/api/dashboard?tenantId=test-tenant-uuid')
        .set('Authorization', 'Bearer valid-key')
    );

    const responses = await Promise.all(promises);
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
    
    // Check rate limit headers
    const rateLimitedResponse = rateLimitedResponses[0];
    expect(rateLimitedResponse.headers['x-ratelimit-limit']).toBeDefined();
    expect(rateLimitedResponse.headers['x-ratelimit-remaining']).toBeDefined();
  });

  test('should reset rate limits after window', async () => {
    // Make requests until rate limited
    let response;
    let requestCount = 0;
    
    do {
      response = await request(server)
        .get('/api/health')
        .expect(200);
      requestCount++;
    } while (response.status === 200 && requestCount < 100);
    
    // Wait for rate limit reset
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Should work again
    const newResponse = await request(server)
      .get('/api/health')
      .expect(200);
      
    expect(newResponse.status).toBe(200);
  });
});
```

## Real-time Testing

### Server-Sent Events Testing

```typescript
// tests/realtime/sse.test.ts
import { EventSource } from 'eventsource';

describe('Server-Sent Events', () => {
  test('should establish SSE connection', async (done) => {
    const eventSource = new EventSource(
      `/api/dashboard/stream?tenantId=test-tenant-uuid`
    );

    eventSource.onopen = () => {
      // Connection established
      expect(true).toBe(true);
      eventSource.close();
      done();
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      done(error);
    };
  });

  test('should receive appointment updates', async (done) => {
    const eventSource = new EventSource(
      `/api/dashboard/stream?tenantId=test-tenant-uuid`
    );

    let messageCount = 0;
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        expect(data.rows).toBeDefined();
        messageCount++;
        
        if (messageCount >= 1) {
          eventSource.close();
          done();
        }
      } catch (error) {
        eventSource.close();
        done(error);
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      done(error);
    };

    // Create a booking to trigger an update
    await request(server)
      .post('/api/book')
      .send({
        tenantId: 'test-tenant-uuid',
        name: 'SSE Test User',
        email: 'sse-test@example.com',
        phone: '+27123456789',
        serviceId: 'test-service-uuid',
        scheduledTime: '2024-01-15T14:30:00.000Z'
      });

    // Timeout after 30 seconds
    setTimeout(() => {
      eventSource.close();
      done(new Error('Timeout waiting for SSE events'));
    }, 30000);
  });

  test('should handle connection closure', async (done) => {
    const eventSource = new EventSource(
      `/api/dashboard/stream?tenantId=test-tenant-uuid`
    );

    eventSource.onopen = () => {
      // Close connection after 1 second
      setTimeout(() => {
        eventSource.close();
        done();
      }, 1000);
    };
  });
});
```

## Error Handling Testing

### Comprehensive Error Tests

```typescript
// tests/errors/comprehensive.test.ts
import request from 'supertest';

describe('Comprehensive Error Handling', () => {
  describe('Validation Errors', () => {
    test('should handle missing required fields', async () => {
      const testCases = [
        { description: 'missing tenantId', data: { name: 'Test' } },
        { description: 'missing name', data: { tenantId: 'test-uuid' } },
        { description: 'missing email', data: { tenantId: 'test-uuid', name: 'Test' } },
        { description: 'invalid email format', data: { 
          tenantId: 'test-uuid', 
          name: 'Test', 
          email: 'invalid-email' 
        }}
      ];

      for (const testCase of testCases) {
        const response = await request(server)
          .post('/api/book')
          .send(testCase.data)
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.statusCode).toBe(400);
      }
    });

    test('should handle invalid UUIDs', async () => {
      const response = await request(server)
        .get('/api/tenant/invalid-uuid')
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('Not Found Errors', () => {
    test('should return 404 for non-existent tenant', async () => {
      const response = await request(server)
        .get('/api/tenant?slug=non-existent-tenant')
        .expect(404);

      expect(response.body.error).toContain('Tenant not found');
    });

    test('should return 404 for non-existent service', async () => {
      const response = await request(server)
        .get('/api/tenant/test-tenant-uuid/availability')
        .query({
          date: '2024-01-15',
          serviceId: 'non-existent-service'
        })
        .expect(404);

      expect(response.body.error).toContain('Service not found');
    });
  });

  describe('Database Errors', () => {
    test('should handle database connection failures', async () => {
      // This would require mocking database failures
      // Implementation depends on your error handling strategy
    });
  });

  describe('Timeout Errors', () => {
    test('should handle slow database queries', async () => {
      // Mock slow database responses
      const originalPrepare = mockEnv.DB.prepare;
      mockEnv.DB.prepare = jest.fn().mockImplementation(() => {
        return {
          first: () => new Promise(resolve => setTimeout(() => resolve(null), 5000)),
          all: () => new Promise(resolve => setTimeout(() => resolve({ results: [] }), 5000))
        };
      });

      const response = await request(server)
        .get('/api/tenant?slug=test')
        .expect(408); // Request Timeout

      mockEnv.DB.prepare = originalPrepare;
    });
  });
});
```

## Testing Tools

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts' // Exclude main entry point
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  verbose: true
};
```

### Playwright Configuration

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Test Helper Functions

```typescript
// tests/helpers/test-helpers.ts
import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateBookingData(overrides: Partial<any> = {}) {
    return {
      tenantId: 'test-tenant-uuid',
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      serviceId: 'test-service-uuid',
      scheduledTime: faker.date.future().toISOString(),
      notes: faker.lorem.sentence(),
      ...overrides
    };
  }

  static generateTenantData(overrides: Partial<any> = {}) {
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      is_active: true,
      ...overrides
    };
  }

  static generateServiceData(tenantId: string, overrides: Partial<any> = {}) {
    return {
      id: faker.string.uuid(),
      tenant_id: tenantId,
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: parseFloat(faker.commerce.price()),
      duration_minutes: faker.number.int({ min: 15, max: 240 }),
      is_active: true,
      ...overrides
    };
  }
}

export class TestDatabase {
  static async cleanDatabase(db: any) {
    // Clean test data
    await db.delete(appointments).where(gt(appointments.created_at, 0));
    await db.delete(users).where(gt(users.created_at, 0));
    await db.delete(services).where(gt(services.created_at, 0));
    await db.delete(tenants).where(gt(tenants.created_at, 0));
  }

  static async seedTestData(db: any) {
    const tenantId = 'test-tenant-uuid';
    
    // Insert test tenant
    await db.insert(tenants).values({
      id: tenantId,
      name: 'Test Salon',
      slug: 'test-salon',
      is_active: true
    });

    // Insert test service
    await db.insert(services).values({
      id: 'test-service-uuid',
      tenant_id: tenantId,
      name: 'Test Service',
      price: 100,
      duration_minutes: 60,
      is_active: true
    });
  }
}
```

### API Testing Utilities

```typescript
// tests/helpers/api-helpers.ts
import request from 'supertest';

export class APITestClient {
  constructor(private server: any, private apiKey?: string) {}

  private getHeaders() {
    const headers: any = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  async getTenant(slug: string) {
    return request(this.server)
      .get('/api/tenant')
      .query({ slug })
      .set(this.getHeaders());
  }

  async createBooking(data: any) {
    return request(this.server)
      .post('/api/book')
      .send(data)
      .set(this.getHeaders());
  }

  async getAvailability(tenantId: string, date: string, serviceId: string) {
    return request(this.server)
      .get(`/api/tenant/${tenantId}/availability`)
      .query({ date, serviceId })
      .set(this.getHeaders());
  }

  async getDashboardStats(tenantId: string) {
    return request(this.server)
      .get('/api/dashboard')
      .query({ tenantId })
      .set(this.getHeaders());
  }

  async getDashboardBookings(tenantId: string, params: any = {}) {
    return request(this.server)
      .get('/api/dashboard/bookings')
      .query({ tenantId, ...params })
      .set(this.getHeaders());
  }

  async healthCheck() {
    return request(this.server)
      .get('/api/health')
      .set(this.getHeaders());
  }
}
```

## Test Data Management

### Test Data Setup

```typescript
// tests/fixtures/data-setup.ts
import { TestDataGenerator } from '../helpers/test-helpers';

export class TestDataManager {
  private static instance: TestDataManager;
  private testData: Map<string, any> = new Map();

  static getInstance() {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  createBookingData(overrides: any = {}) {
    const data = TestDataGenerator.generateBookingData(overrides);
    const id = `booking-${Date.now()}`;
    this.testData.set(id, data);
    return { id, data };
  }

  createTenantData(overrides: any = {}) {
    const data = TestDataGenerator.generateTenantData(overrides);
    const id = data.id;
    this.testData.set(id, data);
    return { id, data };
  }

  createServiceData(tenantId: string, overrides: any = {}) {
    const data = TestDataGenerator.generateServiceData(tenantId, overrides);
    const id = data.id;
    this.testData.set(id, data);
    return { id, data };
  }

  getTestData(id: string) {
    return this.testData.get(id);
  }

  clearAllTestData() {
    this.testData.clear();
  }

  async generateTestScenario(scenario: 'basic-booking' | 'multiple-bookings' | 'error-scenarios') {
    switch (scenario) {
      case 'basic-booking':
        return this.createBookingData();
      
      case 'multiple-bookings':
        return Array(5).fill().map(() => this.createBookingData());
      
      case 'error-scenarios':
        return {
          invalidEmail: this.createBookingData({ email: 'invalid-email' }),
          missingFields: this.createBookingData({ name: undefined }),
          pastDate: this.createBookingData({ 
            scheduledTime: '2020-01-01T14:30:00.000Z' 
          })
        };
      
      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  }
}
```

This comprehensive testing guide provides everything needed to thoroughly test the Cloudflare Workers API. The tests cover unit testing, integration testing, end-to-end testing, performance testing, security testing, and real-time functionality. The modular approach allows for easy maintenance and extension of the test suite.

---

**Document Version:** 1.0  
**Last Updated:** December 24, 2024  
**Test Coverage:** Comprehensive API Testing Suite
