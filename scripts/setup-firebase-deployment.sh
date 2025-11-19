#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
#  FIREBASE DEPLOYMENT SETUP SCRIPT
# ═══════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

print_step "🔧 FIREBASE DEPLOYMENT SETUP"

# Step 1: Check Firebase CLI
print_step "Step 1: Checking Firebase CLI"
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    print_success "Firebase CLI installed: $FIREBASE_VERSION"
else
    print_error "Firebase CLI not found. Install with: npm install -g firebase-tools"
    exit 1
fi

# Step 2: Check Firebase Login Status
print_step "Step 2: Checking Firebase Authentication"
if firebase projects:list &> /dev/null; then
    print_success "Already logged in to Firebase"
    firebase projects:list
else
    print_warning "Not logged in to Firebase"
    echo ""
    echo "To login, run this command in YOUR terminal (not here):"
    echo "  firebase login --reauth"
    echo ""
    echo "This will open a browser for authentication."
    echo "After login, run this script again."
    exit 1
fi

# Step 3: Verify Project Configuration
print_step "Step 3: Verifying Project Configuration"
if [ -f ".firebaserc" ]; then
    print_success ".firebaserc found"
    cat .firebaserc
else
    print_error ".firebaserc not found"
    exit 1
fi

# Step 4: Check firebase.json
print_step "Step 4: Checking firebase.json"
if [ -f "firebase.json" ]; then
    print_success "firebase.json found"
else
    print_error "firebase.json not found"
    exit 1
fi

# Step 5: Check Git Setup
print_step "Step 5: Checking Git Configuration"
if git remote -v | grep -q "origin"; then
    print_success "Git remote configured"
    git remote -v
else
    print_error "Git remote not configured"
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
print_success "Current branch: $CURRENT_BRANCH"

# Step 6: Check for uncommitted changes
print_step "Step 6: Checking Git Status"
if git diff-index --quiet HEAD --; then
    print_success "No uncommitted changes"
else
    print_warning "You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Commit changes now? (y/n): " COMMIT_NOW
    if [[ $COMMIT_NOW =~ ^[Yy]$ ]]; then
        git add .
        read -p "Commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
    fi
fi

# Step 7: Test Firebase Connection
print_step "Step 7: Testing Firebase Connection"
PROJECT_ID=$(grep -o '"default": "[^"]*"' .firebaserc | cut -d'"' -f4)
if [ -n "$PROJECT_ID" ]; then
    print_success "Project ID: $PROJECT_ID"
    firebase use $PROJECT_ID
    print_success "Firebase project set to: $PROJECT_ID"
else
    print_error "Could not determine project ID"
    exit 1
fi

# Step 8: Summary
print_step "✅ SETUP COMPLETE"
echo ""
echo "Your deployment workflow is ready!"
echo ""
echo "📋 Quick Commands:"
echo "  Staging:   npm run deploy:staging"
echo "  Production: npm run deploy:production"
echo "  Or use:    ./scripts/deployment/deploy.sh"
echo ""
echo "🌐 Current Status:"
echo "  Branch: $CURRENT_BRANCH"
echo "  Project: $PROJECT_ID"
echo "  Firebase: ✅ Configured"
echo "  Git: ✅ Configured"
echo ""

