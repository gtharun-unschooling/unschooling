# 🚀 3-Stage Manual Deployment Plan - Complete Guide

## 🎯 **Your Deployment Strategy**

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   LOCAL     │─────▶│   TESTING   │─────▶│ PRODUCTION  │
│ Your Mac    │ Test │  Staging    │ Final│   Live      │
│ localhost   │  OK  │  Preview    │ Check│  Customers  │
└─────────────┘      └─────────────┘      └─────────────┘
     Work               Verify              Release
   Changes              Everything          Version
```

---

## 📊 **Three Stages Explained**

### **Stage 1: LOCAL** 🏠
**Purpose**: Development and initial testing

**Environment**:
- Your Mac laptop
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Database: Firebase Firestore (dev data)

**Activities**:
- Write code
- Fix bugs
- Test features locally
- Make UI changes (like you just did)

**When Complete**: Push to Git

---

### **Stage 2: TESTING/STAGING** 🧪
**Purpose**: Pre-production testing in production-like environment

**Environment**:
- Firebase Hosting (preview channel)
- URL: `https://unschooling-464413--staging-<random>.web.app`
- Backend: Cloud Run (staging service)
- Database: Firestore (staging collection)

**Activities**:
- Test all features in production-like environment
- QA testing
- Share with beta users
- Final bug fixes
- Performance testing

**When Complete**: If all tests pass → Promote to Production

---

### **Stage 3: PRODUCTION** 🚀
**Purpose**: Live customer-facing application

**Environment**:
- Firebase Hosting (live)
- URL: `https://unschooling.in` (your domain)
- Backend: Cloud Run (production service)
- Database: Firestore (production data)

**Activities**:
- Customers use the app
- Monitor for issues
- Track analytics
- Customer support

**When Complete**: Monitor and maintain

---

## 🌳 **Git Branching Strategy**

```
main (production - protected)
 │
 ├─── staging (testing environment)
 │     │
 │     ├─── develop (active development)
 │     │     │
 │     │     ├─── feature/navbar-updates
 │     │     ├─── feature/new-payment
 │     │     └─── bugfix/login-issue
 │     │
 │
```

### **Branch Purpose**:

**1. `feature/*` branches**
- Your daily work
- Create from `develop`
- Merge back to `develop` when done

**2. `develop` branch**
- Integration branch
- All features merge here first
- Deploy to LOCAL for testing

**3. `staging` branch**
- Pre-production testing
- Merge from `develop` when ready
- Deploy to TESTING environment
- **Version created here**

**4. `main` branch**
- Production-ready code
- Protected (requires approval)
- Merge from `staging` only
- Deploy to PRODUCTION
- **Version released here**

---

## 📋 **Complete Deployment Workflow**

### **Step-by-Step Process**

#### **PHASE 1: Local Development** 🏠

**1. Create feature branch**
```bash
cd /Users/tharunguduguntla/Documents/unschooling

# Make sure you're on develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-new-feature
```

**2. Make changes**
```bash
# Work on your feature
# Test locally: npm start
# Backend: uvicorn main_agents_clean:app --reload
```

**3. Commit changes**
```bash
git add .
git commit -m "feat: add new feature description"
```

**4. Push to GitHub**
```bash
git push origin feature/my-new-feature
```

**5. Merge to develop**
```bash
# Option A: Via GitHub Pull Request (recommended)
# - Go to GitHub
# - Create PR: feature/my-new-feature → develop
# - Review and merge

# Option B: Direct merge (if solo)
git checkout develop
git merge feature/my-new-feature
git push origin develop
```

---

#### **PHASE 2: Deploy to TESTING** 🧪

**6. Merge develop → staging**
```bash
git checkout staging
git pull origin staging
git merge develop

# Resolve any conflicts
git push origin staging
```

**7. Create version tag**
```bash
# Version format: v1.2.3-staging
# v1 = major version
# 2 = minor version (features)
# 3 = patch version (bug fixes)

# Example: Your next version
git tag v1.3.0-staging
git push origin v1.3.0-staging
```

**8. Build for testing**
```bash
# Set environment to staging
export REACT_APP_ENVIRONMENT=staging
export REACT_APP_API_BASE_URL=https://llm-agents-staging-44gsrw22gq-uc.a.run.app

# Build
npm run build
```

