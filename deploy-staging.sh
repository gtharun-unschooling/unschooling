#!/bin/bash

# 🧪 STAGING DEPLOYMENT SCRIPT
# Use this script to deploy to staging environment

set -e  # Exit on any error

echo "🧪 STAGING DEPLOYMENT STARTING..."
echo "================================="

# Check if we're on staging branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "staging" ]; then
    echo "❌ ERROR: You must be on the 'staging' branch to deploy to staging"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please run: git checkout staging"
    exit 1
fi

# Get latest changes
echo "📥 Pulling latest changes..."
git pull origin staging

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ ERROR: Build failed - build directory not found"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase (staging project)
echo "🚀 Deploying to Firebase Staging..."
# Note: You'll need to set up a separate Firebase project for staging
# firebase use staging  # Switch to staging project
# firebase deploy --only hosting

echo "⚠️  STAGING DEPLOYMENT SKIPPED"
echo "================================="
echo "📝 To set up staging deployment:"
echo "1. Create a separate Firebase project for staging"
echo "2. Configure firebase.json for staging"
echo "3. Uncomment the staging deployment commands above"
echo ""
echo "For now, you can test locally:"
echo "npm start  # Test on localhost:3000"