# Testing & Quality Assurance Guide

## Overview

This guide provides comprehensive documentation for the testing and quality assurance framework implemented for the appointment booking system. The framework includes unit tests, integration tests, API endpoint tests, security tests, performance tests, and end-to-end testing.

## Testing Framework Architecture

### Test Types

1. **Unit Tests** (`tests/booking-system.test.ts`, `tests/api-endpoints.test.ts`)
   - Test individual components and functions in isolation
   - Fast execution, minimal dependencies
   - Coverage: Core business logic, scheduling engine, validation, email services

2. **Integration Tests** (`tests/integration.test.ts`)
   - Test complete workflows and system integration
   - Test interactions between components
   - Coverage: Full booking flow, calendar sync, multi-tenant isolation

3. **API Endpoint Tests** (`tests/api-endpoints.test.ts`)
   - Test all API routes with comprehensive validation
   - Mock external services and dependencies
   - Coverage: All REST API endpoints, error handling, security

4. **Security Tests** (`tests/security.test.ts`)
   - Comprehensive security validation and penetration testing
   - Test for common vulnerabilities and attack vectors
   - Coverage: Authentication, authorization, input validation, data protection

5. **Performance Tests** (`tests/performance.test.ts`)
   - Load testing and performance benchmarking
   - Stress testing and scalability validation
   - Coverage: Response times, throughput, memory usage, concurrent users

6. **End-to-End Tests** (Playwright)
   - Browser automation testing
   - Complete user workflows
   - Coverage: UI interactions, form validation, responsive design

## Test Execution

### Local Development

```bash
# Install dependencies
pnpm install

# Run all tests
npm run test:all

# Run specific test types
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:api          # API endpoint tests
npm run test:security     # Security tests
npm run test:performance  # Performance tests

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Continuous Integration

The GitHub Actions workflow automatically runs:

1. **Unit Tests** - Fast feedback on code changes
2. **Integration Tests** - Validate system integration
3. **API Tests** - Ensure API endpoints work correctly
4. **Security Tests** - Detect security vulnerabilities
5. **E2E Tests** - Validate complete user workflows
6. **Performance Tests** - Monitor performance regressions
7. **Load Tests** (Scheduled) - Comprehensive performance analysis

### Test Configuration

#### Environment Variables

```bash
# Test Database
DATABASE_URL="postgresql://user:password@localhost:5432/booking_test"
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/booking_test"

# Redis
REDIS_URL="redis://localhost:6379/1"
TEST_REDIS_URL="redis://localhost:6379/1"

# API Configuration
TEST_API_URL="http://localhost:3000"

# External Services
TEST_GOOGLE_CLIENT_ID="test-google-client-id"
TEST_GOOGLE_CLIENT_SECRET="test-google-client-secret"
TEST_OUTLOOK_CLIENT_ID="test-outlook-client-id"
TEST_OUTLOOK_CLIENT_SECRET="test-outlook-client-secret"

# Security
TEST_JWT_SECRET="test-jwt-secret-key"
```

#### Jest Configuration

- Test environment: `jsdom` for React components
- Coverage threshold: 80% overall, 90% for critical components
- Test timeout: 30 seconds
- Parallel execution enabled
- Mock clearing between tests

## Test Data Management

### Test Fixtures

The testing framework includes comprehensive test fixtures:

```typescript
import { testFixtures, TestUtils, AuthTestHelper } from './tests/test-setup.test';

// Generate test booking data
const bookingData = TestUtils.generateBookingData({
    serviceId: 'service_haircut',
    date: '2026-01-20',
    time: '14:00'
});

// Generate authentication tokens
const token = AuthTestHelper.generateToken({
    userId: 'customer_123',
    role: 'customer'
});
```

### Database Test Helper

```typescript
import { DatabaseTestHelper } from './tests/test-setup.test';

beforeEach(async () => {
    await DatabaseTestHelper.setupTestDatabase();
    await DatabaseTestHelper.seedTestData();
});

afterEach(async () => {
    await DatabaseTestHelper.clearTestData();
});
```

## API Testing

### Making API Requests

```typescript
import { ApiTestHelper } from './tests/test-setup.test';

// Create a booking
const bookingResponse = await ApiTestHelper.createBooking({
    serviceId: 'service_haircut',
    date: '2026-01-20',
    time: '14:00'
});

// Get availability
const availabilityResponse = await ApiTestHelper.getAvailability('2026-01-20', 'service_haircut');

// Cancel booking
const cancelResponse = await ApiTestHelper.cancelBooking('apt_123');
```

### Authentication Testing

```typescript
import { AuthTestHelper } from './tests/test-setup.test';

// Customer authentication
const customerHeaders = AuthTestHelper.getAuthHeaders();

// Admin authentication
const adminHeaders = AuthTestHelper.getAdminAuthHeaders();

// Staff authentication
const staffHeaders = AuthTestHelper.getStaffAuthHeaders();
```

## Security Testing

### Vulnerability Categories

1. **Input Validation**
   - SQL injection attacks
   - Cross-site scripting (XSS)
   - Path traversal
   - Command injection
   - Insecure deserialization

2. **Authentication & Authorization**
   - Weak authentication mechanisms
   - Insecure direct object references (IDOR)
   - Session management issues
   - Privilege escalation

3. **Information Disclosure**
   - Sensitive data exposure
   - Error message leakage
   - Debug information disclosure

4. **Business Logic**
   - Race conditions
   - Business rule bypass
   - Workflow manipulation

### Security Test Execution

```bash
# Run security tests
npm run test:security

