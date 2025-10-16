# 🏷️ Version Control & Rollback Guide

## 📊 **Version Numbering System**

### **Format: `v{MAJOR}.{MINOR}.{PATCH}`**

```
v 1 . 3 . 2
│ │   │   │
│ │   │   └─ PATCH: Bug fixes, small tweaks
│ │   └───── MINOR: New features, improvements
│ └───────── MAJOR: Big changes, redesigns
└─────────── Version prefix
```

---

## 🎯 **When to Increment Each Number**

### **MAJOR Version (v2.0.0)**
**When**: Breaking changes that affect existing functionality

**Examples**:
- Complete website redesign
- Change from React to Next.js
- Database migration (Firestore → PostgreSQL)
- Remove/change major features
- Change URL structure

**Impact**: Existing users may need to re-learn the interface

---

### **MINOR Version (v1.3.0)**
**When**: New features or significant improvements

**Examples**:
- Add new page (e.g., "Pricing" page)
- New feature (e.g., "Schedule calls" feature)
- Enhanced existing feature (e.g., "Advanced plan filtering")
- New integration (e.g., "Payment gateway")
- Significant UI updates (like your navbar changes!)

**Impact**: Users get new functionality, but nothing breaks

---

### **PATCH Version (v1.2.1)**
**When**: Bug fixes, small tweaks, minor improvements

**Examples**:
- Fix typo
- Fix broken link
- Adjust button spacing
- Performance optimization
- Small CSS tweaks

**Impact**: Users don't notice (just fixes)

---

## 📋 **Your Current Situation**

### **What version are you on NOW?**

To check:
```bash
# Check latest Git tag
git describe --tags --abbrev=0

# If no tags, you're probably at v1.0.0 or unversioned
```

Let's assume you're currently at **v1.2.0** (example)

---

## 🆕 **Today's Changes (Navbar & UI Updates)**

### **What you changed**:
- ✅ Navbar profile button (centered text, yellow circle)
- ✅ MinimalBackButton (standardized across site)
- ✅ Hamburger menu (spacing, mobile fonts)
- ✅ Navigation bar height (more compact)
- ✅ Back button positioning (removed padding)

### **What version should this be?**

**Answer: v1.3.0** (MINOR version bump)

**Why?**:
- ✅ Significant UI improvements
- ✅ User-facing changes
- ✅ New component standardization
- ❌ No breaking changes
- ❌ Not a complete redesign

**Tagging**:
```bash
# For staging
git tag v1.3.0-staging
git push origin v1.3.0-staging

# For production (after testing)
git tag v1.3.0
git push origin v1.3.0
```

---

## 📅 **Next Week's Changes (Example Scenarios)**

### **Scenario A: Bug Fix (Small change)**

**Example**: Fix a typo on homepage, adjust button padding

**Version**: **v1.3.1** (PATCH bump)

**Tagging**:
```bash
git tag v1.3.1-staging  # Test first
git tag v1.3.1          # Production
```

---

### **Scenario B: New Feature (Medium change)**

**Example**: Add "Schedule Demo Call" feature

**Version**: **v1.4.0** (MINOR bump)

**Tagging**:
```bash
git tag v1.4.0-staging
git tag v1.4.0
```

---

### **Scenario C: Major Redesign (Big change)**

**Example**: Complete UI redesign, new branding

**Version**: **v2.0.0** (MAJOR bump)

**Tagging**:
```bash
git tag v2.0.0-staging
git tag v2.0.0
```

---

## 🔄 **How to Rollback Easily**

### **Method 1: Firebase Hosting Rollback (Easiest - Frontend Only)**

Firebase keeps history of all deployments!

```bash
# List recent deployments
firebase hosting:clone --list

# Output shows:
# v1.3.0 (1 hour ago)
# v1.2.0 (1 week ago)
# v1.1.0 (2 weeks ago)

# Rollback to previous version
firebase hosting:clone v1.2.0:live

# Done! Takes 30 seconds!
```

**When to use**: Frontend issues only, fastest rollback

---

### **Method 2: Cloud Run Rollback (Backend)**

Cloud Run keeps previous revisions with traffic split!

```bash
# List revisions
gcloud run revisions list --service=llm-agents --region=us-central1

# Output shows:
# llm-agents-v1-3-0  (100% traffic)
# llm-agents-v1-2-0  (0% traffic)

# Rollback: Shift traffic to old revision
gcloud run services update-traffic llm-agents \
  --to-revisions=llm-agents-v1-2-0=100 \
  --region=us-central1

# Done! Takes 30 seconds!
```

**When to use**: Backend API issues

