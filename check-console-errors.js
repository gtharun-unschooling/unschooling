const puppeteer = require('puppeteer');

async function checkConsoleErrors() {
  console.log('🔍 Checking Console Errors...');
  
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
    
    // Listen to all console messages
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      
      if (type === 'error') {
        console.log('❌ CONSOLE ERROR:', text);
      } else if (text.includes('toggleProfileDropdown') || text.includes('🔄')) {
        console.log('📝 Console:', text);
      } else if (text.includes('Navbar') || text.includes('profile')) {
        console.log('📝 Console:', text);
      }
    });
    
    // Click profile button
    const profileButton = await page.$('.profile-btn');
    if (profileButton) {
      console.log('✅ Profile button found, clicking...');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Try to click again
      console.log('🔄 Clicking profile button again...');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dropdown exists
      const dropdownCheck = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          exists: dropdown !== null,
          visible: dropdown && dropdown.offsetParent !== null,
          className: dropdown ? dropdown.className : 'not found'
        };
      });
      
      console.log('🔍 Dropdown check:', dropdownCheck);
      
      // Try to force render the dropdown
      const forceRender = await page.evaluate(() => {
        // Try to find the React root and force re-render
        const root = document.getElementById('root');
        if (root) {
          // Dispatch a custom event to trigger re-render
          const event = new CustomEvent('forceUpdate');
          root.dispatchEvent(event);
          return { success: true };
        }
        return { success: false };
      });
      
      console.log('🔍 Force render result:', forceRender);
      
    } else {
      console.log('❌ Profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await browser.close();
  }
}

checkConsoleErrors();
