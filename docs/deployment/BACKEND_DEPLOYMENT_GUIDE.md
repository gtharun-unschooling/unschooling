# Backend Deployment Guide

## Overview

The Unschooling backend is deployed to **Google Cloud Run** as a containerized FastAPI application.

## Prerequisites

1. **Google Cloud SDK (gcloud CLI)**
   - macOS: `brew install google-cloud-sdk`
   - Or download from: https://cloud.google.com/sdk/docs/install

2. **Authentication**
   ```bash
   gcloud auth login
   gcloud config set project unschooling-464413
   ```

3. **Enable APIs** (if not already enabled)
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

## Deployment Steps

### Option 1: Automatic (Recommended)

From the project root:
```bash
./scripts/deployment/deploy-backend-staging.sh
```

This script will:
1. Check for gcloud CLI installation
2. Verify authentication
3. Build and push Docker image to Google Container Registry
4. Deploy to Cloud Run
5. Display the service URL

### Option 2: Manual Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Build and push Docker image**
   ```bash
   gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents-staging
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy llm-agents-staging \
     --image gcr.io/unschooling-464413/llm-agents-staging \
     --region us-central1 \
     --platform managed \
     --memory 1Gi \
     --cpu 1 \
     --allow-unauthenticated \
     --timeout 300 \
     --max-instances 10
   ```

4. **Get the service URL**
   ```bash
   gcloud run services describe llm-agents-staging \
     --region us-central1 \
     --format 'value(status.url)'
   ```

5. **Update frontend configuration**
   ```bash
   # Update scripts/deployment/deploy-to-staging.sh
   # Change REACT_APP_API_BASE_URL to the new staging backend URL
   ```

## Testing

After deployment, test the backend:

```bash
# Health check
curl https://llm-agents-staging-44gsrw22gq-uc.a.run.app/health

# Expected response:
# {"status":"healthy","app_name":"Unschooling Backend - Agent System",...}
```

## Current Backend URLs

- **Production**: `https://llm-agents-44gsrw22gq-uc.a.run.app`
- **Production (Alt)**: `https://llm-agents-790275794964.us-central1.run.app`
- **Staging**: `https://llm-agents-staging-44gsrw22gq-uc.a.run.app` (to be deployed)

## Troubleshooting

### gcloud not found
- Install Google Cloud SDK
- Add to PATH: `export PATH="$PATH:/usr/local/google-cloud-sdk/bin"`

### Authentication errors
```bash
gcloud auth login
gcloud auth application-default login
```

### Permission errors
- Ensure you have "Cloud Run Admin" and "Service Account User" roles
- Check project permissions in Google Cloud Console

### Build failures
- Check Dockerfile syntax
- Verify requirements.txt has all dependencies
- Check Cloud Build logs in Google Cloud Console

## Monitoring

- **Cloud Run Console**: https://console.cloud.google.com/run?project=unschooling-464413
- **Cloud Build Logs**: https://console.cloud.google.com/cloud-build/builds?project=unschooling-464413
- **Service Logs**:
  ```bash
  gcloud run services logs read llm-agents-staging --region us-central1
  ```

