# 🚀 GitHub Actions Setup Guide

## 📋 **OVERVIEW**

This guide will help you set up automated deployment using GitHub Actions for your Unschooling platform.

## 🔐 **REQUIRED GITHUB SECRETS**

You need to add these secrets to your GitHub repository:

### **Step 1: Go to GitHub Repository Settings**
1. Go to: `https://github.com/gtharun-unschooling/unschooling`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **Step 2: Add Firebase Service Account Secret**

**Secret Name**: `FIREBASE_SERVICE_ACCOUNT`

**How to get the value**:
```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Generate service account key
firebase projects:list
firebase use unschooling-464413
firebase init hosting

# 4. Generate service account key
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer" \
  --description="Service account for GitHub Actions deployment"

# 5. Grant necessary permissions
gcloud projects add-iam-policy-binding unschooling-464413 \
  --member="serviceAccount:github-actions-deployer@unschooling-464413.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"

# 6. Create and download key
gcloud iam service-accounts keys create firebase-service-account.json \
  --iam-account=github-actions-deployer@unschooling-464413.iam.gserviceaccount.com

# 7. Copy the contents of firebase-service-account.json
cat firebase-service-account.json
```

**Copy the entire JSON content and paste it as the secret value.**

### **Step 3: Add GCP Service Account Secret (Optional - for backend)**

**Secret Name**: `GCP_SA_KEY`

**Value**: Same as above - the JSON content from `firebase-service-account.json`

## 🎯 **DEPLOYMENT TRIGGERS**

### **Automatic Deployments**:

1. **Main Branch Push** → Deploy to Production
2. **Development Branch Push** → Deploy to Development Channel
3. **Version Tags** (v1.0.0) → Deploy to Production

### **Manual Deployments**:
- Go to **Actions** tab in GitHub
- Select the workflow
- Click **Run workflow**

## 📊 **DEPLOYMENT CHANNELS**

### **Production**: `https://unschooling-464413.web.app`
- Triggered by: Push to `main` branch
- Status: Live production site

### **Development**: `https://unschooling-464413--development.web.app`
- Triggered by: Push to `development` branch
- Status: Testing environment

## 🔧 **WORKFLOW FILES CREATED**

1. **`.github/workflows/deploy-firebase.yml`** - Main deployment
2. **`.github/workflows/deploy-development.yml`** - Development deployment
3. **`.github/workflows/deploy-production.yml`** - Production deployment
4. **`.github/workflows/deploy-backend.yml`** - Backend deployment

## ✅ **TESTING THE SETUP**

### **Step 1: Commit and Push Changes**
```bash
git add .github/
git commit -m "🚀 Add GitHub Actions for automated deployment"
git push origin development
```

### **Step 2: Check GitHub Actions**
1. Go to **Actions** tab in GitHub
2. You should see the workflow running
3. Wait for it to complete (usually 2-3 minutes)

### **Step 3: Verify Deployment**
- Check the deployment URL
- Verify all features work correctly

## 🚨 **TROUBLESHOOTING**

### **If Deployment Fails**:

1. **Check GitHub Actions Logs**:
   - Go to Actions tab
   - Click on failed workflow
   - Check the error logs

2. **Common Issues**:
   - Missing secrets
   - Incorrect Firebase project ID
   - Build errors
   - Permission issues

3. **Fix and Retry**:
   - Fix the issue
   - Push again or manually trigger workflow

## 🎉 **BENEFITS OF AUTOMATED DEPLOYMENT**

✅ **Automatic**: Deploy on every push
✅ **Consistent**: Same process every time
✅ **Fast**: Deploy in 2-3 minutes
✅ **Reliable**: No manual errors
✅ **Trackable**: Full deployment history
✅ **Rollback**: Easy to revert changes

## 📱 **NEXT STEPS**

1. ✅ Add GitHub secrets (5 minutes)
2. ✅ Push changes to trigger first deployment (2 minutes)
3. ✅ Verify deployment works (3 minutes)
4. ✅ Test all features on live site (5 minutes)

**Total Setup Time: 15 minutes**

---

## 🚀 **READY FOR AUTOMATED DEPLOYMENT!**

Once set up, your deployment process will be:
1. **Code changes** → Push to GitHub
2. **GitHub Actions** → Automatically builds and deploys
3. **Live website** → Updated within 3 minutes

**No more manual deployments!** 🎉
