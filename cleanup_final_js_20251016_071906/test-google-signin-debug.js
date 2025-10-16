const puppeteer = require('puppeteer');

async function testGoogleSignInDebug() {
  console.log('🧪 Debugging Google Sign-In Issue...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Listen to page errors
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });
    
    // Step 1: Navigate to login page
    console.log('📱 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Click Google sign-in button and capture errors
    console.log('📱 Step 2: Clicking Google sign-in button...');
    
    // Set up error capture
    let errorCaptured = false;
    const errorMessages = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    // Click the Google button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const googleBtn = buttons.find(btn => btn.textContent.includes('Continue with Google'));
      if (googleBtn) {
        console.log('Clicking Google button...');
        googleBtn.click();
      } else {
        console.log('Google button not found');
      }
    });
    
    // Wait and check for errors
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if any errors occurred
    if (errorMessages.length > 0) {
      console.log('❌ Errors captured:');
      errorMessages.forEach(error => console.log('  -', error));
    } else {
      console.log('✅ No errors captured');
    }
    
    // Step 3: Check Firebase availability
    console.log('📱 Step 3: Checking Firebase availability...');
    const firebaseCheck = await page.evaluate(() => {
      return {
        firebaseAvailable: !!window.firebase,
        firebaseAuth: !!(window.firebase && window.firebase.auth),
        googleAuthProvider: !!(window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider),
        signInWithPopup: !!(window.firebase && window.firebase.auth && window.firebase.auth.signInWithPopup)
      };
    });
    
    console.log('🔍 Firebase Check:', firebaseCheck);
    
    // Step 4: Check if Firebase modules are imported correctly
    console.log('📱 Step 4: Checking Firebase imports...');
    const importCheck = await page.evaluate(() => {
      // Check if the Firebase modules are available in the global scope
      const checks = {
        initializeApp: typeof window.firebase?.initializeApp,
        getAuth: typeof window.firebase?.getAuth,
        GoogleAuthProvider: typeof window.firebase?.auth?.GoogleAuthProvider,
        signInWithPopup: typeof window.firebase?.auth?.signInWithPopup
      };
      return checks;
    });
    
    console.log('🔍 Import Check:', importCheck);
    
    // Step 5: Check network requests
    console.log('📱 Step 5: Checking network requests...');
    const networkRequests = await page.evaluate(() => {
      // This won't work in this context, but we can check if Firebase is trying to load
      return 'Network check not available in this context';
    });
    
    console.log('🔍 Network:', networkRequests);
    
    // Step 6: Try to manually initialize Firebase if it's not available
    console.log('📱 Step 6: Attempting to fix Firebase...');
    const firebaseFix = await page.evaluate(() => {
      if (!window.firebase) {
        console.log('Firebase not available, attempting to load...');
        // Try to create a script tag to load Firebase
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        document.head.appendChild(script);
        
        return 'Attempted to load Firebase';
      }
      return 'Firebase already available';
    });
    
    console.log('🔍 Firebase Fix:', firebaseFix);
    
    // Wait for potential Firebase load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check again after potential fix
    const firebaseCheckAfter = await page.evaluate(() => {
      return {
        firebaseAvailable: !!window.firebase,
        firebaseAuth: !!(window.firebase && window.firebase.auth),
        googleAuthProvider: !!(window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider)
      };
    });
    
    console.log('🔍 Firebase Check After Fix:', firebaseCheckAfter);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoogleSignInDebug();
