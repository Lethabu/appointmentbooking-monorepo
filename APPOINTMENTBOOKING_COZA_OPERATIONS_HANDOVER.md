# OPERATIONS HANDOVER DOCUMENTATION

**APPOINTMENTBOOKING.CO.ZA SAAS PLATFORM**

**Date:** 2026-01-05
**Version:** 1.0.0
**Target Audience:** DevOps Team, Site Reliability Engineers (SRE), Support Staff

---

## 1. SYSTEM OVERVIEW

### Architecture Summary

* **Frontend:** Next.js 14 (React) deployed on Cloudflare Pages / Vercel.
* **Backend:** Next.js API Routes (Serverless) / Cloudflare Workers.
* **Database:** Supabase (PostgreSQL) with Cloudflare D1 (Edge).
* **Caching:** Redis (Session/Data) and Cloudflare CDN (Assets).
* **Auth:** Custom Enterprise Auth with RBAC (JWT/Session).
* **Containerization:** Docker (Production & Dev environments).
* **Orchestration:** Docker Compose (local/VM) / Kubernetes ready.

### Key Directories

* `apps/booking`: Main SaaS Application
* `packages/`: Shared libraries (ui, auth, db, payments, ai)
* `scripts/`: Automation and maintenance scripts
* `infrastructure/`: IaC and configuration files
* `monitoring/`: Prometheus/Grafana configs

---

## 2. OPERATIONAL PROCEDURES (RUNBOOKS)

### A. Deployment

**Standard Production Deployment:**

1. Ensure local environment is clean: `npm run clean`
2. Run tests: `npm run test:all`
3. Trigger deployment script:

    ```bash
    ./scripts/deploy-production.sh
    ```

4. Monitor output for "DEPLOYMENT SUCCESSFUL" message.

**Manual Deployment (Emergency):**

* **Cloudflare Workers:** `npm run deploy:worker` (in `apps/booking`)
* **Cloudflare Pages:** `npm run deploy:pages` (in `apps/booking`)
* **Docker:** `docker-compose -f docker-compose.prod.yml up -d --build`

### B. Monitoring & Alerting

* **Dashboard URL:** `https://monitor.appointmentbooking.co.za` (Grafana)
* **Key Metrics:**
  * `http_request_duration_seconds`: Latency (Target: <500ms p95)
  * `http_requests_total`: Traffic volume
  * `app_errors_total`: Error rate (Target: <0.1%)
  * `db_connection_pool`: Database health

* **Alert Severity Levels:**
  * **P1 (Critical):** Service Down, Data Corruption, Security Breach. -> **Call On-Call immediately.**
  * **P2 (High):** High Latency (>2s), elevated error rates (>1%). -> **Investigate within 1 hour.**
  * **P3 (Medium):** Warning thresholds reached. -> **Review next business day.**

### C. Incident Response

**Scenario 1: High Error Rate**

1. Check logs: `npm run logs:prod` or via Cloudflare Dashboard.
2. Identify causing component (DB, API, Frontend).
3. If DB: Check connection pool and slow queries.
4. If Code: Revert to last stable commit using `scripts/production-rollback.sh`.

**Scenario 2: Database Unresponsive**

1. Check Supabase dashboard status.
2. Run `scripts/disaster-recovery.sh --check-db`.
3. If failover needed, execute `scripts/disaster-recovery.sh --failover`.

### D. Maintenance Tasks

* **Database Backups:** Automated daily at 02:00 UTC.
  * Manual trigger: `./scripts/backup-db.sh`
* **Log Rotation:** Automated weekly.
* **SSL Renewal:** Automated via Let's Encrypt / Cloudflare Managed.
* **Security Audit:** Run monthly: `npm run audit:security`

---

## 3. CONFIGURATION MANAGEMENT

### Environment Variables

Managed via `.env.production` (Server) and Cloudflare Secrets.

* **Critical Secrets:**
  * `DATABASE_URL`: Connection string (Supabase)
  * `NEXTAUTH_SECRET`: Session encryption key
  * `STRIPE_SECRET_KEY`: Payment gateway key
  * `OPENAI_API_KEY`: AI service key

**WARNING:** Never commit `.env` files to version control. Use `env.example` for templates.

### Feature Flags

Located in `apps/booking/config/features.ts` or via Environment Variables.

* `ENABLE_AI_FEATURES`: Toggle AI functionality.
* `ENABLE_BETA_PAYMENTS`: Toggle new payment methods.
* `MAINTENANCE_MODE`: Enable system-wide maintenance page.

---

## 4. TROUBLESHOOTING GUIDE

| Symptom | Probable Cause | Diagnostic Command | Remediation |
| :--- | :--- | :--- | :--- |
| **502 Bad Gateway** | Nginx/App Crash | `docker logs appointmentbooking` | Restart container: `docker restart appointmentbooking` |
| **504 Gateway Timeout** | DB Slow/Locked | Check DB CPU/Memory | Kill long queries, optimize indices. |
| **Login Fails** | Auth Service/Token | Check `NEXTAUTH_URL` & Secret | Verify env vars, check cookie settings. |
| **High Latency** | Network/Cold Start | Check Cloudflare/Vercel logs | Warm up cache, check region performance. |
| **Build Fails** | TS/Lint Errors | `npm run build` locally | Fix code errors, clean cache. |

---

## 5. CONTACTS & ESCALATION

* **DevOps Lead:** <devops@appointmentbooking.co.za>
* **Security Officer:** <security@appointmentbooking.co.za>
* **Support Desk:** <support@appointmentbooking.co.za>
* **Emergency Phone:** +27 555 0123

---

## 6. HANDOVER ACCEPTANCE

**Handover Date:** 2026-01-05
**Accepted By:** Operations Team
**Status:** **OPERATIONAL**

---
*Prepared by DevOps Infrastructure Automation System*
