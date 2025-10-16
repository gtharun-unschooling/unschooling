const puppeteer = require('puppeteer');

async function testConsoleErrors() {
  console.log('🔍 Testing Console Errors and App Loading...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Listen to all console messages
    page.on('console', msg => {
      console.log(`🔍 Console [${msg.type()}]:`, msg.text());
    });
    
    // Listen to page errors
    page.on('pageerror', error => {
      console.log('🚨 Page Error:', error.message);
    });
    
    // Listen to request failures
    page.on('requestfailed', request => {
      console.log('🚨 Request Failed:', request.url(), request.failure().errorText);
    });
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 2: Check if React app loaded
    const appState = await page.evaluate(() => {
      return {
        title: document.title,
        currentPath: window.location.pathname,
        hasReactRoot: !!document.getElementById('root'),
        rootContent: document.getElementById('root')?.innerHTML?.substring(0, 200) || 'No root content',
        hasNavbar: !!document.querySelector('.navbar'),
        hasNavbarContainer: !!document.querySelector('.navbar-container'),
        allElements: Array.from(document.querySelectorAll('*')).map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          visible: el.offsetParent !== null
        })).filter(el => el.visible).slice(0, 10) // First 10 visible elements
      };
    });
    
    console.log('🔍 App State:', JSON.stringify(appState, null, 2));
    
    // Step 3: Try to trigger React rendering
    await page.evaluate(() => {
      console.log('🔍 Checking for React on window object...');
      console.log('React available:', typeof window.React !== 'undefined');
      console.log('ReactDOM available:', typeof window.ReactDOM !== 'undefined');
    });
    
    // Step 4: Wait a bit more and check again
    console.log('📱 Step 4: Waiting for React to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const finalState = await page.evaluate(() => {
      return {
        currentPath: window.location.pathname,
        hasNavbar: !!document.querySelector('.navbar'),
        navbarHTML: document.querySelector('.navbar')?.outerHTML?.substring(0, 500) || 'No navbar',
        allLinks: Array.from(document.querySelectorAll('a, button')).map(el => ({
          tagName: el.tagName,
          text: el.textContent.trim(),
          className: el.className,
          visible: el.offsetParent !== null
        })).filter(el => el.visible && el.text)
      };
    });
    
    console.log('🔍 Final State:', JSON.stringify(finalState, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testConsoleErrors();
