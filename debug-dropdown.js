const puppeteer = require('puppeteer');

async function debugDropdown() {
  console.log('🔍 Debugging Dropdown Issue...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Login first
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Logged in successfully');
    
    // Click profile button
    const profileButton = await page.$('.profile-btn');
    if (profileButton) {
      console.log('✅ Profile button found, clicking...');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check all possible dropdown elements
      const dropdownInfo = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class*="dropdown"], [class*="profile"]');
        const info = [];
        
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(el);
          
          info.push({
            index,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: el.textContent.substring(0, 50),
            visible: el.offsetParent !== null,
            display: computedStyle.display,
            position: computedStyle.position,
            top: computedStyle.top,
            left: computedStyle.left,
            right: computedStyle.right,
            width: computedStyle.width,
            height: computedStyle.height,
            zIndex: computedStyle.zIndex,
            opacity: computedStyle.opacity,
            visibility: computedStyle.visibility,
            rect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height
            }
          });
        });
        
        return info;
      });
      
      console.log('🔍 All dropdown/profile elements:', JSON.stringify(dropdownInfo, null, 2));
      
      // Try to find and click logout directly
      const logoutClickResult = await page.evaluate(() => {
        // Try different selectors for logout
        const selectors = [
          '.profile-option-logout',
          'button:contains("Logout")',
          '[class*="logout"]',
          'button[class*="logout"]'
        ];
        
        for (const selector of selectors) {
          try {
            const element = document.querySelector(selector);
            if (element) {
              console.log('Found logout element with selector:', selector);
              element.click();
              return { success: true, selector };
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        // Try to find by text content
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
          if (button.textContent.toLowerCase().includes('logout')) {
            console.log('Found logout button by text content');
            button.click();
            return { success: true, method: 'text-content' };
          }
        }
        
        return { success: false };
      });
      
      console.log('🔍 Logout click result:', logoutClickResult);
      
      if (logoutClickResult.success) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const pathAfterLogout = await page.evaluate(() => window.location.pathname);
        console.log('✅ After logout, current path:', pathAfterLogout);
        
        const isOnHomepage = pathAfterLogout === '/';
        console.log('✅ Properly redirected to homepage:', isOnHomepage);
      }
      
    } else {
      console.log('❌ Profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugDropdown();
