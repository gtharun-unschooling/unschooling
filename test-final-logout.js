const puppeteer = require('puppeteer');

async function testFinalLogout() {
  console.log('🧪 Testing Final Logout Functionality...');
  
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
    
    // Step 2: Navigate to a protected route
    console.log('📱 Step 2: Navigating to protected route...');
    await page.goto('http://localhost:3000/customised-weekly-plan', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we can access the protected route
    const protectedPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ Protected route path:', protectedPath);
    
    // Step 3: Look for profile button
    console.log('📱 Step 3: Looking for profile button...');
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
          
          // Step 4: Test protected route access after logout
          console.log('📱 Step 4: Testing protected route access after logout...');
          await page.goto('http://localhost:3000/customised-weekly-plan', { waitUntil: 'networkidle0' });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const finalPath = await page.evaluate(() => window.location.pathname);
          console.log('✅ Final path after accessing protected route:', finalPath);
          
          // Summary
          console.log('\n🎯 FINAL LOGOUT TEST SUMMARY:');
          console.log('==================================');
          console.log('✅ Login functionality:', currentPath !== '/login' ? 'Working' : 'Failed');
          console.log('✅ Profile button:', profileButton ? 'Working' : 'Failed');
          console.log('✅ Profile dropdown:', dropdownVisible ? 'Working' : 'Failed');
          console.log('✅ Logout button:', logoutButton ? 'Working' : 'Failed');
          console.log('✅ Post-logout navigation:', pathAfterLogout === '/' ? 'Working' : 'Failed');
          console.log('✅ Protected route redirection:', finalPath === '/login' || finalPath === '/' ? 'Working' : 'Failed');
          
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

testFinalLogout();
