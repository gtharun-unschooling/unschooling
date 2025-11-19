# 🧹 Root Directory Cleanup Plan

## ❌ **PROBLEM IDENTIFIED**

**Too many files in root directory!** Many backend files are incorrectly placed in the root instead of the `backend/` folder.

---

## 📋 **FILES TO MOVE TO `backend/`**

### **Python Files:**
- `main_agents.py` → `backend/`
- `main_agents_backup.py` → `backend/`
- `main_agents_before_update.py` → `backend/`
- `main_agents_clean.py` → `backend/`
- `firebase_service.py` → `backend/`
- `google_sheets_sync.py` → `backend/`
- `child_activity_tracker.py` → `backend/`
- `real_usage_tracker.py` → `backend/`
- `warehouse_api.py` → `backend/`
- `migrate_data.py` → `backend/`
- `sync_essential_growth_config.py` → `backend/`
- `sync_essential_growth_from_sheets.py` → `backend/`
- `sync_theme_names.py` → `backend/`

### **Requirements Files:**
- `requirements.txt` → `backend/` (if duplicate, merge with existing)
- `requirements_api.txt` → `backend/`

### **Dockerfiles:**
- `Dockerfile` → `backend/` (if not already there)
- `Dockerfile.llm` → `backend/`
- `Dockerfile.warehouse` → `backend/`

### **Documentation:**
- `HOLISTIC_SIMPLIFICATION_STATUS.md` → `backend/`
- `WEEKLY_PLAN_DATA_FORMAT.md` → `backend/`

### **Folders:**
- `agents/` → `backend/agents/` (merge if exists)
- `config/` → `backend/config/` (merge if exists)
- `data/` → `backend/data/` (merge if exists)
- `database/` → `backend/database/` (merge if exists)
- `utils/` → `backend/utils/` (merge if exists)
- `venv/` → `backend/venv/` (or delete if duplicate)
- `__pycache__/` → Delete (should be gitignored)

### **Other Files:**
- `test_plan.json` → `backend/`
- `google-sheets-service-account.json` → `backend/` (if not already there)

---

## ✅ **FILES THAT SHOULD STAY IN ROOT**

### **Essential Configuration:**
- `package.json`
- `package-lock.json`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `.firebaserc`
- `.gitignore`
- `env.example`
- `.env*` files

### **Documentation:**
- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `LICENSE`

### **Production Files:**
- `.dockerignore`
- `.editorconfig`
- `.prettierrc`
- `.eslintrc.js`
- `Makefile`

### **Scripts:**
- `QUICK_DEPLOY.sh`
- `DEPLOY_TO_STAGING_NOW.sh`
- `test-backend-api-automated.sh` (or move to `scripts/`)

### **Directories:**
- `src/` (frontend)
- `backend/` (backend)
- `public/` (static assets)
- `docs/` (documentation)
- `scripts/` (automation)
- `integration-tests/` (tests)
- `tools/` (dev tools)
- `functions/` (Firebase functions)

---

## 🎯 **IDEAL ROOT STRUCTURE**

After cleanup, root should have:
- **~15-20 files** (config, docs, scripts)
- **~8-10 directories** (src, backend, docs, etc.)

---

## 🚀 **ACTION PLAN**

1. **Move all backend Python files** to `backend/`
2. **Move backend folders** to `backend/` (merge if duplicates exist)
3. **Move backend documentation** to `backend/`
4. **Move Dockerfiles** to `backend/`
5. **Delete `__pycache__`** from root (should be gitignored)
6. **Verify no duplicates** after moving

---

## ⚠️ **IMPORTANT NOTES**

- **Check for duplicates** before moving (some files might already exist in `backend/`)
- **Merge folders** if both root and backend have them
- **Update imports** if any files reference moved files
- **Test after moving** to ensure nothing breaks

---

**Would you like me to perform this cleanup automatically?**