**9. Deploy to Firebase Staging Channel**
```bash
# Deploy to staging channel (FREE - no extra cost!)
firebase hosting:channel:deploy staging --expires 30d

# Output will show:
# ✔ hosting:channel: Channel URL (staging): https://unschooling-464413--staging-xyz.web.app
```

**10. Deploy backend to staging**
```bash
cd backend

# Build Docker image
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents-staging

# Deploy to Cloud Run (staging service)
gcloud run deploy llm-agents-staging \
  --image gcr.io/unschooling-464413/llm-agents-staging \
  --region us-central1 \
  --platform managed \
  --memory 1Gi \
  --cpu 1 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_API_KEY=$GOOGLE_API_KEY,ENVIRONMENT=staging"

# Get URL
gcloud run services describe llm-agents-staging --region=us-central1 --format="value(status.url)"
```

**11. Test on staging**
```bash
# Open staging URL
open https://unschooling-464413--staging-xyz.web.app

# Test checklist:
# □ All pages load correctly
# □ Authentication works
# □ API calls work
# □ Forms submit successfully
# □ No console errors
# □ Mobile responsive
# □ Performance acceptable
```

**12. Decision point**
```
✅ All tests pass → Proceed to Production
❌ Issues found → Fix on develop, redeploy to staging
```

---

#### **PHASE 3: Deploy to PRODUCTION** 🚀

**13. Merge staging → main**
```bash
git checkout main
git pull origin main
git merge staging

# Resolve any conflicts (there shouldn't be any)
git push origin main
```

**14. Create production version tag**
```bash
# Remove -staging suffix for production
git tag v1.3.0
git push origin v1.3.0
```

**15. Build for production**
```bash
# Set environment to production
export REACT_APP_ENVIRONMENT=production
export REACT_APP_API_BASE_URL=https://llm-agents-44gsrw22gq-uc.a.run.app

# Clean previous build
rm -rf build

# Build
npm run build
```

**16. Deploy to Firebase Production**
```bash
# Deploy to live site
firebase deploy --only hosting

# Output:
# ✔ Deploy complete!
# Hosting URL: https://unschooling.in
```

**17. Deploy backend to production**
```bash
cd backend

# Build Docker image
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:v1.3.0
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:latest

# Deploy to Cloud Run (production service)
gcloud run deploy llm-agents \
  --image gcr.io/unschooling-464413/llm-agents:v1.3.0 \
  --region us-central1 \
  --platform managed \
  --memory 2Gi \
  --cpu 2 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_API_KEY=$GOOGLE_API_KEY,ENVIRONMENT=production" \
  --tag=v1-3-0

# Get URL
gcloud run services describe llm-agents --region=us-central1 --format="value(status.url)"
```

**18. Verify production deployment**
```bash
# Open production site
open https://unschooling.in

# Quick smoke test:
# □ Homepage loads
# □ Login works
# □ Generate plan works
# □ No errors in console
```

**19. Create deployment record**
```bash
# Add to deployment log
cat >> DEPLOYMENT_LOG.md << EOF

## v1.3.0 - $(date +%Y-%m-%d)

**Changes**:
- Added new navbar design
- Fixed back button positioning
- Optimized hamburger menu

**Deployed by**: You
**Status**: ✅ Success
**Rollback**: If needed, use v1.2.0

EOF
```

**20. Monitor**
```bash
# Check logs for errors
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=llm-agents" --limit 50

# Check Firebase Hosting metrics
open https://console.firebase.google.com/project/unschooling-464413/hosting

# Check for user issues
# Monitor support channels
```

---

## 🔧 **Setup Scripts (Create These)**

### **Script 1: `deploy-to-staging.sh`**

