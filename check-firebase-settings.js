#!/usr/bin/env node

/**
 * Firebase Settings Checker
 * This script helps verify Firebase Console settings for Google Sign-In
 */

const https = require('https');
const fs = require('fs');

console.log('🔧 Firebase Settings Checker for Google Sign-In');
console.log('================================================\n');

// Check if we can access Firebase project
const projectId = 'unschooling-464413';
const firebaseConfig = {
  apiKey: "AIzaSyBX2bZmOUosU-2PXZFQVN_WLLuee_zkFzI",
  authDomain: "unschooling-464413.firebaseapp.com",
  projectId: "unschooling-464413",
  storageBucket: "unschooling-464413.appspot.com",
  messagingSenderId: "790275794964",
  appId: "1:790275794964:web:f981a7f0693cc186631f01"
};

console.log('📋 Current Firebase Configuration:');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing');
console.log('App ID:', firebaseConfig.appId);
console.log('');

console.log('🔍 Manual Verification Steps:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/unschooling-464413');
console.log('2. Navigate to Authentication > Sign-in method');
console.log('3. Ensure Google provider is ENABLED');
console.log('4. Go to Authentication > Settings');
console.log('5. Check "Authorized domains" includes:');
console.log('   - localhost (for development)');
console.log('   - unschooling.in (your production domain)');
console.log('   - unschooling-464413.web.app (Firebase hosting)');
console.log('   - unschooling-464413.firebaseapp.com (Firebase app)');
console.log('');

console.log('🌐 Google Cloud Console Settings:');
console.log('1. Go to: https://console.cloud.google.com/apis/credentials?project=unschooling-464413');
console.log('2. Find your Web application OAuth 2.0 client');
console.log('3. Check "Authorized JavaScript origins" includes:');
console.log('   - https://unschooling.in');
console.log('   - https://unschooling-464413.web.app');
console.log('   - https://unschooling-464413.firebaseapp.com');
console.log('   - http://localhost:3000 (for development)');
console.log('');

console.log('4. Check "Authorized redirect URIs" includes:');
console.log('   - https://unschooling.in/__/auth/handler');
console.log('   - https://unschooling-464413.web.app/__/auth/handler');
console.log('   - https://unschooling-464413.firebaseapp.com/__/auth/handler');
console.log('');

console.log('📝 OAuth Consent Screen:');
console.log('1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=unschooling-464413');
console.log('2. Ensure OAuth consent screen is configured');
console.log('3. Add "unschooling.in" to authorized domains');
console.log('');

console.log('🧪 Test Your Configuration:');
console.log('1. Visit: https://unschooling.in');
console.log('2. Open browser console (F12)');
console.log('3. Look for Firebase initialization logs');
console.log('4. Try Google Sign-In and check for errors');
console.log('');

console.log('🚨 Common Error Messages and Solutions:');
console.log('');
console.log('❌ "This app is not verified"');
console.log('   → Complete OAuth consent screen configuration');
console.log('');
console.log('❌ "Error 400: redirect_uri_mismatch"');
console.log('   → Add all redirect URIs to OAuth client');
console.log('');
console.log('❌ "Error 403: access_denied"');
console.log('   → Check authorized domains in Firebase Console');
console.log('');
console.log('❌ "Error 400: invalid_request"');
console.log('   → Verify JavaScript origins are correct');
console.log('');

console.log('✅ Quick Links:');
console.log('- Firebase Console: https://console.firebase.google.com/project/unschooling-464413');
console.log('- Google Cloud Console: https://console.cloud.google.com/project/unschooling-464413');
console.log('- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=unschooling-464413');
console.log('');

console.log('🎯 Next Steps:');
console.log('1. Follow the manual verification steps above');
console.log('2. Test Google Sign-In on https://unschooling.in');
console.log('3. Check browser console for any error messages');
console.log('4. If issues persist, share the specific error messages');
