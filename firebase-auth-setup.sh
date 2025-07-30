#!/bin/bash

# Firebase Authentication Setup Script
# This script helps manage Firebase authentication tokens

echo "🔥 Firebase Authentication Setup"
echo "================================"

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools@latest
fi

# Function to generate new token
generate_token() {
    echo "🔄 Generating new Firebase token..."
    firebase login:ci --no-localhost
}

# Function to test current token
test_token() {
    echo "🧪 Testing current Firebase token..."
    firebase projects:list --token "$FIREBASE_TOKEN" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Token is valid!"
        return 0
    else
        echo "❌ Token is invalid or expired"
        return 1
    fi
}

# Function to deploy with token
deploy_with_token() {
    echo "🚀 Deploying to Firebase..."
    firebase deploy --only hosting --project unschooling-464413 --token "$FIREBASE_TOKEN"
}

# Main script logic
echo "Choose an option:"
echo "1. Generate new token"
echo "2. Test current token"
echo "3. Deploy to Firebase"
echo "4. Setup permanent service account (recommended)"
echo "5. Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        generate_token
        ;;
    2)
        test_token
        ;;
    3)
        deploy_with_token
        ;;
    4)
        echo "🔧 Setting up permanent service account..."
        echo "📝 Instructions:"
        echo "1. Go to https://console.firebase.google.com/project/unschooling-464413/settings/serviceaccounts/adminsdk"
        echo "2. Click 'Generate new private key'"
        echo "3. Download the JSON file"
        echo "4. Save it as 'firebase-service-account.json' in your project root"
        echo "5. Add it to .gitignore"
        echo ""
        echo "Then you can use:"
        echo "export GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json"
        echo "firebase deploy --only hosting"
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac 