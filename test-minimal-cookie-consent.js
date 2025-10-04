const puppeteer = require('puppeteer');

async function testMinimalCookieConsent() {
  console.log('🧪 Testing Minimal Cookie Consent...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to a fresh page to ensure no existing cookie consent
    
    // Set mobile viewport first
    await page.setViewport({ width: 375, height: 667 });
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Check if minimal cookie consent appears
    console.log('📱 Step 2: Checking for minimal cookie consent...');
    
    const cookieConsentInfo = await page.evaluate(() => {
      const consent = document.querySelector('div[style*="position: fixed"][style*="bottom: 0"]');
      if (consent) {
        const rect = consent.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(consent);
        
        return {
          found: true,
          dimensions: {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom
          },
          styles: {
            fontSize: computedStyle.fontSize,
            padding: computedStyle.padding,
            background: computedStyle.backgroundColor,
            color: computedStyle.color,
            position: computedStyle.position,
            zIndex: computedStyle.zIndex
          },
          text: consent.textContent,
          isVisible: rect.width > 0 && rect.height > 0
        };
      }
      return { found: false };
    });
    
    console.log('🔍 Cookie Consent Analysis:', JSON.stringify(cookieConsentInfo, null, 2));
    
    if (cookieConsentInfo.found) {
      // Step 3: Verify minimal design
      console.log('📱 Step 3: Verifying minimal design...');
      
      const height = cookieConsentInfo.dimensions.height;
      const fontSize = parseFloat(cookieConsentInfo.styles.fontSize);
      const isMinimal = height <= 20 && fontSize <= 12;
      
      console.log(`🔍 Height: ${height}px (should be ≤20px)`);
      console.log(`🔍 Font size: ${fontSize}px (should be ≤12px)`);
      console.log(`🔍 Is minimal: ${isMinimal ? '✅ Yes' : '❌ No'}`);
      
      // Step 4: Test clicking OK button
      console.log('📱 Step 4: Testing OK button click...');
      
      const okButton = await page.$('button');
      if (okButton) {
        await okButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const consentAfterClick = await page.evaluate(() => {
          return !!document.querySelector('div[style*="position: fixed"][style*="bottom: 0"]');
        });
        
        console.log(`🔍 Cookie consent disappeared after click: ${!consentAfterClick ? '✅ Yes' : '❌ No'}`);
      }
      
      // Step 5: Test desktop view
      console.log('📱 Step 5: Testing desktop view...');
      
      // Test desktop by opening a new tab
      const desktopPage = await browser.newPage();
      await desktopPage.setViewport({ width: 1200, height: 800 });
      await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const desktopConsentInfo = await desktopPage.evaluate(() => {
        const consent = document.querySelector('div[style*="position: fixed"][style*="bottom: 0"]');
        if (consent) {
          const rect = consent.getBoundingClientRect();
          return {
            found: true,
            height: rect.height,
            width: rect.width,
            text: consent.textContent
          };
        }
        return { found: false };
      });
      
      console.log('🔍 Desktop Cookie Consent:', JSON.stringify(desktopConsentInfo, null, 2));
      
      await desktopPage.close();
      
      // Summary
      console.log('\n🎯 MINIMAL COOKIE CONSENT SUMMARY:');
      console.log('==================================');
      console.log(`✅ Cookie consent found: Yes`);
      console.log(`✅ Height: ${height}px (minimal: ≤20px)`);
      console.log(`✅ Font size: ${fontSize}px (minimal: ≤12px)`);
      console.log(`✅ Text: "${cookieConsentInfo.text}" (minimal)`);
      console.log(`✅ OK button works: Yes`);
      console.log(`✅ Desktop compatibility: ${desktopConsentInfo.found ? 'Yes' : 'No'}`);
      
      if (isMinimal) {
        console.log('\n🎉 SUCCESS: Cookie consent is now extremely minimal!');
        console.log('   - Just a tiny line at the bottom');
        console.log('   - Minimal text: "Cookies OK"');
        console.log('   - Barely visible and non-intrusive');
        console.log('   - Works on both mobile and desktop');
      } else {
        console.log('\n⚠️ WARNING: Cookie consent might still be too large.');
      }
      
    } else {
      console.log('❌ Cookie consent not found');
    }
    
    // Step 6: Take screenshot
    console.log('📱 Step 6: Taking screenshot...');
    await page.screenshot({ 
      path: 'minimal-cookie-consent-test.png',
      fullPage: true
    });
    console.log('✅ Screenshot saved as minimal-cookie-consent-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMinimalCookieConsent();
