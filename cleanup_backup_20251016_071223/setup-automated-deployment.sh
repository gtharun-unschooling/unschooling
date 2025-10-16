#!/bin/bash

# 🚀 Automated Deployment Setup Script
# This script helps you set up automated deployment for your unschooling project

set -e

echo "🚀 Setting up Automated Deployment for Unschooling Project"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory confirmed"

# Create .github/workflows directory if it doesn't exist
mkdir -p .github/workflows
echo "✅ Created .github/workflows directory"

# Make scripts executable
chmod +x .github/workflows/*.yml 2>/dev/null || true
chmod +x setup-gcp-secrets.md 2>/dev/null || true

echo ""
echo "📋 Next Steps to Complete Setup:"
echo "================================"
echo ""
echo "1. 🔐 Set up Google Cloud Service Account:"
echo "   - Follow instructions in: setup-gcp-secrets.md"
echo "   - Create service account with required permissions"
echo "   - Download JSON key file"
echo ""
echo "2. 🔑 Add GitHub Secrets:"
echo "   - Go to: https://github.com/gtharun-unschooling/unschooling/settings/secrets/actions"
echo "   - Add these secrets:"
echo "     • GCP_SA_KEY (paste the entire JSON content)"
echo "     • GOOGLE_API_KEY (optional, for LLM features)"
echo "     • FIREBASE_SERVICE_ACCOUNT (if not already set)"
echo ""
echo "3. 🚀 Test the Deployment:"
echo "   - Make any change to backend/ folder"
echo "   - Push to main branch"
echo "   - Watch deployment in: https://github.com/gtharun-unschooling/unschooling/actions"
echo ""
echo "4. ✅ Verify Live Website:"
echo "   - Frontend: https://unschooling.in"
echo "   - Backend: https://llm-agents-44gsrw22gq-uc.a.run.app/health"
echo "   - Test page: https://unschooling.in/customised-weekly-plan"
echo ""
echo "🎯 What This Setup Provides:"
echo "============================"
echo "✅ Automatic frontend deployment to Firebase Hosting"
echo "✅ Automatic backend deployment to Google Cloud Run"
echo "✅ Health checks and testing after deployment"
echo "✅ Real data integration (400+ topics, 63 niches, 18 growth pillars)"
echo "✅ No more manual deployments needed"
echo "✅ No more 'Reflection Day' fallback activities"
echo ""
echo "📁 Files Created:"
echo "================="
echo "✅ .github/workflows/deploy-backend.yml - Backend deployment"
echo "✅ .github/workflows/full-deployment.yml - Full stack deployment"
echo "✅ setup-gcp-secrets.md - Setup instructions"
echo ""
echo "🎉 Setup script completed! Follow the next steps above to enable automated deployment."
