const puppeteer = require('puppeteer');

async function testSimpleLogout() {
  console.log('🧪 Testing Simple Logout Functionality...');
  
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
    
    // Check if we're logged in
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Step 2: Look for profile button
    console.log('📱 Step 2: Looking for profile button...');
    const profileButton = await page.$('.profile-btn');
    if (profileButton) {
      console.log('✅ Profile button found, clicking...');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if dropdown is visible
      const dropdownVisible = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return dropdown && dropdown.offsetParent !== null;
      });
      
      if (dropdownVisible) {
        console.log('✅ Profile dropdown is visible');
        
        // Look for logout button in dropdown
        const logoutButton = await page.$('.profile-option-logout');
        if (logoutButton) {
          console.log('✅ Logout button found in dropdown, clicking...');
          await logoutButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Check where we are after logout
          const pathAfterLogout = await page.evaluate(() => window.location.pathname);
          console.log('✅ After logout, current path:', pathAfterLogout);
          
          // Check if we can see login button (indicating we're logged out)
          const loginButton = await page.$('.nav-link.login-btn');
          const loginButtonVisible = loginButton ? await loginButton.evaluate(el => el.offsetParent !== null) : false;
          console.log('✅ Login button visible after logout:', loginButtonVisible);
          
          // Summary
          console.log('\n🎯 SIMPLE LOGOUT TEST SUMMARY:');
          console.log('==================================');
          console.log('✅ Login functionality:', currentPath !== '/login' ? 'Working' : 'Failed');
          console.log('✅ Profile button:', profileButton ? 'Working' : 'Failed');
          console.log('✅ Profile dropdown:', dropdownVisible ? 'Working' : 'Failed');
          console.log('✅ Logout button:', logoutButton ? 'Working' : 'Failed');
          console.log('✅ Post-logout navigation:', pathAfterLogout === '/' ? 'Working' : 'Failed');
          console.log('✅ Login button visible:', loginButtonVisible ? 'Working' : 'Failed');
          
        } else {
          console.log('❌ Logout button not found in dropdown');
        }
      } else {
        console.log('❌ Profile dropdown is not visible');
      }
    } else {
      console.log('❌ Profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSimpleLogout();
