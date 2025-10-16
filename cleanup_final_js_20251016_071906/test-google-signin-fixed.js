const puppeteer = require('puppeteer');

async function testGoogleSignInFixed() {
  console.log('🧪 Testing Google Sign-In Functionality...');
  
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
    
    // Step 2: Check if Google sign-in button exists
    console.log('📱 Step 2: Checking for Google sign-in button...');
    
    // Find button by text content
    const googleButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Continue with Google'));
    });
    
    if (googleButton) {
      console.log('✅ Google sign-in button found');
      
      // Step 3: Click Google sign-in button
      console.log('📱 Step 3: Clicking Google sign-in button...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const googleBtn = buttons.find(btn => btn.textContent.includes('Continue with Google'));
        if (googleBtn) {
          googleBtn.click();
        }
      });
      
      // Wait for popup or redirect
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Step 4: Check for popup or error
      const pages = await browser.pages();
      console.log('🔍 Number of pages after click:', pages.length);
      
      if (pages.length > 1) {
        console.log('✅ Google OAuth popup opened');
        
        // Switch to popup
        const popup = pages[1];
        await popup.bringToFront();
        
        // Wait for popup to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check popup content
        const popupUrl = await popup.url();
        console.log('🔍 Popup URL:', popupUrl);
        
        if (popupUrl.includes('accounts.google.com')) {
          console.log('✅ Google OAuth page loaded correctly');
        } else {
          console.log('❌ Unexpected popup URL:', popupUrl);
        }
        
        // Close popup
        await popup.close();
        
      } else {
        console.log('❌ No popup opened - checking for errors...');
        
        // Check for error messages on the main page
        const errorElements = await page.$$('[style*="color: #ef4444"], .error, [class*="error"]');
        if (errorElements.length > 0) {
          for (let element of errorElements) {
            const errorText = await page.evaluate(el => el.textContent, element);
            console.log('❌ Error found:', errorText);
          }
        }
      }
      
    } else {
      console.log('❌ Google sign-in button not found');
      
      // Check what buttons are available
      const buttons = await page.$$('button');
      console.log('🔍 Available buttons:', buttons.length);
      
      for (let i = 0; i < buttons.length; i++) {
        const buttonText = await page.evaluate(el => el.textContent, buttons[i]);
        console.log(`Button ${i + 1}: "${buttonText}"`);
      }
    }
    
    // Step 5: Check Firebase configuration
    console.log('📱 Step 5: Checking Firebase configuration...');
    const firebaseConfig = await page.evaluate(() => {
      // Check if Firebase is available
      if (window.firebase && window.firebase.app) {
        try {
          const app = window.firebase.app();
          return {
            authDomain: app.options.authDomain,
            projectId: app.options.projectId,
            apiKey: app.options.apiKey ? 'Present' : 'Missing'
          };
        } catch (error) {
          return { error: error.message };
        }
      }
      return null;
    });
    
    if (firebaseConfig) {
      console.log('✅ Firebase config found:', firebaseConfig);
    } else {
      console.log('❌ Firebase config not found');
    }
    
    // Step 6: Check for Google OAuth configuration
    console.log('📱 Step 6: Checking Google OAuth configuration...');
    const oauthConfig = await page.evaluate(() => {
      // Check if GoogleAuthProvider is available
      if (window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider) {
        return 'GoogleAuthProvider available';
      }
      return 'GoogleAuthProvider not available';
    });
    
    console.log('🔍 OAuth Config:', oauthConfig);
    
    // Step 7: Test the actual Google sign-in flow
    console.log('📱 Step 7: Testing Google sign-in flow...');
    try {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const googleBtn = buttons.find(btn => btn.textContent.includes('Continue with Google'));
        if (googleBtn) {
          googleBtn.click();
        }
      });
      
      // Wait for any errors or popup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for error messages
      const errorMessage = await page.evaluate(() => {
        const errorDivs = Array.from(document.querySelectorAll('div')).filter(div => 
          div.style.color === 'rgb(239, 68, 68)' || 
          div.textContent.includes('error') ||
          div.textContent.includes('Error')
        );
        return errorDivs.map(div => div.textContent).join(' | ');
      });
      
      if (errorMessage) {
        console.log('❌ Error message found:', errorMessage);
      } else {
        console.log('✅ No error messages found');
      }
      
    } catch (error) {
      console.log('❌ Error during Google sign-in test:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoogleSignInFixed();
