#!/bin/bash

echo "🚀 MANUAL DEPLOYMENT - GETTING YOUR CHANGES LIVE"
echo "================================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "🔐 Logging into Firebase..."
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
echo "🎉 All your latest changes are now deployed!"
echo "📱 Test the website to verify everything works"
echo ""
echo "🔧 Next: Set up automated deployment later"

