const puppeteer = require('puppeteer');

async function testCurrentState() {
  console.log('🔍 Testing Current Authentication State...');
  
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
    
    // Step 1: Navigate to homepage first
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if user is already logged in
    const authState = await page.evaluate(() => {
      return {
        currentPath: window.location.pathname,
        hasProfileBtn: !!document.querySelector('.profile-btn'),
        hasLoginBtn: !!document.querySelector('.nav-link.login-btn'),
        profileBtnVisible: document.querySelector('.profile-btn')?.offsetParent !== null,
        loginBtnVisible: document.querySelector('.nav-link.login-btn')?.offsetParent !== null
      };
    });
    
    console.log('🔍 Current Auth State:', authState);
    
    if (authState.hasProfileBtn && authState.profileBtnVisible) {
      console.log('✅ User appears to be logged in. Testing dropdown buttons...');
      
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
      
      // Step 3: Check dropdown buttons
      const dropdownButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('.profile-option');
        return Array.from(buttons).map((btn, index) => ({
          index,
          text: btn.textContent.trim(),
          className: btn.className,
          visible: btn.offsetParent !== null,
          hasOnClick: btn.onclick !== null
        }));
      });
      
      console.log('🔍 Dropdown buttons found:', dropdownButtons);
      
      // Step 4: Test each button (except logout)
      for (const button of dropdownButtons) {
        if (button.text.includes('Logout')) {
          console.log(`⏭️ Skipping logout button test for now`);
          continue;
        }
        
        console.log(`\n📱 Testing button: "${button.text}"`);
        
        try {
          // Click the button
          await page.evaluate((buttonIndex) => {
            const buttons = document.querySelectorAll('.profile-option');
            if (buttons[buttonIndex]) {
              buttons[buttonIndex].click();
            }
          }, button.index);
          
          // Wait a bit to see the result
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check current path after click
          const pathAfterClick = await page.evaluate(() => window.location.pathname);
          console.log(`✅ After clicking "${button.text}", current path:`, pathAfterClick);
          
          // Check if we're still logged in
          const stillLoggedIn = await page.evaluate(() => {
            const profileBtn = document.querySelector('.profile-btn');
            return profileBtn && profileBtn.offsetParent !== null;
          });
          
          console.log(`✅ Still logged in after clicking "${button.text}":`, stillLoggedIn);
          
          // Navigate back to homepage for next test
          await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reopen dropdown for next test
          await page.evaluate(() => {
            const profileBtn = document.querySelector('.profile-btn');
            if (profileBtn) {
              profileBtn.click();
            }
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.log(`❌ Error testing "${button.text}":`, error.message);
        }
      }
      
      // Step 5: Test logout button specifically
      console.log('\n📱 Testing logout button...');
      const logoutButton = dropdownButtons.find(btn => btn.text.includes('Logout'));
      if (logoutButton) {
        try {
          // Click logout button
          await page.evaluate((buttonIndex) => {
            const buttons = document.querySelectorAll('.profile-option');
            if (buttons[buttonIndex]) {
              buttons[buttonIndex].click();
            }
          }, logoutButton.index);
          
          // Wait for logout to complete
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Check if we're logged out
          const loggedOut = await page.evaluate(() => {
            const profileBtn = document.querySelector('.profile-btn');
            const loginBtn = document.querySelector('.nav-link.login-btn');
            return {
              noProfileBtn: !profileBtn || profileBtn.offsetParent === null,
              hasLoginBtn: loginBtn && loginBtn.offsetParent !== null,
              currentPath: window.location.pathname
            };
          });
          
          console.log('✅ Logout test result:', loggedOut);
          
        } catch (error) {
          console.log('❌ Error testing logout:', error.message);
        }
      }
      
    } else {
      console.log('❌ User is not logged in. Cannot test dropdown buttons.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCurrentState();
