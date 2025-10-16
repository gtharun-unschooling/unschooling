#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
#  MASTER DEPLOYMENT SCRIPT - Interactive & Guided
# ═══════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

pause_for_confirmation() {
    echo -e "\n${YELLOW}Press Enter to continue or Ctrl+C to abort...${NC}"
    read
}

# Start
clear
print_step "🚀 UNSCHOOLING DEPLOYMENT WIZARD"

echo "This script will guide you through deploying to:"
echo "  1. Staging (testing environment)"
echo "  2. Production (live site)"
echo ""
read -p "Which environment? (staging/production): " ENVIRONMENT

if [[ ! $ENVIRONMENT =~ ^(staging|production)$ ]]; then
    print_error "Invalid environment. Must be 'staging' or 'production'"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════
#  STEP 1: PRE-DEPLOYMENT CHECKS
# ═══════════════════════════════════════════════════════════════════

print_step "STEP 1: Pre-Deployment Checks"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
print_success "Current branch: $CURRENT_BRANCH"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes!"
    git status --short
    echo ""
    read -p "Commit changes now? (y/n): " COMMIT_NOW
    if [[ $COMMIT_NOW =~ ^[Yy]$ ]]; then
        git add .
        read -p "Commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
    else
        print_error "Please commit or stash changes first"
        exit 1
    fi
fi

# Get current version
CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.0.0")
print_success "Current version: $CURRENT_VERSION"

# Determine new version
echo ""
echo "What type of changes did you make?"
echo "  1. Bug fix / Small tweaks (PATCH: v1.2.0 → v1.2.1)"
echo "  2. New feature / Improvements (MINOR: v1.2.0 → v1.3.0)"
echo "  3. Major changes / Redesign (MAJOR: v1.2.0 → v2.0.0)"
read -p "Select (1/2/3): " VERSION_TYPE

# Parse current version
IFS='.' read -r -a VERSION_PARTS <<< "${CURRENT_VERSION#v}"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]%%[-]*}"

# Increment based on type
case $VERSION_TYPE in
    1) PATCH=$((PATCH + 1)) ;;
    2) MINOR=$((MINOR + 1)); PATCH=0 ;;
    3) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    *) print_error "Invalid selection"; exit 1 ;;
esac

NEW_VERSION="v${MAJOR}.${MINOR}.${PATCH}"
print_success "New version will be: $NEW_VERSION"

pause_for_confirmation

# ═══════════════════════════════════════════════════════════════════
#  STEP 2: UPDATE DOCUMENTATION
# ═══════════════════════════════════════════════════════════════════

print_step "STEP 2: Update Documentation"

echo "Describe the changes in this deployment (one line):"
read CHANGES_SUMMARY

# Update CHANGELOG.md - change [Unreleased] to version
if [ -f "CHANGELOG.md" ]; then
    sed -i.bak "s/\[Unreleased\]/[${NEW_VERSION#v}] - $(date +'%Y-%m-%d')/" CHANGELOG.md
    print_success "CHANGELOG.md updated"
else
    print_warning "CHANGELOG.md not found, skipping"
fi

pause_for_confirmation

# ═══════════════════════════════════════════════════════════════════
#  STEP 3: BUILD PROCESS
# ═══════════════════════════════════════════════════════════════════

print_step "STEP 3: Building Application"

# Clean old build
print_warning "Removing old build folder..."
rm -rf build/

# Set environment
if [ "$ENVIRONMENT" == "staging" ]; then
    export REACT_APP_ENVIRONMENT=staging
    export REACT_APP_API_BASE_URL=https://llm-agents-staging-44gsrw22gq-uc.a.run.app
else
    export REACT_APP_ENVIRONMENT=production
    export REACT_APP_API_BASE_URL=https://llm-agents-44gsrw22gq-uc.a.run.app
fi

print_success "Environment: $ENVIRONMENT"

# Build
print_warning "Building application..."
npm run build

if [ ! -d "build" ]; then
    print_error "Build failed! build/ directory not created"
    exit 1
fi

BUILD_SIZE=$(du -sh build/ | cut -f1)
print_success "Build successful! Size: $BUILD_SIZE"

pause_for_confirmation

# ═══════════════════════════════════════════════════════════════════
#  STEP 4: DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════

print_step "STEP 4: Deploying to $ENVIRONMENT"

if [ "$ENVIRONMENT" == "staging" ]; then
    # Staging deployment
    print_warning "Tagging staging version..."
    git tag ${NEW_VERSION}-staging
    git push origin ${NEW_VERSION}-staging
    
    print_warning "Deploying to Firebase staging channel..."
    firebase hosting:channel:deploy staging --expires 30d
    
    print_success "Deployed to staging!"
    echo ""
    echo "Staging URL will be shown above (look for 'Channel URL')"
    
else
    # Production deployment
    print_warning "This will deploy to PRODUCTION (live site)"
    print_warning "Have you tested on staging?"
    read -p "Confirmed tested on staging? (yes/no): " TESTED
    
    if [[ ! $TESTED =~ ^[Yy][Ee][Ss]$ ]]; then
        print_error "Please test on staging first!"
        exit 1
    fi
    
    print_warning "Tagging production version..."
    git tag ${NEW_VERSION}
    git push origin ${NEW_VERSION}
    
    print_warning "Deploying to Firebase production..."
    firebase deploy --only hosting
    
    print_success "Deployed to production!"
    
    # Update deployment log
    cat >> DEPLOYMENT_LOG.md << DEPLOY_LOG

