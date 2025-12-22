# Legacy Repository Audit Report

Date: 2025-12-14
Status: In Progress

## Executive Summary

Deep analysis of `temp-old-repo` to identify high-value assets for migration to the new monorepo structure.

## 1. Components & UI Library

*Status: In Progress*

- `BookingWidget.tsx`: Full booking flow state machine (client-side reducer). Good candidate for reference but new app uses server actions.
- `AgentChatPage.tsx`: AI Chat interface. Valuable for "Nia" implementation.
- `RealtimeDashboard.tsx`: Dashboard with stats.

## 2. Business Logic & Services

*Status: In Progress*

- `sync-instyle-data.cjs`: Critical seeding script. **Action**: Port to `@repo/db` seeds.
- `migrate-products.js`: Product migration logic.

## 3. Database & Schemas

*Status: In Progress*

- `schema.sql`: Comprehensive Postgres schema.
  - **Tables**: `profiles`, `services`, `staff`, `staff_availability`, `appointments`, `chat_logs`, `notifications`, `tenants`.
  - **Policies**: RLS is fully defined.
  - **Gap**: `@repo/db` needs `chat_logs` and `notifications` tables porting.

## 4. Configuration & Utilities

*Status: In Progress*

- `app/api/payments`: Contains `netcash` and `payflex` implementations.
  - **Action**: These gateways are missing from `@repo/payments`. Prioritize porting if needed.

## 5. Assets (Images/Icons)

*Status: Pending*

## Recommendations

- [ ] List items to migrate