# Generate security report
npm run test:security -- --reporters=html
```

### Security Testing Examples

```typescript
// Test for SQL injection
const maliciousInput = "'; DROP TABLE appointments; --";
const response = await fetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ serviceId: maliciousInput })
});
expect(response.status).not.toBe(200);

// Test for XSS
const xssPayload = '<script>alert("XSS")</script>';
const response = await fetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ notes: xssPayload })
});
const data = await response.json();
expect(data.data.appointment.notes).not.toContain('<script>');
```

## Performance Testing

### Load Testing Scenarios

1. **Concurrent User Load**
   - Simulate multiple users booking appointments simultaneously
   - Test system behavior under high load
   - Measure response times and error rates

2. **Sustained Load**
   - Extended period of normal usage
   - Test for memory leaks and resource exhaustion
   - Monitor performance degradation

3. **Stress Testing**
   - Push system beyond normal capacity
   - Test graceful degradation
   - Verify recovery mechanisms

### Performance Test Execution

```bash
# Run performance tests
npm run test:performance

# Load testing with k6
npm run test:load
npm run test:load:api
```

### Performance Benchmarks

- **Response Time**: < 1 second for 95% of requests
- **Throughput**: > 100 requests per second
- **Error Rate**: < 1% under normal load
- **Memory Usage**: No memory leaks under sustained load
- **CPU Usage**: < 80% under normal load

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
});
```

### E2E Test Examples

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
    await page.goto('/booking');
    
    // Select service
    await page.selectOption('[data-testid="service-select"]', 'service_haircut');
    
    // Select date and time
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-date="2026-01-20"]');
    await page.click('[data-time="14:00"]');
    
    // Fill customer details
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="email"]', 'john@example.com');
    await page.fill('[data-testid="phone"]', '+27123456789');
    
    // Submit booking
    await page.click('[data-testid="submit-booking"]');
    
    // Verify confirmation
    await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-id"]')).toContainText('apt_');
});
```

## Quality Metrics

### Code Coverage Targets

- **Overall Coverage**: ≥ 80%
- **API Endpoints**: ≥ 90%
- **Core Services**: ≥ 85%
- **Business Logic**: ≥ 90%

### Performance SLAs

- **API Response Time**: < 1 second (95th percentile)
- **Page Load Time**: < 2 seconds
- **Database Query Time**: < 500ms
- **Calendar Sync Time**: < 5 seconds

### Security Standards

- **Critical Vulnerabilities**: 0
- **High Vulnerabilities**: 0
- **Medium Vulnerabilities**: < 3
- **Authentication Bypass**: Not allowed
- **Data Exposure**: Not allowed

## Continuous Monitoring

### Test Results Dashboard

The CI/CD pipeline generates comprehensive test reports:

1. **Test Summary Report** - Overall pass/fail status
2. **Coverage Report** - Code coverage metrics
3. **Performance Report** - Load test results
4. **Security Report** - Vulnerability assessment
5. **E2E Report** - User workflow validation

### Quality Gates

The pipeline enforces quality gates:

1. **Unit Test Gate** - All unit tests must pass
2. **Integration Test Gate** - All integration tests must pass
3. **Security Gate** - No critical/high vulnerabilities
4. **Performance Gate** - Performance metrics within thresholds
5. **Coverage Gate** - Code coverage meets targets

## Troubleshooting

### Common Issues

1. **Test Timeouts**
   - Increase timeout for integration tests
   - Check for slow external service calls
   - Verify test environment setup

2. **Flaky Tests**
   - Add proper wait conditions
   - Mock time-dependent operations
   - Ensure isolated test data

3. **Memory Issues**
   - Clear mocks between tests
   - Use proper cleanup in afterEach hooks
   - Monitor memory usage in long-running tests

### Debugging Tests

```bash
# Run specific test with debug output
npm test -- --verbose --detectOpenHandles

# Run tests in watch mode
npm run test:watch

# Generate detailed coverage report
npm run test:coverage -- --coverageReporters=html
```

## Best Practices

### Writing Tests

1. **Test Structure**
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Keep tests focused and independent

2. **Mocking Strategy**
   - Mock external services
   - Use test fixtures for data
   - Avoid mocking internal implementation details

3. **Assertions**
   - Test for expected behavior, not implementation
   - Use specific assertions
   - Include meaningful error messages

### Maintenance

1. **Regular Updates**
   - Update test fixtures with new data
   - Review and update security test cases
   - Monitor performance baselines

2. **Test Data Management**
   - Use factories for test data generation
   - Clean up test data after each test
   - Maintain data consistency across test types

3. **Documentation**
   - Document complex test scenarios
   - Keep test documentation up to date
   - Include examples for new team members

## Conclusion

This testing and quality assurance framework provides comprehensive coverage for the appointment booking system, ensuring reliability, security, and performance. The framework includes automated testing, continuous monitoring, and quality gates to maintain high standards throughout the development lifecycle.

For questions or issues with the testing framework, please refer to the test documentation or contact the development team.
