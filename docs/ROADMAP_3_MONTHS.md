## 3-Month Development Roadmap

This roadmap is intentionally high-level. Treat it as a **guide**, not a rigid contract.

You can update dates and priorities as the product evolves.

---

## Month 1 – Stability & Observability

- **Hardening**
  - Close any remaining critical bugs in plan generation and activity tracking.
  - Add defensive checks around edge cases in `backend/agents/` and `backend/utils/`.
- **Monitoring**
  - Make sure real-time logs and diagnostics are easy to read (`REALTIME_MONITORING_GUIDE.md`, `QUICK_DIAGNOSTIC_GUIDE.md`).
  - Add basic metrics/health checks for core APIs (plan generation, activity logging).
- **Developer ergonomics**
  - Refresh `docs/DETAILED_README.md` if any setup instructions have drifted.
  - Ensure `npm start` + backend startup is reliable on a fresh machine.

---

## Month 2 – UX & Learning Model Refinement

- **Parent & child experience**
  - Smooth the main flows in `src/pages/Main/` and key dashboards (loading states, error messages, navigation).
  - Review copy and wording to better match real parent language.
- **Plan quality**
  - Use real usage data (`backend/data/real_usage_data.json`, `child_activity_logs.json`) to refine Hybrid vs Holistic plan rules.
  - Document any updated rules in `backend/WEEKLY_PLAN_DATA_FORMAT.md`.
- **Performance & responsiveness**
  - Audit slow screens; optimize data loading and re-renders in `src/components/` and `src/services/`.

---

## Month 3 – Automation, Scale & Cleanup

- **Automation**
  - Improve Google Sheets / external sync flows (`google_sheets_sync.py`, `sync_*` scripts).
  - Add simple scripts or documentation for common maintenance tasks (backup, restore, data refresh).
- **Scale & resilience**
  - Review rate limits, timeouts, and retry logic for external services (Firebase, Vertex AI).
  - Ensure staging/stable deployment paths in `DEPLOY_TO_STAGING.md` and related scripts are up to date.
- **Codebase cleanup**
  - Prune obsolete backups/archives that are no longer needed (after confirming you have safe copies in `~/Documents/backups/`).
  - Simplify any duplicated logic between `src/data/` and `backend/data/` where possible.

---

## How to keep this roadmap useful

- Revisit this file **monthly** and mark items as done / moved / dropped.
- Keep the root `README.md` short; put detailed planning here or in additional docs as needed.


