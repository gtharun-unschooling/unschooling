#!/bin/bash

# Google Cloud Run Deployment Script
# Deploys LLM Agents and Warehouse Management systems

set -e

# Configuration
PROJECT_ID="unschooling-464413"
REGION="us-central1"
LLM_SERVICE_NAME="llm-agents"
WAREHOUSE_SERVICE_NAME="warehouse-api"

echo "🚀 Starting Google Cloud Run deployment..."

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

# Build and deploy LLM Agents
echo "🤖 Building and deploying LLM Agents..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/$LLM_SERVICE_NAME --file Dockerfile.llm .

echo "🚀 Deploying LLM Agents to Cloud Run..."
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

# Build and deploy Warehouse API
echo "🏭 Building and deploying Warehouse API..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$WAREHOUSE_SERVICE_NAME --file Dockerfile.warehouse .

echo "🚀 Deploying Warehouse API to Cloud Run..."
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

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Service URLs:"
echo "   LLM Agents: $LLM_URL"
echo "   Warehouse API: $WAREHOUSE_URL"
echo ""
echo "🔧 Next steps:"
echo "   1. Update your .env file with these URLs:"
echo "      REACT_APP_LLM_ENDPOINT=$LLM_URL"
echo "      REACT_APP_WAREHOUSE_ENDPOINT=$WAREHOUSE_URL"
echo "      REACT_APP_USE_GOOGLE_CLOUD=true"
echo "   2. Restart your frontend application"
echo "   3. All backend operations will now go through Google Cloud Run"
echo ""
echo "🎯 Your system is now running entirely on port 3000 with Cloud Run backend!"