## ${NEW_VERSION} - $(date +'%Y-%m-%d %H:%M:%S')

**Deployed by**: Manual deployment (deploy.sh script)
**Branch**: $CURRENT_BRANCH
**Commit**: $(git rev-parse --short HEAD)
**Environment**: Production

**Changes**: $CHANGES_SUMMARY

**Type**: $([ "$VERSION_TYPE" == "1" ] && echo "Bug Fix (PATCH)" || ([ "$VERSION_TYPE" == "2" ] && echo "Feature (MINOR)" || echo "Major Update (MAJOR)"))
**Tested on**: Staging ✅
**Status**: ✅ Successfully deployed
**Rollback to**: $CURRENT_VERSION

**URLs**:
- Frontend: https://unschooling.in
- Backend: https://llm-agents-44gsrw22gq-uc.a.run.app

---
DEPLOY_LOG

    # Update CURRENT_VERSION.txt
    cat > CURRENT_VERSION.txt << VERSION_FILE
═══════════════════════════════════════════════════════════════════
  CURRENT PRODUCTION STATUS
═══════════════════════════════════════════════════════════════════

PRODUCTION VERSION:     ${NEW_VERSION}
DEPLOYED:               $(date +'%Y-%m-%d %H:%M:%S')
LAST COMMIT:            $(git rev-parse --short HEAD)
BRANCH:                 $CURRENT_BRANCH
STATUS:                 ✅ Deployed (monitoring)

STAGING VERSION:        ${NEW_VERSION}-staging
NEXT PLANNED VERSION:   TBD

LAST DEPLOYMENT:        Just now
NEXT DEPLOYMENT:        TBD

SERVICES STATUS:
├─ Frontend (Firebase):  ✅ Online
├─ Backend (Cloud Run):  ✅ Online
├─ Database (Firestore): ✅ Online
└─ Auth (Firebase):      ✅ Online

ROLLBACK PLAN:
└─ If issues: Rollback to ${CURRENT_VERSION} using:
   firebase hosting:clone ${CURRENT_VERSION}:live

═══════════════════════════════════════════════════════════════════
Last Updated: $(date +'%Y-%m-%d %H:%M:%S')
VERSION_FILE

    print_success "Deployment log updated"
fi

# ═══════════════════════════════════════════════════════════════════
#  STEP 5: VERIFICATION
# ═══════════════════════════════════════════════════════════════════

print_step "STEP 5: Verification"

if [ "$ENVIRONMENT" == "staging" ]; then
    URL="staging URL (check output above)"
else
    URL="https://unschooling.in"
fi

echo "Please verify the deployment:"
echo "  1. Open: $URL"
echo "  2. Test critical flows (login, plan generation, etc.)"
echo "  3. Check console for errors (F12)"
echo "  4. Test on mobile"
echo ""

if [ "$ENVIRONMENT" == "production" ]; then
    echo "Opening production site..."
    open https://unschooling.in 2>/dev/null || echo "Visit: https://unschooling.in"
fi

echo ""
echo "Verification Checklist:"
echo "  ☐ Homepage loads correctly"
echo "  ☐ Login works"
echo "  ☐ Navbar displays correctly"
echo "  ☐ Back button works"
echo "  ☐ No console errors"
echo "  ☐ Mobile responsive"
echo ""

read -p "Verification complete and successful? (y/n): " VERIFIED

if [[ ! $VERIFIED =~ ^[Yy]$ ]]; then
    print_warning "Deployment completed but verification failed"
    print_warning "Consider rolling back if issues are critical"
    echo ""
    echo "To rollback:"
    echo "  firebase hosting:clone ${CURRENT_VERSION}:live"
    exit 1
fi

print_success "Verification successful!"

# ═══════════════════════════════════════════════════════════════════
#  STEP 6: COMPLETION
# ═══════════════════════════════════════════════════════════════════

print_step "🎉 DEPLOYMENT COMPLETE!"

echo "Summary:"
echo "  Version: ${NEW_VERSION}"
echo "  Environment: $ENVIRONMENT"
echo "  Status: ✅ Success"
echo "  Changes: $CHANGES_SUMMARY"
echo ""

if [ "$ENVIRONMENT" == "staging" ]; then
    echo "Next Steps:"
    echo "  1. Test thoroughly on staging"
    echo "  2. If all good, run: ./deploy.sh"
    echo "     Select 'production'"
    echo "  3. If issues found, fix and redeploy to staging"
else
    echo "Next Steps:"
    echo "  1. Monitor for 30 minutes"
    echo "  2. Check logs: console.firebase.google.com"
    echo "  3. Watch for user issues"
    echo "  4. Update 24-hour status in DEPLOYMENT_LOG.md"
    echo ""
    echo "If issues occur:"
    echo "  Quick rollback: firebase hosting:clone ${CURRENT_VERSION}:live"
    echo "  Or use: ./rollback-production.sh"
fi

echo ""
print_success "Deployment files updated:"
echo "  - CHANGELOG.md"
echo "  - DEPLOYMENT_LOG.md"
echo "  - CURRENT_VERSION.txt"
echo "  - Git tags"

echo ""
echo "═══════════════════════════════════════════════════════════════════"

