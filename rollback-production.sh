#!/bin/bash

# 🚨 EMERGENCY ROLLBACK SCRIPT
# Use this script to quickly rollback production to previous version

set -e  # Exit on any error

echo "🚨 EMERGENCY ROLLBACK STARTING..."
echo "================================="

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ ERROR: You must be on the 'main' branch to rollback"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please run: git checkout main"
    exit 1
fi

# Show recent commits
echo "📋 Recent commits:"
git log --oneline -10

echo ""
echo "⚠️  WARNING: This will rollback to the previous commit!"
echo "Are you sure you want to continue? (y/N)"
read -r response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Get the previous commit hash
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
echo "🔄 Rolling back to commit: $PREVIOUS_COMMIT"

# Reset to previous commit
git reset --hard HEAD~1

# Build and deploy
echo "🔨 Building application..."
npm run build

echo "🚀 Deploying rollback to Firebase..."
firebase deploy --only hosting

echo ""
echo "✅ ROLLBACK COMPLETED!"
echo "======================"
echo "🔄 Production rolled back to previous version"
echo "📊 Rollback Summary:"
echo "- Rolled back to: $PREVIOUS_COMMIT"
echo "- Date: $(date)"
echo ""
echo "🔍 Next Steps:"
echo "1. Test the rolled-back website"
echo "2. Investigate the issue that caused the rollback"
echo "3. Fix the issue on development branch"
echo "4. Test thoroughly before next deployment"
