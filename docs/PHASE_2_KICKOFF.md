# Phase 2 Kickoff: Core Booking Implementation

**Sprint:** Phase 2 - Core Booking  
**Timeline:** Week 1-2 (2024-12-02 to 2024-12-15)  
**Status:** 🟩 READY TO START  
**Team:** Development Team

---

## 🎯 Sprint Goals

### Primary Objectives
1. ✅ Complete 5-step booking flow (end-to-end)
2. ✅ Build dashboard appointment view with real-time updates
3. ✅ Implement E2E tests with >80% coverage
4. ✅ Achieve Lighthouse performance score >90

### Success Criteria
- [ ] Customer can complete booking from service selection to confirmation
- [ ] Zanele can view and manage appointments in dashboard
- [ ] All E2E tests passing (>80% coverage)
- [ ] Page load time <2.5s
- [ ] Zero critical bugs

---

## 📋 Sprint Backlog

### Week 1: Booking Flow (Days 1-7)

#### Day 1-2: Multi-Step Booking Wizard
**Priority:** 🔴 CRITICAL

**Tasks:**
- [ ] Create booking wizard component structure
  - [ ] Step 1: Service Selection (single/multiple)
  - [ ] Step 2: Date/Time Picker
  - [ ] Step 3: Customer Details Form
  - [ ] Step 4: Payment Summary
  - [ ] Step 5: Confirmation
- [ ] Implement wizard state management (React Context or Zustand)
- [ ] Add progress indicator (1/5, 2/5, etc.)
- [ ] Implement navigation (Next, Back, Skip)

**Files to Create:**
```
apps/booking/components/booking/
├── BookingWizard.tsx
├── Step1ServiceSelection.tsx
├── Step2DateTime.tsx
├── Step3CustomerDetails.tsx
├── Step4PaymentSummary.tsx
├── Step5Confirmation.tsx
└── BookingContext.tsx
```

**Acceptance Criteria:**
- [ ] User can navigate between all 5 steps
- [ ] State persists when going back/forward
- [ ] Progress indicator shows current step
- [ ] Mobile-responsive design

---

#### Day 3-4: Service Selection & Availability
**Priority:** 🔴 CRITICAL

**Tasks:**
- [ ] Implement service selection UI
  - [ ] Display all services from API
  - [ ] Multi-service selection with checkboxes
  - [ ] Running total calculation (price + duration)
  - [ ] Service images (static mapping)
- [ ] Implement date/time picker
  - [ ] Calendar component (min: today)
  - [ ] Business hours enforcement
  - [ ] Real-time availability checking
  - [ ] Time slot display (30min intervals)

**API Integration:**
```typescript
// Fetch services
GET /api/public/services?tenantId={tenantId}

// Check availability
POST /api/availability
{
  "tenantId": "...",
  "serviceId": "...",
  "date": "2024-12-15"
}
```

**Acceptance Criteria:**
- [ ] All 5 services display correctly
- [ ] Multi-service selection works
- [ ] Running total updates in real-time
- [ ] Only available time slots shown
- [ ] Business hours enforced (Mon-Fri 09:00-17:00, Sat 08:00-16:00)

---

#### Day 5: Customer Details & Validation
**Priority:** 🔴 CRITICAL

**Tasks:**
- [ ] Create customer details form
  - [ ] Name input (required)
  - [ ] Email input (required, validated)
  - [ ] Phone input (required, E.164 format)
  - [ ] Notes textarea (optional)
- [ ] Implement form validation
  - [ ] Real-time validation
  - [ ] Error messages
  - [ ] Prevent submission if invalid
- [ ] Add form accessibility
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Screen reader support

**Validation Rules:**
```typescript
{
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: true, pattern: /^\+?[1-9]\d{1,14}$/ },
  notes: { maxLength: 500 }
}
```

**Acceptance Criteria:**
- [ ] All fields validate correctly
- [ ] Error messages display clearly
- [ ] Form is accessible (WCAG 2.1 AA)
- [ ] Mobile keyboard types correct (email, tel)

---

#### Day 6-7: Payment Summary & Submission
**Priority:** 🔴 CRITICAL

**Tasks:**
- [ ] Create payment summary component
  - [ ] Display selected services
  - [ ] Show total price
  - [ ] Calculate booking fee (20%, min R50)
  - [ ] Explain payment structure
