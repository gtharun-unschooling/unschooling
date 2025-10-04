const puppeteer = require('puppeteer');

async function testLogoutWithWait() {
  console.log('🧪 Testing Logout with Extended Wait...');
  
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
    
    // Wait for Firebase to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Fill login form
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait longer for authentication to complete
    console.log('⏳ Waiting for authentication to complete...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Check current path
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Check if profile button exists
    const profileButtonExists = await page.evaluate(() => {
      const btn = document.querySelector('.profile-btn');
      return {
        exists: !!btn,
        visible: btn && btn.offsetParent !== null,
        text: btn ? btn.textContent : 'No button'
      };
    });
    
    console.log('✅ Profile button check:', profileButtonExists);
    
    if (profileButtonExists.exists && profileButtonExists.visible) {
      // Step 2: Click profile button
      console.log('📱 Step 2: Clicking profile button...');
      await page.click('.profile-btn');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dropdown is visible
      const dropdownVisible = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          exists: !!dropdown,
          visible: dropdown && dropdown.offsetParent !== null,
          html: dropdown ? dropdown.outerHTML.substring(0, 200) + '...' : 'No dropdown'
        };
      });
      
      console.log('✅ Dropdown check:', dropdownVisible);
      
      if (dropdownVisible.visible) {
        // Step 3: Click logout button
        console.log('📱 Step 3: Clicking logout button...');
        await page.click('.profile-option-logout');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check where we are after logout
        const pathAfterLogout = await page.evaluate(() => window.location.pathname);
        console.log('✅ After logout, current path:', pathAfterLogout);
        
        // Check if login button is visible (indicating we're logged out)
        const loginButtonVisible = await page.evaluate(() => {
          const loginBtn = document.querySelector('.nav-link.login-btn');
          return loginBtn && loginBtn.offsetParent !== null;
        });
        
        console.log('✅ Login button visible after logout:', loginButtonVisible);
        
        // Summary
        console.log('\n🎯 LOGOUT TEST WITH WAIT SUMMARY:');
        console.log('==================================');
        console.log('✅ Login functionality:', currentPath !== '/login' ? 'Working' : 'Failed');
        console.log('✅ Profile button:', profileButtonExists.visible ? 'Working' : 'Failed');
        console.log('✅ Profile dropdown:', dropdownVisible.visible ? 'Working' : 'Failed');
        console.log('✅ Logout button click:', 'Working');
        console.log('✅ Post-logout navigation:', pathAfterLogout === '/' ? 'Working' : 'Failed');
        console.log('✅ Login button visible:', loginButtonVisible ? 'Working' : 'Failed');
        
      } else {
        console.log('❌ Profile dropdown is not visible, cannot test logout');
      }
    } else {
      console.log('❌ Profile button not found or not visible');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testLogoutWithWait();
