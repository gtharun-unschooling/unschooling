#!/bin/bash
# Quick deployment script - Run after firebase login

echo "🚀 Quick Deploy Script"
echo "======================"
echo ""

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase"
    echo "Run: firebase login --reauth"
    exit 1
fi

# Check branch
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes"
    read -p "Commit now? (y/n): " COMMIT
    if [[ $COMMIT =~ ^[Yy]$ ]]; then
        git add .
        read -p "Commit message: " MSG
        git commit -m "$MSG"
        git push origin $BRANCH
    fi
fi

# Deploy
if [ "$BRANCH" == "staging" ]; then
    echo "Deploying to staging..."
    npm run deploy:staging
elif [ "$BRANCH" == "main" ]; then
    echo "Deploying to production..."
    npm run deploy:production
else
    echo "❌ Must be on 'staging' or 'main' branch"
    exit 1
fi
