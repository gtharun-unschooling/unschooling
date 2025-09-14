const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testWithExistingCookies() {
  console.log('🍪 Starting test with existing Chrome profile...');
  
  // Get the user's Chrome profile directory
  const homeDir = os.homedir();
  const chromeProfilePath = path.join(homeDir, 'Library/Application Support/Google/Chrome/Default');
  
  console.log('🔍 Chrome profile path:', chromeProfilePath);
  
  // Check if profile exists
  if (!fs.existsSync(chromeProfilePath)) {
    console.log('❌ Chrome profile not found at:', chromeProfilePath);
    console.log('🔍 Trying alternative paths...');
    
    // Try alternative paths
    const alternativePaths = [
      path.join(homeDir, 'Library/Application Support/Google/Chrome/Profile 1'),
      path.join(homeDir, 'Library/Application Support/Google/Chrome/Profile 2'),
      path.join(homeDir, 'Library/Application Support/Google/Chrome/Profile 3')
    ];
    
    for (const altPath of alternativePaths) {
      if (fs.existsSync(altPath)) {
        console.log('✅ Found Chrome profile at:', altPath);
        chromeProfilePath = altPath;
        break;
      }
    }
  }
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--auto-open-devtools-for-tabs',
      `--user-data-dir=${chromeProfilePath}`,
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to profile page
    console.log('📱 Navigating to profile page...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot of initial page
    console.log('📸 Taking screenshot of initial page...');
    await page.screenshot({ 
      path: 'cookie_test_initial.png',
      fullPage: true 
    });
    
    // Check if we're logged in
    console.log('🔍 Checking login status...');
    const loginStatus = await page.evaluate(() => {
      // Look for signs of being logged in
      const buttons = document.querySelectorAll('button');
      let hasSignInButton = false;
      let hasLogoutButton = false;
      
      buttons.forEach(btn => {
        const text = btn.textContent;
        if (text && text.includes('Sign In')) hasSignInButton = true;
        if (text && text.includes('Logout')) hasLogoutButton = true;
      });
      
      const userInfo = document.querySelector('[data-testid="user-info"]');
      const userEmail = document.querySelector('.user-email');
      
      return {
        hasSignInButton,
        hasUserInfo: !!userInfo,
        hasUserEmail: !!userEmail,
        hasLogoutButton,
        pageTitle: document.title,
        url: window.location.href
      };
    });
    
    console.log('🔍 Login status:', loginStatus);
    
    if (loginStatus.hasSignInButton) {
      console.log('❌ Still showing sign in button - not logged in');
      
      // Try to navigate to home page first to establish session
      console.log('🏠 Trying to navigate to home page first...');
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Now try profile page again
      console.log('📱 Navigating to profile page again...');
      await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check login status again
      const loginStatus2 = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        let hasSignInButton = false;
        
        buttons.forEach(btn => {
          const text = btn.textContent;
          if (text && text.includes('Sign In')) hasSignInButton = true;
        });
        
        const userInfo = document.querySelector('[data-testid="user-info"]');
        return {
          hasSignInButton,
          hasUserInfo: !!userInfo
        };
      });
      
      console.log('🔍 Login status after home page:', loginStatus2);
    }
    
    // Take screenshot after login attempt
    console.log('📸 Taking screenshot after login attempt...');
    await page.screenshot({ 
      path: 'cookie_test_after_login.png',
      fullPage: true 
    });
    
    // Check for children
    console.log('👶 Looking for children...');
    const childrenInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const childData = [];
      
      buttons.forEach((btn, index) => {
        const text = btn.textContent;
        const style = window.getComputedStyle(btn);
        
        // Look for child selection buttons
        if (text && text.length > 0 && text !== '✕' && text !== '⚙️' && text !== '👁️') {
          childData.push({
            index,
            text: text.substring(0, 50),
            backgroundColor: style.backgroundColor,
            isSelected: style.backgroundColor.includes('78, 205, 196') || style.backgroundColor.includes('78, 205, 196')
          });
        }
      });
      
      return childData;
    });
    
    console.log('🔍 Children found:', childrenInfo);
    
    // If children found, try to select one
    if (childrenInfo.length > 0) {
      console.log('👶 Attempting to select first child...');
      
      // Find and click the first child button
      const childButton = await page.$('button');
      if (childButton) {
        await childButton.click();
        console.log('✅ Child button clicked');
        
        // Wait for selection
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshot after child selection
        console.log('📸 Taking screenshot after child selection...');
        await page.screenshot({ 
          path: 'cookie_test_child_selected.png',
          fullPage: true 
        });
        
        // Now try to submit the form
        console.log('📝 Looking for form submission...');
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
          console.log('🚀 Found submit button, clicking it...');
          await submitButton.click();
          
          // Wait for plan generation
          console.log('⏳ Waiting for plan generation...');
          await new Promise(resolve => setTimeout(resolve, 15000));
          
          // Take screenshot after submission
          console.log('📸 Taking screenshot after form submission...');
          await page.screenshot({ 
            path: 'cookie_test_after_submission.png',
            fullPage: true 
          });
          
          // Check current URL
          const currentUrl = page.url();
          console.log('📍 Current URL after submission:', currentUrl);
          
          // Check console logs
          console.log('🔍 Checking console logs...');
          const logs = await page.evaluate(() => {
            return window.capturedLogs || [];
          });
          
          console.log('📝 Console logs found:', logs.length);
          logs.forEach((log, index) => {
            console.log(`${index + 1}: ${log}`);
          });
        } else {
          console.log('❌ Submit button not found');
        }
      }
    } else {
      console.log('❌ No children found - cannot test form submission');
    }
    
    console.log('✅ Cookie test completed!');
    console.log('📁 Screenshots saved:');
    console.log('  - cookie_test_initial.png');
    console.log('  - cookie_test_after_login.png');
    console.log('  - cookie_test_child_selected.png');
    console.log('  - cookie_test_after_submission.png');
    
    // Keep browser open for manual inspection
    console.log('👀 Browser will stay open for manual inspection...');
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Cookie test failed:', error);
    await browser.close();
  }
}

// Run the cookie test
testWithExistingCookies().catch(console.error);
