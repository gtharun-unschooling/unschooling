const puppeteer = require('puppeteer');

async function testClickEvent() {
  console.log('🔍 Testing Click Event and State Changes...');
  
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
    
    // Check if profile button exists
    const profileButtonExists = await page.evaluate(() => {
      const btn = document.querySelector('.profile-btn');
      return {
        exists: !!btn,
        visible: btn && btn.offsetParent !== null,
        text: btn ? btn.textContent : 'No button',
        hasOnClick: btn ? btn.onclick !== null : false
      };
    });
    
    console.log('✅ Profile button check:', profileButtonExists);
    
    if (profileButtonExists.exists && profileButtonExists.visible) {
      // Add a click event listener to monitor clicks
      await page.evaluate(() => {
        const btn = document.querySelector('.profile-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            console.log('🖱️ Profile button clicked!');
          });
        }
      });
      
      // Step 2: Click profile button and monitor console
      console.log('📱 Step 2: Clicking profile button...');
      await page.click('.profile-btn');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if dropdown is visible
      const dropdownVisible = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          exists: !!dropdown,
          visible: dropdown && dropdown.offsetParent !== null,
          html: dropdown ? dropdown.outerHTML.substring(0, 200) + '...' : 'No dropdown'
        };
      });
      
      console.log('✅ Dropdown check:', dropdownVisible);
      
      // Try clicking again to see if it toggles
      console.log('📱 Step 3: Clicking profile button again...');
      await page.click('.profile-btn');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dropdownVisibleAfterSecondClick = await page.evaluate(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        return {
          exists: !!dropdown,
          visible: dropdown && dropdown.offsetParent !== null
        };
      });
      
      console.log('✅ Dropdown check after second click:', dropdownVisibleAfterSecondClick);
      
    } else {
      console.log('❌ Profile button not found or not visible');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testClickEvent();
