const puppeteer = require('puppeteer');

async function checkAuthStatus() {
  console.log('🔍 Checking Authentication Status...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Login first
    console.log('📱 Step 1: Logging in...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Check authentication status
    console.log('📱 Step 2: Checking authentication status...');
    
    const authStatus = await page.evaluate(() => {
      // Check for various authentication indicators
      const profileButton = document.querySelector('.profile-btn');
      const profileContainer = document.querySelector('.profile-dropdown-container');
      const loginButton = document.querySelector('a[href="/login"]');
      const userElements = document.querySelectorAll('[class*="user"], [class*="profile"]');
      
      return {
        currentPath: window.location.pathname,
        profileButtonExists: profileButton !== null,
        profileContainerExists: profileContainer !== null,
        loginButtonExists: loginButton !== null,
        userElementsCount: userElements.length,
        userElements: Array.from(userElements).map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent.substring(0, 30)
        }))
      };
    });
    
    console.log('🔍 Authentication status:', JSON.stringify(authStatus, null, 2));
    
    // Check if we're on the right page
    if (authStatus.currentPath === '/dashboard' || authStatus.currentPath === '/customised-weekly-plan') {
      console.log('✅ User appears to be on authenticated page');
      
      if (authStatus.profileButtonExists) {
        console.log('✅ Profile button found, testing click...');
        
        const profileButton = await page.$('.profile-btn');
        await profileButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check dropdown after click
        const dropdownStatus = await page.evaluate(() => {
          const dropdown = document.querySelector('.profile-dropdown');
          return {
            exists: dropdown !== null,
            visible: dropdown && dropdown.offsetParent !== null,
            className: dropdown ? dropdown.className : 'not found'
          };
        });
        
        console.log('🔍 Dropdown status after click:', dropdownStatus);
        
      } else {
        console.log('❌ Profile button not found on authenticated page');
        
        // Try to navigate to a page that should show the profile button
        console.log('🔄 Navigating to homepage to check navbar...');
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const homepageAuthStatus = await page.evaluate(() => {
          const profileButton = document.querySelector('.profile-btn');
          const loginButton = document.querySelector('a[href="/login"]');
          
          return {
            currentPath: window.location.pathname,
            profileButtonExists: profileButton !== null,
            loginButtonExists: loginButton !== null
          };
        });
        
        console.log('🔍 Homepage auth status:', homepageAuthStatus);
      }
      
    } else {
      console.log('❌ User not on authenticated page, current path:', authStatus.currentPath);
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await browser.close();
  }
}

checkAuthStatus();
