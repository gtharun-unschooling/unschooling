const puppeteer = require('puppeteer');

async function debugLogoutIssue() {
  console.log('🔍 Debugging Logout Issue...');
  
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
    
    console.log('✅ Logged in successfully');
    
    // Debug: Check what's on the page
    console.log('📱 Step 2: Analyzing page content...');
    
    const pageAnalysis = await page.evaluate(() => {
      const analysis = {
        currentPath: window.location.pathname,
        title: document.title,
        profileElements: [],
        dropdownElements: [],
        buttonElements: [],
        allTextContent: []
      };
      
      // Find all profile-related elements
      const profileSelectors = [
        '.profile-btn',
        '.profile-dropdown',
        '.profile-dropdown-container',
        '[class*="profile"]'
      ];
      
      profileSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          analysis.profileElements.push({
            selector: selector,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: el.textContent.trim(),
            visible: el.offsetParent !== null,
            display: window.getComputedStyle(el).display
          });
        });
      });
      
      // Find all dropdown elements
      const dropdownSelectors = [
        '.profile-dropdown',
        '[class*="dropdown"]'
      ];
      
      dropdownSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          analysis.dropdownElements.push({
            selector: selector,
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: el.textContent.trim(),
            visible: el.offsetParent !== null,
            display: window.getComputedStyle(el).display,
            open: el.classList.contains('open') || el.classList.contains('active')
          });
        });
      });
      
      // Find all buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('logout') || 
            btn.className.includes('logout')) {
          analysis.buttonElements.push({
            tagName: btn.tagName,
            className: btn.className,
            id: btn.id,
            text: btn.textContent.trim(),
            visible: btn.offsetParent !== null,
            display: window.getComputedStyle(btn).display
          });
        }
      });
      
      // Get all text content that might be related to logout
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.toLowerCase().includes('logout') || 
            text.toLowerCase().includes('sign out') ||
            text.toLowerCase().includes('log out')) {
          analysis.allTextContent.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: text,
            visible: el.offsetParent !== null
          });
        }
      });
      
      return analysis;
    });
    
    console.log('📊 Page Analysis:', JSON.stringify(pageAnalysis, null, 2));
    
    // Try to click the profile button
    console.log('📱 Step 3: Trying to click profile button...');
    
    const profileButton = await page.$('.profile-btn');
    if (profileButton) {
      console.log('✅ Profile button found, clicking...');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dropdown opened
      const dropdownOpened = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        if (dropdown) {
          return {
            exists: true,
            visible: dropdown.offsetParent !== null,
            display: window.getComputedStyle(dropdown).display,
            className: dropdown.className,
            text: dropdown.textContent.trim()
          };
        }
        return { exists: false };
      });
      
      console.log('🔍 Dropdown status after click:', dropdownOpened);
      
      if (dropdownOpened.exists && dropdownOpened.visible) {
        // Look for logout button in dropdown
        const logoutButton = await page.$('.profile-option-logout, button:contains("Logout")');
        if (logoutButton) {
          console.log('✅ Logout button found in dropdown, clicking...');
          await logoutButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const pathAfterLogout = await page.evaluate(() => window.location.pathname);
          console.log('✅ After logout, current path:', pathAfterLogout);
          
          // Check if we're properly logged out
          const isLoggedOut = pathAfterLogout === '/login' || pathAfterLogout === '/';
          console.log('✅ Properly logged out:', isLoggedOut);
          
        } else {
          console.log('❌ Logout button not found in dropdown');
          
          // Try to find any logout text in dropdown
          const logoutText = await page.evaluate(() => {
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) {
              const elements = dropdown.querySelectorAll('*');
              for (let el of elements) {
                if (el.textContent.toLowerCase().includes('logout')) {
                  return {
                    tagName: el.tagName,
                    className: el.className,
                    text: el.textContent.trim(),
                    clickable: el.tagName === 'BUTTON' || el.tagName === 'A'
                  };
                }
              }
            }
            return null;
          });
          
          console.log('🔍 Logout text found:', logoutText);
          
          if (logoutText && logoutText.clickable) {
            console.log('✅ Found clickable logout element, clicking...');
            await page.evaluate(() => {
              const dropdown = document.querySelector('.profile-dropdown');
              if (dropdown) {
                const elements = dropdown.querySelectorAll('*');
                for (let el of elements) {
                  if (el.textContent.toLowerCase().includes('logout') && 
                      (el.tagName === 'BUTTON' || el.tagName === 'A')) {
                    el.click();
                    return;
                  }
                }
              }
            });
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            const pathAfterLogout = await page.evaluate(() => window.location.pathname);
            console.log('✅ After logout click, current path:', pathAfterLogout);
          }
        }
      } else {
        console.log('❌ Dropdown did not open or is not visible');
      }
      
    } else {
      console.log('❌ Profile button not found');
    }
    
    console.log('\n🎯 DEBUG SUMMARY:');
    console.log('==================');
    console.log('✅ Login: Working');
    console.log('🔍 Profile button found:', !!profileButton);
    console.log('🔍 Dropdown opened:', dropdownOpened.exists && dropdownOpened.visible);
    console.log('🔍 Logout functionality: Needs investigation');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugLogoutIssue();
