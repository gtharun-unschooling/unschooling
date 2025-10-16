#!/bin/bash

# Rollback Production to Previous Version
set -e

echo "⏪ PRODUCTION ROLLBACK"
echo "====================="

# Show recent versions
echo "Recent production versions:"
git tag | grep -v staging | tail -5

echo ""
echo "Enter version to rollback to (e.g., v1.2.0):"
read ROLLBACK_VERSION

# Confirm
echo ""
echo "⚠️  ROLLBACK CONFIRMATION"
echo "========================"
echo "  Current: $(git describe --tags --abbrev=0 2>/dev/null || echo 'No tags')"
echo "  Rollback to: $ROLLBACK_VERSION"
echo ""
read -p "Proceed with rollback? (yes/no) " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Deploy backend (fastest rollback)
echo "🔧 Rolling back backend..."
cd backend
gcloud run services update-traffic llm-agents \
  --to-tags=${ROLLBACK_VERSION//./-}=100 \
  --region us-central1

cd ..

echo ""
echo "✅ ROLLBACK COMPLETE"
echo "==================="
echo "Backend rolled back to: $ROLLBACK_VERSION"
echo ""
echo "⚠️  Note: Frontend rollback requires rebuild and redeploy"
echo "If needed, checkout version and redeploy:"
echo "  git checkout $ROLLBACK_VERSION"
echo "  npm run build"
echo "  firebase deploy --only hosting"
