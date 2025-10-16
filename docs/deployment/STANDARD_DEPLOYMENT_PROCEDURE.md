# 📋 Standard Deployment Procedure (SDP)

## 🎯 **Official Deployment Process - Follow Every Time**

This is your **standardized procedure** from local development to production deployment.

---

## 📊 **Overview**

```
LOCAL → GITHUB → BUILD → STAGING → PRODUCTION → VERIFY
(Work) (Backup) (Compile) (Test)  (Deploy)    (Check)
```

**Total Time**: 20-50 minutes  
**Cost**: $0 (staging) + existing production costs  
**Safety Level**: High (bugs caught in staging)

---

## 📋 **STANDARD PROCEDURE (Follow Step-by-Step)**

### **PHASE 1: LOCAL DEVELOPMENT** ✏️

**Step 1.1: Check Current Status**
```bash
# Check which branch you're on
git status

# Check current version
git describe --tags --abbrev=0 || echo "No tags yet"

# List recent commits
git log --oneline -5
```

**Step 1.2: Create Feature Branch** (if new feature)
```bash
# Create and switch to feature branch
git checkout -b feature/brief-description

# Example:
git checkout -b feature/navbar-improvements
```

**Step 1.3: Make Your Changes**
- Edit files
- Add features
- Fix bugs
- Test locally with `npm start`

**Step 1.4: Test Locally**
```bash
# Terminal 1: Start frontend
npm start
# Opens: http://localhost:3000

# Terminal 2: Start backend (if needed)
cd backend
source venv/bin/activate
uvicorn main_agents_clean:app --reload
# Runs on: http://localhost:8000

# Test everything thoroughly:
# ☐ All pages load
# ☐ No console errors
# ☐ Features work as expected
# ☐ Mobile responsive
# ☐ Authentication works
```

**Step 1.5: Update Documentation**
```bash
# Update CHANGELOG.md
nano CHANGELOG.md

# Add your changes:
## v1.3.0 (Unreleased)

### Added
- Yellow circular profile button with initials
- Standardized MinimalBackButton across all pages

### Changed
- Reduced navbar height for compact design
- Optimized hamburger menu spacing

### Fixed
- Profile button text centering
- Back button positioning on mobile
```

**Step 1.6: Commit Changes**
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: improved navbar, back button, and mobile menu

- Added yellow circular profile button with initials
- Standardized MinimalBackButton across all pages
- Reduced navbar height for more compact design
- Optimized hamburger menu spacing and fonts
- Fixed profile button text centering
- Fixed back button positioning on mobile pages"

# Verify commit
git log -1
```

**Phase 1 Complete** ✅

---

### **PHASE 2: VERSION CONTROL (GITHUB)** 📦

**Step 2.1: Push to GitHub**
```bash
# Push feature branch to GitHub
git push origin feature/navbar-improvements

# Or if working directly on develop
git push origin develop
```

**Step 2.2: Merge to Develop** (if using feature branch)
```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Merge feature branch
git merge feature/navbar-improvements

# Push to GitHub
git push origin develop

# Delete feature branch (optional)
git branch -d feature/navbar-improvements
git push origin --delete feature/navbar-improvements
```

**Step 2.3: Prepare for Staging**
```bash
# Switch to staging branch
git checkout staging

# Pull latest
git pull origin staging

# Merge from develop
git merge develop

# Push to GitHub
git push origin staging
```

**Phase 2 Complete** ✅

---

### **PHASE 3: BUILD PROCESS** 🔨

**Step 3.1: Clean Previous Build**
```bash
# Remove old build folder
rm -rf build/

# Clean npm cache (if build issues)
npm cache clean --force
```

**Step 3.2: Install Dependencies** (if package.json changed)
```bash
# Update dependencies
npm install

# Verify
npm list --depth=0
```

**Step 3.3: Build for Staging**
```bash
# Set environment for staging
export REACT_APP_ENVIRONMENT=staging
export REACT_APP_API_BASE_URL=https://llm-agents-staging-44gsrw22gq-uc.a.run.app

# Build
npm run build

# Verify build succeeded
ls -lh build/

# Check build size
du -sh build/
```

**Phase 3 Complete** ✅

---

### **PHASE 4: STAGING DEPLOYMENT** 🧪

**Step 4.1: Determine Version Number**
```bash
# Check current version
CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.0.0")
echo "Current version: $CURRENT_VERSION"

