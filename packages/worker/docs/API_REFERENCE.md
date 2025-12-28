# Cloudflare Workers API Reference

## Overview

This document provides comprehensive API specifications for the appointment booking system implemented as Cloudflare Workers. The API enables tenant management, booking creation, dashboard analytics, and real-time updates for salon and service appointment systems.

**Base URL:** `https://your-worker-domain.workers.dev`

**Current Version:** `v1`

**Authentication:** API Key-based authentication (see [Authentication](#authentication) section)

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Booking Management](#booking-management)
  - [Tenant & Services](#tenant--services)
  - [Dashboard & Analytics](#dashboard--analytics)
  - [Products & Shop](#products--shop)
  - [System Health](#system-health)
  - [AI & Automation](#ai--automation)
- [Data Models](#data-models)
- [SDK Examples](#sdk-examples)
- [Testing Guide](#testing-guide)

## Getting Started

### Quick Start

1. **Get your API key** from your tenant dashboard
2. **Base URL**: Use your Cloudflare Worker deployment URL
3. **Authentication**: Include API key in all requests
4. **Rate Limits**: Respect rate limiting policies

### Base Request Example

```javascript
const response = await fetch('https://your-worker-domain.workers.dev/api/tenant?slug=instylehairboutique', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
```

## Authentication

### API Key Authentication

The API uses Bearer token authentication for all protected endpoints.

**Header Format:**

```
Authorization: Bearer YOUR_API_KEY
```

**Note:** Some endpoints (like public services) may not require authentication for read operations.

### Authentication Levels

- **Public Endpoints**: No authentication required
- **Tenant Endpoints**: API key required
- **Dashboard Endpoints**: Admin API key required
- **Booking Endpoints**: API key or public access (configurable)

## Error Handling

### Standard Error Response

All errors follow a consistent format:

```json
{
  "error": "Error description",
  "details": {
    "field": "Additional error context"
  },
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Internal Server Error |

### Error Types

| Error Type | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Invalid request data |
| `AUTHENTICATION_ERROR` | Invalid or missing API key |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Rate Limiting

### Default Limits

- **General API**: 100 requests per minute per IP
- **Booking Creation**: 10 requests per minute per tenant
- **Dashboard Analytics**: 60 requests per minute
- **Real-time Stream**: 1 connection per tenant

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Response

When limits are exceeded:

```json
{
  "error": "Rate limit exceeded",
  "details": {
    "limit": 100,
    "window": "1 minute",
    "resetTime": "2024-01-01T00:00:00Z"
  },
  "statusCode": 429
}
```

---

## Endpoints

### Booking Management

#### Create Booking

Create a new appointment booking.

**Endpoint:** `POST /api/book`

**Authentication:** Public (configurable)

**Request Body:**

```json
{
  "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+27123456789",
  "serviceId": "service-uuid-here",
  "scheduledTime": "2024-01-15T14:30:00.000Z",
  "notes": "First time customer"
}
```

**Response:**

```json
{
  "success": true,
  "bookingId": "booking-uuid-here",
  "message": "Booking created successfully"
}
```

#### Check Availability

Get available time slots for a service on a specific date.

**Endpoint:** `GET /api/tenant/{tenantId}/availability`

**Parameters:**

- `date`: Date in YYYY-MM-DD format
- `serviceId`: Service UUID

**Response:**

```json
{
  "slots": [
    "2024-01-15T09:00:00.000Z",
    "2024-01-15T10:00:00.000Z",
    "2024-01-15T11:00:00.000Z"
  ]
}
```

---

### Tenant & Services

#### Get Tenant Information

Retrieve tenant details and available services.

**Endpoint:** `GET /api/tenant`

**Parameters:**

- `slug`: Tenant slug (e.g., "instylehairboutique")

**Response:**

```json
{
  "tenant": {
    "id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "InStyle Hair Boutique",
    "slug": "instylehairboutique",
    "description": "Premium hair services",
    "phone": "+27123456789",
    "email": "info@instylestudio.co.za"
  },
  "services": [
    {
      "id": "service-uuid",
      "name": "Haircut & Style",
      "price": 350.00,
      "duration_minutes": 60,
      "description": "Professional haircut and styling",
      "is_active": true
    }
  ]
}
```

#### Get Public Services

Get active services for a tenant (public endpoint).

**Endpoint:** `GET /api/public/services`

**Parameters:**

- `tenantId`: Tenant UUID

**Response:**

```json
{
  "services": [
    {
      "id": "service-uuid",
      "name": "Haircut & Style",
      "price": 350.00,
      "duration_minutes": 60,
      "description": "Professional haircut and styling",
      "is_active": true
    }
  ]
}
```

#### Manage Staff Schedules

Create or duplicate staff schedules.

**Endpoint:** `POST /api/tenant/{tenantId}/schedules`

**Request Body:**

```json
{
  "staffNames": ["Sarah", "Mike"],
  "serviceId": "service-uuid",
  "schedule": [
    {
      "day": 1,
      "start": "09:00",
      "end": "17:00"
    },
    {
      "day": 2,
      "start": "09:00",
      "end": "17:00"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Schedule updated for 2 staff members"
}
```

---

### Dashboard & Analytics

#### Get Dashboard Statistics

Retrieve comprehensive tenant statistics.

**Endpoint:** `GET /api/dashboard`

**Parameters:**

- `tenantId`: Tenant UUID

**Response:**

```json
{
  "tenant": {
    "id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "InStyle Hair Boutique",
    "slug": "instylehairboutique"
  },
  "statistics": {
    "totalAppointments": 150,
    "confirmedAppointments": 120,
    "pendingAppointments": 30,
    "totalRevenue": 42000.00,
    "activeServices": 8,
    "pageViews": 1250
  },
  "recentAppointments": [
    {
      "id": "booking-uuid",
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "service_name": "Haircut & Style",
      "scheduled_time": 1705324200,
      "status": "confirmed",
      "payment_status": "paid"
    }
  ]
}
```

#### Get Dashboard Bookings

Retrieve bookings for dashboard display.

**Endpoint:** `GET /api/dashboard/bookings`

**Parameters:**

- `tenantId`: Tenant UUID
- `status`: Optional status filter (pending, confirmed, cancelled)
- `limit`: Maximum results (default: 100, max: 500)

**Response:**

```json
{
  "bookings": [
    {
      "id": "booking-uuid",
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "service_name": "Haircut & Style",
      "scheduled_time": 1705324200,
      "status": "confirmed",
      "payment_status": "paid"
    }
  ],
  "count": 1
}
```

#### Real-time Dashboard Stream

Server-Sent Events stream for real-time dashboard updates.

**Endpoint:** `GET /api/dashboard/stream`

**Parameters:**

- `tenantId`: Tenant UUID

**Response:** Server-Sent Events stream

**Example Event:**

```
event: appointments
data: {"rows": [{"id": "booking-uuid", "scheduled_time": 1705324200, "status": "confirmed"}]}
```

---

### Products & Shop

#### Get Products

Retrieve products for the shop page.

**Endpoint:** `GET /api/products`

**Parameters:**

- `category`: Optional category slug filter

**Response:**

```json
{
  "products": [
    {
      "id": "product-uuid",
      "name": "Professional Hair Dryer",
      "price": 899.00,
      "short_description": "Ionic hair dryer with multiple heat settings",
      "images": ["https://example.com/image1.jpg"],
      "category_name": "Hair Tools",
      "category_slug": "hair-tools",
      "is_active": true
    }
  ]
}
```

---

### System Health

#### Health Check

Check system health and service status.

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "operational",
    "worker": "operational"
  },
  "version": "e9ebc0e1-d799-4160-8747-7621f42d49ed"
}
```

---

### AI & Automation

#### AI Analytics

Get AI conversation statistics and logs.

**Endpoint:** `GET /api/ai`

**Parameters:**

- `tenantId`: Tenant UUID

**Response:**

```json
{
  "stats": {
    "totalConversations": 45,
    "resolvedIssues": 38,
    "escalatedToHuman": 7,
    "avgResponseTime": 1200,
    "recentConversations": [
      {
        "agentName": "booking-assistant",
        "query": "I need to book a haircut",
        "response": "I can help you with that. What time works for you?",
        "response_time_ms": 800,
        "resolved": true,
        "timestamp": 1705324200
      }
    ]
  }
}
```

#### Log AI Interaction

Log a new AI conversation.

**Endpoint:** `POST /api/ai`

**Request Body:**

```json
{
  "agentName": "booking-assistant",
  "userId": "user-uuid",
  "sessionId": "session-uuid",
  "query": "I need to book a haircut",
  "response": "I can help you with that. What time works for you?",
  "responseTimeMs": 800,
  "resolved": true,
  "escalated": false,
  "satisfactionScore": 5
}
```

**Response:**

```json
{
  "success": true,
  "id": "log-uuid"
}
```

---

## Data Models

### Booking

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

### Tenant

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

### Service

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

### User

```typescript
interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: number;
  updated_at: number;
}
```

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  images?: string[]; // JSON array of image URLs
  category_id?: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
class AppointmentBookingAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async getTenant(slug: string) {
    return this.request(`/api/tenant?slug=${slug}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/api/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getAvailability(tenantId: string, date: string, serviceId: string) {
    return this.request(`/api/tenant/${tenantId}/availability?date=${date}&serviceId=${serviceId}`);
  }

  async getDashboardStats(tenantId: string) {
    return this.request(`/api/dashboard?tenantId=${tenantId}`);
  }
}

// Usage
const api = new AppointmentBookingAPI('https://your-worker-domain.workers.dev', 'your-api-key');

// Get tenant info
const tenant = await api.getTenant('instylehairboutique');
console.log(tenant);

// Create a booking
const booking = await api.createBooking({
  tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+27123456789',
  serviceId: 'service-uuid',
  scheduledTime: '2024-01-15T14:30:00.000Z',
  notes: 'First time customer'
});
```

### Python

```python
import requests
import json
from typing import Optional, Dict, Any

class AppointmentBookingAPI:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def _request(self, endpoint: str, method: str = 'GET', data: Optional[Dict] = None) -> Dict:
        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, headers=self.headers, json=data)
        
        if not response.ok:
            error = response.json()
            raise Exception(error.get('error', 'Request failed'))
        
        return response.json()
    
    def get_tenant(self, slug: str) -> Dict:
        return self._request(f"/api/tenant?slug={slug}")
    
    def create_booking(self, booking_data: Dict) -> Dict:
        return self._request("/api/book", method="POST", data=booking_data)
    
    def get_availability(self, tenant_id: str, date: str, service_id: str) -> Dict:
        params = f"date={date}&serviceId={service_id}"
        return self._request(f"/api/tenant/{tenant_id}/availability?{params}")
    
    def get_dashboard_stats(self, tenant_id: str) -> Dict:
        return self._request(f"/api/dashboard?tenantId={tenant_id}")

# Usage
api = AppointmentBookingAPI('https://your-worker-domain.workers.dev', 'your-api-key')

# Get tenant info
tenant = api.get_tenant('instylehairboutique')
print(tenant)

# Create a booking
booking = api.create_booking({
    'tenantId': 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '+27123456789',
    'serviceId': 'service-uuid',
    'scheduledTime': '2024-01-15T14:30:00.000Z',
    'notes': 'First time customer'
})
```

### cURL Examples

```bash
# Get tenant information
curl -X GET "https://your-worker-domain.workers.dev/api/tenant?slug=instylehairboutique" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Create a booking
curl -X POST "https://your-worker-domain.workers.dev/api/book" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "serviceId": "service-uuid",
    "scheduledTime": "2024-01-15T14:30:00.000Z"
  }'

# Get availability
curl -X GET "https://your-worker-domain.workers.dev/api/tenant/ccb12b4d-ade6-467d-a614-7c9d198ddc70/availability?date=2024-01-15&serviceId=service-uuid" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get dashboard stats
curl -X GET "https://your-worker-domain.workers.dev/api/dashboard?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Health check
curl -X GET "https://your-worker-domain.workers.dev/api/health"
```

---

## Testing Guide

### Unit Testing

#### Testing Booking Creation

```javascript
// Jest test example
describe('Booking API', () => {
  test('should create booking successfully', async () => {
    const bookingData = {
      tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+27123456789',
      serviceId: 'service-uuid',
      scheduledTime: '2024-01-15T14:30:00.000Z'
    };

    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.bookingId).toBeDefined();
  });

  test('should validate required fields', async () => {
    const invalidData = {
      name: 'John Doe'
      // Missing required fields
    };

    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();
    
    expect(response.status).toBe(400);
    expect(result.error).toContain('Missing required fields');
  });
});
```

#### Testing Availability Check

```javascript
test('should return available slots', async () => {
  const response = await fetch(
    '/api/tenant/tenant-uuid/availability?date=2024-01-15&serviceId=service-uuid'
  );

  const result = await response.json();
  
  expect(response.status).toBe(200);
  expect(Array.isArray(result.slots)).toBe(true);
  expect(result.slots.length).toBeGreaterThan(0);
});
```

### Integration Testing

#### End-to-End Booking Flow

```javascript
describe('Complete Booking Flow', () => {
  test('should complete full booking process', async () => {
    // 1. Get tenant and services
    const tenantResponse = await fetch('/api/tenant?slug=instylehairboutique');
    const tenant = await tenantResponse.json();
    
    expect(tenant.tenant).toBeDefined();
    expect(tenant.services.length).toBeGreaterThan(0);
    
    const service = tenant.services[0];
    
    // 2. Check availability
    const availabilityResponse = await fetch(
      `/api/tenant/${tenant.tenant.id}/availability?date=2024-01-15&serviceId=${service.id}`
    );
    const availability = await availabilityResponse.json();
    
    expect(availability.slots.length).toBeGreaterThan(0);
    
    // 3. Create booking
    const bookingData = {
      tenantId: tenant.tenant.id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+27123456789',
      serviceId: service.id,
      scheduledTime: availability.slots[0],
      notes: 'Integration test booking'
    };
    
    const bookingResponse = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const booking = await bookingResponse.json();
    
    expect(booking.success).toBe(true);
    expect(booking.bookingId).toBeDefined();
    
    // 4. Verify booking appears in dashboard
    const dashboardResponse = await fetch(
      `/api/dashboard/bookings?tenantId=${tenant.tenant.id}`
    );
    const dashboard = await dashboardResponse.json();
    
    expect(dashboard.bookings.some(b => b.id === booking.bookingId)).toBe(true);
  });
});
```

### Performance Testing

#### Load Testing with Artillery

```yaml
# artillery.yml
config:
  target: 'https://your-worker-domain.workers.dev'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer YOUR_API_KEY'

scenarios:
  - name: "Booking API Load Test"
    flow:
      - get:
          url: "/api/tenant?slug=instylehairboutique"
      - post:
          url: "/api/book"
          json:
            tenantId: "ccb12b4d-ade6-467d-a614-7c9d198ddc70"
            name: "Load Test User"
            email: "loadtest@example.com"
            phone: "+27123456789"
            serviceId: "service-uuid"
            scheduledTime: "2024-01-15T14:30:00.000Z"
```

### Real-time Testing

#### Server-Sent Events Testing

```javascript
test('should receive real-time updates', async () => {
  const eventSource = new EventSource(
    '/api/dashboard/stream?tenantId=tenant-uuid'
  );

  return new Promise((resolve, reject) => {
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      expect(data.rows).toBeDefined();
      eventSource.close();
      resolve();
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      reject(error);
    };

    // Timeout after 10 seconds
    setTimeout(() => {
      eventSource.close();
      reject(new Error('Timeout waiting for SSE events'));
    }, 10000);
  });
});
```

### Error Testing

#### Rate Limiting Test

```javascript
test('should handle rate limiting', async () => {
  const promises = Array(101).fill().map(() => 
    fetch('/api/dashboard?tenantId=tenant-uuid', {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    })
  );

  const responses = await Promise.all(promises);
  const rateLimitedResponses = responses.filter(r => r.status === 429);
  
  expect(rateLimitedResponses.length).toBeGreaterThan(0);
  
  const rateLimitResponse = rateLimitedResponses[0];
  const rateLimitData = await rateLimitResponse.json();
  
  expect(rateLimitData.error).toContain('Rate limit exceeded');
  expect(rateLimitData.statusCode).toBe(429);
});
```

---

## Conclusion

This API provides a comprehensive solution for appointment booking systems with real-time capabilities, analytics, and AI integration. The Cloudflare Workers implementation ensures high performance, global availability, and seamless scalability.

For additional support or questions, please refer to the project documentation or contact the development team.

---

**Document Version:** 1.0  
**Last Updated:** December 24, 2024  
**API Version:** v1
