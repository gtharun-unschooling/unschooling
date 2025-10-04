const puppeteer = require('puppeteer');

async function testWhatWeDoHeroButton() {
  console.log('🧪 Testing What We Do Hero Button Enhancement...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Listen to console messages
    page.on('console', msg => {
      console.log('🔍 Console:', msg.text());
    });
    
    // Step 1: Navigate to What We Do page
    console.log('📱 Step 1: Navigating to What We Do page...');
    await page.goto('http://localhost:3000/what-we-do', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Find and analyze the hero section
    console.log('📱 Step 2: Analyzing hero section...');
    
    const heroSectionInfo = await page.evaluate(() => {
      const heroSection = document.querySelector('div[style*="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"]');
      if (!heroSection) return { found: false };
      
      const heroButton = heroSection.querySelector('a[href="/plans"]');
      const heroTitle = heroSection.querySelector('h1');
      const heroDescription = heroSection.querySelector('p');
      const floatingElements = heroSection.querySelectorAll('div[style*="position: absolute"]');
      const decorativeLine = heroSection.querySelector('div[style*="background: linear-gradient(90deg"]');
      
      return {
        found: true,
        heroButton: {
          exists: !!heroButton,
          text: heroButton ? heroButton.textContent.trim() : null,
          href: heroButton ? heroButton.href : null,
          styles: heroButton ? {
            background: window.getComputedStyle(heroButton).background,
            borderRadius: window.getComputedStyle(heroButton).borderRadius,
            fontSize: window.getComputedStyle(heroButton).fontSize,
            fontWeight: window.getComputedStyle(heroButton).fontWeight,
            textTransform: window.getComputedStyle(heroButton).textTransform,
            boxShadow: window.getComputedStyle(heroButton).boxShadow,
            border: window.getComputedStyle(heroButton).border
          } : null,
          dimensions: heroButton ? heroButton.getBoundingClientRect() : null
        },
        heroTitle: {
          text: heroTitle ? heroTitle.textContent.trim() : null,
          styles: heroTitle ? {
            fontSize: window.getComputedStyle(heroTitle).fontSize,
            fontWeight: window.getComputedStyle(heroTitle).fontWeight,
            textShadow: window.getComputedStyle(heroTitle).textShadow,
            letterSpacing: window.getComputedStyle(heroTitle).letterSpacing
          } : null
        },
        heroDescription: {
          text: heroDescription ? heroDescription.textContent.trim() : null,
          styles: heroDescription ? {
            fontSize: window.getComputedStyle(heroDescription).fontSize,
            fontWeight: window.getComputedStyle(heroDescription).fontWeight,
            textShadow: window.getComputedStyle(heroDescription).textShadow,
            lineHeight: window.getComputedStyle(heroDescription).lineHeight
          } : null
        },
        floatingElements: floatingElements.length,
        decorativeLine: {
          exists: !!decorativeLine,
          styles: decorativeLine ? {
            background: window.getComputedStyle(decorativeLine).background,
            width: window.getComputedStyle(decorativeLine).width,
            height: window.getComputedStyle(decorativeLine).height,
            borderRadius: window.getComputedStyle(decorativeLine).borderRadius,
            boxShadow: window.getComputedStyle(decorativeLine).boxShadow
          } : null
        }
      };
    });
    
    console.log('🔍 Hero Section Analysis:', JSON.stringify(heroSectionInfo, null, 2));
    
    if (heroSectionInfo.found) {
      // Step 3: Test button interactions
      console.log('📱 Step 3: Testing button interactions...');
      
      const buttonInteraction = await page.evaluate(() => {
        const heroButton = document.querySelector('a[href="/plans"]');
        if (!heroButton) return { found: false };
        
        // Get initial styles
        const initialStyles = {
          background: window.getComputedStyle(heroButton).background,
          transform: window.getComputedStyle(heroButton).transform,
          boxShadow: window.getComputedStyle(heroButton).boxShadow
        };
        
        return {
          found: true,
          initialStyles: initialStyles,
          hasHoverEffects: heroButton.onmouseenter !== null || heroButton.onmouseleave !== null
        };
      });
      
      console.log('🔍 Button Interaction:', JSON.stringify(buttonInteraction, null, 2));
      
      // Step 4: Test mobile responsiveness
      console.log('📱 Step 4: Testing mobile responsiveness...');
      await page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mobileHeroInfo = await page.evaluate(() => {
        const heroButton = document.querySelector('a[href="/plans"]');
        if (!heroButton) return { found: false };
        
        return {
          found: true,
          buttonDimensions: heroButton.getBoundingClientRect(),
          buttonText: heroButton.textContent.trim(),
          buttonStyles: {
            fontSize: window.getComputedStyle(heroButton).fontSize,
            padding: window.getComputedStyle(heroButton).padding,
            borderRadius: window.getComputedStyle(heroButton).borderRadius
          }
        };
      });
      
      console.log('🔍 Mobile Hero Info:', JSON.stringify(mobileHeroInfo, null, 2));
      
      // Step 5: Test desktop responsiveness
      console.log('📱 Step 5: Testing desktop responsiveness...');
      await page.setViewport({ width: 1200, height: 800 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const desktopHeroInfo = await page.evaluate(() => {
        const heroButton = document.querySelector('a[href="/plans"]');
        if (!heroButton) return { found: false };
        
        return {
          found: true,
          buttonDimensions: heroButton.getBoundingClientRect(),
          buttonText: heroButton.textContent.trim(),
          buttonStyles: {
            fontSize: window.getComputedStyle(heroButton).fontSize,
            padding: window.getComputedStyle(heroButton).padding,
            borderRadius: window.getComputedStyle(heroButton).borderRadius
          }
        };
      });
      
      console.log('🔍 Desktop Hero Info:', JSON.stringify(desktopHeroInfo, null, 2));
      
      // Step 6: Test button click functionality
      console.log('📱 Step 6: Testing button click functionality...');
      await page.setViewport({ width: 375, height: 667 }); // Back to mobile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Click the button and check if it navigates
      const initialUrl = page.url();
      await page.click('a[href="/plans"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const finalUrl = page.url();
      
      const navigationSuccess = finalUrl.includes('/plans');
      console.log(`🔍 Navigation test: ${initialUrl} → ${finalUrl}`);
      console.log(`🔍 Navigation successful: ${navigationSuccess ? 'Yes' : 'No'}`);
      
      // Summary
      console.log('\n🎯 WHAT WE DO HERO BUTTON SUMMARY:');
      console.log('===================================');
      console.log(`✅ Hero section found: Yes`);
      console.log(`✅ Enhanced button found: ${heroSectionInfo.heroButton.exists ? 'Yes' : 'No'}`);
      console.log(`✅ Button text: "${heroSectionInfo.heroButton.text}"`);
      console.log(`✅ Button styling enhanced: ${heroSectionInfo.heroButton.styles?.textTransform === 'uppercase' ? 'Yes' : 'No'}`);
      console.log(`✅ Decorative line added: ${heroSectionInfo.decorativeLine.exists ? 'Yes' : 'No'}`);
      console.log(`✅ Floating elements: ${heroSectionInfo.floatingElements} elements`);
      console.log(`✅ Mobile responsive: ${mobileHeroInfo.found ? 'Yes' : 'No'}`);
      console.log(`✅ Desktop responsive: ${desktopHeroInfo.found ? 'Yes' : 'No'}`);
      console.log(`✅ Navigation works: ${navigationSuccess ? 'Yes' : 'No'}`);
      
      // Check for enhancements
      const hasEnhancements = 
        heroSectionInfo.heroButton.text?.includes('🚀') &&
        heroSectionInfo.heroButton.styles?.textTransform === 'uppercase' &&
        heroSectionInfo.heroButton.styles?.borderRadius === '25px' &&
        heroSectionInfo.decorativeLine.exists &&
        heroSectionInfo.floatingElements > 0;
      
      if (hasEnhancements) {
        console.log('\n🎉 SUCCESS: Hero button has been enhanced!');
        console.log('   - New vibrant gradient colors');
        console.log('   - Enhanced typography with uppercase text');
        console.log('   - Added rocket emoji and "Start Your Journey" text');
        console.log('   - Rounded corners and enhanced shadows');
        console.log('   - Decorative line and floating elements');
        console.log('   - Improved overall vibe and feel');
      } else {
        console.log('\n⚠️ WARNING: Some enhancements may not be visible.');
      }
      
    } else {
      console.log('❌ Hero section not found');
    }
    
    // Step 7: Take screenshots
    console.log('📱 Step 7: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'what-we-do-hero-mobile.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'what-we-do-hero-desktop.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as what-we-do-hero-mobile.png and what-we-do-hero-desktop.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhatWeDoHeroButton();
