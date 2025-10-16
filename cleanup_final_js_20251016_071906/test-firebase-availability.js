const puppeteer = require('puppeteer');

async function testFirebaseAvailability() {
  console.log('🧪 Testing Firebase Availability...');
  
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
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 2: Check Firebase availability
    console.log('📱 Step 2: Checking Firebase availability...');
    const firebaseCheck = await page.evaluate(() => {
      return {
        firebaseGlobal: !!window.firebase,
        firebaseApp: !!(window.firebase && window.firebase.app),
        firebaseAuth: !!(window.firebase && window.firebase.auth),
        googleProvider: !!(window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider),
        apps: window.firebase ? window.firebase.apps.length : 0
      };
    });
    
    console.log('🔍 Firebase Check:', firebaseCheck);
    
    if (firebaseCheck.firebaseGlobal && firebaseCheck.googleProvider) {
      console.log('✅ Firebase is available and Google OAuth should work!');
      
      // Step 3: Test Google sign-in button
      console.log('📱 Step 3: Testing Google sign-in button...');
      
      // Find and click Google button
      const buttonFound = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const googleBtn = buttons.find(btn => btn.textContent.includes('Continue with Google'));
        return !!googleBtn;
      });
      
      if (buttonFound) {
        console.log('✅ Google sign-in button found');
        
        // Click the button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const googleBtn = buttons.find(btn => btn.textContent.includes('Continue with Google'));
          if (googleBtn) {
            googleBtn.click();
          }
        });
        
        // Wait for popup or error
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check for popup
        const pages = await browser.pages();
        if (pages.length > 1) {
          console.log('✅ Google OAuth popup opened successfully!');
          // Close popup
          await pages[1].close();
        } else {
          console.log('⚠️ No popup opened - checking for errors...');
          
          // Check for error messages
          const errorMessage = await page.evaluate(() => {
            const errorDivs = Array.from(document.querySelectorAll('div')).filter(div => 
              div.style.color === 'rgb(239, 68, 68)' || 
              div.textContent.includes('error') ||
              div.textContent.includes('Error') ||
              div.textContent.includes('blocking') ||
              div.textContent.includes('popup')
            );
            return errorDivs.map(div => div.textContent.trim()).filter(text => text.length > 0);
          });
          
          if (errorMessage.length > 0) {
            console.log('❌ Error messages found:', errorMessage);
          } else {
            console.log('✅ No error messages found');
          }
        }
        
      } else {
        console.log('❌ Google sign-in button not found');
      }
      
    } else {
      console.log('❌ Firebase is not properly loaded');
      console.log('🔍 Firebase Status Details:', firebaseCheck);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testFirebaseAvailability();
