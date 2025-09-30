#!/bin/bash

# Staging Deployment Script
# Deploys to staging environment for testing before production

set -e

# Configuration
PROJECT_ID="unschooling-464413"
REGION="us-central1"
LLM_SERVICE_NAME="llm-agents-staging"
WAREHOUSE_SERVICE_NAME="warehouse-api-staging"

echo "🧪 Starting STAGING deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install Google Cloud SDK first."
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud first:"
    echo "   gcloud auth login"
    exit 1
fi

# Set project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable aiplatform.googleapis.com

# Build and deploy LLM Agents to staging
echo "🤖 Building and deploying LLM Agents to STAGING..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/$LLM_SERVICE_NAME --file Dockerfile.llm .

echo "🚀 Deploying LLM Agents to Cloud Run STAGING..."
gcloud run deploy $LLM_SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$LLM_SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --timeout 900 \
    --concurrency 80 \
    --set-env-vars="GOOGLE_API_KEY=$GOOGLE_API_KEY"

LLM_URL=$(gcloud run services describe $LLM_SERVICE_NAME --region=$REGION --format="value(status.url)")

# Build and deploy Warehouse API to staging
echo "🏭 Building and deploying Warehouse API to STAGING..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$WAREHOUSE_SERVICE_NAME --file Dockerfile.warehouse .

echo "🚀 Deploying Warehouse API to Cloud Run STAGING..."
gcloud run deploy $WAREHOUSE_SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$WAREHOUSE_SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --timeout 900 \
    --concurrency 80

WAREHOUSE_URL=$(gcloud run services describe $WAREHOUSE_SERVICE_NAME --region=$REGION --format="value(status.url)")

echo "✅ STAGING deployment completed successfully!"
echo ""
echo "🌐 Staging Service URLs:"
echo "   LLM Agents: $LLM_URL"
echo "   Warehouse API: $WAREHOUSE_URL"
echo ""
echo "🔧 Next steps:"
echo "   1. Update env.staging with these URLs"
echo "   2. Test with: ./dev-staging.sh"
echo "   3. If tests pass, deploy to production with: ./deploy-cloud-run.sh"
echo ""
