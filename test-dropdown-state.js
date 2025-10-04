const puppeteer = require('puppeteer');

async function testDropdownState() {
  console.log('🔍 Testing Dropdown State Changes...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Step 1: Navigate to login page
    console.log('📱 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // Fill login form
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    
    // Click login button
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check current path
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Step 2: Check initial state
    console.log('📱 Step 2: Checking initial dropdown state...');
    const initialState = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      return {
        dropdownExists: !!dropdown,
        dropdownVisible: dropdown && dropdown.offsetParent !== null,
        profileBtnExists: !!document.querySelector('.profile-btn')
      };
    });
    
    console.log('Initial state:', initialState);
    
    // Step 3: Click profile button and check state
    console.log('📱 Step 3: Clicking profile button...');
    await page.click('.profile-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const afterClickState = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      return {
        dropdownExists: !!dropdown,
        dropdownVisible: dropdown && dropdown.offsetParent !== null,
        dropdownHTML: dropdown ? dropdown.outerHTML : 'No dropdown found'
      };
    });
    
    console.log('After click state:', afterClickState);
    
    // Step 4: Check console logs for state changes
    console.log('📱 Step 4: Checking console logs...');
    const logs = await page.evaluate(() => {
      return window.consoleLogs || [];
    });
    
    if (logs.length > 0) {
      console.log('Console logs:', logs);
    } else {
      console.log('No console logs found');
    }
    
    // Step 5: Try clicking again to see if state changes
    console.log('📱 Step 5: Clicking profile button again...');
    await page.click('.profile-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const afterSecondClickState = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      return {
        dropdownExists: !!dropdown,
        dropdownVisible: dropdown && dropdown.offsetParent !== null
      };
    });
    
    console.log('After second click state:', afterSecondClickState);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDropdownState();
