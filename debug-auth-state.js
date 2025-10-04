const puppeteer = require('puppeteer');

async function debugAuthState() {
  console.log('🔍 Debugging Authentication State...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Step 1: Navigate to login page
    console.log('📱 Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // Fill login form
    await page.type('input[type="email"]', 'gtharun04@gmail.com');
    await page.type('input[type="password"]', '8500424835');
    
    // Click login button
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check current path
    const currentPath = await page.evaluate(() => window.location.pathname);
    console.log('✅ After login, current path:', currentPath);
    
    // Check what elements are visible
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText,
        hasProfileBtn: !!document.querySelector('.profile-btn'),
        hasLoginBtn: !!document.querySelector('.nav-link.login-btn'),
        hasSignInBtn: Array.from(document.querySelectorAll('button')).some(btn => btn.textContent.includes('Sign In')),
        navbarHTML: document.querySelector('.navbar')?.innerHTML || 'No navbar found',
        allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent,
          classes: btn.className,
          visible: btn.offsetParent !== null
        }))
      };
    });
    
    console.log('\n🔍 PAGE CONTENT ANALYSIS:');
    console.log('========================');
    console.log('Title:', pageContent.title);
    console.log('Has Profile Button:', pageContent.hasProfileBtn);
    console.log('Has Login Button:', pageContent.hasLoginBtn);
    console.log('Has Sign In Button:', pageContent.hasSignInBtn);
    console.log('\nAll Buttons on Page:');
    pageContent.allButtons.forEach((btn, index) => {
      console.log(`  ${index + 1}. "${btn.text}" (classes: ${btn.classes}, visible: ${btn.visible})`);
    });
    
    console.log('\nNavbar HTML:');
    console.log(pageContent.navbarHTML);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugAuthState();