```bash
#!/bin/bash

# Deploy to Staging Environment
set -e

echo "🧪 DEPLOYING TO STAGING ENVIRONMENT"
echo "==================================="

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "staging" ]; then
    echo "❌ ERROR: Must be on 'staging' branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ ERROR: You have uncommitted changes"
    exit 1
fi

# Get version
echo "Enter version tag (e.g., v1.3.0-staging):"
read VERSION

# Confirm
echo ""
echo "📋 Deployment Summary:"
echo "  Branch: staging"
echo "  Version: $VERSION"
echo "  Environment: STAGING"
echo ""
read -p "Proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Tag version
git tag $VERSION
git push origin $VERSION

# Build frontend
echo "🔨 Building frontend..."
export REACT_APP_ENVIRONMENT=staging
export REACT_APP_API_BASE_URL=https://llm-agents-staging-44gsrw22gq-uc.a.run.app
npm run build

# Deploy to Firebase staging channel
echo "🚀 Deploying to Firebase staging..."
firebase hosting:channel:deploy staging --expires 30d

# Deploy backend
echo "🔧 Deploying backend..."
cd backend
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents-staging
gcloud run deploy llm-agents-staging \
  --image gcr.io/unschooling-464413/llm-agents-staging \
  --region us-central1 \
  --platform managed \
  --memory 1Gi \
  --cpu 1 \
  --allow-unauthenticated

cd ..

echo ""
echo "✅ STAGING DEPLOYMENT COMPLETE"
echo "==================================="
echo "🌐 Frontend: Check Firebase console for URL"
echo "🔧 Backend: Check Cloud Run console for URL"
echo ""
echo "🧪 Next Steps:"
echo "1. Test all features on staging"
echo "2. If tests pass, run: ./deploy-to-production.sh"
echo "3. If issues found, fix and redeploy to staging"
```

---

### **Script 2: `deploy-to-production.sh`**

```bash
#!/bin/bash

# Deploy to Production Environment
set -e

echo "🚀 DEPLOYING TO PRODUCTION"
echo "=========================="

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ ERROR: Must be on 'main' branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ ERROR: You have uncommitted changes"
    exit 1
fi

# Get version (without -staging)
echo "Enter production version tag (e.g., v1.3.0):"
read VERSION

# Confirm multiple times (production is critical!)
echo ""
echo "⚠️  PRODUCTION DEPLOYMENT"
echo "=========================="
echo "  Branch: main"
echo "  Version: $VERSION"
echo "  Environment: PRODUCTION"
echo "  Live Users: Will be affected"
echo ""
read -p "Are you SURE you want to deploy to PRODUCTION? (yes/no) " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Second confirmation
read -p "Have you tested on STAGING? (yes/no) " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Please test on staging first"
    exit 1
fi

# Tag version
git tag $VERSION
git push origin $VERSION

# Build frontend
echo "🔨 Building frontend for production..."
export REACT_APP_ENVIRONMENT=production
export REACT_APP_API_BASE_URL=https://llm-agents-44gsrw22gq-uc.a.run.app
rm -rf build
npm run build

# Deploy to Firebase production
echo "🚀 Deploying to Firebase production..."
firebase deploy --only hosting

# Deploy backend
echo "🔧 Deploying backend to production..."
cd backend
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:$VERSION
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:latest

gcloud run deploy llm-agents \
  --image gcr.io/unschooling-464413/llm-agents:$VERSION \
  --region us-central1 \
  --platform managed \
  --memory 2Gi \
  --cpu 2 \
  --allow-unauthenticated \
  --tag=${VERSION//./-}

cd ..

# Log deployment
echo "" >> DEPLOYMENT_LOG.md
echo "## $VERSION - $(date +'%Y-%m-%d %H:%M:%S')" >> DEPLOYMENT_LOG.md
echo "" >> DEPLOYMENT_LOG.md
echo "**Status**: ✅ Deployed to production" >> DEPLOYMENT_LOG.md
echo "**Deployed by**: Manual deployment" >> DEPLOYMENT_LOG.md
echo "" >> DEPLOYMENT_LOG.md

echo ""
echo "✅ PRODUCTION DEPLOYMENT COMPLETE"
echo "================================="
echo "🌐 Website: https://unschooling.in"
echo "📊 Monitor: console.cloud.google.com"
echo ""
echo "🔍 Next Steps:"
echo "1. Verify website is working"
echo "2. Monitor logs for errors"
echo "3. Check user analytics"
echo "4. Be ready to rollback if needed"
```

---

### **Script 3: `rollback-production.sh`**

