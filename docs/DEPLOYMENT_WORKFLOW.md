# 🚀 Complete Deployment Workflow

## Quick Start

### 1. Initial Setup (One-Time)

```bash
# Login to Firebase (opens browser)
firebase login --reauth

# Run setup script
./scripts/setup-firebase-deployment.sh
```

### 2. Daily Development Workflow

```bash
# 1. Make changes locally
npm start  # Test on localhost:3000

# 2. Commit changes
git add .
git commit -m "Your commit message"

# 3. Push to GitHub
git push origin staging  # or main for production

# 4. Deploy to Staging
npm run deploy:staging

# 5. Test on staging URL

# 6. Deploy to Production (if tests pass)
npm run deploy:production
```

---

## Detailed Steps

### Step 1: Firebase Login

**Action Required**: Run this in YOUR terminal (browser will open):

```bash
firebase login --reauth
```

This authenticates you with Firebase. The browser will open automatically.

**Status Check**:
```bash
firebase projects:list
```

If you see your project list, you're logged in ✅

---

### Step 2: Push Code to GitHub

**Current Status**: You're on `staging` branch

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin staging
```

**Verify**:
```bash
git log --oneline -5  # See recent commits
```

---

### Step 3: Deploy to Staging

**Option A: Using npm script** (Recommended)
```bash
npm run deploy:staging
```

**Option B: Using deployment script**
```bash
./scripts/deployment/deploy-to-staging.sh
```

**What happens**:
1. Checks you're on `staging` branch
2. Builds the app with staging environment variables
3. Deploys to Firebase staging channel
4. Returns staging URL (e.g., `https://unschooling-464413--staging-xyz.web.app`)

**Test the staging URL**:
- Open the URL in browser
- Test all features
- Check console for errors (F12)

---

### Step 4: Deploy to Production

**Only after staging tests pass!**

```bash
# Switch to main branch
git checkout main

# Merge staging into main
git merge staging

# Push to GitHub
git push origin main

# Deploy to production
npm run deploy:production
```

**What happens**:
1. Checks you're on `main` branch
2. Builds the app with production environment variables
3. Deploys to Firebase production
4. Your site goes live at `https://unschooling.in`

---

## Environment Variables

### Staging
- `REACT_APP_ENVIRONMENT=staging`
- `REACT_APP_API_BASE_URL=https://llm-agents-staging-44gsrw22gq-uc.a.run.app`

### Production
- `REACT_APP_ENVIRONMENT=production`
- `REACT_APP_API_BASE_URL=https://llm-agents-44gsrw22gq-uc.a.run.app`

---

## Troubleshooting

### "Authentication Error"
```bash
firebase login --reauth
```

### "Not on correct branch"
```bash
git checkout staging  # or main
```

### "Uncommitted changes"
```bash
git add .
git commit -m "Your message"
```

### "Build failed"
```bash
# Clean and rebuild
rm -rf build/ node_modules/.cache
npm run build
```

---

## Current Project Status

- **Firebase Project**: `unschooling-464413`
- **GitHub Repo**: `git@github.com:gtharun-unschooling/unschooling.git`
- **Current Branch**: `staging`
- **Production URL**: `https://unschooling.in`
- **Staging URL**: `https://unschooling-464413--staging-*.web.app`

---

## Next Actions

1. ✅ Run `firebase login --reauth` in your terminal
2. ✅ Run `./scripts/setup-firebase-deployment.sh` to verify setup
3. ✅ Commit and push your current changes
4. ✅ Deploy to staging for testing
5. ✅ Deploy to production when ready

