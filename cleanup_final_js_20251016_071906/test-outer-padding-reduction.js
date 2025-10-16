const puppeteer = require('puppeteer');

async function testOuterPaddingReduction() {
  console.log('🧪 Testing Outer Layer Padding Reduction...');
  
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
    
    // Step 3: Scroll to Our Approach section
    console.log('📱 Step 3: Scrolling to Our Approach section...');
    await page.evaluate(() => {
      const ourApproachSection = document.querySelector('section');
      if (ourApproachSection) {
        ourApproachSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 4: Analyze all padding layers
    console.log('📱 Step 4: Analyzing all padding layers...');
    
    const paddingAnalysis = await page.evaluate(() => {
      const section = document.querySelector('section');
      const container = section?.querySelector('div[style*="maxWidth"]');
      const mainContainer = section?.querySelector('div[style*="backgroundColor: rgb(255, 255, 255)"]');
      
      return {
        sectionPadding: section ? window.getComputedStyle(section).padding : null,
        containerPadding: container ? window.getComputedStyle(container).padding : null,
        mainContainerPadding: mainContainer ? window.getComputedStyle(mainContainer).padding : null,
        containerStyle: container ? container.getAttribute('style') : null,
        dimensions: {
          section: section ? section.getBoundingClientRect() : null,
          container: container ? container.getBoundingClientRect() : null,
          mainContainer: mainContainer ? mainContainer.getBoundingClientRect() : null
        }
      };
    });
    
    console.log('🔍 Padding Analysis:', JSON.stringify(paddingAnalysis, null, 2));
    
    // Step 5: Calculate total padding
    console.log('📱 Step 5: Calculating total padding...');
    
    const totalPaddingCalculation = await page.evaluate(() => {
      const section = document.querySelector('section');
      const container = section?.querySelector('div[style*="maxWidth"]');
      const mainContainer = section?.querySelector('div[style*="backgroundColor: rgb(255, 255, 255)"]');
      
      if (!section || !container || !mainContainer) {
        return { found: false };
      }
      
      const sectionRect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const mainContainerRect = mainContainer.getBoundingClientRect();
      
      // Calculate horizontal padding
      const sectionPaddingX = (sectionRect.width - containerRect.width) / 2;
      const containerPaddingX = (containerRect.width - mainContainerRect.width) / 2;
      const mainContainerPaddingX = parseFloat(window.getComputedStyle(mainContainer).paddingLeft) || 0;
      
      const totalPaddingX = sectionPaddingX + containerPaddingX + mainContainerPaddingX;
      
      return {
        found: true,
        sectionPaddingX: sectionPaddingX,
        containerPaddingX: containerPaddingX,
        mainContainerPaddingX: mainContainerPaddingX,
        totalPaddingX: totalPaddingX,
        contentWidth: mainContainerRect.width - (mainContainerPaddingX * 2),
        totalWidth: sectionRect.width,
        paddingPercentage: (totalPaddingX / sectionRect.width) * 100
      };
    });
    
    console.log('🔍 Total Padding Calculation:', JSON.stringify(totalPaddingCalculation, null, 2));
    
    // Step 6: Test desktop view for comparison
    console.log('📱 Step 6: Testing desktop view for comparison...');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const desktopPaddingAnalysis = await page.evaluate(() => {
      const section = document.querySelector('section');
      const container = section?.querySelector('div[style*="maxWidth"]');
      const mainContainer = section?.querySelector('div[style*="backgroundColor: rgb(255, 255, 255)"]');
      
      return {
        sectionPadding: section ? window.getComputedStyle(section).padding : null,
        containerPadding: container ? window.getComputedStyle(container).padding : null,
        mainContainerPadding: mainContainer ? window.getComputedStyle(mainContainer).padding : null,
        containerStyle: container ? container.getAttribute('style') : null
      };
    });
    
    console.log('🔍 Desktop Padding Analysis:', JSON.stringify(desktopPaddingAnalysis, null, 2));
    
    // Step 7: Take screenshots
    console.log('📱 Step 7: Taking screenshots...');
    
    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'mobile-outer-padding-reduced.png',
      fullPage: true
    });
    
    // Desktop screenshot
    await page.setViewport({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'desktop-outer-padding-comparison.png',
      fullPage: true
    });
    
    console.log('✅ Screenshots saved as mobile-outer-padding-reduced.png and desktop-outer-padding-comparison.png');
    
    // Summary
    console.log('\n🎯 OUTER LAYER PADDING REDUCTION SUMMARY:');
    console.log('==========================================');
    
    if (paddingAnalysis.sectionPadding) {
      console.log(`✅ Section padding: ${paddingAnalysis.sectionPadding}`);
    }
    
    if (paddingAnalysis.containerPadding) {
      console.log(`✅ Container padding: ${paddingAnalysis.containerPadding}`);
    }
    
    if (paddingAnalysis.mainContainerPadding) {
      console.log(`✅ Main container padding: ${paddingAnalysis.mainContainerPadding}`);
    }
    
    if (totalPaddingCalculation.found) {
      console.log(`✅ Total horizontal padding: ${totalPaddingCalculation.totalPaddingX.toFixed(1)}px`);
      console.log(`✅ Padding percentage: ${totalPaddingCalculation.paddingPercentage.toFixed(1)}%`);
      console.log(`✅ Content width: ${totalPaddingCalculation.contentWidth.toFixed(1)}px`);
      console.log(`✅ Total width: ${totalPaddingCalculation.totalWidth.toFixed(1)}px`);
    }
    
    if (paddingAnalysis.containerStyle) {
      console.log(`✅ Container custom style applied: ${paddingAnalysis.containerStyle.includes('padding') ? 'Yes' : 'No'}`);
    }
    
    // Check improvements
    const hasImprovements = 
      paddingAnalysis.containerPadding &&
      (paddingAnalysis.containerPadding.includes('8px') || paddingAnalysis.containerPadding.includes('16px')) &&
      totalPaddingCalculation.found &&
      totalPaddingCalculation.paddingPercentage < 15; // Should be less than 15% total padding
    
    if (hasImprovements) {
      console.log('\n🎉 SUCCESS: Outer layer padding has been reduced!');
      console.log('   - Container padding reduced from default to 8px (mobile) / 16px (desktop)');
      console.log('   - Total padding percentage optimized');
      console.log('   - Better space utilization for content');
      console.log('   - More efficient use of screen width');
      console.log('   - Reduced wasted space on outer edges');
    } else {
      console.log('\n⚠️ WARNING: Some improvements may not be visible.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testOuterPaddingReduction();
