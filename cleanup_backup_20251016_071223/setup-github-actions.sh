#!/bin/bash

echo "🚀 SETTING UP GITHUB ACTIONS FOR AUTOMATED DEPLOYMENT"
echo "======================================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "📦 Installing Google Cloud CLI..."
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
fi

echo "✅ Prerequisites check completed"

# Create .github/workflows directory if it doesn't exist
mkdir -p .github/workflows

echo "📁 Created .github/workflows directory"

# Check if workflow files exist
if [ -f ".github/workflows/deploy-firebase.yml" ]; then
    echo "✅ Main deployment workflow exists"
else
    echo "❌ Main deployment workflow missing"
fi

if [ -f ".github/workflows/deploy-development.yml" ]; then
    echo "✅ Development deployment workflow exists"
else
    echo "❌ Development deployment workflow missing"
fi

if [ -f ".github/workflows/deploy-production.yml" ]; then
    echo "✅ Production deployment workflow exists"
else
    echo "❌ Production deployment workflow missing"
fi

if [ -f ".github/workflows/deploy-backend.yml" ]; then
    echo "✅ Backend deployment workflow exists"
else
    echo "❌ Backend deployment workflow missing"
fi

echo ""
echo "🔐 NEXT STEPS:"
echo "=============="
echo "1. Go to GitHub repository settings"
echo "2. Add secrets:"
echo "   - FIREBASE_SERVICE_ACCOUNT"
echo "   - GCP_SA_KEY (optional)"
echo "3. Commit and push these changes"
echo "4. Check Actions tab for deployment"

echo ""
echo "📚 For detailed instructions, see: GITHUB_ACTIONS_SETUP.md"

echo ""
echo "🎉 GitHub Actions setup completed!"
echo "Ready for automated deployment! 🚀"

