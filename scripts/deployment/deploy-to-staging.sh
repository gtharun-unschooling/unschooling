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
export CI=false  # Allow build with warnings
DISABLE_ESLINT_PLUGIN=true npm run build

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

