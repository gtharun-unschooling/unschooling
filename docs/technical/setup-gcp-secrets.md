# 🔐 Google Cloud Setup for Automated Backend Deployment

## Required GitHub Secrets

To enable automated backend deployment, you need to set up these GitHub secrets:

### 1. GCP_SA_KEY (Google Cloud Service Account Key)

**Steps to create:**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select project: `unschooling-464413`

2. **Create Service Account:**
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Name: `github-actions-deploy`
   - Description: `Service account for GitHub Actions backend deployment`

3. **Assign Required Roles:**
   - Cloud Run Admin
   - Cloud Build Editor
   - Storage Admin
   - Service Account User

4. **Create and Download Key:**
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the JSON file

5. **Add to GitHub Secrets:**
   - Go to: https://github.com/gtharun-unschooling/unschooling/settings/secrets/actions
   - Click "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: Paste the entire JSON content from the downloaded file

### 2. GOOGLE_API_KEY (Optional - for LLM features)

**Steps to create:**

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/
   - Create a new API key

2. **Add to GitHub Secrets:**
   - Go to: https://github.com/gtharun-unschooling/unschooling/settings/secrets/actions
   - Click "New repository secret"
   - Name: `GOOGLE_API_KEY`
   - Value: Your API key

## 🚀 How It Works

Once you set up these secrets, the workflow will:

1. **Trigger automatically** when you push changes to the `backend/` folder
2. **Build and deploy** your backend to Google Cloud Run
3. **Run health checks** to ensure deployment success
4. **Test plan generation** with a sample child profile
5. **Update the live website** automatically

## ✅ Verification

After setup, you can verify the deployment by:

1. **Check GitHub Actions:** https://github.com/gtharun-unschooling/unschooling/actions
2. **Test the live endpoint:** https://llm-agents-44gsrw22gq-uc.a.run.app/health
3. **Visit the website:** https://unschooling.in/customised-weekly-plan

## 🔧 Manual Setup Commands (Alternative)

If you prefer to set up the service account manually:

```bash
# Create service account
gcloud iam service-accounts create github-actions-deploy \
    --display-name="GitHub Actions Deploy" \
    --description="Service account for GitHub Actions backend deployment"

# Assign roles
gcloud projects add-iam-policy-binding unschooling-464413 \
    --member="serviceAccount:github-actions-deploy@unschooling-464413.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding unschooling-464413 \
    --member="serviceAccount:github-actions-deploy@unschooling-464413.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding unschooling-464413 \
    --member="serviceAccount:github-actions-deploy@unschooling-464413.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create and download key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions-deploy@unschooling-464413.iam.gserviceaccount.com
```

## 🎯 Next Steps

1. **Set up the secrets** using the steps above
2. **Push any change** to the backend folder
3. **Watch the deployment** in GitHub Actions
4. **Test the live website** to see the changes

The system will now automatically deploy your backend changes whenever you push to the main branch!
