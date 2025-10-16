#!/bin/bash

echo "🚀 QUICK DEPLOYMENT SCRIPT"
echo "=========================="

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "🔐 Re-authenticating with Firebase..."
firebase login --reauth

echo "🎯 Setting Firebase project..."
firebase use unschooling-464413

echo "🏗️ Building application..."
npm run build

echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "🌐 Your website is now live at:"
echo "   https://unschooling-464413.web.app"
echo "   https://unschooling-464413.firebaseapp.com"
echo ""
echo "🧪 Testing deployment..."
node test-live-website.js

echo ""
echo "🎉 DEPLOYMENT AND TESTING COMPLETE!"
echo "Version 1 is now LIVE! 🚀"

