# Copilot Instructions — appointmentbooking-monorepo

Short goal: help an AI engineer be productive quickly in this monorepo. Focus on the runtime boundaries, data flows, and local dev commands used by humans here.

- Architecture overview:
  - This is a PNPM monorepo (see `pnpm-workspace.yaml` and root `package.json`). Primary apps live under `apps/booking` (Next.js shop + public booking UI) and `apps/dashboard` (Next.js admin). The backend is a Cloudflare Worker under `packages/worker` and uses Cloudflare D1 for the SQL database.
  - Database migrations live under `scripts/migrations/*.sql`. New tables should be added as a new migration file with an increasing numeric prefix (e.g. `004-...sql`). The Worker executes raw SQL with `env.DB.prepare(...).run()`.

- Important files to inspect when changing behavior:
  - `packages/worker/src/index.ts` — the Cloudflare Worker entry. Routes are handled by path checks (e.g. `if (path === '/api/products')`) and use `env.DB.prepare(...).run()` for D1 operations. Add API routes here for small, public endpoints.
  - `scripts/migrations/` — SQL migration files applied manually via `npx wrangler d1 execute` during local testing or CI.
  - `apps/booking/app/shop/page.tsx` — the client-side shop UI. Filtering and client-only features (wishlist via localStorage) are implemented here.
  - `apps/dashboard/src/app` — admin UI. New pages are located under `src/app` as Next.js app-router pages (e.g. `schedules/page.tsx`).

- Developer workflows & commands (use PowerShell on Windows):
  - Install deps: `pnpm install`
  - Local build: `pnpm run build` (monorepo build). Use `pnpm -w run build` if running workspace scripts.
  - Run migrations locally: `npx wrangler d1 execute <DB_NAME> --local --file=scripts/migrations/004-create-staff-schedules.sql`
  - Deploy Worker: `npx wrangler deploy` (ensure Cloudflare credentials configured).
  - The repo uses `turbo`/`turbo.json` caching — check `turbo.json` if CI caching or incremental build issues appear.

- Patterns and conventions to follow in this repo:
  - API routes in the Worker are implemented with explicit path checks and small handlers, not an express-like router. Use the existing `handleApiRoute` pattern and share `corsHeaders` and `env.DB` conventions.
  - SQL migrations are plain `.sql` files in `scripts/migrations`. Prefer `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` to make local re-runs idempotent in dev.
  - Timestamps are stored as integers (unix seconds) in several tables — check existing migrations for naming patterns (`created_at`, `updated_at`) and set defaults consistently.
  - Frontend pages in `apps/*/app` use Tailwind and client components for interactive features. Keep visual style consistent with existing components (rounded cards, `bg-white`, `text-primary`).

- Integration points and expectations:
  - The Worker exposes `/api/*` endpoints consumed by both Next apps and public pages — change Worker APIs carefully and update client fetch URLs (many pages call absolute hostnames; prefer relative `/api/...` when running co-located deployments).
  - Database access uses Cloudflare D1 SDK via `env.DB.prepare(...).run()/.all()/.first()`. Batch inserts are implemented as repeated `.run()` calls in code — keep transactions idempotent.

- Small examples you can copy:
  - Add a migration: `scripts/migrations/004-create-staff-schedules.sql` (follow naming pattern)
  - Add a Worker route: in `packages/worker/src/index.ts` add a `if (path.startsWith('/api/tenant/') && path.endsWith('/schedules') && request.method === 'POST') { ... }` handler and use `env.DB.prepare(...).run()` to insert rows.
  - Frontend wishlist: store an array of product IDs in `localStorage` under `instyle_wishlist` and toggle via `localStorage.setItem('instyle_wishlist', JSON.stringify(...))`.

- What NOT to change without confirmation:
  - Global build configuration (`turbo.json`, `pnpm-workspace.yaml`) and Cloudflare account config — these affect CI and deploys.
  - Database primary keys and tenant-related constraints — changing schema may break existing tenants.

If anything above is unclear, tell me which area to expand (Worker routes, migration conventions, or frontend patterns) and I will iterate. 
