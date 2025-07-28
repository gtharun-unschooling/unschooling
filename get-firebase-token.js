#!/usr/bin/env node

/**
 * Script to generate Firebase CI token for GitHub Actions deployment
 * 
 * Usage:
 * 1. Run: node get-firebase-token.js
 * 2. Follow the prompts to login and generate token
 * 3. Copy the token to GitHub Secrets as FIREBASE_TOKEN
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase CI Token Generator');
console.log('==============================');
console.log('');
console.log('This script will help you generate a Firebase CI token for GitHub Actions.');
console.log('');

async function generateToken() {
  try {
    console.log('1. First, let\'s check if you\'re logged into Firebase...');
    
    try {
      execSync('firebase --version', { stdio: 'pipe' });
      console.log('✅ Firebase CLI is installed');
    } catch (error) {
      console.log('❌ Firebase CLI not found. Please install it first:');
      console.log('   npm install -g firebase-tools');
      process.exit(1);
    }
    
    console.log('');
    console.log('2. Now we\'ll generate a CI token...');
    console.log('   This will open a browser for authentication.');
    console.log('');
    
    const token = execSync('firebase login:ci --no-localhost', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Extract token from output
    const tokenMatch = token.match(/1\/([a-zA-Z0-9_-]+)/);
    if (tokenMatch) {
      const firebaseToken = tokenMatch[1];
      console.log('');
      console.log('🎉 SUCCESS! Firebase CI Token Generated');
      console.log('=====================================');
      console.log('');
      console.log('Your Firebase CI token is:');
      console.log('');
      console.log(`   ${firebaseToken}`);
      console.log('');
      console.log('📋 Next Steps:');
      console.log('1. Go to your GitHub repository');
      console.log('2. Go to Settings > Secrets and variables > Actions');
      console.log('3. Click "New repository secret"');
      console.log('4. Name: FIREBASE_TOKEN');
      console.log('5. Value: ' + firebaseToken);
      console.log('6. Click "Add secret"');
      console.log('');
      console.log('✅ After adding the secret, your GitHub Actions will be able to deploy to Firebase!');
      
    } else {
      console.log('❌ Could not extract token from Firebase output');
      console.log('Please try running manually:');
      console.log('   firebase login:ci --no-localhost');
    }
    
  } catch (error) {
    console.log('❌ Error generating token:', error.message);
    console.log('');
    console.log('Alternative manual method:');
    console.log('1. Run: firebase login:ci --no-localhost');
    console.log('2. Follow the browser authentication');
    console.log('3. Copy the token that appears');
    console.log('4. Add it to GitHub Secrets as FIREBASE_TOKEN');
  }
}

generateToken().then(() => {
  rl.close();
  process.exit(0);
}).catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
}); 