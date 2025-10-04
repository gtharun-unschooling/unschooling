const puppeteer = require('puppeteer');

async function testWithDebug() {
  console.log('🧪 Testing with Debug Logs...');
  
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
    
    // Listen to console messages
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('🔄') || text.includes('toggleProfileDropdown')) {
        console.log('📝 Console:', text);
      }
    });
    
    // Click profile button
    const profileButton = await page.$('.profile-btn');
    if (profileButton) {
      console.log('✅ Profile button found, clicking...');
      await profileButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check dropdown
      const dropdownCheck = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          exists: dropdown !== null,
          visible: dropdown && dropdown.offsetParent !== null
        };
      });
      
      console.log('🔍 Dropdown check:', dropdownCheck);
      
    } else {
      console.log('❌ Profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWithDebug();
