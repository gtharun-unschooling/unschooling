#!/bin/bash

# Deploy Backend to Staging Environment (Google Cloud Run)
# This script requires gcloud CLI to be installed and authenticated

set -e

echo "🔧 DEPLOYING BACKEND TO STAGING"
echo "================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ ERROR: gcloud CLI is not installed"
    echo ""
    echo "📦 Install gcloud CLI:"
    echo "   macOS: brew install google-cloud-sdk"
    echo "   Or download from: https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "🔐 Then authenticate:"
    echo "   gcloud auth login"
    echo "   gcloud config set project unschooling-464413"
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ ERROR: Not authenticated with gcloud"
    echo ""
    echo "🔐 Run: gcloud auth login"
    exit 1
fi

# Check project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ "$CURRENT_PROJECT" != "unschooling-464413" ]; then
    echo "⚠️  Warning: Current project is '$CURRENT_PROJECT'"
    echo "   Setting project to 'unschooling-464413'..."
    gcloud config set project unschooling-464413
fi

# Navigate to backend directory
cd "$(dirname "$0")/../../backend" || exit 1

echo ""
echo "📋 Deployment Details:"
echo "  Service: llm-agents-staging"
echo "  Region: us-central1"
echo "  Project: unschooling-464413"
echo "  Image: gcr.io/unschooling-464413/llm-agents-staging"
echo ""

# Build and push Docker image
echo "🔨 Building Docker image..."
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents-staging

# Deploy to Cloud Run
echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy llm-agents-staging \
  --image gcr.io/unschooling-464413/llm-agents-staging \
  --region us-central1 \
  --platform managed \
  --memory 1Gi \
  --cpu 1 \
  --allow-unauthenticated \
  --timeout 300 \
  --max-instances 10

# Get the deployed URL
SERVICE_URL=$(gcloud run services describe llm-agents-staging \
  --region us-central1 \
  --format 'value(status.url)')

echo ""
echo "✅ BACKEND DEPLOYMENT COMPLETE"
echo "==============================="
echo "🌐 Backend URL: $SERVICE_URL"
echo ""
echo "🧪 Test the backend:"
echo "   curl $SERVICE_URL/health"
echo ""
echo "📝 Next: Update frontend to use this URL:"
echo "   Update scripts/deployment/deploy-to-staging.sh"
echo "   Set REACT_APP_API_BASE_URL=$SERVICE_URL"
echo ""

