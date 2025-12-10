# Instyle Hair Boutique - API Specification

**Version:** 1.0  
**Base URL:** `https://www.instylehairboutique.co.za`  
**Protocol:** HTTPS only (TLS 1.3)  
**Format:** JSON  
**Authentication:** JWT (where required)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Public APIs](#public-apis)
3. [Booking APIs](#booking-apis)
4. [Admin APIs](#admin-apis)
5. [AI Agent APIs](#ai-agent-apis)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks](#webhooks)

---

## Authentication

### JWT Token Structure

```json
{
  "userId": "uuid",
  "tenantId": "uuid",
  "role": "owner|staff|admin",
  "exp": 1234567890
}
```

### Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Public APIs

### 1. Get Tenant Configuration

**Endpoint:** `GET /api/tenant`

**Description:** Retrieve tenant configuration and services

**Query Parameters:**
- `slug` (required): Tenant slug (e.g., "instylehairboutique")

**Request:**
```http
GET /api/tenant?slug=instylehairboutique
```

**Response:** `200 OK`
```json
{
  "tenant": {
    "id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "slug": "instylehairboutique",
    "name": "Instyle Hair Boutique",
    "config": {
      "branding": {
        "primaryColor": "#C0392B",
        "secondaryColor": "#1B1B1B",
        "logo": "/images/instyle-logo.png"
      },
      "contact": {
        "phone": "+27699171527",
        "email": "info@instylehairboutique.co.za",
        "whatsapp": "https://wa.me/27699171527"
      },
      "socials": {
        "instagram": "https://instagram.com/instylehairboutique",
        "facebook": "https://facebook.com/instylehairboutique",
        "tiktok": "https://tiktok.com/@instylehairboutique"
      },
      "business_hours": {
        "monday": "09:00-17:00",
        "tuesday": "09:00-17:00",
        "wednesday": "09:00-17:00",
        "thursday": "09:00-17:00",
        "friday": "09:00-17:00",
        "saturday": "08:00-16:00",
        "sunday": "closed"
      }
    }
  },
  "services": [
    {
      "id": "service-uuid-1",
      "name": "Middle & Side Installation",
      "description": "Professional hair installation service",
      "price": 30000,
      "durationMinutes": 60,
      "isActive": true
    }
  ]
}
```

**Error Responses:**
- `404 Not Found`: Tenant not found
- `500 Internal Server Error`: Server error

---

### 2. Get Services

**Endpoint:** `GET /api/public/services`

**Description:** Retrieve all active services for a tenant

**Query Parameters:**
- `tenantId` (required): Tenant UUID

**Request:**
```http
GET /api/public/services?tenantId=ccb12b4d-ade6-467d-a614-7c9d198ddc70
```

**Response:** `200 OK`
```json
{
  "services": [
    {
      "id": "service-uuid-1",
      "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
      "name": "Middle & Side Installation",
      "description": "Professional hair installation service",
      "price": 30000,
      "durationMinutes": 60,
      "category": "Hair",
      "isActive": true,
      "createdAt": "2024-11-28T10:00:00Z"
    },
    {
      "id": "service-uuid-2",
      "name": "Maphondo & Lines Installation",
      "description": "Traditional African hairstyling with intricate patterns",
      "price": 35000,
      "durationMinutes": 60,
      "category": "Hair",
      "isActive": true,
      "createdAt": "2024-11-28T10:00:00Z"
    }
  ],
  "count": 5
}
```

---

### 3. Check Availability

**Endpoint:** `POST /api/availability`

**Description:** Check available time slots for a service

**Request Body:**
```json
{
  "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
  "serviceId": "service-uuid-1",
  "date": "2024-12-15",
  "employeeId": "employee-uuid-1" // optional
}
```

**Response:** `200 OK`
```json
{
  "date": "2024-12-15",
  "availableSlots": [
    {
      "time": "09:00",
      "available": true,
      "employeeId": "employee-uuid-1"
    },
    {
      "time": "09:30",
      "available": true,
      "employeeId": "employee-uuid-1"
    },
    {
      "time": "10:00",
      "available": false,
      "reason": "Already booked"
    }
  ],
  "businessHours": {
    "start": "09:00",
    "end": "17:00"
  }
}
```

---

## Booking APIs

### 4. Create Booking

**Endpoint:** `POST /api/book`

**Description:** Create a new appointment booking

**Request Body:**
```json
{
  "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
  "serviceId": "service-uuid-1",
  "customer": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+27821234567"
  },
  "scheduledTime": "2024-12-15T10:00:00Z",
  "notes": "First time client, student discount requested",
  "employeeId": "employee-uuid-1" // optional
}
```

**Response:** `201 Created`
```json
{
  "booking": {
    "id": "booking-uuid-1",
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "userId": "user-uuid-1",
    "serviceId": "service-uuid-1",
    "employeeId": "employee-uuid-1",
    "scheduledTime": "2024-12-15T10:00:00Z",
    "status": "pending",
    "notes": "First time client, student discount requested",
    "createdAt": "2024-12-01T20:00:00Z"
  },
  "service": {
    "name": "Middle & Side Installation",
    "price": 30000,
    "durationMinutes": 60
  },
  "paymentRequired": {
    "bookingFee": 6000,
    "remainingBalance": 24000,
    "totalAmount": 30000,
    "currency": "ZAR"
  },
  "whatsappConfirmation": {
    "url": "https://wa.me/27699171527?text=Booking%20confirmed",
    "message": "Your booking has been created! We'll send you a confirmation via WhatsApp."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data
- `409 Conflict`: Time slot already booked
- `422 Unprocessable Entity`: Validation errors

---

### 5. Get Booking

**Endpoint:** `GET /api/bookings/:id`

**Description:** Retrieve booking details

**Authentication:** Required (JWT)

**Request:**
```http
GET /api/bookings/booking-uuid-1
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "booking": {
    "id": "booking-uuid-1",
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "userId": "user-uuid-1",
    "serviceId": "service-uuid-1",
    "employeeId": "employee-uuid-1",
    "scheduledTime": "2024-12-15T10:00:00Z",
    "status": "confirmed",
    "notes": "First time client",
    "createdAt": "2024-12-01T20:00:00Z",
    "updatedAt": "2024-12-01T20:05:00Z"
  },
  "customer": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+27821234567"
  },
  "service": {
    "name": "Middle & Side Installation",
    "price": 30000,
    "durationMinutes": 60
  }
}
```

---

### 6. Update Booking Status

**Endpoint:** `PATCH /api/bookings/:id/status`

**Description:** Update booking status (confirm, cancel, complete)

**Authentication:** Required (JWT - owner/staff/admin)

**Request Body:**
```json
{
  "status": "confirmed|cancelled|completed",
  "notes": "Optional cancellation reason or notes"
}
```

**Response:** `200 OK`
```json
{
  "booking": {
    "id": "booking-uuid-1",
    "status": "confirmed",
    "updatedAt": "2024-12-01T20:10:00Z"
  },
  "notification": {
    "sent": true,
    "channel": "whatsapp",
    "message": "Your booking has been confirmed!"
  }
}
```

---

## Admin APIs

### 7. List Appointments

**Endpoint:** `GET /api/admin/appointments`

**Description:** Get all appointments for a tenant

**Authentication:** Required (JWT - owner/staff/admin)

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `date` (optional): Filter by date (YYYY-MM-DD)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Request:**
```http
GET /api/admin/appointments?status=confirmed&date=2024-12-15
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "appointments": [
    {
      "id": "booking-uuid-1",
      "customer": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+27821234567"
      },
      "service": {
        "name": "Middle & Side Installation",
        "price": 30000,
        "durationMinutes": 60
      },
      "scheduledTime": "2024-12-15T10:00:00Z",
      "status": "confirmed",
      "notes": "First time client",
      "createdAt": "2024-12-01T20:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### 8. Create Service

**Endpoint:** `POST /api/admin/services`

**Description:** Create a new service

**Authentication:** Required (JWT - owner/admin)

**Request Body:**
```json
{
  "name": "New Service Name",
  "description": "Service description",
  "price": 45000,
  "durationMinutes": 90,
  "category": "Hair|Makeup|Styling",
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "service": {
    "id": "service-uuid-new",
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "name": "New Service Name",
    "description": "Service description",
    "price": 45000,
    "durationMinutes": 90,
    "category": "Hair",
    "isActive": true,
    "createdAt": "2024-12-01T20:15:00Z"
  }
}
```

---

### 9. Update Service

**Endpoint:** `PUT /api/admin/services/:id`

**Description:** Update an existing service

**Authentication:** Required (JWT - owner/admin)

**Request Body:**
```json
{
  "name": "Updated Service Name",
  "price": 50000,
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "service": {
    "id": "service-uuid-1",
    "name": "Updated Service Name",
    "price": 50000,
    "isActive": false,
    "updatedAt": "2024-12-01T20:20:00Z"
  }
}
```

---

### 10. Delete Service

**Endpoint:** `DELETE /api/admin/services/:id`

**Description:** Soft delete a service (sets isActive to false)

**Authentication:** Required (JWT - owner/admin)

**Response:** `204 No Content`

---

### 11. Get Analytics

**Endpoint:** `GET /api/admin/analytics`

**Description:** Get business analytics and metrics

**Authentication:** Required (JWT - owner/admin)

**Query Parameters:**
- `period` (optional): today|week|month|year (default: week)
- `startDate` (optional): Custom start date
- `endDate` (optional): Custom end date

**Request:**
```http
GET /api/admin/analytics?period=week
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`
```json
{
  "period": "week",
  "startDate": "2024-11-25",
  "endDate": "2024-12-01",
  "metrics": {
    "totalBookings": 45,
    "confirmedBookings": 38,
    "cancelledBookings": 3,
    "completedBookings": 35,
    "revenue": {
      "total": 1350000,
      "currency": "ZAR"
    },
    "newCustomers": 12,
    "returningCustomers": 26,
    "averageBookingValue": 30000,
    "noShowRate": 0.067
  },
  "popularServices": [
    {
      "serviceId": "service-uuid-1",
      "name": "Middle & Side Installation",
      "bookings": 15,
      "revenue": 450000
    },
    {
      "serviceId": "service-uuid-2",
      "name": "Maphondo & Lines Installation",
      "bookings": 12,
      "revenue": 420000
    }
  ],
  "peakHours": [
    {
      "hour": "10:00",
      "bookings": 8
    },
    {
      "hour": "14:00",
      "bookings": 7
    }
  ]
}
```

---

## AI Agent APIs

### 12. AI Agent Webhook

**Endpoint:** `POST /api/agent/instyle`

**Description:** Webhook for AISensy WhatsApp integration

**Authentication:** API Key (X-API-Key header)

**Request Headers:**
```http
Content-Type: application/json
X-API-Key: <api_key>
```

**Request Body:**
```json
{
  "event": "message.received",
  "timestamp": "2024-12-01T20:30:00Z",
  "from": "+27821234567",
  "message": {
    "type": "text",
    "text": "I need to book Maphondo for next Tuesday"
  },
  "context": {
    "conversationId": "conv-uuid-1",
    "messageId": "msg-uuid-1"
  }
}
```

**Response:** `200 OK`
```json
{
  "reply": {
    "type": "text",
    "text": "Great! I can help you book Maphondo & Lines Installation (R350, 60 minutes). What time works best for you on Tuesday, December 10th? We're open 9am-5pm."
  },
  "action": "await_time_selection",
  "context": {
    "serviceId": "service-uuid-2",
    "date": "2024-12-10",
    "customerPhone": "+27821234567"
  }
}
```

---

### 13. AI Chat (Dashboard)

**Endpoint:** `POST /api/admin/ai-chat`

**Description:** AI assistant for dashboard queries

**Authentication:** Required (JWT - owner/staff/admin)

**Request Body:**
```json
{
  "message": "Show me this week's revenue",
  "conversationId": "conv-uuid-dashboard-1"
}
```

**Response:** `200 OK`
```json
{
  "reply": "This week's revenue is R135,000 from 45 bookings. That's a 15% increase from last week! Your top service is Middle & Side Installation with R45,000 in revenue.",
  "data": {
    "revenue": 135000,
    "bookings": 45,
    "growthRate": 0.15,
    "topService": "Middle & Side Installation"
  },
  "suggestions": [
    "View detailed breakdown",
    "Compare to last month",
    "Export report"
  ]
}
```

---

## Payment APIs

### 14. Create Payment

**Endpoint:** `POST /api/payments/paystack/create`

**Description:** Initialize Paystack payment for booking fee

**Request Body:**
```json
{
  "bookingId": "booking-uuid-1",
  "amount": 6000,
  "email": "jane@example.com",
  "metadata": {
    "bookingId": "booking-uuid-1",
    "customerId": "user-uuid-1",
    "serviceId": "service-uuid-1"
  }
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "authorizationUrl": "https://checkout.paystack.com/abc123",
    "accessCode": "abc123",
    "reference": "pay-ref-uuid-1"
  }
}
```

---

### 15. Payment Webhook

**Endpoint:** `POST /api/payments/paystack/webhook`

**Description:** Paystack webhook for payment status updates

**Request Headers:**
```http
X-Paystack-Signature: <signature>
```

**Request Body:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "pay-ref-uuid-1",
    "amount": 6000,
    "status": "success",
    "metadata": {
      "bookingId": "booking-uuid-1"
    }
  }
}
```

**Response:** `200 OK`

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field error details"
    },
    "timestamp": "2024-12-01T20:00:00Z",
    "requestId": "req-uuid-1"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `TENANT_NOT_FOUND` | 404 | Tenant does not exist |
| `SERVICE_NOT_FOUND` | 404 | Service does not exist |
| `BOOKING_NOT_FOUND` | 404 | Booking does not exist |
| `INVALID_REQUEST` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `SLOT_UNAVAILABLE` | 409 | Time slot already booked |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

**Limits:**
- Public APIs: 100 requests/minute per IP
- Authenticated APIs: 300 requests/minute per user
- AI Agent APIs: 60 requests/minute per API key

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701460800
```

**Rate Limit Exceeded Response:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

---

## Webhooks

### Webhook Events

| Event | Description |
|-------|-------------|
| `booking.created` | New booking created |
| `booking.confirmed` | Booking confirmed by staff |
| `booking.cancelled` | Booking cancelled |
| `booking.completed` | Booking marked as completed |
| `payment.success` | Payment successful |
| `payment.failed` | Payment failed |

### Webhook Payload

```json
{
  "event": "booking.created",
  "timestamp": "2024-12-01T20:00:00Z",
  "data": {
    "bookingId": "booking-uuid-1",
    "tenantId": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "status": "pending"
  }
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-01 | Initial API specification |

---

**Maintained By:** Engineering Team  
**Last Updated:** 2024-12-01
