#!/bin/bash

# 🚀 PRODUCTION DEPLOYMENT SCRIPT
# Use this script to safely deploy to production

set -e  # Exit on any error

echo "🚀 PRODUCTION DEPLOYMENT STARTING..."
echo "=================================="

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ ERROR: You must be on the 'main' branch to deploy to production"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please run: git checkout main"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ ERROR: You have uncommitted changes"
    echo "Please commit or stash your changes before deploying"
    exit 1
fi

# Get latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ ERROR: Build failed - build directory not found"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo ""
echo "🎉 PRODUCTION DEPLOYMENT COMPLETED!"
echo "=================================="
echo "✅ Website deployed successfully"
echo "🌐 Your live website is now updated"
echo ""
echo "📊 Deployment Summary:"
echo "- Branch: $CURRENT_BRANCH"
echo "- Commit: $(git rev-parse --short HEAD)"
echo "- Date: $(date)"
echo ""
echo "🔍 Next Steps:"
echo "1. Test the live website"
echo "2. Monitor for any issues"
echo "3. Notify customers if needed"