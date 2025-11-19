## Unschooling React – Personalized Learning Platform

A React + Python (FastAPI) system that generates **personalized learning plans** and tracks **real-world child activity data** for the unschooling platform.

This file is intentionally short and acts as the **entry point** to the rest of the documentation.

---

## What this project does

- **Generates personalized learning plans** (Hybrid Monthly & Holistic Fusion) using AI agents.
- **Tracks child activities and progress** across domains (cognitive, creativity, social-emotional, real-world skills).
- **Provides admin & analytics dashboards** for monitoring plans, activities, and real usage.
- **Connects to external services** like Firebase, Google Sheets, and Google Cloud / Vertex AI.

For the full technical overview (APIs, env vars, deployment, examples), see  
👉 [docs/DETAILED_README.md](docs/DETAILED_README.md)

---

## High-level structure

- **Backend** – `backend/`  
  Python FastAPI + agents that generate plans, manage data, and sync with external services.  
  See: `backend/WEEKLY_PLAN_DATA_FORMAT.md`, `backend/HOLISTIC_SIMPLIFICATION_STATUS.md`

- **Frontend** – `src/`  
  React app with pages, dashboards, and flows for parents, admins, and internal tools.  
  See: `docs/` (multiple flow and implementation docs), plus `src/data/README.md`.

- **Data & backups**  
  - Core JSON data: `backend/data/`, `src/data/`  
  - Backups & archives: `backups/`, `backup/`, `data_backups/`  
  - Additional external backups: `~/Documents/backups/`

For a deeper breakdown of flows and architecture, see:  
👉 `docs/PLAN_GENERATION_FLOWCHART.md`  
👉 `docs/CURRENT_FLOW_STATUS.md` (if present)  
👉 `docs/QUICK_DIAGNOSTIC_GUIDE.md`

---

## Getting started (local development)

1. **Install dependencies**
   - Backend: create a venv inside `backend/` and install from `backend/requirements.txt`
   - Frontend: run `npm install` from the project root

2. **Configure environment**
   - Copy `env.example` → `env.local` (or `.env`) and fill in Firebase + Google Cloud configs.

3. **Run locally**
   - Backend: start the FastAPI app in `backend/` (see `docs/DETAILED_README.md` for exact commands).
   - Frontend: `npm start` and open `http://localhost:3000`.

---

## Development planning

All forward-looking work for this project lives in the **planning docs**.

- **Master startup blueprint** (vision, offer, pricing model, non‑negotiables):  
  👉 [docs/planning/MASTER_STARTUP_BLUEPRINT.md](docs/planning/MASTER_STARTUP_BLUEPRINT.md)

- **Execution plan (now → Feb 2026)**:  
  👉 [docs/planning/EXECUTION_PLAN.md](docs/planning/EXECUTION_PLAN.md)  
  (Includes finishing November 2025 tasks and the Dec–Feb roadmap in one place.)

When you update priorities, edit the files in `docs/planning/` and keep this section as a short summary + links.

---

## Where to go next

- **Detailed setup & API docs**: [docs/DETAILED_README.md](docs/DETAILED_README.md)
- **Plan formats & learning model**: `backend/WEEKLY_PLAN_DATA_FORMAT.md`, `backend/data/README.md`
- **Operations & monitoring**: `REALTIME_MONITORING_GUIDE.md`, `QUICK_DIAGNOSTIC_GUIDE.md`
- **Deployment & staging**: `DEPLOY_TO_STAGING.md`, `STAGING_READY.md`, `READY_TO_LAUNCH.md`

Use this `README.md` as the **map**, and follow the linked files for deep details.