# Decide new version (use rules below)
# Bug fix: v1.2.0 → v1.2.1
# Feature: v1.2.0 → v1.3.0
# Major:   v1.2.0 → v2.0.0

NEW_VERSION="v1.3.0"  # Example for today
```

**Step 4.2: Tag Staging Version**
```bash
# Tag for staging
git tag ${NEW_VERSION}-staging
git push origin ${NEW_VERSION}-staging

# Example:
git tag v1.3.0-staging
git push origin v1.3.0-staging
```

**Step 4.3: Deploy to Staging**
```bash
# Deploy to Firebase staging channel
firebase hosting:channel:deploy staging --expires 30d

# Note the staging URL (example):
# ✔  hosting:channel: Channel URL (staging): 
#    https://unschooling-464413--staging-abc123.web.app [expires 2024-11-16]
```

**Step 4.4: Deploy Backend to Staging** (if backend changed)
```bash
cd backend

# Build Docker image
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents-staging

# Deploy to Cloud Run staging
gcloud run deploy llm-agents-staging \
  --image gcr.io/unschooling-464413/llm-agents-staging \
  --region us-central1 \
  --platform managed \
  --memory 1Gi \
  --cpu 1 \
  --allow-unauthenticated

cd ..
```

**Step 4.5: Test on Staging** ✅
```
Open staging URL in browser:
https://unschooling-464413--staging-abc123.web.app

Test Checklist:
☐ Homepage loads correctly
☐ Login works (Google Sign-In)
☐ All navigation links work
☐ Navbar displays correctly
☐ Back button works on all pages
☐ Hamburger menu works on mobile
☐ Profile button looks correct
☐ Create child profile works
☐ Generate plan works
☐ No console errors (F12)
☐ Test on mobile device
☐ Test on different browsers (Chrome, Safari)
☐ Check backend API calls work
☐ Verify database operations

Decision:
✅ All tests pass → Continue to Production
❌ Issues found → Fix and redeploy to staging
```

**Phase 4 Complete** ✅

---

### **PHASE 5: PRODUCTION DEPLOYMENT** 🚀

**Step 5.1: Merge to Main**
```bash
# Switch to main branch
git checkout main

# Pull latest
git pull origin main

# Merge from staging
git merge staging

# Push to GitHub
git push origin main
```

**Step 5.2: Tag Production Version**
```bash
# Tag production version (without -staging suffix)
git tag v1.3.0
git push origin v1.3.0

# Verify tag
git tag | tail -5
```

**Step 5.3: Build for Production**
```bash
# Clean old build
rm -rf build/

# Set environment for production
export REACT_APP_ENVIRONMENT=production
export REACT_APP_API_BASE_URL=https://llm-agents-44gsrw22gq-uc.a.run.app

# Build
npm run build

# Verify
ls -lh build/
```

**Step 5.4: Deploy Frontend to Production**
```bash
# Deploy to Firebase production
firebase deploy --only hosting

# Output shows:
# ✔  Deploy complete!
# Hosting URL: https://unschooling.in
```

**Step 5.5: Deploy Backend to Production** (if changed)
```bash
cd backend

# Build with version tag
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:v1.3.0
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:latest

# Deploy to Cloud Run production
gcloud run deploy llm-agents \
  --image gcr.io/unschooling-464413/llm-agents:v1.3.0 \
  --region us-central1 \
  --platform managed \
  --memory 2Gi \
  --cpu 2 \
  --allow-unauthenticated \
  --tag=v1-3-0

cd ..
```

**Step 5.6: Update Deployment Log**
```bash
# Add to deployment log
cat >> DEPLOYMENT_LOG.md << EOF

## v1.3.0 - $(date +'%Y-%m-%d %H:%M:%S')

**Deployed by**: Manual deployment
**Branch**: main
**Commit**: $(git rev-parse --short HEAD)

**Changes**:
- Improved navbar profile button (yellow circle, centered text)
- Standardized MinimalBackButton across all pages
- Optimized hamburger menu spacing and mobile fonts
- Reduced navigation bar height for compact design
- Fixed back button positioning on mobile

**Type**: UI Improvements (MINOR version)
**Tested on**: Staging ✅
**Status**: ✅ Successfully deployed
**Rollback to**: v1.2.0 (if needed)

**URLs**:
- Frontend: https://unschooling.in
- Backend: https://llm-agents-44gsrw22gq-uc.a.run.app

---
EOF

