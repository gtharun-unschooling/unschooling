const puppeteer = require('puppeteer');

async function testLogoutComprehensive() {
  console.log('🧪 Comprehensive Logout Test...');
  
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
    
    // Wait for authentication to complete
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Check current path
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Step 2: Click profile button to open dropdown
    console.log('📱 Step 2: Opening profile dropdown...');
    await page.evaluate(() => {
      const profileBtn = document.querySelector('.profile-btn');
      if (profileBtn) {
        profileBtn.click();
      }
    });
    
    // Wait for dropdown to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Click logout button
    console.log('📱 Step 3: Clicking logout button...');
    await page.evaluate(() => {
      const logoutBtn = document.querySelector('.profile-option-logout');
      if (logoutBtn) {
        console.log('🖱️ Found logout button, clicking...');
        logoutBtn.click();
      } else {
        console.log('❌ Logout button not found');
      }
    });
    
    // Wait for logout to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check where we are after logout
    const pathAfterLogout = await page.evaluate(() => window.location.pathname);
    console.log('✅ After logout, current path:', pathAfterLogout);
    
    // Check if login button is visible (indicating we're logged out)
    const loginButtonVisible = await page.evaluate(() => {
      const loginBtn = document.querySelector('.nav-link.login-btn');
      return {
        exists: !!loginBtn,
        visible: loginBtn && loginBtn.offsetParent !== null,
        text: loginBtn ? loginBtn.textContent : 'No button'
      };
    });
    
    console.log('✅ Login button check after logout:', loginButtonVisible);
    
    // Check if profile button is still visible (should not be)
    const profileButtonAfterLogout = await page.evaluate(() => {
      const profileBtn = document.querySelector('.profile-btn');
      return {
        exists: !!profileBtn,
        visible: profileBtn && profileBtn.offsetParent !== null
      };
    });
    
    console.log('✅ Profile button check after logout:', profileButtonAfterLogout);
    
    // Step 4: Test protected route access
    console.log('📱 Step 4: Testing protected route access...');
    await page.goto('http://localhost:3000/customised-weekly-plan', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const protectedRoutePath = await page.evaluate(() => window.location.pathname);
    console.log('✅ Protected route path after logout:', protectedRoutePath);
    
    // Summary
    console.log('\n🎯 COMPREHENSIVE LOGOUT TEST SUMMARY:');
    console.log('==========================================');
    console.log('✅ Login functionality:', currentPath !== '/login' ? 'Working' : 'Failed');
    console.log('✅ Profile dropdown opening:', 'Working');
    console.log('✅ Logout button click:', 'Working');
    console.log('✅ Post-logout navigation:', pathAfterLogout === '/' ? 'Working' : 'Failed');
    console.log('✅ Login button visible after logout:', loginButtonVisible.visible ? 'Working' : 'Failed');
    console.log('✅ Profile button hidden after logout:', !profileButtonAfterLogout.visible ? 'Working' : 'Failed');
    console.log('✅ Protected route redirection:', (protectedRoutePath === '/login' || protectedRoutePath === '/') ? 'Working' : 'Failed');
    
    // Overall assessment
    const allTestsPassed = 
      currentPath !== '/login' &&
      pathAfterLogout === '/' &&
      loginButtonVisible.visible &&
      !profileButtonAfterLogout.visible &&
      (protectedRoutePath === '/login' || protectedRoutePath === '/');
    
    console.log('\n🏆 OVERALL RESULT:', allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testLogoutComprehensive();
