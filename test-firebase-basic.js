const puppeteer = require('puppeteer');

async function testFirebaseBasic() {
  console.log('🧪 Testing Basic Firebase Functionality...');
  
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
    
    // Step 1: Navigate to login page
    console.log('📱 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Check Firebase availability
    console.log('📱 Step 2: Checking Firebase availability...');
    const firebaseCheck = await page.evaluate(() => {
      return {
        firebaseGlobal: !!window.firebase,
        firebaseApp: !!(window.firebase && window.firebase.app),
        firebaseAuth: !!(window.firebase && window.firebase.auth),
        firebaseConfig: window.firebase ? window.firebase.app().options : null
      };
    });
    
    console.log('🔍 Firebase Check:', firebaseCheck);
    
    // Step 3: Try to manually load Firebase
    console.log('📱 Step 3: Attempting to manually load Firebase...');
    const firebaseLoad = await page.evaluate(() => {
      // Try to load Firebase from CDN
      return new Promise((resolve) => {
        if (window.firebase) {
          resolve('Firebase already loaded');
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        script.onload = () => {
          const authScript = document.createElement('script');
          authScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js';
          authScript.onload = () => {
            resolve('Firebase loaded successfully');
          };
          authScript.onerror = () => {
            resolve('Failed to load Firebase Auth');
          };
          document.head.appendChild(authScript);
        };
        script.onerror = () => {
          resolve('Failed to load Firebase');
        };
        document.head.appendChild(script);
      });
    });
    
    console.log('🔍 Firebase Load Result:', firebaseLoad);
    
    // Wait for Firebase to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Check Firebase after manual load
    const firebaseCheckAfter = await page.evaluate(() => {
      return {
        firebaseGlobal: !!window.firebase,
        firebaseApp: !!(window.firebase && window.firebase.app),
        firebaseAuth: !!(window.firebase && window.firebase.auth),
        googleProvider: !!(window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider)
      };
    });
    
    console.log('🔍 Firebase Check After Load:', firebaseCheckAfter);
    
    // Step 5: Try to initialize Firebase manually
    if (firebaseCheckAfter.firebaseGlobal) {
      console.log('📱 Step 5: Attempting to initialize Firebase...');
      const firebaseInit = await page.evaluate(() => {
        try {
          if (!window.firebase.apps.length) {
            const config = {
              apiKey: "AIzaSyBX2bZmOUosU-2PXZFQVN_WLLuee_zkFzI",
              authDomain: "unschooling-464413.firebaseapp.com",
              projectId: "unschooling-464413",
              storageBucket: "unschooling-464413.appspot.com",
              messagingSenderId: "790275794964",
              appId: "1:790275794964:web:f981a7f0693cc186631f01"
            };
            
            window.firebase.initializeApp(config);
            return 'Firebase initialized successfully';
          } else {
            return 'Firebase already initialized';
          }
        } catch (error) {
          return `Firebase initialization failed: ${error.message}`;
        }
      });
      
      console.log('🔍 Firebase Init Result:', firebaseInit);
    }
    
    // Step 6: Final check
    const finalCheck = await page.evaluate(() => {
      return {
        firebaseGlobal: !!window.firebase,
        firebaseApp: !!(window.firebase && window.firebase.app),
        firebaseAuth: !!(window.firebase && window.firebase.auth),
        googleProvider: !!(window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider),
        apps: window.firebase ? window.firebase.apps.length : 0
      };
    });
    
    console.log('🔍 Final Firebase Check:', finalCheck);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testFirebaseBasic();