# Update CHANGELOG.md
sed -i '' 's/(Unreleased)/(2024-10-16)/' CHANGELOG.md
```

**Phase 5 Complete** ✅

---

### **PHASE 6: VERIFICATION** ✅

**Step 6.1: Verify Production Deployment**
```bash
# Open production site
open https://unschooling.in

# Or manually visit in browser
```

**Step 6.2: Production Testing Checklist**
```
Critical Flow Testing:
☐ Homepage loads (hard refresh: Cmd+Shift+R)
☐ Login with Google works
☐ Create child profile works
☐ Generate learning plan works
☐ View existing plans works
☐ Logout works

UI/UX Testing:
☐ Navbar looks correct
☐ Profile button centered and displays correctly
☐ Hamburger menu works on mobile
☐ Back button on all pages works
☐ Navigation height looks good
☐ Mobile responsive

Technical Testing:
☐ No JavaScript errors in console (F12)
☐ No 404 errors in Network tab
☐ All API calls succeed
☐ Images load correctly
☐ Fonts render correctly

Multi-Device Testing:
☐ Desktop Chrome
☐ Desktop Safari
☐ Mobile iPhone
☐ Mobile Android (if available)
```

**Step 6.3: Monitor Initial Performance**
```bash
# Check Firebase Console
open https://console.firebase.google.com/project/unschooling-464413/overview

# Check Cloud Run Console
open https://console.cloud.google.com/run?project=unschooling-464413

# Monitor for 30 minutes:
# - Error rates
# - Response times
# - Active users
```

**Phase 6 Complete** ✅

---

### **PHASE 7: MONITORING** 📊

**Step 7.1: Set Up Monitoring Dashboard**
```bash
# Check Firebase Hosting metrics
open https://console.firebase.google.com/project/unschooling-464413/hosting/main

# Check Cloud Run metrics
open https://console.cloud.google.com/run/detail/us-central1/llm-agents/metrics

# Check Firestore usage
open https://console.firebase.google.com/project/unschooling-464413/firestore
```

**Step 7.2: Monitor for Issues** (First 24 hours)
```
Hourly Checks (first 6 hours):
☐ Error rate < 1%
☐ Response time < 3 seconds
☐ No user complaints
☐ API success rate > 99%

Daily Checks (first week):
☐ Daily active users normal
☐ No spike in errors
☐ Costs within expected range
☐ No support tickets about bugs
```

**Step 7.3: Update Status**
```bash
# If all good after 24 hours
cat >> DEPLOYMENT_LOG.md << EOF

**24-Hour Update**: ✅ Stable, no issues reported

EOF

# If issues found
cat >> DEPLOYMENT_LOG.md << EOF

**Issues Found**:
- [Issue description]
**Action Taken**: [What you did]
**Status**: [Resolved/In Progress]

EOF
```

**Phase 7 Complete** ✅

---

## 🔄 **Emergency Rollback Procedure**

**If something breaks in production:**

```bash
# IMMEDIATE ROLLBACK (30 seconds)

# Step 1: Rollback frontend
firebase hosting:clone <previous-version>:live
# Example: firebase hosting:clone v1.2.0:live

# Step 2: Rollback backend
gcloud run services update-traffic llm-agents \
  --to-revisions=llm-agents-v1-2-0=100 \
  --region=us-central1

# Step 3: Log the rollback
cat >> DEPLOYMENT_LOG.md << EOF

**ROLLBACK**: v1.3.0 → v1.2.0 at $(date)
**Reason**: [Issue description]
**Status**: Rolled back successfully

EOF

# Step 4: Fix issues locally, test on staging, redeploy
```

---

## 📝 **Change Tracking System**

### **File 1: CHANGELOG.md** (What changed)

**Format**:
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New features being worked on

### Changed
- Updates to existing features

### Fixed
- Bug fixes

## [1.3.0] - 2024-10-16

### Added
- Yellow circular profile button with user initials
- Standardized MinimalBackButton component across all pages

### Changed
- Reduced navbar height from 1rem to 0.5rem padding
- Optimized hamburger menu with 2px line spacing
- Updated mobile menu fonts to 1.1rem for better readability

### Fixed
- Profile button text vertical centering issue
- Back button creating extra space on pages
- Hamburger menu full-height slide on mobile

## [1.2.0] - 2024-10-01

### Added
- Customized weekly plan feature
- Plan generation with 4-week structure

### Fixed
- Plan data structure (moved to subcollections)
```

### **File 2: DEPLOYMENT_LOG.md** (When deployed)

