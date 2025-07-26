// Script to help get Firebase configuration values
// Run this with: node get-firebase-config.js

console.log('=== Firebase Configuration Values ===\n');

console.log('1. REACT_APP_API_BASE_URL:');
console.log('   https://unschooling-backend-790275794964.us-central1.run.app\n');

console.log('2. REACT_APP_FIREBASE_PROJECT_ID:');
console.log('   unschooling-464413\n');

console.log('3. REACT_APP_FIREBASE_AUTH_DOMAIN:');
console.log('   unschooling-464413.firebaseapp.com\n');

console.log('4. REACT_APP_FIREBASE_STORAGE_BUCKET:');
console.log('   unschooling-464413.appspot.com\n');

console.log('5. REACT_APP_FIREBASE_MESSAGING_SENDER_ID:');
console.log('   790275794964\n');

console.log('=== Steps to get remaining values ===\n');

console.log('6. REACT_APP_FIREBASE_API_KEY:');
console.log('   - Go to: https://console.firebase.google.com/project/unschooling-464413/settings/general');
console.log('   - Scroll down to "Your apps" section');
console.log('   - Click on your web app');
console.log('   - Copy the "apiKey" value\n');

console.log('7. REACT_APP_FIREBASE_APP_ID:');
console.log('   - Same page as above');
console.log('   - Copy the "appId" value\n');

console.log('8. FIREBASE_SERVICE_ACCOUNT:');
console.log('   - Go to: https://console.firebase.google.com/project/unschooling-464413/settings/serviceaccounts/adminsdk');
console.log('   - Click "Generate new private key"');
console.log('   - Download the JSON file');
console.log('   - Copy the entire JSON content\n');

console.log('=== GitHub Secrets Setup ===\n');
console.log('1. Go to: https://github.com/gtharun-unschooling/unschooling/settings/secrets/actions');
console.log('2. Click "New repository secret"');
console.log('3. Add each secret with the values above'); 