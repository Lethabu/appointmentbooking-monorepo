# Product Requirements Document (PRD): Instyle Hair Boutique Digital Experience Platform

**Document Version:** 2.0  
**Date:** 2024-12-01  
**Client:** Instyle Hair Boutique  
**Provider:** appointmentbookings.co.za  
**Status:** APPROVED FOR IMPLEMENTATION  
**Document Owner:** Product Team  

---

## 1. Executive Summary

### 1.1 Vision
Provide Instyle Hair Boutique with a bespoke, AI-powered, white-labeled digital platform that elevates their brand, automates operations, and creates new revenue streams through intelligent automation and superior customer experience.

### 1.2 Business Objectives
- **Operational Efficiency:** Reduce administrative overhead by 90% through AI automation
- **Revenue Growth:** Increase bookings by 40% and enable new e-commerce revenue stream
- **Customer Experience:** Achieve 24/7 availability with <60s response time for booking inquiries
- **Brand Elevation:** Replace SuperSaaS with premium, fully-branded solution

### 1.3 Success Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| AI-handled booking inquiries | >90% | Month 1 |
| No-show reduction | >30% | Month 2 |
| E-commerce revenue | R10,000+/month | Month 3 |
| Customer satisfaction | >4.5/5 | Month 3 |
| Platform uptime | 99.9% | Ongoing |

---

## 2. User Personas & Scenarios

### 2.1 Zanele - Salon Owner
**Goals:** Focus on high-value client services, reduce admin time, grow revenue  
**Pain Points:** Manual booking management, no-shows, limited online presence  
**Scenario:** Logs into dashboard, sees real-time appointments, receives AI-generated promotion suggestion for slow periods, approves with one click.

### 2.2 TUT Student Client
**Goals:** Quick, affordable booking between classes  
**Pain Points:** Limited time, budget constraints  
**Scenario:** WhatsApp message "Need Maphondo next Tuesday" → Nia AI responds in 30s with available off-peak slot + 10% student discount → Booking confirmed.

### 2.3 Premium Client
**Goals:** Convenient booking, premium service experience  
**Pain Points:** Forgetting appointments, discovering new products  
**Scenario:** Receives proactive WhatsApp reminder 24h before appointment + personalized product recommendation based on service history.

---

## 3. Functional Requirements

### 3.1 Client-Facing Website (`www.instylehairboutique.co.za`)

