const puppeteer = require('puppeteer');

async function debugState() {
  console.log('🔍 Debugging State Issue...');
  
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
    
    // Add console log listener
    page.on('console', msg => {
      if (msg.text().includes('toggleProfileDropdown') || msg.text().includes('🔄')) {
        console.log('📝 Console:', msg.text());
      }
    });
    
    // Click profile button and check state
    const profileButton = await page.$('.profile-btn');
    if (profileButton) {
      console.log('✅ Profile button found, clicking...');
      
      // Check state before click
      const stateBefore = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          dropdownExists: dropdown !== null,
          dropdownVisible: dropdown && dropdown.offsetParent !== null
        };
      });
      console.log('🔍 State before click:', stateBefore);
      
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check state after click
      const stateAfter = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          dropdownExists: dropdown !== null,
          dropdownVisible: dropdown && dropdown.offsetParent !== null,
          allElements: document.querySelectorAll('*').length
        };
      });
      console.log('🔍 State after click:', stateAfter);
      
      // Try to manually trigger the dropdown
      const manualTrigger = await page.evaluate(() => {
        // Try to find the React component and trigger state change
        const profileContainer = document.querySelector('.profile-dropdown-container');
        if (profileContainer) {
          // Try to dispatch a click event on the container
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          profileContainer.dispatchEvent(event);
          return { success: true };
        }
        return { success: false };
      });
      
      console.log('🔍 Manual trigger result:', manualTrigger);
      
      // Wait and check again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const stateAfterManual = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          dropdownExists: dropdown !== null,
          dropdownVisible: dropdown && dropdown.offsetParent !== null
        };
      });
      console.log('🔍 State after manual trigger:', stateAfterManual);
      
    } else {
      console.log('❌ Profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugState();
