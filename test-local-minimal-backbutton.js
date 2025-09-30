const { chromium } = require('playwright');

async function testLocalMinimalBackButton() {
  console.log('🔍 Testing local server for MinimalBackButton...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test local version
    console.log('📋 Testing LOCAL version (localhost:3000)...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const localBackButton = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="back-button"]');
      return button ? 'EXISTS' : 'NOT FOUND';
    });
    
    console.log('🏠 LOCAL back button:', localBackButton);
    
    // Test a page that should have back button
    console.log('📋 Testing /plans page on LOCAL...');
    await page.goto('http://localhost:3000/plans', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const plansBackButton = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="back-button"]');
      return button ? 'EXISTS' : 'NOT FOUND';
    });
    
    console.log('💰 LOCAL PLANS page back button:', plansBackButton);
    
    // Check for any back button elements
    const allBackButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const backButtons = Array.from(buttons).filter(btn => 
        btn.textContent.includes('←') || 
        btn.textContent.includes('Back') ||
        btn.getAttribute('data-testid') === 'back-button'
      );
      return backButtons.map(btn => ({
        text: btn.textContent.trim(),
        testId: btn.getAttribute('data-testid'),
        className: btn.className
      }));
    });
    
    console.log('🔍 All back button elements found:', allBackButtons);
    
    // Take screenshot
    await page.screenshot({ path: 'local-plans-page-test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testLocalMinimalBackButton();
