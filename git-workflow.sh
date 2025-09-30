#!/bin/bash

# Git Workflow Script for Unschooling Project
# This script helps with common Git operations in Cursor

echo "🚀 Unschooling Git Workflow Helper"
echo "=================================="

case "$1" in
    "status"|"st")
        echo "📊 Git Status:"
        git status
        ;;
    "add")
        echo "➕ Adding files..."
        git add .
        echo "✅ Files added"
        ;;
    "commit")
        if [ -z "$2" ]; then
            echo "❌ Please provide a commit message"
            echo "Usage: ./git-workflow.sh commit 'Your commit message'"
            exit 1
        fi
        echo "💾 Committing changes..."
        git commit -m "$2"
        echo "✅ Changes committed"
        ;;
    "push")
        echo "🚀 Pushing to remote..."
        git push origin main
        echo "✅ Pushed to remote"
        ;;
    "pull")
        echo "⬇️ Pulling from remote..."
        git pull origin main
        echo "✅ Pulled from remote"
        ;;
    "deploy")
        echo "🚀 Full deployment workflow..."
        echo "1. Adding changes..."
        git add .
        echo "2. Committing..."
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "3. Pushing to remote..."
        git push origin main
        echo "4. Building..."
        npm run build
        echo "5. Deploying to Firebase..."
        firebase deploy --only hosting
        echo "✅ Deployment complete!"
        ;;
    "log")
        echo "📝 Recent commits:"
        git log --oneline -10
        ;;
    "branch")
        echo "🌿 Current branch:"
        git branch
        echo "🌿 All branches:"
        git branch -a
        ;;
    "diff")
        echo "🔍 Uncommitted changes:"
        git diff
        ;;
    "help"|*)
        echo "Available commands:"
        echo "  status, st     - Show git status"
        echo "  add            - Add all files"
        echo "  commit 'msg'   - Commit with message"
        echo "  push           - Push to remote"
        echo "  pull           - Pull from remote"
        echo "  deploy         - Full deployment workflow"
        echo "  log            - Show recent commits"
        echo "  branch         - Show branches"
        echo "  diff           - Show uncommitted changes"
        echo "  help           - Show this help"
        ;;
esac
