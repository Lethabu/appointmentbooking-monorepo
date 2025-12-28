# API Documentation Overview

Welcome to the comprehensive API documentation for the Cloudflare Workers appointment booking system. This documentation provides everything needed to integrate with and build applications on top of our appointment booking platform.

## 📚 Documentation Structure

### Core Documentation

- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API reference with detailed endpoint documentation, examples, and integration guides
- **[openapi.yaml](./openapi.yaml)** - OpenAPI 3.0 specification for automated documentation generation and API testing
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing strategies, tools, and examples

### Quick Start

1. **Review the [API Reference](./API_REFERENCE.md)** for endpoint details and examples
2. **Import the [OpenAPI spec](./openapi.yaml)** into your preferred API tool (Postman, Insomnia, Swagger UI)
3. **Follow the [Testing Guide](./TESTING_GUIDE.md)** to set up comprehensive testing

## 🚀 Key Features

### Multi-Tenant Architecture

- Support for multiple salons/businesses on a single platform
- Tenant-specific configurations and branding
- Isolated data and analytics per tenant

### Real-Time Capabilities

- Server-Sent Events for live dashboard updates
- Real-time booking notifications
- Instant availability updates

### Comprehensive Booking System

- Service selection and availability checking
- Customer information management
- Appointment scheduling and management
- Status tracking and notifications

### Analytics & Reporting

- Dashboard with key performance indicators
- Revenue tracking and reporting
- Customer analytics and insights
- AI conversation analytics

### AI Integration

- Conversation logging and analysis
- Customer satisfaction tracking
- Response time monitoring
- Issue resolution tracking

## 🔧 API Categories

### Booking Management

- **POST /api/book** - Create new appointment bookings
- **GET /api/tenant/{tenantId}/availability** - Check service availability

### Tenant & Services

- **GET /api/tenant** - Get tenant information and services
- **GET /api/public/services** - Get public services listing
- **POST /api/tenant/{tenantId}/schedules** - Manage staff schedules

### Dashboard & Analytics

- **GET /api/dashboard** - Get comprehensive statistics
- **GET /api/dashboard/bookings** - Get filtered booking listings
- **GET /api/dashboard/stream** - Real-time updates via SSE

### Products & Shop

- **GET /api/products** - Get product catalog with filtering

### System Health

- **GET /api/health** - System health and status check

### AI & Automation

- **GET /api/ai** - Get AI conversation analytics
- **POST /api/ai** - Log new AI interactions

## 🛠 Integration Examples

### JavaScript/TypeScript

```typescript
import { AppointmentBookingAPI } from './sdk';

const api = new AppointmentBookingAPI(
  'https://your-worker-domain.workers.dev',
  'your-api-key'
);

// Create a booking
const booking = await api.createBooking({
  tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+27123456789',
  serviceId: 'service-uuid',
  scheduledTime: '2024-01-15T14:30:00.000Z'
});
```

### Python

```python
from appointment_booking import AppointmentBookingAPI

api = AppointmentBookingAPI(
    base_url='https://your-worker-domain.workers.dev',
    api_key='your-api-key'
)

# Get tenant information
tenant = api.get_tenant('instylehairboutique')
print(tenant)
```

### cURL

```bash
# Create a booking
curl -X POST "https://your-worker-domain.workers.dev/api/book" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "serviceId": "service-uuid",
    "scheduledTime": "2024-01-15T14:30:00.000Z"
  }'
```

## 🔐 Authentication

The API uses Bearer token authentication:

```http
Authorization: Bearer YOUR_API_KEY
```

### Public Endpoints

Some endpoints are publicly accessible without authentication:

- GET /api/tenant
- GET /api/public/services
- GET /api/tenant/{tenantId}/availability
- GET /api/products
- GET /api/health

### Protected Endpoints

These require API key authentication:

- POST /api/tenant/{tenantId}/schedules
- GET /api/dashboard
- GET /api/dashboard/bookings
- GET /api/dashboard/stream
- GET /api/ai
- POST /api/ai

## ⚡ Rate Limiting