---

### **Method 3: Git Rollback (Complete - Requires Redeploy)**

Rollback code and redeploy everything:

```bash
# Method 3A: Checkout old version
git checkout v1.2.0
npm run build
firebase deploy --only hosting

# Method 3B: Revert commit
git revert <commit-hash>
git push origin main
# Then redeploy

# Method 3C: Hard reset (dangerous!)
git reset --hard v1.2.0
git push --force origin main  # Careful! This rewrites history
```

**When to use**: Need to fix code and redeploy, takes 5-10 minutes

---

### **Method 4: Emergency Rollback Script** (Automated)

Use the script I created for you:

```bash
./rollback-production.sh

# Script will:
# 1. Show recent versions
# 2. Ask which version to rollback to
# 3. Rollback backend (Cloud Run) - 30 seconds
# 4. Optionally rollback frontend (Firebase) - 1 minute
```

**When to use**: Production emergency, fastest automated rollback

---

## 📋 **Version History Example**

Your version timeline might look like:

```
┌─────────────────────────────────────────────────────────────┐
│  VERSION HISTORY                                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  v1.0.0 (2024-09-01)                                         │
│  └─ Initial production release                               │
│                                                               │
│  v1.1.0 (2024-09-15)                                         │
│  └─ Added payment integration                                │
│                                                               │
│  v1.1.1 (2024-09-20)                                         │
│  └─ Fixed payment button bug                                 │
│                                                               │
│  v1.2.0 (2024-10-01)                                         │
│  └─ Added customized weekly plan feature                     │
│                                                               │
│  v1.2.1 (2024-10-05)                                         │
│  └─ Fixed plan display issue                                 │
│                                                               │
│  v1.3.0 (2024-10-16) ← TODAY'S DEPLOY                       │
│  └─ Improved navbar, back button, hamburger menu            │
│                                                               │
│  v1.3.1 (2024-10-23) ← NEXT WEEK (if bug fix)               │
│  └─ Fixed login button spacing                               │
│                                                               │
│  v1.4.0 (2024-10-30) ← NEXT WEEK (if new feature)           │
│  └─ Added schedule demo call feature                         │
│                                                               │
│  v2.0.0 (2024-12-01) ← FUTURE (if major redesign)           │
│  └─ Complete UI redesign with new branding                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Practical Rollback Scenarios**

### **Scenario 1: Frontend Bug After Deployment**

**Problem**: You deployed v1.3.0, but navbar is broken on mobile

**Solution** (Firebase hosting rollback - 30 seconds):
```bash
# Rollback frontend to v1.2.0
firebase hosting:clone v1.2.0:live

# Fix the issue locally
# Test thoroughly
# Redeploy as v1.3.1
```

**Time**: 30 seconds to rollback, then fix and redeploy

---

### **Scenario 2: Backend API Breaking**

**Problem**: You deployed v1.3.0, but plan generation fails

**Solution** (Cloud Run traffic rollback - 30 seconds):
```bash
# Rollback backend to previous revision
gcloud run services update-traffic llm-agents \
  --to-revisions=llm-agents-v1-2-0=100 \
  --region=us-central1

# Fix backend code
# Test
# Redeploy as v1.3.1
```

**Time**: 30 seconds to rollback, then fix and redeploy

---

### **Scenario 3: Both Frontend & Backend Issues**

**Problem**: Everything is broken after v1.3.0 deploy

**Solution** (Complete rollback - 2 minutes):
```bash
# Rollback frontend
firebase hosting:clone v1.2.0:live

# Rollback backend
gcloud run services update-traffic llm-agents \
  --to-revisions=llm-agents-v1-2-0=100 \
  --region=us-central1

# Or use automated script
./rollback-production.sh
# Enter: v1.2.0
```

**Time**: 1-2 minutes to rollback everything

---

## 📊 **Version Control Best Practices**

### **1. Always Tag Versions**
```bash
# Every production deployment
git tag v1.3.0
git push origin v1.3.0

# This creates a restore point
```

### **2. Use Descriptive Commit Messages**
```bash
# Good
git commit -m "feat: improved navbar centering and mobile responsiveness"

# Bad
git commit -m "updates"
```

### **3. Keep CHANGELOG.md**
```markdown
## v1.3.0 (2024-10-16)

### Added
- Yellow circular profile button with initials
- Standardized MinimalBackButton across all pages

### Changed
- Reduced navbar height for more compact design
- Optimized hamburger menu spacing

### Fixed
- Profile button text centering issue
- Back button positioning on mobile
```

### **4. Test Before Tagging**
```bash
# Test on staging first
git tag v1.3.0-staging

