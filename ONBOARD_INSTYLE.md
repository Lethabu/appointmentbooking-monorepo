# Onboard InStyle Data — Plan

This document lists the recommended steps, checks, and commands to import InStyle (SuperSaaS / CSV) data into the project's D1 database and validate the dashboard.

Summary
- Prepare local/remote D1 environment and run migrations in a dry-run mode.
- Validate schema and sample the `appointments` and `dashboard_bookings_2024_plus` tables.
- Run the import scripts (CSV or Supersaas sync) into a staging DB.
- Run integration tests and visually validate the dashboard.

Preconditions & Safety
- Always run first against a local D1 or staging DB. Do not run remote migrations without a backup.
- Ensure `wrangler` is configured with correct credentials for the target account if deploying or running remote D1 commands.

Key files and scripts
- SQL migrations: `scripts/migrations/*.sql` — add new migration files here.
- Import helpers: `instyle-csv-integration.js`, `latest-csv-integrator.js`, `add_stylists.js` — inspect prior to running.
- Remote migration helper (existing): `package.json` script `migrate-db` runs `wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/006-sync-supersaas.sql`

Step-by-step (Local dry-run)
1. Install dependencies (if not already):
   ```powershell
   pnpm install
   ```

2. Run migrations locally against a D1 instance (local binding):
   ```powershell
   npx wrangler d1 execute appointmentbooking-db --local --file=scripts/migrations/024-create-dashboard-bookings-2024.sql
   ```

3. Validate tables exist and sample rows:
   - Use `wrangler d1 execute` queries or a lightweight script to `SELECT * FROM appointments LIMIT 5`.

Import steps (staging)
1. Prepare CSV or Supersaas export files. Confirm column mapping matches import helpers.
2. Run the CSV import script pointing to staging DB (inspect script flags):
   ```powershell
   node scripts/instyle-csv-integration.js --file=instyle-bookings.csv --dry-run
   ```
3. Review dry-run output for row mappings, invalid rows, and duplicates.
4. If okay, run non-dry import against staging database.

Promote to production (with caution)
1. Backup current production DB (if possible).
2. Run migrations remotely (one migration file at a time). Example:
   ```powershell
   npx wrangler d1 execute appointmentbooking-db --remote --file=scripts/migrations/024-create-dashboard-bookings-2024.sql
   ```
3. Run the import on remote DB (use `--remote` flags or scripts that accept connection targets).

Validation
- After import, run the integration tests:
  ```powershell
  pnpm -w run test:integration
  pnpm -w run test:accessibility
  ```
- Manually open the dashboard (`/dashboard`) and verify charts, recent appointments and counts.

Rollback
- If something goes wrong, restore from the backup or run corrective SQL migrations.

Notes and recommendations
- Use small batches, validate mapping, and keep `created_at`/`updated_at` integer unix timestamps consistent with existing records.
- Prefer `CREATE TABLE IF NOT EXISTS` style migrations to make dev re-runs idempotent.
- Consider adding a dedicated `import_sessions` table to track import runs and results (success/fail counts) for auditability.

If you want I can:
- Run a dry-run import locally and report the results.
- Execute the remote migration and import (I will ask for confirmation before destructive actions).
