# 🔐 Firebase Service Account Setup

## **Issue**: GitHub Actions workflow scope permission

The push was rejected because GitHub requires special permissions to create workflow files. Here's how to fix this:

## **Solution 1: Manual Setup (Recommended)**

### **Step 1: Create Firebase Service Account**

```bash
# 1. Install Google Cloud CLI (if not installed)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# 2. Login to Google Cloud
gcloud auth login

# 3. Set project
gcloud config set project unschooling-464413

# 4. Create service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer" \
  --description="Service account for GitHub Actions deployment"

# 5. Grant Firebase Admin role
gcloud projects add-iam-policy-binding unschooling-464413 \
  --member="serviceAccount:github-actions-deployer@unschooling-464413.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"

# 6. Create and download key
gcloud iam service-accounts keys create firebase-service-account.json \
  --iam-account=github-actions-deployer@unschooling-464413.iam.gserviceaccount.com

# 7. Copy the JSON content
cat firebase-service-account.json
```

### **Step 2: Add to GitHub Secrets**

1. Go to: `https://github.com/gtharun-unschooling/unschooling/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: Copy the entire JSON content from step 7

## **Solution 2: Manual Workflow Upload**

Since we can't push the workflow files directly, you can:

1. **Go to GitHub Repository**: `https://github.com/gtharun-unschooling/unschooling`
2. **Create .github/workflows folder** in the web interface
3. **Upload each workflow file** manually:
   - `deploy-firebase.yml`
   - `deploy-development.yml`
   - `deploy-production.yml`
   - `deploy-backend.yml`

## **Solution 3: Use GitHub CLI (if available)**

```bash
# Install GitHub CLI
brew install gh  # macOS
# or
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh  # Ubuntu/Debian

# Login to GitHub
gh auth login

# Push with workflow scope
gh auth refresh -h github.com -s workflow
git push origin development
```

## **Quick Fix: Manual Deployment**

For now, let's deploy manually and set up automated deployment later:

```bash
# Manual deployment
firebase login
firebase use unschooling-464413
firebase deploy
```

## **Next Steps**

1. ✅ **Manual deployment** (now)
2. 🔧 **Fix GitHub Actions** (later)
3. ✅ **Test live website** (now)
4. 🚀 **Set up automation** (when ready)

The important thing is getting your latest changes deployed first!