# After staging tests pass
git tag v1.3.0  # Production version
```

### **5. Document Deployments**
```bash
# Keep a deployment log
echo "v1.3.0 - $(date) - UI improvements - Success" >> DEPLOYMENT_LOG.md
```

---

## 🎯 **Your Versioning Strategy (Step-by-Step)**

### **Today (Deploy Navbar Changes)**

**Current version**: v1.2.0 (assumed)

**Your changes**:
- Navbar improvements
- Back button standardization
- Hamburger menu optimization

**New version**: **v1.3.0** (MINOR bump - significant UI improvements)

**Commands**:
```bash
# 1. Commit changes
git add .
git commit -m "feat: improved navbar and back button UI"

# 2. Push to GitHub
git push origin main

# 3. Tag staging version
git tag v1.3.0-staging
git push origin v1.3.0-staging

# 4. Deploy to staging
firebase hosting:channel:deploy staging

# 5. Test on staging

# 6. Tag production version
git tag v1.3.0
git push origin v1.3.0

# 7. Deploy to production
firebase deploy --only hosting

# 8. Log deployment
echo "v1.3.0 - $(date) - UI improvements: navbar, back button, hamburger menu - Status: Success" >> DEPLOYMENT_LOG.md
```

---

### **Next Week (Bug Fix Example)**

**Current version**: v1.3.0

**Your changes**: Fix a small CSS issue

**New version**: **v1.3.1** (PATCH bump - small fix)

**Commands**:
```bash
git add .
git commit -m "fix: button spacing on mobile"
git tag v1.3.1-staging
# Test on staging
git tag v1.3.1
firebase deploy --only hosting
```

---

### **Next Week (New Feature Example)**

**Current version**: v1.3.0

**Your changes**: Add "Schedule Demo Call" feature

**New version**: **v1.4.0** (MINOR bump - new feature)

**Commands**:
```bash
git add .
git commit -m "feat: add schedule demo call feature"
git tag v1.4.0-staging
# Test on staging
git tag v1.4.0
firebase deploy --only hosting
```

---

## 🔄 **Easy Rollback Reference**

### **Quick Rollback Commands**

```bash
# Show recent versions
git tag | tail -5

# Rollback frontend (30 seconds)
firebase hosting:clone v1.2.0:live

# Rollback backend (30 seconds)
gcloud run services update-traffic llm-agents \
  --to-revisions=llm-agents-v1-2-0=100 \
  --region=us-central1

# Or use script (easiest)
./rollback-production.sh
```

---

## 📋 **Version Decision Tree**

```
What did you change?
│
├─ Bug fix / Small tweak / Performance improvement
│  └─ PATCH: v1.2.0 → v1.2.1
│
├─ New feature / New page / Significant improvement
│  └─ MINOR: v1.2.0 → v1.3.0
│
└─ Complete redesign / Breaking changes / Major refactor
   └─ MAJOR: v1.2.0 → v2.0.0
```

---

## 🎯 **Your Next 4 Deployments (Practical Examples)**

### **Deploy 1: Today (Navbar Changes)**
```
Current: v1.2.0
Changes: Navbar, back button, hamburger menu
Type: Significant UI improvements
New Version: v1.3.0 ✅
```

### **Deploy 2: Next Week (Bug Fix)**
```
Current: v1.3.0
Changes: Fix button spacing on mobile
Type: Small CSS fix
New Version: v1.3.1 ✅
```

### **Deploy 3: Two Weeks (New Feature)**
```
Current: v1.3.1
Changes: Add FAQ page, add pricing page
Type: New pages/features
New Version: v1.4.0 ✅
```

### **Deploy 4: One Month (Backend Update)**
```
Current: v1.4.0
Changes: Improve plan generation algorithm
Type: Backend improvement (no user-facing changes)
New Version: v1.4.1 ✅ (or v1.5.0 if significant)
```

---

## 📊 **Version Tracking Table**

| Version | Date | Changes | Type | Rollback To |
|---------|------|---------|------|-------------|
| v1.0.0 | 2024-09-01 | Initial release | Initial | N/A |
| v1.1.0 | 2024-09-15 | Payment integration | Feature | v1.0.0 |
| v1.2.0 | 2024-10-01 | Weekly plan feature | Feature | v1.1.0 |
| **v1.3.0** | **2024-10-16** | **Navbar/UI improvements** | **Feature** | **v1.2.0** |
| v1.3.1 | 2024-10-23 | Button spacing fix | Bugfix | v1.3.0 |
| v1.4.0 | 2024-10-30 | Schedule demo call | Feature | v1.3.1 |
| v2.0.0 | 2024-12-01 | Complete redesign | Major | v1.4.0 |

---

## 🚨 **Rollback Decision Matrix**

| Issue Severity | Rollback Speed | Method | Time |
|----------------|----------------|--------|------|
| **Critical** (Site down) | IMMEDIATE | Firebase hosting rollback | 30 sec |
| **High** (Major feature broken) | URGENT | Cloud Run traffic shift | 30 sec |
| **Medium** (Some users affected) | QUICK | Git checkout + redeploy | 10 min |
| **Low** (Minor issue) | SCHEDULED | Fix in next release | N/A |

---

## 🔧 **Version Management Commands**

### **Create Version**
```bash
# Staging version (test first)
git tag v1.3.0-staging
git push origin v1.3.0-staging

