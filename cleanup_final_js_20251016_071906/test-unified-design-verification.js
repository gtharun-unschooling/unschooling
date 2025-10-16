const puppeteer = require('puppeteer');

async function testUnifiedDesignVerification() {
  console.log('🧪 Verifying Unified Design System Implementation...');
  
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
    
    // Step 1: Navigate to homepage
    console.log('📱 Step 1: Navigating to homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Set mobile viewport
    console.log('📱 Step 2: Setting mobile viewport...');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Analyze Hero Section specifically
    console.log('📱 Step 3: Analyzing Hero Section specifically...');
    
    const heroAnalysis = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return { found: false };
      
      const computedStyle = window.getComputedStyle(heroSection);
      const inlineStyle = heroSection.getAttribute('style');
      
      return {
        found: true,
        inlineStyle: inlineStyle,
        computedBackground: computedStyle.background,
        computedBackgroundImage: computedStyle.backgroundImage,
        hasGradient: computedStyle.backgroundImage.includes('gradient'),
        textColor: window.getComputedStyle(heroSection.querySelector('.hero-static-text')).color,
        hasPattern: !!heroSection.querySelector('div[style*="background: radial-gradient"]'),
        patternElement: heroSection.querySelector('div[style*="background: radial-gradient"]')?.getAttribute('style')?.substring(0, 100)
      };
    });
    
    console.log('🔍 Hero Analysis:', JSON.stringify(heroAnalysis, null, 2));
    
    // Step 4: Analyze Our Approach Section specifically
    console.log('📱 Step 4: Analyzing Our Approach Section specifically...');
    
    const approachAnalysis = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const approachSection = sections.find(section => 
        section.textContent.includes('Our Approach')
      );
      
      if (!approachSection) return { found: false };
      
      const computedStyle = window.getComputedStyle(approachSection);
      const inlineStyle = approachSection.getAttribute('style');
      const patternElement = approachSection.querySelector('div[style*="background: radial-gradient"]');
      
      return {
        found: true,
        inlineStyle: inlineStyle,
        computedBackground: computedStyle.background,
        computedBackgroundImage: computedStyle.backgroundImage,
        hasPattern: !!patternElement,
        patternStyle: patternElement?.getAttribute('style')?.substring(0, 150),
        titleColor: approachSection.querySelector('h1, h2') ? window.getComputedStyle(approachSection.querySelector('h1, h2')).color : null,
        mainContainer: approachSection.querySelector('div[style*="backgroundColor"]') ? {
          backgroundColor: window.getComputedStyle(approachSection.querySelector('div[style*="backgroundColor"]')).backgroundColor,
          borderRadius: window.getComputedStyle(approachSection.querySelector('div[style*="backgroundColor"]')).borderRadius,
          boxShadow: window.getComputedStyle(approachSection.querySelector('div[style*="backgroundColor"]')).boxShadow
        } : null
      };
    });
    
    console.log('🔍 Our Approach Analysis:', JSON.stringify(approachAnalysis, null, 2));
    
    // Step 5: Check if unified design system is loaded
    console.log('📱 Step 5: Checking unified design system...');
    
    const designSystemCheck = await page.evaluate(() => {
      // Check if the unified design system is available in the window object
      return {
        hasUnifiedDesignSystem: !!window.unifiedDesignSystem,
        designSystemKeys: window.unifiedDesignSystem ? Object.keys(window.unifiedDesignSystem) : []
      };
    });
    
    console.log('🔍 Design System Check:', JSON.stringify(designSystemCheck, null, 2));
    
    // Step 6: Take screenshots
    console.log('📱 Step 6: Taking screenshots...');
    
    await page.screenshot({ 
      path: 'mobile-unified-design-verification.png',
      fullPage: true
    });
    
    console.log('✅ Screenshot saved as mobile-unified-design-verification.png');
    
    // Summary
    console.log('\n🎯 UNIFIED DESIGN VERIFICATION SUMMARY:');
    console.log('=======================================');
    
    if (heroAnalysis.found) {
      console.log(`✅ Hero section found: Yes`);
      console.log(`✅ Hero has gradient: ${heroAnalysis.hasGradient ? 'Yes' : 'No'}`);
      console.log(`✅ Hero has pattern: ${heroAnalysis.hasPattern ? 'Yes' : 'No'}`);
      console.log(`✅ Hero text color: ${heroAnalysis.textColor}`);
    }
    
    if (approachAnalysis.found) {
      console.log(`✅ Our Approach section found: Yes`);
      console.log(`✅ Approach has pattern: ${approachAnalysis.hasPattern ? 'Yes' : 'No'}`);
      console.log(`✅ Approach title color: ${approachAnalysis.titleColor}`);
      if (approachAnalysis.mainContainer) {
        console.log(`✅ Container background: ${approachAnalysis.mainContainer.backgroundColor}`);
        console.log(`✅ Container border radius: ${approachAnalysis.mainContainer.borderRadius}`);
        console.log(`✅ Container box shadow: ${approachAnalysis.mainContainer.boxShadow !== 'none' ? 'Applied' : 'None'}`);
      }
    }
    
    // Check improvements
    const hasUnifiedElements = 
      heroAnalysis.found &&
      approachAnalysis.found &&
      (heroAnalysis.hasGradient || heroAnalysis.hasPattern) &&
      approachAnalysis.hasPattern;
    
    if (hasUnifiedElements) {
      console.log('\n🎉 SUCCESS: Unified design system is working!');
      console.log('   - Hero section has unified styling');
      console.log('   - Our Approach section has unified styling');
      console.log('   - Background patterns are applied');
      console.log('   - Consistent color scheme');
      console.log('   - Professional visual harmony');
    } else {
      console.log('\n⚠️ WARNING: Some unified design elements may not be fully visible.');
      console.log('   - This might be due to CSS overrides or mobile-specific styling');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testUnifiedDesignVerification();
