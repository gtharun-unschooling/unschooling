const puppeteer = require('puppeteer');

async function testGoogleSignInFix() {
  console.log('🧪 Testing Google Sign-In Fix...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-features=VizDisplayCompositor']
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
    
    // Step 2: Click Google sign-in button
    console.log('📱 Step 2: Clicking Google sign-in button...');
    
    // Set up error capture
    const errorMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
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
    
    // Check for error messages on the page
    const pageErrors = await page.evaluate(() => {
      const errorDivs = Array.from(document.querySelectorAll('div')).filter(div => 
        div.style.color === 'rgb(239, 68, 68)' || 
        div.textContent.includes('error') ||
        div.textContent.includes('Error') ||
        div.textContent.includes('blocking') ||
        div.textContent.includes('popup')
      );
      return errorDivs.map(div => div.textContent.trim()).filter(text => text.length > 0);
    });
    
    console.log('🔍 Page Errors Found:', pageErrors);
    console.log('🔍 Console Errors Found:', errorMessages);
    
    // Step 3: Check if we're still on login page or redirected
    const currentUrl = await page.url();
    console.log('🔍 Current URL after click:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard - Google sign-in working!');
    } else if (currentUrl.includes('/login')) {
      console.log('⚠️ Still on login page - checking for error messages...');
      
      // Check if there are any visible error messages
      const hasErrors = pageErrors.length > 0 || errorMessages.length > 0;
      if (hasErrors) {
        console.log('❌ Google sign-in failed with errors');
      } else {
        console.log('⚠️ Google sign-in may have failed silently');
      }
    } else {
      console.log('🔍 Redirected to unknown page:', currentUrl);
    }
    
    // Step 4: Check Firebase availability
    const firebaseStatus = await page.evaluate(() => {
      return {
        firebaseAvailable: !!window.firebase,
        authAvailable: !!(window.firebase && window.firebase.auth),
        googleProviderAvailable: !!(window.firebase && window.firebase.auth && window.firebase.auth.GoogleAuthProvider)
      };
    });
    
    console.log('🔍 Firebase Status:', firebaseStatus);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoogleSignInFix();
