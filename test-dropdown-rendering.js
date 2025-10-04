const puppeteer = require('puppeteer');

async function testDropdownRendering() {
  console.log('🔍 Testing Dropdown Rendering...');
  
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
    
    // Step 2: Force the dropdown state to true and check rendering
    console.log('📱 Step 2: Forcing dropdown state to true...');
    await page.evaluate(() => {
      // Find the React component instance and force state update
      const profileBtn = document.querySelector('.profile-btn');
      if (profileBtn) {
        // Try to trigger the click event
        profileBtn.click();
      }
    });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if dropdown exists in DOM
    const dropdownAnalysis = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      if (!dropdown) {
        return { error: 'Dropdown not found in DOM' };
      }
      
      const rect = dropdown.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(dropdown);
      
      return {
        exists: true,
        innerHTML: dropdown.innerHTML.substring(0, 300) + '...',
        outerHTML: dropdown.outerHTML.substring(0, 300) + '...',
        
        // Position and size
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        
        // CSS properties
        css: {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex,
          top: computedStyle.top,
          left: computedStyle.left,
          right: computedStyle.right
        },
        
        // Parent analysis
        parentElement: dropdown.parentElement ? dropdown.parentElement.className : 'No parent',
        parentRect: dropdown.parentElement ? dropdown.parentElement.getBoundingClientRect() : null
      };
    });
    
    console.log('🔍 Dropdown Analysis:', JSON.stringify(dropdownAnalysis, null, 2));
    
    // Step 3: Check all elements with profile-dropdown class
    const allDropdowns = await page.evaluate(() => {
      const dropdowns = document.querySelectorAll('.profile-dropdown');
      return Array.from(dropdowns).map((dropdown, index) => ({
        index,
        exists: true,
        visible: dropdown.offsetParent !== null,
        innerHTML: dropdown.innerHTML.substring(0, 100) + '...',
        computedStyle: {
          display: window.getComputedStyle(dropdown).display,
          visibility: window.getComputedStyle(dropdown).visibility,
          opacity: window.getComputedStyle(dropdown).opacity,
          position: window.getComputedStyle(dropdown).position
        }
      }));
    });
    
    console.log('🔍 All Dropdowns:', allDropdowns);
    
    // Step 4: Check the parent container
    const containerAnalysis = await page.evaluate(() => {
      const container = document.querySelector('.profile-dropdown-container');
      if (!container) return { error: 'Container not found' };
      
      const rect = container.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(container);
      
      return {
        exists: true,
        className: container.className,
        innerHTML: container.innerHTML.substring(0, 500) + '...',
        
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        
        css: {
          display: computedStyle.display,
          position: computedStyle.position,
          overflow: computedStyle.overflow
        }
      };
    });
    
    console.log('🔍 Container Analysis:', JSON.stringify(containerAnalysis, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDropdownRendering();