#### REQ-IS-01: White-Label Branding
- **Priority:** MUST HAVE
- **Description:** Fully branded experience with Instyle's identity
- **Acceptance Criteria:**
  - Crimson (#C0392B) primary color throughout
  - Custom logo in header (max 180px height)
  - No "Powered by" branding visible
  - Consistent typography (Inter/Geist sans-serif)
  - Mobile-responsive design (viewport <768px)

#### REQ-IS-02: Service Catalog
- **Priority:** MUST HAVE
- **Description:** Dynamic service display with real-time data
- **Acceptance Criteria:**
  - Services fetched from `/api/public/services`
  - Display: name, description, price (ZAR), duration
  - Grouped by category (Hair, Makeup, Styling)
  - Service images (static mapping until DB support)
  - Real-time price calculation for multi-service selection

#### REQ-IS-03: Booking Engine
- **Priority:** MUST HAVE
- **Description:** Multi-step booking flow with validation
- **Acceptance Criteria:**
  - Step 1: Service selection (single/multiple)
  - Step 2: Date/time picker with availability check
  - Step 3: Customer details (name, email, phone - all required)
  - Step 4: Payment summary with booking fee calculation
  - Step 5: Confirmation with WhatsApp link
  - Business hours enforcement (Mon-Fri 09:00-17:00, Sat 08:00-16:00)
  - Form validation with error messages
  - Mobile-optimized touch interface

#### REQ-IS-04: E-Commerce Store
- **Priority:** MUST HAVE
- **Description:** Product catalog with checkout
- **Acceptance Criteria:**
  - `/shop` page with product grid
  - Product detail pages with images, description, price
  - Shopping cart with quantity management
  - Checkout integration with Netcash + Payflex
  - Order confirmation via WhatsApp
  - Inventory tracking (future: low-stock alerts)

#### REQ-IS-05: Performance
- **Priority:** MUST HAVE
- **Description:** Fast, reliable page loads
- **Acceptance Criteria:**
  - Initial page load <2.5s (global average)
  - API response time <200ms
  - Lighthouse performance score >90
  - Mobile-first optimization

### 3.2 Salon Owner Dashboard

#### REQ-IS-06: Secure Access
- **Priority:** MUST HAVE
- **Description:** Role-based authentication
- **Acceptance Criteria:**
  - Email/password login with session management
  - Role: `owner`, `staff`, `admin`
  - Password reset flow via email
  - Session timeout after 30min inactivity

#### REQ-IS-07: Live Appointment View
- **Priority:** MUST HAVE
- **Description:** Real-time appointment dashboard
- **Acceptance Criteria:**
  - Auto-refreshing appointment list (30s interval)
  - Filter by: today, week, month, status
  - Display: customer name, service, time, status, notes
  - Status indicators: pending, confirmed, completed, cancelled
  - Quick actions: confirm, cancel, reschedule

#### REQ-IS-08: Service & Product Management
- **Priority:** MUST HAVE
- **Description:** CRUD operations for catalog
- **Acceptance Criteria:**
  - Add/edit/delete services (name, description, price, duration)
  - Add/edit/delete products (name, description, price, stock)
  - Image upload (max 2MB, jpg/png/webp)
  - Bulk import via CSV
  - Change history audit log

#### REQ-IS-09: Analytics Dashboard
- **Priority:** SHOULD HAVE
- **Description:** Business intelligence metrics
- **Acceptance Criteria:**
  - Today's bookings count
  - Weekly revenue (ZAR)
  - New vs returning clients
  - Popular services chart
  - Peak booking times heatmap
  - Export to CSV/PDF

#### REQ-IS-10: AI Agent Chat Interface
- **Priority:** SHOULD HAVE
- **Description:** Dashboard-integrated AI assistant
- **Acceptance Criteria:**
  - Chat window in dashboard sidebar
  - Natural language queries ("Show me this week's revenue")
  - AI-generated insights and recommendations
  - Context-aware responses using tenant data

### 3.3 AI Agent Army & Automation

#### REQ-IS-11: Nia - Booking Assistant
- **Priority:** MUST HAVE
- **Description:** WhatsApp AI for booking inquiries
- **Acceptance Criteria:**
  - Handles incoming WhatsApp messages via AISensy integration
  - Natural language understanding for booking intent
  - Service recommendation based on query
  - Availability checking and slot suggestion
  - Booking confirmation with details
  - Handoff to human if unable to resolve
  - Response time <60s (95th percentile)
  - Success rate >90% for standard booking queries

#### REQ-IS-12: WhatsApp Notification System
- **Priority:** MUST HAVE
- **Description:** Automated customer communications
- **Acceptance Criteria:**
  - Booking confirmation (immediate)
  - 24h reminder before appointment
  - 2h reminder on appointment day
  - Cancellation/reschedule notifications
  - Payment receipt confirmation
  - Template compliance with WhatsApp Business Policy

#### REQ-IS-13: Blaze - Marketing Agent
- **Priority:** SHOULD HAVE
- **Description:** AI-driven promotional campaigns
- **Acceptance Criteria:**
  - Analyzes booking patterns to identify slow periods
  - Generates promotion suggestions (e.g., "20% off Tuesday mornings")
  - Segments customers by service history
  - Automated campaign scheduling
  - ROI tracking per campaign

#### REQ-IS-14: Orion - Client Retention Agent
- **Priority:** SHOULD HAVE
- **Description:** Proactive customer engagement
- **Acceptance Criteria:**
  - Identifies clients due for repeat service (based on service type)
  - Sends personalized re-booking reminders
  - Product recommendations based on service history
  - Birthday/anniversary messages
  - Loyalty program management

#### REQ-IS-15: DocsGPT - Knowledge Base Agent
- **Priority:** COULD HAVE
- **Description:** FAQ automation
- **Acceptance Criteria:**
  - Answers common questions (hours, location, services, pricing)
  - Knowledge base trained on Instyle-specific content
  - Embedded on website as chat widget
  - Escalation to human support when needed

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-01:** API response time <200ms (p95)
- **NFR-02:** Page load time <2.5s (global average)
- **NFR-03:** Support 100 concurrent users
- **NFR-04:** Database query time <50ms (p95)

### 4.2 Reliability
- **NFR-05:** 99.9% uptime SLA (Cloudflare Workers)
- **NFR-06:** Automated failover for critical services
- **NFR-07:** Daily database backups with 30-day retention
- **NFR-08:** Zero data loss guarantee

### 4.3 Security
- **NFR-09:** POPIA compliance for all data handling
- **NFR-10:** End-to-end encryption for payment data
- **NFR-11:** Rate limiting: 100 req/min per IP
- **NFR-12:** SQL injection prevention (parameterized queries)
- **NFR-13:** XSS protection (input sanitization)
- **NFR-14:** HTTPS enforced (TLS 1.3)

### 4.4 Scalability
- **NFR-15:** Horizontal scaling via Cloudflare Workers
- **NFR-16:** Database sharding support for multi-tenant growth
- **NFR-17:** CDN for static assets (global edge caching)

### 4.5 Maintainability
- **NFR-18:** Comprehensive API documentation (OpenAPI 3.0)
- **NFR-19:** Automated testing: >80% code coverage
- **NFR-20:** Monitoring with alerts (Cloudflare Analytics + Sentry)

---

## 5. Technical Architecture

### 5.1 Technology Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS with custom Instyle theme
- **Backend:** Cloudflare Workers (serverless)
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **Authentication:** Custom JWT-based auth
- **Payments:** Netcash, Payflex
- **WhatsApp:** AISensy API (wa.aisensy.com/+27699171527)
- **AI:** OpenAI GPT-4 (via API)
- **Deployment:** Cloudflare Pages + Workers
- **Monitoring:** Cloudflare Analytics, Sentry

### 5.2 Database Schema (Key Tables)
```sql
-- Tenants: Multi-tenant isolation
tenants (id, slug, name, hostnames, config, is_active)

-- Services: Catalog management
services (id, tenant_id, name, description, duration_minutes, price, is_active)

-- Appointments: Booking records
appointments (id, user_id, service_id, tenant_id, scheduled_time, status, notes)

-- Users: Customer data
users (id, email, name, tenant_id, role, created_at)

-- Products: E-commerce catalog (future)
products (id, tenant_id, name, description, price, stock, is_active)
```

### 5.3 API Endpoints
| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/tenant?slug=instylehairboutique` | GET | Tenant config + services | Public |
| `/api/public/services` | GET | Service catalog | Public |
| `/api/availability` | POST | Check time slot availability | Public |
| `/api/book` | POST | Create booking | Public |
| `/api/payments/paystack/create` | POST | Initialize payment | Public |
| `/api/agent/instyle` | POST | AI agent webhook | API Key |
| `/api/admin/services` | GET/POST/PUT/DELETE | Manage services | JWT |
| `/api/admin/appointments` | GET/PUT | Manage bookings | JWT |

---

## 6. Migration & Implementation Plan

### Phase 1: Foundation (COMPLETE ✅)
**Status:** Done  
**Deliverables:**
- [x] Database schema created
- [x] Tenant configuration for Instyle
- [x] Service data migrated from SuperSaaS
- [x] DNS configured (instylehairboutique.co.za)
- [x] SSL certificate active
- [x] Crimson branding applied

### Phase 2: Core Booking (CURRENT SPRINT 🟩)
**Status:** In Progress  
**Timeline:** Week 1-2  
**Deliverables:**
- [ ] Complete booking flow (5 steps)
- [ ] WhatsApp confirmation integration
- [ ] Email notifications
- [ ] Dashboard appointment view
- [ ] Service management UI
- [ ] E2E testing (Playwright)

**Acceptance Criteria:**
- Customer can complete booking end-to-end
- Zanele can view/manage appointments in dashboard
- All tests passing (>80% coverage)

### Phase 3: AI Agents (NEXT SPRINT 📝)
**Status:** Planned  
**Timeline:** Week 3-4  
**Deliverables:**
- [ ] Nia AI booking assistant (WhatsApp)
- [ ] Automated reminder system
- [ ] DocsGPT knowledge base
- [ ] Dashboard AI chat interface
- [ ] AI agent monitoring dashboard

**Acceptance Criteria:**
- >90% of booking inquiries handled by Nia
- Reminder delivery rate >95%
- AI response time <60s

### Phase 4: E-Commerce & Payments (SPRINT 4 📝)
**Status:** Planned  
**Timeline:** Week 5-6  
**Deliverables:**
- [ ] Product catalog UI
- [ ] Shopping cart functionality
- [ ] Netcash payment integration
- [ ] Payflex BNPL integration
- [ ] Order management dashboard
- [ ] Inventory tracking

**Acceptance Criteria:**
- Customer can purchase products end-to-end
- Payment success rate >98%
- Order confirmation via WhatsApp

### Phase 5: Advanced AI & Optimization (SPRINT 5 📝)
**Status:** Planned  
**Timeline:** Week 7-8  
**Deliverables:**
- [ ] Blaze marketing agent
- [ ] Orion retention agent
- [ ] Analytics dashboard
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Google Maps integration

**Acceptance Criteria:**
- AI generates 2+ actionable insights per week
- Page load time <2s
- Lighthouse score >95

---

## 7. Data Migration & Validation

### 7.1 SuperSaaS Data Migration
**Status:** Complete ✅  
**Migrated Data:**
- 5 services with pricing and duration
- Historical booking data (validation pending)
- Customer contact information

**Validation:**
- [x] All service names match SuperSaaS
- [x] Pricing accuracy: 100%
- [x] Duration accuracy: 100%
- [ ] Customer data integrity check (pending)

### 7.2 Data Quality Assurance
- **Duplicate Detection:** Automated check for duplicate customers by email/phone
- **Data Sanitization:** Phone numbers normalized to E.164 format
- **POPIA Compliance:** Consent flags added for all migrated customers

---

## 8. Compliance & Legal

### 8.1 POPIA Compliance
- **Consent Management:** Explicit opt-in for WhatsApp communications
- **Data Minimization:** Collect only necessary customer data
- **Right to Access:** Customer data export functionality
- **Right to Deletion:** Account deletion with 30-day grace period
- **Data Retention:** Booking data retained for 7 years (tax compliance)
- **Privacy Policy:** Published at `/privacy`
- **Terms of Service:** Published at `/terms`

### 8.2 WhatsApp Business Policy
- **Template Approval:** All message templates pre-approved by Meta
- **Opt-Out Mechanism:** "Reply STOP to unsubscribe" in all messages
- **24h Response Window:** Human handoff within 24h for unanswered queries

---

## 9. Training & Onboarding

### 9.1 Zanele (Owner) Training
**Duration:** 2 hours  
**Topics:**
1. Dashboard navigation (30min)
2. Managing appointments (30min)
3. Adding/editing services (20min)
4. Viewing analytics (20min)
5. AI agent interaction (20min)

**Deliverables:**
- Video tutorial library
- Quick reference guide (PDF)
- 1-month post-launch support

### 9.2 Staff Training
**Duration:** 1 hour  
**Topics:**
1. Viewing daily appointments
2. Confirming/cancelling bookings
3. Customer communication best practices

---

## 10. Success Metrics & KPIs

### 10.1 Technical KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.9% | Cloudflare Analytics |
| API Response Time | <200ms (p95) | Cloudflare Workers Analytics |
| Error Rate | <0.1% | Sentry |
| Page Load Time | <2.5s | Lighthouse CI |

### 10.2 Business KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking Conversion Rate | >15% | Google Analytics |
| AI Inquiry Resolution | >90% | AISensy Analytics |
| No-Show Rate | <10% | Dashboard Analytics |
| Customer Satisfaction | >4.5/5 | Post-booking survey |
| Monthly Revenue Growth | +20% | Dashboard Analytics |

### 10.3 User Experience KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking Completion Time | <3min | Analytics funnel |
| Mobile Bounce Rate | <40% | Google Analytics |
| Repeat Customer Rate | >60% | Database query |

---

## 11. Risk Management

### 11.1 Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cloudflare outage | High | Low | Multi-region failover, status page |
| Database corruption | High | Low | Daily backups, point-in-time recovery |
| Payment gateway failure | High | Medium | Fallback to manual payment, error handling |
| AI API rate limits | Medium | Medium | Request queuing, caching, fallback responses |

### 11.2 Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low customer adoption | High | Medium | Marketing campaign, staff training, incentives |
| AI accuracy issues | Medium | Medium | Human-in-the-loop, continuous training |
| POPIA non-compliance | High | Low | Legal review, compliance audit |

---

## 12. Support & Maintenance

### 12.1 Support Tiers
- **Tier 1 (Self-Service):** FAQ, video tutorials, knowledge base
- **Tier 2 (WhatsApp Support):** Response within 4 business hours
- **Tier 3 (Technical Support):** Email support for critical issues (response within 2 hours)

### 12.2 Maintenance Windows
- **Scheduled:** Sundays 02:00-04:00 SAST (low traffic)
- **Emergency:** As needed with 15min notification

### 12.3 SLA Commitments
- **Uptime:** 99.9% (excluding scheduled maintenance)
- **Support Response:** <4h for non-critical, <2h for critical
- **Bug Fixes:** Critical within 24h, non-critical within 1 week

---

## 13. Future Enhancements (Roadmap)

### Q1 2025
- Instagram feed integration
- Google Calendar sync
- SMS notifications (fallback for non-WhatsApp users)
- Loyalty program (points system)

### Q2 2025
- Mobile app (PWA to native)
- Multi-language support (English, Afrikaans, Zulu)
- Advanced analytics (predictive booking trends)
- Employee scheduling module

### Q3 2025
- Marketplace integration (Takealot, Superbalist)
- Subscription services (monthly hair care packages)
- Video consultation booking
- Referral program automation

---

## 14. Appendices

### Appendix A: Glossary
- **POPIA:** Protection of Personal Information Act (South African data protection law)
- **SuperSaaS:** Previous booking system being replaced
- **AISensy:** WhatsApp Business API provider
- **D1:** Cloudflare's serverless SQL database
- **Netcash:** South African payment gateway
- **Payflex:** Buy Now Pay Later service

### Appendix B: References
- POPIA Compliance Guide: https://popia.co.za
- WhatsApp Business Policy: https://business.whatsapp.com/policy
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers

### Appendix C: Change Log
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-05-21 | Initial PRD | Product Team |
| 2.0 | 2024-12-01 | Comprehensive revision with best practices, technical architecture, compliance, and detailed requirements | Product Team |

---

**Document Approval:**

- [ ] Product Owner: _________________ Date: _______
- [ ] Technical Lead: _________________ Date: _______
- [ ] Client (Zanele): _________________ Date: _______

**Next Review Date:** 2025-01-01
