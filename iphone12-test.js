const { chromium } = require('playwright');

async function iPhone12Test() {
  console.log('📱 Testing iPhone 12 (390x844) only...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:3000/what-we-do');
    
    // Handle cookies if they appear
    try {
      const cookieButton = await page.locator('button:has-text("Accept")').first();
      if (await cookieButton.isVisible({ timeout: 2000 })) {
        await cookieButton.click();
        console.log('✅ Cookie consent accepted');
      }
    } catch (error) {
      console.log('ℹ️  No cookie banner found');
    }
    
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded successfully');
    
    // Take iPhone 12 screenshot only
    await page.screenshot({ 
      path: 'iphone12-mobile-view.png',
      fullPage: true 
    });
    console.log('📸 iPhone 12 screenshot saved: iphone12-mobile-view.png');
    
    // Quick analysis
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    const sections = await page.locator('h1').count() + 
                     await page.locator('text=Our Learning Strategy').count() +
                     await page.locator('text=The 4 Core Pillars of Unschooling').count() +
                     await page.locator('text=In Short').count() +
                     await page.locator('text=How We\'re Different').count();
    
    console.log(`📊 Analysis:`);
    console.log(`  ✅ Sections visible: ${sections}/5`);
    console.log(`  📏 Horizontal scroll: ${hasHorizontalScroll ? '❌ Present' : '✅ None'}`);
    console.log(`  📱 iPhone 12 viewport: 390x844`);
    
    console.log('\n🎉 iPhone 12 testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

iPhone12Test().catch(console.error);
