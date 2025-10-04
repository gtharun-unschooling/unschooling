const puppeteer = require('puppeteer');

async function testDropdownButtons() {
  console.log('🧪 Testing Profile Dropdown Buttons Functionality...');
  
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
    
    // Step 2: Open profile dropdown
    console.log('📱 Step 2: Opening profile dropdown...');
    await page.evaluate(() => {
      const profileBtn = document.querySelector('.profile-btn');
      if (profileBtn) {
        profileBtn.click();
      }
    });
    
    // Wait for dropdown to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Check if dropdown is visible
    const dropdownVisible = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      return dropdown && dropdown.offsetParent !== null;
    });
    
    console.log('✅ Profile dropdown visible:', dropdownVisible);
    
    if (dropdownVisible) {
      // Step 4: Get all dropdown buttons
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
      
      // Step 5: Test each button
      for (const button of dropdownButtons) {
        console.log(`\n📱 Testing button ${button.index + 1}: "${button.text}"`);
        
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
          
          // If we clicked logout, we should be logged out
          if (button.text.includes('Logout')) {
            if (!stillLoggedIn) {
              console.log(`✅ Logout button working correctly`);
            } else {
              console.log(`❌ Logout button not working - still logged in`);
            }
          } else {
            // For other buttons, we should still be logged in
            if (stillLoggedIn) {
              console.log(`✅ "${button.text}" button working correctly`);
            } else {
              console.log(`❌ "${button.text}" button caused unexpected logout`);
            }
          }
          
          // If we're logged out, log back in for next test
          if (!stillLoggedIn) {
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
      console.log('✅ Profile dropdown opening:', dropdownVisible ? 'Working' : 'Failed');
      console.log('✅ Number of buttons found:', dropdownButtons.length);
      dropdownButtons.forEach((btn, index) => {
        console.log(`✅ Button ${index + 1} ("${btn.text}"):`, btn.visible ? 'Visible' : 'Not visible');
      });
      
    } else {
      console.log('❌ Profile dropdown is not visible, cannot test buttons');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDropdownButtons();
