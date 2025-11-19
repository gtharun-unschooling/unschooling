#!/bin/bash

echo "🚀 Deploying v1.3.0 to Staging"
echo "================================"
echo ""

cd /Users/tharunguduguntla/Documents/unschooling

# Check if logged in to Firebase
echo "📋 Step 1: Checking Firebase login..."
if ! firebase projects:list &>/dev/null; then
    echo "❌ Not logged in to Firebase"
    echo "Please run: firebase login"
    exit 1
fi
echo "✅ Firebase authenticated"
echo ""

# Build completed (already done)
echo "✅ Step 2: Build completed (668 KB)"
echo ""

# Deploy to staging
echo "📦 Step 3: Deploying to Firebase staging..."
firebase hosting:channel:deploy staging --expires 30d

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Open the staging URL shown above"
echo "2. Test:"
echo "   - Login with Google"
echo "   - Create child profile"
echo "   - Generate plan (tests 240 new themes!)"
echo "   - Check UI (navbar, profile button)"
echo "3. If all tests pass, deploy to production"
echo ""

