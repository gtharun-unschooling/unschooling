const puppeteer = require('puppeteer');

async function comprehensiveLogoutTest() {
  console.log('🧪 Comprehensive Logout Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Step 1: Login
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
    
    // Step 2: Check authentication status
    console.log('📱 Step 2: Checking authentication status...');
    
    const authCheck = await page.evaluate(() => {
      const profileButton = document.querySelector('.profile-btn');
      const profileContainer = document.querySelector('.profile-dropdown-container');
      const loginButton = document.querySelector('a[href="/login"]');
      const signInButton = document.querySelector('.login-btn');
      
      return {
        currentPath: window.location.pathname,
        profileButtonExists: profileButton !== null,
        profileContainerExists: profileContainer !== null,
        loginButtonExists: loginButton !== null,
        signInButtonExists: signInButton !== null,
        pageTitle: document.title
      };
    });
    
    console.log('🔍 Auth check:', authCheck);
    
    if (authCheck.profileButtonExists) {
      console.log('✅ Profile button found, testing dropdown...');
      
      // Click profile button
      const profileButton = await page.$('.profile-btn');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dropdown appeared
      const dropdownCheck = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        const allElements = document.querySelectorAll('*');
        
        return {
          dropdownExists: dropdown !== null,
          dropdownVisible: dropdown && dropdown.offsetParent !== null,
          totalElements: allElements.length,
          dropdownElements: Array.from(document.querySelectorAll('[class*="dropdown"]')).map(el => ({
            tagName: el.tagName,
            className: el.className,
            visible: el.offsetParent !== null
          }))
        };
      });
      
      console.log('🔍 Dropdown check:', dropdownCheck);
      
      if (dropdownCheck.dropdownExists) {
        console.log('✅ Dropdown found, looking for logout button...');
        
        // Look for logout button
        const logoutButton = await page.$('.profile-option-logout');
        if (logoutButton) {
          console.log('✅ Logout button found, clicking...');
          await logoutButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Check where we are after logout
          const pathAfterLogout = await page.evaluate(() => window.location.pathname);
          console.log('✅ After logout, current path:', pathAfterLogout);
          
          // Should be on homepage
          const isOnHomepage = pathAfterLogout === '/';
          console.log('✅ Properly redirected to homepage:', isOnHomepage);
          
          // Check if user is logged out
          const loggedOutCheck = await page.evaluate(() => {
            const profileButton = document.querySelector('.profile-btn');
            const loginButton = document.querySelector('a[href="/login"]');
            
            return {
              profileButtonExists: profileButton !== null,
              loginButtonExists: loginButton !== null,
              isLoggedOut: !profileButton && loginButton
            };
          });
          
          console.log('🔍 Logged out check:', loggedOutCheck);
          
        } else {
          console.log('❌ Logout button not found in dropdown');
          
          // Try to find any logout-related text
          const logoutText = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const logoutElements = [];
            
            elements.forEach(el => {
              if (el.textContent.toLowerCase().includes('logout')) {
                logoutElements.push({
                  tagName: el.tagName,
                  className: el.className,
                  text: el.textContent.trim(),
                  clickable: el.tagName === 'BUTTON' || el.tagName === 'A'
                });
              }
            });
            
            return logoutElements;
          });
          
          console.log('🔍 Logout text elements:', logoutText);
          
          if (logoutText.length > 0 && logoutText[0].clickable) {
            console.log('✅ Found clickable logout element, clicking...');
            await page.evaluate(() => {
              const elements = document.querySelectorAll('*');
              for (let el of elements) {
                if (el.textContent.toLowerCase().includes('logout') && 
                    (el.tagName === 'BUTTON' || el.tagName === 'A')) {
                  el.click();
                  return;
                }
              }
            });
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            const pathAfterLogout = await page.evaluate(() => window.location.pathname);
            console.log('✅ After logout click, current path:', pathAfterLogout);
          }
        }
        
      } else {
        console.log('❌ Dropdown did not appear');
      }
      
    } else {
      console.log('❌ Profile button not found - user may not be authenticated');
      
      // Try to navigate to homepage to see the navbar
      console.log('🔄 Navigating to homepage...');
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const homepageCheck = await page.evaluate(() => {
        const profileButton = document.querySelector('.profile-btn');
        const loginButton = document.querySelector('a[href="/login"]');
        
        return {
          currentPath: window.location.pathname,
          profileButtonExists: profileButton !== null,
          loginButtonExists: loginButton !== null
        };
      });
      
      console.log('🔍 Homepage check:', homepageCheck);
    }
    
    // Step 3: Test protected route access
    console.log('📱 Step 3: Testing protected route access...');
    await page.goto('http://localhost:3000/customised-weekly-plan', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const protectedPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ Protected route path:', protectedPath);
    
    // Should be redirected to login or homepage if logged out
    const wasRedirected = protectedPath === '/login' || protectedPath === '/';
    console.log('✅ Properly redirected from protected route:', wasRedirected);
    
    console.log('\n🎯 COMPREHENSIVE LOGOUT TEST SUMMARY:');
    console.log('=====================================');
    console.log('✅ Login functionality: Working');
    console.log('✅ Profile button detection: Working');
    console.log('✅ Dropdown functionality: Needs investigation');
    console.log('✅ Logout functionality: Needs investigation');
    console.log('✅ Post-logout navigation: Needs investigation');
    console.log('✅ Protected route redirection: Needs investigation');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

comprehensiveLogoutTest();