- **General API**: 100 requests per minute per IP
- **Booking Creation**: 10 requests per minute per tenant
- **Dashboard Analytics**: 60 requests per minute
- **Real-time Stream**: 1 connection per tenant

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 Testing

### Import OpenAPI Specification

1. Download the [openapi.yaml](./openapi.yaml) file
2. Import into your API testing tool:
   - **Postman**: Import → OpenAPI file
   - **Insomnia**: Import → OpenAPI 3.0
   - **Swagger UI**: Upload to any OpenAPI viewer

### Test Environment Setup

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest supertest
npm install --save-dev playwright
npm install --save-dev artillery

# Run tests
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:load          # Load tests
```

### Test Categories

- **Unit Tests** - Individual endpoint testing
- **Integration Tests** - Database and API integration
- **End-to-End Tests** - Complete user workflows
- **Performance Tests** - Load and stress testing
- **Security Tests** - Authentication and authorization

## 📊 Data Models

### Core Entities

#### Booking

```typescript
interface Booking {
  id: string;
  tenant_id: string;
  user_id: string;
  service_id: string;
  scheduled_time: number; // Unix timestamp
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status?: 'pending' | 'paid' | 'failed';
  created_at: number;
  updated_at: number;
}
```

#### Tenant

```typescript
interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}
```

#### Service

```typescript
interface Service {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}
```

## 🔄 Real-Time Updates

### Server-Sent Events

Connect to real-time updates for dashboard applications:

```javascript
const eventSource = new EventSource(
  '/api/dashboard/stream?tenantId=tenant-uuid'
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New appointment:', data.rows);
};

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
};
```

### Event Types

- `appointments` - New booking updates
- `error` - Connection or data errors

## 🛡️ Error Handling

### Standard Error Format

```json
{
  "error": "Error description",
  "details": {
    "field": "Additional error context"
  },
  "statusCode": 400
}
```

### Common Error Codes

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid API key)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **429** - Rate Limited (too many requests)
- **500** - Internal Server Error

## 📈 Analytics & Monitoring

### Dashboard Statistics

- Total appointments and revenue
- Booking status breakdown
- Service performance metrics
- Customer analytics

### AI Analytics

- Conversation volume and trends
- Resolution rates and satisfaction scores
- Response time analysis
- Escalation tracking

## 🌐 Deployment

### Base URL

```
Production: https://your-worker-domain.workers.dev
Staging: https://staging-worker.workers.dev
Development: http://localhost:8787
```

### Environment Variables

```bash
# Required
DB_CONNECTION_STRING=your-database-url
API_BASE_URL=https://your-worker-domain.workers.dev

# Optional
REDIS_URL=your-redis-url
EMAIL_SERVICE_API_KEY=your-email-key
```

## 📞 Support

### Documentation Issues

- Check the [API Reference](./API_REFERENCE.md) for detailed endpoint documentation
- Review the [Testing Guide](./TESTING_GUIDE.md) for testing strategies

### Technical Support

- **Email**: <support@appointmentbooking.co.za>
- **Documentation**: This comprehensive guide
- **API Status**: Check /api/health endpoint

### Getting Help

1. **Search existing documentation** for common solutions
2. **Check error codes** in the error handling section
3. **Test with provided examples** to isolate issues
4. **Contact support** with specific error details

## 📝 Version History

### v1.0.0 (December 24, 2024)

- Initial API release
- Complete booking system implementation
- Real-time dashboard updates
- AI analytics integration
- Comprehensive testing suite
- OpenAPI 3.0 specification

## 🔗 Quick Links

- **[API Reference](./API_REFERENCE.md)** - Complete endpoint documentation
- **[OpenAPI Spec](./openapi.yaml)** - Machine-readable API specification
- **[Testing Guide](./TESTING_GUIDE.md)** - Testing strategies and examples
- **[Base URL](https://your-worker-domain.workers.dev)** - Production API endpoint
- **[Health Check](https://your-worker-domain.workers.dev/api/health)** - System status

---

**Last Updated**: December 24, 2024  
**API Version**: v1.0.0  
**Documentation Version**: 1.0