- [ ] Implement booking submission
  - [ ] Call `/api/book` endpoint
  - [ ] Handle loading state
  - [ ] Handle errors gracefully
  - [ ] Show success confirmation
- [ ] Add WhatsApp confirmation
  - [ ] Generate WhatsApp link
  - [ ] Pre-fill message with booking details
  - [ ] Open in new tab

**Booking Fee Calculation:**
```typescript
const bookingFee = Math.max(totalPrice * 0.2, 5000); // 20% or R50 min
const remainingBalance = totalPrice - bookingFee;
```

**Acceptance Criteria:**
- [ ] Payment summary displays correctly
- [ ] Booking fee calculated accurately
- [ ] Booking submission works end-to-end
- [ ] WhatsApp link opens with correct message
- [ ] Error handling works (network, validation)

---

### Week 2: Dashboard & Testing (Days 8-14)

#### Day 8-9: Dashboard Appointment View
**Priority:** 🟡 HIGH

**Tasks:**
- [ ] Create dashboard layout
  - [ ] Sidebar navigation
  - [ ] Header with user info
  - [ ] Main content area
- [ ] Build appointment list component
  - [ ] Fetch appointments from API
  - [ ] Display in table/card view
  - [ ] Auto-refresh every 30s
  - [ ] Filter by date/status
- [ ] Add quick actions
  - [ ] Confirm appointment
  - [ ] Cancel appointment
  - [ ] View details modal

**API Integration:**
```typescript
// Fetch appointments
GET /api/admin/appointments?date=2024-12-15&status=confirmed

// Update appointment
PATCH /api/bookings/{id}/status
{
  "status": "confirmed|cancelled|completed"
}
```

**Acceptance Criteria:**
- [ ] Appointments display in real-time
- [ ] Auto-refresh works (30s interval)
- [ ] Filters work (date, status)
- [ ] Quick actions functional
- [ ] Mobile-responsive

---

#### Day 10: Service Management UI
**Priority:** 🟡 HIGH

**Tasks:**
- [ ] Create service management page
  - [ ] List all services
  - [ ] Add new service form
  - [ ] Edit service modal
  - [ ] Delete confirmation
- [ ] Implement CRUD operations
  - [ ] Create service
  - [ ] Update service
  - [ ] Delete service (soft delete)
  - [ ] Upload service image

**API Integration:**
```typescript
// Create service
POST /api/admin/services
{
  "name": "New Service",
  "description": "...",
  "price": 45000,
  "durationMinutes": 90
}

// Update service
PUT /api/admin/services/{id}

// Delete service
DELETE /api/admin/services/{id}
```

**Acceptance Criteria:**
- [ ] Can add new service
- [ ] Can edit existing service
- [ ] Can delete service (soft delete)
- [ ] Form validation works
- [ ] Changes reflect immediately

---

#### Day 11-12: E2E Testing
**Priority:** 🔴 CRITICAL

**Tasks:**
- [ ] Set up Playwright test suite
- [ ] Write booking flow tests
  - [ ] Test service selection
  - [ ] Test date/time picker
  - [ ] Test form validation
  - [ ] Test complete booking flow
- [ ] Write dashboard tests
  - [ ] Test appointment list
  - [ ] Test filters
  - [ ] Test quick actions
- [ ] Write service management tests
  - [ ] Test CRUD operations
- [ ] Achieve >80% coverage

**Test Files:**
```
apps/booking/e2e/
├── booking-flow.spec.ts
├── dashboard-appointments.spec.ts
├── service-management.spec.ts
└── mobile-responsive.spec.ts
```

**Acceptance Criteria:**
- [ ] All critical user flows tested
- [ ] Tests pass consistently
- [ ] >80% code coverage
- [ ] Mobile tests included

---

#### Day 13: Performance Optimization
**Priority:** 🟡 HIGH

**Tasks:**
- [ ] Run Lighthouse audit
- [ ] Optimize images
  - [ ] Convert to WebP
  - [ ] Add lazy loading
  - [ ] Implement responsive images
- [ ] Optimize JavaScript
  - [ ] Code splitting
  - [ ] Tree shaking
  - [ ] Minimize bundle size
- [ ] Optimize CSS
  - [ ] Remove unused styles
  - [ ] Minimize CSS
- [ ] Add caching headers

**Performance Targets:**
- [ ] Lighthouse Performance: >90
- [ ] First Contentful Paint: <1.8s
- [ ] Largest Contentful Paint: <2.5s
- [ ] Time to Interactive: <3.8s
- [ ] Cumulative Layout Shift: <0.1

