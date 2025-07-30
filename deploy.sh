#!/bin/bash

# Firebase Deployment Script with Service Account
# This script automatically sets up the service account and deploys

echo "🚀 Firebase Deployment Script"
echo "============================"

# Check if service account file exists
if [ ! -f "./firebase-service-account.json" ]; then
    echo "❌ Error: firebase-service-account.json not found!"
    echo "📝 Please download the service account key from:"
    echo "   https://console.firebase.google.com/project/unschooling-464413/settings/serviceaccounts/adminsdk"
    echo "   and save it as 'firebase-service-account.json' in this directory"
    exit 1
fi

# Set up environment
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase-service-account.json"
echo "✅ Service account configured: $GOOGLE_APPLICATION_CREDENTIALS"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: https://unschooling-464413.web.app"
else
    echo "❌ Deployment failed!"
    exit 1
fi 