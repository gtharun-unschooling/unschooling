const puppeteer = require('puppeteer');

async function testButtonAnalysis() {
  console.log('🔍 Analyzing Profile Button Element...');
  
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
    
    // Analyze the profile button element
    const buttonAnalysis = await page.evaluate(() => {
      const btn = document.querySelector('.profile-btn');
      if (!btn) return { error: 'Button not found' };
      
      const rect = btn.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(btn);
      
      return {
        tagName: btn.tagName,
        className: btn.className,
        id: btn.id,
        textContent: btn.textContent,
        innerHTML: btn.innerHTML,
        outerHTML: btn.outerHTML.substring(0, 300) + '...',
        
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
          pointerEvents: computedStyle.pointerEvents,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex
        },
        
        // Event handlers
        hasOnClick: btn.onclick !== null,
        hasAddEventListener: typeof btn.addEventListener === 'function',
        
        // Parent elements
        parentElement: btn.parentElement ? btn.parentElement.className : 'No parent',
        parentParentElement: btn.parentElement?.parentElement ? btn.parentElement.parentElement.className : 'No grandparent'
      };
    });
    
    console.log('🔍 Button Analysis:', JSON.stringify(buttonAnalysis, null, 2));
    
    // Try different click methods
    console.log('📱 Step 2: Trying different click methods...');
    
    // Method 1: Regular click
    try {
      await page.click('.profile-btn');
      console.log('✅ Regular click successful');
    } catch (error) {
      console.log('❌ Regular click failed:', error.message);
    }
    
    // Method 2: Click with coordinates
    try {
      await page.click('.profile-btn', { position: { x: 50, y: 15 } });
      console.log('✅ Coordinate click successful');
    } catch (error) {
      console.log('❌ Coordinate click failed:', error.message);
    }
    
    // Method 3: JavaScript click
    try {
      await page.evaluate(() => {
        const btn = document.querySelector('.profile-btn');
        if (btn) {
          btn.click();
          console.log('🖱️ JavaScript click executed');
        }
      });
      console.log('✅ JavaScript click successful');
    } catch (error) {
      console.log('❌ JavaScript click failed:', error.message);
    }
    
    // Method 4: Dispatch click event
    try {
      await page.evaluate(() => {
        const btn = document.querySelector('.profile-btn');
        if (btn) {
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          btn.dispatchEvent(clickEvent);
          console.log('🖱️ Dispatch click event executed');
        }
      });
      console.log('✅ Dispatch click event successful');
    } catch (error) {
      console.log('❌ Dispatch click event failed:', error.message);
    }
    
    // Wait and check for dropdown
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dropdownCheck = await page.evaluate(() => {
      const dropdown = document.querySelector('.profile-dropdown');
      return {
        exists: !!dropdown,
        visible: dropdown && dropdown.offsetParent !== null,
        html: dropdown ? dropdown.outerHTML.substring(0, 200) + '...' : 'No dropdown'
      };
    });
    
    console.log('✅ Dropdown check after all click attempts:', dropdownCheck);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testButtonAnalysis();