**Format**:
```markdown
# Deployment Log

Track of all production deployments.

---

## v1.3.0 - 2024-10-16 14:30:00

**Deployed by**: Manual deployment
**Branch**: main
**Commit**: a3b4c5d
**Environment**: Production

**Changes**:
- Improved navbar profile button
- Standardized MinimalBackButton
- Optimized mobile menu

**Type**: UI Improvements (MINOR)
**Tested on**: Staging ✅
**Status**: ✅ Successfully deployed
**Rollback to**: v1.2.0

**Deployment Details**:
- Frontend: Firebase Hosting
- Backend: Cloud Run (no changes)
- Database: No migrations

**Verification**:
- Tested: ✅ All critical flows working
- Errors: None
- Performance: Normal

**24-Hour Update**: ✅ Stable, no issues

---

## v1.2.0 - 2024-10-01 10:15:00

**Deployed by**: Manual deployment
**Changes**: Added weekly plan feature
**Status**: ✅ Success

---
```

### **File 3: CURRENT_VERSION.txt** (Quick reference)

**Format**:
```
CURRENT PRODUCTION VERSION: v1.3.0
DEPLOYED: 2024-10-16 14:30:00
LAST COMMIT: a3b4c5d
STATUS: Stable
NEXT PLANNED: v1.3.1 or v1.4.0 (TBD)
```

---

## 🤖 **Automated Deployment Script with Progress**

I'll create an interactive script that guides you through each step!

**File**: `deploy.sh` (master deployment script)

**Features**:
- ✅ Shows current step
- ✅ Checks prerequisites
- ✅ Validates each stage
- ✅ Logs everything
- ✅ Can pause/resume
- ✅ Auto-updates tracking files

---

## 📊 **Quick Reference Checklist**

Print this and check off each time you deploy:

```
┌─────────────────────────────────────────────────────────────┐
│  DEPLOYMENT CHECKLIST - v____.__                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PRE-DEPLOYMENT                                              │
│  ☐ All code committed                                        │
│  ☐ Tested locally                                            │
│  ☐ CHANGELOG.md updated                                      │
│  ☐ Version number decided                                    │
│  ☐ No console errors                                         │
│                                                               │
│  STAGING DEPLOYMENT                                          │
│  ☐ Merged to staging branch                                  │
│  ☐ Tagged: v____.__-staging                                  │
│  ☐ Built: npm run build                                      │
│  ☐ Deployed: firebase hosting:channel:deploy staging         │
│  ☐ Tested on staging URL                                     │
│  ☐ All tests passed ✅                                       │
│                                                               │
│  PRODUCTION DEPLOYMENT                                       │
│  ☐ Merged to main branch                                     │
│  ☐ Tagged: v____.__ (production)                             │
│  ☐ Built for production                                      │
│  ☐ Deployed: firebase deploy --only hosting                  │
│  ☐ Backend deployed (if needed)                              │
│  ☐ DEPLOYMENT_LOG.md updated                                 │
│  ☐ CHANGELOG.md dated                                        │
│  ☐ CURRENT_VERSION.txt updated                               │
│                                                               │
│  POST-DEPLOYMENT                                             │
│  ☐ Production site verified                                  │
│  ☐ Critical flows tested                                     │
│  ☐ No errors in logs                                         │
│  ☐ Monitored for 30 minutes                                  │
│  ☐ 24-hour status logged                                     │
│                                                               │
│  COMPLETION                                                  │
│  ☐ Team notified (if any)                                    │
│  ☐ Rollback plan documented                                  │
│  ☐ Next version planned                                      │
│                                                               │
│  Deployed by: ______________   Date: __________              │
│  Status: ✅ Success  ☐ Issues  ☐ Rolled back                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ **Summary**

**Standard Procedure**:
1. Local Development → Commit
2. Push to GitHub → Backup
3. Build → Compile
4. Staging → Test
5. Production → Deploy
6. Verify → Check
7. Monitor → Watch

**Tracking Files**:
- `CHANGELOG.md` → What changed
- `DEPLOYMENT_LOG.md` → When deployed
- `CURRENT_VERSION.txt` → Current status

**Version Control**:
- Today: v1.3.0 (MINOR)
- Bug fix: v1.3.1 (PATCH)
- New feature: v1.4.0 (MINOR)

**Rollback**:
- 30 seconds with Firebase/Cloud Run
- Easy and safe

---

**Follow this procedure EVERY TIME you deploy!** 📋

