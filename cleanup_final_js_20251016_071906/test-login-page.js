const puppeteer = require('puppeteer');

async function testLoginPage() {
  console.log('🔍 Testing Login Page Elements...');
  
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
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check page content
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasEmailInput: !!document.querySelector('input[type="email"]'),
        hasPasswordInput: !!document.querySelector('input[type="password"]'),
        hasSubmitButton: !!document.querySelector('button[type="submit"]'),
        allInputs: Array.from(document.querySelectorAll('input')).map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          visible: input.offsetParent !== null
        })),
        allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
          type: btn.type,
          text: btn.textContent.trim(),
          className: btn.className,
          visible: btn.offsetParent !== null
        })),
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('🔍 Page Content Analysis:', JSON.stringify(pageContent, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testLoginPage();
