#!/bin/bash

echo "🚀 DEPLOYING VERSION 1 TO PRODUCTION"
echo "===================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (you'll need to do this manually)
echo "🔐 Please login to Firebase:"
echo "Run: firebase login"
echo "Then run: firebase use unschooling-464413"

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --project unschooling-464413

echo "✅ Version 1 deployed successfully!"
echo "🌐 Your website should be available at:"
echo "   https://unschooling-464413.web.app"
echo "   https://unschooling-464413.firebaseapp.com"

echo ""
echo "📋 NEXT STEPS:"
echo "1. Test all routes on the live website"
echo "2. Test login functionality"
echo "3. Test child profile creation"
echo "4. Test learning plan generation"
echo "5. Verify mobile responsiveness"
echo ""
echo "🎯 Version 1 is now LIVE and ready for users!"