```bash
#!/bin/bash

# Rollback Production to Previous Version
set -e

echo "⏪ PRODUCTION ROLLBACK"
echo "====================="

# Show recent versions
echo "Recent production versions:"
git tag | grep -v staging | tail -5

echo ""
echo "Enter version to rollback to (e.g., v1.2.0):"
read ROLLBACK_VERSION

# Confirm
echo ""
echo "⚠️  ROLLBACK CONFIRMATION"
echo "========================"
echo "  Current: $(git describe --tags --abbrev=0)"
echo "  Rollback to: $ROLLBACK_VERSION"
echo ""
read -p "Proceed with rollback? (yes/no) " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Checkout rollback version
git checkout $ROLLBACK_VERSION

# Deploy backend (fastest rollback)
echo "🔧 Rolling back backend..."
cd backend
gcloud run services update-traffic llm-agents \
  --to-tags=${ROLLBACK_VERSION//./-}=100 \
  --region us-central1

cd ..

echo ""
echo "✅ ROLLBACK COMPLETE"
echo "==================="
echo "Backend rolled back to: $ROLLBACK_VERSION"
echo ""
echo "Note: Frontend rollback requires rebuild and redeploy"
echo "If needed, run: firebase hosting:clone <old-version>"
```

---

## 📊 **Version Numbering System**

### **Format**: `v{MAJOR}.{MINOR}.{PATCH}-{STAGE}`

**Examples**:
- `v1.0.0` - Initial production release
- `v1.1.0-staging` - New feature in staging
- `v1.1.0` - New feature released to production
- `v1.1.1` - Bug fix
- `v2.0.0` - Major update (breaking changes)

### **When to Increment**:

**MAJOR (v2.0.0)**:
- Breaking changes
- Complete redesign
- Major feature overhaul

**MINOR (v1.2.0)**:
- New features
- Significant improvements
- New pages or functionality

**PATCH (v1.1.1)**:
- Bug fixes
- Small UI tweaks
- Performance improvements

---

## 📋 **Deployment Checklist**

### **Before Staging Deployment**:
- [ ] All code committed to `develop`
- [ ] Tested locally
- [ ] No console errors
- [ ] Updated CHANGELOG.md
- [ ] Created version tag

### **Before Production Deployment**:
- [ ] Tested on staging
- [ ] All features working
- [ ] Performance acceptable
- [ ] No critical bugs
- [ ] Backup database (if needed)
- [ ] Notified team (if any)

### **After Production Deployment**:
- [ ] Verified website loads
- [ ] Tested critical flows (login, generate plan)
- [ ] Checked logs for errors
- [ ] Updated deployment log
- [ ] Monitored for 30 minutes

---

## 💰 **Cost Analysis (3-Stage Setup)**

### **Stage Costs**:

**Local**: $0 (your computer)

**Staging**:
- Firebase Hosting Channel: **$0 (FREE!)**
- Cloud Run (staging): **~$2/month** (minimal usage)
- **Subtotal**: $2/month

**Production**: $10-12/month (as calculated before)

**Total**: **$12-14/month** (only $2 more for staging!)

### **Why Staging is Cheap**:
- Firebase Hosting Channels are FREE
- Cloud Run staging: Pay only when testing (minimal)
- Same database, different collection (no extra cost)
- Deploy only when needed (not always running)

---

## 🎯 **Implementation Timeline**

### **Week 1: Setup (2 hours)**
```bash
# Create branches
git checkout -b develop
git push origin develop

git checkout -b staging
git push origin staging

# Create scripts
chmod +x deploy-to-staging.sh
chmod +x deploy-to-production.sh
chmod +x rollback-production.sh

# Create staging channel
firebase hosting:channel:create staging
```

### **Week 2: First Deployment (1 hour)**
```bash
# Test the workflow
# Make a small change
# Deploy to staging
# Test
# Deploy to production
```

### **Ongoing: Standard Workflow (15-20 min per deployment)**
```bash
# Daily work → develop
# Ready to test → staging (5-10 min)
# Tests pass → production (5-10 min)
```

---

## ✅ **Summary**

### **Your 3-Stage Workflow**:
```
LOCAL (Your Mac)
  ↓ git push to develop
  ↓ Work complete
  ↓ Merge to staging
TESTING (Firebase Preview + Cloud Run Staging)
  ↓ All tests pass
  ↓ Merge to main
  ↓ Create version tag
PRODUCTION (Live Site)
  ↓ Monitor
  ↓ Maintain
```

### **Cost**: $12-14/month (only $2 more than production alone!)

### **Benefits**:
- ✅ Safe testing before production
- ✅ Version control
- ✅ Easy rollback
- ✅ Professional workflow
- ✅ Minimal extra cost

### **Time Investment**:
- Setup: 2 hours (one time)
- Per deployment: 15-20 minutes
- Testing: 10-30 minutes (depends on changes)

---

**This is the perfect middle ground - safe, professional, and cost-effective!** 🚀

**Ready to set this up?** I can walk you through each step!