---

#### Day 14: Bug Fixes & Polish
**Priority:** 🟢 MEDIUM

**Tasks:**
- [ ] Fix all critical bugs
- [ ] Fix all high-priority bugs
- [ ] Polish UI/UX
  - [ ] Smooth transitions
  - [ ] Loading states
  - [ ] Error states
  - [ ] Empty states
- [ ] Update documentation
- [ ] Prepare demo for stakeholders

---

## 🛠️ Technical Setup

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_TENANT_ID=ccb12b4d-ade6-467d-a614-7c9d198ddc70
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

### Development Commands
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run E2E tests
pnpm test:e2e

# Run Lighthouse audit
pnpm lhci autorun

# Build for production
pnpm build
```

---

## 📊 Daily Standup Template

### What I did yesterday:
- [ ] Task 1
- [ ] Task 2

### What I'm doing today:
- [ ] Task 1
- [ ] Task 2

### Blockers:
- [ ] None / List blockers

---

## 🚨 Known Blockers

### Critical Blockers (Must Resolve)
1. **Paystack API Keys**
   - Status: ⏸️ Waiting for client
   - Impact: Cannot test payment flow
   - Workaround: Mock payment for now

2. **Social Media URLs**
   - Status: ⏸️ Waiting for client
   - Impact: Footer links point to #
   - Workaround: Use placeholder URLs

### Non-Critical Blockers
1. **Google Maps Location**
   - Status: ⏸️ Waiting for client
   - Impact: Cannot embed map
   - Workaround: Skip for Phase 2

---

## 📈 Progress Tracking

### Completion Checklist

**Week 1: Booking Flow**
- [ ] Day 1-2: Multi-Step Wizard (0%)
- [ ] Day 3-4: Service Selection & Availability (0%)
- [ ] Day 5: Customer Details & Validation (0%)
- [ ] Day 6-7: Payment Summary & Submission (0%)

**Week 2: Dashboard & Testing**
- [ ] Day 8-9: Dashboard Appointment View (0%)
- [ ] Day 10: Service Management UI (0%)
- [ ] Day 11-12: E2E Testing (0%)
- [ ] Day 13: Performance Optimization (0%)
- [ ] Day 14: Bug Fixes & Polish (0%)

**Overall Progress: 0%**

---

## 🎯 Definition of Done

A task is considered "done" when:
- [ ] Code is written and tested
- [ ] E2E tests pass
- [ ] Code is reviewed (if team >1)
- [ ] Documentation is updated
- [ ] No critical bugs
- [ ] Acceptance criteria met
- [ ] Deployed to staging (if applicable)

---

## 📞 Communication

### Daily Standup
- **Time:** 09:00 SAST
- **Duration:** 15 minutes
- **Format:** Async (update this document)

### Sprint Review
- **Date:** 2024-12-15
- **Time:** 15:00 SAST
- **Attendees:** Product team, technical lead, client (Zanele)
- **Format:** Live demo + Q&A

### Retrospective
- **Date:** 2024-12-15
- **Time:** 16:00 SAST
- **Format:** What went well, what didn't, action items

---

## 🔗 Resources

### Documentation
- [PRD v2.0](./INSTYLE_PRD_V2.md)
- [Implementation Checklist](./INSTYLE_IMPLEMENTATION_CHECKLIST.md)
- [API Specification](./API_SPECIFICATION.md)

### Design
- [Figma Mockups](#) (if available)
- [Branding Guidelines](../INSTYLE_PLATFORM_GUIDE.md#branding)

### Development
- [Next.js Docs](https://nextjs.org/docs)
- [Playwright Docs](https://playwright.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎉 Sprint Success Criteria

### Must Have (Critical)
- [x] Complete booking flow works end-to-end
- [x] Dashboard shows appointments in real-time
- [x] E2E tests pass with >80% coverage
- [x] No critical bugs

### Should Have (High Priority)
- [ ] Service management UI functional
- [ ] Lighthouse score >90
- [ ] Mobile-responsive on all pages

### Could Have (Nice to Have)
- [ ] Smooth animations and transitions
- [ ] Comprehensive error handling
- [ ] Loading skeletons

---

**Sprint Owner:** Development Team  
**Last Updated:** 2024-12-01 22:53 SAST  
**Next Update:** Daily standup
