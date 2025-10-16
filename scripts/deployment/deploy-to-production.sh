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

