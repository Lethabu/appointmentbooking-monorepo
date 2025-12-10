# Implementation Plan

## Phase 1: Cleanup & Configuration (Immediate)
**Objective**: Remove problematic dependencies and prepare for development.

1.  **Remove Vercel Dependencies**:
    - Uninstall `@vercel/analytics` from root and apps.
    - Remove any `vercel.json` or Vercel-specific code in `next.config.js`.
2.  **Dependency Audit**:
    - Run `pnpm install` to ensure consistency.
    - Check for outdated critical packages.

## Phase 2: Validation & Testing (High Priority)
**Objective**: Establish a safety net before major refactoring.

1.  **Setup Playwright**:
    - Initialize Playwright in `apps/booking` (or root if shared).
    - Create `playwright.config.ts` if missing.
2.  **Create E2E Tests**:
    - **Test 1**: Tenant Landing (Visit a tenant page).
    - **Test 2**: Booking Flow (Select service -> Select time -> Book).
    - **Test 3**: Admin Login (Verify auth).
3.  **Run Existing Tests**:
    - Execute `npm run test` and `npm run lint` to identify current baseline.

## Phase 3: Refinement & Fixes
**Objective**: Address "freshly imported" issues and optimize.

1.  **Linting & Formatting**:
    - Run `turbo run lint` and fix reported issues.
    - Ensure `prettier` is applied consistent.
2.  **Environment Setup**:
    - Verify `.env` templates are available.
    - Document required env vars for D1 and NextAuth.

## Phase 4: Documentation & Handover
**Objective**: Prepare for future developers.

1.  **Update Documentation**:
    - Refresh `README.md` with current setup instructions.
    - Create `docs/DEVELOPMENT.md` for workflow guide.
2.  **Browser Walkthrough**:
    - Record a session of the fixed app performing a booking.

## Approval Request
Please approve proceeding with **Phase 1 (Cleanup)** and **Phase 2 (Validation)**.