# Production version (after testing)
git tag v1.3.0
git push origin v1.3.0
```

### **List All Versions**
```bash
# List all tags
git tag

# List with dates
git tag -n

# Show recent versions
git tag | tail -10
```

### **View Version Details**
```bash
# Show what changed in v1.3.0
git show v1.3.0

# Compare two versions
git diff v1.2.0 v1.3.0
```

### **Delete Version (if mistake)**
```bash
# Delete local tag
git tag -d v1.3.0

# Delete remote tag
git push origin :refs/tags/v1.3.0
```

### **Rollback to Version**
```bash
# Checkout specific version
git checkout v1.2.0

# Create new branch from old version
git checkout -b rollback/v1.2.0 v1.2.0

# Then build and deploy
npm run build
firebase deploy --only hosting
```

---

## 📋 **Complete Deployment with Versioning**

### **Full Workflow for Today's Changes**

```bash
# STEP 1: Commit changes
git add .
git commit -m "feat: improved navbar, back button, and mobile menu"

# STEP 2: Push to GitHub
git push origin main

# STEP 3: Create staging version
git tag v1.3.0-staging
git push origin v1.3.0-staging

# STEP 4: Build
npm run build

# STEP 5: Deploy to staging
firebase hosting:channel:deploy staging

# Get URL, test thoroughly

# STEP 6: If tests pass, create production version
git tag v1.3.0
git push origin v1.3.0

# STEP 7: Deploy to production
firebase deploy --only hosting

# STEP 8: Deploy backend (if changed)
cd backend
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents:v1.3.0
gcloud run deploy llm-agents \
  --image gcr.io/unschooling-464413/llm-agents:v1.3.0 \
  --tag=v1-3-0

# STEP 9: Log deployment
cat >> DEPLOYMENT_LOG.md << DEPLOY

## v1.3.0 - $(date +'%Y-%m-%d %H:%M:%S')

**Changes**:
- Improved navbar profile button (centered, yellow circle)
- Standardized MinimalBackButton across all pages
- Optimized hamburger menu spacing and mobile fonts
- Reduced navigation bar height

**Type**: UI Improvements (MINOR)
**Deployed by**: Manual
**Status**: ✅ Success
**Rollback to**: v1.2.0 (if needed)

DEPLOY

# STEP 10: Verify
open https://unschooling.in

# STEP 11: Monitor
# Check Firebase Console, Cloud Run logs
```

---

## 🎯 **Quick Reference Card**

### **Version Bumping**
```
Bug fix        → v1.2.0 → v1.2.1 (PATCH)
Small feature  → v1.2.0 → v1.3.0 (MINOR)
Major change   → v1.2.0 → v2.0.0 (MAJOR)
```

### **Rollback Speed**
```
Firebase hosting → 30 seconds
Cloud Run        → 30 seconds
Git + Redeploy   → 10 minutes
```

### **Tag Format**
```
Staging:     v1.3.0-staging
Production:  v1.3.0
```

---

## ✅ **Summary**

**For Today's Navbar Changes**:
- **Version**: v1.3.0 (MINOR - significant UI improvements)
- **Rollback to**: v1.2.0 (if issues)
- **Time to rollback**: 30 seconds

**For Next Week**:
- **Bug fix**: v1.3.1 (PATCH)
- **New feature**: v1.4.0 (MINOR)
- **Rollback**: Same 30-second process

**Easy Rollback**:
```bash
# Option 1 (Fastest)
firebase hosting:clone v1.2.0:live

# Option 2 (Automated)
./rollback-production.sh

# Option 3 (Complete)
git checkout v1.2.0 && npm run build && firebase deploy
```

---

**You have full version control with easy rollback!** 🎯

Every version is tracked, tagged, and can be restored in 30 seconds!

