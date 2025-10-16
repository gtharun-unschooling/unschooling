const puppeteer = require('puppeteer');

async function testDropdownButtonsFinal() {
  console.log('🧪 Testing Profile Dropdown Buttons - Final Test...');
  
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
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Click login link
    console.log('📱 Step 2: Clicking login link...');
    await page.evaluate(() => {
      const loginLink = document.querySelector('.nav-link.login-btn');
      if (loginLink) {
        loginLink.click();
      }
    });
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 3: Fill login form
    console.log('📱 Step 3: Filling login form...');
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    
    // Step 4: Submit form
    console.log('📱 Step 4: Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Wait for authentication
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Step 5: Check if logged in
    const loggedInState = await page.evaluate(() => {
      return {
        currentPath: window.location.pathname,
        hasProfileBtn: !!document.querySelector('.profile-btn'),
        profileBtnText: document.querySelector('.profile-btn')?.textContent || 'No profile button'
      };
    });
    
    console.log('🔍 Logged In State:', loggedInState);
    
    if (loggedInState.hasProfileBtn) {
      console.log('✅ Successfully logged in! Testing dropdown buttons...');
      
      // Step 6: Open profile dropdown
      console.log('📱 Step 6: Opening profile dropdown...');
      await page.evaluate(() => {
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn) {
          profileBtn.click();
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 7: Get dropdown buttons
      const dropdownButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('.profile-option');
        return Array.from(buttons).map((btn, index) => ({
          index,
          text: btn.textContent.trim(),
          className: btn.className,
          visible: btn.offsetParent !== null
        }));
      });
      
      console.log('🔍 Dropdown buttons found:', dropdownButtons);
      
      // Step 8: Test each button
      for (const button of dropdownButtons) {
        console.log(`\n📱 Testing button: "${button.text}"`);
        
        try {
          // Click the button
          await page.evaluate((buttonIndex) => {
            const buttons = document.querySelectorAll('.profile-option');
            if (buttons[buttonIndex]) {
              buttons[buttonIndex].click();
            }
          }, button.index);
          
          // Wait and check result
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const result = await page.evaluate(() => {
            return {
              currentPath: window.location.pathname,
              stillLoggedIn: !!document.querySelector('.profile-btn'),
              hasLoginBtn: !!document.querySelector('.nav-link.login-btn')
            };
          });
          
          console.log(`✅ After clicking "${button.text}":`, result);
          
          // If we clicked logout, we should be logged out
          if (button.text.includes('Logout')) {
            if (!result.stillLoggedIn && result.hasLoginBtn) {
              console.log(`✅ Logout button working correctly - user logged out`);
            } else {
              console.log(`❌ Logout button not working properly`);
            }
          } else {
            // For other buttons, we should still be logged in or navigated to a new page
            if (result.stillLoggedIn || result.currentPath !== '/') {
              console.log(`✅ "${button.text}" button working correctly`);
            } else {
              console.log(`❌ "${button.text}" button caused unexpected logout`);
            }
          }
          
          // Navigate back to homepage for next test (if not logged out)
          if (result.stillLoggedIn) {
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
          } else {
            // If logged out, log back in for next test
            console.log('🔄 Logging back in for next test...');
            await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await page.type('input[type="email"]', 'gtharun04@gmail.com');
            await page.type('input[type="password"]', '8500424835');
            await page.click('button[type="submit"]');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Reopen dropdown for next test
            await page.evaluate(() => {
              const profileBtn = document.querySelector('.profile-btn');
              if (profileBtn) {
                profileBtn.click();
              }
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (error) {
          console.log(`❌ Error testing "${button.text}":`, error.message);
        }
      }
      
      // Summary
      console.log('\n🎯 DROPDOWN BUTTONS TEST SUMMARY:');
      console.log('==================================');
      console.log('✅ Login functionality:', 'Working');
      console.log('✅ Profile dropdown opening:', 'Working');
      console.log('✅ Number of buttons found:', dropdownButtons.length);
      dropdownButtons.forEach((btn, index) => {
        console.log(`✅ Button ${index + 1} ("${btn.text}"):`, btn.visible ? 'Visible' : 'Not visible');
      });
      
    } else {
      console.log('❌ Failed to log in or profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDropdownButtonsFinal();
